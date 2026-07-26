import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import { getTeacherClass, getTeacherRoster, markManualAttendance } from '../../services/api'

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a18]">{className} — Class Attendance</h1>
          <p className="text-[#5F5E5A] text-xs mt-1">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#E1F5EE] px-3 py-1.5 rounded-md">
          <div className="w-2 h-2 rounded-full bg-[#1D9E75]"></div>
          <span className="text-xs font-semibold text-[#0F6E56]">LIVE</span>
        </div>
      </div>

      {/* Quick Scan */}
      <div className="bg-white rounded-lg border border-[#D8D5CC] p-4 mb-6">
        <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-2">Quick Attendance</div>
        <div className="flex gap-2">
          <input
            placeholder="Type student ID and press Enter..."
            value={scanInput}
            onChange={e => setScanInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleScan() }}
            className="flex-1 border border-[#D8D5CC] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#1D9E75] bg-[#F7F6F2]"
          />
          <button onClick={handleScan} className="bg-[#1D9E75] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#0F6E56] transition-colors">
            Mark Present
          </button>
        </div>
        {scanMsg && <div className="text-[11px] text-[#0F6E56] mt-2 font-medium">{scanMsg}</div>}
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Present', val: String(present), color: 'text-[#0F6E56]', bg: 'bg-[#E1F5EE]' },
          { label: 'Late', val: String(late), color: 'text-[#854F0B]', bg: 'bg-[#FAEEDA]' },
          { label: 'Absent', val: String(absent), color: 'text-[#791F1F]', bg: 'bg-[#FCEBEB]' },
          { label: 'Total', val: String(students.length), color: 'text-[#5F5E5A]', bg: 'bg-[#F7F6F2]' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-lg p-4 text-center`}>
            <div className={`text-3xl font-bold ${s.color}`}>{s.val}</div>
            <div className={`text-xs font-medium ${s.color} mt-1`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#D8D5CC] flex gap-3">
          {[
            { key: 'all', label: `All (${students.length})` },
            { key: 'present', label: `Present (${present})` },
            { key: 'late', label: `Late (${late})` },
            { key: 'absent', label: `Absent (${absent})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`text-xs font-medium pb-1 border-b-2 transition-all ${
              tab === t.key ? 'text-[#0F6E56] border-[#1D9E75]' : 'text-[#5F5E5A] border-transparent hover:text-[#1D9E75] hover:border-[#1D9E75]'
            }`}>{t.label}</button>
          ))}
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Student', 'ID', 'Status', 'Action'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">Loading class data...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No students in class</td></tr>
            )}
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5 font-medium text-xs">{s.name}</td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{s.code}</td>
                <td className="px-4 py-2.5"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-2.5">
                  {s.status === 'absent' && (
                    <button onClick={() => handleMarkPresent(s.id)} className="text-xs bg-[#1a1a18] text-white px-2 py-0.5 rounded font-medium">Mark Present</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
