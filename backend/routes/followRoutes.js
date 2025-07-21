import express from 'express'
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/followController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/:userId').post(protect, followUser).delete(protect, unfollowUser)
router.route('/followers').get(protect, getFollowers)
router.route('/following').get(protect, getFollowing)

export default router