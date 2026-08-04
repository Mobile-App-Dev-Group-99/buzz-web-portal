import { useState } from 'react'
import { Check } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import AuroraBackground from '../../components/AuroraBackground'
import AnimatedIcon from '../../components/AnimatedIcon'

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    schoolName: 'Prempeh Academy',
    schoolType: 'JHS & SHS (Boarding)',
    lateThreshold: '07:30',
    absenceAlert: '09:00',
    academicThreshold: '50',
    smsFallback: 'enabled',
  })

  function handleSave() {
    localStorage.setItem('buzz_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function update(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 space-y-4">
        {saved && (
          <div className="bg-cat-positive-tint text-cat-positive text-xs p-3 rounded-lg border border-cat-positive/25 font-medium flex items-center gap-2">
            <Check size={14} />
            Settings saved successfully
          </div>
        )}

        <GlassCard>
          <div className="font-semibold text-xs mb-4 text-aurora-text">School Configuration</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">School Name</label>
              <input value={settings.schoolName} onChange={e => update('schoolName', e.target.value)}
                className="input-glass w-full px-3 py-1.5 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">School Type</label>
              <input value={settings.schoolType} onChange={e => update('schoolType', e.target.value)}
                className="input-glass w-full px-3 py-1.5 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Late Arrival Threshold</label>
              <input type="time" value={settings.lateThreshold} onChange={e => update('lateThreshold', e.target.value)}
                className="input-glass w-full px-3 py-1.5 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Absence Alert Time</label>
              <input type="time" value={settings.absenceAlert} onChange={e => update('absenceAlert', e.target.value)}
                className="input-glass w-full px-3 py-1.5 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">Academic Alert Below (%)</label>
              <input type="number" min="0" max="100" value={settings.academicThreshold} onChange={e => update('academicThreshold', e.target.value)}
                className="input-glass w-full px-3 py-1.5 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-aurora-text-secondary uppercase mb-1 block">SMS Fallback</label>
              <select value={settings.smsFallback} onChange={e => update('smsFallback', e.target.value)}
                className="input-glass w-full px-3 py-1.5 text-xs">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="col-span-2">
              <button onClick={handleSave} className="btn-primary text-xs font-semibold px-4 py-2">Save Settings</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
