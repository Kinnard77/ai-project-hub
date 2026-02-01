import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ProjectDetail = ({ project, onBack }) => {
    const theme = project.theme || 'indigo';
    const isNeon = theme === 'neon';

    const themeConfig = {
        blue: {
            header: 'bg-blue-900/40', headerText: 'text-white', subtext: 'text-blue-300',
            bg: 'bg-black', border: 'border-blue-500/20', text: 'text-white',
            accent: 'text-blue-400', bar: 'bg-blue-500', barBg: 'bg-slate-900',
            msBg: 'bg-blue-900/20', msBorder: 'border-blue-500/10',
            msBadge: 'bg-blue-900/50 text-blue-400 border-blue-500/30',
            desc: 'text-slate-300', highlight: 'text-blue-400'
        },
        pink: {
            header: 'bg-pink-900/40', headerText: 'text-white', subtext: 'text-pink-300',
            bg: 'bg-black', border: 'border-pink-500/20', text: 'text-white',
            accent: 'text-pink-400', bar: 'bg-pink-500', barBg: 'bg-slate-900',
            msBg: 'bg-pink-900/20', msBorder: 'border-pink-500/10',
            msBadge: 'bg-pink-900/50 text-pink-400 border-pink-500/30',
            desc: 'text-slate-300', highlight: 'text-pink-400'
        },
        amber: {
            header: 'bg-amber-900/40', headerText: 'text-white', subtext: 'text-amber-300',
            bg: 'bg-black', border: 'border-amber-500/20', text: 'text-white',
            accent: 'text-amber-400', bar: 'bg-amber-500', barBg: 'bg-slate-900',
            msBg: 'bg-amber-900/20', msBorder: 'border-amber-500/10',
            msBadge: 'bg-amber-900/50 text-amber-400 border-amber-500/30',
            desc: 'text-slate-300', highlight: 'text-amber-400'
        },
        orange: {
            header: 'bg-orange-900/40', headerText: 'text-white', subtext: 'text-orange-300',
            bg: 'bg-black', border: 'border-orange-500/20', text: 'text-white',
            accent: 'text-orange-400', bar: 'bg-orange-500', barBg: 'bg-slate-900',
            msBg: 'bg-orange-900/20', msBorder: 'border-orange-500/10',
            msBadge: 'bg-orange-900/50 text-orange-400 border-orange-500/30',
            desc: 'text-slate-300', highlight: 'text-orange-400'
        },
        indigo: {
            header: 'bg-indigo-900/40', headerText: 'text-white', subtext: 'text-indigo-300',
            bg: 'bg-black', border: 'border-indigo-500/20', text: 'text-white',
            accent: 'text-indigo-400', bar: 'bg-indigo-500', barBg: 'bg-slate-900',
            msBg: 'bg-indigo-900/20', msBorder: 'border-indigo-500/10',
            msBadge: 'bg-indigo-900/50 text-indigo-400 border-indigo-500/30',
            desc: 'text-slate-300', highlight: 'text-indigo-400'
        },
        slate: {
            header: 'bg-slate-800/40', headerText: 'text-white', subtext: 'text-slate-400',
            bg: 'bg-black', border: 'border-slate-500/20', text: 'text-white',
            accent: 'text-slate-300', bar: 'bg-slate-500', barBg: 'bg-slate-900',
            msBg: 'bg-slate-900/40', msBorder: 'border-slate-800',
            msBadge: 'bg-slate-800 text-slate-300 border-slate-700',
            desc: 'text-slate-400', highlight: 'text-slate-400'
        },
        violet: {
            header: 'bg-violet-900/40', headerText: 'text-white', subtext: 'text-violet-300',
            bg: 'bg-black', border: 'border-violet-500/20', text: 'text-white',
            accent: 'text-violet-400', bar: 'bg-violet-500', barBg: 'bg-slate-900',
            msBg: 'bg-violet-900/20', msBorder: 'border-violet-500/10',
            msBadge: 'bg-violet-900/50 text-violet-400 border-violet-500/30',
            desc: 'text-slate-300', highlight: 'text-violet-400'
        },
        rose: {
            header: 'bg-rose-900/40', headerText: 'text-white', subtext: 'text-rose-300',
            bg: 'bg-black', border: 'border-rose-500/20', text: 'text-white',
            accent: 'text-rose-400', bar: 'bg-rose-500', barBg: 'bg-slate-900',
            msBg: 'bg-rose-900/20', msBorder: 'border-rose-500/10',
            msBadge: 'bg-rose-900/50 text-rose-400 border-rose-500/30',
            desc: 'text-slate-300', highlight: 'text-rose-400'
        },
        neon: {
            header: 'bg-cyan-950/40', headerText: 'text-cyan-400', subtext: 'text-cyan-400/60',
            bg: 'bg-black', border: 'border-cyan-500/20', text: 'text-white',
            accent: 'text-cyan-400', bar: 'bg-cyan-400', barBg: 'bg-slate-900',
            msBg: 'bg-slate-900/50', msBorder: 'border-cyan-500/10',
            msBadge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            desc: 'text-slate-300', highlight: 'text-cyan-500'
        }
    };

    const cfg = themeConfig[theme] || themeConfig.indigo;

    const [authorizations, setAuthorizations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAuthorizations() {
            try {
                const { data } = await supabase
                    .from('task_authorizations')
                    .select('task_name, authorized')
                    .eq('project_id', project.id);
                const map = {};
                if (data) data.forEach(row => { map[row.task_name] = row.authorized; });
                setAuthorizations(map);
            } catch (e) {
                console.warn('Supabase auth fetch failed:', e);
            }
            setLoading(false);
        }
        fetchAuthorizations();
    }, [project.id]);

    async function toggleAuthorization(taskName) {
        const current = authorizations[taskName] || false;
        const next = !current;
        setAuthorizations(prev => ({ ...prev, [taskName]: next }));
        try {
            const { data } = await supabase
                .from('task_authorizations')
                .select('id')
                .eq('project_id', project.id)
                .eq('task_name', taskName)
                .single();
            if (data) {
                await supabase
                    .from('task_authorizations')
                    .update({ authorized: next, authorized_at: next ? new Date().toISOString() : null })
                    .eq('id', data.id);
            } else {
                await supabase
                    .from('task_authorizations')
                    .insert({ project_id: project.id, task_name: taskName, authorized: next, authorized_at: next ? new Date().toISOString() : null });
            }
        } catch (e) {
            console.warn('Supabase auth write failed:', e);
            setAuthorizations(prev => ({ ...prev, [taskName]: current }));
        }
    }

    return (
        <div className={`max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in zoom-in duration-300 ${cfg.bg} ${cfg.border} ${cfg.text}`}>
            <div className={`p-8 relative overflow-hidden ${cfg.header}`}>
                {/* Background Decorator for Detail Header */}
                <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full opacity-20 -mr-32 -mt-32 ${cfg.bar}`}></div>

                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 transition-colors flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
                >
                    <span className="text-xl">←</span> Dashboard
                </button>

                <div className="mt-8 relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <div className="max-w-[60%]">
                            <h2 className={`text-3xl font-bold mb-2 ${isNeon ? 'font-orbitron tracking-widest' : ''} ${cfg.headerText}`}>
                                {project.name}
                            </h2>
                            <p className={`${cfg.subtext} font-bold uppercase tracking-widest text-[10px]`}>{project.tech}</p>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-right">
                                <span className={`text-4xl font-black ${isNeon ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : cfg.headerText}`}>
                                    {project.progressAssisted}%
                                </span>
                                <p className={`text-[8px] uppercase font-black tracking-[0.2em] mt-1 ${cfg.subtext}`}>🧭 Asistido</p>
                            </div>
                            <div className="text-right border-l pl-8 border-white/10">
                                <span className={`text-4xl font-black ${project.progressAuditable !== null ? 'text-emerald-400' : 'text-slate-600'}`}>
                                    {project.progressAuditable !== null ? `${project.progressAuditable}%` : 'N/A'}
                                </span>
                                <p className={`text-[8px] uppercase font-black tracking-[0.2em] mt-1 ${cfg.subtext}`}>📋 Auditable</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 bg-gradient-to-b from-black to-slate-950">
                {/* Section 1: Diagnóstico Asistido */}
                <div className="space-y-8">
                    <div>
                        <h3 className={`text-xs font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-2 ${cfg.accent}`}>
                            <span className="p-1 rounded bg-current/10">🧭</span> Diagnóstico Asistido
                        </h3>

                        <div className={`mb-6 p-4 rounded-xl border ${cfg.msBg} ${cfg.msBorder}`}>
                            <p className="text-[9px] uppercase font-bold opacity-40 mb-1 tracking-widest">Fase Operativa</p>
                            <p className={`text-xl font-bold ${cfg.headerText}`}>
                                {project.assistedPhase}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">Señales de Avance</p>
                            <ul className="space-y-3">
                                {(project.assistedSignals || []).map((signal, idx) => (
                                    <li key={idx} className={`flex items-start gap-3 text-sm ${cfg.desc}`}>
                                        <span className={`${cfg.highlight} mt-1.5 w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]`}></span>
                                        {signal}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Human Context: En palabras sencillas */}
                    {project.humanContext && (
                        <div className="pt-6 border-t border-white/5">
                            <h4 className={`text-[9px] uppercase font-black tracking-[0.2em] mb-4 ${cfg.accent}`}>
                                💡 En palabras sencillas
                            </h4>

                            <p className={`text-sm leading-relaxed mb-4 ${cfg.desc}`}>
                                {project.humanContext.summary}
                            </p>

                            {project.humanContext.nextStep && (
                                <div className="space-y-3">
                                    <div className={`rounded-xl p-4 border bg-amber-500/5 border-amber-500/20`}>
                                        <p className="text-[9px] uppercase font-bold text-amber-400/70 tracking-widest mb-2">Foco ahora</p>
                                        <p className="text-sm text-slate-200 font-medium leading-relaxed">
                                            {project.humanContext.nextStep}
                                        </p>
                                    </div>

                                    {project.humanContext.nextStepWhy && (
                                        <div className={`rounded-xl p-4 border bg-white/[0.03] border-white/10`}>
                                            <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mb-2">Por qué importa</p>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                {project.humanContext.nextStepWhy}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Section 2: Auditable (Tareas) */}
                <div>
                    <h3 className={`text-xs font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-2 ${project.progressAuditable !== null ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <span className="p-1 rounded bg-current/10">📋</span> Auditable (Tareas)
                    </h3>

                    <div className="space-y-6">
                        {project.progressAuditable !== null && project.tasksSummary ? (
                            <>
                                <div className={`p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20`}>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-[9px] uppercase font-bold text-emerald-500/60 tracking-widest">Estado de tasks.md</p>
                                        <span className="text-xs font-black text-emerald-400">
                                            {project.tasksSummary.done}/{project.tasksSummary.total} DONE
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: `${project.progressAuditable}%` }}></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest">Tareas Pendientes</p>
                                    <div className="space-y-2">
                                        {project.pendingFocus && project.pendingFocus.length > 0 ? (
                                            project.pendingFocus.map((task, idx) => {
                                                const isAuthorized = authorizations[task] || false;
                                                return (
                                                    <div key={idx} className={`rounded-lg p-3 border flex items-center justify-between transition-colors duration-200 ${isAuthorized ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isAuthorized ? 'bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`}></div>
                                                            <span className={`text-xs font-medium truncate ${isAuthorized ? 'text-emerald-300' : 'text-slate-300'}`}>{task}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleAuthorization(task)}
                                                            className={`flex-shrink-0 ml-3 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border transition-all duration-200 ${isAuthorized ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10' : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'}`}
                                                        >
                                                            {loading ? '...' : isAuthorized ? '✓ Autorizada' : 'Autorizar'}
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-emerald-400 italic">No hay tareas pendientes.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 opacity-30">
                                    <p className="text-[8px] uppercase font-bold tracking-[0.2em]">Fuente Detectada:</p>
                                    <p className="text-[9px] font-mono mt-1 truncate">{project.tasksSource}</p>
                                </div>
                            </>
                        ) : (
                            <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                                <span className="text-2xl mb-4 block">📂</span>
                                <p className="text-sm text-slate-400 font-bold">Sin tareas declaradas por el Arquitecto</p>
                                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest"> tasks.md = null </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={`p-6 border-t text-center bg-black border-white/5`}>
                <p className={`text-[10px] uppercase tracking-[0.2em] font-medium opacity-20`}>Última actualización: {project.lastUpdate}</p>
            </div>
        </div>
    );
};

export default ProjectDetail;
