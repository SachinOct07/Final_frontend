import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'https://final-backend-0e6r.onrender.com';

  const handleShare = (project, platform) => {
    const url = window.location.origin + '/projects';
    const text = `Check out this project: ${project.title} at Priya Electricals`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=Project: ${encodeURIComponent(project.title)}&body=${encodeURIComponent(text + '\n' + url)}`;
    }
  };

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
                <div className="relative h-60 bg-black group-player overflow-hidden" onContextMenu={e => e.preventDefault()}>
                  {project.video ? (
                    <>
                      <ReactPlayer
                        url={project.video?.startsWith('http') ? project.video : `${API_URL}/${project.video?.replace(/\\\\/g, '/')}`}
                        playing={playingId === project._id}
                        onPlay={() => setPlayingId(project._id)}
                        onPause={() => setPlayingId(null)}
                        controls
                        width="100%"
                        height="100%"
                        config={{
                          file: {
                            attributes: {
                              preload: 'metadata',
                              controlsList: 'nodownload'
                            }
                          }
                        }}
                      />
                      {/* Custom Center Play/Pause Control Overlay */}
                      <div 
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none z-10 ${playingId === project._id ? 'opacity-0 hover:opacity-100' : 'opacity-100 bg-black/30'}`}
                      >
                        <div className="w-16 h-16 bg-emerald-500/90 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transform transition-shadow duration-300 group-player-hover:scale-110">
                          {playingId === project._id ? (
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                          ) : (
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </>
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
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleShare(project, 'whatsapp')}
                        className="p-2.5 bg-[#25D366]/10 text-[#25D366] rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-sm"
                        title="Share on WhatsApp"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleShare(project, 'email')}
                        className="p-2.5 bg-blue-500/10 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm"
                        title="Share via Email"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
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