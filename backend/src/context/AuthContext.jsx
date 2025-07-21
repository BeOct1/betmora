import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AuthContext from './AuthContext'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    console.log('AuthContext useEffect - token:', token);
    console.log('AuthContext useEffect - storedUser:', storedUser);
    if (token) {
      try {
        const parsedUser = storedUser && storedUser !== 'undefined' && storedUser !== 'null' ? JSON.parse(storedUser) : null;
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
  }, [])

  const login = (token, userData) => {
    console.log('AuthContext login - token:', token);
    console.log('AuthContext login - userData:', userData);
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    navigate('/')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user'); // Ensure user is also removed
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
