import { useEffect, useRef, useState } from 'react'
import { MoreVertical, Eye, Trash2, X } from 'lucide-react'
import GlassCard from './GlassCard'
import Avatar from './Avatar'

export interface UserRow {
  id: number
  name: string
  rows: { label: string; value: string }[]
}

// ─── Three-dot overflow menu with dropdown ───
export function UserMenu({ onView, onDelete }: { onView: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
        className="w-7 h-7 flex items-center justify-center rounded-lg text-aurora-text-secondary hover:bg-aurora-surface/60 hover:text-aurora-text transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cat-positive/60"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-8 z-40 w-48 glass-card py-1.5 shadow-lg"
        >
          <button
            role="menuitem"
            onClick={() => { setOpen(false); onView() }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-aurora-text hover:bg-aurora-surface/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cat-positive/60"
          >
            <Eye size={14} className="shrink-0" />
            View More Information
          </button>
          <div className="h-px bg-aurora-divider mx-3 my-1" />
          <button
            role="menuitem"
            onClick={() => { setOpen(false); onDelete() }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-cat-negative hover:bg-cat-negative/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cat-negative/60"
          >
            <Trash2 size={14} className="shrink-0" />
            Delete User
          </button>
        </div>
      )}
    </div>
  )
}

// ─── User detail modal ───
export function UserDetailModal({ user, onClose }: { user: UserRow | null; onClose: () => void }) {
  if (!user) return null
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <GlassCard className="w-full max-w-md max-h-[80vh] overflow-y-auto" >
        <div className="flex items-center gap-3 mb-4">
          <Avatar initials={(user.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-aurora-text truncate">{user.name}</p>
            <p className="text-[11px] text-aurora-text-secondary">Full profile</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-aurora-text-secondary hover:bg-aurora-surface/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cat-positive/60"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-[10px] font-semibold text-aurora-text-secondary uppercase tracking-wide mb-2">Information</p>
        <div className="rounded-xl border border-aurora-divider overflow-hidden">
          {user.rows.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 ${i < user.rows.length - 1 ? 'border-b border-aurora-divider' : ''}`}
            >
              <span className="text-[11px] text-aurora-text-secondary">{r.label}</span>
              <span className="text-[12px] font-medium text-aurora-text text-right break-words">{r.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}