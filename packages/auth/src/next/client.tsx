'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  userId: string
  roles: string[]
}

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export interface CreateAuthClientOptions {
  apiUrl?: string
  requiredRole?: string
  forbiddenRedirectTo?: string
  meEndpoint?: string
  loginEndpoint?: string
  logoutEndpoint?: string
}

export function createAuthClient(options: CreateAuthClientOptions = {}) {
  const {
    apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    requiredRole,
    forbiddenRedirectTo = '/',
    meEndpoint = '/auth/me',
    loginEndpoint = '/auth/login',
    logoutEndpoint = '/auth/logout',
  } = options

  const AuthContext = createContext<AuthContextValue | null>(null)

  function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const refresh = useCallback(async () => {
      try {
        const res = await fetch(`${apiUrl}${meEndpoint}`, {
          credentials: 'include',
        })

        if (res.ok) {
          const data = (await res.json()) as Record<string, unknown>
          const authUser: AuthUser = {
            userId: (data.userId || data.adminId || data.id) as string,
            roles: (data.roles || (data.role ? [data.role] : [])) as string[],
            ...data,
          }

          if (requiredRole && !authUser.roles.includes(requiredRole)) {
            router.replace(forbiddenRedirectTo)
            setUser(null)
            return
          }

          setUser(authUser)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }, [apiUrl, forbiddenRedirectTo, requiredRole, router, meEndpoint])

    useEffect(() => {
      refresh()
    }, [refresh])

    const login = async (email: string, password: string) => {
      const res = await fetch(`${apiUrl}${loginEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const error = (await res.json()) as { message?: string }
        throw new Error(error.message ?? 'Login failed')
      }

      await refresh()
    }

    const logout = async () => {
      await fetch(`${apiUrl}${logoutEndpoint}`, {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
    }

    return (
      <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
        {children}
      </AuthContext.Provider>
    )
  }

  function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) {
      throw new Error('useAuth must be used within AuthProvider')
    }
    return ctx
  }

  return { AuthProvider, useAuth }
}
