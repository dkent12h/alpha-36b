import React from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { MARKETS } from '../constants';
import { getStrategyFeedback } from '../utils/strategy';
import { CheckCircle, AlertTriangle, TrendingUp, DollarSign, Info } from 'lucide-react';

export default function ActionGuide() {
    // Monitor all relevant tickers
    const allTickers = [
        ...MARKETS.BLUE_CHIP,
        ...MARKETS.GROWTH,
        ...MARKETS.SECTORS,
        ...MARKETS.ISA,
        ...MARKETS.KOREA
    ];

    const { data, loading } = useMarketData(allTickers);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p>전체 시장 데이터를 분석 중입니다... (10~20초 소요 가능)</p>
            </div>
        );
    }

    // Analyze Portfolio
    const strongBuys = [];
    const buys = [];
    const strongSells = [];
    const sells = [];
    const stopLosses = [];

    Object.keys(data).forEach(ticker => {
        const item = data[ticker];
        // Find metadata (strategy type)
        const info = allTickers.find(t => t.ticker === ticker);
        if (!info) return;

        const feedback = getStrategyFeedback(item.price, item.ma20, item.rsi14, info.strategy);

        if (feedback.action.includes('강력 매수')) {
            strongBuys.push({ name: info.name, ...feedback });
        } else if (feedback.type === 'BUY') {
            buys.push({ name: info.name, ...feedback });
        } else if (feedback.action.includes('강력 매도')) {
            strongSells.push({ name: info.name, ...feedback });
        } else if (feedback.action.includes('손절')) {
            stopLosses.push({ name: info.name, ...feedback });
        } else if (feedback.type === 'SELL') {
            sells.push({ name: info.name, ...feedback });
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
                {/* 🚨 Strong Stop Loss */}
                {stopLosses.length > 0 && (
                    <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <h3 className="text-rose-400 font-bold text-sm mb-2 flex items-center">
                            <AlertTriangle size={16} className="mr-1.5 text-rose-500 animate-bounce" />
                            긴급: 손절 (위험 회피)
                        </h3>
                        <ul className="space-y-2">
                            {stopLosses.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="text-sm text-slate-300">
                                    <span className="font-bold text-white">{item.name}</span>: <span className="text-rose-400 font-bold">{item.action}</span>
                                    <span className="text-xs text-rose-300/80 ml-2">({item.reason})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 🔥 Strong Sell Signals */}
                {strongSells.length > 0 && (
                    <div className="bg-rose-900/30 border border-rose-500/40 rounded-lg p-4 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                        <h3 className="text-orange-400 font-bold text-sm mb-2 flex items-center">
                            <AlertTriangle size={16} className="mr-1.5" />
                            긴급: 강력 매도 (초과열)
                        </h3>
                        <ul className="space-y-2">
                            {strongSells.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="text-sm text-slate-300">
                                    <span className="font-bold text-white">{item.name}</span>: <span className="text-orange-400 font-bold">{item.action}</span>
                                    <span className="text-xs text-orange-300/80 ml-2">({item.reason})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 🚀 Strong Buy Signals */}
                {strongBuys.length > 0 && (
                    <div className="bg-purple-900/30 border border-purple-500/40 rounded-lg p-4 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                        <h3 className="text-purple-400 font-bold text-sm mb-2 flex items-center">
                            <CheckCircle size={16} className="mr-1.5" />
                            적극 매수 (강력 매수 타점)
                        </h3>
                        <ul className="space-y-2">
                            {strongBuys.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="text-sm text-slate-300">
                                    <span className="font-bold text-white">{item.name}</span>: <span className="text-purple-400 font-bold">{item.action}</span>
                                    <span className="text-xs text-purple-300/80 ml-2">({item.reason})</span>
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
                            매도/비중 축소 (Harvest)
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
            </div>

            {/* 신호 분석 요약 (Tip) */}
            <div className="mt-4 bg-slate-800/60 p-4 border-l-4 border-blue-500 rounded-lg shadow-sm">
                <h4 className="text-blue-400 font-bold mb-3 text-sm flex items-center">
                    <Info size={16} className="mr-1.5" />
                    💡 매수 신호별 실행 전략 (생존 헌법 연계)
                </h4>
                <div className="space-y-4 text-xs text-slate-300">
                    <div className="bg-slate-900/40 p-2.5 rounded border border-slate-700/50">
                        <div className="font-bold flex items-center mb-1">
                            <span className="text-white text-sm mr-1">🚀 매수 (돌파)</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                            <li><span className="text-slate-300">[의미]</span> 성장주가 상승 추세를 타고 추세를 강화하는 시점 (RSI 60~70).</li>
                            <li><span className="text-blue-300 font-medium">[전략]</span> 추세 확인 후 확실한 <strong className="text-blue-400">"3차 완성 (40%) 불타기"</strong> 비중 확대 타점으로 활용.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/40 p-2.5 rounded border border-slate-700/50">
                        <div className="font-bold flex items-center mb-1">
                            <span className="text-white text-sm mr-1">🛡️ 매수 (지지)</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                            <li><span className="text-slate-300">[의미]</span> 과열을 식히며 성장주가 20일선에서 방어(지지)되는 첫 반등 위치.</li>
                            <li><span className="text-emerald-300 font-medium">[전략]</span> 눌렸을 때 사는 <strong className="text-emerald-400">"2차 추매 (-5% 조정 시 30%)"</strong> 진입 타점으로 최적.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/40 p-2.5 rounded border border-slate-700/50">
                        <div className="font-bold flex items-center mb-1">
                            <span className="text-white text-sm mr-1">🛒 매수 (눌림목)</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                            <li><span className="text-slate-300">[의미]</span> 우량주/배당주 등 안정성 높은 종목들이 20일선 근접 시 할인된 가격.</li>
                            <li><span className="text-indigo-300 font-medium">[전략]</span> 신규 종목의 <strong className="text-indigo-400">"1차 진입 (정찰병 30%)"</strong> 혹은 차분한 모아가기 전략 수행.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 생존 헌법 원칙 */}
            <div className="mt-8 bg-slate-800/80 rounded-lg p-5 border border-slate-700 shadow-md">
                <h3 className="text-white font-bold mb-4 border-b border-slate-600 pb-2 text-base">
                    📜 생존 헌법 (기계적 대응 원칙)
                </h3>

                <div className="space-y-5 text-sm">
                    {/* 매수 타점 */}
                    <div>
                        <h4 className="font-bold text-blue-400 mb-2">[매수 타점: 3분할 전략]</h4>
                        <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                            <li><span className="font-bold text-white">1차 진입 (30%):</span> 현재가 부근 (즉시 정찰병 투입)</li>
                            <li><span className="font-bold text-white">2차 추매 (30%):</span> 약 -5% 조정 시</li>
                            <li><span className="font-bold text-white">3차 완성 (40%):</span> 상승 추세 확인 후 '불타기'</li>
                        </ol>
                    </div>

                    {/* 손절 */}
                    <div>
                        <h4 className="font-bold text-rose-400 mb-2">['7% / 10% 손절' 원칙 적용 (기계적 대응)]</h4>
                        <div className="bg-slate-900/50 rounded-lg p-3 text-xs md:text-sm border border-slate-700/50">
                            <div className="grid grid-cols-3 gap-2 font-bold text-slate-400 mb-2 border-b border-slate-700 pb-2">
                                <div>단계</div>
                                <div>발동 조건 (평단가 대비)</div>
                                <div>실행 Action</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 py-1.5">
                                <div className="text-white font-bold">1단계 손절</div>
                                <div className="text-rose-400 font-bold">-7%</div>
                                <div className="text-slate-300">보유 수량의 50% 매도</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-t border-slate-700/50 py-1.5">
                                <div className="text-white font-bold">최종 손절</div>
                                <div className="text-rose-500 font-bold">-10%</div>
                                <div className="text-slate-300">잔여 물량 전량 매도</div>
                            </div>
                        </div>
                    </div>

                    {/* 익절 */}
                    <div>
                        <h4 className="font-bold text-emerald-400 mb-2">[익절(수익 실현) 가이드]</h4>
                        <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                            <li><span className="font-bold text-emerald-400">1차 익절 (+20%):</span> 50% 매도하여 원금 확보.</li>
                            <li><span className="font-bold text-emerald-400">2차 익절 (+40%):</span> 나머지 물량으로 수익 극대화 또는 추세 붕괴 시 전량 매도.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 실전 매수 시나리오 */}
            <div className="mt-4 bg-slate-900 border border-slate-700 p-4 rounded-lg">
                <h4 className="text-blue-400 font-bold mb-3 text-sm flex items-center">
                    💡 실전 매수 시나리오 가이드
                </h4>
                <div className="space-y-4 text-sm text-slate-300">
                    <div>
                        <div className="font-bold text-white mb-1">1. 처음 사는 종목일 때 (1차 진입 - 정찰병)</div>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li>관심 있던 종목이 <span className="font-bold text-emerald-400">'매수 (눌림목)'</span> 혹은 <span className="font-bold text-emerald-400">'매수 (지지)'</span> 신호를 띄우면, 계획한 물량의 30%만 먼저 매수합니다.</li>
                            <li>이때 <span className="font-bold text-blue-400">'매수 (돌파)'</span>에 처음 들어가는 건 이미 많이 오른 상태일 수 있어 위험할 수 있습니다.</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-bold text-white mb-1">2. 샀는데 가격이 떨어질 때 (2차 추매)</div>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li>1차 매수 후 예상했던 -5% 부근 조정이 왔을 때, 시스템에 <span className="font-bold text-emerald-400">'매수 (지지)'</span>가 뜨면 "바닥을 다지고 있다"고 안심하며 2차 추매(30%)를 실행합니다.</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-bold text-white mb-1">3. 샀는데 가격이 오를 때 (3차 완성 - 불타기)</div>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li>주가가 올라 내 평단가보다 수익권이 되었을 때, 화면에 <span className="font-bold text-blue-400">'매수 (돌파)'</span> 신호가 뜬다면?</li>
                            <li>"상승 추세를 탔다!"고 확신을 갖고 비워두었던 <strong className="text-white">마지막 40% 물량을 태워 불타기(3차 완성)</strong>를 합니다.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-xs text-slate-500 italic mt-4 mb-1 text-center font-semibold border-t border-slate-700 pt-3">
                Tip: 지정가 주문 원칙을 잊지 마세요. 급할수록 돌아가야 합니다.
            </div>
        </div >
    );
}
