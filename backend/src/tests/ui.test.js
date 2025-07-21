/* eslint-env jest */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('UI Tests', () => {
  test('renders navigation bar with logo and links', () => {
    render(<App />, { wrapper: MemoryRouter })
    expect(screen.getByText(/Betmora/i)).toBeInTheDocument()
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
    expect(screen.getByText(/Register/i)).toBeInTheDocument()
  })

  test('can navigate to Register page and submit form', async () => {
    render(<App />, { wrapper: MemoryRouter })
    fireEvent.click(screen.getByText(/Register/i))
    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'testuser@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'TestPass123' } })
    fireEvent.change(screen.getByLabelText(/Confirm Password:/i), { target: { value: 'TestPass123' } })

    fireEvent.click(screen.getByRole('button', { name: /Register/i }))

    await waitFor(() => {
      expect(screen.getByText(/Registration successful!/i)).toBeInTheDocument()
    })
  })

  test('can navigate to Profile page and display user info', async () => {
    render(<App />, { wrapper: MemoryRouter })
    fireEvent.click(screen.getByText(/Profile/i))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /User Profile/i })).toBeInTheDocument()
    })
  })
})
