import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
})

export const testWatchlist = async (token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    // Get watchlist
    const watchlist = await api.get('/watchlist', config)
    console.log('Get Watchlist Test Passed:', watchlist.data.length, 'items found')

    // Add to watchlist
    const movie = {
      tmdbId: '550',
      title: 'Fight Club',
      poster_path: '/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg',
      release_date: '1999-10-15',
    }
    await api.post('/watchlist', movie, config)
    console.log('Add to Watchlist Test Passed')

    // Remove from watchlist
    await api.delete(`/watchlist/${movie.tmdbId}`, config)
    console.log('Remove from Watchlist Test Passed')
  } catch (error) {
    console.error('Watchlist Test Failed:', error.response?.data || error.message)
  }
}

export const testReviews = async (token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const tmdbId = '550'

    // Create review
    const review = { tmdbId, rating: 9, comment: 'Great movie!' }
    const created = await api.post('/reviews', review, config)
    console.log('Create Review Test Passed:', created.data._id)

    // Get reviews
    const reviews = await api.get(`/reviews/${tmdbId}`)
    console.log('Get Reviews Test Passed:', reviews.data.length, 'reviews found')

    // Update review
    const updatedReview = { rating: 8, comment: 'Still great!' }
    await api.put(`/reviews/${created.data._id}`, updatedReview, config)
    console.log('Update Review Test Passed')

    // Delete review
    await api.delete(`/reviews/${created.data._id}`, config)
    console.log('Delete Review Test Passed')
  } catch (error) {
    console.error('Reviews Test Failed:', error.response?.data || error.message)
  }
}

const runUserFeatureTests = async () => {
  // You need to login first to get a token
  try {
    const loginResponse = await api.post('/auth/login', {
      email: 'testuser@example.com',
      password: 'TestPass123',
    })
    const token = loginResponse.data.token || loginResponse.data._id ? loginResponse.data.token : null
    if (!token) {
      console.error('Login failed, cannot run user feature tests')
      return
    }
    await testWatchlist(token)
    await testReviews(token)
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message)
  }
}

runUserFeatureTests()
