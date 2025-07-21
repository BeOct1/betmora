// controllers/authController.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

// @desc    Register a new user
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({ username, email, password: hashedPassword })

    const token = createToken(user._id)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email
    })
}

// @desc    Login user
export const loginUser = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = createToken(user._id)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

// @desc    Logout user
export const logoutUser = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ message: 'Logged out successfully' })
} 
