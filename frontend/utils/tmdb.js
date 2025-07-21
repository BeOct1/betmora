// utils/tmdb.js
import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = process.env.TMDB_API_KEY

// Get YouTube trailer link for a specific movie
export const getMovieTrailer = async (movieId, apiKey) => {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
        params: {
            api_key: apiKey
        }
    })
    const trailer = res.data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
    )
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
}

// Generic fetcher for any TMDB endpoint
export const fetchFromTMDB = async (endpoint, queryParams = {}, apiKey) => {
    const res = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
        params: {
            api_key: apiKey,
            ...queryParams
        }
    })
    return res.data
}

// Example: Popular movies
export const getPopularMovies = async (apiKey) => {
    return await fetchFromTMDB('/movie/popular', {}, apiKey)
}

// Example: Movie details by ID
export const getMovieDetails = async (movieId, apiKey) => {
    return await fetchFromTMDB(`/movie/${movieId}`, {}, apiKey)
}

// Example: Search movies
export const searchMovies = async (query, apiKey) => {
    return await fetchFromTMDB('/search/movie', { query }, apiKey)
}
// Example: Get recommendations for a movie
export const getRecommendations = async (movieId, apiKey) => {
    return await fetchFromTMDB(`/movie/${movieId}/recommendations`, {}, apiKey)
}
// Example: Get movies by genre
export const getMoviesByGenre = async (genreId, apiKey) => {
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
            api_key: apiKey,
            with_genres: genreId,
        },
    });
    return response.data;
};
// Example: Get movie details by TMDB ID
export const getMovieDetailsByTMDBId = async (tmdbId, apiKey) => {
    return await fetchFromTMDB(`/movie/${tmdbId}`, {}, apiKey)
}
// Example: Fetch movie trailer from TMDB
export const fetchMovieTrailerFromTMDB = async (movieId, apiKey) => {
    const trailer = await getMovieTrailer(movieId, apiKey)
    return trailer ? trailer : null
}
// Example: Fetch popular movies from TMDB
export const fetchPopularMoviesFromTMDB = async (apiKey) => {
    return await getPopularMovies(apiKey)
}
