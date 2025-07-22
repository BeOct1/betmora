import axios from 'axios'

// Determine the base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://betmorapp-edwards-projects-0bb04786.vercel.app'
  : 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL,
  withCredentials: true,
})

export default api
