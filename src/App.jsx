import React, { useState } from 'react';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import statusData from './data/status.json';

function App() {
    const [selectedProject, setSelectedProject] = useState(null);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Violet Halos (Background Decorators) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-900/20 blur-[120px] rounded-full"></div>
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-900/10 blur-[100px] rounded-full"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {!selectedProject ? (
                    <>
                        <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-700">
                            <h1 className="text-5xl font-black text-white tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                The AI Projects Hub
                            </h1>
                            <p className="text-lg text-slate-400 font-medium tracking-wide">
                                Centralized Command Center & Peace of Mind Dashboard
                            </p>
                            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-violet-600 to-indigo-600 mx-auto rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {statusData.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onClick={() => handleProjectClick(project)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <ProjectDetail
                        project={selectedProject}
                        onBack={() => setSelectedProject(null)}
                    />
                )}

                <div className="mt-24 text-center text-xs text-slate-500 font-medium">
                    <p className="opacity-60">Powered by Antigravity Agent • 2026 Edition</p>
                    <p className="mt-2 text-violet-400/40 uppercase tracking-widest text-[10px]">Last Heartbeat: {new Date().toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
    );
}

export default App;
