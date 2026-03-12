import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem('token');
  const isAdminLoggedIn = !!token;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide Navbar on Admin Pages to prevent duplication with AdminDashboard sidebar
  if (location.pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Schemes', path: '/schemes' },
    { name: 'Projects', path: '/projects' },
  ];

  // Determine if we should use the transparent/hero style
  const isHome = location.pathname === '/';
  const useTransparentNav = isHome && !scrolled && !mobileMenuOpen;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${useTransparentNav
      ? 'bg-transparent py-5'
      : 'bg-secondary-900/95 backdrop-blur-md shadow-lg py-3 border-b border-secondary-800'
      }`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group z-50">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-primary-600 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg group-hover:scale-105 transition-transform">
            SM
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-lg md:text-2xl leading-tight text-white`}>Priya Electricals</span>
            <span className={`text-[10px] md:text-sm font-medium tracking-wider ${useTransparentNav ? 'text-emerald-200' : 'text-primary-400'}`}> Irrigation Expert & Hardware</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors relative hover:text-primary-400 ${location.pathname === link.path
                  ? 'text-primary-400'
                  : useTransparentNav ? 'text-white/90' : 'text-secondary-300'
                  }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {!isAdminLoggedIn && (
              <Link
                to="/admin/login"
                className={`px-5 py-2 rounded-full font-medium transition-all ${useTransparentNav
                  ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
                  : 'bg-secondary-800 text-white hover:bg-secondary-700'
                  }`}
              >
                Admin Login
              </Link>
            )}
            {isAdminLoggedIn && (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin/dashboard"
                  className="px-5 py-2 rounded-full font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-medium hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white z-50 focus:outline-none"
        >
          {mobileMenuOpen ? (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* Mobile Sidebar Navigation */}
        <div className={`fixed inset-0 bg-secondary-950 z-40 transition-all duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="flex flex-col h-full pt-32 px-10 gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-3xl font-bold transition-all ${location.pathname === link.path ? 'text-primary-500 translate-x-4' : 'text-white hover:text-primary-400'}`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="mt-8 pt-8 border-t border-secondary-800 flex flex-col gap-4">
              {!isAdminLoggedIn ? (
                <Link to="/admin/login" className="w-full py-4 text-center bg-secondary-900 text-white rounded-2xl font-bold border border-secondary-800">
                  Admin Portal
                </Link>
              ) : (
                <>
                  <Link to="/admin/dashboard" className="w-full py-4 text-center bg-emerald-600 text-white rounded-2xl font-bold shadow-xl">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full py-4 text-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold">
                    Logout Account
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-auto pb-12">
              <p className="text-secondary-500 text-sm">© 2026 S.M. Priya Electricals</p>
              <p className="text-primary-500 text-sm mt-1">Ph No: 9819222222</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;