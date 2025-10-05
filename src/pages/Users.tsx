import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { Users as UsersIcon, Loader2, PlusCircle } from 'lucide-react'
import { getUsers, User } from '@/api/users.api'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import UserFormModal from '@/components/UserFormModal'

export default function Users() {
  const { user } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  async function fetchUsers() {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <PageHeader
        title="Gestión de usuarios"
        subtitle="Administra los usuarios del sistema"
        icon={<UsersIcon />}/>

      {/* Botón Nuevo usuario */}
      {user?.role === 'admin' && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
            <PlusCircle className="h-5 w-5" /> Nuevo usuario
          </button>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-gray-400 text-center py-10">No se encontraron usuarios</div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-md border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-300 text-sm uppercase">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Correo</th>
                <th className="px-6 py-3">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3 capitalize">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchUsers}/>
    </>
  )
}