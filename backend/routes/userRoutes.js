// routes/userRoutes.js
import express from 'express'
import { getProfile, updateProfile, getFavorites, addFavorite, removeFavorite, getWatchlist, addWatchlist, removeWatchlist, getReviews, addReview, updateReview, deleteReview } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route   GET /api/profile
router.get('/profile', protect, getProfile)

// @route   PUT /api/profile
router.put('/profile', protect, updateProfile)

// @route   GET /api/favorites
router.get('/favorites', protect, getFavorites)

// @route   POST /api/favorites
router.post('/favorites', protect, addFavorite)

// @route   DELETE /api/favorites/:id
router.delete('/favorites/:id', protect, removeFavorite)

// @route   GET /api/watchlist
router.get('/watchlist', protect, getWatchlist)

// @route   POST /api/watchlist
router.post('/watchlist', protect, addWatchlist)

// @route   DELETE /api/watchlist/:id
router.delete('/watchlist/:id', protect, removeWatchlist)

// @route   GET /api/reviews
router.get('/reviews', protect, getReviews)

// @route   POST /api/reviews
router.post('/reviews', protect, addReview)

// @route   PUT /api/reviews/:id
router.put('/reviews/:id', protect, updateReview)

// @route   DELETE /api/reviews/:id
router.delete('/reviews/:id', protect, deleteReview)

export default router
