import axios from 'axios'

// Determine the base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://your-vercel-deployment-url.vercel.app' // Replace with your actual Vercel URL
  : 'http://localhost:5001';

// Create axios instance with base URL
const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
