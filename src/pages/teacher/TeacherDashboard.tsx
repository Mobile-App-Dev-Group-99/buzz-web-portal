import StatusBadge from '../../components/StatusBadge'

const MOCK_STUDENTS = [
  { name: 'Kofi Mensah', id: 'BZ-2041', status: 'arrived', time: '7:24 AM' },
  { name: 'Ama Boateng', id: 'BZ-1823', status: 'late', time: '9:45 AM' },
  { name: 'Ekow Osei', id: 'BZ-2187', status: 'arrived', time: '7:31 AM' },
  { name: 'Akua Asante', id: 'BZ-2099', status: 'arrived', time: '7:18 AM' },
  { name: 'Yaw Darko', id: 'BZ-2201', status: 'absent', time: '' },
  { name: 'Fiifi Owusu', id: 'BZ-2150', status: 'arrived', time: '7:22 AM' },
  { name: 'Abena Frimpong', id: 'BZ-1990', status: 'late', time: '8:52 AM' },
  { name: 'Kwesi Agyeman', id: 'BZ-2033', status: 'arrived', time: '7:25 AM' },
]

export default function TeacherDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a18]">SHS 2B — Class Attendance</h1>
          <p className="text-[#5F5E5A] text-xs mt-1">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#E1F5EE] px-3 py-1.5 rounded-md">
          <div className="w-2 h-2 rounded-full bg-[#1D9E75]"></div>
          <span className="text-xs font-semibold text-[#0F6E56]">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Present', val: '5', color: 'text-[#0F6E56]', bg: 'bg-[#E1F5EE]' },
          { label: 'Late', val: '2', color: 'text-[#854F0B]', bg: 'bg-[#FAEEDA]' },
          { label: 'Absent', val: '1', color: 'text-[#791F1F]', bg: 'bg-[#FCEBEB]' },
          { label: 'Total', val: '8', color: 'text-[#5F5E5A]', bg: 'bg-[#F7F6F2]' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-lg p-4 text-center`}>
            <div className={`text-3xl font-bold ${s.color}`}>{s.val}</div>
            <div className={`text-xs font-medium ${s.color} mt-1`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#D8D5CC] flex gap-3">
          {['All (8)', 'Present (5)', 'Late (2)', 'Absent (1)'].map((tab, i) => (
            <button key={tab} className={`text-xs font-medium pb-1 border-b-2 transition-all ${
              i === 0 ? 'text-[#0F6E56] border-[#1D9E75]' : 'text-[#5F5E5A] border-transparent hover:text-[#1D9E75] hover:border-[#1D9E75]'
            }`}>{tab}</button>
          ))}
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Student', 'ID', 'Status', 'Arrival Time', 'Action'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {MOCK_STUDENTS.map(s => (
              <tr key={s.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5 font-medium text-xs">{s.name}</td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{s.id}</td>
                <td className="px-4 py-2.5"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{s.time || '—'}</td>
                <td className="px-4 py-2.5">
                  {s.status === 'absent' && (
                    <button className="text-xs bg-[#1a1a18] text-white px-2 py-0.5 rounded font-medium">Mark Present</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="bg-[#1D9E75] text-white text-xs font-medium px-4 py-2 rounded-lg">Export Attendance PDF</button>
        <button className="border border-[#D8D5CC] text-xs font-medium px-4 py-2 rounded-lg bg-white">Send Absentee Alerts</button>
      </div>
    </div>
  )
}
