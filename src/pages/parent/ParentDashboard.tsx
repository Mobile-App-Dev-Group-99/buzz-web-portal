import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import { getParentChildren, getStudentAttendance, getParentNotifications, getStudentExeats, markNotificationRead } from '../../services/api'
import AuroraBackground from '../../components/AuroraBackground'
import GlassCard from '../../components/GlassCard'
import StatTile from '../../components/StatTile'
import CategoryBadge from '../../components/CategoryBadge'
import { TrendingUp, ScanBarcode, CheckCircle, CalendarDays, Bell, FileText, Clock, AlertTriangle, Check, X, CornerDownLeft } from 'lucide-react'

export default function ParentDashboard() {
  const [children, setChildren] = useState<any[]>([])
  const [activeChild, setActiveChild] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [exeats, setExeats] = useState<any[]>([])
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
    if (children.length > 0 && children[activeChild]?.id) {
      getStudentExeats(children[activeChild].id)
        .then(data => {
          const list = Array.isArray(data) ? data : []
          setExeats(list.slice(0, 10))
        })
        .catch((err) => console.warn('API error:', err))
    }
  }, [activeChild, children])

  useEffect(() => {
    if (parentId) {
      getParentNotifications(parentId)
        .then(data => {
          const list = Array.isArray(data) ? data : data?.notifications || []
          setNotifications(list.slice(0, 10).map((n: any) => {
            const t = (n.type || '').toUpperCase()
            const msg = n.message || ''
            let iconType = 'check'
            if (t === 'LATE' || (!t && /late/i.test(msg))) iconType = 'alert'
            else if (t === 'DEPARTED' || (!t && /left|departed/i.test(msg))) iconType = 'return'
            else if (t === 'ABSENT' || (!t && /absent/i.test(msg))) iconType = 'cross'
            else if (t?.startsWith('EXEAT')) iconType = 'file'
            return {
              id: n.id,
              text: msg || 'Notification',
              time: n.sentAt ? new Date(n.sentAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : '',
              iconType,
              isRead: n.isRead,
            }
          }))
        })
        .catch((err) => console.warn('API error:', err))
    }
  }, [parentId])

  const child = children[activeChild]

  const NOTIF_ICONS: Record<string, { bg: string; el: React.ReactNode }> = {
    check: { bg: 'category-badge-positive', el: <Check className="w-3.5 h-3.5 text-cat-positive" /> },
    alert: { bg: 'category-badge-warning', el: <AlertTriangle className="w-3.5 h-3.5 text-cat-warning" /> },
    cross: { bg: 'category-badge-negative', el: <X className="w-3.5 h-3.5 text-cat-negative" /> },
    return: { bg: 'category-badge-info', el: <CornerDownLeft className="w-3.5 h-3.5 text-cat-info" /> },
    file: { bg: 'category-badge-info', el: <FileText className="w-3.5 h-3.5 text-cat-info" /> },
  }

  if (loading) {
    return (
      <div className="relative">
        <AuroraBackground />
        <div className="relative z-10 flex items-center justify-center py-12">
          <div className="text-sm text-aurora-text-secondary">Loading...</div>
        </div>
      </div>
    )
  }

  if (children.length === 0) {
    return (
      <div className="relative">
        <AuroraBackground />
        <div className="relative z-10 flex items-center justify-center py-12">
          <div className="text-sm text-aurora-text-secondary">No children linked to your account</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <AuroraBackground />
      <div className="relative z-10">
        <div className="flex gap-3 mb-6">
          {children.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveChild(i)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                i === activeChild
                  ? 'glass-card border-cat-positive/30 text-aurora-text'
                  : 'glass-card text-aurora-text-secondary hover:text-aurora-text'
              }`}
            >
              <Avatar
                initials={(c.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                size="sm"
                color={i === activeChild ? 'bg-cat-positive text-white' : 'bg-aurora-surface text-aurora-text-secondary'}
              />
              {c.name} · {c.class}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <StatTile
            label="Attendance Rate"
            value={history.length > 0 ? `${Math.round(history.filter(h => h.status !== 'absent').length / Math.max(history.length, 1) * 100)}%` : '—'}
            icon={TrendingUp}
            category="positive"
            subtitle="This term"
          />
          <StatTile
            label="Total Scans"
            value={history.length}
            icon={ScanBarcode}
            category="info"
            subtitle="This period"
          />
          <StatTile
            label="Today's Status"
            value={history.length > 0 && history[0]?.status === 'present' ? '✓' : history[0]?.status === 'late' ? 'L' : '—'}
            icon={CheckCircle}
            category={history.length > 0 && history[0]?.status === 'present' ? 'positive' : history[0]?.status === 'late' ? 'warning' : 'info'}
            subtitle={history[0]?.time ? `${history[0].time} · ${history[0].gate || ''}` : 'No scan yet'}
          />
        </div>

        <GlassCard noPadding className="mb-4">
          <div className="px-4 py-3 border-b border-aurora-divider flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-aurora-text-secondary" />
            <span className="font-semibold text-xs text-aurora-text">Attendance History — {child?.name || '—'}</span>
          </div>
          <table className="w-full">
            <thead><tr className="bg-aurora-surface border-b border-aurora-divider">
              {['Date', 'Event', 'Time', 'Status'].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-aurora-label-muted uppercase tracking-wide px-4 py-2.5">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {history.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-[11px] text-aurora-text-secondary">No attendance records</td></tr>
              )}
              {history.map((item, i) => (
                <tr key={i} className="border-b border-aurora-divider hover:bg-aurora-surface/50 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-medium text-aurora-text-secondary">{item.date}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{item.event}</td>
                  <td className="px-4 py-2.5 text-[11px] text-aurora-text-secondary font-mono">{item.time || '—'}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <GlassCard noPadding className="mb-4">
          <div className="px-4 py-3 border-b border-aurora-divider flex items-center gap-2">
            <FileText className="w-4 h-4 text-aurora-text-secondary" />
            <span className="font-semibold text-xs text-aurora-text">Exeat Requests — {child?.name || '—'}</span>
          </div>
          {exeats.length === 0 && (
            <div className="px-4 py-10 text-center text-[11px] text-aurora-text-secondary">No exeat requests</div>
          )}
          {exeats.map((ex: any) => {
            const statusMap: Record<string, string> = {
              PENDING: 'category-badge-warning',
              APPROVED: 'category-badge-positive',
              DENIED: 'category-badge-negative',
              RETURNED: 'category-badge-positive',
              OVERDUE: 'category-badge-negative',
            }
            const badgeClass = statusMap[ex.status] || 'category-badge-info'
            return (
              <div key={ex.id} className="flex items-center gap-3 px-4 py-3 border-b border-aurora-divider hover:bg-aurora-surface/50 transition-colors">
                <div className="flex-1">
                  <div className="text-xs font-medium text-aurora-text">{ex.reason || 'Exeat'}</div>
                  <div className="text-[10px] text-aurora-text-secondary mt-0.5">
                    {ex.createdAt ? new Date(ex.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
                    {ex.approvedByName && <span className="ml-2">· {ex.status === 'DENIED' ? 'Denied' : 'Approved'} by {ex.approvedByName}</span>}
                  </div>
                </div>
                <span className={`${badgeClass} px-2.5 py-0.5 rounded-full text-[10px] font-semibold`}>
                  {ex.status}
                </span>
              </div>
            )
          })}
        </GlassCard>

        <GlassCard noPadding>
          <div className="px-4 py-3 border-b border-aurora-divider flex items-center gap-2">
            <Bell className="w-4 h-4 text-aurora-text-secondary" />
            <span className="font-semibold text-xs text-aurora-text">Recent Notifications</span>
          </div>
          {notifications.length === 0 && (
            <div className="px-4 py-10 text-center text-[11px] text-aurora-text-secondary">No notifications</div>
          )}
          {notifications.map((n, i) => {
            const iconData = NOTIF_ICONS[n.iconType] || NOTIF_ICONS.check
            return (
              <div
                key={n.id || i}
                className={`flex items-center gap-3 px-4 py-3 border-b border-aurora-divider hover:bg-aurora-surface/50 cursor-pointer transition-colors ${n.isRead ? 'opacity-50' : ''}`}
                onClick={() => {
                  if (!n.isRead && n.id) {
                    markNotificationRead(n.id)
                    setNotifications(prev => prev.map((x: any) => x.id === n.id ? { ...x, isRead: true } : x))
                  }
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconData.bg}`}>
                  {iconData.el}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-aurora-text-secondary">{n.text}</div>
                </div>
                <div className="text-[10px] text-aurora-label-muted">{n.time}</div>
              </div>
            )
          })}
        </GlassCard>
      </div>
    </div>
  )
}
