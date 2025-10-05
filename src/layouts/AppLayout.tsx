import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info('Sesión cerrada correctamente')
    navigate('/login')
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-900 text-gray-100 overflow-x-hidden">
      <ToastContainer />
      {/* HEADER GLOBAL */}
      <header className="flex items-center justify-between px-10 py-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
        {/* Logo / Nombre */}
        <div className="text-2xl font-bold tracking-wide flex items-center gap-2 text-blue-400">
          <span role="img" aria-label="box">📦</span> Inventory App
        </div>

        {/* Menú de navegación */}
        <nav className="flex gap-8 items-center text-sm font-medium">
          <Link
            to="/"
            className="hover:text-blue-400 transition-colors">
            Dashboard
          </Link>

          <Link
            to="/products"
            className="hover:text-blue-400 transition-colors">
            Productos
          </Link>

          {/* visible para operator y admin */}
          {(user?.role === 'admin' || user?.role === 'operator') && (
            <Link
              to="/audit"
              className="hover:text-blue-400 transition-colors">
              Auditoría
            </Link>
          )}

          {/* solo admin */}
          {user?.role === 'admin' && (
            <Link
              to="/users"
              className="hover:text-blue-400 transition-colors">
              Usuarios
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
            Cerrar sesión
          </button>
        </nav>
      </header>

      {/* CONTENIDO (cambia según el módulo) */}
      <main className="flex-1 w-full px-10 py-8">
        <Outlet />
      </main>

      {/* FOOTER GLOBAL */}
      <footer className="bg-gray-800 border-t border-gray-700 text-gray-400 text-sm py-4 flex flex-col sm:flex-row items-center justify-between px-10">
        <p>© {new Date().getFullYear()} Inventory App — Todos los derechos reservados.</p>

        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Inicio
          </Link>
          <a
            href="https://github.com/sebmenca10/inventory-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors">
            Repositorio
          </a>
          <a
            href="mailto:soporte@inventoryapp.com"
            className="hover:text-blue-400 transition-colors">
            Soporte
          </a>
        </div>
      </footer>
    </div>
  )
}