import Follow from '../models/Follow.js'

export const followUser = async (req, res) => {
    const { userId } = req.params
    try {
        const follow = await Follow.create({
            follower: req.user._id,
            following: userId
        })
        res.status(201).json(follow)
    } catch (err) {
        res.status(500).json({ error: 'Failed to follow user' })
    }
}
export const unfollowUser = async (req, res) => {
    const { userId } = req.params
    try {
        await Follow.deleteOne({
            follower: req.user._id,
            following: userId
        })
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ error: 'Failed to unfollow user' })
    }
}
export const getFollowers = async (req, res) => {
    try {
        const followers = await Follow.find({ following: req.user._id })
            .populate('follower', 'username email')
        res.status(200).json(followers)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch followers' })
    }
}

export const getFollowing = async (req, res) => {
    try {
        const following = await Follow.find({ follower: req.user._id })
            .populate('following', 'username email')
        res.status(200).json(following)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch following' })
    }
}
