import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
    id: string
    email: string
    role: 'admin' | 'operator' | 'viewer'
}

type Session = {
    token: string | null
    refreshToken: string | null
    user?: User
}

type AuthState = Session & {
    setSession: (s: Session) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            user: undefined,
            setSession: (s) => set(s),
            logout: () => {
                set({ token: null, refreshToken: null, user: undefined })
                localStorage.removeItem('auth-storage')
            },
        }),
        {
            name: 'auth-storage',
        }
    )
)