import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'https://final-backend-0e6r.onrender.com';

  useEffect(() => {
    axios.get('/api/projects')
      .then(res => {
        setProjects(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects", err);
        setLoading(false);
      });
  }, []);

  const isAdmin = sessionStorage.getItem('token');

  return (
    <div className="min-h-screen bg-secondary-950 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-emerald-400 font-bold tracking-wider uppercase text-sm">Portfolio</span>
            <h1 className="text-4xl font-bold text-white mt-2">Latest Projects</h1>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map(project => (
              <div key={project._id} className="bg-secondary-900 rounded-2xl overflow-hidden shadow-lg border border-secondary-800 hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col group">
                <div className="relative h-60 bg-black" onContextMenu={e => e.preventDefault()}>
                  {project.video ? (
                    <ReactPlayer
                      url={`${API_URL}/${project.video}`}
                      controls
                      width="100%"
                      height="100%"
                      config={{
                        file: {
                          attributes: {
                            preload: 'metadata', // Loads metadata including first frame
                            muted: true, // Muted required for some browsers to allow loading data freely
                            controlsList: 'nodownload' // Removes download button
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-600 bg-secondary-950">
                      No Video Available
                    </div>
                  )}
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{project.title}</h2>
                  <p className="text-secondary-400 leading-relaxed flex-1">{project.description}</p>

                  <div className="mt-6 pt-6 border-t border-secondary-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-500">Completed Project</span>
                    <button className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors flex items-center gap-2">
                      View Details <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;