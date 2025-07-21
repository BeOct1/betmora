// controllers/userController.js
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import Favorite from '../models/Favorite.js'
import Watchlist from '../models/Watchlist.js'
import Review from '../models/Review.js'

// @desc    Get current user's profile
export const getProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
}

// @desc    Update user profile
export const updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.username = req.body.username || user.username
    user.email = req.body.email || user.email

    if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10)
    }

    const updatedUser = await user.save()
    res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email
    })
}

// @desc    Get user's favorites
export const getFavorites = async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites')
    if (user) {
        res.json(user.favorites)
    } else {
        res.status(404).json({ message: 'User not found' })
    }
}

// @desc    Add a movie to favorites
export const addFavorite = async (req, res) => {
    const { tmdbId, title, poster_path, release_date } = req.body

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const favoriteExists = await Favorite.findOne({ user: req.user._id, tmdbId })
    if (favoriteExists) return res.status(400).json({ message: 'Movie already in favorites' })

    const favorite = new Favorite({
        user: req.user._id,
        tmdbId,
        title,
        poster_path,
        release_date
    })

    const createdFavorite = await favorite.save()
    user.favorites.push(createdFavorite._id)
    await user.save()
    res.status(201).json(createdFavorite)
}

// @desc    Remove a movie from favorites
export const removeFavorite = async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const favorite = await Favorite.findById(req.params.id)

    if (favorite) {
        if (favorite.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        await favorite.remove()
        user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.id)
        await user.save()
        res.json({ message: 'Movie removed from favorites' })
    } else {
        res.status(404).json({ message: 'Movie not found' })
    }
}

// @desc    Get user's watchlist
export const getWatchlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate('watchlist')
    if (user) {
        res.json(user.watchlist)
    } else {
        res.status(404).json({ message: 'User not found' })
    }
}

// @desc    Add a movie to watchlist
export const addWatchlist = async (req, res) => {
    const { tmdbId, title, poster_path, release_date } = req.body

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const watchlistExists = await Watchlist.findOne({ user: req.user._id, tmdbId })
    if (watchlistExists) return res.status(400).json({ message: 'Movie already in watchlist' })

    const watchlist = new Watchlist({
        user: req.user._id,
        tmdbId,
        title,
        poster_path,
        release_date
    })

    const createdWatchlist = await watchlist.save()
    user.watchlist.push(createdWatchlist._id)
    await user.save()
    res.status(201).json(createdWatchlist)
}

// @desc    Remove a movie from watchlist
export const removeWatchlist = async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const watchlist = await Watchlist.findById(req.params.id)

    if (watchlist) {
        if (watchlist.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        await watchlist.remove()
        user.watchlist = user.watchlist.filter(item => item.toString() !== req.params.id)
        await user.save()
        res.json({ message: 'Movie removed from watchlist' })
    } else {
        res.status(404).json({ message: 'Movie not found' })
    }
}

// @desc    Get user's reviews
export const getReviews = async (req, res) => {
    const reviews = await Review.find({ user: req.user._id })
    res.json(reviews)
}

// @desc    Add a review
export const addReview = async (req, res) => {
    const { tmdbId, rating, comment, title } = req.body

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const reviewExists = await Review.findOne({ user: req.user._id, tmdbId })
    if (reviewExists) return res.status(400).json({ message: 'You have already reviewed this movie' })

    const review = new Review({
        user: req.user._id,
        username: user.username,
        tmdbId,
        rating,
        comment,
        title
    })

    const createdReview = await review.save()
    res.status(201).json(createdReview)
}

// @desc    Update a review
export const updateReview = async (req, res) => {
    const { rating, comment } = req.body

    const review = await Review.findById(req.params.id)

    if (review) {
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        review.rating = rating || review.rating
        review.comment = comment || review.comment

        const updatedReview = await review.save()
        res.json(updatedReview)
    } else {
        res.status(404).json({ message: 'Review not found' })
    }
}

// @desc    Delete a review
export const deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.id)

    if (review) {
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        await review.remove()
        res.json({ message: 'Review removed' })
    } else {
        res.status(404).json({ message: 'Review not found' })
    }
}

