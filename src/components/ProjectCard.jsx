import React from 'react';

const ProjectCard = ({ project, onClick }) => {
    const theme = project.theme || 'indigo';

    const themeConfig = {
        blue: {
            bg: 'bg-slate-900', border: 'border-blue-500/20', hoverBorder: 'hover:border-blue-400',
            text: 'text-white', accent: 'text-blue-400', subtext: 'text-blue-400/60',
            bar: 'bg-blue-500', barBg: 'bg-slate-900', dot: 'bg-blue-500/10',
            badge: 'bg-blue-900/50 text-blue-400 border-blue-500/30'
        },
        pink: {
            bg: 'bg-slate-900', border: 'border-pink-500/20', hoverBorder: 'hover:border-pink-400',
            text: 'text-white', accent: 'text-pink-400', subtext: 'text-pink-400/60',
            bar: 'bg-pink-500', barBg: 'bg-slate-900', dot: 'bg-pink-500/10',
            badge: 'bg-pink-900/50 text-pink-400 border-pink-500/30'
        },
        amber: {
            bg: 'bg-slate-900', border: 'border-amber-500/20', hoverBorder: 'hover:border-amber-400',
            text: 'text-white', accent: 'text-amber-400', subtext: 'text-amber-400/60',
            bar: 'bg-amber-500', barBg: 'bg-slate-900', dot: 'bg-amber-500/10',
            badge: 'bg-amber-900/50 text-amber-400 border-amber-500/30'
        },
        orange: {
            bg: 'bg-slate-900', border: 'border-orange-500/20', hoverBorder: 'hover:border-orange-400',
            text: 'text-white', accent: 'text-orange-400', subtext: 'text-orange-400/60',
            bar: 'bg-orange-500', barBg: 'bg-slate-900', dot: 'bg-orange-500/10',
            badge: 'bg-orange-900/50 text-orange-400 border-orange-500/30'
        },
        indigo: {
            bg: 'bg-slate-900', border: 'border-indigo-500/20', hoverBorder: 'hover:border-indigo-400',
            text: 'text-white', accent: 'text-indigo-400', subtext: 'text-indigo-400/60',
            bar: 'bg-indigo-500', barBg: 'bg-slate-900', dot: 'bg-indigo-500/10',
            badge: 'bg-indigo-900/50 text-indigo-400 border-indigo-500/30'
        },
        slate: {
            bg: 'bg-slate-900', border: 'border-slate-500/20', hoverBorder: 'hover:border-slate-400',
            text: 'text-white', accent: 'text-slate-300', subtext: 'text-slate-500',
            bar: 'bg-slate-500', barBg: 'bg-slate-900', dot: 'bg-slate-500/10',
            badge: 'bg-slate-800 text-slate-300 border-slate-600'
        },
        violet: {
            bg: 'bg-slate-900', border: 'border-violet-500/20', hoverBorder: 'hover:border-violet-400',
            text: 'text-white', accent: 'text-violet-400', subtext: 'text-violet-400/60',
            bar: 'bg-violet-500', barBg: 'bg-slate-900', dot: 'bg-violet-500/10',
            badge: 'bg-violet-900/50 text-violet-400 border-violet-500/30'
        },
        rose: {
            bg: 'bg-slate-900', border: 'border-rose-500/20', hoverBorder: 'hover:border-rose-400',
            text: 'text-white', accent: 'text-rose-400', subtext: 'text-rose-400/60',
            bar: 'bg-rose-500', barBg: 'bg-slate-900', dot: 'bg-rose-500/10',
            badge: 'bg-rose-900/50 text-rose-400 border-rose-500/30'
        },
        neon: {
            bg: 'bg-black', border: 'border-cyan-500/30', hoverBorder: 'hover:border-cyan-400',
            text: 'text-white', accent: 'text-cyan-400', subtext: 'text-cyan-400/60',
            bar: 'bg-cyan-400', barBg: 'bg-slate-950', dot: 'bg-cyan-500/10',
            badge: 'bg-cyan-950 text-cyan-400 border-cyan-500/50'
        }
    };

    const cfg = themeConfig[theme] || themeConfig.indigo;

    return (
        <div
            onClick={onClick}
            className={`group cursor-pointer rounded-2xl p-6 border relative overflow-hidden ${cfg.bg} ${cfg.border} ${cfg.hoverBorder} transition-colors duration-200`}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-12 -mt-12 opacity-40 ${cfg.dot}`}></div>

            <div className="flex justify-between items-start mb-6 relative">
                <div className="max-w-[70%]">
                    <h3 className={`text-xl font-bold leading-tight transition-colors uppercase tracking-tight ${cfg.text} group-hover:${cfg.accent}`}>
                        {project.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${cfg.subtext}`}>
                            {project.tech}
                        </p>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${cfg.badge} opacity-70`}>
                            {project.assistedPhase}
                        </span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${cfg.badge}`}>
                    {project.status}
                </span>
            </div>

            <div className="space-y-5 relative">
                {/* Layer A: Asistido */}
                <div>
                    <div className="flex justify-between text-sm mb-1.5 leading-none">
                        <span className={`font-bold uppercase text-[9px] tracking-[0.2em] ${cfg.subtext}`}>🧭 Asistido</span>
                        <span className={`font-black text-xs ${cfg.text}`}>{project.progressAssisted}%</span>
                    </div>
                    <div className={`w-full rounded-full h-3 ${cfg.barBg}`}>
                        <div
                            className={`h-3 rounded-full transition-all duration-1000 ease-out ${cfg.bar} shadow-[0_0_8px_rgba(255,255,255,0.1)]`}
                            style={{ width: `${project.progressAssisted}%` }}
                        ></div>
                    </div>
                </div>

                {/* Layer B: Auditable */}
                <div>
                    <div className="flex justify-between text-sm mb-1.5 leading-none">
                        <div className="flex items-center gap-2">
                            <span className={`font-bold uppercase text-[9px] tracking-[0.2em] ${cfg.subtext}`}>📋 Auditable</span>
                            {project.tasksSummary && (
                                <span className="text-[8px] font-black text-emerald-500/60 tracking-tighter bg-emerald-500/5 px-1 rounded">
                                    {project.tasksSummary.done}/{project.tasksSummary.total}
                                </span>
                            )}
                        </div>
                        <span className={`font-black text-xs ${project.progressAuditable !== null ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {project.progressAuditable !== null ? `${project.progressAuditable}%` : 'N/A'}
                        </span>
                    </div>
                    <div className={`w-full rounded-full h-3 ${cfg.barBg} overflow-hidden`}>
                        {project.progressAuditable !== null ? (
                            <div
                                className={`h-3 rounded-full transition-all duration-1000 ease-out bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]`}
                                style={{ width: `${project.progressAuditable}%` }}
                            ></div>
                        ) : (
                            <div className="h-full w-full bg-slate-800/30 flex items-center justify-center">
                                <span className="text-[7px] uppercase tracking-tighter opacity-30 font-bold">Sin tasks.md</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`pt-4 border-t flex justify-between items-center ${cfg.border} opacity-80`}>
                    <div>
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${cfg.subtext}`}>Last Update</p>
                        <p className={`text-xs font-medium ${cfg.text}`}>{project.lastUpdate}</p>
                    </div>
                    <div className={`font-bold text-sm px-3 py-1 rounded-lg transition-all border ${cfg.badge} group-hover:${cfg.bar} group-hover:text-white`}>
                        Detalles →
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProjectCard);
