import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge'

const MOCK_EXEATS = [
  { id: 1, name: 'Kwame Asare', class: 'SHS 2A', reason: 'Home weekend', departed: 'Fri 5 Jun 2:10 PM', expected: 'Sat 6 Jun 6:00 PM', status: 'Overdue' },
  { id: 2, name: 'Akua Asante', class: 'SHS 3C', reason: 'Family event', departed: 'Sat 6 Jun 11:35 AM', expected: 'Sun 7 Jun 6:00 PM', status: 'On Exeat' },
  { id: 3, name: 'Fiifi Owusu', class: 'SHS 2A', reason: 'Medical', departed: 'Thu 4 Jun 9:00 AM', expected: 'Sat 6 Jun 8:00 AM', status: 'Returned' },
]

export default function AdminExeats() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'On Campus', val: '312', color: 'text-[#0F6E56]', bg: 'bg-[#E1F5EE]' },
          { label: 'On Exeat', val: '18', color: 'text-[#0C447C]', bg: 'bg-[#E6F1FB]' },
          { label: 'Overdue Return', val: '3', color: 'text-[#791F1F]', bg: 'bg-[#FCEBEB]' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className={`text-xs font-medium ${s.color} mt-1`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setShowForm(!showForm)} className="bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">+ New Exeat</button>
        <button className="border border-[#D8D5CC] text-xs font-medium px-3 py-1.5 rounded-lg bg-white">Bulk Weekend Exeat</button>
        <button className="border border-[#D8D5CC] text-xs font-medium px-3 py-1.5 rounded-lg bg-white">Export Report</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-[#D8D5CC] p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-xs">New Exeat Request</span>
            <button onClick={() => setShowForm(false)} className="text-[#5F5E5A] text-xs">Cancel</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Student</label>
              <select className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white">
                <option>Select student...</option>
              </select>
            </div>
            <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Reason</label>
              <select className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white">
                <option>Home Weekend</option><option>Medical</option><option>Family Emergency</option>
              </select>
            </div>
            <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Departure</label>
              <input type="datetime-local" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white" />
            </div>
            <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Expected Return</label>
              <input type="datetime-local" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white" />
            </div>
            <div className="col-span-2">
              <button onClick={() => setShowForm(false)} className="w-full bg-[#1D9E75] text-white text-xs font-semibold py-2 rounded-lg">
                Approve & Notify Parent
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Student', 'Class', 'Reason', 'Departed', 'Expected Return', 'Status', ''].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {MOCK_EXEATS.map(e => (
              <tr key={e.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5 font-medium text-xs">{e.name}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{e.class}</td>
                <td className="px-4 py-2.5 text-xs text-[#5F5E5A]">{e.reason}</td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{e.departed}</td>
                <td className="px-4 py-2.5 text-[11px] text-[#5F5E5A] font-mono">{e.expected}</td>
                <td className="px-4 py-2.5"><StatusBadge status={e.status} /></td>
                <td className="px-4 py-2.5"><button className="text-xs text-[#5F5E5A] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#F7F6F2]">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
