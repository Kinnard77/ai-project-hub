import React from 'react';
import { LayoutDashboard, Sparkles } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-4 left-4 right-4 z-50 rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur-xl shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mx-auto max-w-7xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-600/20 rounded-lg border border-violet-500/30">
                        <LayoutDashboard className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white tracking-wide uppercase">AI Projects Hub</h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Command Center</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">System Online</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
