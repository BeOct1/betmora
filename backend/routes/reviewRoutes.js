// routes/reviewRoutes.js
import express from 'express'
import {
    createReview,
    getReviewsByMovie,
    deleteReview,
    updateReview,
    submitRating,
    getUserRatings,
} from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route   POST /api/reviews
router.post('/', protect, createReview)

// @route   GET /api/reviews/mine
router.get('/mine', protect, getUserRatings)

// @route   GET /api/reviews/:tmdbId
router.get('/:tmdbId', getReviewsByMovie)

// @route   PUT /api/reviews/:id
router.put('/:id', protect, updateReview)

// @route   DELETE /api/reviews/:id
router.delete('/:id', protect, deleteReview)

// @route   POST /api/reviews/rating
router.post('/rating', protect, submitRating)

export default router
