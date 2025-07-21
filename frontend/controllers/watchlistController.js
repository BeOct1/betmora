// controllers/watchlistController.js
import Watchlist from '../models/Watchlist.js'

// @desc    Get user's watchlist
export const getWatchlist = async (req, res) => {
    const watchlist = await Watchlist.find({ user: req.user._id })
    res.json(watchlist)
}

// @desc    Add a movie to watchlist
export const addToWatchlist = async (req, res) => {
    const { tmdbId, title, poster_path, release_date } = req.body

    const movie = new Watchlist({
        user: req.user._id,
        tmdbId,
        title,
        poster_path,
        release_date
    })

    const createdMovie = await movie.save()
    res.status(201).json(createdMovie)
}

// @desc    Remove a movie from watchlist
export const removeFromWatchlist = async (req, res) => {
    const movie = await Watchlist.findById(req.params.id)

    if (movie) {
        if (movie.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        await movie.remove()
        res.json({ message: 'Movie removed from watchlist' })
    } else {
        res.status(404).json({ message: 'Movie not found' })
    }
}