import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'https://final-backend-0e6r.onrender.com';

  useEffect(() => {
    // Determine the base URL for the API request
    // In dev, vite proxy handles /api. In prod, we might need a full URL if not handled by same origin.
    // For now assuming the proxy or relative path works. 
    // If the previous code used axios.get('/api/slides'), I'll keep it, 
    // but the image source in the previous code was http://localhost:5000/ which suggests a hardcoded backend.

    // I will use a relative path for flexibility, but keep the image logic consistent with the user's setup if possible.
    // However, for a premium look, I'll robustify the image loading.
    axios.get('/api/slides')
      .then(res => setSlides(res.data))
      .catch(err => console.error("Failed to fetch slides", err));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Faster transition
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const isAdmin = sessionStorage.getItem('token');

  return (
    <div className="min-h-screen bg-secondary-50 font-sans text-secondary-900">

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image/Slider */}
        <div className="absolute inset-0 bg-secondary-900">
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                {/* Assuming images are served from localhost:5000 based on previous code. 
                      I should probably make this dynamic or relative, but I'll stick to the pattern I saw.
                      However, I'll use a placeholder if the image fails or if there are no slides 
                  */}
                <img
                  src={slide.image?.startsWith('http') ? slide.image : `${API_URL}/${slide.image?.replace(/\\\\/g, '/')}`}
                  alt={slide.text}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-900/50 to-transparent" />
              </div>
            ))
          ) : (
            // Fallback Hero
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-900/50 to-transparent" />
            </div>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-center max-w-7xl pt-20">
          <div className="max-w-3xl space-y-6 animate-fade-in-up">
            <div className="inline-block px-4 py-1 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md rounded-full text-emerald-300 font-medium text-sm tracking-wide mb-4">
              LEADERS IN ELECTRICAL ENGINEERING
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Powering Progress <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">
                With Precision
              </span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-200 max-w-2xl leading-relaxed">
              S.M. Priya Electricals delivers top-tier electrical products and advanced drip irrigation solutions tailored for efficiency and reliability.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/products" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold shadow-lg shadow-primary-600/30 transition-all transform hover:-translate-y-1">
                Explore Products
              </Link>
              <Link to="/projects" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold backdrop-blur-sm transition-all">
                View Projects
              </Link>
            </div>
          </div>

          {/* Slide Controls - Positioned absolute bottom right */}
          {slides.length > 1 && (
            <div className="absolute bottom-12 right-6 md:right-12 flex gap-4">
              <button onClick={prevSlide} className="p-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={nextSlide} className="p-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>



      {/* Features Section */}
      <section className="py-24 bg-secondary-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">Excellence in Every Detail</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-primary-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Quality Products",
                desc: "We supply only the highest certified electrical components ensuring safety and durability.",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "bg-emerald-600"
              },
              {
                title: "Expert Service",
                desc: "Our team of seasoned engineers provides professional installation and maintenance support.",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                color: "bg-secondary-700"
              },
              {
                title: "Smart Irrigation",
                desc: "Advanced drip irrigation systems that maximize crop yield while conserving water.",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                color: "bg-primary-500"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-secondary-900 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-2xl border border-secondary-800 hover:border-emerald-500/30">
                <div className={`absolute -top-6 left-8 ${feature.color} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform shadow-emerald-900/20`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mt-8 mb-4 text-white">{feature.title}</h3>
                <p className="text-secondary-400 leading-relaxed">
                  {feature.desc}
                </p>
                <Link to="/products" className="inline-flex items-center gap-2 mt-6 text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform">
                  Learn more <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-wrap justify-between gap-8 text-center md:text-left">
          <div>
            <div className="text-4xl font-bold text-emerald-400 mb-1">15+</div>
            <div className="text-secondary-300 uppercase tracking-widest text-sm">Years Experience</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-400 mb-1">500+</div>
            <div className="text-secondary-300 uppercase tracking-widest text-sm">Projects Completed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-1">100%</div>
            <div className="text-secondary-300 uppercase tracking-widest text-sm">Client Satisfaction</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-400 mb-1">24/7</div>
            <div className="text-secondary-300 uppercase tracking-widest text-sm">Support Available</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-700 to-secondary-900 text-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Start Your Project?</h2>
          <p className="text-xl text-primary-100 mb-10">Get in touch with us today for a consultation or quote.</p>
          <button className="px-8 py-4 bg-white text-primary-800 font-bold rounded-full hover:bg-emerald-50 transition-colors shadow-2xl">
            Contact Us Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-950 text-secondary-400 py-12 border-t border-secondary-900">
        <div className="container mx-auto px-6 max-w-7xl text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-white text-lg font-bold mb-4">S.M. Priya Electricals</h4>
              <p className="text-sm leading-relaxed">Providing high-quality electrical and irrigation solutions since 2010.</p>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-emerald-400 transition">Home</Link></li>
                <li><Link to="/products" className="hover:text-emerald-400 transition">Products</Link></li>
                <li><Link to="/schemes" className="hover:text-emerald-400 transition">Schemes</Link></li>
                <li><Link to="/projects" className="hover:text-emerald-400 transition">Projects</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>123 Main Street, City</li>
                <li>+91 98765 43210</li>
                <li>info@smpriya.com</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Newsletter</h4>
              <div className="flex">
                <input type="email" placeholder="Enter email" className="bg-secondary-900 text-white px-4 py-2 rounded-l-lg outline-none w-full border border-secondary-800 focus:border-primary-600" />
                <button className="bg-primary-600 px-4 py-2 rounded-r-lg hover:bg-primary-500 text-white font-bold">Go</button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-secondary-900 text-center text-xs">
            <p>© 2026 S.M. Priya Electricals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;