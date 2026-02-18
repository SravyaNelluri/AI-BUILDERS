import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASEURL || 'https://ai-builders-2.onrender.com';

// For Vercel (BASE_URL=/api), use as-is
// For localhost/Render (full domain), add /api
const apiURL = BASE_URL.startsWith('/') ? BASE_URL : `${BASE_URL}/api`;

const api = axios.create({
  baseURL: apiURL,
  withCredentials: true
});

export default api;