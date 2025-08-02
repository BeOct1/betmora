import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors';
import movieRoutes from './routes/movieRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'

dotenv.config()

connectDB()

const app = express()

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:4173', 
  'https://betmora.onrender.com'
];

app.use(cors({ 
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/auth', authRoutes);

app.use('/api/movies', movieRoutes)
app.use('/api/watchlist', watchlistRoutes)
app.use('/api/favorites', favoriteRoutes)

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))