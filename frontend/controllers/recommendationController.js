import Rating from '../models/Rating.js'
import { getMovieDetails } from '../utils/tmdb.js'

export const getRecommendations = async (req, res) => {
    const userId = req.user._id.toString()

    try {
        // Step 1: Get movies the current user rated
        const userRatings = await Rating.find({ user: userId })

        const userRatedMovieIds = userRatings.map(r => r.movieId)

        // Step 2: Find other users who rated the same movies
        const similarRatings = await Rating.find({
            movieId: { $in: userRatedMovieIds },
            user: { $ne: userId }
        })

        // Step 3: Identify user's preferred genres based on highly-rated movies
        const userHighRatedMovies = userRatings.filter(r => r.rating >= 7); // Using 7 as a higher threshold for 'liked'
        const userHighRatedTmdbIds = userHighRatedMovies.map(r => r.movieId);

        let preferredGenres = [];
        if (userHighRatedTmdbIds.length > 0) {
            const userHighRatedMovieDetails = await Promise.all(
                userHighRatedTmdbIds.map(id => getMovieDetails(id))
            );
            const genreCounts = {};
            userHighRatedMovieDetails.forEach(movie => {
                if (movie && movie.genres) {
                    movie.genres.forEach(genre => {
                        genreCounts[genre.id] = (genreCounts[genre.id] || 0) + 1;
                    });
                }
            });
            preferredGenres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]).slice(0, 3);
        }

        // Step 4: Count movies these similar users liked, prioritizing preferred genres
        const recommendedScores = {}

        for (const rating of similarRatings) {
            if (rating.rating >= 7 && !userRatedMovieIds.includes(rating.movieId)) {
                // Fetch movie details for genre information
                const movieDetails = await getMovieDetails(rating.movieId);
                let score = 1;
                if (movieDetails && movieDetails.genres) {
                    const movieGenreIds = movieDetails.genres.map(g => g.id.toString());
                    const hasPreferredGenre = movieGenreIds.some(genreId => preferredGenres.includes(genreId));
                    if (hasPreferredGenre) {
                        score += 2; // Boost score for preferred genres
                    }
                }
                if (!recommendedScores[rating.movieId]) {
                    recommendedScores[rating.movieId] = 0
                }
                recommendedScores[rating.movieId] += score;
            }
        }

        // Step 5: Sort by highest score and take top N
        const sortedMovieIds = Object.keys(recommendedScores)
            .sort((a, b) => recommendedScores[b] - recommendedScores[a])
            .slice(0, 10)

        // Step 6: Fetch movie details from TMDB
        const movies = await Promise.all(
            sortedMovieIds.map((id) => getMovieDetails(id))
        )

        res.json({ recommendations: movies })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to generate recommendations' })
    }
}
