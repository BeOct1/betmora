import axios from 'axios'

export const getPopularMovies = async () => {
  const response = await axios.get('/api/movies/popular')
  return response.data
}

export const searchMovies = async (query) => {
  const response = await axios.get('/api/movies/search', {
    params: { query }
  })
  return response.data
}

export const getMoviesByGenre = async (genre) => {
  const response = await axios.get('/api/movies/genre', {
    params: { genre }
  })
  return response.data
}

export const getMovieDetails = async (id) => {
  const response = await axios.get(`/api/movies/${id}`)
  return response.data
}

export const getMovieRecommendations = async (id) => {
  const response = await axios.get(`/api/movies/${id}/recommendations`)
  return response.data
}
