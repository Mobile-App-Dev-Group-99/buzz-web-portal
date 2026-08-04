import type { LucideIcon } from 'lucide-react'
import GlassCard from './GlassCard'
import AnimatedIcon from './AnimatedIcon'

interface StatTileProps {
  label: string
  value: number | string
  icon: LucideIcon
  category?: 'positive' | 'warning' | 'negative' | 'info'
  subtitle?: string
}

export default function StatTile({
  label,
  value,
  icon,
  category = 'positive',
  subtitle,
}: StatTileProps) {
  return (
    <GlassCard category={category}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-aurora-text-secondary font-medium">{label}</p>
          <p className="text-3xl font-bold tabular-nums animate-count-enter text-aurora-text">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-aurora-label-muted">{subtitle}</p>
          )}
        </div>
        <AnimatedIcon icon={icon} category={category} size={28} />
      </div>
    </GlassCard>
  )
}
