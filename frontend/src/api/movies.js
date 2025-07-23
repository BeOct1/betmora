import api from '../config/api.js'

export const getPopularMovies = async () => {
  const response = await api.get('/movies/popular')
  return response.data
}

export const searchMovies = async (query) => {
  const response = await api.get('/movies/search', {
    params: { query }
  })
  return response.data
}

export const getMoviesByGenre = async (genre) => {
  const response = await api.get('/movies/genre', {
    params: { genre }
  })
  return response.data
}

export const getMovieDetails = async (id) => {
  const response = await api.get(`/movies/${id}`)
  return response.data
}

export const getMovieRecommendations = async (id) => {
  const response = await api.get(`/movies/${id}/recommendations`)
  return response.data
}