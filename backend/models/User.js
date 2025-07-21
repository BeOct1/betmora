// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Favorite'
            }
        ],
        watchlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Watchlist'
            }
        ]
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)
export default User
