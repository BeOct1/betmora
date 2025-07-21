// models/Review.js
import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    tmdbId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)
export default Review
