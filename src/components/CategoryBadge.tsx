interface CategoryBadgeProps {
  category: 'positive' | 'warning' | 'negative' | 'info'
  label: string
  showPulse?: boolean
}

const DOT_COLOR: Record<string, string> = {
  positive: 'bg-cat-positive',
  warning: 'bg-cat-warning',
  negative: 'bg-cat-negative',
  info: 'bg-cat-info',
}

export default function CategoryBadge({
  category,
  label,
  showPulse = false,
}: CategoryBadgeProps) {
  return (
    <span
      className={`category-badge-${category} inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold`}
    >
      {showPulse && (
        <span className={`relative flex h-2 w-2`}>
          <span
            className={`animate-status-pulse absolute inline-flex h-full w-full rounded-full ${DOT_COLOR[category]} opacity-75`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${DOT_COLOR[category]}`}
          />
        </span>
      )}
      {label}
    </span>
  )
}
