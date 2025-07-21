// models/Watchlist.js
import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tmdbId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    poster_path: {
        type: String
    },
    release_date: {
        type: String
    }
}, {
    timestamps: true
})

const Watchlist = mongoose.model('Watchlist', movieSchema)
export default Watchlist
