import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
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
      .catch((err) => console.warn('API error:', err))
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
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-aurora-label-muted" />
            <input
              placeholder="Search student or class..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-glass pl-9 pr-3 py-1.5 text-xs w-full"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-aurora-label-muted" />
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="input-glass pl-9 pr-3 py-1.5 text-xs appearance-none min-w-[120px]"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <GlassCard noPadding>
          <table className="w-full">
            <thead>
              <tr className="bg-aurora-surface/60 border-b border-aurora-divider">
                {['Student', 'Class', 'Gate', 'Event', 'Time', 'Parent Notified'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-aurora-text-secondary uppercase tracking-wide px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">Loading attendance...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">No attendance records today</td></tr>
              )}
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-aurora-divider hover:bg-aurora-surface/60 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-xs text-aurora-text">{item.name}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{item.class}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{item.gate}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-2.5 text-[11px] text-aurora-label-muted font-mono tabular-nums">{item.time}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs font-medium ${item.notified ? 'text-cat-positive' : 'text-cat-warning'}`}>
                      {item.notified ? 'Sent' : 'Pending'}
                    </span>
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
