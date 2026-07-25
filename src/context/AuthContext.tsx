import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { login as apiLogin, getMe, validateToken } from '../services/api'
import type { Role } from '../types'

interface AuthUser {
  id: number
  email: string
  role: Role
  firstName: string
  lastName: string
  schoolId?: number
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<any>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

function makeInitials(firstName: string, lastName: string): string {
  const f = firstName?.[0] || ''
  const l = lastName?.[0] || ''
  return (f + l).toUpperCase() || '?'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    // Always validate against server — never trust localStorage role
    validateToken()
      .then((data) => {
        if (data && data.email && data.role) {
          const role = data.role.toLowerCase() as Role
          const userData: AuthUser = {
            id: data.id || 0,
            email: data.email,
            role,
            firstName: data.firstName || data.email.split('@')[0],
            lastName: data.lastName || '',
            schoolId: data.schoolId,
          }
          userData.initials = makeInitials(userData.firstName, userData.lastName)
          localStorage.setItem('user', JSON.stringify(userData))
          setUser(userData)
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
      .finally(() => setLoading(false))
  }, [])

  const loginFn = async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    const token = data.token
    if (!token) throw new Error('No token received')

    let role: Role = 'admin'
    if (data.role) {
      const r = data.role.toLowerCase()
      if (['admin', 'teacher', 'student', 'parent'].includes(r)) {
        role = r as Role
      }
    }

    const userData: AuthUser = {
      id: data.id || 0,
      email: data.email || email,
      role,
      firstName: data.firstName || email.split('@')[0],
      lastName: data.lastName || '',
      schoolId: data.schoolId,
    }

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    try {
      const me = await getMe()
      if (me) {
        const updated: AuthUser = {
          ...userData,
          id: me.id || userData.id,
          firstName: me.firstName || me.username || userData.firstName,
          lastName: me.lastName || userData.lastName,
          role: me.role ? (me.role.toLowerCase() as Role) : userData.role,
        }
        updated.initials = makeInitials(updated.firstName, updated.lastName)
        localStorage.setItem('user', JSON.stringify(updated))
        setUser(updated)
        return { ...updated, token }
      }
    } catch {
      // /me might fail for some roles, keep what we have
    }
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login: loginFn, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
