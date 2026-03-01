import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { calculateSMA, calculateRSI } from '../utils/indicators';

// --------------------------------------------------------------------------
// CONSTANTS & CONFIG
// --------------------------------------------------------------------------
const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

// --------------------------------------------------------------------------
// GLOBAL CACHE
// --------------------------------------------------------------------------
const globalCache = {
    data: {},
    historyData: {},
    lastFetch: 0,
    isSimulation: false
};

// --------------------------------------------------------------------------
// HELPER: TIME CHECK (KST)
// --------------------------------------------------------------------------
const isRegularMarketTime = () => {
    // Current time in KST
    // Regular Market: 23:30 ~ 06:00 KST (approx)
    const now = new Date();
    const kstString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    const kstDate = new Date(kstString);

    const hours = kstDate.getHours();
    const minutes = kstDate.getMinutes();

    // Regular Market: 23:30 ~ 06:00
    if (hours === 23 && minutes >= 30) return true;
    if (hours >= 0 && hours < 6) return true;

    return false; // Extended Hours (Pre/Post) or Closed
};

// --------------------------------------------------------------------------
// MOCK DATA GENERATORS
// --------------------------------------------------------------------------
const generateMockHistory = (basePrice) => {
    const history = [basePrice];
    for (let i = 1; i < 30; i++) {
        const prev = history[i - 1];
        const change = prev * (Math.random() - 0.5) * 0.02;
        history.push(prev + change);
    }
    return history;
};

const getMockBasePrice = (ticker) => {
    const prices = {
        '005930.KS': 55000, 'NVDA': 130, 'AAPL': 185, 'MSFT': 410, 'GOOGL': 175, 'TSLA': 250,
        'AMD': 110, 'VOO': 540, 'QQQM': 210, 'SOXX': 240, 'TLT': 88, 'SGOV': 100.5,
        'SOXL': 64.03, 'TQQQ': 52.02, 'NVDL': 88.97, 'TSLL': 15.97
    };
    const base = prices[ticker] || 100;
    return base + (Math.random() - 0.5) * base * 0.05;
};

// --------------------------------------------------------------------------
// API: FMP BATCH FETCH
// --------------------------------------------------------------------------
const fetchFMPBatch = async (tickers) => {
    // Basic check for key, but also check if it's the placeholder default
    if (!FMP_API_KEY || FMP_API_KEY === 'YOUR_FMP_API_KEY') {
        // console.warn('FMP API Key missing. Skipping FMP fetch.');
        return null;
    }

    const symbolStr = tickers.map(t => t.ticker).join(',');
    const url = `${FMP_BASE_URL}/quote/${symbolStr}?apikey=${FMP_API_KEY}`;

    try {
        const res = await axios.get(url, { timeout: 5000 });
        if (res.data && Array.isArray(res.data)) {
            return res.data;
        }
    } catch (e) {
        console.error('FMP Batch Fetch Error:', e.message);
    }
    return null;
};

