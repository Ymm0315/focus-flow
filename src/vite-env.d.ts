/// <reference types="vite/client" />

interface Window {
  api: {
    settings: {
      get: () => Promise<Record<string, unknown>>
      set: (settings: Record<string, unknown>) => Promise<void>
    }
    notification: {
      send: (title: string, body: string) => Promise<void>
    }
    window: {
      setAlwaysOnTop: (flag: boolean) => Promise<void>
      show: () => Promise<void>
    }
  }
}
