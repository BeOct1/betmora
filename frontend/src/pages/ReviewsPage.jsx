import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function ReviewsPage() {
  const { tmdbId } = useParams();
  const { user, token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/reviews/${tmdbId}`);
        setReviews(data);
      } catch (err) {
        setError('Failed to load reviews');
      }
      setLoading(false);
    };

    if (tmdbId) {
      fetchReviews();
    }
  }, [tmdbId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post('/api/reviews', { tmdbId, rating, comment }, config);
      // Refresh reviews
      const { data } = await axios.get(`/api/reviews/${tmdbId}`);
      setReviews(data);
      setRating(0);
      setComment('');
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Reviews</h1>
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <h2 className="mb-3">Leave a Review</h2>
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">Rating</label>
            <input
              type="number"
              className="form-control"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="10"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Comment</label>
            <textarea
              className="form-control"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      )}

      <ul className="list-group">
        {reviews.map((review) => (
          <li key={review._id} className="list-group-item mb-3 bg-dark text-white border-secondary">
            <h5><strong>{review.username}</strong></h5>
            <p className="mb-1">Rating: {review.rating}</p>
            <p>{review.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewsPage;
