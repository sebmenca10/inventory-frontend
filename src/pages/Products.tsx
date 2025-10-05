import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { Package, Loader2, PlusCircle, Trash2, Edit3, Search, Upload, Download, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { getProducts, deleteProduct, exportProducts, importProducts } from '@/api/products.api'
import ProductFormModal from '@/components/ProductFormModal'
import ImportResultModal from '@/components/ImportResultModal'
import { useAuthStore } from '@/store/useAuthStore'
import { confirmToast } from '@/utils/confirmToast'
import { getCategories } from '@/api/products.api'

export default function Products() {
    const { user } = useAuthStore()

    const [products, setProducts] = useState<
        { id: string; name: string; category: string; price: number; stock: number }[]
    >([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 10, pages: 1 })
    const [categories, setCategories] = useState<string[]>([])

    // Filtros avanzados del backend
    const [filters, setFilters] = useState<{
        q: string
        category: string
        sort: string
        order: 'ASC' | 'DESC'
    }>({
        q: '',
        category: '',
        sort: 'createdAt',
        order: 'DESC',
    })

    // Modales y estados auxiliares
    const [modalOpen, setModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [importResult, setImportResult] = useState<any>(null)
    const [resultOpen, setResultOpen] = useState(false)

    // Cargar productos
    async function fetchProducts(page: number = 1) {
        page = Number(page)
        if (isNaN(page)) page = 1
        if (page < 1) page = 1
        if (page > pagination.pages && pagination.pages > 0) {
            page = pagination.pages
        }

        try {
            setLoading(true)
            const data = await getProducts({
                ...filters,
                page,
                pageSize: pagination.pageSize,
            })

            setProducts(data.items.map((p) => ({ ...p, price: Number(p.price) })))
            setPagination({
                total: data.total,
                page: Number(data.page),
                pageSize: Number(data.pageSize),
                pages: Number(data.pages),
            })
        } catch (err) {
            toast.error('Error al cargar productos')
        } finally {
            setLoading(false)
        }
    }

    async function loadCategories() {
        try {
            const data = await getCategories()
            setCategories(data)
        } catch (err) {
            console.warn('Error al cargar categorías')
        }
    }

    useEffect(() => {
        loadCategories()
        fetchProducts(1)
    }, [])

    const handleDelete = async (id: string) => {
        const confirmed = await confirmToast('¿Seguro de eliminar este producto?')
        if (!confirmed) return

        try {
            await deleteProduct(id)
            toast.success('Producto eliminado correctamente')
            fetchProducts(pagination.page)
        } catch (err) {
            toast.error('Error al eliminar producto')
        }
    }

    const handleFilter = () => {
        setPagination((p) => ({ ...p, page: 1 }))
        fetchProducts(1)
    }

    return (
        <>
            {/* Encabezado */}
            <PageHeader
                title="Gestión de productos"
                subtitle="Administra el catálogo y existencias del inventario"
                icon={<Package />} />

            {/* Filtros avanzados */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6 shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={filters.q}
                        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500" />
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500">
                        <option value="">Todas las categorías</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.sort}
                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100">
                        <option value="createdAt">Fecha creación</option>
                        <option value="price">Precio</option>
                        <option value="stock">Stock</option>
                    </select>
                    <select
                        value={filters.order}
                        onChange={(e) => setFilters({ ...filters, order: e.target.value as 'ASC' | 'DESC' })}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100">
                        <option value="DESC">Descendente</option>
                        <option value="ASC">Ascendente</option>
                    </select>
                    <button
                        onClick={handleFilter}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                        <Filter className="h-4 w-4" /> Buscar
                    </button>
                </div>
            </div>

            {/* Acciones globales */}
            <div className="flex items-center justify-end mb-6 gap-3">
                {/* Exportar CSV */}
                <button
                    onClick={exportProducts}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg shadow-md transition">
                    <Download className="h-5 w-5" /> Exportar CSV
                </button>

                {/* Importar CSV (solo admin) */}
                {user?.role === 'admin' && (
                    <label className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-lg shadow-md transition cursor-pointer">
                        <Upload className="h-5 w-5" /> Importar CSV
                        <input
                            type="file"
                            accept=".csv"
                            onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                try {
                                    const result = await importProducts(file)
                                    setImportResult(result)
                                    setResultOpen(true)
                                    toast.success(
                                        `Importación completada: ${result.inserted}/${result.totalRows} filas válidas`
                                    )

                                    if (result.invalid > 0) {
                                        console.warn('Detalles de filas inválidas:', result.invalidDetails)
                                        toast.warning(`${result.invalid} filas fueron inválidas.`, { duration: 7000 })
                                    }

                                    fetchProducts(pagination.page)
                                } catch (err) {
                                    toast.error('Error al importar productos')
                                } finally {
                                    e.target.value = ''
                                }
                            }}
                            className="hidden"/>
                    </label>
                )}

                {/* Nuevo producto (solo admin) */}
                {user?.role === 'admin' && (
                    <button
                        onClick={() => {
                            setEditingProduct(null)
                            setModalOpen(true)
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                        <PlusCircle className="h-5 w-5" /> Nuevo producto
                    </button>
                )}
            </div>

            {/* Tabla */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
                </div>
            ) : products.length === 0 ? (
                <div className="text-gray-400 text-center py-10">No se encontraron productos</div>
            ) : (
                <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-md border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 text-gray-300 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Categoría</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3">Precio</th>
                                {user?.role === 'admin' && <th className="px-6 py-3 text-center">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => (
                                <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                                    <td className="px-6 py-3 font-medium">{p.name}</td>
                                    <td className="px-6 py-3">{p.category}</td>
                                    <td className="px-6 py-3">{p.stock}</td>
                                    <td className="px-6 py-3">${p.price.toLocaleString()}</td>
                                    {user?.role === 'admin' && (
                                        <td className="px-6 py-3 flex justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(p)
                                                    setModalOpen(true)
                                                }}
                                                className="text-blue-400 hover:text-blue-300 transition">
                                                <Edit3 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="text-red-400 hover:text-red-300 transition">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Paginación */}
            {!loading && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6 text-gray-300">
                    <button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchProducts(pagination.page - 1)}
                        className={`px-3 py-1 rounded-lg border border-gray-600 ${pagination.page <= 1
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-gray-700 transition'
                            }`}>
                        ⬅️ Anterior
                    </button>

                    <span>
                        Página <strong>{pagination.page}</strong> de{' '}
                        <strong>{pagination.pages}</strong>
                    </span>

                    <button
                        disabled={pagination.page >= pagination.pages}
                        onClick={() => fetchProducts(pagination.page + 1)}
                        className={`px-3 py-1 rounded-lg border border-gray-600 ${pagination.page >= pagination.pages
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-gray-700 transition'
                            }`}>
                        Siguiente ➡️
                    </button>
                </div>
            )}

            {/* Modales */}
            <ProductFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                product={editingProduct}
                onSuccess={() => fetchProducts(pagination.page)}/>

            <ImportResultModal
                open={resultOpen}
                onClose={() => setResultOpen(false)}
                result={importResult}/>
        </>
    )
}