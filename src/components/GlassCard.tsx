import { type ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  category?: 'positive' | 'warning' | 'negative' | 'info'
  onClick?: () => void
  noPadding?: boolean
}

export default function GlassCard({
  children,
  className = '',
  category,
  onClick,
  noPadding = false,
}: GlassCardProps) {
  const glow = category ? `stat-glow-${category}` : ''
  const pad = noPadding ? '' : 'p-5'
  const interactive = onClick ? 'glass-card-press cursor-pointer' : ''

  return (
    <div
      className={`glass-card ${glow} ${pad} ${interactive} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
