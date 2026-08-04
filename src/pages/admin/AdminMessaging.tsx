import { Plus, Mail } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
import AnimatedIcon from '../../components/AnimatedIcon'

export default function AdminMessaging() {
  const handleNewAnnouncement = () => {
    alert('New announcements will be available once the messaging module is integrated.')
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 space-y-4">
        <button onClick={handleNewAnnouncement} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Plus size={14} /> New Announcement
        </button>

        <GlassCard noPadding>
          <div className="px-4 py-2 border-b border-aurora-divider">
            <div className="flex items-center gap-2">
              <AnimatedIcon icon={Mail} category="info" size={14} />
              <span className="font-semibold text-xs text-aurora-text">Inbox</span>
            </div>
          </div>
          <div className="px-4 py-16 text-center">
            <div className="flex justify-center mb-3">
              <AnimatedIcon icon={Mail} category="info" size={48} />
            </div>
            <div className="text-sm font-semibold text-aurora-text mb-1">No Messages</div>
            <div className="text-xs text-aurora-text-secondary max-w-sm mx-auto leading-relaxed">
              Parent-teacher messaging will be available here once the messaging module is integrated.
              Announcements can be sent to all parents from this panel.
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
