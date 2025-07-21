import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import ProfilePage from './pages/ProfilePage'
import WatchlistPage from './pages/WatchlistPage'
import ReviewsPage from './pages/ReviewsPage'
import SearchPage from './pages/SearchPage'
import { AuthProvider } from './context/AuthContext.jsx'
import AuthContext from './context/AuthContext.js'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  if (!user) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <NavigationBar />
      <div className="container text-center py-3">
        {user ? (
          <h1 className="display-6">Welcome, {user.username}!</h1>
        ) : (
          <h1 className="display-6">Welcome to Bitrus Edward Movie Recommendation App | Betmora</h1>
        )}
        <p className="lead">Your gateway to the best movies and recommendations.</p>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/movies/:id"
          element={
            <ProtectedRoute>
              <MovieDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  )
}

export default App
