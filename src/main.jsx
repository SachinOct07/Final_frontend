import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios';

// Set global base URL for axios
// If VITE_API_URL is defined (prod), use it. Otherwise, rely on proxy or localhost.
// Note: If using proxy in dev, baseURL should remain empty or just '/'.
// If VITE_API_URL is provided, it overrides everything.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://final-backend-0e6r.onrender.com');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)