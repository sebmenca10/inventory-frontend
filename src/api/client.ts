import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: false,
})

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response } = error
    if (response?.status === 401) {
      // intentar refresh
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        if (!refreshToken) throw new Error('No refresh token')
        const r = await api.post('/auth/refresh', { refreshToken })
        useAuthStore.getState().setSession({ token: r.data.accessToken, refreshToken })
        error.config.headers.Authorization = `Bearer ${r.data.accessToken}`
        return api.request(error.config)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)