import { app, BrowserWindow, session } from 'electron'
import path from 'node:path'
import { platform, currentDir, appIcon, MESSENGER_URL, CHROME_USER_AGENT } from './config.js'
import { loadWindowState, saveWindowState, trackNormalBounds } from './state.js'
import { setupSecurity } from './security.js'
import { setupMenus } from './menus.js'

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
      spellcheck: true,
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
        ),
      ),
    },
  })

  trackNormalBounds(mainWindow)

  if (state.maximized) {
    mainWindow.maximize()
  }

  session.defaultSession.setSpellCheckerLanguages(['en-US'])
  mainWindow.webContents.setZoomLevel(state.zoomLevel)

  mainWindow.on('close', () => saveWindowState(mainWindow))

  // Keep window title as "Messenger Desktop"
  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
  })

  setupSecurity(mainWindow)
  setupMenus(mainWindow)

  await mainWindow.loadURL(MESSENGER_URL, {
    userAgent: CHROME_USER_AGENT,
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app
  .whenReady()
  .then(createWindow)
  .catch((err) => console.error('Failed to create window:', err))

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow().catch((err) => console.error('Failed to create window:', err))
  }
})
