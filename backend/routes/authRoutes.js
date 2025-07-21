// routes/authRoutes.js
import express from 'express'
import { loginUser, registerUser, logoutUser } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route   POST /api/auth/register
router.post('/register', registerUser)

// @route   POST /api/auth/login
router.post('/login', loginUser)

// @route   POST /api/auth/logout
router.post('/logout', protect, logoutUser)

export default router
