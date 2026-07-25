import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import { getAdminTeachers } from '../../services/api'

export default function AdminStaff() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAdminTeachers()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.teachers || data?.content || []
        setStaff(list.map((s: any) => ({
          id: s.id || s.userId,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.username || `Staff ${s.id}`,
          role: s.role || 'TEACHER',
          email: s.email || '—',
          lastLogin: s.lastLogin ? new Date(s.lastLogin).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : '—',
        })))
      })
      .catch((err) => console.warn('API error:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = staff.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  )

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
      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Name', 'Role', 'Email', 'Last Login', 'Status', ''].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">Loading staff...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No staff found</td></tr>
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
                <td className="px-4 py-2.5"><StatusBadge status="Active" /></td>
                <td className="px-4 py-2.5"><button className="text-xs text-[#5F5E5A] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#F7F6F2]">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
