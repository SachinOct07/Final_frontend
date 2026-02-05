import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/schemes')
      .then(res => {
        setSchemes(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const isAdmin = sessionStorage.getItem('token');

  return (
    <div className="min-h-screen bg-secondary-950 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm">Opportunities</span>
            <h1 className="text-4xl font-bold text-white mt-2">Active Schemes</h1>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.map(scheme => (
              <div key={scheme._id} className="bg-secondary-900 rounded-2xl overflow-hidden shadow-lg border border-secondary-800 hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col group">
                <div className="relative h-56 overflow-hidden bg-secondary-950">
                  <img
                    src={scheme.image ? `http://localhost:5000/${scheme.image}` : 'https://via.placeholder.com/400x300'}
                    alt={scheme.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500 opacity-90 group-hover:opacity-100"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Scheme'; }}
                  />
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 m-4 rounded-full shadow-lg">
                    ACTIVE
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{scheme.title}</h2>
                  <p className="text-secondary-400 text-sm leading-relaxed flex-1 text-justify">
                    {scheme.description}
                  </p>
                  <button className="mt-6 w-full py-2 bg-indigo-600/10 text-indigo-400 font-bold rounded-lg border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;