import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import axios from 'axios'

function ProfilePage() {
  const { token } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [favorites, setFavorites] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }
        const { data } = await axios.get('/api/users/profile', config)
        setUsername(data.username)
        setEmail(data.email)
        setError('')
      } catch {
        setError('Failed to load profile')
      }
      setLoading(false)
    }
    fetchProfile()

    const fetchFavorites = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }
        const { data } = await axios.get('/api/users/favorites', config)
        setFavorites(data)
      } catch (err) {
        console.error("Failed to fetch favorites:", err)
      }
    }

    const fetchWatchlist = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }
        const { data } = await axios.get('/api/users/watchlist', config)
        setWatchlist(data)
      } catch (err) {
        console.error("Failed to fetch watchlist:", err)
      }
    }

    const fetchReviews = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        }
        const { data } = await axios.get('/api/users/reviews', config)
        setReviews(data)
      } catch (err) {
        console.error("Failed to fetch reviews:", err)
      }
    }

    fetchFavorites()
    fetchWatchlist()
    fetchReviews()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      const updateData = { username, email }
      if (password) updateData.password = password
      await axios.put('/api/users/profile', updateData, config)
      setSuccess('Profile updated successfully')
      setError('')
      setPassword('')
    } catch {
      setError('Failed to update profile')
      setSuccess('')
    }
    setLoading(false)
  }

  const handleDeleteFavorite = async (movieId) => {
    if (window.confirm('Are you sure you want to remove this movie from favorites?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(`/api/users/favorites/${movieId}`, config);
        setFavorites(favorites.filter(movie => movie._id !== movieId));
        alert('Movie removed from favorites');
      } catch (err) {
        console.error("Failed to remove from favorites:", err);
        alert(err.response?.data?.message || 'Failed to remove from favorites');
      }
    }
  };

  const handleDeleteWatchlist = async (movieId) => {
    if (window.confirm('Are you sure you want to remove this movie from watchlist?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(`/api/users/watchlist/${movieId}`, config);
        setWatchlist(watchlist.filter(movie => movie._id !== movieId));
        alert('Movie removed from watchlist');
      } catch (err) {
        console.error("Failed to remove from watchlist:", err);
        alert(err.response?.data?.message || 'Failed to remove from watchlist');
      }
    }
  };

  const handleEditReview = async (reviewToEdit) => {
    const updatedRating = prompt("Edit your rating (0-10):", reviewToEdit.rating);
    const updatedComment = prompt("Edit your comment:", reviewToEdit.comment);

    if (updatedRating !== null && updatedComment !== null) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.put(`/api/users/reviews/${reviewToEdit._id}`, { rating: updatedRating, comment: updatedComment }, config);
        setReviews(reviews.map(review => review._id === reviewToEdit._id ? data : review));
        alert('Review updated successfully');
      } catch (err) {
        console.error("Failed to update review:", err);
        alert(err.response?.data?.message || 'Failed to update review');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(`/api/users/reviews/${reviewId}`, config);
        setReviews(reviews.filter(review => review._id !== reviewId));
        alert('Review deleted successfully');
      } catch (err) {
        console.error("Failed to delete review:", err);
        alert(err.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">User Profile</h1>
          {loading && <p>Loading...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username:</label>
              <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">New Password (leave blank to keep current):</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>Update Profile</button>
          </form>

          <h2 className="mt-5">My Favorites</h2>
          {favorites.length > 0 ? (
            <ul className="list-group">
              {favorites.map((movie) => (
                <li key={movie._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <Link to={`/movies/${movie.tmdbId}`}>{movie.title}</Link>
                  <button onClick={() => handleDeleteFavorite(movie._id)} className="btn btn-danger btn-sm">Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No favorites added yet.</p>
          )}

          <h2 className="mt-5">My Watchlist</h2>
          {watchlist.length > 0 ? (
            <ul className="list-group">
              {watchlist.map((movie) => (
                <li key={movie._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <Link to={`/movies/${movie.tmdbId}`}>{movie.title}</Link>
                  <button onClick={() => handleDeleteWatchlist(movie._id)} className="btn btn-danger btn-sm">Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No movies in watchlist yet.</p>
          )}

          <h2 className="mt-5">My Reviews</h2>
          {reviews.length > 0 ? (
            <ul className="list-group">
              {reviews.map((review) => (
                <li key={review._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <Link to={`/movies/${review.tmdbId}`}>{review.title}</Link>
                    <p className="mb-0">Rating: {review.rating}/10</p>
                    <p className="mb-0">Comment: {review.comment}</p>
                  </div>
                  <div>
                    <button onClick={() => handleEditReview(review)} className="btn btn-secondary btn-sm me-2">Edit</button>
                    <button onClick={() => handleDeleteReview(review._id)} className="btn btn-danger btn-sm">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews added yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
