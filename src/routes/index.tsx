import { createHashRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import AppLayout from '@/layouts/AppLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Products from '@/pages/Products'
import Users from '@/pages/Users'
import Audit from '@/pages/Audit'

export const router = createHashRouter([
  { path: '/login', element: <Login /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/products', element: <Products /> },
          {
            path: '/users',
            element: <ProtectedRoute roles={['admin']} />,
            children: [{ path: '', element: <Users /> }],
          },
          {
            path: '/audit',
            element: <ProtectedRoute roles={['admin', 'operator']} />,
            children: [{ path: '', element: <Audit /> }],
          },
        ],
      },
    ],
  },
])