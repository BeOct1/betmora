import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5001/api/auth',
  withCredentials: true,
})

export const testRegisterUser = async () => {
  try {
    const response = await api.post('/register', {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'TestPass123',
    })
    console.log('Register User Test Passed:', response.data)
  } catch (error) {
    console.error('Register User Test Failed:', error.response?.data || error.message)
  }
}

export const testLoginUser = async () => {
  try {
    const response = await api.post('/login', {
      email: 'testuser@example.com',
      password: 'TestPass123',
    })
    console.log('Login User Test Passed:', response.data)
  } catch (error) {
    console.error('Login User Test Failed:', error.response?.data || error.message)
  }
}

export const testLogoutUser = async () => {
  try {
    const response = await api.post('/logout')
    console.log('Logout User Test Passed:', response.data)
  } catch (error) {
    console.error('Logout User Test Failed:', error.response?.data || error.message)
  }
}

const runAuthTests = async () => {
  await testRegisterUser()
  await testLoginUser()
  await testLogoutUser()
}

runAuthTests()
