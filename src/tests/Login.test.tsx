import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '@/pages/Login'
import '@testing-library/jest-dom'

test('renderiza formulario de login', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

  expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument()
})