import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import Avatar from '../../components/Avatar'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
import { getAdminTeachers, deleteTeacher } from '../../services/api'
import { UserMenu, UserDetailModal, type UserRow } from '../../components/UserMenu'

export default function AdminStaff() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [detail, setDetail] = useState<UserRow | null>(null)

  const loadStaff = () => {
    setLoading(true)
    getAdminTeachers()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.teachers || data?.content || []
        setStaff(list.map((s: any) => ({
          id: s.id || s.userId,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.username || `Staff ${s.id}`,
          role: s.role || 'TEACHER',
          email: s.email || '—',
          className: s.className || null,
          lastLogin: s.lastLogin ? new Date(s.lastLogin).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : '—',
        })))
      })
      .catch((err) => console.warn('API error:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadStaff() }, [])

  const filtered = staff.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    try {
      await deleteTeacher(id)
      setConfirmDelete(null)
      loadStaff()
    } catch (err) {
      console.warn('Delete error:', err)
    }
  }

  const openDetail = (s: any) => {
    setDetail({
      id: s.id,
      name: s.name,
      rows: [
        { label: 'Staff ID', value: String(s.id) },
        { label: 'Role', value: s.role || '—' },
        { label: 'Class', value: s.className || 'No class assigned' },
        { label: 'Email', value: s.email || '—' },
        { label: 'Last login', value: s.lastLogin || '—' },
      ],
    })
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-aurora-label-muted" />
            <input
              placeholder="Search staff..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-glass pl-9 pr-3 py-1.5 text-xs w-full"
            />
          </div>
        </div>

        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <GlassCard className="w-80">
              <p className="text-xs font-semibold text-aurora-text mb-2">Delete Staff Member</p>
              <p className="text-xs text-aurora-text-secondary mb-4">Are you sure you want to delete this staff member? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} className="text-xs text-white bg-cat-negative px-3 py-1.5 rounded-lg hover:bg-cat-negative/90 transition-colors">Delete</button>
              </div>
            </GlassCard>
          </div>
        )}

        <UserDetailModal user={detail} onClose={() => setDetail(null)} />

        <GlassCard noPadding>
          <table className="w-full">
            <thead>
              <tr className="bg-aurora-surface/60 border-b border-aurora-divider">
                {['Name', 'Role', 'Class', 'Email', ''].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-aurora-text-secondary uppercase tracking-wide px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">Loading staff...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">No staff found</td></tr>
              )}
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-aurora-divider hover:bg-aurora-surface/60 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar initials={(s.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)} size="sm" />
                      <span className="font-medium text-xs text-aurora-text">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{s.role}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{s.className || '—'}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{s.email}</td>
                  <td className="px-4 py-2.5">
                    <UserMenu onView={() => openDetail(s)} onDelete={() => setConfirmDelete(s.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  )
}
