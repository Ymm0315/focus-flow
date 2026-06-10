import { X } from 'lucide-react'
import { useTimerStore } from '../store/timerStore'
import { MODE_CONFIG } from '../types'

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '分钟',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] dark:text-white/60 text-black/50">{label}</span>
        <span className="text-[13px] font-medium tabular-nums dark:text-white/80 text-black/70">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
    </div>
  )
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] dark:text-white/60 text-black/50">{label}</span>
      <button
        onClick={onChange}
        className="relative w-[40px] h-[22px] rounded-full transition-colors duration-200"
        style={{
          backgroundColor: checked ? MODE_CONFIG.work.accent : 'rgba(0,0,0,0.12)',
        }}
      >
        <div
          className="absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm
            transition-transform duration-200"
          style={{ left: checked ? '20px' : '2px' }}
        />
      </button>
    </div>
  )
}

export default function SettingsPanel() {
  const settings = useTimerStore((s) => s.settings)
  const updateSettings = useTimerStore((s) => s.updateSettings)
  const handleClose = useTimerStore((s) => s.saveSettings)
  const toggleSettings = useTimerStore((s) => s.toggleSettings)

  const close = () => {
    handleClose()
    toggleSettings()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center settings-overlay"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
      onClick={close}
    >
      <div
        className="w-[320px] rounded-2xl p-5 settings-panel"
        style={{
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-[15px] font-semibold dark:text-white text-black/80">设置</span>
          <button
            onClick={close}
            className="w-6 h-6 flex items-center justify-center rounded-md
              hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X size={14} strokeWidth={1.5} className="dark:text-white/50 text-black/40" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <SliderRow
            label="专注时长"
            value={settings.workDuration}
            min={1}
            max={60}
            onChange={(v) => updateSettings({ workDuration: v })}
          />
          <SliderRow
            label="短休息"
            value={settings.shortBreakDuration}
            min={1}
            max={30}
            onChange={(v) => updateSettings({ shortBreakDuration: v })}
          />
          <SliderRow
            label="长休息"
            value={settings.longBreakDuration}
            min={1}
            max={30}
            onChange={(v) => updateSettings({ longBreakDuration: v })}
          />
          <SliderRow
            label="长休息间隔"
            value={settings.longBreakInterval}
            min={2}
            max={10}
            unit="个番茄"
            onChange={(v) => updateSettings({ longBreakInterval: v })}
          />

          <ToggleSwitch
            label="提示音"
            checked={settings.soundEnabled}
            onChange={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          />
          <ToggleSwitch
            label="窗口置顶"
            checked={settings.alwaysOnTop}
            onChange={() => {
              updateSettings({ alwaysOnTop: !settings.alwaysOnTop })
              window.api?.window.setAlwaysOnTop(!settings.alwaysOnTop)
            }}
          />
        </div>
      </div>
    </div>
  )
}
