import React from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { MARKETS } from '../constants';
import { getStrategyFeedback } from '../utils/strategy';
import { CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export default function ActionGuide() {
    // Monitor all relevant tickers
    const allTickers = [
        ...MARKETS.BLUE_CHIP,
        ...MARKETS.GROWTH,
        ...MARKETS.SECTORS,
        ...MARKETS.ISA
    ];

    const { data, loading } = useMarketData(allTickers);

    if (loading) return null;

    // Analyze Portfolio
    const sells = [];
    const buys = [];
    let cashWeightStatus = "CHECK"; // OK, LOW, HIGH

    Object.keys(data).forEach(ticker => {
        const item = data[ticker];
        // Find metadata (strategy type)
        const info = allTickers.find(t => t.ticker === ticker);
        if (!info) return;

        const feedback = getStrategyFeedback(item.price, item.ma20, item.rsi20, info.strategy);

        if (feedback.type === 'SELL') {
            sells.push({ name: info.name, ...feedback });
        } else if (feedback.type === 'BUY') {
            buys.push({ name: info.name, ...feedback });
        }
    });

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 mb-8 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-2">🚀</span>
                오늘의 실행 가이드 (Action Plan)
            </h2>

            <div className="flex flex-col gap-4">
                {/* 1. Cash Check */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="text-blue-400 font-bold text-sm mb-2 flex items-center">
                        <DollarSign size={16} className="mr-1.5" />
                        자산 배분 체크
                    </h3>
                    <p className="text-sm text-slate-300">
                        현재 <span className="text-white font-bold">현금 비중(SGOV)</span>이 20~30%를 유지하고 있나요?
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        * 시장 변동성에 대비해 현금 탄환을 항상 준비하세요.
                    </p>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {/* Buy Signals */}
                {buys.length > 0 && (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                        <h3 className="text-emerald-400 font-bold text-sm mb-2 flex items-center">
                            <CheckCircle size={16} className="mr-1.5" />
                            ✅ 매수 기회 (Buy Signals)
                        </h3>
                        <ul className="space-y-2">
                            {buys.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="text-sm text-slate-300">
                                    <span className="font-bold text-white">{item.name}</span>: {item.action}
                                    <span className="text-xs text-emerald-400 ml-2">({item.reason})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Sell Signals */}
                {sells.length > 0 && (
                    <div className="bg-rose-900/20 border border-rose-500/30 rounded-lg p-4">
                        <h3 className="text-red-400 font-bold text-sm mb-2 flex items-center">
                            <AlertTriangle size={16} className="mr-1.5" />
                            🚨 매도/비중 축소 (Harvest)
                        </h3>
                        <ul className="space-y-2">
                            {sells.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="text-sm text-slate-300">
                                    <span className="font-bold text-white">{item.name}</span>: {item.action}
                                    <span className="text-xs text-red-400 ml-2">({item.reason})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="text-xs text-slate-500 italic mt-3 border-t border-slate-700 pt-2 text-center">
                Tip: 지정가 주문 원칙을 잊지 마세요. 급할수록 돌아가야 합니다.
            </div>
        </div>
    );
}
