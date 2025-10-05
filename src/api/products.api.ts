import { api } from './client'

export type Product = {
    id: string
    name: string
    category: string
    price: number
    stock: number
    version: number
    createdAt: string
    updatedAt: string
}

export type PaginatedResponse<T> = {
    total: number
    page: number
    pageSize: number
    pages: number
    items: T[]
}

export async function getProducts(params?: {
    q?: string
    category?: string
    sort?: string
    order?: 'ASC' | 'DESC'
    page?: number
    pageSize?: number
    pages?: number
}): Promise<PaginatedResponse<Product>> {
    const { data } = await api.get('/products', { params })
    data.items = data.items.map((p: any) => ({
        ...p,
        price: Number(p.price),
    }))
    return data
}

export async function createProduct(data: {
    name: string
    category: string
    price: number
    stock: number
}) {
    const res = await api.post('/products', data)
    return res.data
}

export async function updateProduct(
    id: string,
    data: { name: string; category: string; price: number; stock: number }
) {
    const res = await api.patch(`/products/${id}`, data)
    return res.data
}

export async function deleteProduct(id: string) {
    await api.delete(`/products/${id}`)
}

export async function exportProducts() {
    const res = await api.get('/products/export', { responseType: 'blob' })
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'products.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
}

export async function importProducts(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
}

export async function getCategories(): Promise<string[]> {
    const { data } = await api.get('/products/categories')
    return data as string[]
}