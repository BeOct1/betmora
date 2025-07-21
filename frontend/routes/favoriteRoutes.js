// routes/favoriteRoutes.js
import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getFavorites, addToFavorites, removeFromFavorites } from '../controllers/favoriteController.js'

const router = express.Router()

router.route('/').get(protect, getFavorites).post(protect, addToFavorites)
router.route('/:id').delete(protect, removeFromFavorites)

export default router
