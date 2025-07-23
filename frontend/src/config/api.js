import axios from 'axios'

// Get backend URL from .env file
const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true, 
});

export default api;
