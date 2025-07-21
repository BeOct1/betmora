import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import axios from 'axios'
import { Link } from 'react-router-dom'

function WatchlistPage() {
  const { token } = useContext(AuthContext)
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWatchlist = async () => {
    setLoading(true)
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      const { data } = await axios.get('/api/watchlist', config)
      setWatchlist(data)
      setError('')
    } catch {
      setError('Failed to load watchlist')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWatchlist()
  }, [token])

  const handleRemove = async (tmdbId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      await axios.delete(`/api/watchlist/${tmdbId}`, config)
      setWatchlist(watchlist.filter(movie => movie.tmdbId !== tmdbId))
    } catch {
      setError('Failed to remove movie from watchlist')
    }
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Your Watchlist</h1>
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {watchlist.length === 0 && !loading && <p>Your watchlist is empty.</p>}
      <div className="row">
        {watchlist.map(movie => (
          <div key={movie._id} className="col-md-4 col-lg-3 mb-4">
            <div className="card h-100 bg-dark text-white border-0">
              <Link to={`/movies/${movie.tmdbId}`}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="card-img-top rounded" />
              </Link>
              <div className="card-body">
                <h5 className="card-title text-truncate">
                  <Link to={`/movies/${movie.tmdbId}`} className="text-white text-decoration-none">
                    {movie.title}
                  </Link>
                </h5>
                <p className="card-text text-muted">Release Date: {movie.release_date}</p>
                <button onClick={() => handleRemove(movie.tmdbId)} className="btn btn-danger btn-sm w-100">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WatchlistPage

