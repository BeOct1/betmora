import React, { useState, useEffect } from 'react';
import { getPopularMovies } from '../api/movies';

function HeroSection() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getPopularMovies();
        setMovies(response.results.slice(0, 5)); // Get top 5 popular movies for hero section
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
      }, 4000);
      return () => clearInterval(slideInterval);
    }
  }, [movies]);

  if (loading) return <div className="text-center">Loading Hero Section...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (movies.length === 0) return null; // Don't render if no movies

  const currentMovie = movies[currentSlide];

  return (
    <div className="hero-section position-relative overflow-hidden rounded my-4">
      <img 
        src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
        alt={currentMovie.title}
        className="img-fluid w-100"
        style={{ maxHeight: '500px', objectFit: 'cover' }}
      />
      <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-4 text-white"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}
      >
        <div>
          <h1 className="display-4 fw-bold">{currentMovie.title}</h1>
          <p className="lead d-none d-md-block">{currentMovie.overview}</p>
          <div className="d-flex align-items-center">
            <span className="badge bg-warning text-dark me-2">Rating: {currentMovie.vote_average.toFixed(1)}</span>
            <span className="badge bg-info me-2">Release: {currentMovie.release_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
