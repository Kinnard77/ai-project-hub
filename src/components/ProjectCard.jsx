import React from 'react';

const ProjectCard = ({ project }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'planning': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{project.tech}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="text-gray-900 font-bold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${project.progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Last Update</p>
                    <p className="text-sm text-gray-700">{project.last_update}</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
