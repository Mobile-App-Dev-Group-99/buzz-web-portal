import { useState } from 'react'

// ── Data ─────────────────────────────────────────────
const GATE_FEED = [
  { id: 1, name: 'Kofi Mensah', class: 'SHS 2B', gate: 'Gate 1', status: 'arrived', time: '11:47' },
  { id: 2, name: 'Ama Boateng', class: 'JHS 3A', gate: 'Gate 1', status: 'late', time: '11:43' },
  { id: 3, name: 'Ekow Osei', class: 'SHS 1A', gate: 'Gate 2', status: 'arrived', time: '11:41' },
  { id: 4, name: 'Akua Asante', class: 'SHS 3C', gate: 'Gate 1', status: 'departed', time: '11:35' },
  { id: 5, name: 'Yaw Darko', class: 'JHS 2B', gate: 'Gate 2', status: 'late', time: '11:28' },
  { id: 6, name: 'Fiifi Owusu', class: 'SHS 2A', gate: 'Gate 1', status: 'arrived', time: '11:22' },
]

const ALERTS = [
  { id: 1, type: 'red', text: 'Kwame Asare overdue return from exeat. Expected 6:00 PM yesterday.', time: 'Today 08:12' },
  { id: 2, type: 'amber', text: 'Abena Frimpong: 4 absences in past 2 weeks. Auto-alert sent to parent.', time: 'Today 09:00' },
  { id: 3, type: 'red', text: 'Unknown fingerprint detected at Gate 2 — 10:33 AM. Review required.', time: 'Today 10:33' },
  { id: 4, type: 'amber', text: 'SHS 3A: 8 students absent — highest in school today.', time: 'Today 09:05' },
  { id: 5, type: 'green', text: 'Bulk exeat approved: 47 SHS students for weekend.', time: 'Yesterday 16:20' },
]

const CLASSES = [
  { name: 'JHS 1A', pct: 96, present: 48, total: 50 },
  { name: 'JHS 2B', pct: 88, present: 44, total: 50 },
  { name: 'JHS 3A', pct: 74, present: 37, total: 50 },
  { name: 'SHS 1A', pct: 93, present: 56, total: 60 },
  { name: 'SHS 2B', pct: 90, present: 54, total: 60 },
  { name: 'SHS 3C', pct: 62, present: 37, total: 60 },
]

const STUDENTS = [
  { id: 'BZ-2041', name: 'Kofi Mensah', class: 'SHS 2B', level: 'SHS Boarding', biometric: true, status: 'Active' },
  { id: 'BZ-1823', name: 'Ama Boateng', class: 'JHS 3A', level: 'JHS', biometric: true, status: 'Active' },
  { id: 'BZ-2187', name: 'Ekow Osei', class: 'SHS 1A', level: 'SHS Day', biometric: false, status: 'Active' },
  { id: 'BZ-2099', name: 'Akua Asante', class: 'SHS 3C', level: 'SHS Boarding', biometric: true, status: 'On Exeat' },
]

const EXEATS = [
  { id: 1, name: 'Kwame Asare', class: 'SHS 2A', reason: 'Home weekend', departed: 'Fri 5 Jun 2:10 PM', expected: 'Sat 6 Jun 6:00 PM', status: 'Overdue' },
  { id: 2, name: 'Akua Asante', class: 'SHS 3C', reason: 'Family event', departed: 'Sat 6 Jun 11:35 AM', expected: 'Sun 7 Jun 6:00 PM', status: 'On Exeat' },
  { id: 3, name: 'Fiifi Owusu', class: 'SHS 2A', reason: 'Medical', departed: 'Thu 4 Jun 9:00 AM', expected: 'Sat 6 Jun 8:00 AM', status: 'Returned' },
]

const MESSAGES = [
  { id: 1, from: 'Mrs. Frimpong', student: 'Abena Frimpong · JHS 2B', subject: 'Excuse note — sick today', time: '09:15 AM', status: 'Unread' },
  { id: 2, from: 'Mr. Agyeman', student: 'Kwesi Agyeman · SHS 3A', subject: 'Early departure request — 2PM', time: '08:47 AM', status: 'Unread' },
  { id: 3, from: 'Mrs. Asare', student: 'Kwame Asare · SHS 2A', subject: 'Regarding exeat — returning tomorrow', time: '07:30 AM', status: 'Read' },
]

