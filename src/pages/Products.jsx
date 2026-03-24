import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://final-backend-0e6r.onrender.com';

  useEffect(() => {
    // Fetch both products and categories
    Promise.all([
      axios.get('/api/products'),
      axios.get('/api/categories')
    ]).then(([productsRes, categoriesRes]) => {
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      // Only keep 'product' type categories or unclassified ones if they exist
      const fetchedCategories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
      setCategories(fetchedCategories.filter(c => c.type === 'product' || !c.type));
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching data", err);
      setLoading(false);
    });
  }, []);

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '' || (product.category && product.category._id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const isAdmin = sessionStorage.getItem('token');

  return (
    <div className="min-h-screen bg-secondary-950 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-800/50 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Header and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-primary-400 font-bold tracking-wider uppercase text-sm">Our Catalogue</span>
            <h1 className="text-4xl font-bold text-white mt-2">Premium Products</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-secondary-900 border border-secondary-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <svg className="absolute left-3 top-3 w-5 h-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Category Filter */}
            <div className="relative w-full sm:w-48">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-secondary-900 border border-secondary-700 text-white rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-secondary-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product._id} className="group bg-secondary-900 rounded-2xl overflow-hidden shadow-lg border border-secondary-800 hover:border-primary-500/50 hover:shadow-primary-500/10 transition-all duration-300 flex flex-col">
                <div className="relative h-64 overflow-hidden bg-white p-4 flex items-center justify-center">
                  {/* Image handling - using placeholder if image missing */}
                  <img
                    src={product.image ? (product.image.startsWith('http') ? product.image : `${API_URL}/${product.image.replace(/\\\\/g, '/')}`) : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Error'; }}
                  />

                  {/* Price Badge Removed */}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">
                    {product.category?.name || 'Uncategorized'}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">{product.name}</h2>

                  <button onClick={() => setSelectedProduct(product)} className="w-full py-3 mt-auto border border-secondary-700 text-secondary-300 rounded-lg hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all font-medium focus:outline-none">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-secondary-500 bg-secondary-900/50 rounded-2xl border border-secondary-800">
            <svg className="mx-auto h-12 w-12 text-secondary-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-1">No products found</h3>
            <p>Try adjusting your search or category filters.</p>
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
            <div className="relative bg-secondary-900 border border-secondary-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl overflow-hidden shadow-primary-900/20 transition-all animate-fade-in">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-secondary-400 hover:text-white bg-secondary-800 hover:bg-red-500/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors focus:outline-none z-10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="flex flex-col md:flex-row gap-8 relative z-0">
                <div className="w-full md:w-5/12 rounded-xl overflow-hidden bg-white p-4 flex items-center justify-center border border-secondary-800">
                  <img 
                    src={selectedProduct.image ? (selectedProduct.image.startsWith('http') ? selectedProduct.image : `${API_URL}/${selectedProduct.image.replace(/\\\\/g, '/')}`) : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={selectedProduct.name}
                    className="w-full h-auto max-h-64 object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Error'; }}
                  />
                </div>
                
                <div className="w-full md:w-7/12 flex flex-col pt-2">
                  <span className="text-sm font-bold tracking-wider text-primary-400 uppercase mb-2 inline-block">
                    {selectedProduct.category?.name || 'Uncategorized'}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">{selectedProduct.name}</h3>
                  
                  <div className="bg-secondary-800/60 p-5 rounded-xl border border-secondary-700 flex-1 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-secondary-700/30">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14 17h4v2h-4zm0-2h4v-2h-4zm0-4h4V9h-4zm-6 6h4v2H8zm0-2h4v-2H8zm0-4h4V9H8z"/></svg>
                    </div>
                    <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">Product Description</h4>
                    <p className="text-secondary-100 leading-relaxed text-sm md:text-base relative z-10 whitespace-pre-line">
                      {selectedProduct.description || "No specific details or description provided for this product yet. Please contact us for more technical specifications or availability."}
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

export default Products;