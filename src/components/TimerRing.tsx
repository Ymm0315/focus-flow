import { useTimerStore } from '../store/timerStore'
import { MODE_CONFIG } from '../types'

const RADIUS = 100
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function TimerRing() {
  const { remainingSeconds, totalSeconds, mode } = useTimerStore()
  const config = MODE_CONFIG[mode]

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const progress = totalSeconds === 0 ? 0 : (totalSeconds - remainingSeconds) / totalSeconds
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="relative w-[240px] h-[240px] flex items-center justify-center">
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 240 240"
        width="240"
        height="240"
      >
        <circle
          cx="120"
          cy="120"
          r={RADIUS}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="12"
          strokeLinecap="round"
          className="dark:stroke-white/10"
        />
        <circle
          cx="120"
          cy="120"
          r={RADIUS}
          fill="none"
          stroke={config.accent}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="ring-progress"
          style={{ filter: `drop-shadow(0 0 8px ${config.accent}66)` }}
        />
      </svg>
      <div className="relative flex flex-col items-center gap-1">
        <span
          className="text-[52px] font-light tracking-tight leading-none font-mono tabular-nums
            dark:text-white text-black/85"
        >
          {timeStr}
        </span>
        <span className="text-[11px] font-medium tracking-widest uppercase dark:text-white/40 text-black/35">
          {config.label}
        </span>
      </div>
    </div>
  )
}
