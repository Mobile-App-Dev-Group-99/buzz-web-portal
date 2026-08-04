import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import { getTeacherClass, getTeacherRoster, markManualAttendance } from '../../services/api'
import AuroraBackground from '../../components/AuroraBackground'
import GlassCard from '../../components/GlassCard'
import StatTile from '../../components/StatTile'
import CategoryBadge from '../../components/CategoryBadge'
import { CheckCircle, Clock, XCircle, Users, ScanBarcode, CalendarDays } from 'lucide-react'

export default function TeacherDashboard() {
  const [students, setStudents] = useState<any[]>([])
  const [className, setClassName] = useState('Class')
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [scanInput, setScanInput] = useState('')
  const [scanMsg, setScanMsg] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const classData = await getTeacherClass()
        const name = classData?.className || classData?.class || ''
        if (!name) { setLoading(false); return }
        setClassName(name)

        const roster = await getTeacherRoster(name)
        const list = Array.isArray(roster) ? roster : []
        setStudents(list.map((s: any) => ({
          id: s.id,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || `Student ${s.id}`,
          code: `BZ-${s.id}`,
          status: (s.todayStatus || s.status || 'absent').toLowerCase(),
          time: '',
        })))
      } catch (err) { console.warn('API error:', err) }
      setLoading(false)
    })()
  }, [])

  const present = students.filter(s => s.status === 'present' || s.status === 'arrived').length
  const late = students.filter(s => s.status === 'late').length
  const absent = students.filter(s => s.status === 'absent').length

  const filtered = tab === 'all' ? students
    : tab === 'present' ? students.filter(s => s.status === 'present' || s.status === 'arrived')
    : tab === 'late' ? students.filter(s => s.status === 'late')
    : students.filter(s => s.status === 'absent')

  async function handleMarkPresent(studentId: number) {
    try {
      await markManualAttendance({ studentId, status: 'PRESENT' })
      setStudents(prev => prev.map(s =>
        s.id === studentId ? { ...s, status: 'present', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : s
      ))
    } catch (err) { console.warn('API error:', err) }
  }

  async function handleScan() {
    const code = scanInput.trim()
    if (!code) return
    const numId = parseInt(code.replace(/[^0-9]/g, ''), 10)
    if (isNaN(numId)) { setScanMsg('Enter a valid student ID'); return }

    const student = students.find(s => s.id === numId)
    if (!student) { setScanMsg(`Student #${numId} not in your class`); setScanInput(''); return }

    try {
      await markManualAttendance({ studentId: numId, status: 'PRESENT' })
      setStudents(prev => prev.map(s =>
        s.id === numId ? { ...s, status: 'present', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : s
      ))
      setScanMsg(`${student.name} marked present`)
      setScanInput('')
      setTimeout(() => setScanMsg(''), 3000)
    } catch (err: any) {
      setScanMsg(err?.response?.data?.message || 'Failed to mark attendance')
      setScanInput('')
    }
  }

  return (
    <div className="relative">
      <AuroraBackground />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-aurora-text">{className} — Class Attendance</h1>
            <p className="text-aurora-text-secondary text-xs mt-1 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <CategoryBadge category="positive" label="LIVE" showPulse />
        </div>

        <GlassCard className="mb-6">
          <div className="text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <ScanBarcode className="w-3.5 h-3.5" />
            Quick Attendance
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Type student ID and press Enter..."
              value={scanInput}
              onChange={e => setScanInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleScan() }}
              className="input-glass flex-1 px-4 py-2.5 text-xs text-aurora-text placeholder:text-aurora-label-muted"
            />
            <button onClick={handleScan} className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Mark Present
            </button>
          </div>
          {scanMsg && <div className="text-[11px] text-cat-positive mt-2 font-medium">{scanMsg}</div>}
        </GlassCard>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatTile label="Present" value={present} icon={CheckCircle} category="positive" subtitle="Checked in" />
          <StatTile label="Late" value={late} icon={Clock} category="warning" subtitle="Arrived late" />
          <StatTile label="Absent" value={absent} icon={XCircle} category="negative" subtitle="Not scanned" />
          <StatTile label="Total" value={students.length} icon={Users} category="info" subtitle="In class" />
        </div>

        <GlassCard noPadding>
          <div className="px-4 py-3 border-b border-aurora-divider flex gap-3">
            {[
              { key: 'all', label: `All (${students.length})` },
              { key: 'present', label: `Present (${present})` },
              { key: 'late', label: `Late (${late})` },
              { key: 'absent', label: `Absent (${absent})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`text-xs font-medium pb-1 border-b-2 transition-all ${
                tab === t.key ? 'text-cat-positive border-cat-positive' : 'text-aurora-text-secondary border-transparent hover:text-cat-positive hover:border-cat-positive'
              }`}>{t.label}</button>
            ))}
          </div>
          <table className="w-full">
            <thead><tr className="bg-aurora-surface border-b border-aurora-divider">
              {['Student', 'ID', 'Status', 'Action'].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide px-4 py-2.5">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-[11px] text-aurora-text-secondary">Loading class data...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-[11px] text-aurora-text-secondary">No students in class</td></tr>
              )}
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-aurora-divider hover:bg-aurora-surface/50 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-xs text-aurora-text">{s.name}</td>
                  <td className="px-4 py-2.5 text-[11px] text-aurora-text-secondary font-mono">{s.code}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-2.5">
                    {s.status === 'absent' && (
                      <button onClick={() => handleMarkPresent(s.id)} className="btn-primary text-[11px] px-3 py-1">
                        Mark Present
                      </button>
                    )}
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
