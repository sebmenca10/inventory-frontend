import { render, screen } from '@testing-library/react'
import Login from '@/pages/Login'


test('renderiza formulario de login', () => {
    render(<Login />)
    expect(screen.getByText(/login/i)).toBeInTheDocument()
})