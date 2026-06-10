import { useEffect, useRef } from 'react'
import { useTimerStore } from '../store/timerStore'

export function useTimer() {
  const tick = useTimerStore((s) => s.tick)
  const status = useTimerStore((s) => s.status)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(tick, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [status, tick])
}
