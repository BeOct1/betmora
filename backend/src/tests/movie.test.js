import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5001/api/movies',
})

export const testGetPopularMovies = async () => {
  try {
    const response = await api.get('/popular')
    console.log('Get Popular Movies Test Passed:', response.data.length, 'movies found')
  } catch (error) {
    console.error('Get Popular Movies Test Failed:', error.response?.data || error.message)
  }
}

export const testSearchMovies = async () => {
  try {
    const response = await api.get('/search', { params: { query: 'batman' } })
    console.log('Search Movies Test Passed:', response.data.length, 'movies found')
  } catch (error) {
    console.error('Search Movies Test Failed:', error.response?.data || error.message)
  }
}

export const testGetMovieDetails = async (id) => {
  try {
    const response = await api.get(`/${id}`)
    console.log('Get Movie Details Test Passed:', response.data.title)
  } catch (error) {
    console.error('Get Movie Details Test Failed:', error.response?.data || error.message)
  }
}

const runMovieTests = async () => {
  await testGetPopularMovies()
  await testSearchMovies()
  // Replace with a valid movie ID from your database or TMDB
  await testGetMovieDetails('550') // Example: Fight Club TMDB ID
}

runMovieTests()
