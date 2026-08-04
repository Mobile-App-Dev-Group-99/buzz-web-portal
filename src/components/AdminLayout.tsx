import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'
import AuroraBackground from './AuroraBackground'
import { Hexagon, LayoutDashboard, Radio, Users, FileOutput, BarChart3, MessageSquare, UserCog, ClipboardList, Settings, LogOut, CalendarDays } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/attendance', icon: Radio, label: 'Gate Attendance' },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/exeats', icon: FileOutput, label: 'Exeats' },
  { to: '/admin/results', icon: BarChart3, label: 'Results' },
  { to: '/admin/messaging', icon: MessageSquare, label: 'Messaging' },
  { to: '/admin/staff', icon: UserCog, label: 'Staff' },
  { to: '/admin/reports', icon: ClipboardList, label: 'Reports' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const currentLabel = NAV_ITEMS.find(n => location.pathname === n.to || location.pathname.startsWith(n.to + '/'))?.label || 'Dashboard'

  return (
    <div className="flex min-h-screen bg-aurora-bg font-sans text-sm">
      <aside className="w-56 sidebar-glass flex flex-col flex-shrink-0 min-h-screen relative z-10">
        <AuroraBackground />
        <div className="relative z-10 px-4 py-5 border-b border-aurora-divider">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 bg-aurora-text rounded-xl flex items-center justify-center shadow-md">
              <Hexagon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="text-aurora-text font-bold text-sm">BuzzApp</div>
              <div className="text-aurora-label-muted text-[10px]">School Web Portal</div>
            </div>
          </div>
          <div className="glass-card px-3 py-2 flex items-center gap-2.5">
            <div className="w-7 h-7 bg-cat-positive rounded-lg flex items-center justify-center text-white text-[10px] font-bold">PA</div>
            <div>
              <div className="text-aurora-text text-xs font-semibold">Prempeh Academy</div>
              <div className="text-aurora-label-muted text-[10px]">JHS & SHS</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 relative z-10">
          <div className="px-4 py-1 text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wider">Main</div>
          {NAV_ITEMS.slice(0, 6).map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-aurora-surface text-aurora-text border-l-2 border-cat-positive rounded-r-lg mx-2 px-2'
                      : 'text-aurora-text-secondary hover:bg-aurora-surface/50 hover:text-aurora-text mx-2 px-2 rounded-lg'
                  }`
                }
              >
                <Icon className="w-4 h-4" strokeWidth={1.8} />
                {item.label}
              </NavLink>
            )
          })}
          <div className="px-4 py-1 mt-2 text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wider">Admin</div>
          {NAV_ITEMS.slice(6).map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-aurora-surface text-aurora-text border-l-2 border-cat-positive rounded-r-lg mx-2 px-2'
                      : 'text-aurora-text-secondary hover:bg-aurora-surface/50 hover:text-aurora-text mx-2 px-2 rounded-lg'
                  }`
                }
              >
                <Icon className="w-4 h-4" strokeWidth={1.8} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="px-4 py-3 border-t border-aurora-divider relative z-10">
          <div className="flex items-center gap-2.5">
            <Avatar
              initials={user ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}` : 'HK'}
              size="md"
              color="bg-aurora-surface text-aurora-text"
            />
            <div className="flex-1 min-w-0">
              <div className="text-aurora-text text-xs font-semibold truncate">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</div>
              <div className="text-aurora-label-muted text-[10px]">Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-2.5 text-[10px] text-aurora-label-muted hover:text-cat-negative flex items-center gap-1 transition-colors">
            <LogOut className="w-3 h-3" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative">
        <header className="glass-card rounded-none border-x-0 border-t-0 px-6 h-13 flex items-center justify-between flex-shrink-0 relative z-10">
          <span className="font-bold text-aurora-text text-sm">{currentLabel}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-aurora-text-secondary bg-aurora-surface px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
