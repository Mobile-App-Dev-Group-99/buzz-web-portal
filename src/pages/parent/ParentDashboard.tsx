import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import { getParentChildren, getStudentAttendance, getParentNotifications } from '../../services/api'

export default function ParentDashboard() {
  const [children, setChildren] = useState<any[]>([])
  const [activeChild, setActiveChild] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [parentId, setParentId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getParentChildren()
      .then(data => {
        const kids = Array.isArray(data) ? data : data?.children || []
        setChildren(kids.map((c: any) => ({
          id: c.id || c.studentId,
          name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || `Child ${c.id}`,
          class: c.className || '—',
        })))
        const pid = data?.parent?.parentId || data?.parentId
        if (pid) setParentId(pid)
      })
      .catch((err) => console.warn('API error:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (children.length > 0 && children[activeChild]?.id) {
      getStudentAttendance(children[activeChild].id)
        .then(data => {
          const list = Array.isArray(data) ? data : data?.records || []
          setHistory(list.slice(0, 10).map((r: any) => ({
            date: r.scannedAt ? new Date(r.scannedAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : '—',
            event: r.status === 'LATE' ? 'Arrived late' : r.status === 'ABSENT' ? 'Absent — no scan' : 'Arrived at school',
            time: r.scannedAt ? new Date(r.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            status: (r.status || 'present').toLowerCase(),
            gate: r.gate || '',
          })))
        })
        .catch((err) => console.warn('API error:', err))
    }
  }, [activeChild, children])

  useEffect(() => {
    if (parentId) {
      getParentNotifications(parentId)
        .then(data => {
          const list = Array.isArray(data) ? data : data?.notifications || []
          setNotifications(list.slice(0, 5).map((n: any) => {
            const msg = n.message || ''
            const isLate = /late/i.test(msg)
            const isDeparted = /left|departed|left school/i.test(msg)
            return {
              text: msg || 'Notification',
              time: n.sentAt ? new Date(n.sentAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : '',
              color: isLate ? 'bg-[#FAEEDA]' : isDeparted ? 'bg-[#E8EDF5]' : 'bg-[#E1F5EE]',
              icon: isLate ? '!' : isDeparted ? '↩' : '✓',
            }
          }))
        })
        .catch((err) => console.warn('API error:', err))
    }
  }, [parentId])

  const child = children[activeChild]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xs text-[#5F5E5A]">Loading...</div>
      </div>
    )
  }

  if (children.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xs text-[#5F5E5A]">No children linked to your account</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-3 mb-6">
        {children.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActiveChild(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
              i === activeChild
                ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
                : 'bg-white text-[#5F5E5A] border-[#D8D5CC] hover:border-[#1D9E75]'
            }`}
          >
            <Avatar
              initials={(c.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              size="sm"
              color={i === activeChild ? 'bg-white/20 text-white' : 'bg-[#F7F6F2] text-[#5F5E5A]'}
            />
            {c.name} · {c.class}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
          <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-2">Attendance Rate</div>
          <div className="text-3xl font-bold text-[#1a1a18]">
            {history.length > 0 ? `${Math.round(history.filter(h => h.status !== 'absent').length / Math.max(history.length, 1) * 100)}%` : '—'}
          </div>
          <div className="text-xs text-[#5F5E5A] mt-1">This term</div>
        </div>
        <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
          <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-2">Total Scans</div>
          <div className="text-3xl font-bold text-[#1a1a18]">{history.length}</div>
          <div className="text-xs text-[#5F5E5A] mt-1">This period</div>
        </div>
        <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
          <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-2">Today's Status</div>
          <div className="text-3xl font-bold text-[#0F6E56]">
            {history.length > 0 && history[0]?.status === 'present' ? '✓' : history[0]?.status === 'late' ? 'L' : '—'}
          </div>
          <div className="text-xs text-[#5F5E5A] mt-1">
            {history[0]?.time ? `${history[0].time} · ${history[0].gate || ''}` : 'No scan yet'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-[#D8D5CC]">
          <span className="font-semibold text-xs">Attendance History — {child?.name || '—'}</span>
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Date', 'Event', 'Time', 'Status'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {history.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No attendance records</td></tr>
            )}
            {history.map((item, i) => (
              <tr key={i} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5 text-xs font-medium text-[#5F5E5A]">{item.date}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{item.event}</td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{item.time || '—'}</td>
                <td className="px-4 py-2.5"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#D8D5CC]">
          <span className="font-semibold text-xs">Recent Notifications</span>
        </div>
        {notifications.length === 0 && (
          <div className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No notifications</div>
        )}
        {notifications.map((n, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
            <div className={`w-8 h-8 ${n.color} rounded-lg flex items-center justify-center`}>
              <span className="text-xs">{n.icon}</span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-[#5F5E5A]">{n.text}</div>
            </div>
            <div className="text-[10px] text-[#5F5E5A]">{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
