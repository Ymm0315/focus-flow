import { useTimerStore } from '../store/timerStore'
import { MODE_CONFIG } from '../types'

export default function StatusBar() {
  const { completedPomodoros, settings, mode } = useTimerStore()
  const accent = MODE_CONFIG[mode].accent
  const totalRounds = settings.longBreakInterval
  const filled = completedPomodoros % totalRounds

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalRounds }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < filled ? accent : 'rgba(0,0,0,0.1)',
              boxShadow: i < filled ? `0 0 6px ${accent}66` : 'none',
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-sm dark:text-white/50 text-black/40">
        <span>🍅</span>
        <span className="font-medium">{completedPomodoros}</span>
      </div>
    </div>
  )
}
