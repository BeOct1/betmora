import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

      try {
        await axios.post('/api/auth/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password
        }, { withCredentials: true })
        setSuccess('Registration successful! You can now log in.')
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed')
      }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card bg-dark text-white p-4">
            <h1 className="card-title text-center mb-4">Register</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="usernameInput" className="form-label">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="usernameInput"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordInput"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPasswordInput"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
            <p className="text-center mt-3">
              Already have an account? <Link to="/login" className="text-danger">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

