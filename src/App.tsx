import { useEffect } from 'react'
import { useTimerStore } from './store/timerStore'
import { useTimer } from './hooks/useTimer'
import TitleBar from './components/TitleBar'
import ModeTabs from './components/ModeTabs'
import TimerRing from './components/TimerRing'
import Controls from './components/Controls'
import StatusBar from './components/StatusBar'
import Settings from './components/Settings'

export default function App() {
  const loadSettings = useTimerStore((s) => s.loadSettings)
  const showSettings = useTimerStore((s) => s.showSettings)

  useTimer()

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <div className="h-full flex flex-col bg-transparent select-none">
      <TitleBar />
      <main className="flex-1 flex flex-col items-center justify-center gap-2 px-6 pb-6">
        <ModeTabs />
        <TimerRing />
        <div className="h-4" />
        <Controls />
        <div className="h-4" />
        <StatusBar />
      </main>
      {showSettings && <Settings />}
    </div>
  )
}
