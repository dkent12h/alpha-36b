import React from 'react';
import ActionGuide from '../components/ActionGuide';

export default function ActionGuidePage() {
    return (
        <div className="space-y-6 pb-20">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                        Today's Action Plan
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Execute your strategy with discipline.
                    </p>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                    {new Date().toLocaleTimeString()}
                </div>
            </header>

            <ActionGuide />
        </div>
    );
}
