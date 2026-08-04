import { useState, useEffect } from 'react'
import { Plus, X, Eye, ShieldCheck, ShieldX } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
import StatTile from '../../components/StatTile'
import { getSchoolExeats, createExeat, updateExeatStatus } from '../../services/api'

const emptyForm = { studentId: '', reason: '', notes: '', expectedReturn: '' }

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
          class: e.studentClass || e.className || '—',
          reason: e.reason || '—',
          departed: e.createdAt ? new Date(e.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
          expected: e.expectedReturn ? new Date(e.expectedReturn).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—',
          status: e.status || 'PENDING',
          studentId: e.studentId,
          approvedByName: e.approvedByName || '—',
        })))
      })
      .catch((err) => console.warn('API error:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadExeats() }, [])

  const onCampus = exeats.filter(e => e.status === 'RETURNED' || e.status === 'PENDING').length
  const onExeat = exeats.filter(e => e.status === 'APPROVED').length
  const overdue = exeats.filter(e => e.status === 'OVERDUE').length

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await createExeat({
        studentId: Number(form.studentId),
        reason: form.reason,
        expectedReturn: form.expectedReturn || undefined,
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
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="On Campus" value={onCampus || '—'} icon={ShieldCheck} category="positive" />
          <StatTile label="On Exeat" value={onExeat || '—'} icon={Eye} category="info" />
          <StatTile label="Overdue Return" value={overdue || '—'} icon={ShieldX} category="negative" />
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Plus size={14} /> New Exeat
        </button>

        {showForm && (
          <GlassCard>
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-xs text-aurora-text">New Exeat Request</span>
              <button onClick={() => { setShowForm(false); setForm(emptyForm) }} className="text-aurora-text-secondary text-xs hover:text-aurora-text transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Student ID</label>
                <input value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} placeholder="Student ID" className="input-glass w-full px-3 py-1.5 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Reason</label>
                <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Reason" className="input-glass w-full px-3 py-1.5 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Expected Return</label>
                <input type="datetime-local" value={form.expectedReturn} onChange={e => setForm({ ...form, expectedReturn: e.target.value })} className="input-glass w-full px-3 py-1.5 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Notes (optional)</label>
                <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes" className="input-glass w-full px-3 py-1.5 text-xs" />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={handleSubmit} disabled={saving || !form.studentId || !form.reason} className="btn-primary text-xs font-semibold px-4 py-2 disabled:opacity-50">
                {saving ? 'Submitting...' : 'Submit Exeat'}
              </button>
            </div>
          </GlassCard>
        )}

        {viewExeat && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <GlassCard className="w-96">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-xs text-aurora-text">Exeat Details</span>
                <button onClick={() => setViewExeat(null)} className="text-aurora-text-secondary text-xs hover:text-aurora-text transition-colors">Close</button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-aurora-text-secondary">Student</span><span className="font-medium text-aurora-text">{viewExeat.name}</span></div>
                <div className="flex justify-between"><span className="text-aurora-text-secondary">Class</span><span className="text-aurora-text">{viewExeat.class}</span></div>
                <div className="flex justify-between"><span className="text-aurora-text-secondary">Reason</span><span className="text-aurora-text">{viewExeat.reason}</span></div>
                <div className="flex justify-between"><span className="text-aurora-text-secondary">Departed</span><span className="text-aurora-text font-mono tabular-nums">{viewExeat.departed}</span></div>
                <div className="flex justify-between"><span className="text-aurora-text-secondary">Expected Return</span><span className="text-aurora-text font-mono tabular-nums">{viewExeat.expected}</span></div>
                <div className="flex justify-between items-center"><span className="text-aurora-text-secondary">Status</span><StatusBadge status={viewExeat.status} /></div>
              </div>
            </GlassCard>
          </div>
        )}

        <GlassCard noPadding>
          <table className="w-full">
            <thead>
              <tr className="bg-aurora-surface/60 border-b border-aurora-divider">
                {['Student', 'Class', 'Reason', 'Departed', 'Expected Return', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-aurora-text-secondary uppercase tracking-wide px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">Loading exeats...</td></tr>
              )}
              {!loading && exeats.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">No exeat records</td></tr>
              )}
              {exeats.map(e => (
                <tr key={e.id} className="border-b border-aurora-divider hover:bg-aurora-surface/60 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-xs text-aurora-text">{e.name}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{e.class}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{e.reason}</td>
                  <td className="px-4 py-2.5 text-[11px] text-aurora-label-muted font-mono tabular-nums">{e.departed}</td>
                  <td className="px-4 py-2.5 text-[11px] text-aurora-label-muted font-mono tabular-nums">{e.expected}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      <button onClick={() => setViewExeat(e)} className="btn-secondary text-xs px-2 py-0.5">View</button>
                      {e.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleStatus(e.id, 'APPROVED')} className="text-xs text-cat-positive border border-cat-positive/25 px-2 py-0.5 rounded-lg bg-cat-positive-tint hover:bg-cat-positive/10 transition-colors flex items-center gap-1">
                            <ShieldCheck size={12} /> Approve
                          </button>
                          <button onClick={() => handleStatus(e.id, 'DENIED')} className="text-xs text-cat-negative border border-cat-negative/25 px-2 py-0.5 rounded-lg bg-cat-negative-tint hover:bg-cat-negative/10 transition-colors flex items-center gap-1">
                            <ShieldX size={12} /> Deny
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  )
}
