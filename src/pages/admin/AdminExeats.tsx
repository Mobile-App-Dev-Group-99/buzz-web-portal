import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import { getSchoolExeats } from '../../services/api'

export default function AdminExeats() {
  const [showForm, setShowForm] = useState(false)
  const [exeats, setExeats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSchoolExeats()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.exeats || data?.content || []
        setExeats(list.map((e: any) => ({
          id: e.id || e.exeatId,
          name: e.studentName || `${e.firstName || ''} ${e.lastName || ''}`.trim() || `Student ${e.studentId}`,
          class: e.className || '—',
          reason: e.reason || '—',
          departed: e.departedAt ? new Date(e.departedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
          expected: e.expectedReturn ? new Date(e.expectedReturn).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
          status: e.status || 'PENDING',
        })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const onCampus = exeats.filter(e => e.status === 'RETURNED' || e.status === 'PENDING').length
  const onExeat = exeats.filter(e => e.status === 'APPROVED' || e.status === 'ON_EXEAT').length
  const overdue = exeats.filter(e => e.status === 'OVERDUE').length

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'On Campus', val: String(onCampus || '—'), color: 'text-[#0F6E56]', bg: 'bg-[#E1F5EE]' },
          { label: 'On Exeat', val: String(onExeat || '—'), color: 'text-[#0C447C]', bg: 'bg-[#E6F1FB]' },
          { label: 'Overdue Return', val: String(overdue || '—'), color: 'text-[#791F1F]', bg: 'bg-[#FCEBEB]' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-lg p-4 text-center`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className={`text-xs font-medium ${s.color} mt-1`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setShowForm(!showForm)} className="bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">+ New Exeat</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-[#D8D5CC] p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-xs">New Exeat Request</span>
            <button onClick={() => setShowForm(false)} className="text-[#5F5E5A] text-xs">Cancel</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Student ID</label>
              <input placeholder="Student ID" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white" />
            </div>
            <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Reason</label>
              <input placeholder="Reason" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white" />
            </div>
            <div><label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Expected Return</label>
              <input type="datetime-local" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white" />
            </div>
            <div className="flex items-end">
              <button onClick={() => setShowForm(false)} className="w-full bg-[#1D9E75] text-white text-xs font-semibold py-2 rounded-lg">
                Submit Exeat
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
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">Loading exeats...</td></tr>
            )}
            {!loading && exeats.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No exeat records</td></tr>
            )}
            {exeats.map(e => (
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
