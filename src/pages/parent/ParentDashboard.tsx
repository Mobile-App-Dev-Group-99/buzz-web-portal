import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'

const MOCK_CHILDREN = [
  { name: 'Kofi Mensah', class: 'SHS 2B', active: true },
  { name: 'Abena Mensah', class: 'JHS 3A', active: false },
]

const MOCK_HISTORY = [
  { date: 'Mon 17 Jun', event: 'Arrived at school', time: '7:24 AM', status: 'present' },
  { date: 'Fri 14 Jun', event: 'Arrived at school', time: '7:18 AM', status: 'present' },
  { date: 'Thu 13 Jun', event: 'Arrived late', time: '9:45 AM', status: 'late' },
  { date: 'Wed 12 Jun', event: 'Arrived at school', time: '7:31 AM', status: 'present' },
  { date: 'Tue 11 Jun', event: 'Arrived at school', time: '7:22 AM', status: 'present' },
  { date: 'Mon 10 Jun', event: 'Absent — no scan', time: '', status: 'absent' },
]

const MOCK_NOTIFICATIONS = [
  { text: 'Kofi arrived at school — Gate 1 · 7:24 AM', time: 'Today', color: 'bg-[#E1F5EE]' },
  { text: 'Kofi arrived late — 9:45 AM · 75 mins after bell', time: 'Thu 13 Jun', color: 'bg-[#FAEEDA]' },
  { text: 'Kofi arrived at school — Gate 1 · 7:18 AM', time: 'Fri 14 Jun', color: 'bg-[#E1F5EE]' },
]

export default function ParentDashboard() {
  const [activeChild, setActiveChild] = useState(0)

  return (
    <div>
      <div className="flex gap-3 mb-6">
        {MOCK_CHILDREN.map((child, i) => (
          <button
            key={child.name}
            onClick={() => setActiveChild(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
              i === activeChild
                ? 'bg-[#1D9E75] text-white border-[#1D9E75]'
                : 'bg-white text-[#5F5E5A] border-[#D8D5CC] hover:border-[#1D9E75]'
            }`}
          >
            <Avatar
              initials={child.name.split(' ').map(n => n[0]).join('')}
              size="sm"
              color={i === activeChild ? 'bg-white/20 text-white' : 'bg-[#F7F6F2] text-[#5F5E5A]'}
            />
            {child.name} · {child.class}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
          <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-2">Attendance Rate</div>
          <div className="text-3xl font-bold text-[#1a1a18]">94%</div>
          <div className="text-xs text-[#5F5E5A] mt-1">This term</div>
          <div className="mt-2 inline-block bg-[#E1F5EE] text-[#0F6E56] text-[10px] font-semibold px-2 py-0.5 rounded-md">Excellent</div>
        </div>
        <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
          <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-2">Current Streak</div>
          <div className="text-3xl font-bold text-[#1a1a18]">12 days</div>
          <div className="text-xs text-[#5F5E5A] mt-1">On time</div>
          <div className="mt-2 inline-block bg-[#E1F5EE] text-[#0F6E56] text-[10px] font-semibold px-2 py-0.5 rounded-md">Personal best</div>
        </div>
        <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
          <div className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-2">Today's Status</div>
          <div className="text-3xl font-bold text-[#0F6E56]">✓</div>
          <div className="text-xs text-[#5F5E5A] mt-1">Arrived 7:24 AM · Gate 1</div>
          <div className="mt-2 inline-block bg-[#E1F5EE] text-[#0F6E56] text-[10px] font-semibold px-2 py-0.5 rounded-md">On time</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-[#D8D5CC]">
          <span className="font-semibold text-xs">Attendance History — {MOCK_CHILDREN[activeChild].name}</span>
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Date', 'Event', 'Time', 'Status'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {MOCK_HISTORY.map((item, i) => (
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
        {MOCK_NOTIFICATIONS.map((n, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
            <div className={`w-8 h-8 ${n.color} rounded-lg flex items-center justify-center`}>
              <span className="text-xs">✓</span>
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
