// controllers/reviewController.js
import Review from '../models/Review.js'
import Rating from '../models/Rating.js'
import { getMovieDetails } from '../utils/tmdb.js'

// @desc    Create a new review
export const createReview = async (req, res) => {
    const { tmdbId, rating, comment } = req.body

    const review = new Review({
        user: req.user._id,
        username: req.user.username,
        tmdbId,
        rating,
        comment
    })

    const createdReview = await review.save()
    res.status(201).json(createdReview)
}

// @desc    Get reviews by movie ID
export const getReviewsByMovie = async (req, res) => {
    const { tmdbId } = req.params
    const reviews = await Review.find({ tmdbId }).sort({ createdAt: -1 })
    res.json(reviews)
}

// @desc    Update a review
export const updateReview = async (req, res) => {
    const { id } = req.params
    const { rating, comment } = req.body

    const review = await Review.findById(id)

    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (review.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' })

    review.rating = rating
    review.comment = comment
    const updated = await review.save()
    res.json(updated)
}

// @desc    Delete a review
export const deleteReview = async (req, res) => {
    const { id } = req.params
    const review = await Review.findById(id)

    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (review.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' })

    await review.deleteOne()
    res.json({ message: 'Review deleted' })
}

// GET /api/ratings/mine
export const getUserRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ user: req.user._id }).sort({ createdAt: -1 })

        // Fetch movie titles in parallel from TMDB
        const detailedRatings = await Promise.all(
            ratings.map(async (rating) => {
                const movieDetails = await getMovieDetails(rating.movieId)
                return {
                    _id: rating._id,
                    movieId: rating.movieId,
                    rating: rating.rating,
                    movieTitle: movieDetails.title,
                }
            })
        )

        res.json(detailedRatings)
    } catch (err) {
        console.error('Error fetching user ratings:', err)
        res.status(500).json({ message: 'Failed to fetch user ratings' })
    }
  }
  
// @desc    Submit a rating (example implementation)
export const submitRating = async (req, res) => {
    const { movieId, rating } = req.body;
    // Your logic to create or update a rating
    try {
        let ratingDoc = await Rating.findOne({ user: req.user._id, movieId });
        if (ratingDoc) {
            ratingDoc.rating = rating;
            await ratingDoc.save();
        } else {
            ratingDoc = new Rating({ user: req.user._id, movieId, rating });
            await ratingDoc.save();
        }
        res.status(200).json(ratingDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit rating' });
    }
}
  