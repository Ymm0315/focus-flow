import { app, BrowserWindow, ipcMain, Notification, Tray, Menu, nativeImage, shell } from 'electron'
import path from 'path'
import Store from 'electron-store'

const store = new Store({
  defaults: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    soundEnabled: true,
    alwaysOnTop: false,
  },
})

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function createTrayIcon() {
  const size = 22
  const scale = 2
  const px = size * scale
  const buf = Buffer.alloc(px * px * 4, 0)
  for (let y = 0; y < px; y++) {
    for (let x = 0; x < px; x++) {
      const dx = x - px / 2 + 0.5
      const dy = y - px / 2 + 0.5
      const dist = Math.sqrt(dx * dx + dy * dy)
      const i = (y * px + x) * 4
      if (dist < px / 2 - 2) {
        buf[i] = 255
        buf[i + 1] = 107
        buf[i + 2] = 107
        buf[i + 3] = 255
      }
    }
  }
  return nativeImage.createFromBuffer(buf, { width: px, height: px, scaleFactor: scale })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 520,
    minWidth: 360,
    minHeight: 420,
    frame: false,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    transparent: true,
    backgroundColor: '#00000000',
    resizable: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow?.hide()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

function createTray() {
  tray = new Tray(createTrayIcon())
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示 Focus Flow',
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.exit()
      },
    },
  ])
  tray.setToolTip('Focus Flow')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })
}

app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else {
      mainWindow?.show()
    }
  })
})

app.on('window-all-closed', () => {
  // keep running in tray on macOS
})

// IPC handlers
ipcMain.handle('settings:get', () => {
  return store.store
})

ipcMain.handle('settings:set', (_, settings: Record<string, unknown>) => {
  store.store = settings
})

ipcMain.handle('notification:send', (_, { title, body }: { title: string; body: string }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show()
  }
})

ipcMain.handle('window:setAlwaysOnTop', (_, flag: boolean) => {
  mainWindow?.setAlwaysOnTop(flag)
})

ipcMain.handle('window:show', () => {
  mainWindow?.show()
  mainWindow?.focus()
})
