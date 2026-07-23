import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

export default function ParentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] font-sans text-sm">
      <header className="bg-[#1a1a18] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1D9E75] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">BuzzApp</div>
            <div className="text-gray-500 text-[10px]">Parent Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
            <Avatar
              initials={user ? `${user.firstName[0]}${user.lastName[0]}` : 'AM'}
              size="sm"
              color="bg-[#1D9E75] text-white"
            />
            <span className="text-gray-300 text-xs">{user ? `${user.firstName} ${user.lastName}` : 'Parent'}</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-gray-300">Log out</button>
        </div>
      </header>
      <div className="p-6 max-w-4xl mx-auto">
        <Outlet />
      </div>
    </div>
  )
}
