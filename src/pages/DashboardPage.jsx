import React, { useMemo, useState } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { getStrategyFeedback } from '../utils/strategy';
import StockCard from '../components/StockCard';
import IndexChartCard from '../components/IndexChartCard';
import ActionGuide from '../components/ActionGuide';
import VixGuideModal from '../components/VixGuideModal';
import { Loader2, Info } from 'lucide-react';

export default function DashboardPage({ tickers, title }) {
    const [timeRange, setTimeRange] = useState('48h');
    const { data, loading, isSimulation } = useMarketData(tickers, { timeRange });
    const isHome = title.includes("Indices"); // Show guide on first page
    const [isVixModalOpen, setIsVixModalOpen] = useState(false);

    const sortedTickers = useMemo(() => {
        if (isHome || loading) return tickers; // 인덱스는 순서 유지

        return [...tickers].sort((a, b) => {
            const dataA = data[a.ticker];
            const dataB = data[b.ticker];

            if (!dataA || !dataB) return 0;
            if (dataA.price === undefined || dataB.price === undefined) return 0;

            const feedA = getStrategyFeedback(dataA.price, dataA.ma20, dataA.rsi14, a.strategy).action;
            const feedB = getStrategyFeedback(dataB.price, dataB.ma20, dataB.rsi14, b.strategy).action;

            const getPriority = (action) => {
                if (action.includes('강력 매수')) return 1;
                if (action.includes('강력 매도')) return 2;
                if (action.includes('강력 손절')) return 3;
                if (action.includes('매수')) return 4;
                if (action.includes('매도') && !action.includes('매도 (초과열)')) return 5; // 강력 매도와 겹치지 않게
                if (action.includes('손절')) return 6;
                if (action.includes('관망') || action.includes('이탈')) return 7;
                if (action.includes('홀딩')) return 8;
                return 9; // 로딩 중 등 예외상황
            };

            return getPriority(feedA) - getPriority(feedB);
        });
    }, [tickers, data, loading, isHome]);

    return (
        <div className="space-y-6 pb-20 relative">
            <header className="mb-6 flex justify-between items-center">
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent mr-3">
                            {title}
                        </h2>
                        {isHome && (
                            <button
                                onClick={() => setIsVixModalOpen(true)}
                                className="inline-flex items-center text-xs bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 font-medium px-2.5 py-1.5 rounded-md border border-indigo-700/50 transition duration-200 shadow-sm"
                            >
                                <Info size={14} className="mr-1.5" />
                                VIX 매뉴얼
                            </button>
                        )}
                    </div>
                    {isSimulation && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 w-fit mt-1">Simulating</span>}
                </div>
                <div className="text-xs text-slate-500 font-mono text-right shrink-0">
                    {new Date().toLocaleTimeString()}
                </div>
            </header>

            {isHome && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {['48h', '24h', '12h', '6h', '1h'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap ${timeRange === range ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedTickers.map((t) => {
                    const tickData = data[t.ticker];

                    // Skeleton Loader for empty data
                    if (!tickData || tickData.price === undefined) {
                        return (
                            <div key={t.ticker} className="bg-slate-800 rounded-xl p-5 h-32 animate-pulse border border-slate-700 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="h-5 w-24 bg-slate-700 rounded mb-2"></div>
                                        <div className="h-3 w-16 bg-slate-700 rounded"></div>
                                    </div>
                                    <div className="h-6 w-20 bg-slate-700 rounded"></div>
                                </div>
                                <div className="h-8 w-full bg-slate-700/50 rounded mt-4"></div>
                            </div>
                        );
                    }

                    // If Home (Indices), use Chart Card
                    if (isHome) {
                        return (
                            <IndexChartCard
                                key={t.ticker}
                                ticker={t.ticker}
                                name={t.name}
                                price={tickData.price}
                                change={tickData.change}
                                changePercent={tickData.changePercent}
                                ma20={tickData.ma20}
                                rsi14={tickData.rsi14}
                                history={tickData.history}
                                status={tickData.status}
                                timeRange={timeRange}
                            />
                        );
                    }
                    // Else use Standard Stock Card
                    return (
                        <StockCard
                            key={t.ticker}
                            ticker={t.ticker}
                            name={t.name}
                            strategy={t.strategy}
                            {...tickData}
                        />
                    );
                })}
            </div>

            <VixGuideModal isOpen={isVixModalOpen} onClose={() => setIsVixModalOpen(false)} />
        </div>
    );
}
