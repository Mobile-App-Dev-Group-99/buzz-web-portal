import { useState, useEffect } from 'react'
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
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Attendance Rate', val: stats.attendanceRate, sub: 'This term' },
          { label: 'Avg Performance', val: stats.avgArrival, sub: 'Weekly average' },
          { label: 'Late Rate', val: stats.lateRate, sub: 'Of all students' },
          { label: 'Exeats This Term', val: stats.exeatCount, sub: 'Total exeat records' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-[#D8D5CC] p-4">
            <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-[#1a1a18]">{s.val}</div>
            <div className="text-[11px] text-[#5F5E5A] mt-1">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
        <div className="font-semibold text-xs mb-4">Generate Report</div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Report Type</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white">
              <option value="daily">Daily Attendance</option>
              <option value="weekly">Weekly Summary</option>
              <option value="termly">Termly Attendance</option>
              <option value="exeat">Exeat History</option>
            </select>
          </div>
          <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Date From</label>
            <input type="date" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white" />
          </div>
          <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Date To</label>
            <input type="date" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white" />
          </div>
          <div className="flex items-end">
            <div className="flex gap-2 w-full">
              <button onClick={() => handleExport('pdf')} disabled={generating} className="flex-1 bg-[#1D9E75] text-white text-xs font-semibold py-2 rounded-lg disabled:opacity-50">
                {generating ? 'Generating...' : 'Export PDF'}
              </button>
              <button onClick={() => handleExport('excel')} disabled={generating} className="flex-1 border border-[#D8D5CC] text-xs font-semibold py-2 rounded-lg bg-white disabled:opacity-50">
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
