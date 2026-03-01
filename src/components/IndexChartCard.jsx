import React from 'react';

// Using a simple SVG implementation to avoid 'recharts' dependency size for now.
// This is a Sparkline style Area Chart.
const SimpleAreaChart = ({ data, color = "#4ade80", height = 60 }) => {
    if (!data || data.length < 2) return null;

    const width = 100; // viewbox units
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;

    // Map data points to SVG coordinates
    const points = data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        // SVG y mimics screen coords (0 at top). So high val -> low y.
        const y = height - ((val - minVal) / range) * height; // Full height usage
        return `${x},${y}`;
    }).join(' ');

    // Area path needs to close at bottom
    const areaPath = `${points} ${width},${height} 0,${height}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={`M ${areaPath} Z`} fill={`url(#grad-${color})`} stroke="none" />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
    );
};

export default function IndexChartCard({ ticker, name, price, change, changePercent, ma20, rsi14, history, status }) {
    const isPositive = parseFloat(change) >= 0;
    const color = isPositive ? "#34d399" : "#f43f5e"; // emerald-400 vs rose-500

    return (
        <div className="bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-700 transition-all hover:border-slate-600">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-slate-100">{name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{ticker}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-white">
                        {parseFloat(price).toLocaleString()}
                    </div>
                    <div className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{parseFloat(change).toFixed(2)} ({parseFloat(changePercent).toFixed(2)}%)
                    </div>
                </div>
            </div>

            {/* Indicators Row - ALWAYS SHOW MA20 & RSI */}
            <div className="flex justify-between items-center text-xs mb-2 bg-slate-900/50 rounded p-2">
                <div className="flex space-x-3">
                    <span className="text-slate-400">MA20: <span className="text-white font-mono">{ma20 || '---'}</span></span>
                    <span className="text-slate-400">RSI: <span className={`font-mono ${rsi14 >= 70 ? 'text-rose-400' : rsi14 <= 30 ? 'text-emerald-400' : 'text-white'}`}>{rsi14 || '--'}</span></span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded ${status === 'SIMULATED' ? 'bg-amber-900/50 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>
                    {status === 'AFTER' ? 'After Mkt' : status}
                </span>
            </div>

            {/* Chart Area */}
            <div className="bg-slate-900/40 rounded-lg p-2 flex flex-col items-center justify-center">
                <div className="h-14 w-full flex items-end">
                    {history && history.length > 5 ? (
                        <SimpleAreaChart data={history} color={color} height={56} />
                    ) : (
                        <span className="text-xs text-slate-600 w-full text-center">No chart data</span>
                    )}
                </div>
                {/* X-Axis labels */}
                {history && history.length > 5 && (
                    <div className="w-full flex justify-between text-[10px] text-slate-500 mt-1 px-1">
                        <span>48시간 전</span>
                        <span>최근 (현재)</span>
                    </div>
                )}
            </div>
        </div>
    );
}
