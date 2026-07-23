import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      const role = email.toLowerCase().includes('teacher') ? 'teacher'
        : email.toLowerCase().includes('parent') ? 'parent'
        : 'admin'
      navigate(role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/parent')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async (role: string) => {
    setError('')
    setLoading(true)
    try {
      const demoEmail = `demo-${role}@prempeh.edu.gh`
      await login(demoEmail, 'demo')
      navigate(role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/parent')
    } catch {
      navigate(role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/parent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a18] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1D9E75] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BuzzApp</h1>
          <p className="text-[#5F5E5A] text-sm">School Web Portal</p>
        </div>

        <div className="bg-white rounded-lg p-8 border border-[#D8D5CC]">
          <h2 className="text-xl font-bold text-[#1a1a18] mb-1">Welcome back</h2>
          <p className="text-[#5F5E5A] text-sm mb-6">Sign in to your school account</p>

          {error && (
            <div className="bg-[#FCEBEB] text-[#791F1F] text-xs p-3 rounded-lg mb-4 border border-[#791F1F]/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-2 block">Email Address</label>
              <input
                type="email"
                placeholder="your@school.edu.gh"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-[#D8D5CC] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1D9E75] bg-[#F7F6F2]"
                required
              />
            </div>
            <div className="mb-6">
              <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-2 block">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-[#D8D5CC] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1D9E75] bg-[#F7F6F2]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1D9E75] text-white font-bold py-3 rounded-lg text-sm hover:bg-[#0F6E56] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#F7F6F2]">
            <p className="text-[10px] text-[#5F5E5A] text-center mb-3 uppercase tracking-wide font-semibold">Demo Access</p>
            <div className="flex gap-2">
              {[
                { label: 'Admin', role: 'admin' },
                { label: 'Teacher', role: 'teacher' },
                { label: 'Parent', role: 'parent' },
              ].map(r => (
                <button
                  key={r.role}
                  onClick={() => demoLogin(r.role)}
                  disabled={loading}
                  className="flex-1 border border-[#D8D5CC] text-xs font-medium py-2 rounded-lg hover:bg-[#F7F6F2] transition-colors text-[#1a1a18]"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-[#5F5E5A] text-xs mt-6">BuzzApp v2.0 · Group 99 · CodeQuest 2026</p>
      </div>
    </div>
  )
}
