import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

const NAV_ITEMS = [
  { to: '/admin', icon: '▦', label: 'Dashboard', end: true },
  { to: '/admin/attendance', icon: '⊙', label: 'Gate Attendance' },
  { to: '/admin/students', icon: '□', label: 'Students' },
  { to: '/admin/exeats', icon: '↗', label: 'Exeats' },
  { to: '/admin/results', icon: '≡', label: 'Results' },
  { to: '/admin/messaging', icon: '◎', label: 'Messaging' },
  { to: '/admin/staff', icon: '⊞', label: 'Staff' },
  { to: '/admin/reports', icon: '▤', label: 'Reports' },
  { to: '/admin/settings', icon: '⊕', label: 'Settings' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#F7F6F2] font-sans text-sm">
      <aside className="w-52 bg-[#1a1a18] flex flex-col flex-shrink-0 min-h-screen">
        <div className="px-4 py-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#1D9E75] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">BuzzApp</div>
              <div className="text-gray-500 text-[10px]">School Web Portal</div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1D9E75] rounded flex items-center justify-center text-white text-[10px] font-bold">PA</div>
            <div>
              <div className="text-gray-300 text-xs font-medium">Prempeh Academy</div>
              <div className="text-gray-500 text-[10px]">JHS & SHS</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3">
          <div className="px-4 py-1 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Main</div>
          {NAV_ITEMS.slice(0, 6).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1D9E75]/15 text-[#4ec9a0] border-l-2 border-[#1D9E75]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`
              }
            >
              <span className="w-4 text-center">{item.icon}</span>{item.label}
            </NavLink>
          ))}
          <div className="px-4 py-1 mt-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Admin</div>
          {NAV_ITEMS.slice(6).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1D9E75]/15 text-[#4ec9a0] border-l-2 border-[#1D9E75]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`
              }
            >
              <span className="w-4 text-center">{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Avatar
              initials={user ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}` : 'HK'}
              size="sm"
              color="bg-gray-700 text-gray-300"
            />
            <div>
              <div className="text-gray-300 text-xs font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</div>
              <div className="text-gray-500 text-[10px]">Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-2 text-[10px] text-gray-600 hover:text-gray-400">Log out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-[#D8D5CC] px-6 h-12 flex items-center justify-between flex-shrink-0">
          <span className="font-semibold text-[#1a1a18] text-sm">
            {NAV_ITEMS.find(n => location.pathname === n.to || location.pathname.startsWith(n.to + '/'))?.label || 'Dashboard'}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#5F5E5A] bg-[#F7F6F2] px-3 py-1 rounded-md border border-[#D8D5CC]">
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
