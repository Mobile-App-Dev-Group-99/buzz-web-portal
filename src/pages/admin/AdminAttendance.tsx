import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import { getLiveFeed } from '../../services/api'

export default function AdminAttendance() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')

  useEffect(() => {
    getLiveFeed()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.records || data?.content || []
        setRecords(list.map((r: any) => ({
          id: r.id || r.studentId,
          name: r.studentName || r.name || `Student ${r.studentId}`,
          class: r.className || '—',
          gate: r.gate || 'Gate 1',
          status: (r.status || 'arrived').toLowerCase(),
          time: r.scannedAt ? new Date(r.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
          notified: r.parentNotified !== false,
        })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const classes = ['All', ...new Set(records.map(r => r.class).filter(Boolean))]

  const filtered = records.filter(r => {
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.class.toLowerCase().includes(search.toLowerCase())
    const matchClass = classFilter === 'All' || r.class === classFilter
    return matchSearch && matchClass
  })

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search student or class..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs w-64 outline-none focus:border-[#1D9E75] bg-white"
        />
        <select
          value={classFilter}
          onChange={e => setClassFilter(e.target.value)}
          className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white"
        >
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Student', 'Class', 'Gate', 'Event', 'Time', 'Parent Notified'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">Loading attendance...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No attendance records today</td></tr>
            )}
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5 font-medium text-xs">{item.name}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{item.class}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{item.gate}</td>
                <td className="px-4 py-2.5"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{item.time}</td>
                <td className="px-4 py-2.5 text-[#0F6E56] text-xs font-medium">{item.notified ? 'Sent' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
