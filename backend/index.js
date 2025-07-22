// index.js - Entry Point for Backend API
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Import routes
import authRoutes from './routes/authRoutes.js'
import movieRoutes from './routes/movieRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import userRoutes from './routes/userRoutes.js'
import followRoutes from './routes/followRoutes.js'
import recommendationRoutes from './routes/recommendationRoutes.js'

// Import DB connection helper
import { connectDB, disconnectDB } from './config/db.js'

const app = express()

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Health check route
app.get('/', (req, res) => {
    res.send('🎬 Bemora APP is running')
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/users', userRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/recommendations', recommendationRoutes)

const PORT = process.env.PORT || 5001

// Connect to DB and start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err)
        process.exit(1) // exit process on DB connection failure
    })

// Optional: Graceful shutdown
process.on('SIGINT', async () => {
    console.log('SIGINT received: closing server')
    await disconnectDB()
    process.exit(0)
})
