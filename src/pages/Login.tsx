import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@/api/auth.api'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'
import { useEffect } from 'react'

const schema = z.object({
    email: z.string().email('Correo inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type Form = z.infer<typeof schema>

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Form>({ resolver: zodResolver(schema) })

    const setSession = useAuthStore((s) => s.setSession)
    const navigate = useNavigate()

    const onSubmit = async (data: Form) => {
        try {
            const res = await login(data.email, data.password)
            const token = res.access_token

            if (!token || typeof token !== 'string') {
                throw new Error('Token inválido o ausente en la respuesta del servidor')
            }

            const decoded: any = jwtDecode(token)
            const user = {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role,
            }

            setSession({ token, refreshToken: null, user })
            toast.success('Sesión iniciada correctamente ✅')
            navigate('/', { replace: true })
        } catch (err: any) {
            console.error('Error login:', err)
            toast.error(
                'Error al iniciar sesión: ' +
                (err.response?.data?.message || err.message || 'Credenciales inválidas')
            )
        }
    }

    // useEffect(() => {
    //     const onBeforeUnload = () => console.warn('PAGE UNLOADING (reload o navegación real)')
    //     const onSubmitNative = (e: SubmitEvent) => console.warn('SUBMIT NATIVO', e)
    //     const onClick = (e: MouseEvent) => {
    //         const el = e.target as HTMLElement
    //         if (el && el.tagName === 'BUTTON') console.log('CLICK EN BOTÓN', el)
    //     }

    //     window.addEventListener('beforeunload', onBeforeUnload)
    //     window.addEventListener('submit', onSubmitNative)
    //     window.addEventListener('click', onClick)
    //     return () => {
    //         window.removeEventListener('beforeunload', onBeforeUnload)
    //         window.removeEventListener('submit', onSubmitNative)
    //         window.removeEventListener('click', onClick)
    //     }
    // }, [])


    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
            <div className="bg-gray-800/90 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8">Iniciar sesión</h1>

                <div
                    className="space-y-6"
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register('email')}/>
                        {errors.email && (
                            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Contraseña</label>
                        <input
                            type="password"
                            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register('password')}/>
                        {errors.password && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSubmit(onSubmit)()} // 🔥 lanzamos el submit de React Hook Form manualmente
                        className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2.5 rounded-lg font-semibold shadow-md ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                            }`}>
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Ingresando...
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

