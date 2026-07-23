import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'

const MOCK_STAFF = [
  { name: 'Headmaster Kweku', role: 'Administrator', email: 'hm@prempeh.edu.gh', login: 'Today 11:30 AM' },
  { name: 'Mr. Boateng', role: 'Class Teacher', email: 'boateng@prempeh.edu.gh', login: 'Today 09:12 AM' },
  { name: 'Madam Asante', role: 'House Mistress', email: 'asante@prempeh.edu.gh', login: 'Today 08:45 AM' },
  { name: 'Kofi Gate', role: 'Gate Attendant', email: 'gate1@prempeh.edu.gh', login: 'Today 06:30 AM' },
]

export default function AdminStaff() {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input placeholder="Search staff..." className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs w-64 outline-none focus:border-[#1D9E75] bg-white" />
        <button className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">+ Add Staff</button>
      </div>
      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Name', 'Role', 'Email', 'Last Login', 'Status', ''].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {MOCK_STAFF.map(s => (
              <tr key={s.name} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar initials={s.name.split(' ').map(n => n[0]).join('').slice(0, 2)} size="sm" color="bg-[#E1F5EE] text-[#0F6E56]" />
                    <span className="font-medium text-xs">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{s.role}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{s.email}</td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{s.login}</td>
                <td className="px-4 py-2.5"><StatusBadge status="Active" /></td>
                <td className="px-4 py-2.5"><button className="text-xs text-[#5F5E5A] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#F7F6F2]">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