// --------------------------------------------------------------------------
// API: YAHOO / LOCAL PYTHON FETCH (Single Symbol)
// --------------------------------------------------------------------------
const fetchQuoteFromHTML = async (symbol) => {
    try {
        const url = `/api/yahoo-html/quote/${symbol}`;
        const res = await axios.get(url, { timeout: 3000 });
        const html = res.data;

        const postMatch = html.match(/"postMarketPrice":\{"raw":([0-9.]+)/);
        const preMatch = html.match(/"preMarketPrice":\{"raw":([0-9.]+)/);

        return {
            post: postMatch ? parseFloat(postMatch[1]) : null,
            pre: preMatch ? parseFloat(preMatch[1]) : null
        };
    } catch (e) {
        return null;
    }
};

const fetchYahooData = async (symbol) => {
    // 1. Try Local Python Server (yfinance)
    try {
        const pyUrl = `http://localhost:5000/quote/${symbol}`;
        const pyRes = await axios.get(pyUrl, { timeout: 2000 });
        const data = pyRes.data;

        return {
            symbol: symbol,
            price: data.price,
            prevClose: data.regularMarketPrice || data.prevClose,
            change: data.price - (data.regularMarketPrice || data.prevClose),
            changePercent: 0,
            marketState: data.marketState,
            source: 'PYTHON',
            history: []
        };
    } catch (e) { }

    // 2. Try Yahoo API Proxy
    try {
        const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
        const baseUrl = isProduction ? '/api/yahoo-chart' : '/api/yahoo/v8/finance/chart';
        // Construct URL
        const query = `?interval=1d&range=3mo&includePrePost=true`;
        let url;

        if (isProduction) {
            url = `${baseUrl}?symbol=${encodeURIComponent(symbol)}${query.replace('?', '&')}`;
        } else {
            url = `${baseUrl}/${symbol}${query}`;
        }

        const res = await axios.get(url, { timeout: 5000 });
        const result = res.data?.chart?.result?.[0];

        if (!result) throw new Error('No result');

        const meta = result.meta;
        const closes = result.indicators?.quote?.[0]?.close || [];
        const lastClose = closes[closes.length - 1];

        // HTML Scraping Fallback (US only)
        const isUSStock = !meta.symbol.includes('.KS') && !meta.symbol.includes('.KQ');
        if (isUSStock && !meta.postMarketPrice && !meta.preMarketPrice) {
            const scraped = await fetchQuoteFromHTML(symbol);
            if (scraped) {
                if (scraped.post) meta.postMarketPrice = scraped.post;
                if (scraped.pre) meta.preMarketPrice = scraped.pre;
            }
        }

        let activePrice = meta.regularMarketPrice || lastClose;
        let marketState = meta.marketState || 'REGULAR'; // Default to REGULAR if missing

        // Debug
        // console.log(`[Yahoo API - ${symbol}] State info:`, {
        //   marketState: meta.marketState,
        //   pre: meta.preMarketPrice,
        //   post: meta.postMarketPrice,
        //   regular: meta.regularMarketPrice
        // });

        if (isUSStock) {
            // Priority 1: Extracted explicit pre/post prices
            if (meta.preMarketPrice && meta.preMarketPrice > 0) {
                marketState = 'PRE';
                activePrice = meta.preMarketPrice;
            } else if (meta.postMarketPrice && meta.postMarketPrice > 0) {
                marketState = 'POST';
                activePrice = meta.postMarketPrice;
            }
            // Priority 2: Use Yahoo's market state if valid and matching regular hours logic
            else if (marketState === 'PRE' || marketState === 'POST') {
                // Keep the state, activePrice is already set to fallback if explicit prices are missing
            }
            // Priority 3: Time-based fallback for US off-hours 
            else if (!isRegularMarketTime() && marketState === 'REGULAR') {
                marketState = 'CLOSED';
            }
        } else {
            // For KR stocks, Yahoo often wrongly returns CLOSED during daytime
            // We can assume REGULAR or derive from time
            marketState = 'REGULAR';
        }

        const kstNow = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const kstHour = new Date(kstNow).getHours();

        if (isUSStock && (kstHour >= 7 && kstHour < 21)) {
            // US Night logic could be enforced here if no pre/post data
            // ONLY force CLOSED if we haven't already identified PRE or POST
            if (marketState !== 'PRE' && marketState !== 'POST') {
                marketState = 'CLOSED';
            }
        }

        let baseline = meta.regularMarketPreviousClose || meta.previousClose || meta.chartPreviousClose;
        if (closes.length >= 2) {
            // By default, baseline for calculating today's change is the previous day's close
            baseline = closes[closes.length - 2];
        }

        return {
            symbol: symbol,
            price: activePrice,
            prevClose: baseline,
            lastCompletedClose: closes[closes.length - 1], // Provide this for leverage card
            change: activePrice - baseline,
            changePercent: 0,
            marketState: marketState, // E.g., 'PRE', 'POST', 'REGULAR'
            history: closes.filter(c => c !== null),
            source: 'YAHOO_API'
        };

    } catch (err) {
        return null;
    }
};

// --------------------------------------------------------------------------
// HOOK
// --------------------------------------------------------------------------
export const useMarketData = (tickers) => {
    const [data, setData] = useState(() => globalCache.data || {});
    const [loading, setLoading] = useState(Object.keys(globalCache.data || {}).length === 0);
    const [isSimulationMode, setSimulationMode] = useState(false);

    const [intervalTime, setIntervalTime] = useState(30000);

    const isFetchingRef = useRef(false);

    // --------------------------------------------------------------------------
    // MAIN STRATEGY EXECUTION
    // --------------------------------------------------------------------------
    const executeStrategy = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        const isRegular = isRegularMarketTime();
        // Dynamic Interval: 30s (Regular) vs 3m 20s (Extended)
        const nextInterval = isRegular ? 30000 : 200000;
        if (intervalTime !== nextInterval) setIntervalTime(nextInterval);

        const newData = { ...globalCache.data };
        let hasChanges = false;
        let successCount = 0;

        try {
            // =========================================================================
            // PHASE 1: REGULAR HOURS -> YAHOO
            // =========================================================================
            if (isRegular) {
                const failedTickers = [];
                for (let i = 0; i < tickers.length; i += 10) {
                    const chunk = tickers.slice(i, i + 10);
                    const chunkResults = await Promise.all(chunk.map(t => fetchYahooData(t.ticker)));
                    let chunkHasChanges = false;

                    chunkResults.forEach((res, idx) => {
                        const ticker = chunk[idx].ticker;
                        if (res && res.price) {
                            if (updateCacheWithResult(ticker, res, newData)) {
                                hasChanges = true;
                                chunkHasChanges = true;
                            }
                            successCount++;
                        } else {
                            failedTickers.push(ticker);
                        }
                    });

                    // Progressive render: show what we have so far
                    if (chunkHasChanges) {
                        globalCache.data = newData;
                        setData({ ...newData });
                    }
                }

                // Fallback to FMP
                if (failedTickers.length > 0 && FMP_API_KEY && FMP_API_KEY !== 'YOUR_FMP_API_KEY') {
                    const fmpData = await fetchFMPBatch(tickers.filter(t => failedTickers.includes(t.ticker)));
                    if (fmpData) {
                        let fmpChunkChanges = false;
                        fmpData.forEach(item => {
                            if (updateCacheWithFMP(item, newData)) {
                                hasChanges = true;
                                fmpChunkChanges = true;
                            }
                            successCount++;
                        });
                        if (fmpChunkChanges) {
                            globalCache.data = newData;
                            setData({ ...newData });
                        }
                    }
                }
            }

            // =========================================================================
            // PHASE 2: EXTENDED HOURS -> FMP BATCH
            // =========================================================================
            else {
                let fmpSuccess = false;
                if (FMP_API_KEY && FMP_API_KEY !== 'YOUR_FMP_API_KEY') {
                    const fmpData = await fetchFMPBatch(tickers);
                    if (fmpData && fmpData.length > 0) {
                        let fmpChunkChanges = false;
                        fmpData.forEach(item => {
                            if (updateCacheWithFMP(item, newData)) {
                                hasChanges = true;
                                fmpChunkChanges = true;
                            }
                            successCount++;
                        });
                        if (fmpChunkChanges) {
                            globalCache.data = newData;
                            setData({ ...newData });
                        }
                        fmpSuccess = true;
                    }
                }

                if (!fmpSuccess) {
                    for (let i = 0; i < tickers.length; i += 10) {
                        const chunk = tickers.slice(i, i + 10);
                        const chunkResults = await Promise.all(chunk.map(t => fetchYahooData(t.ticker)));
                        let chunkHasChanges = false;

                        chunkResults.forEach((res, idx) => {
                            const ticker = chunk[idx].ticker;
                            if (res && res.price) {
                                if (updateCacheWithResult(ticker, res, newData)) {
                                    hasChanges = true;
                                    chunkHasChanges = true;
                                }
                                successCount++;
                            }
                        });

                        // Progressive render
                        if (chunkHasChanges) {
                            globalCache.data = newData;
                            setData({ ...newData });
                        }
                    }
                }
            }

            // =========================================================================
            // PHASE 3: SIMULATION FALLBACK
            // =========================================================================
            if (successCount === 0) {
                // If APIs are blocked or failing, simulate the requested tickers
                runSimulation(tickers, newData);
                setSimulationMode(true);
                hasChanges = true; // Sim always changes
            } else {
                setSimulationMode(false);
            }

            // ONLY UPDATE STATE IF DATA CHANGED
            if (hasChanges) {
                globalCache.data = newData;
                globalCache.lastFetch = Date.now();
                setData(newData);
            }

        } catch (error) {
            console.error('ExecuteStrategy Error:', error);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [tickers, intervalTime]);

    // Update Helpers - Return TRUE if changed
    const updateCacheWithResult = (ticker, result, cache) => {
        let ma20 = null, rsi14 = null;
        if (result.history && result.history.length >= 20) {
            globalCache.historyData[ticker] = result.history;
            ma20 = calculateSMA(result.history, 20);
            rsi14 = calculateRSI(result.history, 14);
        } else if (globalCache.historyData[ticker]) {
            const hist = globalCache.historyData[ticker];
            ma20 = calculateSMA(hist, 20);
            rsi14 = calculateRSI(hist, 14);
        }

        const baseline = result.prevClose || result.price;
        const change = result.price - baseline;
        const changePercent = baseline ? (change / baseline) * 100 : 0;

        const priceDisplay = typeof result.price === 'number' ? result.price.toFixed(2) : result.price;
        const status = result.marketState === 'REGULAR' ? 'LIVE' : (result.marketState || 'EXTENDED');

        // OPTIMIZATION: Check if changed
        const old = globalCache.data[ticker];
        if (old &&
            old.price === priceDisplay &&
            old.status === status &&
            old.prevClose === baseline.toFixed(2)) {

            // Fix: Ensure history isn't lost from older cache items that didn't have it
            if (!old.history || old.history.length === 0) {
                old.history = result.history || [];
            }

            // Allow minimal noise updates (like timestamp) to be skipped
            cache[ticker] = old;
            return false;
        }

        cache[ticker] = {
            price: priceDisplay,
            change: change.toFixed(2),
            changePercent: changePercent.toFixed(2),
            prevClose: baseline.toFixed(2),
            lastCompletedClose: result.lastCompletedClose || baseline.toFixed(2),
            ma20: ma20 ? ma20.toFixed(2) : '---',
            rsi14: rsi14 ? Math.round(rsi14) : '--',
            status: status,
            timestamp: new Date().toISOString(),
            source: result.source,
            history: result.history || []
        };
        return true;
    };

    const updateCacheWithFMP = (item, cache) => {
        const ticker = item.symbol;
        const price = item.price;
        const prevClose = item.previousClose;
        const change = item.change;
        const changePercent = item.changesPercentage;

        let ma20 = null, rsi14 = null;
        if (globalCache.historyData[ticker]) {
            const hist = globalCache.historyData[ticker];
            ma20 = calculateSMA(hist, 20);
            rsi14 = calculateRSI(hist, 14);
        }

        const priceDisplay = price.toFixed(2);

        const old = globalCache.data[ticker];
        if (old && old.price === priceDisplay && old.source === 'FMP') {
            cache[ticker] = old;
            return false;
        }

        cache[ticker] = {
            price: priceDisplay,
            change: change.toFixed(2),
            changePercent: changePercent.toFixed(2),
            prevClose: prevClose.toFixed(2),
            ma20: ma20 ? ma20.toFixed(2) : '---',
            rsi14: rsi14 ? Math.round(rsi14) : '--',
            status: 'FMP_LIVE',
            timestamp: new Date().toISOString(),
            source: 'FMP'
        };
        return true;
    };

    const runSimulation = (tickerList, cache) => {
        tickerList.forEach(t => {
            if (!globalCache.historyData[t.ticker]) {
                globalCache.historyData[t.ticker] = generateMockHistory(getMockBasePrice(t.ticker));
            }
            const hist = globalCache.historyData[t.ticker];
            const lastPrice = hist[hist.length - 1];
            const change = lastPrice * (Math.random() - 0.5) * 0.005;
            const newPrice = lastPrice + change;

            const newHist = [...hist.slice(1), newPrice];
            globalCache.historyData[t.ticker] = newHist;

            const sessionStart = getMockBasePrice(t.ticker);
            const priceChange = newPrice - sessionStart;

            const ma20 = calculateSMA(newHist, 20);
            const rsi14 = calculateRSI(newHist, 14);

            cache[t.ticker] = {
                price: newPrice.toFixed(2),
                change: priceChange.toFixed(2),
                changePercent: ((priceChange / sessionStart) * 100).toFixed(2),
                prevClose: sessionStart.toFixed(2),
                ma20: ma20 ? ma20.toFixed(2) : '---',
                rsi14: rsi14 ? Math.round(rsi14) : '--',
                status: 'SIM',
                timestamp: new Date().toISOString(),
                source: 'SIMULATION',
                history: newHist
            };
        });
    };

    // --------------------------------------------------------------------------
    // EFFECTS
    // --------------------------------------------------------------------------
    useEffect(() => {
        executeStrategy();

        const id = setInterval(executeStrategy, intervalTime);
        return () => clearInterval(id);
    }, [tickers, intervalTime, executeStrategy]);

    const filteredData = {};
    tickers.forEach(t => {
        if (data[t.ticker]) filteredData[t.ticker] = data[t.ticker];
    });

    return {
        data: filteredData,
        loading,
        isSimulation: isSimulationMode,
        refresh: executeStrategy
    };
};
