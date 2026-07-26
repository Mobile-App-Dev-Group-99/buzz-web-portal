import { useState, useEffect } from 'react'
import Avatar from '../../components/Avatar'
import { getAdminTeachers, deleteTeacher } from '../../services/api'

export default function AdminStaff() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

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

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search staff..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs w-64 outline-none focus:border-[#1D9E75] bg-white"
        />
      </div>

      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-[#D8D5CC] p-5 w-80 shadow-lg">
            <p className="text-xs font-semibold text-[#1a1a18] mb-2">Delete Staff Member</p>
            <p className="text-xs text-[#5F5E5A] mb-4">Are you sure you want to delete this staff member? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="text-xs text-[#5F5E5A] border border-[#D8D5CC] px-3 py-1.5 rounded-lg hover:bg-[#F7F6F2]">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="text-xs text-white bg-[#791F1F] px-3 py-1.5 rounded-lg hover:bg-[#5C1717]">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Name', 'Role', 'Email', 'Last Login', ''].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">Loading staff...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No staff found</td></tr>
            )}
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar initials={(s.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)} size="sm" color="bg-[#E1F5EE] text-[#0F6E56]" />
                    <span className="font-medium text-xs">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{s.role}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{s.email}</td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{s.lastLogin}</td>
                <td className="px-4 py-2.5">
                  <button onClick={() => setConfirmDelete(s.id)} className="text-xs text-[#791F1F] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#FCEBEB]">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
