import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Globe,
    Zap,
    Cpu,
    PieChart,
    Briefcase,
    DollarSign,
    Menu
} from 'lucide-react';
import { clsx } from 'clsx';

const TABS = [
    { id: 'guide', label: 'Guide', icon: Briefcase, path: '/' },
    { id: 'indices', label: 'Indices', icon: Globe, path: '/indices' },
    { id: 'leverage', label: 'Leverage', icon: Zap, path: '/leverage' },
    { id: 'blue-chip', label: 'Blue Chip', icon: Cpu, path: '/blue-chip' },
    { id: 'growth', label: 'Growth', icon: Zap, path: '/growth' },
    { id: 'korea', label: 'Korea', icon: Globe, path: '/korea' },
    { id: 'sectors', label: 'Sectors', icon: PieChart, path: '/sectors' },
    { id: 'isa', label: 'ISA', icon: DollarSign, path: '/isa' },
    { id: 'pension', label: 'Pension', icon: Briefcase, path: '/pension' },
];

export default function Layout({ children }) {
    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg animate-pulse" />
                    <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        ALPHA 3.6B
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {TABS.map((tab) => (
                        <NavLink
                            key={tab.id}
                            to={tab.path}
                            className={({ isActive }) => clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            )}
                        >
                            <tab.icon size={20} />
                            <span className="font-medium">{tab.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
                    <div className="flex justify-between">
                        <span>Status</span>
                        <span className="text-emerald-400">● Online</span>
                    </div>
                    <div className="mt-2">v3.6.0-beta (260301-1)</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded animate-pulse" />
                        <span className="font-bold text-lg">ALPHA 3.6B</span>
                    </div>
                    <button className="p-2 text-slate-400">
                        <Menu size={24} />
                    </button>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4 scrollbar-hide">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </div>

                {/* Mobile Bottom Tab Bar */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 pb-6 z-30">
                    <div className="flex justify-around items-center px-2 py-3">
                        {TABS.map((tab) => (
                            <NavLink
                                key={tab.id}
                                to={tab.path}
                                className={({ isActive }) => clsx(
                                    "flex flex-col items-center space-y-1 w-full p-1",
                                    isActive ? "text-blue-400" : "text-slate-500"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[10px] font-medium truncate w-full text-center">
                                            {tab.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </main>
        </div>
    );
}
