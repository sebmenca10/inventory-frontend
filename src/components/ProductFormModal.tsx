import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProduct, updateProduct, getCategories } from '@/api/products.api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  category: z.string().min(2, 'Categoría requerida'),
  price: z.number().positive('Debe ser un número positivo'),
  stock: z.number().int().nonnegative('Debe ser un número entero positivo'),
})

type Form = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  product?: {
    id: string
    name: string
    category: string
    price: number
    stock: number
  }
  onSuccess: () => void
}

export default function ProductFormModal({ open, onClose, product, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? { ...product, price: Number(product.price) }
      : { name: '', category: '', price: 0, stock: 0 },
  })

  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch {
        console.warn('No se pudieron cargar categorías')
      }
    }
    load()
  }, [])

  const onSubmit = async (data: Form) => {
    try {
      if (product) {
        await updateProduct(product.id, data)
        toast.success('Producto actualizado correctamente')
      } else {
        await createProduct(data)
        toast.success('Producto creado correctamente')
      }
      onSuccess()
      onClose()
      reset()
    } catch (err: any) {
      toast.error('Error al guardar producto: ' + (err.response?.data?.message || err.message))
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">
          {product ? 'Editar producto' : 'Nuevo producto'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium">Nombre</label>
            <input
              {...register('name')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Categoría</label>
            <select
              {...register('category')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Precio</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              {errors.price && <p className="text-red-400 text-sm">{errors.price.message}</p>}
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Stock</label>
              <input
                type="number"
                {...register('stock', { valueAsNumber: true })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              {errors.stock && <p className="text-red-400 text-sm">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-500 hover:bg-gray-700 transition">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white flex items-center gap-2">
              {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
              {product ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}