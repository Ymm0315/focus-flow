export type TimerMode = 'work' | 'shortBreak' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused'

export interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  soundEnabled: boolean
  alwaysOnTop: boolean
}

export const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  soundEnabled: true,
  alwaysOnTop: false,
}

export const MODE_CONFIG: Record<TimerMode, { label: string; accent: string }> = {
  work: { label: '专注中', accent: '#FF6B6B' },
  shortBreak: { label: '短休息', accent: '#34C759' },
  longBreak: { label: '长休息', accent: '#007AFF' },
}

export function getDurationForMode(mode: TimerMode, settings: TimerSettings): number {
  switch (mode) {
    case 'work': return settings.workDuration * 60
    case 'shortBreak': return settings.shortBreakDuration * 60
    case 'longBreak': return settings.longBreakDuration * 60
  }
}
