import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useState } from 'react'

export function ProtectedRoute({
  roles,
}: {
  roles?: Array<'admin' | 'operator' | 'viewer'>
}) {
  const { token, user } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const unsub = useAuthStore.persist?.onFinishHydration?.(() => setHydrated(true))
    if (useAuthStore.persist?.hasHydrated?.()) setHydrated(true)
    return () => unsub?.()
  }, [])

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-300">
        <div className="animate-pulse text-lg">Cargando sesión...</div>
      </div>
    )
  }

  if (!token && location.pathname === '/login') {
    return <Outlet />
  }

  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-100 gap-6">
        <div className="text-2xl font-semibold">🚫 Acceso denegado</div>
        <p className="text-gray-400">
          Tu rol <span className="font-bold">{user.role}</span> no tiene permisos para esta página.
        </p>
      </div>
    )
  }

  return <Outlet />
}