import { Link, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AppLayout() {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 p-4 flex items-center justify-between bg-gray-900">
        <nav className="flex gap-4">
          <Link to="/" className="hover:text-blue-400 transition">
            Dashboard
          </Link>
          <Link to="/products" className="hover:text-blue-400 transition">
            Productos
          </Link>
          <Link to="/audit" className="hover:text-blue-400 transition">
            Auditoría
          </Link>
          {user?.role === 'admin' && (
            <Link to="/users" className="hover:text-blue-400 transition">
              Usuarios
            </Link>
          )}
        </nav>
        <button
          onClick={logout}
          className="px-3 py-1 border border-gray-700 rounded hover:bg-gray-800 transition"
        >
          Logout
        </button>
      </header>

      <main className="p-4 flex-1 container mx-auto">
        <Outlet />
      </main>

      {/* Contenedor global de toasts */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}