import { useTimerStore } from '../store/timerStore'
import { MODE_CONFIG } from '../types'
import type { TimerMode } from '../types'

const MODES: { key: TimerMode; label: string }[] = [
  { key: 'work', label: '专注' },
  { key: 'shortBreak', label: '短休息' },
  { key: 'longBreak', label: '长休息' },
]

export default function ModeTabs() {
  const mode = useTimerStore((s) => s.mode)
  const setMode = useTimerStore((s) => s.setMode)
  const accent = MODE_CONFIG[mode].accent

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl
        bg-black/5 dark:bg-white/8"
    >
      {MODES.map((m) => {
        const active = mode === m.key
        return (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className="px-4 py-1.5 rounded-lg text-[13px] font-medium
              transition-all duration-200"
            style={{
              backgroundColor: active ? accent : 'transparent',
              color: active ? '#fff' : undefined,
              boxShadow: active ? `0 2px 8px ${accent}44` : 'none',
            }}
          >
            <span className={active ? '' : 'dark:text-white/50 text-black/40'}>
              {m.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
