jest.mock('@/config/env', () => ({
  env: { API_URL: 'http://localhost:3000' },
}))
import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Silenciar warnings de React Router v7
const originalWarn = console.warn
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('React Router Future Flag Warning')
  ) {
    return
  }
  originalWarn(...args)
}