import { useState, useEffect } from 'react'
import { TrendingUp, BarChart3, Clock, Plane, FileDown, Table } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
import StatTile from '../../components/StatTile'
import { getTodaySummary, getWeeklyRates, getSchoolExeats } from '../../services/api'

export default function AdminReports() {
  const [stats, setStats] = useState({ attendanceRate: '—', avgArrival: '—', lateRate: '—', exeatCount: '—' })
  const [reportType, setReportType] = useState('daily')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [summary, weekly, exeats] = await Promise.allSettled([
          getTodaySummary(),
          getWeeklyRates(),
          getSchoolExeats(),
        ])
        if (summary.status === 'fulfilled' && summary.value) {
          const d = summary.value
          const total = (d.present || 0) + (d.late || 0) + (d.absent || 0)
          const rate = total > 0 ? Math.round(((d.present || 0) + (d.late || 0)) / total * 100) : 0
          const lateRate = total > 0 ? Math.round((d.late || 0) / total * 100 * 10) / 10 : 0
          setStats(prev => ({
            ...prev,
            attendanceRate: `${rate}%`,
            lateRate: `${lateRate}%`,
          }))
        }
        if (exeats.status === 'fulfilled') {
          const list = Array.isArray(exeats.value) ? exeats.value : []
          setStats(prev => ({ ...prev, exeatCount: String(list.length) }))
        }
        if (weekly.status === 'fulfilled' && Array.isArray(weekly.value) && weekly.value.length > 0) {
          const avg = weekly.value.reduce((sum: number, d: any) => sum + (d.percentage || d.h || 0), 0) / weekly.value.length
          setStats(prev => ({ ...prev, avgArrival: `${Math.round(avg)}% avg` }))
        }
      } catch (err) { console.warn('API error:', err) }
    }
    load()
  }, [])

  function handleExport(format: string) {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 1500)
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 space-y-5">
        <div className="grid grid-cols-4 gap-3">
          <StatTile label="Attendance Rate" value={stats.attendanceRate} icon={TrendingUp} category="positive" subtitle="This term" />
          <StatTile label="Avg Performance" value={stats.avgArrival} icon={BarChart3} category="info" subtitle="Weekly average" />
          <StatTile label="Late Rate" value={stats.lateRate} icon={Clock} category="warning" subtitle="Of all students" />
          <StatTile label="Exeats This Term" value={stats.exeatCount} icon={Plane} category="negative" subtitle="Total exeat records" />
        </div>

        <GlassCard>
          <div className="font-semibold text-xs mb-4 text-aurora-text">Generate Report</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Report Type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="input-glass w-full px-3 py-1.5 text-xs">
                <option value="daily">Daily Attendance</option>
                <option value="weekly">Weekly Summary</option>
                <option value="termly">Termly Attendance</option>
                <option value="exeat">Exeat History</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Date From</label>
              <input type="date" className="input-glass w-full px-3 py-1.5 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Date To</label>
              <input type="date" className="input-glass w-full px-3 py-1.5 text-xs" />
            </div>
            <div className="flex items-end">
              <div className="flex gap-2 w-full">
                <button onClick={() => handleExport('pdf')} disabled={generating} className="btn-primary flex-1 text-xs font-semibold py-2 disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <FileDown size={14} />
                  {generating ? 'Generating...' : 'Export PDF'}
                </button>
                <button onClick={() => handleExport('excel')} disabled={generating} className="btn-secondary flex-1 text-xs font-semibold py-2 disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <Table size={14} />
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
