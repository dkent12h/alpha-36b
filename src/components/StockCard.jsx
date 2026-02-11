import React, { useState } from 'react';
import { ArrowUp, ArrowDown, AlertTriangle, Info, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { differenceInCalendarDays, parseISO } from 'date-fns';



import { getStrategyFeedback } from '../utils/strategy';

const StockCard = ({ ticker, name, price, change, changePercent, ma20, rsi14, status, earningsDate }) => {
    const isPositive = parseFloat(change) >= 0;
    const isOverbought = rsi14 >= 70;
    const isOversold = rsi14 <= 30;

    // Use Strategy Engine
    const feedback = getStrategyFeedback(price, ma20, rsi14);
    const signal = feedback.action;
    const signalColor = feedback.color;

    // Earnings Logic
    let earningsBadge = null;
    if (earningsDate) {
        const today = new Date();
        const target = parseISO(earningsDate);
        const diff = differenceInCalendarDays(target, today);

        let badgeColor = "bg-slate-700 text-slate-400";
        let badgeText = `D-${diff}`;

        if (diff === 0) {
            badgeColor = "bg-rose-500 text-white animate-pulse";
            badgeText = "TODAY";
        } else if (diff > 0 && diff <= 14) {
            badgeColor = "bg-amber-500/20 text-amber-400 border border-amber-500/50";
        } else if (diff < 0) {
            // hide past earnings or show distinct style
            badgeText = null;
        }

        if (badgeText) {
            earningsBadge = (
                <div className={clsx("flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ml-2", badgeColor)}>
                    <Calendar size={10} />
                    <span>{badgeText}</span>
                </div>
            );
        }
    }

    // MA20 Breach Logic (Legacy visual check still useful?)
    const isBelowMA20 = parseFloat(price) < parseFloat(ma20);
    // if (isBelowMA20 && status === 'OPEN') {
    //     // Overwritten by strategy engine 'WAIT' usually.
    // }

    const [expanded, setExpanded] = useState(false);

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className={twMerge(
                "bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700 transition-all cursor-pointer hover:border-slate-600 active:scale-95",
                status === 'OPEN' ? 'border-l-4 border-l-emerald-500' :
                    status === 'AFTER' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-slate-600'
            )}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center">
                        <h3 className="text-lg font-bold text-slate-100">{ticker}</h3>
                        {earningsBadge}
                    </div>
                    <p className="text-xs text-slate-400">{name}</p>
                </div>
                <div className="text-right">
                    <div className="text-xl font-mono font-bold text-white">
                        {
                            (ticker.includes('.KS') || ticker.includes('.KQ') || ticker.includes('^KS') || name.includes('KOSPI') || name.includes('KODEX') || name.includes('TIGER'))
                                ? `₩${parseInt(price).toLocaleString()}`
                                : `$${price}`
                        }
                    </div>
                    <div className={clsx("flex items-center justify-end text-sm font-medium", isPositive ? "text-emerald-400" : "text-rose-400")}>
                        {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
                    </div>
                </div>
            </div>

            {/* Main Indicators Row: MA20, RSI & Status */}
            <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                    <div className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                        MA20 {ma20}
                    </div>
                    <div className={clsx(
                        "px-2 py-0.5 rounded font-mono font-bold",
                        isOverbought ? "bg-rose-500/20 text-rose-400" :
                            isOversold ? "bg-emerald-500/20 text-emerald-400" :
                                "bg-slate-700 text-slate-300"
                    )}>
                        RSI {rsi14}
                    </div>
                    {isBelowMA20 && (
                        <div className="flex items-center text-amber-400 animate-pulse">
                            <AlertTriangle size={12} className="mr-1" />
                            <span>이탈</span>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <span className={signalColor}>{signal}</span>
                </div>
            </div>

            {/* Expanded Tactical Card */}
            {expanded && (
                <div className="mt-4 pt-3 border-t border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-2">
                        <div>MA20: <span className="text-slate-200">{ma20}</span></div>
                        <div>Vol: <span className="text-slate-200">--</span></div> {/* Mock volume */}
                        <div>High: <span className="text-slate-200">{(price * 1.02).toFixed(2)}</span></div>
                        <div>Low: <span className="text-slate-200">{(price * 0.98).toFixed(2)}</span></div>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded text-xs text-slate-300 italic flex items-start">
                        <Info size={14} className="mr-1.5 flex-shrink-0 mt-0.5 text-blue-400" />
                        AI Analysis: {feedback.reason}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockCard;
