import StatusBadge from '../../components/StatusBadge'

const MOCK_MESSAGES = [
  { id: 1, from: 'Mrs. Frimpong', student: 'Abena Frimpong · JHS 2B', subject: 'Excuse note — sick today', time: '09:15 AM', status: 'Unread' },
  { id: 2, from: 'Mr. Agyeman', student: 'Kwesi Agyeman · SHS 3A', subject: 'Early departure request — 2PM', time: '08:47 AM', status: 'Unread' },
  { id: 3, from: 'Mrs. Asare', student: 'Kwame Asare · SHS 2A', subject: 'Regarding exeat — returning tomorrow', time: '07:30 AM', status: 'Read' },
]

export default function AdminMessaging() {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className="bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">New Announcement</button>
        <button className="border border-[#D8D5CC] text-xs font-medium px-3 py-1.5 rounded-lg bg-white">+ Message Parent</button>
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <div className="px-4 py-2 border-b border-[#D8D5CC]">
          <span className="font-semibold text-xs">Inbox (7)</span>
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['From', 'Student', 'Subject', 'Time', 'Status'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {MOCK_MESSAGES.map(m => (
              <tr key={m.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2] cursor-pointer">
                <td className="px-4 py-2.5 font-medium text-xs">{m.from}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{m.student}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{m.subject}</td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{m.time}</td>
                <td className="px-4 py-2.5"><StatusBadge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
