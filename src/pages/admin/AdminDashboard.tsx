import { useState, useEffect } from 'react'
import { Users, Clock, UserX, Plane, AlertTriangle } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
import StatTile from '../../components/StatTile'
import AnimatedIcon from '../../components/AnimatedIcon'
import { getTodaySummary, getLiveFeed, getClassesToday, getWeeklyRates } from '../../services/api'

function barColor(pct: number) {
  if (pct >= 85) return 'bg-cat-positive'
  if (pct >= 70) return 'bg-cat-warning'
  return 'bg-cat-negative'
}

function alertDot(type: string) {
  const map: Record<string, string> = { red: 'bg-cat-negative', amber: 'bg-cat-warning', green: 'bg-cat-positive' }
  return `w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${map[type] || 'bg-aurora-text-secondary'}`
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ present: 0, late: 0, absent: 0, onExeat: 0 })
  const [gateFeed, setGateFeed] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [weeklyRates, setWeeklyRates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [summary, feed, cls, weekly] = await Promise.allSettled([
          getTodaySummary(),
          getLiveFeed(),
          getClassesToday(),
          getWeeklyRates(),
        ])
        if (!mounted) return
        if (summary.status === 'fulfilled' && summary.value) {
          const d = summary.value
          setStats({
            present: d.presentToday || d.present || 0,
            late: d.lateArrivals || d.late || 0,
            absent: d.absent || 0,
            onExeat: d.onExeat || 0,
          })
        }
        if (feed.status === 'fulfilled' && Array.isArray(feed.value)) {
          setGateFeed(feed.value.slice(0, 5).map((item: any, i: number) => ({
            id: i,
            name: item.studentName || item.name || 'Unknown',
            class: item.className || '—',
            gate: item.gate || 'Gate 1',
            status: (item.status || 'ARRIVED').toString().toLowerCase(),
            time: item.scannedAt ? new Date(item.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          })))
        }
        if (cls.status === 'fulfilled' && Array.isArray(cls.value)) {
          setClasses(cls.value.map((c: any) => ({
            name: c.className || c.name || '—',
            pct: c.percentage || c.pct || 0,
            present: c.present || 0,
            total: c.total || c.totalStudents || 0,
          })))
        }
        if (weekly.status === 'fulfilled' && weekly.value) {
          const raw = weekly.value.rateByDay || weekly.value
          if (Array.isArray(raw)) {
            setWeeklyRates(raw)
          } else if (typeof raw === 'object') {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
            const keys = Object.keys(raw)
            setWeeklyRates(keys.map((k, i) => ({
              day: days[i] || k.slice(0, 3),
              h: Math.round(raw[k] || 0),
              today: i === keys.length - 1,
            })))
          }
        }
      } catch (err) {
        console.warn('Failed to load dashboard data:', err)
      }
      if (mounted) setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 space-y-5">
        <div className="grid grid-cols-4 gap-3">
          <StatTile label="Present Today" value={stats.present} icon={Users} category="positive" subtitle="Students present" />
          <StatTile label="Late Arrivals" value={stats.late} icon={Clock} category="warning" subtitle="Late today" />
          <StatTile label="Absent" value={stats.absent} icon={UserX} category="negative" subtitle="Absent today" />
          <StatTile label="On Exeat" value={stats.onExeat} icon={Plane} category="info" subtitle="Currently out" />
        </div>

        <div className="grid grid-cols-5 gap-4">
          <GlassCard noPadding className="col-span-3">
            <div className="px-4 py-3 border-b border-aurora-divider flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AnimatedIcon icon={Users} category="positive" size={16} />
                <span className="font-semibold text-aurora-text text-xs">Live Gate Activity</span>
              </div>
            </div>
            {gateFeed.length === 0 && !loading && (
              <div className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">No gate activity today</div>
            )}
            {gateFeed.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-aurora-divider hover:bg-aurora-surface/60 transition-colors">
                <Avatar
                  initials={(item.name || 'S').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="font-medium text-xs text-aurora-text">{item.name}</div>
                  <div className="text-[10px] text-aurora-text-secondary">{item.class} · {item.gate}</div>
                </div>
                <StatusBadge status={item.status} />
                <span className="text-[10px] text-aurora-label-muted font-mono tabular-nums">{item.time}</span>
              </div>
            ))}
          </GlassCard>

          <GlassCard noPadding className="col-span-2">
            <div className="px-4 py-3 border-b border-aurora-divider">
              <div className="flex items-center gap-2">
                <AnimatedIcon icon={AlertTriangle} category="warning" size={16} />
                <span className="font-semibold text-aurora-text text-xs">System Alerts</span>
              </div>
            </div>
            <div className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">No alerts</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <GlassCard noPadding className="col-span-3">
            <div className="px-4 py-3 border-b border-aurora-divider">
              <span className="font-semibold text-aurora-text text-xs">Class Attendance Today</span>
            </div>
            {classes.length === 0 && !loading && (
              <div className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">No class data today</div>
            )}
            {classes.map(c => (
              <div key={c.name} className="flex items-center gap-3 px-4 py-2 hover:bg-aurora-surface/60 transition-colors">
                <span className="text-xs font-medium text-aurora-text-secondary w-16">{c.name}</span>
                <div className="flex-1 h-1.5 bg-aurora-divider rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor(c.pct)} transition-all duration-500`} style={{ width: `${c.pct}%` }} />
                </div>
                <span className="text-[11px] font-semibold text-aurora-text-secondary font-mono tabular-nums w-9 text-right">{c.pct}%</span>
                <span className="text-[10px] text-aurora-label-muted w-14 text-right tabular-nums">{c.present}/{c.total}</span>
              </div>
            ))}
          </GlassCard>

          <GlassCard noPadding className="col-span-2 p-4">
            <div className="text-xs font-semibold text-aurora-text mb-3">Weekly Attendance Rate</div>
            <div className="flex items-end gap-2 h-24">
              {(weeklyRates.length > 0 ? weeklyRates : [
                { day: 'Mon', h: 75 }, { day: 'Tue', h: 82 }, { day: 'Wed', h: 68 },
                { day: 'Thu', h: 88 }, { day: 'Fri', h: 90, today: true },
              ]).map((b: any) => (
                <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-t transition-all duration-500 ${b.today ? 'bg-cat-positive' : 'bg-cat-positive/50'}`} style={{ height: b.h || b.percentage || 75 }} />
                  <span className="text-[9px] text-aurora-label-muted font-mono">{b.day}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
