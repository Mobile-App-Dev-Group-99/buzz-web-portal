import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import { getTodaySummary, getLiveFeed, getClassesToday, getWeeklyRates } from '../../services/api'

function barColor(pct: number) {
  if (pct >= 85) return 'bg-[#1D9E75]'
  if (pct >= 70) return 'bg-[#854F0B]'
  return 'bg-[#791F1F]'
}

function alertDot(type: string) {
  const map: Record<string, string> = { red: 'bg-[#791F1F]', amber: 'bg-[#854F0B]', green: 'bg-[#1D9E75]' }
  return `w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${map[type] || 'bg-gray-400'}`
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
            present: d.present || d.totalPresent || 0,
            late: d.late || d.totalLate || 0,
            absent: d.absent || d.totalAbsent || 0,
            onExeat: d.onExeat || d.exeatCount || 0,
          })
        }
        if (feed.status === 'fulfilled' && Array.isArray(feed.value)) {
          setGateFeed(feed.value.slice(0, 5).map((item: any, i: number) => ({
            id: item.studentId || item.id || i,
            name: item.studentName || item.name || `Student ${item.studentId}`,
            class: item.className || '—',
            gate: item.gate || 'Gate 1',
            status: (item.status || 'arrived').toLowerCase(),
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
        if (weekly.status === 'fulfilled' && Array.isArray(weekly.value)) {
          setWeeklyRates(weekly.value)
        }
      } catch {}
      if (mounted) setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Present Today', val: stats.present, sub: 'Students present', color: 'text-[#0F6E56]', bg: 'bg-[#E1F5EE]' },
          { label: 'Late Arrivals', val: stats.late, sub: 'Late today', color: 'text-[#854F0B]', bg: 'bg-[#FAEEDA]' },
          { label: 'Absent', val: stats.absent, sub: 'Absent today', color: 'text-[#791F1F]', bg: 'bg-[#FCEBEB]' },
          { label: 'On Exeat', val: stats.onExeat, sub: 'Currently out', color: 'text-[#0C447C]', bg: 'bg-[#E6F1FB]' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-lg p-4`}>
            <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide mb-2">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[11px] text-[#5F5E5A] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="col-span-3 bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#D8D5CC] flex justify-between items-center">
            <span className="font-semibold text-[#1a1a18] text-xs">Live Gate Activity</span>
          </div>
          {gateFeed.length === 0 && !loading && (
            <div className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No gate activity today</div>
          )}
          {gateFeed.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
              <Avatar
                initials={(item.name || 'S').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                size="sm"
                color="bg-[#E1F5EE] text-[#0F6E56]"
              />
              <div className="flex-1">
                <div className="font-medium text-xs text-[#1a1a18]">{item.name}</div>
                <div className="text-[10px] text-[#5F5E5A]">{item.class} · {item.gate}</div>
              </div>
              <StatusBadge status={item.status} />
              <span className="text-[10px] text-[#5F5E5A] font-mono">{item.time}</span>
            </div>
          ))}
        </div>

        <div className="col-span-2 bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#D8D5CC]">
            <span className="font-semibold text-[#1a1a18] text-xs">System Alerts</span>
          </div>
          <div className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No alerts</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#D8D5CC]">
            <span className="font-semibold text-[#1a1a18] text-xs">Class Attendance Today</span>
          </div>
          {classes.length === 0 && !loading && (
            <div className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No class data today</div>
          )}
          {classes.map(c => (
            <div key={c.name} className="flex items-center gap-3 px-4 py-2 hover:bg-[#F7F6F2]">
              <span className="text-xs font-medium text-[#5F5E5A] w-16">{c.name}</span>
              <div className="flex-1 h-1.5 bg-[#F7F6F2] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor(c.pct)}`} style={{ width: `${c.pct}%` }} />
              </div>
              <span className="text-[11px] font-semibold text-[#5F5E5A] font-mono w-9 text-right">{c.pct}%</span>
              <span className="text-[10px] text-[#5F5E5A] w-14 text-right">{c.present}/{c.total}</span>
            </div>
          ))}
        </div>

        <div className="col-span-2 bg-white rounded-lg border border-[#D8D5CC] p-4">
          <div className="text-xs font-semibold text-[#1a1a18] mb-3">Weekly Attendance Rate</div>
          <div className="flex items-end gap-2 h-24">
            {(weeklyRates.length > 0 ? weeklyRates : [
              { day: 'Mon', h: 75 }, { day: 'Tue', h: 82 }, { day: 'Wed', h: 68 },
              { day: 'Thu', h: 88 }, { day: 'Fri', h: 90, today: true },
            ]).map((b: any) => (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full rounded-t ${b.today ? 'bg-[#0F6E56]' : 'bg-[#1D9E75]/70'}`} style={{ height: b.h || b.percentage || 75 }} />
                <span className="text-[9px] text-[#5F5E5A] font-mono">{b.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
