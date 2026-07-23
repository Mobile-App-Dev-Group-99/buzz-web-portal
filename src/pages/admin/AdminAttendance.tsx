import StatusBadge from '../../components/StatusBadge'

const MOCK_ATTENDANCE = [
  { id: 1, name: 'Kofi Mensah', class: 'SHS 2B', gate: 'Gate 1', status: 'arrived', time: '7:24 AM', notified: true },
  { id: 2, name: 'Ama Boateng', class: 'JHS 3A', gate: 'Gate 1', status: 'late', time: '9:45 AM', notified: true },
  { id: 3, name: 'Ekow Osei', class: 'SHS 1A', gate: 'Gate 2', status: 'arrived', time: '7:31 AM', notified: true },
  { id: 4, name: 'Akua Asante', class: 'SHS 3C', gate: 'Gate 1', status: 'arrived', time: '7:18 AM', notified: true },
  { id: 5, name: 'Yaw Darko', class: 'JHS 2B', gate: 'Gate 2', status: 'late', time: '8:12 AM', notified: true },
  { id: 6, name: 'Fiifi Owusu', class: 'SHS 2A', gate: 'Gate 1', status: 'departed', time: '11:35 AM', notified: true },
]

export default function AdminAttendance() {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input placeholder="Search student or class..." className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs w-64 outline-none focus:border-[#1D9E75] bg-white" />
        <select className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white">
          <option>All Classes</option><option>JHS 1A</option><option>SHS 2B</option>
        </select>
        <button className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">Export</button>
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Student', 'Class', 'Gate', 'Event', 'Time', 'Parent Notified'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {MOCK_ATTENDANCE.map(item => (
              <tr key={item.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5 font-medium text-xs">{item.name}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{item.class}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{item.gate}</td>
                <td className="px-4 py-2.5"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{item.time}</td>
                <td className="px-4 py-2.5 text-[#0F6E56] text-xs font-medium">{item.notified ? 'Sent' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
