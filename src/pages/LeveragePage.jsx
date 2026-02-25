import React, { useState } from 'react';
import { ArrowDown, DollarSign, Settings, Save } from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';
import { usePriceAlert } from '../hooks/usePriceAlert';
import { MARKETS } from '../constants';

const LeverageCard = ({ ticker, name, data, settings, onSaveSettings }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localSettings, setLocalSettings] = useState(settings);

    // Run Alert Hook
    usePriceAlert(ticker, data, settings);

    const price = parseFloat(data?.price || 0);
    // Use lastCompletedClose as the reference "Prev Close" for leverage calculation goals
    const prevClose = parseFloat(data?.lastCompletedClose || data?.prevClose || 0);

    // Default base price: Use prevClose if basePrice is 0 or not set
    const basePrice = parseFloat(localSettings.basePrice) || prevClose || price;

    const target1Percent = parseFloat(localSettings.target1) || 5;
    const target2Percent = parseFloat(localSettings.target2) || 7;
    const target3Percent = parseFloat(localSettings.target3) || 14;

    const buyPrice1 = basePrice * (1 - target1Percent / 100);
    const buyPrice2 = basePrice * (1 - target2Percent / 100);
    const buyPrice3 = basePrice * (1 - target3Percent / 100);

    const dist1 = ((price - buyPrice1) / buyPrice1) * 100;
    const dist2 = ((price - buyPrice2) / buyPrice2) * 100;

    const handleSave = () => {
        onSaveSettings(ticker, localSettings);
        setIsEditing(false);
    };

    return (
        <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-slate-100">{ticker}</h3>
                        <span className="text-xs text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">{name}</span>
                        {settings.enabled && <span className="text-[10px] text-green-400 border border-green-400 px-1 rounded">ON</span>}
                    </div>
                    <div className="flex items-end space-x-3 mt-1">
                        <div className="text-2xl font-mono font-bold text-white">
                            ${price.toFixed(2)}
                        </div>
                        {data && data.status && data.status !== 'LIVE' && (
                            <div className="text-[10px] mb-1.5 bg-amber-900/40 text-amber-500 border border-amber-900 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                                {data.status === 'PRE' ? 'PRE-MKT' : data.status === 'POST' ? 'AFTER-MKT' : data.status}
                            </div>
                        )}
                    </div>
                    {/* Show Previous Close */}
                    <div className="text-xs text-slate-400 mt-1">
                        Prev Close: <span className="text-slate-200">${prevClose.toFixed(2)}</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-slate-400 hover:text-blue-400 p-1"
                >
                    <Settings size={18} />
                </button>
            </div>

            {isEditing ? (
                <div className="space-y-3 bg-slate-900/50 p-3 rounded-lg text-sm transition-all animate-in slide-in-from-top-2">
                    <div>
                        <label className="text-slate-500 block text-xs mb-1">Base Price (Ref)</label>
                        <div className="relative">
                            <span className="absolute left-2 top-1.5 text-slate-500">$</span>
                            <input
                                type="number"
                                value={localSettings.basePrice}
                                placeholder={prevClose.toFixed(2)}
                                onChange={(e) => setLocalSettings({ ...localSettings, basePrice: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded py-1 pl-5 pr-2 text-slate-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 cursor-pointer hover:text-blue-400" onClick={() => setLocalSettings({ ...localSettings, basePrice: '' })}>
                            * Click to use Prev Close (${prevClose.toFixed(2)})
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="text-slate-500 block text-xs mb-1">1st (-%)</label>
                            <input
                                type="number"
                                value={localSettings.target1}
                                onChange={(e) => setLocalSettings({ ...localSettings, target1: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded py-1 px-1 text-slate-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-slate-500 block text-xs mb-1">2nd (-%)</label>
                            <input
                                type="number"
                                value={localSettings.target2}
                                onChange={(e) => setLocalSettings({ ...localSettings, target2: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded py-1 px-1 text-slate-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-slate-500 block text-xs mb-1">3rd (-%)</label>
                            <input
                                type="number"
                                value={localSettings.target3}
                                onChange={(e) => setLocalSettings({ ...localSettings, target3: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded py-1 px-1 text-slate-200 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-slate-700">
                        <input
                            type="checkbox"
                            id={`alert-${ticker}`}
                            checked={localSettings.enabled || false}
                            onChange={(e) => setLocalSettings({ ...localSettings, enabled: e.target.checked })}
                            className="rounded bg-slate-700 border-slate-600 text-blue-500"
                        />
                        <label htmlFor={`alert-${ticker}`} className="text-slate-300 text-xs select-none cursor-pointer">
                            Enable Telegram Alerts
                        </label>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded flex items-center justify-center space-x-1 mt-2"
                    >
                        <Save size={14} /> <span>Save Strategy</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded text-sm group">
                        <span className="text-slate-400">1st Entry (-{target1Percent}%)</span>
                        <div className="text-right">
                            <div className="font-mono font-bold text-emerald-400">${buyPrice1.toFixed(2)}</div>
                            <div className="text-[10px] text-slate-500">
                                Gap: {dist1 > 0 ? '+' : ''}{dist1.toFixed(2)}%
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded text-sm">
                        <span className="text-slate-400">2nd Entry (-{target2Percent}%)</span>
                        <div className="text-right">
                            <div className="font-mono font-bold text-emerald-500">${buyPrice2.toFixed(2)}</div>
                            <div className="text-[10px] text-slate-500">
                                Gap: {dist2 > 0 ? '+' : ''}{dist2.toFixed(2)}%
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded text-sm border-t border-slate-800 mt-1 pt-2">
                        <span className="text-slate-400">3rd Entry (-{target3Percent}%)</span>
                        <div className="text-right">
                            <div className="font-mono font-bold text-emerald-600">${buyPrice3.toFixed(2)}</div>
                            <div className="text-[10px] text-slate-500">
                                (Base: ${basePrice.toFixed(2)})
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function LeveragePage() {
    const tickers = MARKETS.LEVERAGE;
    const { data, loading } = useMarketData(tickers);

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('leverage_settings');
        return saved ? JSON.parse(saved) : {};
    });

    const updateSettings = (ticker, newSettings) => {
        const next = { ...settings, [ticker]: newSettings };
        setSettings(next);
        localStorage.setItem('leverage_settings', JSON.stringify(next));
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading Strategy Engine...</div>;

    return (
        <div className="space-y-6 pb-20">
            <header className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Leverage Strategy
                </h2>
                <p className="text-slate-400 text-sm">
                    Dynamic Entry Points based on Pullback Strategy
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickers.map(t => (
                    <LeverageCard
                        key={t.ticker}
                        ticker={t.ticker}
                        name={t.name}
                        data={data[t.ticker]}
                        settings={settings[t.ticker] || { basePrice: 0, target1: 5, target2: 7, target3: 14 }}
                        onSaveSettings={updateSettings}
                    />
                ))}
            </div>
        </div>
    );
}
