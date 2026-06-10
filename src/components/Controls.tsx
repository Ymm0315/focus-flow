import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { useTimerStore } from '../store/timerStore'
import { MODE_CONFIG } from '../types'

export default function Controls() {
  const { status, mode, start, pause, reset, skip } = useTimerStore()
  const accent = MODE_CONFIG[mode].accent
  const isRunning = status === 'running'

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={reset}
        className="w-10 h-10 flex items-center justify-center rounded-full
          bg-black/5 dark:bg-white/8 hover:bg-black/10 dark:hover:bg-white/15
          transition-all duration-200 hover:scale-105 active:scale-95"
        title="重置"
      >
        <RotateCcw size={16} strokeWidth={1.5} className="dark:text-white/50 text-black/40" />
      </button>

      <button
        onClick={isRunning ? pause : start}
        className="w-14 h-14 flex items-center justify-center rounded-2xl text-white
          transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: accent,
          boxShadow: `0 4px 16px ${accent}44`,
        }}
        title={isRunning ? '暂停' : '开始'}
      >
        {isRunning ? (
          <Pause size={22} strokeWidth={1.5} />
        ) : (
          <Play size={22} strokeWidth={1.5} className="ml-0.5" />
        )}
      </button>

      <button
        onClick={skip}
        className="w-10 h-10 flex items-center justify-center rounded-full
          bg-black/5 dark:bg-white/8 hover:bg-black/10 dark:hover:bg-white/15
          transition-all duration-200 hover:scale-105 active:scale-95"
        title="跳过"
      >
        <SkipForward size={16} strokeWidth={1.5} className="dark:text-white/50 text-black/40" />
      </button>
    </div>
  )
}
