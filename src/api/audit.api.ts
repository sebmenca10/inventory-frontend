import { api } from './client'

export type AuditRecord = {
    id: string
    userId: string
    userEmail: string
    action: 'create' | 'update' | 'delete'
    entity: string
    entityId: string
    before?: Record<string, any>
    after?: Record<string, any>
    createdAt: string
}

export type PaginatedResponse<T> = {
    total: number
    page: number
    pageSize: number
    pages: number
    items: T[]
}

export async function getAudits(params?: {
    entity?: string
    userEmail?: string
    action?: string
    from?: string
    to?: string
    page?: number
    pageSize?: number
}): Promise<PaginatedResponse<AuditRecord>> {
    const { data } = await api.get('/audit', { params })
    return data as PaginatedResponse<AuditRecord>
}

export async function exportAudits() {
    const res = await api.get('/audit/export', { responseType: 'blob' })
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'auditoria.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
}