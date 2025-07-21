import axios from 'axios'
import asyncHandler from 'express-async-handler'
import {
    getPopularMovies as fetchPopularMoviesFromTMDB,
    getMovieDetails as fetchMovieDetailsFromTMDB,
    getMovieTrailer as fetchMovieTrailerFromTMDB,
    getMoviesByGenre as fetchMoviesByGenreFromTMDB,
    searchMovies as searchMoviesFromTMDB,
    getRecommendations as fetchRecommendationsFromTMDB,
} from '../utils/tmdb.js'

// @desc    Fetch popular movies (using TMDB utility)
export const getPopularMovies = asyncHandler(async (req, res) => {
    try {
        const movies = await fetchPopularMoviesFromTMDB(process.env.TMDB_API_KEY)
        res.json(movies)
    } catch (err) {
        console.error('Failed to fetch popular movies:', err.message, err.stack);
        res.status(500).json({ message: 'Error fetching popular movies', error: err.message });
    }
});

// @desc    Get movie details by ID (direct TMDB API call)
export const getMovieDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetchMovieDetailsFromTMDB(id, process.env.TMDB_API_KEY);
        res.json(response);
    } catch (err) {
        console.error('Failed to fetch movie details:', err.message, err.stack);
        res.status(500).json({ message: 'Error fetching movie details', error: err.message });
    }
});

// @desc    Get movie trailer URL by movie ID (using TMDB utility)
export const getMovieTrailer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const trailerUrl = await fetchMovieTrailerFromTMDB(id, process.env.TMDB_API_KEY);
        if (!trailerUrl) {
            return res.status(404).json({ message: 'Trailer not found' });
        }
        res.json({ url: trailerUrl });
    } catch (err) {
        console.error('Failed to fetch movie trailer:', err.message, err.stack);
        res.status(500).json({ message: 'Error fetching movie trailer', error: err.message });
    }
});

// @desc    Get movie recommendations by movie ID (using TMDB utility)
export const getRecommendations = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const recommendations = await fetchRecommendationsFromTMDB(id, process.env.TMDB_API_KEY);
        res.json(recommendations);
    } catch (err) {
        console.error('Failed to fetch movie recommendations:', err.message, err.stack);
        res.status(500).json({ message: 'Error fetching movie recommendations', error: err.message });
    }
});

// @desc    Get movies by genre (placeholder implementation)
export const getMoviesByGenre = asyncHandler(async (req, res) => {
    // Example: you can extend this to accept genre ID or name from req.query or req.params
    try {
        const moviesByGenre = await fetchMoviesByGenreFromTMDB(req.query.genreId, process.env.TMDB_API_KEY);
        res.json(moviesByGenre);
    } catch (err) {
        console.error('Failed to fetch movies by genre:', err.message, err.stack);
        res.status(500).json({ message: 'Error fetching movies by genre', error: err.message });
    }
});

// @desc    Search movies by query string (using TMDB utility)
export const searchMovies = asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    try {
        const results = await searchMoviesFromTMDB(query, process.env.TMDB_API_KEY);
        res.json(results);
    } catch (err) {
        console.error('Failed to search movies:', err.message, err.stack);
        res.status(500).json({ message: 'Error searching movies', error: err.message });
    }
});
