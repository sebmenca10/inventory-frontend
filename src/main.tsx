import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { RouterProvider } from 'react-router-dom'
// console.log('APP MONTA')
// window.addEventListener('beforeunload', () => console.log('RELOAD REAL'))
// window.addEventListener('popstate', () => console.log('↩CAMBIO DE HISTORIAL'))

import { router } from '@/routes'
import { Toaster } from 'sonner'

// window.addEventListener('beforeunload', () => {
//   localStorage.setItem('reloadMarker', 'yes');
// });

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  // </React.StrictMode>
)
// if (localStorage.getItem('reloadMarker') === 'yes') {
//   alert('Esto fue un reload real del navegador');
//   localStorage.removeItem('reloadMarker');
// }

