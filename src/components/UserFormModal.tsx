import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUser } from '@/api/users.api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Contraseña mínima de 6 caracteres'),
  role: z.enum(['admin', 'operator', 'viewer']),
})

type Form = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UserFormModal({ open, onClose, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', role: 'viewer' },
  })

  if (!open) return null

  const onSubmit = async (data: Form) => {
    try {
      await createUser(data)
      toast.success('Usuario creado correctamente')
      onSuccess()
      onClose()
      reset()
    } catch (err: any) {
      toast.error('Error al crear usuario: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">Nuevo usuario</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Correo</label>
            <input
              type="email"
              {...register('email')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"/>
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              {...register('password')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"/>
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Rol</label>
            <select
              {...register('role')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2">
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="viewer">Viewer</option>
            </select>
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
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}