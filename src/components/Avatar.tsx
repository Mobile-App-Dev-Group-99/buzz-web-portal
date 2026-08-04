interface AvatarProps {
  initials: string | undefined | null
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

const SIZES = {
  sm: 'w-6 h-6 text-[9px]',
  md: 'w-8 h-8 text-[10px]',
  lg: 'w-10 h-10 text-xs',
}

const AURORA_COLORS = [
  'bg-cat-positive text-white',
  'bg-cat-info text-white',
  'bg-cat-warning text-white',
  'bg-aurora-text text-white',
]

function safeInitials(raw: string | undefined | null): string {
  if (!raw || raw === 'undefined' || raw === 'null') return '?'
  return raw.slice(0, 2).toUpperCase()
}

function hashColor(raw: string): string {
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    hash = raw.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AURORA_COLORS[Math.abs(hash) % AURORA_COLORS.length]
}

export default function Avatar({
  initials,
  size = 'md',
  color,
  className = '',
}: AvatarProps) {
  const resolved = safeInitials(initials)
  const bg = color || hashColor(resolved)

  return (
    <div
      className={`rounded-lg flex items-center justify-center font-bold ${SIZES[size]} ${bg} ${className}`}
    >
      {resolved}
    </div>
  )
}
