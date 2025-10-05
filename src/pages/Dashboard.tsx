import { useEffect, useState } from 'react'
import { getDashboardStats, getInventoryMovements } from '@/api/dashboard.api'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts'
import PageHeader from '@/components/PageHeader'
import { BarChart3 } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState<{ products: number; stock: number; users: number } | null>(null)
  const [movements, setMovements] = useState<
    { date: string; entries: number; exits: number }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const statsData = await getDashboardStats()
        const movementsData = await getInventoryMovements()
        setStats(statsData)
        setMovements(movementsData)
      } catch (err) {
        toast.error('Error al cargar datos del dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {/* 🔹 Encabezado visual del módulo */}
      <PageHeader
        title="Dashboard general"
        subtitle="Resumen general de inventario y movimientos"
        icon={<BarChart3 />}/>

      {/* Tarjetas dinámicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
          </div>
        ) : (
          <>
            <div className="bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition w-full">
              <p className="text-gray-400 text-sm mb-2">Productos totales</p>
              <h2 className="text-4xl font-bold">{stats?.products ?? 0}</h2>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition w-full">
              <p className="text-gray-400 text-sm mb-2">Stock general</p>
              <h2 className="text-4xl font-bold">{stats?.stock ?? 0}</h2>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition w-full">
              <p className="text-gray-400 text-sm mb-2">Usuarios registrados</p>
              <h2 className="text-4xl font-bold">{stats?.users ?? 0}</h2>
            </div>
          </>
        )}
      </div>

      {/* Gráfico */}
      <section className="mt-10 bg-gray-800 rounded-xl p-8 shadow-md w-full">
        <h3 className="text-2xl font-semibold mb-4">Resumen de movimientos</h3>
        {movements.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-gray-500 text-lg">
            Sin datos de movimientos
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={movements.map((m) => ({
                  ...m,
                  balance: m.entries - m.exits,
                }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    color: '#F3F4F6',
                  }}
                  cursor={{ fill: '#374151' }}/>
                <Legend />
                <Bar dataKey="entries" barSize={25} fill="#3B82F6" name="Entradas" />
                <Bar dataKey="exits" barSize={25} fill="#F87171" name="Salidas" />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Balance"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </>
  )
}