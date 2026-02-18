import { app, BrowserWindow, shell, session } from 'electron'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))

// QUASAR_PUBLIC_FOLDER is replaced at compile time by esbuild — points to public/ in dev, '.' in prod
const iconFile =
  platform === 'win32' ? 'icon.ico' : platform === 'darwin' ? 'icon.icns' : 'icon.png'
const iconPath = path.resolve(currentDir, 'icons', iconFile)
const appIcon = existsSync(iconPath)
  ? iconPath
  : path.resolve(process.env.QUASAR_PUBLIC_FOLDER, '../src-electron/icons', iconFile)

const MESSENGER_URL = 'https://www.facebook.com/messages/'

// Declare itself as a Chrome browser so Facebook doesn't block the embedded browser.
const CHROME_USER_AGENT =
  platform === 'darwin'
    ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'
    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'

const stateFile = path.join(app.getPath('userData'), 'window-state.json')

const DEFAULT_STATE = { width: 1200, height: 800 }

function loadWindowState() {
  try {
    if (!existsSync(stateFile)) return DEFAULT_STATE
    const state = JSON.parse(readFileSync(stateFile, 'utf-8'))
    if (
      typeof state !== 'object' ||
      state === null ||
      !Number.isFinite(state.width) ||
      !Number.isFinite(state.height)
    ) {
      return DEFAULT_STATE
    }
    return state
  } catch {
    return DEFAULT_STATE
  }
}

function saveWindowState(win) {
  try {
    const bounds = win.getBounds()
    writeFileSync(
      stateFile,
      JSON.stringify({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        maximized: win.isMaximized(),
      }),
    )
  } catch (e) {
    console.error('Failed to save window state:', e)
  }
}
function isTrustedURL(url) {
  try {
    const { hostname, protocol } = new URL(url)
    return (
      protocol === 'https:' &&
      (hostname === 'facebook.com' ||
        hostname.endsWith('.facebook.com') ||
        hostname === 'messenger.com' ||
        hostname.endsWith('.messenger.com'))
    )
  } catch {
    return false
  }
}

let mainWindow

async function createWindow() {
  const state = loadWindowState()

  mainWindow = new BrowserWindow({
    icon: appIcon,
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    title: 'Messenger Desktop',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
        ),
      ),
    },
  })

  if (state.maximized) {
    mainWindow.maximize()
  }

  // Save window state on move, resize, and close
  mainWindow.on('close', () => saveWindowState(mainWindow))

  // Override user agent on all requests from this window
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = CHROME_USER_AGENT
    callback({ requestHeaders: details.requestHeaders })
  })

  // Explicitly control permission requests (camera, mic, notifications, etc.)
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowed = ['media', 'notifications', 'clipboard-read']
    callback(allowed.includes(permission))
  })

  // Open non-Facebook links in the system browser (https only)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isTrustedURL(url)) {
      return { action: 'allow' }
    }
    if (url.startsWith('https://')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isTrustedURL(url)) {
      event.preventDefault()
      if (url.startsWith('https://')) {
        shell.openExternal(url)
      }
    }
  })

  // Keep window title as "Messenger Desktop"
  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
  })

  // Disable DevTools in production
  if (!process.env.DEBUGGING) {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  await mainWindow.loadURL(MESSENGER_URL, {
    userAgent: CHROME_USER_AGENT,
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
