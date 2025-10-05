import { api } from './client'

export async function getDashboardStats() {
    const { data } = await api.get('/dashboard')
    return data as {
        products: number
        stock: number
        users: number
    }
}

export async function getInventoryMovements() {
    const { data } = await api.get('/dashboard/movements')
    return data as { date: string; entries: number; exits: number }[]
}