import { useState, useEffect } from 'react'
import { Search, Plus, X } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
import { getAdminStudents, createStudent, updateStudent, deleteStudent } from '../../services/api'
import { UserMenu, UserDetailModal, type UserRow } from '../../components/UserMenu'

const emptyForm = { firstName: '', lastName: '', className: '', email: '', password: '' }

export default function AdminStudents() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [detail, setDetail] = useState<UserRow | null>(null)

  const loadStudents = () => {
    setLoading(true)
    getAdminStudents()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.content || data?.students || []
        setStudents(list.map((s: any) => ({
          id: s.id,
          firstName: s.firstName || '',
          lastName: s.lastName || '',
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unknown',
          class: s.className || '—',
          level: s.studentType || s.level || '—',
          biometric: s.biometricEnrolled || s.biometric || false,
          status: s.status || 'Active',
          email: s.email || '',
          className: s.className || '',
        })))
      })
      .catch((err) => console.warn('API error:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadStudents() }, [])

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    String(s.id).includes(search) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditingStudent(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (s: any) => {
    setEditingStudent(s)
    setForm({ firstName: s.firstName, lastName: s.lastName, className: s.className, email: s.email, password: '' })
    setShowForm(true)
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, { firstName: form.firstName, lastName: form.lastName, className: form.className })
      } else {
        await createStudent(form)
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditingStudent(null)
      loadStudents()
    } catch (err) {
      console.warn('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id)
      setConfirmDelete(null)
      loadStudents()
    } catch (err) {
      console.warn('Delete error:', err)
    }
  }

  const openDetail = (s: any) => {
    setDetail({
      id: s.id,
      name: s.name,
      rows: [
        { label: 'Student ID', value: String(s.id) },
        { label: 'Class', value: s.class },
        { label: 'Level', value: s.level },
        { label: 'Email', value: s.email || '—' },
        { label: 'Biometric', value: s.biometric ? 'Enrolled' : 'Not enrolled' },
        { label: 'Status', value: s.status || '—' },
      ],
    })
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-aurora-label-muted" />
            <input
              placeholder="Search by name, ID, class..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-glass pl-9 pr-3 py-1.5 text-xs w-full"
            />
          </div>
          <button onClick={openAdd} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
            <Plus size={14} /> Add Student
          </button>
        </div>

        {showForm && (
          <GlassCard>
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-xs text-aurora-text">{editingStudent ? 'Edit Student' : 'Add New Student'}</span>
              <button onClick={() => { setShowForm(false); setEditingStudent(null); setForm(emptyForm) }} className="text-aurora-text-secondary text-xs hover:text-aurora-text transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">First Name</label>
                <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First name" className="input-glass w-full px-3 py-1.5 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Last Name</label>
                <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" className="input-glass w-full px-3 py-1.5 text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Class</label>
                <input value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} placeholder="e.g. JSS1A" className="input-glass w-full px-3 py-1.5 text-xs" />
              </div>
              {!editingStudent && (
                <>
                  <div>
                    <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Email</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="input-glass w-full px-3 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Password</label>
                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" className="input-glass w-full px-3 py-1.5 text-xs" />
                  </div>
                </>
              )}
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={handleSubmit} disabled={saving} className="btn-primary text-xs font-semibold px-4 py-2 disabled:opacity-50">
                {saving ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </GlassCard>
        )}

        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <GlassCard className="w-80">
              <p className="text-xs font-semibold text-aurora-text mb-2">Delete Student</p>
              <p className="text-xs text-aurora-text-secondary mb-4">Are you sure you want to delete this student? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} className="text-xs text-white bg-cat-negative px-3 py-1.5 rounded-lg hover:bg-cat-negative/90 transition-colors">Delete</button>
              </div>
            </GlassCard>
          </div>
        )}

        <UserDetailModal user={detail} onClose={() => setDetail(null)} />

        <GlassCard noPadding>
          <table className="w-full">
            <thead>
              <tr className="bg-aurora-surface/60 border-b border-aurora-divider">
                {['Student', 'ID', 'Class', 'Level', 'Biometric', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-aurora-text-secondary uppercase tracking-wide px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">Loading students...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">No students found</td></tr>
              )}
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-aurora-divider hover:bg-aurora-surface/60 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar initials={(s.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)} size="sm" />
                      <span className="font-medium text-xs text-aurora-text">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-aurora-label-muted font-mono tabular-nums">{s.id}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{s.class}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{s.level}</td>
                  <td className="px-4 py-2.5">
                    <span className={s.biometric ? 'text-cat-positive text-xs font-medium' : 'text-cat-negative text-xs'}>
                      {s.biometric ? 'Enrolled' : 'Not enrolled'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="btn-secondary text-xs px-2 py-0.5">Edit</button>
                      <UserMenu onView={() => openDetail(s)} onDelete={() => setConfirmDelete(s.id)} />
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
