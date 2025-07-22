// utils/tmdb.js
import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = process.env.TMDB_API_KEY

if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not defined in the environment variables.');
}

// Get YouTube trailer link for a specific movie
export const getMovieTrailer = async (movieId) => {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
        params: {
            api_key: TMDB_API_KEY
        }
    })
    const trailer = res.data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
    )
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
}

// Generic fetcher for any TMDB endpoint
export const fetchFromTMDB = async (endpoint, queryParams = {}) => {
    const res = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
        params: {
            api_key: TMDB_API_KEY,
            ...queryParams
        }
    })
    return res.data
}

// Example: Popular movies
export const getPopularMovies = async () => {
    return await fetchFromTMDB('/movie/popular', {})
}

// Example: Movie details by ID
export const getMovieDetails = async (movieId) => {
    return await fetchFromTMDB(`/movie/${movieId}`, {})
}

// Example: Search movies
export const searchMovies = async (query) => {
    return await fetchFromTMDB('/search/movie', { query })
}
// Example: Get recommendations for a movie
export const getRecommendations = async (movieId) => {
    return await fetchFromTMDB(`/movie/${movieId}/recommendations`, {})
}
// Example: Get movies by genre
export const getMoviesByGenre = async (genreId) => {
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
            api_key: TMDB_API_KEY,
            with_genres: genreId,
        },
    });
    return response.data;
};
// Example: Get movie details by TMDB ID
export const getMovieDetailsByTMDBId = async (tmdbId) => {
    return await fetchFromTMDB(`/movie/${tmdbId}`, {})
}
// Example: Fetch movie trailer from TMDB
export const fetchMovieTrailerFromTMDB = async (movieId) => {
    const trailer = await getMovieTrailer(movieId)
    return trailer ? trailer : null
}
// Example: Fetch popular movies from TMDB
export const fetchPopularMoviesFromTMDB = async () => {
    return await getPopularMovies()
}