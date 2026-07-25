import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import { getSchoolExeats, createExeat, updateExeatStatus } from '../../services/api'

const emptyForm = { studentId: '', reason: '', startDate: '', endDate: '' }

export default function AdminExeats() {
  const [showForm, setShowForm] = useState(false)
  const [viewExeat, setViewExeat] = useState<any>(null)
  const [exeats, setExeats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const loadExeats = () => {
    setLoading(true)
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
          studentId: e.studentId,
          startDate: e.startDate || e.departedAt,
          endDate: e.endDate || e.expectedReturn,
        })))
      })
      .catch((err) => console.warn('API error:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadExeats() }, [])

  const onCampus = exeats.filter(e => e.status === 'RETURNED' || e.status === 'PENDING').length
  const onExeat = exeats.filter(e => e.status === 'APPROVED' || e.status === 'ON_EXEAT').length
  const overdue = exeats.filter(e => e.status === 'OVERDUE').length

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await createExeat({
        studentId: Number(form.studentId),
        reason: form.reason,
        startDate: form.startDate,
        endDate: form.endDate,
      })
      setShowForm(false)
      setForm(emptyForm)
      loadExeats()
    } catch (err) {
      console.warn('Create exeat error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleStatus = async (id: number, status: string) => {
    try {
      await updateExeatStatus(id, status)
      loadExeats()
    } catch (err) {
      console.warn('Update status error:', err)
    }
  }

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
            <button onClick={() => { setShowForm(false); setForm(emptyForm) }} className="text-[#5F5E5A] text-xs">Cancel</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Student ID</label>
              <input value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} placeholder="Student ID" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:border-[#1D9E75]" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Reason</label>
              <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Reason" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:border-[#1D9E75]" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Start Date</label>
              <input type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:border-[#1D9E75]" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">End Date</label>
              <input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:border-[#1D9E75]" />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={handleSubmit} disabled={saving || !form.studentId || !form.reason || !form.startDate || !form.endDate} className="bg-[#1D9E75] text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
              {saving ? 'Submitting...' : 'Submit Exeat'}
            </button>
          </div>
        </div>
      )}

      {viewExeat && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-[#D8D5CC] p-5 w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-xs text-[#1a1a18]">Exeat Details</span>
              <button onClick={() => setViewExeat(null)} className="text-[#5F5E5A] text-xs">Close</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[#5F5E5A]">Student</span><span className="font-medium text-[#1a1a18]">{viewExeat.name}</span></div>
              <div className="flex justify-between"><span className="text-[#5F5E5A]">Class</span><span className="text-[#1a1a18]">{viewExeat.class}</span></div>
              <div className="flex justify-between"><span className="text-[#5F5E5A]">Reason</span><span className="text-[#1a1a18]">{viewExeat.reason}</span></div>
              <div className="flex justify-between"><span className="text-[#5F5E5A]">Departed</span><span className="text-[#1a1a18] font-mono">{viewExeat.departed}</span></div>
              <div className="flex justify-between"><span className="text-[#5F5E5A]">Expected Return</span><span className="text-[#1a1a18] font-mono">{viewExeat.expected}</span></div>
              <div className="flex justify-between items-center"><span className="text-[#5F5E5A]">Status</span><StatusBadge status={viewExeat.status} /></div>
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
                <td className="px-4 py-2.5">
                  <div className="flex gap-1">
                    <button onClick={() => setViewExeat(e)} className="text-xs text-[#5F5E5A] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#F7F6F2]">View</button>
                    {e.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleStatus(e.id, 'APPROVED')} className="text-xs text-[#0F6E56] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#E1F5EE]">Approve</button>
                        <button onClick={() => handleStatus(e.id, 'DENIED')} className="text-xs text-[#791F1F] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#FCEBEB]">Deny</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
