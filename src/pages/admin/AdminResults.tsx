import { useState } from 'react'
import { FileText } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
import AnimatedIcon from '../../components/AnimatedIcon'

export default function AdminResults() {
  const [termFilter, setTermFilter] = useState('2025/2026 Term 2')
  const [classFilter, setClassFilter] = useState('All Classes')

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 space-y-4">
        <div className="flex gap-2">
          <select value={termFilter} onChange={e => setTermFilter(e.target.value)} className="input-glass px-3 py-1.5 text-xs appearance-none">
            <option>2025/2026 Term 2</option>
          </select>
          <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="input-glass px-3 py-1.5 text-xs appearance-none">
            <option>All Classes</option>
          </select>
        </div>

        <GlassCard noPadding>
          <div className="px-4 py-3 border-b border-aurora-divider">
            <span className="font-semibold text-xs text-aurora-text">Grade Submissions</span>
          </div>
          <div className="px-4 py-16 text-center">
            <div className="flex justify-center mb-3">
              <AnimatedIcon icon={FileText} category="info" size={48} />
            </div>
            <div className="text-sm font-semibold text-aurora-text mb-1">No Results Data</div>
            <div className="text-xs text-aurora-text-secondary max-w-sm mx-auto leading-relaxed">
              Results will appear here once teachers submit grades through the mobile app.
              The results module is pending backend integration.
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
