import { api } from './client'

export type User = {
  id: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  createdAt?: string
  updatedAt?: string
}

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get('/users')
  return data as User[]
}

export async function createUser(data: {
  email: string
  password: string
  role: 'admin' | 'operator' | 'viewer'
}) {
  const res = await api.post('/users', data)
  return res.data as User
}