// ── Helpers ───────────────────────────────────────────
function statusBadge(status: string) {
  const map: Record<string, string> = {
    arrived: 'bg-green-100 text-green-800',
    late: 'bg-amber-100 text-amber-800',
    departed: 'bg-blue-100 text-blue-800',
    absent: 'bg-red-100 text-red-800',
    Active: 'bg-green-100 text-green-800',
    'On Exeat': 'bg-blue-100 text-blue-800',
    Overdue: 'bg-amber-100 text-amber-800',
    Returned: 'bg-green-100 text-green-800',
    Unread: 'bg-gray-100 text-gray-600',
    Read: 'bg-green-100 text-green-800',
  }
  return `text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`
}

function barColor(pct: number) {
  if (pct >= 85) return 'bg-green-500'
  if (pct >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

function alertDot(type: string) {
  const map: Record<string, string> = { red: 'bg-red-500', amber: 'bg-amber-400', green: 'bg-green-500' }
  return `w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${map[type]}`
}

// ── App ───────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('dashboard')
  const [lockdown, setLockdown] = useState(false)
  const [showExeatForm, setShowExeatForm] = useState(false)

  const navItems = [
    { id: 'dashboard', icon: '▦', label: 'Dashboard' },
    { id: 'attendance', icon: '⊙', label: 'Gate Attendance' },
    { id: 'students', icon: '👥', label: 'Students' },
    { id: 'exeat', icon: '🚪', label: 'Exeat Management' },
    { id: 'results', icon: '📋', label: 'Academic Results' },
    { id: 'messaging', icon: '💬', label: 'Messaging' },
    { id: 'staff', icon: '🪪', label: 'Staff Management' },
    { id: 'reports', icon: '📊', label: 'Reports & Exports' },
    { id: 'settings', icon: '⚙️', label: 'System Settings' },
  ]

  return (
    <div className="flex min-h-screen bg-[#F7F6F2] font-sans text-sm">

      {/* Lockdown overlay */}
      {lockdown && (
        <div className="fixed inset-0 bg-red-700/95 z-50 flex flex-col items-center justify-center gap-5">
          <div className="text-6xl">🔒</div>
          <div className="text-3xl font-bold text-white">EMERGENCY LOCKDOWN ACTIVE</div>
          <div className="text-white/70 text-sm">All gate terminals locked · All parents notified</div>
          <button onClick={() => setLockdown(false)} className="mt-4 bg-white text-red-700 font-bold px-8 py-3 rounded-xl text-sm">
            Deactivate Emergency Mode
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-52 bg-[#1a1a18] flex flex-col flex-shrink-0 min-h-screen">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#1D9E75] rounded-lg flex items-center justify-center text-white text-sm">👆</div>
            <div>
              <div className="text-white font-semibold text-sm">BuzzApp</div>
              <div className="text-gray-500 text-[10px]">School Web Portal</div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1D9E75] rounded flex items-center justify-center text-white text-[10px] font-bold">PA</div>
            <div>
              <div className="text-gray-300 text-xs font-medium">Prempeh Academy</div>
              <div className="text-gray-500 text-[10px]">JHS & SHS · Boarding</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          <div className="px-4 py-1 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Main</div>
          {navItems.slice(0, 6).map(item => (
            <button key={item.id} onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${view === item.id ? 'bg-[#1D9E75]/15 text-[#4ec9a0] border-l-2 border-[#1D9E75]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
          <div className="px-4 py-1 mt-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Admin</div>
          {navItems.slice(6).map(item => (
            <button key={item.id} onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-all ${view === item.id ? 'bg-[#1D9E75]/15 text-[#4ec9a0] border-l-2 border-[#1D9E75]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
          <div className="px-4 py-1 mt-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Emergency</div>
          <button onClick={() => setLockdown(true)}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-red-400 transition-all">
            🔒 Emergency Mode
          </button>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-semibold">HK</div>
            <div>
              <div className="text-gray-300 text-xs font-medium">Headmaster Kweku</div>
              <div className="text-gray-500 text-[10px]">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 h-12 flex items-center justify-between flex-shrink-0">
          <span className="font-semibold text-[#1a1a18] text-sm capitalize">{navItems.find(n => n.id === view)?.label || 'Dashboard'}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-md border border-gray-200">Mon, 16 Jun 2026 · 11:49 AM</span>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-sm">🔔</button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">

          {/* DASHBOARD */}
          {view === 'dashboard' && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Present Today', val: '847', sub: '↑ 12 from yesterday', color: 'text-green-700', bg: 'bg-green-50', icon: '✓' },
                  { label: 'Late Arrivals', val: '34', sub: '3.9% of students', color: 'text-amber-700', bg: 'bg-amber-50', icon: '⏰' },
                  { label: 'Absent', val: '67', sub: 'Alerts sent to parents', color: 'text-red-700', bg: 'bg-red-50', icon: '✗' },
                  { label: 'On Exeat (SHS)', val: '18', sub: '3 overdue returns', color: 'text-blue-700', bg: 'bg-blue-50', icon: '🚪' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{s.label}</span>
                      <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center ${s.color} text-xs`}>{s.icon}</div>
                    </div>
                    <div className="text-2xl font-bold text-[#1a1a18] tracking-tight">{s.val}</div>
                    <div className="text-[11px] text-gray-400 mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-4 mb-4">
                {/* Gate Feed */}
                <div className="col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-[#1a1a18] text-xs">⚡ Live Gate Activity</span>
                    <button onClick={() => setView('attendance')} className="text-[11px] text-[#1D9E75] font-medium">View all →</button>
                  </div>
                  {GATE_FEED.map(item => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[10px] font-bold text-green-800">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-xs text-[#1a1a18]">{item.name}</div>
                        <div className="text-[10px] text-gray-400">{item.class} · {item.gate}</div>
                      </div>
                      <span className={statusBadge(item.status)}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                      <span className="text-[10px] text-gray-300 font-mono">{item.time}</span>
                    </div>
                  ))}
                </div>

                {/* Alerts */}
                <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-[#1a1a18] text-xs">🔔 System Alerts</span>
                    <button className="text-[11px] text-gray-400">Clear all</button>
                  </div>
                  {ALERTS.map(a => (
                    <div key={a.id} className="flex gap-2.5 px-4 py-2.5 border-b border-gray-50">
                      <div className={alertDot(a.type)} />
                      <div>
                        <div className="text-[11px] text-gray-600 leading-relaxed">{a.text}</div>
                        <div className="text-[10px] text-gray-300 font-mono mt-0.5">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class attendance */}
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <span className="font-semibold text-[#1a1a18] text-xs">Class Attendance Today</span>
                  </div>
                  {CLASSES.map(c => (
                    <div key={c.name} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                      <span className="text-xs font-medium text-gray-600 w-16">{c.name}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor(c.pct)}`} style={{ width: `${c.pct}%` }} />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500 font-mono w-9 text-right">{c.pct}%</span>
                      <span className="text-[10px] text-gray-300 w-14 text-right">{c.present}/{c.total}</span>
                    </div>
                  ))}
                </div>
                <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-xs font-semibold text-[#1a1a18] mb-3">Weekly Attendance Rate</div>
                  <div className="flex items-end gap-2 h-24">
                    {[
                      { day: 'Mon', h: 75 }, { day: 'Tue', h: 82 }, { day: 'Wed', h: 68 },
                      { day: 'Thu', h: 88 }, { day: 'Fri', h: 90, today: true },
                    ].map(b => (
                      <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
                        <div className={`w-full rounded-t ${b.today ? 'bg-[#0F6E56]' : 'bg-[#1D9E75]/70'}`} style={{ height: b.h }} />
                        <span className="text-[9px] text-gray-300 font-mono">{b.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE */}
          {view === 'attendance' && (
            <div>
              <div className="flex gap-2 mb-4">
                <input placeholder="Search student or class..." className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-64 outline-none focus:border-[#1D9E75]" />
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none">
                  <option>All Classes</option><option>JHS 1A</option><option>SHS 2B</option>
                </select>
                <button className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">Export</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    {['Student', 'Class', 'Gate', 'Event', 'Time', 'Parent Notified'].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {GATE_FEED.map(item => (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-xs">{item.name}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{item.class}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{item.gate}</td>
                        <td className="px-4 py-2.5"><span className={statusBadge(item.status)}>{item.status}</span></td>
                        <td className="px-4 py-2.5 text-[11px] text-gray-400 font-mono">{item.time}</td>
                        <td className="px-4 py-2.5 text-green-500 text-xs">✓ Sent</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {view === 'students' && (
            <div>
              <div className="flex gap-2 mb-4">
                <input placeholder="Search by name, ID, class..." className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-64 outline-none focus:border-[#1D9E75]" />
                <button className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">+ Add Student</button>
                <button className="border border-gray-200 text-xs font-medium px-3 py-1.5 rounded-lg">Bulk CSV Import</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    {['Student', 'ID', 'Class', 'Level', 'Biometric', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {STUDENTS.map(s => (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-xs">{s.name}</td>
                        <td className="px-4 py-2.5 text-[11px] text-gray-400 font-mono">{s.id}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{s.class}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{s.level}</td>
                        <td className="px-4 py-2.5">
                          <span className={s.biometric ? 'text-green-600 text-xs font-medium' : 'text-red-400 text-xs'}>
                            {s.biometric ? '👆 Enrolled' : 'Not enrolled'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5"><span className={statusBadge(s.status)}>{s.status}</span></td>
                        <td className="px-4 py-2.5"><button className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded">Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EXEAT */}
          {view === 'exeat' && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'On Campus', val: '312', color: 'text-green-700', bg: 'bg-green-50' },
                  { label: 'On Exeat', val: '18', color: 'text-blue-700', bg: 'bg-blue-50' },
                  { label: 'Overdue Return', val: '3', color: 'text-red-700', bg: 'bg-red-50' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                    <div className={`text-3xl font-bold ${s.color}`}>{s.val}</div>
                    <div className={`text-xs font-medium ${s.color} mt-1`}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setShowExeatForm(!showExeatForm)} className="bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">+ New Exeat</button>
                <button className="border border-gray-200 text-xs font-medium px-3 py-1.5 rounded-lg">Bulk Weekend Exeat</button>
                <button className="border border-gray-200 text-xs font-medium px-3 py-1.5 rounded-lg">Export Report</button>
              </div>
              {showExeatForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-xs">New Exeat Request</span>
                    <button onClick={() => setShowExeatForm(false)} className="text-gray-400 text-xs">Cancel ✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block">Student</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none">
                        <option>Select student...</option>
                        {STUDENTS.map(s => <option key={s.id}>{s.name} — {s.class}</option>)}
                      </select>
                    </div>
                    <div><label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block">Reason</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none">
                        <option>Home Weekend</option><option>Medical</option><option>Family Emergency</option>
                      </select>
                    </div>
                    <div><label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block">Departure</label>
                      <input type="datetime-local" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none" />
                    </div>
                    <div><label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block">Expected Return</label>
                      <input type="datetime-local" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none" />
                    </div>
                    <div className="col-span-2">
                      <button onClick={() => setShowExeatForm(false)} className="w-full bg-[#1D9E75] text-white text-xs font-semibold py-2 rounded-lg">
                        ✓ Approve & Notify Parent
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    {['Student', 'Class', 'Reason', 'Departed', 'Expected Return', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {EXEATS.map(e => (
                      <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-xs">{e.name}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{e.class}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{e.reason}</td>
                        <td className="px-4 py-2.5 text-[11px] text-gray-400 font-mono">{e.departed}</td>
                        <td className="px-4 py-2.5 text-[11px] text-gray-400 font-mono">{e.expected}</td>
                        <td className="px-4 py-2.5"><span className={statusBadge(e.status)}>{e.status}</span></td>
                        <td className="px-4 py-2.5"><button className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded">View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {view === 'results' && (
            <div>
              <div className="flex gap-2 mb-4">
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none"><option>2025/2026 Term 2</option></select>
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none"><option>All Classes</option><option>SHS 2B</option></select>
                <button className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">🔒 Lock & Deliver Results</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between">
                  <span className="font-semibold text-xs">Grade Submissions — SHS 2B · Term 2</span>
                  <span className="text-[11px] text-gray-400">4 of 6 subjects submitted</span>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    {['Student', 'Math', 'English', 'Science', 'History', 'Average', 'Position', 'Parent Viewed'].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[
                      { name: 'Kofi Mensah', scores: [78, 82, 91, 74], avg: '81.3%', pos: '#2', viewed: true },
                      { name: 'Ama Boateng', scores: [65, 71, 58, 69], avg: '65.8%', pos: '#8', viewed: false },
                      { name: 'Ekow Osei', scores: [88, 76, 84, 90], avg: '84.5%', pos: '#1', viewed: true },
                    ].map(s => (
                      <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-xs">{s.name}</td>
                        {s.scores.map((sc, i) => <td key={i} className="px-4 py-2.5 text-[11px] font-mono text-gray-600">{sc}</td>)}
                        <td className="px-4 py-2.5 text-xs font-bold text-green-600">{s.avg}</td>
                        <td className="px-4 py-2.5 text-xs font-bold text-gray-600">{s.pos}</td>
                        <td className="px-4 py-2.5 text-xs">{s.viewed ? <span className="text-green-500">✓</span> : <span className="text-gray-300">✗</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MESSAGING */}
          {view === 'messaging' && (
            <div>
              <div className="flex gap-2 mb-4">
                <button className="bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">📢 New Announcement</button>
                <button className="border border-gray-200 text-xs font-medium px-3 py-1.5 rounded-lg">+ Message Parent</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100">
                  <span className="font-semibold text-xs">Inbox (7)</span>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    {['From', 'Student', 'Subject', 'Time', 'Status'].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {MESSAGES.map(m => (
                      <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-2.5 font-medium text-xs">{m.from}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{m.student}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-600">{m.subject}</td>
                        <td className="px-4 py-2.5 text-[11px] text-gray-400 font-mono">{m.time}</td>
                        <td className="px-4 py-2.5"><span className={statusBadge(m.status)}>{m.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAFF */}
          {view === 'staff' && (
            <div>
              <div className="flex gap-2 mb-4">
                <input placeholder="Search staff..." className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-64 outline-none" />
                <button className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">+ Add Staff</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead><tr className="bg-gray-50 border-b border-gray-200">
                    {['Name', 'Role', 'Email', 'Last Login', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[
                      { name: 'Headmaster Kweku', role: 'Administrator', email: 'hm@prempeh.edu.gh', login: 'Today 11:30 AM' },
                      { name: 'Mr. Boateng', role: 'Class Teacher', email: 'boateng@prempeh.edu.gh', login: 'Today 09:12 AM' },
                      { name: 'Madam Asante', role: 'House Mistress', email: 'asante@prempeh.edu.gh', login: 'Today 08:45 AM' },
                      { name: 'Kofi Gate', role: 'Gate Attendant', email: 'gate1@prempeh.edu.gh', login: 'Today 06:30 AM' },
                    ].map(s => (
                      <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-xs">{s.name}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{s.role}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-400">{s.email}</td>
                        <td className="px-4 py-2.5 text-[11px] text-gray-400 font-mono">{s.login}</td>
                        <td className="px-4 py-2.5"><span className={statusBadge('Active')}>Active</span></td>
                        <td className="px-4 py-2.5"><button className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded">Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS */}
          {view === 'reports' && (
            <div>
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Attendance Rate', val: '92.6%', sub: 'This term' },
                  { label: 'Avg Arrival Time', val: '7:24 AM', sub: 'Before bell' },
                  { label: 'Late Rate', val: '4.1%', sub: 'Down 1.2% from last term' },
                  { label: 'Exeats This Term', val: '143', sub: '7 overdue incidents' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase mb-2">{s.label}</div>
                    <div className="text-2xl font-bold text-[#1a1a18]">{s.val}</div>
                    <div className="text-[11px] text-gray-400 mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="font-semibold text-xs mb-4">Generate Report</div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block">Report Type</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none">
                      <option>Daily Attendance</option><option>Weekly Summary</option><option>Termly Attendance</option><option>Exeat History</option>
                    </select>
                  </div>
                  <div><label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block">Class</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none">
                      <option>All Classes</option><option>JHS Only</option><option>SHS Only</option>
                    </select>
                  </div>
                  <div><label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block">Date From</label>
                    <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none" />
                  </div>
                  <div><label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block">Date To</label>
                    <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none" />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <button className="flex-1 bg-[#1D9E75] text-white text-xs font-semibold py-2 rounded-lg">Export PDF</button>
                    <button className="flex-1 border border-gray-200 text-xs font-semibold py-2 rounded-lg">Export Excel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {view === 'settings' && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="font-semibold text-xs mb-4">School Configuration</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'School Name', val: 'Prempeh Academy' },
                  { label: 'School Type', val: 'JHS & SHS (Boarding)' },
                  { label: 'Late Arrival Threshold', val: '7:30 AM' },
                  { label: 'Absence Alert Time', val: '9:00 AM' },
                  { label: 'Academic Alert Threshold', val: 'Below 50%' },
                  { label: 'SMS Fallback', val: 'Enabled' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block">{f.label}</label>
                    <input defaultValue={f.val} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1D9E75]" />
                  </div>
                ))}
                <div className="col-span-2">
                  <button className="bg-[#1D9E75] text-white text-xs font-semibold px-4 py-2 rounded-lg">Save Settings</button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}