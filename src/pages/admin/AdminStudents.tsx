import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import { getAdminStudents } from '../../services/api'

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAdminStudents()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.students || data?.content || []
        setStudents(list.map((s: any) => ({
          id: s.studentCode || s.studentId || s.id,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unknown',
          class: s.className || '—',
          level: s.studentType || s.level || '—',
          biometric: s.biometricEnrolled || s.biometric || false,
          status: s.status || 'Active',
        })))
      })
      .catch((err) => console.warn('API error:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    String(s.id).includes(search) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search by name, ID, class..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs w-64 outline-none focus:border-[#1D9E75] bg-white"
        />
        <button className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">+ Add Student</button>
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Student', 'ID', 'Class', 'Level', 'Biometric', 'Status', ''].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">Loading students...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No students found</td></tr>
            )}
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar initials={(s.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)} size="sm" color="bg-[#E1F5EE] text-[#0F6E56]" />
                    <span className="font-medium text-xs">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{s.id}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{s.class}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{s.level}</td>
                <td className="px-4 py-2.5">
                  <span className={s.biometric ? 'text-[#0F6E56] text-xs font-medium' : 'text-[#791F1F] text-xs'}>
                    {s.biometric ? 'Enrolled' : 'Not enrolled'}
                  </span>
                </td>
                <td className="px-4 py-2.5"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-2.5"><button className="text-xs text-[#5F5E5A] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#F7F6F2]">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
