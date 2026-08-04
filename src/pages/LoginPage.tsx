import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'
import AuroraBackground from '../components/AuroraBackground'
import GlassCard from '../components/GlassCard'
import { Hexagon, Mail, Lock, Building2, MapPin, GraduationCap, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'onboard'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotMsg, setForgotMsg] = useState('')

  const [schoolName, setSchoolName] = useState('')
  const [schoolLocation, setSchoolLocation] = useState('')
  const [schoolLevel, setSchoolLevel] = useState('SHS')
  const [adminUsername, setAdminUsername] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminPassword, setShowAdminPassword] = useState(false)

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
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <AuroraBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-float">
          <div className="w-16 h-16 bg-aurora-text rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Hexagon className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-aurora-text mb-1">BuzzApp</h1>
          <p className="text-aurora-text-secondary text-sm">School Web Portal</p>
        </div>

        <GlassCard className="mb-4">
          <div className="flex bg-aurora-surface rounded-xl p-1">
            <button
              onClick={() => { setMode('login'); setError(''); setForgotMsg(''); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'login' ? 'bg-aurora-text text-white shadow-md' : 'text-aurora-text-secondary hover:text-aurora-text'
              }`}
            >Sign In</button>
            <button
              onClick={() => { setMode('onboard'); setError(''); setForgotMsg(''); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'onboard' ? 'bg-aurora-text text-white shadow-md' : 'text-aurora-text-secondary hover:text-aurora-text'
              }`}
            >Onboard School</button>
          </div>
        </GlassCard>

        {error && (
          <div className="category-badge-negative text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
            <span className="font-semibold">{error}</span>
          </div>
        )}
        {forgotMsg && (
          <div className="category-badge-positive text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
            <span className="font-semibold">{forgotMsg}</span>
          </div>
        )}

        {mode === 'login' && (
          <GlassCard>
            <h2 className="text-xl font-bold text-aurora-text mb-1">Welcome back</h2>
            <p className="text-aurora-text-secondary text-sm mb-6">Sign in to your school account</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aurora-label-muted" />
                  <input
                    type="email"
                    placeholder="your@school.edu.gh"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-glass w-full pl-10 pr-4 py-3 text-sm text-aurora-text placeholder:text-aurora-label-muted"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aurora-label-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-glass w-full pl-10 pr-10 py-3 text-sm text-aurora-text placeholder:text-aurora-label-muted"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-aurora-label-muted hover:text-aurora-text transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end mb-6">
                <button type="button" onClick={handleForgot} className="text-xs text-cat-info hover:underline font-medium">Forgot password?</button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </GlassCard>
        )}

        {mode === 'onboard' && (
          <GlassCard>
            <h2 className="text-xl font-bold text-aurora-text mb-1">Register Your School</h2>
            <p className="text-aurora-text-secondary text-sm mb-6">Set up your school and admin account</p>

            <form onSubmit={handleOnboard}>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-1 block">School Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aurora-label-muted" />
                  <input
                    type="text" placeholder="e.g. Accra Academy" value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    className="input-glass w-full pl-10 pr-4 py-2.5 text-sm text-aurora-text placeholder:text-aurora-label-muted"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-1 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aurora-label-muted" />
                  <input
                    type="text" placeholder="e.g. Accra" value={schoolLocation}
                    onChange={e => setSchoolLocation(e.target.value)}
                    className="input-glass w-full pl-10 pr-4 py-2.5 text-sm text-aurora-text placeholder:text-aurora-label-muted"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-1 block">Level</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aurora-label-muted" />
                  <select
                    value={schoolLevel}
                    onChange={e => setSchoolLevel(e.target.value)}
                    className="input-glass w-full pl-10 pr-4 py-2.5 text-sm text-aurora-text appearance-none"
                  >
                    <option value="JHS">JHS</option>
                    <option value="SHS">SHS</option>
                    <option value="BOTH">Both JHS & SHS</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-aurora-divider my-4" />
              <p className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-3">Admin Account</p>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-1 block">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aurora-label-muted" />
                  <input
                    type="text" placeholder="admin username" value={adminUsername}
                    onChange={e => setAdminUsername(e.target.value)}
                    className="input-glass w-full pl-10 pr-4 py-2.5 text-sm text-aurora-text placeholder:text-aurora-label-muted"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aurora-label-muted" />
                  <input
                    type="email" placeholder="admin@school.edu.gh" value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    className="input-glass w-full pl-10 pr-4 py-2.5 text-sm text-aurora-text placeholder:text-aurora-label-muted"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aurora-label-muted" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'} placeholder="Create a strong password" value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="input-glass w-full pl-10 pr-10 py-2.5 text-sm text-aurora-text placeholder:text-aurora-label-muted"
                    required minLength={6}
                  />
                  <button type="button" onClick={() => setShowAdminPassword(!showAdminPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-aurora-label-muted hover:text-aurora-text transition-colors">
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Setting up...' : 'Create School & Account'}
              </button>
            </form>
          </GlassCard>
        )}

        <p className="text-center text-aurora-label-muted text-xs mt-6">BuzzApp v2.0 · Group 99 · CodeQuest 2026</p>
      </div>
    </div>
  )
}
