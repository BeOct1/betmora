// routes/watchlistRoutes.js
import express from 'express'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route   GET /api/watchlist
router.get('/', protect, getWatchlist)

// @route   POST /api/watchlist
router.post('/', protect, addToWatchlist)

// @route   DELETE /api/watchlist/:tmdbId
router.delete('/:tmdbId', protect, removeFromWatchlist)

export default router
