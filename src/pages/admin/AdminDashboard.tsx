import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'

const MOCK_GATE_FEED = [
  { id: 1, name: 'Kofi Mensah', class: 'SHS 2B', gate: 'Gate 1', status: 'arrived', time: '7:24' },
  { id: 2, name: 'Ama Boateng', class: 'JHS 3A', gate: 'Gate 1', status: 'late', time: '9:45' },
  { id: 3, name: 'Ekow Osei', class: 'SHS 1A', gate: 'Gate 2', status: 'arrived', time: '7:31' },
  { id: 4, name: 'Akua Asante', class: 'SHS 3C', gate: 'Gate 1', status: 'departed', time: '11:35' },
  { id: 5, name: 'Yaw Darko', class: 'JHS 2B', gate: 'Gate 2', status: 'late', time: '8:12' },
]

const MOCK_ALERTS = [
  { id: 1, type: 'red', text: 'Kwame Asare overdue return from exeat. Expected 6:00 PM yesterday.', time: 'Today 08:12' },
  { id: 2, type: 'amber', text: 'Abena Frimpong: 4 absences in past 2 weeks. Auto-alert sent to parent.', time: 'Today 09:00' },
  { id: 3, type: 'amber', text: 'SHS 3A: 8 students absent — highest in school today.', time: 'Today 09:05' },
  { id: 4, type: 'green', text: 'Bulk exeat approved: 47 SHS students for weekend.', time: 'Yesterday 16:20' },
]

const MOCK_CLASSES = [
  { name: 'JHS 1A', pct: 96, present: 48, total: 50 },
  { name: 'JHS 2B', pct: 88, present: 44, total: 50 },
  { name: 'JHS 3A', pct: 74, present: 37, total: 50 },
  { name: 'SHS 1A', pct: 93, present: 56, total: 60 },
  { name: 'SHS 2B', pct: 90, present: 54, total: 60 },
  { name: 'SHS 3C', pct: 62, present: 37, total: 60 },
]

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
  const [stats] = useState({ present: 847, late: 34, absent: 67, onExeat: 18 })

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Present Today', val: stats.present, sub: '+12 from yesterday', color: 'text-[#0F6E56]', bg: 'bg-[#E1F5EE]' },
          { label: 'Late Arrivals', val: stats.late, sub: '3.9% of students', color: 'text-[#854F0B]', bg: 'bg-[#FAEEDA]' },
          { label: 'Absent', val: stats.absent, sub: 'Alerts sent to parents', color: 'text-[#791F1F]', bg: 'bg-[#FCEBEB]' },
          { label: 'On Exeat', val: stats.onExeat, sub: '3 overdue returns', color: 'text-[#0C447C]', bg: 'bg-[#E6F1FB]' },
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
          {MOCK_GATE_FEED.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
              <Avatar
                initials={item.name.split(' ').map(n => n[0]).join('')}
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
          {MOCK_ALERTS.map(a => (
            <div key={a.id} className="flex gap-2.5 px-4 py-2.5 border-b border-[#F7F6F2]">
              <div className={alertDot(a.type)} />
              <div>
                <div className="text-[11px] text-[#5F5E5A] leading-relaxed">{a.text}</div>
                <div className="text-[10px] text-[#5F5E5A] font-mono mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#D8D5CC]">
            <span className="font-semibold text-[#1a1a18] text-xs">Class Attendance Today</span>
          </div>
          {MOCK_CLASSES.map(c => (
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
            {[
              { day: 'Mon', h: 75 }, { day: 'Tue', h: 82 }, { day: 'Wed', h: 68 },
              { day: 'Thu', h: 88 }, { day: 'Fri', h: 90, today: true },
            ].map(b => (
              <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full rounded-t ${b.today ? 'bg-[#0F6E56]' : 'bg-[#1D9E75]/70'}`} style={{ height: b.h }} />
                <span className="text-[9px] text-[#5F5E5A] font-mono">{b.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
