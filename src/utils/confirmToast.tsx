import { toast } from 'react-toastify'
import React from 'react'

export function confirmToast(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const id = toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3 text-center">
          <p className="text-sm font-medium">{message}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                resolve(true)
                closeToast?.()
              }}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
              Sí
            </button>
            <button
              onClick={() => {
                resolve(false)
                closeToast?.()
              }}
              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
              No
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
        theme: 'dark',
      }
    )
  })
}