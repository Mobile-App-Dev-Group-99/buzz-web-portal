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

function safeInitials(raw: string | undefined | null): string {
  if (!raw || raw === 'undefined' || raw === 'null') return '?'
  return raw.slice(0, 2).toUpperCase()
}

export default function Avatar({ initials, size = 'md', color = 'bg-[#1D9E75] text-white', className = '' }: AvatarProps) {
  return (
    <div className={`rounded-lg flex items-center justify-center font-bold ${SIZES[size]} ${color} ${className}`}>
      {safeInitials(initials)}
    </div>
  )
}
