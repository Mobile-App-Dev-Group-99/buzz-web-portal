import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { login as apiLogin } from '../services/api'
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
  login: (email: string, password: string) => Promise<void>
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const loginFn = async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    const token = data.token || data.accessToken
    const userData: AuthUser = {
      id: data.userId || data.id,
      email: data.email || email,
      role: data.role?.toLowerCase() || detectRole(email),
      firstName: data.firstName || email.split('@')[0],
      lastName: data.lastName || '',
      schoolId: data.schoolId,
    }
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
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

function detectRole(email: string): Role {
  const e = email.toLowerCase()
  if (e.includes('teacher')) return 'teacher'
  if (e.includes('parent')) return 'parent'
  return 'admin'
}
