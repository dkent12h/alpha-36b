import React, { useState, useEffect } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { Save, Plus, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

const USD_KRW = 1380; // Placeholder exchange rate

export default function PortfolioPage({ initialHoldings = [], type = 'KR' }) {
    const [holdings, setHoldings] = useState(() => {
        const saved = localStorage.getItem(`portfolio_${type}`);
        return saved ? JSON.parse(saved) : initialHoldings;
    });

    const { data, loading } = useMarketData(holdings);

    // For US Portfolio, allow adding new tickers
    const [newTicker, setNewTicker] = useState('');

    const addTicker = (e) => {
        e.preventDefault();
        if (!newTicker) return;
        setHoldings([...holdings, { ticker: newTicker.toUpperCase(), name: newTicker.toUpperCase(), qty: 0, avgPrice: 0 }]);
        setNewTicker('');
    };

    const updateHolding = (index, field, value) => {
        const newHoldings = [...holdings];
        newHoldings[index][field] = parseFloat(value) || 0;
        setHoldings(newHoldings);
        localStorage.setItem(`portfolio_${type}`, JSON.stringify(newHoldings));
    };

    const removeTicker = (index) => {
        const newHoldings = holdings.filter((_, i) => i !== index);
        setHoldings(newHoldings);
        localStorage.setItem(`portfolio_${type}`, JSON.stringify(newHoldings));
    };

    // Calculate Totals
    const totalInvested = holdings.reduce((sum, h) => {
        const cost = h.qty * (h.avgPrice || 0);
        return sum + (type === 'US' ? cost * USD_KRW : cost);
    }, 0);

    const currentValue = holdings.reduce((sum, h) => {
        const price = parseFloat(data[h.ticker]?.price || 0);
        const val = h.qty * price;
        return sum + (type === 'US' ? val * USD_KRW : val);
    }, 0);

    const totalPL = currentValue - totalInvested;
    const totalPLPercent = totalInvested ? (totalPL / totalInvested) * 100 : 0;

    // Liquidity Status Bar (Target 3.6B KRW)
    const TARGET_LIQUIDITY = 360000000; // 3.6B -> 3,600,000,000. Wait, 3억 6천 is 360,000,000.
    // Prompt: "3억 6천만 원 유동성". (360 Million KRW).
    // "3.6B" in title might mean "3.6 Billion" or "3.6 Billions in alpha"? 
    // Ah, the user title is "Alpha 3.6B", but prompt text says "3억 6천만 원 유동성".
    // 360,000,000 KRW.

    const liquidityProgress = Math.min((currentValue / TARGET_LIQUIDITY) * 100, 100);

    return (
        <div className="space-y-6 pb-20">
            <header className="mb-6">
                <h2 className="text-2xl font-bold">{type === 'KR' ? 'Domestic Portfolio' : 'Overseas Portfolio'}</h2>
                <div className="text-sm text-slate-400 mt-1">
                    Target: 3.6B KRW ({(liquidityProgress).toFixed(1)}%)
                </div>
                <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                        style={{ width: `${liquidityProgress}%` }}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase">Total Value (KRW)</div>
                    <div className="text-2xl font-bold text-slate-100">
                        ₩{currentValue.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase">Total P/L</div>
                    <div className={clsx("text-2xl font-bold", totalPL >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {totalPL >= 0 ? '+' : ''}₩{totalPL.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-xs uppercase">Return %</div>
                    <div className={clsx("text-2xl font-bold", totalPLPercent >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {totalPLPercent.toFixed(2)}%
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {holdings.map((h, idx) => {
                    const tickData = data[h.ticker] || {};
                    const currentPrice = parseFloat(tickData.price || 0);
                    const marketValue = h.qty * currentPrice * (type === 'US' ? USD_KRW : 1);
                    const avgCost = h.qty * h.avgPrice * (type === 'US' ? USD_KRW : 1);
                    const pl = marketValue - avgCost;
                    const plPercent = avgCost ? (pl / avgCost) * 100 : 0;

                    return (
                        <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-lg">{h.ticker}</span>
                                    <span className="text-xs text-slate-500">{h.name}</span>
                                </div>
                                <div className="text-sm mt-1 flex space-x-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500">Qty</span>
                                        <input
                                            type="number"
                                            value={h.qty}
                                            onChange={(e) => updateHolding(idx, 'qty', e.target.value)}
                                            className="bg-slate-800 border-none text-slate-200 text-sm rounded w-20 p-1 mt-1 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500">Avg Price ({type === 'US' ? '$' : '₩'})</span>
                                        <input
                                            type="number"
                                            value={h.avgPrice}
                                            onChange={(e) => updateHolding(idx, 'avgPrice', e.target.value)}
                                            className="bg-slate-800 border-none text-slate-200 text-sm rounded w-24 p-1 mt-1 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="text-right flex-1 md:w-auto w-full flex justify-between md:block items-center">
                                <div className="md:mb-1">
                                    <div className="text-sm text-slate-400">Current: {type === 'US' ? '$' : '₩'}{currentPrice.toLocaleString()}</div>
                                    <div className="font-bold text-lg">₩{marketValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                </div>
                                <div className={clsx("font-medium", pl >= 0 ? "text-emerald-400" : "text-rose-400")}>
                                    {pl >= 0 ? '+' : ''}{plPercent.toFixed(2)}%
                                    <div className="text-xs opacity-70">
                                        ({pl >= 0 ? '+' : ''}₩{pl.toLocaleString(undefined, { maximumFractionDigits: 0 })})
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-24 w-full flex justify-between md:flex-col md:items-end md:justify-center mt-2 md:mt-0 md:ml-4 text-xs">
                                <div className={clsx(
                                    "px-2 py-0.5 rounded font-mono font-bold w-fit",
                                    (tickData.rsi20 >= 70) ? "bg-rose-500/20 text-rose-400" :
                                        (tickData.rsi20 <= 30) ? "bg-emerald-500/20 text-emerald-400" :
                                            "bg-slate-700 text-slate-300"
                                )}>
                                    RSI {tickData.rsi20 || '--'}
                                </div>
                                <div className={clsx(
                                    "mt-1 font-medium",
                                    (parseFloat(tickData.price) < parseFloat(tickData.ma20)) ? "text-amber-400 animate-pulse" : "text-slate-500"
                                )}>
                                    {parseFloat(tickData.price) < parseFloat(tickData.ma20) ? '⚠ MA20' : 'Vol OK'}
                                </div>
                            </div>

                            {type === 'US' && (
                                <button onClick={() => removeTicker(idx)} className="ml-4 text-slate-600 hover:text-rose-500">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    );
                })}

                {type === 'US' && (
                    <form onSubmit={addTicker} className="flex gap-2 mt-4">
                        <input
                            type="text"
                            placeholder="Add Ticker (e.g. MSFT)"
                            value={newTicker}
                            onChange={(e) => setNewTicker(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 flex-1"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded">
                            <Plus size={20} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
