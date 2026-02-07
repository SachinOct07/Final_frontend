import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'https://final-backend-0e6r.onrender.com';

  useEffect(() => {
    axios.get('/api/products')
      .then(res => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  }, []);

  const isAdmin = sessionStorage.getItem('token');

  return (
    <div className="min-h-screen bg-secondary-950 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-800/50 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-primary-400 font-bold tracking-wider uppercase text-sm">Our Catalogue</span>
            <h1 className="text-4xl font-bold text-white mt-2">Premium Products</h1>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div key={product._id} className="group bg-secondary-900 rounded-2xl overflow-hidden shadow-lg border border-secondary-800 hover:border-primary-500/50 hover:shadow-primary-500/10 transition-all duration-300 flex flex-col">
                <div className="relative h-64 overflow-hidden bg-white p-4 flex items-center justify-center">
                  {/* Image handling - using placeholder if image missing */}
                  <img
                    src={product.image ? (product.image.startsWith('http') ? product.image : `${API_URL}/${product.image.replace(/\\\\/g, '/')}`) : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Error'; }}
                  />

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-secondary-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm border border-secondary-700 group-hover:bg-primary-600 group-hover:border-primary-500 transition-colors">
                    ₹{product.rate}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">
                    {product.category?.name || 'Uncategorized'}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">{product.name}</h2>

                  <button className="w-full py-3 mt-auto border border-secondary-700 text-secondary-300 rounded-lg hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-secondary-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;