import { useState, useEffect } from 'react'
import StatusBadge from '../../components/StatusBadge'
import Avatar from '../../components/Avatar'
import { getAdminStudents, createStudent, updateStudent, deleteStudent } from '../../services/api'

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

  const loadStudents = () => {
    setLoading(true)
    getAdminStudents()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.students || data?.content || []
        setStudents(list.map((s: any) => ({
          id: s.studentCode || s.studentId || s.id,
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

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search by name, ID, class..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs w-64 outline-none focus:border-[#1D9E75] bg-white"
        />
        <button onClick={openAdd} className="ml-auto bg-[#1D9E75] text-white text-xs font-medium px-3 py-1.5 rounded-lg">+ Add Student</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-[#D8D5CC] p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-xs">{editingStudent ? 'Edit Student' : 'Add New Student'}</span>
            <button onClick={() => { setShowForm(false); setEditingStudent(null); setForm(emptyForm) }} className="text-[#5F5E5A] text-xs">Cancel</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">First Name</label>
              <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First name" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:border-[#1D9E75]" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Last Name</label>
              <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:border-[#1D9E75]" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Class</label>
              <input value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} placeholder="e.g. JSS1A" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:border-[#1D9E75]" />
            </div>
            {!editingStudent && (
              <>
                <div>
                  <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Email</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:border-[#1D9E75]" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Password</label>
                  <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:border-[#1D9E75]" />
                </div>
              </>
            )}
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={handleSubmit} disabled={saving} className="bg-[#1D9E75] text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
              {saving ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </div>
      )}

      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-[#D8D5CC] p-5 w-80 shadow-lg">
            <p className="text-xs font-semibold text-[#1a1a18] mb-2">Delete Student</p>
            <p className="text-xs text-[#5F5E5A] mb-4">Are you sure you want to delete this student? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="text-xs text-[#5F5E5A] border border-[#D8D5CC] px-3 py-1.5 rounded-lg hover:bg-[#F7F6F2]">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="text-xs text-white bg-[#791F1F] px-3 py-1.5 rounded-lg hover:bg-[#5C1717]">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#D8D5CC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-[#F7F6F2] border-b border-[#D8D5CC]">
            {['Student', 'ID', 'Class', 'Level', 'Biometric', 'Status', ''].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[#5F5E5A] uppercase tracking-wide px-4 py-2">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">Loading students...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[11px] text-[#5F5E5A]">No students found</td></tr>
            )}
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-[#F7F6F2] hover:bg-[#F7F6F2]">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar initials={(s.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)} size="sm" color="bg-[#E1F5EE] text-[#0F6E56]" />
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
                <td className="px-4 py-2.5">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="text-xs text-[#5F5E5A] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#F7F6F2]">Edit</button>
                    <button onClick={() => setConfirmDelete(s.id)} className="text-xs text-[#791F1F] border border-[#D8D5CC] px-2 py-0.5 rounded bg-white hover:bg-[#FCEBEB]">Delete</button>
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
