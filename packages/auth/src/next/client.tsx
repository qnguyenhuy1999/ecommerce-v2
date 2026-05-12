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

  function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const refresh = useCallback(async () => {
      try {
        const res = await fetch(`${apiUrl}${meEndpoint}`, {
          credentials: 'include',
        })

        if (res.ok) {
          const payload: unknown = await res.json()
          const data = isRecord(payload) ? payload : {}
          const authUser: AuthUser = {
            userId: getString(data.userId) ?? getString(data.adminId) ?? getString(data.id) ?? '',
            roles: getRoles(data),
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
      void refresh()
    }, [refresh])

    const login = async (email: string, password: string) => {
      const res = await fetch(`${apiUrl}${loginEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const payload: unknown = await res.json()
        const errorMessage = isRecord(payload) ? getString(payload.message) : undefined
        throw new Error(errorMessage ?? 'Login failed')
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function getRoles(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.roles)) {
    return data.roles.filter((role): role is string => typeof role === 'string')
  }
  const role = getString(data.role)
  return role ? [role] : []
}
