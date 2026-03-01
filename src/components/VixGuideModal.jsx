import React from 'react';
import { X } from 'lucide-react';

export default function VixGuideModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[#111318] border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-[#111318] border-b border-slate-700 p-4 flex justify-between items-center z-10 shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <span className="mr-2">📈</span>
                        VIX 지수 구간별 투자 실행 매뉴얼
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 sm:p-6 w-full grow">
                    <div className="overflow-x-auto w-full border border-slate-700 rounded-lg bg-[#1a1c23]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-sm text-slate-300 bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 border-b border-slate-700 whitespace-nowrap">지수 범위</th>
                                    <th scope="col" className="px-4 py-3 border-b border-slate-700 whitespace-nowrap">시장 심리 상태</th>
                                    <th scope="col" className="px-4 py-3 border-b border-slate-700 min-w-[140px]">매수(Buy) 전략</th>
                                    <th scope="col" className="px-4 py-3 border-b border-slate-700 min-w-[140px]">매도(Sell) 전략</th>
                                    <th scope="col" className="px-4 py-3 border-b border-slate-700 min-w-[250px]">포트폴리오 핵심 대응</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 text-slate-300">
                                <tr className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-4 py-4 font-bold text-white whitespace-nowrap">15 미만</td>
                                    <td className="px-4 py-4 font-medium whitespace-nowrap text-slate-200">극도의 안도</td>
                                    <td className="px-4 py-4 text-slate-300">금지 (신규 진입 자제)</td>
                                    <td className="px-4 py-4 text-slate-200 font-medium">적극 권장 (수익 실현)</td>
                                    <td className="px-4 py-4 text-slate-300">현금 비중 20~30% 확보, 저가 헷지(풋옵션) 고려</td>
                                </tr>
                                <tr className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-4 py-4 font-bold text-white whitespace-nowrap">15 ~ 20</td>
                                    <td className="px-4 py-4 font-medium whitespace-nowrap text-slate-200">낙관적 정상</td>
                                    <td className="px-4 py-4 text-slate-300">선별적 매수 (우량주)</td>
                                    <td className="px-4 py-4 text-slate-300">관망 및 리밸런싱</td>
                                    <td className="px-4 py-4 text-slate-300">섹터 순환매 확인, 기존 성장주 포지션 유지</td>
                                </tr>
                                <tr className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-4 py-4 font-bold text-white whitespace-nowrap">20 ~ 30</td>
                                    <td className="px-4 py-4 font-medium whitespace-nowrap text-slate-200">경계 및 불안</td>
                                    <td className="px-4 py-4 text-slate-300 text-base">1차 분할 매수 시작</td>
                                    <td className="px-4 py-4 text-slate-300">금지 (패닉 셀 방지)</td>
                                    <td className="px-4 py-4 text-slate-300">현금을 투입해 성장주 비중 확대 시작</td>
                                </tr>
                                <tr className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-4 py-4 font-bold text-white whitespace-nowrap">30 ~ 45</td>
                                    <td className="px-4 py-4 font-medium whitespace-nowrap text-slate-200">공포 및 패닉</td>
                                    <td className="px-4 py-4 text-slate-300 text-base">2차 공격적 분할 매수</td>
                                    <td className="px-4 py-4 text-slate-300">절대 금지 (비이성 구간)</td>
                                    <td className="px-4 py-4 text-slate-300">고점 대비 하락한 핵심 주도주 집중 매집</td>
                                </tr>
                                <tr className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-4 py-4 font-bold text-white whitespace-nowrap">45 이상</td>
                                    <td className="px-4 py-4 font-medium whitespace-nowrap text-slate-200">항복 (Crisis)</td>
                                    <td className="px-4 py-4 text-slate-300 text-base">최후의 매수 (All-in)</td>
                                    <td className="px-4 py-4 text-slate-300">헷지 상품 전량 매도</td>
                                    <td className="px-4 py-4 text-slate-300">인버스/VIX 상품 수익 실현 후 주식으로 전환</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
