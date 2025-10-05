import { render, screen, fireEvent } from '@testing-library/react'
import ProductFormModal from '@/components/ProductFormModal'

test('valida campos obligatorios', async () => {
  render(
    <ProductFormModal
      open={true}
      onClose={() => {}}
      onSuccess={() => {}}
    />
  )

  const button = screen.getByRole('button', { name: /crear/i })
  fireEvent.click(button)

  expect(await screen.findByText(/nombre requerido/i)).toBeInTheDocument()
})