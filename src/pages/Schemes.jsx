import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const API_URL = import.meta.env.VITE_API_URL || 'https://final-backend-0e6r.onrender.com';

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

  // Filter schemes based on search term
  const filteredSchemes = schemes.filter(scheme => {
    return scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (scheme.description && scheme.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const isAdmin = sessionStorage.getItem('token');

  return (
    <div className="min-h-screen bg-secondary-950 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm">Opportunities</span>
            <h1 className="text-4xl font-bold text-white mt-2">Active Schemes</h1>
          </div>
          
          <div className="w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search schemes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-secondary-900 border border-secondary-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <svg className="absolute left-3 top-3 w-5 h-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchemes.map(scheme => (
              <div key={scheme._id} className="bg-secondary-900 rounded-2xl overflow-hidden shadow-lg border border-secondary-800 hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col group">
                <div className="relative h-56 overflow-hidden bg-secondary-950">
                  <img
                    src={scheme.image ? (scheme.image.startsWith('http') ? scheme.image : `${API_URL}/${scheme.image.replace(/\\\\/g, '/')}`) : 'https://via.placeholder.com/400x300'}
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
                  
                  <button onClick={() => setSelectedScheme(scheme)} className="mt-auto w-full py-2 bg-indigo-600/10 text-indigo-400 font-bold rounded-lg border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all focus:outline-none">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredSchemes.length === 0 && (
          <div className="text-center py-20 text-secondary-500 bg-secondary-900/50 rounded-2xl border border-secondary-800">
            <svg className="mx-auto h-12 w-12 text-secondary-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-1">No schemes found</h3>
            <p>Try adjusting your search terms.</p>
          </div>
        )}

        {/* Scheme Details Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedScheme(null)}></div>
            <div className="relative bg-secondary-900 border border-secondary-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl overflow-hidden shadow-indigo-900/20 transition-all animate-fade-in">
              <button onClick={() => setSelectedScheme(null)} className="absolute top-4 right-4 text-secondary-400 hover:text-white bg-secondary-800 hover:bg-red-500/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors focus:outline-none z-10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="flex flex-col md:flex-row gap-8 relative z-0">
                <div className="w-full md:w-5/12 rounded-xl overflow-hidden bg-white p-4 flex items-center justify-center border border-secondary-800">
                  <img 
                    src={selectedScheme.image ? (selectedScheme.image.startsWith('http') ? selectedScheme.image : `${API_URL}/${selectedScheme.image.replace(/\\\\/g, '/')}`) : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={selectedScheme.title}
                    className="w-full h-auto max-h-64 object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Error'; }}
                  />
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    ACTIVE
                  </div>
                </div>
                
                <div className="w-full md:w-7/12 flex flex-col pt-2">
                  <span className="text-sm font-bold tracking-wider text-indigo-400 uppercase mb-2 inline-block">
                    Special Offer
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">{selectedScheme.title}</h3>
                  
                  <div className="bg-secondary-800/60 p-5 rounded-xl border border-secondary-700 flex-1 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-secondary-700/30">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14 17h4v2h-4zm0-2h4v-2h-4zm0-4h4V9h-4zm-6 6h4v2H8zm0-2h4v-2H8zm0-4h4V9H8z"/></svg>
                    </div>
                    <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">Scheme Description & Terms</h4>
                    <p className="text-secondary-100 leading-relaxed text-sm md:text-base relative z-10 whitespace-pre-line text-justify">
                      {selectedScheme.description || "No specific details provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;