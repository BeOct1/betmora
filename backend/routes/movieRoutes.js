// routes/movieRoutes.js
import express from 'express'
import { getMoviesByGenre, searchMovies, getMovieDetails, getRecommendations, getMovieTrailer, getPopularMovies } from '../controllers/movieController.js'

const router = express.Router()

router.get('/popular', getPopularMovies)

router.get('/search', searchMovies)

router.get('/genre', getMoviesByGenre)

router.get('/:id', getMovieDetails)

router.get('/:id/recommendations', getRecommendations)

router.get('/:id/trailer', getMovieTrailer)

export default router
