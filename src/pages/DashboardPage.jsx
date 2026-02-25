import React from 'react';
import { useMarketData } from '../hooks/useMarketData';
import StockCard from '../components/StockCard';
import IndexChartCard from '../components/IndexChartCard';
import ActionGuide from '../components/ActionGuide';
import { Loader2 } from 'lucide-react';

export default function DashboardPage({ tickers, title }) {
    const { data, loading, isSimulation } = useMarketData(tickers);
    const isHome = title.includes("Indices"); // Show guide on first page

    return (
        <div className="space-y-6 pb-20">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    {isSimulation && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Simulating</span>}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                    {new Date().toLocaleTimeString()}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tickers.map((t) => {
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
                                rsi20={tickData.rsi20}
                                history={tickData.history}
                                status={tickData.status}
                            />
                        );
                    }
                    // Else use Standard Stock Card
                    return (
                        <StockCard
                            key={t.ticker}
                            ticker={t.ticker}
                            name={t.name}
                            {...tickData}
                        />
                    );
                })}
            </div>
        </div>
    );
}
