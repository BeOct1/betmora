import React, { useState, useEffect } from 'react';
import { getPopularMovies } from '../api/movies';
import { Link } from 'react-router-dom';

function MovieSlider() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('MovieSlider useEffect running');
    const fetchMovies = async () => {
      try {
        const response = await getPopularMovies();
        setMovies(response.results);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div className="text-center">Loading movies...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-3">Popular Movies</h2>
      <div className="row flex-nowrap overflow-auto">
        {movies.map((movie) => (
          <div key={movie.id} className="col-6 col-md-4 col-lg-3 col-xl-2 mb-4">
            <div className="card h-100 bg-dark text-white border-0">
              <Link to={`/movies/${movie.id}`}>
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="card-img-top rounded"
                  alt={movie.title}
                />
              </Link>
              <div className="card-body p-2">
                <h6 className="card-title text-truncate">
                  <Link to={`/movies/${movie.id}`} className="text-white text-decoration-none">
                    {movie.title}
                  </Link>
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieSlider;
