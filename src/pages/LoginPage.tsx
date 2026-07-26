import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'onboard'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotMsg, setForgotMsg] = useState('')

  // Onboard state
  const [schoolName, setSchoolName] = useState('')
  const [schoolLocation, setSchoolLocation] = useState('')
  const [schoolLevel, setSchoolLevel] = useState('SHS')
  const [adminUsername, setAdminUsername] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      const role = data?.role?.toLowerCase() || 'admin'
      navigate(role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : role === 'parent' ? '/parent' : '/login')
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Login failed. Check your credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authApi.post('/api/auth/onboard-school', {
        schoolName,
        location: schoolLocation,
        level: schoolLevel,
        adminUsername,
        adminEmail,
        adminPassword,
      })
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token)
        const me = await authApi.get('/api/auth/me', { headers: { Authorization: `Bearer ${data.data.token}` } })
        if (me.data) {
          localStorage.setItem('user', JSON.stringify({ ...me.data, role: me.data.role?.toLowerCase(), initials: (me.data.username || '')[0] || 'A' }))
        }
        navigate('/admin')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Onboarding failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async () => {
    if (!email) { setError('Enter your email above first'); return }
    setForgotMsg('')
    try {
      await authApi.post('/api/auth/forgot-password', { email })
      setForgotMsg('A temporary password has been sent to your email.')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send reset email')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1D9E75] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1a1a18] mb-2">BuzzApp</h1>
          <p className="text-[#5F5E5A] text-sm">School Web Portal</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white rounded-lg border border-[#D8D5CC] p-1 mb-4">
          <button
            onClick={() => { setMode('login'); setError(''); setForgotMsg(''); }}
            className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all ${mode === 'login' ? 'bg-[#1D9E75] text-white' : 'text-[#5F5E5A] hover:text-[#1a1a18]'}`}
          >Sign In</button>
          <button
            onClick={() => { setMode('onboard'); setError(''); setForgotMsg(''); }}
            className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all ${mode === 'onboard' ? 'bg-[#1D9E75] text-white' : 'text-[#5F5E5A] hover:text-[#1a1a18]'}`}
          >Onboard School</button>
        </div>

        {error && (
          <div className="bg-[#FCEBEB] text-[#791F1F] text-xs p-3 rounded-lg mb-4 border border-[#791F1F]/20">{error}</div>
        )}
        {forgotMsg && (
          <div className="bg-[#E1F5EE] text-[#0F6E56] text-xs p-3 rounded-lg mb-4 border border-[#0F6E56]/20">{forgotMsg}</div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <div className="bg-white rounded-lg p-8 border border-[#D8D5CC]">
            <h2 className="text-xl font-bold text-[#1a1a18] mb-1">Welcome back</h2>
            <p className="text-[#5F5E5A] text-sm mb-6">Sign in to your school account</p>

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
              <div className="mb-4">
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
              <div className="flex justify-end mb-6">
                <button type="button" onClick={handleForgot} className="text-xs text-[#1D9E75] hover:underline font-medium">Forgot password?</button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1D9E75] text-white font-bold py-3 rounded-lg text-sm hover:bg-[#0F6E56] transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        )}

        {/* Onboard Form */}
        {mode === 'onboard' && (
          <div className="bg-white rounded-lg p-8 border border-[#D8D5CC]">
            <h2 className="text-xl font-bold text-[#1a1a18] mb-1">Register Your School</h2>
            <p className="text-[#5F5E5A] text-sm mb-6">Set up your school and admin account</p>

            <form onSubmit={handleOnboard}>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-1 block">School Name</label>
                <input
                  type="text" placeholder="e.g. Accra Academy" value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  className="w-full border border-[#D8D5CC] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75] bg-[#F7F6F2]"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-1 block">Location</label>
                <input
                  type="text" placeholder="e.g. Accra" value={schoolLocation}
                  onChange={e => setSchoolLocation(e.target.value)}
                  className="w-full border border-[#D8D5CC] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75] bg-[#F7F6F2]"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-1 block">Level</label>
                <select
                  value={schoolLevel}
                  onChange={e => setSchoolLevel(e.target.value)}
                  className="w-full border border-[#D8D5CC] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75] bg-[#F7F6F2]"
                >
                  <option value="JHS">JHS</option>
                  <option value="SHS">SHS</option>
                  <option value="BOTH">Both JHS & SHS</option>
                </select>
              </div>
              <div className="border-t border-[#D8D5CC] my-4" />
              <p className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-3">Admin Account</p>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-1 block">Username</label>
                <input
                  type="text" placeholder="admin username" value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)}
                  className="w-full border border-[#D8D5CC] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75] bg-[#F7F6F2]"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-1 block">Email</label>
                <input
                  type="email" placeholder="admin@school.edu.gh" value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full border border-[#D8D5CC] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75] bg-[#F7F6F2]"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-1 block">Password</label>
                <input
                  type="password" placeholder="Create a strong password" value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full border border-[#D8D5CC] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1D9E75] bg-[#F7F6F2]"
                  required minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1D9E75] text-white font-bold py-3 rounded-lg text-sm hover:bg-[#0F6E56] transition-colors disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Create School & Account'}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-[#5F5E5A] text-xs mt-6">BuzzApp v2.0 · Group 99 · CodeQuest 2026</p>
      </div>
    </div>
  )
}
