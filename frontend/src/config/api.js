import axios from 'axios'

// Get backend URL from .env file
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

export default api;
