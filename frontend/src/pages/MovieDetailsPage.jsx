import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import { getMovieDetails, getMovieRecommendations } from '../api/movies';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function MovieDetailsPage() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        setError('');
      } catch {
        setError('Failed to fetch movie details');
      }
    };

    const fetchRecommendations = async () => {
      try {
        const data = await getMovieRecommendations(id);
        setRecommendations(data.results);
        setError('');
      } catch {
        setError('Failed to fetch recommendations');
      }
    };

    const fetchMovieTrailer = async () => {
      try {
        const { data } = await axios.get(`/api/movies/${id}/trailer`);
        setTrailerUrl(data.url);
      } catch (err) {
        console.error("Failed to fetch trailer:", err);
        setTrailerUrl(null); // Ensure trailerUrl is null on error
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/api/users/reviews`, { headers: { Authorization: `Bearer ${token}` } });
        setReviews(data.filter(review => review.tmdbId === id));
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchMovieDetails();
    fetchRecommendations();
    fetchMovieTrailer();
    fetchReviews();
  }, [id, token, user]);

  const handleAddToWatchlist = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post('/api/watchlist', { 
        tmdbId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date
      }, config);
      alert('Added to watchlist');
    } catch {
      alert('Failed to add to watchlist');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post('/api/favorites', { 
        tmdbId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date
      }, config);
      alert('Added to favorites');
    } catch {
      alert('Failed to add to favorites');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.post('/api/users/reviews', { ...newReview, tmdbId: id, title: movie.title }, config);
      setReviews([...reviews, data]);
      setNewReview({ rating: 0, comment: '' });
      alert('Review added successfully');
    } catch (err) {
      console.error("Failed to add review:", err);
      alert(err.response?.data?.message || 'Failed to add review');
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

  

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!movie) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="img-fluid" />
        </div>
        <div className="col-md-8">
          <h1>{movie.title}</h1>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
          <p>{movie.overview}</p>
          <button onClick={handleAddToWatchlist} className="btn btn-primary me-2">Add to Watchlist</button>
          <button onClick={handleAddToFavorites} className="btn btn-danger me-2">Add to Favorites</button>
          <Link to={`/reviews/${id}`} className="btn btn-secondary">Reviews</Link>
          <div className="mt-3">
            <FacebookShareButton url={window.location.href} quote={`Check out ${movie.title}!`}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href} title={`Check out ${movie.title}!`}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <WhatsappShareButton url={window.location.href} title={`Check out ${movie.title}!`}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </div>
      </div>

      {trailerUrl && (
        <div className="mt-4">
          <h2>Trailer</h2>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              className="embed-responsive-item"
              src={trailerUrl}
              allowFullScreen
              title="Movie Trailer"
            ></iframe>
          </div>
        </div>
      )}

      <h2 className="mt-5">Reviews</h2>
      {user ? (
        <form onSubmit={handleReviewSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">Rating:</label>
            <input
              type="number"
              className="form-control"
              id="rating"
              min="0"
              max="10"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Comment:</label>
            <textarea
              className="form-control"
              id="comment"
              rows="3"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit Review</button>
        </form>
      ) : (
        <p>Please <Link to="/login">log in</Link> to add a review.</p>
      )}

      {reviews.length > 0 ? (
        <div className="list-group">
          {reviews.map((review) => (
            <div key={review._id} className="list-group-item list-group-item-dark mb-2">
              <h5 className="mb-1">{review.username} - Rating: {review.rating}/10</h5>
              <p className="mb-1">{review.comment}</p>
              {user && user._id === review.user && (
                <div>
                  <button onClick={() => handleEditReview(review)} className="btn btn-secondary btn-sm me-2">Edit</button>
                  <button onClick={() => handleDeleteReview(review._id)} className="btn btn-danger btn-sm">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet. Be the first to review this movie!</p>
      )}

      <h2 className="mt-5">Recommendations</h2>
      <div className="row">
        {recommendations.map((rec) => (
          <div key={rec.id} className="col-md-3 mb-4">
            <div className="card">
              <Link to={`/movies/${rec.id}`}>
              <img src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`} className="card-img-top" alt={rec.title} />
              </Link>
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={`/movies/${rec.id}`}>{rec.title}</Link>
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieDetailsPage;

