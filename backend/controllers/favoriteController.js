// controllers/favoriteController.js
import Favorite from '../models/Favorite.js'

// @desc    Get user's favorites
export const getFavorites = async (req, res) => {
    const favorites = await Favorite.find({ user: req.user._id })
    res.json(favorites)
}

// @desc    Add a movie to favorites
export const addToFavorites = async (req, res) => {
    const { tmdbId, title, poster_path, release_date } = req.body

    const movie = new Favorite({
        user: req.user._id,
        tmdbId,
        title,
        poster_path,
        release_date
    })

    const createdMovie = await movie.save()
    res.status(201).json(createdMovie)
}

// @desc    Remove a movie from favorites
export const removeFromFavorites = async (req, res) => {
    const movie = await Favorite.findById(req.params.id)

    if (movie) {
        if (movie.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        await movie.remove()
        res.json({ message: 'Movie removed from favorites' })
    } else {
        res.status(404).json({ message: 'Movie not found' })
    }
}
