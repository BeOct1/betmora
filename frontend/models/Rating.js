import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        movieId: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 10 },
        review: { type: String },
    },
    { timestamps: true }
)

const Rating = mongoose.model('Rating', ratingSchema)
export default Rating
export const getUserRatings = async (userId) => {
    return await Rating.find({ user: userId }).populate('user', 'username')
}
export const getMovieRatings = async (movieId) => {
    return await Rating.find({ movieId }).populate('user', 'username')
}
