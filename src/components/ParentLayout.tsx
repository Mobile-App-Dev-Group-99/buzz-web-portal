import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'
import AuroraBackground from './AuroraBackground'
import { Hexagon, LogOut } from 'lucide-react'

export default function ParentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-aurora-bg font-sans text-sm flex flex-col">
      <AuroraBackground />
      <header className="sidebar-glass relative z-10 px-6 py-4 flex items-center justify-between border-b border-aurora-divider flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-aurora-text rounded-xl flex items-center justify-center shadow-md">
            <Hexagon className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <div className="text-aurora-text font-bold text-sm">BuzzApp</div>
            <div className="text-aurora-label-muted text-[10px]">Parent Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 glass-card px-3 py-1.5">
            <Avatar
              initials={user ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}` : 'AM'}
              size="sm"
              color="bg-cat-info text-white"
            />
            <span className="text-aurora-text text-xs font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Parent'}</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-aurora-label-muted hover:text-cat-negative flex items-center gap-1 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </div>
      </header>
      <div className="flex-1 p-6 max-w-4xl mx-auto relative z-10 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
