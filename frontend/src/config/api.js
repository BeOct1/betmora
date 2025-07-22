import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  withCredentials: true,
})

export default api
