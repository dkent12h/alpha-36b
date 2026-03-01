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
                    💡 매수 신호별 의미와 1차 진입 전략 (생존 헌법 연계)
                </h4>
                <div className="space-y-4 text-xs text-slate-300">
                    <div className="bg-slate-900/40 p-2.5 rounded border border-slate-700/50">
                        <div className="font-bold flex items-center mb-1">
                            <span className="text-white text-sm mr-1">🛡️ 매수 (지지) & 🛒 매수 (눌림목)</span>
                        </div>
                        <p className="text-emerald-400 mb-2 font-bold text-[13px] border-b border-emerald-900 pb-1">👉 최적의 1차 진입 (정찰병 투입) 타점</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                            <li><span className="text-slate-300">"주가가 잠시 쉬어가며 20일선 근처로 내려와 가격이 싸진 상태(세일 기간)"</span>를 뜻합니다. 단지 대상이 다를 뿐입니다.</li>
                            <li><strong className="text-indigo-400">매수 (눌림목):</strong> 애플, SCHD 등 <strong className="text-white">안전한 우량주/배당주</strong>가 세일할 때.</li>
                            <li><strong className="text-emerald-400">매수 (지지):</strong> 테슬라, 엔비디아 등 <strong className="text-white">변동성 큰 성장주(알파)</strong>가 세일할 때.</li>
                            <li><span className="text-blue-300 font-medium">[전략]</span> 아직 보유하지 않은 종목이라면, <strong className="text-white">이 두 신호가 떴을 때가 리스크가 가장 적은 완벽한 1차 진입(30%) 타이밍</strong>입니다. (이미 들고 있는데 또 떴다면, 가격이 더 싸진 것이니 2차 추매 전략)</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/40 p-2.5 rounded border border-slate-700/50">
                        <div className="font-bold flex items-center mb-1">
                            <span className="text-white text-sm mr-1">🚀 매수 (돌파)</span>
                        </div>
                        <p className="text-rose-400 mb-2 font-bold text-[13px] border-b border-rose-900 pb-1">👉 1차 진입을 피해야 하는 (고점 추격) 타점</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                            <li><span className="text-slate-300">이미 주가가 크게 올라서 시장의 뜨거운 관심을 받고 있을 때(RSI 60~70) 뜹니다.</span></li>
                            <li><span className="text-rose-300">이때 1차 진입으로 새로 들어가는 것은 소위 말하는 '고점 추격 매수(FOMO)'가 될 위험이 큽니다. 사자마자 물려버릴 확률이 높은 자리죠.</span></li>
                            <li><span className="text-blue-300 font-medium">[전략]</span> 그러므로 돌파 신호는, 이미 지지/눌림목에서 싸게 사둔 덕분에 <strong className="text-white">안전판(수익)을 확보한 상태일 때</strong>, "추세가 강하네!" 하고 확신을 가지며 비워둔 비중 40%를 태우는 <strong className="text-blue-400">3차 불타기 용도</strong>로만 쓰시는 것이 핵심입니다.</li>
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
                    💡 실전 매수 시나리오 요약
                </h4>
                <div className="space-y-4 text-sm text-slate-300">
                    <div>
                        <div className="font-bold text-white mb-1">1. 처음 사는 종목일 때 (1차 진입 - 정찰병)</div>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li>화면에 녹색 글씨인 <span className="font-bold text-emerald-400">'매수 (눌림목)'</span> 혹은 <span className="font-bold text-emerald-400">'매수 (지지)'</span>가 떠 있는 종목들만 골라서 1차 진입(30%) 하십시오.</li>
                            <li>보라색 글씨의 <span className="font-bold text-blue-400">'매수 (돌파)'</span>가 뜬 상태일 때 처음 들어가는 건 '고점 추격(포모)' 위험이 매우 큽니다. "아직 내 것이 아니구나" 하고 일단 보내주십시오.</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-bold text-white mb-1">2. 샀는데 가격이 떨어질 때 (2차 추매)</div>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li>1차로 샀는데 주가가 더 빠져 예상했던 -5% 부근의 조정이 왔을 때, 마침 시스템에서 알파 종목에 다시 <span className="font-bold text-emerald-400">'매수 (지지)'</span>가 뜨면 "아, 바닥을 다지고 있구나" 하고 안심하며 2차 추매(30%)를 실행합니다.</li>
                        </ul>
                    </div>
                    <div>
                        <div className="font-bold text-white mb-1">3. 샀는데 가격이 오를 때 (3차 완성 - 불타기)</div>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                            <li>주가가 오르기 시작해서 내 평단가보다 수익권이 되었을 때, 마침 화면에 <span className="font-bold text-blue-400">'매수 (돌파)'</span> 신호가 뜬다면?</li>
                            <li>이때는 "상승 추세를 제대로 탔다!"라고 확신을 갖고 비워두었던 <strong className="text-white">마지막 40% 물량을 태워 불타기(3차 완성)</strong>를 하는 겁니다.</li>
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
