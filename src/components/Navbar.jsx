import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem('token');
  const isAdminLoggedIn = !!token;
  const [scrolled, setScrolled] = useState(false);

  // Hide Navbar on Admin Pages to prevent duplication with AdminDashboard sidebar
  if (location.pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Schemes', path: '/schemes' },
    { name: 'Projects', path: '/projects' },
    { name: 'Products', path: '/products' },
  ];

  // Determine if we should use the transparent/hero style
  // Only use transparent style on Home page when at the top
  const isHome = location.pathname === '/';
  const useTransparentNav = isHome && !scrolled;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${useTransparentNav
      ? 'bg-transparent py-5'
      : 'bg-secondary-900/90 backdrop-blur-md shadow-lg py-3 border-b border-secondary-800'
      }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
            SM
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-xl leading-none ${useTransparentNav ? 'text-white' : 'text-white'}`}>Priya Electricals</span>
            <span className={`text-xs font-medium tracking-wider ${useTransparentNav ? 'text-emerald-200' : 'text-primary-400'}`}>ENGINEERING EXCELLENCE</span>
          </div>
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
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
              <a
                href="/admin/login"
                className={`px-5 py-2 rounded-full font-medium transition-all ${useTransparentNav
                  ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
                  : 'bg-secondary-900 text-white hover:bg-secondary-800'
                  }`}
              >
                Admin Login
              </a>
            )}
            {isAdminLoggedIn && (
              <>
                <a
                  href="/admin/dashboard"
                  className={`px-5 py-2 rounded-full font-medium transition-all ${useTransparentNav
                    ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                    }`}
                >
                  Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;