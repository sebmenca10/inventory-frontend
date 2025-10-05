import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { FileSearch, Loader2, Download, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { getAudits, exportAudits, AuditRecord } from '@/api/audit.api'
import dayjs from 'dayjs'

export default function Audit() {
  const { user } = useAuthStore()
  const [records, setRecords] = useState<AuditRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    entity: '',
    userEmail: '',
    action: '',
    from: '',
    to: '',
  })
  const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 10 })

  if (user?.role !== 'admin') {
    return (
      <div className="text-center text-gray-300 mt-10 text-lg">
        🚫 No tienes permisos para acceder a esta sección
      </div>
    )
  }

  async function fetchAudits(page = 1) {
    try {
      setLoading(true)
      const data = await getAudits({
        ...filters,
        page,
        pageSize: pagination.pageSize,
      })
      setRecords(data.items)
      setPagination({ total: data.total, page: data.page, pageSize: data.pageSize })
    } catch (err) {
      toast.error('Error al cargar auditorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAudits(pagination.page)
  }, [pagination.page])

  const handleFilter = () => {
    setPagination((p) => ({ ...p, page: 1 }))
    fetchAudits(1)
  }

  return (
    <>
      <PageHeader
        title="Auditoría del sistema"
        subtitle="Registro de acciones realizadas en el sistema"
        icon={<FileSearch />}/>

      {/* Filtros */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Entidad (Product, User...)"
            value={filters.entity}
            onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500"/>
          <input
            type="text"
            placeholder="Correo del usuario"
            value={filters.userEmail}
            onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500"/>
          <select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100">
            <option value="">Acción</option>
            <option value="create">create</option>
            <option value="update">update</option>
            <option value="delete">delete</option>
          </select>
          <input
            type="date"
            value={filters.from ? dayjs(filters.from).format('YYYY-MM-DD') : ''}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100"/>
          <input
            type="date"
            value={filters.to ? dayjs(filters.to).format('YYYY-MM-DD') : ''}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100"/>
          <button
            onClick={handleFilter}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold">
            <Filter className="h-4 w-4" /> Filtrar
          </button>
        </div>
      </div>

      {/* Exportar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportAudits}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg shadow-md transition">
          <Download className="h-5 w-5" /> Exportar CSV
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
        </div>
      ) : records.length === 0 ? (
        <div className="text-gray-400 text-center py-10">No se encontraron registros</div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-md border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-300 text-sm uppercase">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Entidad</th>
                <th className="px-4 py-3">Cambios</th>
              </tr>
            </thead>
            <tbody>
              {records.map((a) => (
                <tr key={a.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="px-4 py-3 text-gray-400">
                    {dayjs(a.createdAt).format('YYYY-MM-DD HH:mm')}
                  </td>
                  <td className="px-4 py-3">{a.userEmail}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${a.action === 'create'
                        ? 'text-green-400'
                        : a.action === 'update'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                    {a.action}
                  </td>
                  <td className="px-4 py-3">{a.entity}</td>
                  <td className="px-4 py-3">
                    <details className="cursor-pointer">
                      <summary className="text-blue-400 hover:underline">Ver cambios</summary>
                      <pre className="bg-gray-900 rounded-lg p-2 text-xs mt-2 text-gray-300 overflow-x-auto">
                        {JSON.stringify({ before: a.before, after: a.after }, null, 2)}
                      </pre>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {!loading && pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-center gap-4 mt-6 text-gray-300">
          <button
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((p) => ({
                ...p,
                page: Math.max(1, p.page - 1),
              }))
            }
            className={`px-3 py-1 rounded-lg border border-gray-600 ${pagination.page === 1
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-gray-700 transition'
              }`}>
            ⬅️ Anterior
          </button>

          <span>
            Página <strong>{pagination.page}</strong> de{' '}
            {Math.ceil(pagination.total / pagination.pageSize)}
          </span>

          <button
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
            onClick={() =>
              setPagination((p) => ({
                ...p,
                page: Math.min(
                  Math.ceil(p.total / p.pageSize),
                  p.page + 1
                ),
              }))
            }
            className={`px-3 py-1 rounded-lg border border-gray-600 ${pagination.page >= Math.ceil(pagination.total / pagination.pageSize)
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-gray-700 transition'
              }`}>
            Siguiente ➡️
          </button>
        </div>
      )}
    </>
  )
}