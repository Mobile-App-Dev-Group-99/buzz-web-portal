import type { LucideIcon } from 'lucide-react'

interface AnimatedIconProps {
  icon: LucideIcon
  category?: 'positive' | 'warning' | 'negative' | 'info'
  size?: number
  className?: string
}

const GLOW_COLOR: Record<string, string> = {
  positive: 'text-cat-positive',
  warning: 'text-cat-warning',
  negative: 'text-cat-negative',
  info: 'text-cat-info',
}

const STAGGER: Record<number, string> = {
  1: 'animate-float-delay-1',
  2: 'animate-float-delay-2',
  3: 'animate-float-delay-3',
  4: 'animate-float-delay-4',
}

let counter = 0

export default function AnimatedIcon({
  icon: Icon,
  category = 'positive',
  size = 24,
  className = '',
}: AnimatedIconProps) {
  counter = (counter % 4) + 1
  const color = GLOW_COLOR[category] || GLOW_COLOR.positive
  const stagger = STAGGER[counter]

  return (
    <span
      className={`animate-float ${stagger} tap-reaction inline-flex items-center justify-center ${className}`}
    >
      <span className={`animate-glow ${color}`}>
        <Icon size={size} strokeWidth={1.8} />
      </span>
    </span>
  )
}
