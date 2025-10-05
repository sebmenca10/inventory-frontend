import { render, screen, fireEvent } from '@testing-library/react'
import ProductForm from '@/components/ProductFormModal'


test('valida campos obligatorios', async () => {
    render(<ProductForm onSubmit={() => { }} />)
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))
    expect(await screen.findByText(/Nombre es requerido/i)).toBeInTheDocument()
})