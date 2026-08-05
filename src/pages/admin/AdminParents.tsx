import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import Avatar from '../../components/Avatar'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
import { getAdminParents, deleteParent } from '../../services/api'
import { UserMenu, UserDetailModal, type UserRow } from '../../components/UserMenu'

export default function AdminParents() {
  const [parents, setParents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [detail, setDetail] = useState<UserRow | null>(null)

  const loadParents = () => {
    setLoading(true)
    getAdminParents()
      .then(data => {
        const list = Array.isArray(data) ? data : data?.parents || data?.content || []
        setParents(list.map((p: any) => ({
          id: p.id,
          name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || `Parent ${p.id}`,
          phone: p.phone || '—',
        })))
      })
      .catch((err) => console.warn('API error:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadParents() }, [])

  const filtered = parents.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.toLowerCase().includes(search.toLowerCase()) ||
    String(p.id).includes(search)
  )

  const handleDelete = async (id: number) => {
    try {
      await deleteParent(id)
      setConfirmDelete(null)
      loadParents()
    } catch (err) {
      console.warn('Delete error:', err)
    }
  }

  const openDetail = (p: any) => {
    setDetail({
      id: p.id,
      name: p.name,
      rows: [
        { label: 'Parent ID', value: String(p.id) },
        { label: 'Phone', value: p.phone || '—' },
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
              placeholder="Search parents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-glass pl-9 pr-3 py-1.5 text-xs w-full"
            />
          </div>
        </div>

        {confirmDelete !== null && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <GlassCard className="w-80">
              <p className="text-xs font-semibold text-aurora-text mb-2">Delete Parent</p>
              <p className="text-xs text-aurora-text-secondary mb-4">Are you sure you want to delete this parent? This action cannot be undone.</p>
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
                {['Parent', 'ID', 'Phone', ''].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-aurora-text-secondary uppercase tracking-wide px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">Loading parents...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-[11px] text-aurora-text-secondary">No parents found</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-aurora-divider hover:bg-aurora-surface/60 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar initials={(p.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)} size="sm" />
                      <span className="font-medium text-xs text-aurora-text">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-aurora-label-muted font-mono tabular-nums">{p.id}</td>
                  <td className="px-4 py-2.5 text-xs text-aurora-text-secondary">{p.phone}</td>
                  <td className="px-4 py-2.5">
                    <UserMenu onView={() => openDetail(p)} onDelete={() => setConfirmDelete(p.id)} />
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