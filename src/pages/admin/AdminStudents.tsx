import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'

const MOCK_STUDENTS = [
  { id: 'BZ-2041', name: 'Kofi Mensah', class: 'SHS 2B', level: 'SHS Boarding', biometric: true, status: 'Active' },
  { id: 'BZ-1823', name: 'Ama Boateng', class: 'JHS 3A', level: 'JHS', biometric: true, status: 'Active' },
  { id: 'BZ-2187', name: 'Ekow Osei', class: 'SHS 1A', level: 'SHS Day', biometric: false, status: 'Active' },
  { id: 'BZ-2099', name: 'Akua Asante', class: 'SHS 3C', level: 'SHS Boarding', biometric: true, status: 'On Exeat' },
]

export default function AdminStudents() {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input placeholder="Search by name, ID, class..." className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs w-64 outline-none focus:border-[#1D9E75] bg-white" />
        <button className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">+ Add Student</button>
        <button className="border border-[#D8D5CC] text-xs font-medium px-3 py-1.5 rounded-lg bg-white">Bulk CSV Import</button>
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Student', 'ID', 'Class', 'Level', 'Biometric', 'Status', ''].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {MOCK_STUDENTS.map(s => (
              <tr key={s.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar initials={s.name.split(' ').map(n => n[0]).join('')} size="sm" color="bg-[#E1F5EE] text-[#0F6E56]" />
                    <span className="font-medium text-xs">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{s.id}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{s.class}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{s.level}</td>
                <td className="px-4 py-2.5">
                  <span className={s.biometric ? 'text-[#0F6E56] text-xs font-medium' : 'text-[#791F1F] text-xs'}>
                    {s.biometric ? 'Enrolled' : 'Not enrolled'}
                  </span>
                </td>
                <td className="px-4 py-2.5"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-2.5"><button className="text-xs text-[#5F5E5A] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#F7F6F2]">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
