import { Settings } from 'lucide-react'
import { useTimerStore } from '../store/timerStore'

export default function TitleBar() {
  const toggleSettings = useTimerStore((s) => s.toggleSettings)

  return (
    <div className="drag-region flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
      <div className="w-12" />
      <span className="text-xs font-medium tracking-wide dark:text-white/60 text-black/40">
        Focus Flow
      </span>
      <button
        onClick={toggleSettings}
        className="w-8 h-8 flex items-center justify-center rounded-lg
          hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
        title="设置"
      >
        <Settings size={15} strokeWidth={1.5} className="dark:text-white/50 text-black/40" />
      </button>
    </div>
  )
}
