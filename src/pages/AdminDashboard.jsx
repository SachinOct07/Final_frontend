import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [schemes, setSchemes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [bills, setBills] = useState([]);
  const [slides, setSlides] = useState([]);

  // Loading and success states
  const [loading, setLoading] = useState({
    scheme: false, project: false, product: false,
    category: false, stock: false, bill: false, slide: false
  });
  const [success, setSuccess] = useState({
    scheme: false, project: false, product: false,
    category: false, stock: false, bill: false, slide: false
  });
  const [error, setError] = useState({
    scheme: '', project: '', product: '',
    category: '', stock: '', bill: '', slide: ''
  });

  // Form states
  const [schemeForm, setSchemeForm] = useState({ title: '', description: '', image: null });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', video: null });
  const [productForm, setProductForm] = useState({ name: '', category: '', rate: '', image: null });
  const [categoryForm, setCategoryForm] = useState({ name: '', type: '' });
  const [slideForm, setSlideForm] = useState({ text: '', image: null });
  const [stockForm, setStockForm] = useState({ productName: '', productId: '', category: '', quantity: '', rate: '' });
  const [billForm, setBillForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    items: [],
    discount: 0,
    tax: 0,
    selectedStock: '',
    selectedQuantity: ''
  });


  const API_URL = import.meta.env.VITE_API_URL || 'https://final-backend-0e6r.onrender.com';
  const token = sessionStorage.getItem('token');
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      const [schemesRes, projectsRes, productsRes, categoriesRes, stocksRes, billsRes, slidesRes] = await Promise.all([
        axios.get('/api/schemes').catch(e => ({ data: [] })),
        axios.get('/api/projects').catch(e => ({ data: [] })),
        axios.get('/api/products').catch(e => ({ data: [] })),
        axios.get('/api/categories').catch(e => ({ data: [] })),
        axios.get('/api/stock', config).catch(e => ({ data: [] })),
        axios.get('/api/billing', config).catch(e => ({ data: [] })),
        axios.get('/api/slides').catch(e => ({ data: [] }))
      ]);
      setSchemes(schemesRes.data);
      setProjects(projectsRes.data);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setStocks(stocksRes.data);
      setBills(billsRes.data);
      setSlides(slidesRes.data);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        sessionStorage.removeItem('token');
        navigate('/admin/login');
      }
    }
  };

  const handleCreate = async (type, form, setForm, endpoint, hasFile = false) => {
    setLoading({ ...loading, [type]: true });
    setSuccess({ ...success, [type]: false });
    setError({ ...error, [type]: '' });

    try {
      let data = form;
      if (hasFile || type === 'project') { // project has video always
        const formData = new FormData();
        Object.keys(form).forEach(key => {
          if (form[key] !== null) formData.append(key, form[key]);
        });
        data = formData;
      }

      await axios.post(endpoint, data, config);
      await fetchData();

      // Reset form logic simplistic
      if (type === 'scheme') setSchemeForm({ title: '', description: '', image: null });
      if (type === 'project') setProjectForm({ title: '', description: '', video: null });
      if (type === 'product') setProductForm({ name: '', category: '', rate: '', image: null });
      if (type === 'category') setCategoryForm({ name: '', type: '' });
      if (type === 'slide') setSlideForm({ text: '', image: null });
      if (type === 'stock') setStockForm({ productName: '', productId: '', category: '', quantity: '', rate: '' });
      if (type === 'bill') setBillForm({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        items: [],
        discount: 0,
        tax: 0,
        selectedStock: '',
        selectedQuantity: ''
      });

      setSuccess({ ...success, [type]: true });
      setTimeout(() => setSuccess({ ...success, [type]: false }), 3000);
    } catch (err) {
      console.error(err);
      setError({ ...error, [type]: err.response?.data?.message || 'Operation failed' });
    } finally {
      setLoading({ ...loading, [type]: false });
    }
  };

  const handleDelete = async (id, endpoint) => {
    if (!window.confirm("Are you sure? This action is irreversible.")) return;
    try {
      await axios.delete(`${endpoint}/${id}`, config);
      fetchData();
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  const updateStock = async (id, quantity, rate) => {
    try {
      const payload = {};
      if (quantity) payload.quantity = quantity;
      if (rate) payload.rate = rate;
      await axios.put(`/api/stock/${id}`, payload, config);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to update stock");
    }
  };

  const Icons = {
    overview: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    projects: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    schemes: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
    categories: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
    stock: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    billing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    slides: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Icons.overview },
    { id: 'products', label: 'Products', icon: Icons.products },
    { id: 'projects', label: 'Projects', icon: Icons.projects },
    { id: 'schemes', label: 'Schemes', icon: Icons.schemes },
    { id: 'categories', label: 'Categories', icon: Icons.categories },
    { id: 'stock', label: 'Inventory', icon: Icons.stock },
    { id: 'billing', label: 'Billing', icon: Icons.billing },
    { id: 'slides', label: 'Home Slides', icon: Icons.slides },
  ];

  const Card = ({ title, value, icon, color }) => (
    <div className="bg-secondary-800 p-6 rounded-2xl shadow-sm border border-secondary-700 flex items-center justify-between">
      <div>
        <p className="text-secondary-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${color} text-white`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-secondary-900 font-sans text-white overflow-hidden">

      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-secondary-800 text-white transform transition-transform duration-300 ease-in-out z-30 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20 lg:w-64'} border-r border-secondary-700`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-secondary-700 flex-shrink-0">
          <span className={`text-xl font-bold tracking-tight ${!sidebarOpen && 'md:hidden lg:block'}`}>Admin Portal</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-secondary-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-secondary-400 hover:bg-secondary-700 hover:text-white'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`font-medium ${!sidebarOpen && 'md:hidden lg:block'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-secondary-700 flex-shrink-0">
          <a href="/" className="flex items-center gap-3 text-secondary-400 hover:text-white transition-colors px-4 py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className={`${!sidebarOpen && 'md:hidden lg:block'}`}>Return to Site</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-secondary-800 border-b border-secondary-700 h-20 flex items-center justify-between px-8 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-secondary-400 hover:text-primary-400 focus:outline-none hidden md:block">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button onClick={() => setSidebarOpen(true)} className="text-secondary-400 hover:text-primary-400 focus:outline-none md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-white hidden sm:block">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-400 font-bold border-2 border-primary-700">
              AD
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {/* General Success/Error Toasts could go here */}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              <Card title="Total Products" value={products.length} icon={<span className="text-2xl">🛒</span>} color="bg-blue-500" />
              <Card title="Active Schemes" value={schemes.length} icon={<span className="text-2xl">📋</span>} color="bg-emerald-500" />
              <Card title="Completed Projects" value={projects.length} icon={<span className="text-2xl">🏗️</span>} color="bg-purple-500" />
              <Card title="Total Bills" value={bills.length} icon={<span className="text-2xl">🧾</span>} color="bg-orange-500" />
            </div>
          )}

          {/* Dynamic Render Based on Tab */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-white">Product Management</h2>
                  <p className="text-secondary-400 mt-1">Add items to your catalogue</p>
                </div>
              </div>

              {/* Add Product Form */}
              <div className="bg-secondary-800 rounded-2xl p-8 shadow-sm border border-secondary-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="bg-blue-500/10 text-blue-400 p-2 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></span>
                  Add New Product
                </h3>
                {success.product && <div className="mb-6 p-4 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 flex items-center gap-3"><span className="text-xl">✅</span> Product added successfully!</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleCreate('product', productForm, setProductForm, '/api/products', true); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-400 mb-2">Product Name</label>
                        <input type="text" placeholder="e.g. Smart Irrigation Valve" className="input-field bg-secondary-900 border-secondary-700 text-white placeholder-secondary-600 focus:bg-secondary-900 focus:border-primary-500 transition-colors" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-400 mb-2">Category</label>
                          <select className="input-field bg-secondary-900 border-secondary-700 text-white focus:border-primary-500" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required>
                            <option value="">Select...</option>
                            {categories.filter(c => c.type === 'product').map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-400 mb-2">Rate (₹)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 font-bold">₹</span>
                            <input type="number" placeholder="0.00" className="input-field pl-8 bg-secondary-900 border-secondary-700 text-white placeholder-secondary-600 focus:border-primary-500" value={productForm.rate} onChange={e => setProductForm({ ...productForm, rate: e.target.value })} required />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-secondary-700 rounded-xl bg-secondary-900/50 hover:bg-blue-500/5 hover:border-blue-500/50 transition-colors flex flex-col items-center justify-center p-6 text-center cursor-pointer relative">
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setProductForm({ ...productForm, image: e.target.files[0] })} />
                      {productForm.image ? (
                        <div className="text-blue-400 font-medium flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          {productForm.image.name}
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-secondary-800 rounded-full shadow-sm flex items-center justify-center text-secondary-400 mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          <p className="text-secondary-400 font-medium">Click to upload product image</p>
                          <p className="text-xs text-secondary-600 mt-1">PNG, JPG up to 2MB</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3 text-lg shadow-blue-500/20">
                      {loading.product ? 'Saving...' : <><span>Save Product</span> <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(p => (
                  <div key={p._id} className="bg-secondary-800 rounded-2xl shadow-sm border border-secondary-700 overflow-hidden group hover:shadow-xl hover:border-secondary-600 transition-all duration-300">
                    <div className="h-44 bg-secondary-900 relative overflow-hidden">
                      {p.image ? (
                        <img src={`http://localhost:5000/${p.image}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary-600 bg-secondary-900">No Image</div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                        <button onClick={() => handleDelete(p._id, '/api/products')} className="bg-white text-red-500 p-3 rounded-xl hover:bg-red-50 hover:scale-110 transition-all shadow-lg" title="Delete">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md uppercase">{p.category?.name || 'Item'}</span>
                        <span className="text-lg font-bold text-white">₹{p.rate}</span>
                      </div>
                      <h4 className="font-bold text-secondary-200 line-clamp-1" title={p.name}>{p.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-white">Project Portfolio</h2>
                  <p className="text-secondary-400 mt-1">Showcase your completed works</p>
                </div>
              </div>

              {/* Add Project Form */}
              <div className="bg-secondary-800 rounded-2xl p-8 shadow-sm border border-secondary-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="bg-purple-500/10 text-purple-400 p-2 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></span>
                  Add New Project
                </h3>
                {success.project && <div className="mb-6 p-4 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 flex items-center gap-3"><span className="text-xl">✅</span> Project added successfully!</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleCreate('project', projectForm, setProjectForm, '/api/projects', true); }}>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-400 mb-2">Project Title</label>
                        <input type="text" placeholder="e.g. Metro Rail Electrification" className="input-field bg-secondary-900 border-secondary-700 text-white placeholder-secondary-600 focus:border-purple-500 transition-colors" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-400 mb-2">Description</label>
                        <textarea placeholder="Describe the project scope..." className="input-field bg-secondary-900 border-secondary-700 text-white placeholder-secondary-600 focus:border-purple-500 transition-colors h-32" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required />
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-secondary-400 mb-2">Project Video</label>
                      <div className="h-full border-2 border-dashed border-secondary-700 rounded-xl bg-secondary-900/50 hover:bg-purple-500/5 hover:border-purple-500/50 transition-colors flex flex-col items-center justify-center p-6 text-center cursor-pointer relative min-h-[180px]">
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setProjectForm({ ...projectForm, video: e.target.files[0] })} />
                        {projectForm.video ? (
                          <div className="text-purple-400 font-medium flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            {projectForm.video.name}
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-secondary-800 rounded-full shadow-sm flex items-center justify-center text-secondary-400 mb-3">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </div>
                            <p className="text-secondary-400 font-medium">Upload Project Video</p>
                            <p className="text-xs text-secondary-600 mt-1">MP4, WebM up to 50MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3 text-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-700">
                      {loading.project ? 'Uploading...' : <><span>Add Project</span> <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></>}
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                {projects.map(p => (
                  <div key={p._id} className="bg-secondary-800 p-6 rounded-2xl shadow-sm border border-secondary-700 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow">
                    <div className="h-24 w-40 bg-black rounded-xl overflow-hidden flex-shrink-0 relative group">
                      {/* Video Thumbnail Placeholder or simple icon if no thumbnail gen */}
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-white mb-1">{p.title}</h4>
                      <p className="text-secondary-400 text-sm line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleDelete(p._id, '/api/projects')} className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors font-medium border border-transparent hover:border-red-500/20">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-700 max-w-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Manage Categories</h3>
                {success.category && <div className="mb-4 p-3 bg-green-500/10 text-green-400 rounded-lg">Success!</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleCreate('category', categoryForm, setCategoryForm, '/api/categories'); }} className="flex gap-4">
                  <input type="text" placeholder="Category Name" className="input-field flex-1" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                  <select className="input-field w-40" value={categoryForm.type} onChange={e => setCategoryForm({ ...categoryForm, type: e.target.value })} required>
                    <option value="">Type</option>
                    <option value="product">Product</option>
                    <option value="stock">Stock</option>
                  </select>
                  <button type="submit" className="btn-primary whitespace-nowrap">Add</button>
                </form>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-700">
                  <h4 className="font-bold text-secondary-400 mb-4 uppercase text-xs tracking-wider">Product Categories</h4>
                  <ul className="space-y-2">
                    {categories.filter(c => c.type === 'product').map(c => (
                      <li key={c._id} className="flex justify-between p-3 bg-secondary-900 rounded-lg text-white">
                        <span>{c.name}</span>
                        <button onClick={() => handleDelete(c._id, '/api/categories')} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-700">
                  <h4 className="font-bold text-secondary-400 mb-4 uppercase text-xs tracking-wider">Stock Categories</h4>
                  <ul className="space-y-2">
                    {categories.filter(c => c.type === 'stock' || !c.type).map(c => (
                      <li key={c._id} className="flex justify-between p-3 bg-secondary-900 rounded-lg text-white">
                        <span>{c.name}</span>
                        <button onClick={() => handleDelete(c._id, '/api/categories')} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-6">
              <div className="bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-700">
                <h3 className="text-lg font-bold text-white mb-4">Add Inventory</h3>
                {success.stock && <div className="mb-4 p-3 bg-green-500/10 text-green-400 rounded-lg">Success!</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleCreate('stock', stockForm, setStockForm, '/api/stock'); }}>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input type="text" placeholder="Prod Name" className="input-field" value={stockForm.productName} onChange={e => setStockForm({ ...stockForm, productName: e.target.value })} required />
                    <input type="text" placeholder="Prod ID" className="input-field" value={stockForm.productId} onChange={e => setStockForm({ ...stockForm, productId: e.target.value })} required />
                    <select className="input-field" value={stockForm.category} onChange={e => setStockForm({ ...stockForm, category: e.target.value })} required>
                      <option value="">Category</option>
                      {categories.filter(c => c.type === 'stock' || !c.type).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <input type="number" placeholder="Qty" className="input-field" value={stockForm.quantity} onChange={e => setStockForm({ ...stockForm, quantity: e.target.value })} required />
                    <input type="number" placeholder="Rate (₹)" className="input-field" value={stockForm.rate} onChange={e => setStockForm({ ...stockForm, rate: e.target.value })} required />
                    <button type="submit" className="btn-primary md:col-span-1">Add</button>
                  </div>
                </form>
              </div>
              <div className="bg-secondary-800 rounded-2xl shadow-sm border border-secondary-700 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-secondary-900 border-b border-secondary-700">
                    <tr>
                      <th className="p-4 font-semibold text-secondary-400">ID</th>
                      <th className="p-4 font-semibold text-secondary-400">Name</th>
                      <th className="p-4 font-semibold text-secondary-400">Category</th>
                      <th className="p-4 font-semibold text-secondary-400">Stock</th>
                      <th className="p-4 font-semibold text-secondary-400">Rate</th>
                      <th className="p-4 font-semibold text-secondary-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-700">
                    {stocks.map(s => (
                      <tr key={s._id} className="hover:bg-secondary-700/50 transition-colors">
                        <td className="p-4 text-sm font-mono text-secondary-400">{s.productId}</td>
                        <td className="p-4 font-medium text-white">{s.productName}</td>
                        <td className="p-4 text-secondary-400">{s.category?.name || '-'}</td>
                        <td className={`p-4 font-bold ${s.quantity < 10 ? 'text-red-400' : 'text-emerald-400'}`}>{s.quantity}</td>
                        <td className="p-4 text-white">₹{s.rate || 0}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <input type="number" className="w-20 p-1 border border-secondary-600 rounded text-sm bg-secondary-900 text-white" placeholder="New Qty" id={`qty-${s._id}`} />
                            <input type="number" className="w-20 p-1 border border-secondary-600 rounded text-sm bg-secondary-900 text-white" placeholder="New Rate" id={`rate-${s._id}`} />
                            <button onClick={() => {
                              const qty = document.getElementById(`qty-${s._id}`).value;
                              const rate = document.getElementById(`rate-${s._id}`).value;
                              if (qty || rate) updateStock(s._id, qty, rate);
                            }} className="text-blue-400 text-sm hover:underline">Update</button>
                            <button onClick={() => {
                              if (window.confirm("Are you sure you want to delete this stock item?")) {
                                handleDelete(s._id, '/api/stock').catch(err => alert("Delete failed: " + (err.response?.data?.message || err.message)));
                              }
                            }} className="text-red-400 hover:text-red-300 ml-2" title="Delete Stock">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-secondary-800 rounded-2xl p-8 shadow-lg border border-secondary-700">
                <div className="flex justify-between items-start mb-8 border-b border-secondary-700 pb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Invoice</h2>
                    <p className="text-secondary-400 mt-1">Create a formal bill for your customer</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-xl font-bold text-primary-400">S.M. Priya Electricals</h4>
                    <p className="text-sm text-secondary-400">Engineering Excellence</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Customer Details & Item Selection */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Customer Details */}
                    <div className="bg-secondary-900/50 p-6 rounded-xl border border-secondary-700">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></span>
                        Customer Details
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-1 block">Customer Name</label>
                          <input type="text" placeholder="Enter Name" className="input-field py-1.5 text-sm" value={billForm.customerName} onChange={e => setBillForm({ ...billForm, customerName: e.target.value })} required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-1 block">Phone Number</label>
                          <input type="tel" placeholder="Enter Phone" className="input-field py-1.5 text-sm" value={billForm.customerPhone} onChange={e => setBillForm({ ...billForm, customerPhone: e.target.value })} required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-1 block">Address (Optional)</label>
                          <textarea placeholder="Enter Address" className="input-field py-1.5 text-sm h-20 resize-none" value={billForm.customerAddress} onChange={e => setBillForm({ ...billForm, customerAddress: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-1 block">Invoice Date</label>
                          <input type="date" className="input-field py-1.5 text-sm" value={billForm.invoiceDate} onChange={e => setBillForm({ ...billForm, invoiceDate: e.target.value })} required />
                        </div>
                      </div>
                    </div>

                    {/* Add Item Panel */}
                    <div className="bg-secondary-900/50 p-6 rounded-xl border border-secondary-700">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></span>
                        Add Product
                      </h4>
                      <div className="space-y-4">
                        <select className="input-field" value={billForm.selectedStock} onChange={e => setBillForm({ ...billForm, selectedStock: e.target.value })}>
                          <option value="">Select Product...</option>
                          {stocks.filter(s => s.quantity > 0).map(s => <option key={s._id} value={s._id}>{s.productName} (Avail: {s.quantity})</option>)}
                        </select>
                        <div className="flex gap-2">
                          <input type="number" className="input-field flex-1" placeholder="Qty" value={billForm.selectedQuantity} onChange={e => setBillForm({ ...billForm, selectedQuantity: e.target.value })} />
                          <button type="button" className="btn-secondary whitespace-nowrap px-4 bg-emerald-600 hover:bg-emerald-700 border border-emerald-500/30" onClick={() => {
                            if (billForm.selectedStock && billForm.selectedQuantity) {
                              const stock = stocks.find(s => s._id === billForm.selectedStock);
                              if (!stock) return;
                              if (parseInt(billForm.selectedQuantity) > stock.quantity) { alert("Insufficient Stock"); return; }
                              setBillForm({
                                ...billForm,
                                items: [...billForm.items, { productId: stock.productId, productName: stock.productName, quantity: parseInt(billForm.selectedQuantity), rate: stock.rate || 0 }],
                                selectedStock: '', selectedQuantity: ''
                              });
                            }
                          }}>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Invoice Items & Summary */}
                  <div className="lg:col-span-2 flex flex-col h-full">
                    <div className="bg-secondary-900 rounded-xl border border-secondary-700 overflow-hidden flex-1 flex flex-col">
                      <div className="bg-secondary-800/50 p-4 border-b border-secondary-700 grid grid-cols-12 gap-4 text-xs font-bold text-secondary-400 uppercase tracking-wider">
                        <div className="col-span-5">Item Description</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-3 text-right">Rate (₹)</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-[300px] p-2 space-y-2">
                        {billForm.items.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-secondary-600">
                            <svg className="w-12 h-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            <p>No items added yet</p>
                          </div>
                        ) : (
                          billForm.items.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-4 items-center p-3 bg-secondary-800/30 rounded-lg hover:bg-secondary-800/50 transition-colors group">
                              <div className="col-span-5 font-medium text-white flex items-center gap-2">
                                <button onClick={() => setBillForm({ ...billForm, items: billForm.items.filter((_, i) => i !== idx) })} className="text-red-500/0 group-hover:text-red-500 transition-colors -ml-4 pr-2">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                                {item.productName}
                              </div>
                              <div className="col-span-2 text-center text-secondary-300">{item.quantity}</div>
                              <div className="col-span-3 text-right">
                                <span className="text-white">₹{item.rate}</span>
                              </div>
                              <div className="col-span-2 text-right font-medium text-white">₹{item.quantity * item.rate}</div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Totals Section */}
                      <div className="bg-secondary-900 border-t border-secondary-700 p-6">
                        <div className="flex justify-end space-y-3">
                          <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between items-center text-secondary-400 text-sm">
                              <span>Subtotal</span>
                              <span>₹{billForm.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-secondary-400 text-sm">
                              <span>Discount</span>
                              <div className="w-24 relative">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary-600">₹</span>
                                <input type="number" className="w-full bg-transparent border-b border-secondary-600 text-right text-white outline-none pl-4 py-1 text-sm focus:border-primary-500"
                                  value={billForm.discount}
                                  onChange={e => setBillForm({ ...billForm, discount: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-secondary-400 text-sm">
                              <span>Tax (GST)</span>
                              <div className="w-24 relative">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-secondary-600">₹</span>
                                <input type="number" className="w-full bg-transparent border-b border-secondary-600 text-right text-white outline-none pl-4 py-1 text-sm focus:border-primary-500"
                                  value={billForm.tax}
                                  onChange={e => setBillForm({ ...billForm, tax: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="pt-4 border-t border-secondary-700 mt-2">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total Amount</span>
                                <span className="text-2xl font-bold text-primary-400">
                                  ₹{(billForm.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0) + Number(billForm.tax) - Number(billForm.discount)).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => handleCreate('bill', billForm, setBillForm, '/api/billing')} disabled={billForm.items.length === 0 || !billForm.customerName} className="btn-primary w-full mt-6 py-4 text-lg shadow-xl shadow-primary-900/30 flex justify-center items-center gap-3">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Generate Formal Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bills List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white px-2">Recent Invoices</h3>
                <div className="grid grid-cols-1 gap-4">
                  {bills.slice().reverse().map(b => (
                    <div key={b._id} className="bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-700 flex justify-between items-center hover:border-primary-500/30 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary-900 flex items-center justify-center text-secondary-500 group-hover:text-primary-400 transition-colors">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-lg">{b.customerName || `Invoice #${b._id.slice(-6)}`}</h5>
                          <div className="flex items-center gap-3 text-sm text-secondary-400">
                            <span>{new Date(b.createdAt || Date.now()).toLocaleDateString()}</span>
                            <span className="w-1 h-1 rounded-full bg-secondary-600"></span>
                            <span>{b.items?.length || 0} Items</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-emerald-400">₹{b.total}</p>
                        <button className="text-xs text-secondary-500 hover:text-white mt-1 underline">Download PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schemes' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-white">Schemes & Offers</h2>
                  <p className="text-secondary-400 mt-1">Manage active promotions</p>
                </div>
              </div>

              {/* Add Scheme Form */}
              <div className="bg-secondary-800 rounded-2xl p-8 shadow-sm border border-secondary-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg></span>
                  Add New Scheme
                </h3>
                {success.scheme && <div className="mb-6 p-4 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 flex items-center gap-3"><span className="text-xl">✅</span> Scheme added successfully!</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleCreate('scheme', schemeForm, setSchemeForm, '/api/schemes', true); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-400 mb-2">Scheme Title</label>
                        <input type="text" placeholder="e.g. Monsoon Drip Irrigation Offer" className="input-field bg-secondary-900 border-secondary-700 text-white placeholder-secondary-600 focus:border-emerald-500" value={schemeForm.title} onChange={e => setSchemeForm({ ...schemeForm, title: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-400 mb-2">Description / Terms</label>
                        <textarea placeholder="Details about specific discounts or bundles..." className="input-field bg-secondary-900 border-secondary-700 text-white placeholder-secondary-600 focus:border-emerald-500 h-32" value={schemeForm.description} onChange={e => setSchemeForm({ ...schemeForm, description: e.target.value })} required />
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-secondary-400 mb-2">Promotional Image</label>
                      <div className="h-full border-2 border-dashed border-secondary-700 rounded-xl bg-secondary-900/50 hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-colors flex flex-col items-center justify-center p-6 text-center cursor-pointer relative min-h-[180px]">
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setSchemeForm({ ...schemeForm, image: e.target.files[0] })} />
                        {schemeForm.image ? (
                          <div className="text-emerald-400 font-medium flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {schemeForm.image.name}
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-secondary-800 rounded-full shadow-sm flex items-center justify-center text-secondary-400 mb-3">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <p className="text-secondary-400 font-medium">Upload Banner Image</p>
                            <p className="text-xs text-secondary-600 mt-1">Ideally 1200x600px</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3 text-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700">
                      {loading.scheme ? 'Publishing...' : <><span>Publish Scheme</span> <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></>}
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schemes.map(s => (
                  <div key={s._id} className="bg-secondary-800 rounded-xl shadow-sm border border-secondary-700 overflow-hidden flex flex-col md:flex-row h-auto md:h-48 group hover:shadow-lg transition-all">
                    <div className="w-full md:w-48 bg-secondary-900 relative items-stretch flex">
                      {s.image ? (
                        <img src={s.image?.startsWith('http') ? s.image : `${API_URL}/${s.image?.replace(/\\/g, '/')}`} className="w-full h-full object-cover" alt={s.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary-600">No Image</div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className="font-bold text-lg text-white mb-2">{s.title}</h4>
                      <p className="text-secondary-400 text-sm line-clamp-3 mb-4 flex-1">{s.description}</p>
                      <div className="flex justify-end">
                        <button onClick={() => handleDelete(s._id, '/api/schemes')} className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 border border-transparent hover:border-red-500/20">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Remove Scheme
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'slides' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-700">
                <h3 className="text-lg font-bold text-white mb-4">Add Homepage Slide</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleCreate('slide', slideForm, setSlideForm, '/api/slides', true); }} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-secondary-400">Caption Text</label>
                    <input type="text" className="input-field mt-1" value={slideForm.text} onChange={e => setSlideForm({ ...slideForm, text: e.target.value })} required />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-secondary-400">Image</label>
                    <input type="file" className="input-field mt-1 pt-1.5" onChange={e => setSlideForm({ ...slideForm, image: e.target.files[0] })} required />
                  </div>
                  <button type="submit" className="btn-primary mb-[2px]">Upload</button>
                </form>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {slides.map(s => (
                  <div key={s._id} className="bg-secondary-800 p-4 rounded-xl shadow-sm border border-secondary-700 flex items-center gap-4">
                    <img src={s.image?.startsWith('http') ? s.image : `${API_URL}/${s.image?.replace(/\\/g, '/')}`} className="w-24 h-16 object-cover rounded-lg bg-secondary-900" />
                    <div className="flex-1">
                      <p className="font-medium text-white">{s.text}</p>
                    </div>
                    <button onClick={() => handleDelete(s._id, '/api/slides')} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>


    </div>
  );
};

export default AdminDashboard;