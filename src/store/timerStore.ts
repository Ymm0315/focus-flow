import { create } from 'zustand'
import type { TimerMode, TimerStatus, TimerSettings } from '../types'
import { DEFAULT_SETTINGS, getDurationForMode } from '../types'

interface TimerState {
  mode: TimerMode
  status: TimerStatus
  totalSeconds: number
  remainingSeconds: number
  completedPomodoros: number
  settings: TimerSettings
  showSettings: boolean

  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
  skip: () => void
  setMode: (mode: TimerMode) => void
  toggleSettings: () => void
  updateSettings: (partial: Partial<TimerSettings>) => void
  loadSettings: () => Promise<void>
  saveSettings: () => void
}

function notifyPhaseComplete(mode: TimerMode, completedPomodoros: number) {
  const title = mode === 'work' ? '专注完成！' : '休息结束！'
  const body =
    mode === 'work'
      ? `已完成 ${completedPomodoros} 个番茄，休息一下吧`
      : '休息够了，继续加油！'
  window.api?.notification.send(title, body)
}

function playSound() {
  try {
    const ctx = new AudioContext()
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.35)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.35)
    })
    setTimeout(() => ctx.close(), 1000)
  } catch {
    // audio not available
  }
}

export const useTimerStore = create<TimerState>((set, get) => {
  function handlePhaseComplete() {
    const { mode, completedPomodoros, settings } = get()
    const newCount = mode === 'work' ? completedPomodoros + 1 : completedPomodoros

    if (settings.soundEnabled) playSound()
    notifyPhaseComplete(mode, newCount)

    const nextMode: TimerMode =
      mode === 'work'
        ? (newCount % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak')
        : 'work'

    const total = getDurationForMode(nextMode, settings)
    set({
      completedPomodoros: newCount,
      mode: nextMode,
      totalSeconds: total,
      remainingSeconds: total,
      status: 'running',
    })
  }

  return {
    mode: 'work',
    status: 'idle',
    totalSeconds: DEFAULT_SETTINGS.workDuration * 60,
    remainingSeconds: DEFAULT_SETTINGS.workDuration * 60,
    completedPomodoros: 0,
    settings: { ...DEFAULT_SETTINGS },
    showSettings: false,

    start: () => set({ status: 'running' }),
    pause: () => set({ status: 'paused' }),
    reset: () => {
      const { mode, settings } = get()
      const total = getDurationForMode(mode, settings)
      set({ totalSeconds: total, remainingSeconds: total, status: 'idle' })
    },

    tick: () => {
      const { remainingSeconds, status } = get()
      if (status !== 'running') return
      if (remainingSeconds <= 1) {
        handlePhaseComplete()
        return
      }
      set({ remainingSeconds: remainingSeconds - 1 })
    },

    skip: () => {
      handlePhaseComplete()
    },

    setMode: (mode) => {
      const { settings } = get()
      const total = getDurationForMode(mode, settings)
      set({ mode, totalSeconds: total, remainingSeconds: total, status: 'idle' })
    },

    toggleSettings: () => set((s) => ({ showSettings: !s.showSettings })),

    updateSettings: (partial) => {
      const { settings, mode } = get()
      const next = { ...settings, ...partial }
      set({ settings: next })
      if (get().status === 'idle') {
        const total = getDurationForMode(mode, next)
        set({ totalSeconds: total, remainingSeconds: total })
      }
    },

    loadSettings: async () => {
      if (!window.api) return
      try {
        const saved = await window.api.settings.get()
        const settings = { ...DEFAULT_SETTINGS, ...saved } as TimerSettings
        const total = getDurationForMode('work', settings)
        set({
          settings,
          mode: 'work',
          totalSeconds: total,
          remainingSeconds: total,
          status: 'idle',
        })
        if (settings.alwaysOnTop) {
          window.api.window.setAlwaysOnTop(true)
        }
      } catch {
        // use defaults
      }
    },

    saveSettings: () => {
      if (!window.api) return
      const { settings } = get()
      window.api.settings.set(settings as unknown as Record<string, unknown>)
      window.api.window.setAlwaysOnTop(settings.alwaysOnTop)
    },
  }
})
