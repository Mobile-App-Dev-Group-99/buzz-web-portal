import { useState } from 'react'

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
    <div>
      {saved && (
        <div className="bg-[#E1F5EE] text-[#0F6E56] text-xs p-3 rounded-lg mb-4 border border-[#1D9E75]/20 font-medium">
          Settings saved successfully
        </div>
      )}
      <div className="bg-white rounded-lg border border-[#D8D5CC] p-4">
        <div className="font-semibold text-xs mb-4">School Configuration</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">School Name</label>
            <input value={settings.schoolName} onChange={e => update('schoolName', e.target.value)}
              className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1D9E75] bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">School Type</label>
            <input value={settings.schoolType} onChange={e => update('schoolType', e.target.value)}
              className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1D9E75] bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Late Arrival Threshold</label>
            <input type="time" value={settings.lateThreshold} onChange={e => update('lateThreshold', e.target.value)}
              className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1D9E75] bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Absence Alert Time</label>
            <input type="time" value={settings.absenceAlert} onChange={e => update('absenceAlert', e.target.value)}
              className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1D9E75] bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">Academic Alert Below (%)</label>
            <input type="number" min="0" max="100" value={settings.academicThreshold} onChange={e => update('academicThreshold', e.target.value)}
              className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1D9E75] bg-white" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[#5F5E5A] uppercase mb-1 block">SMS Fallback</label>
            <select value={settings.smsFallback} onChange={e => update('smsFallback', e.target.value)}
              className="w-full border border-[#D8D5CC] rounded-lg px-3 py-1.5 text-xs outline-none bg-white">
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div className="col-span-2">
            <button onClick={handleSave} className="bg-[#1D9E75] text-white text-xs font-semibold px-4 py-2 rounded-lg">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}
