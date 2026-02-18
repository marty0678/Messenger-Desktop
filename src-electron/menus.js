import { Menu, MenuItem } from 'electron'
import { platform } from './config.js'
import { ZOOM_STEP } from './state.js'

export function setupMenus(mainWindow) {
  // Application menu (hidden on Windows/Linux) with standard menus + custom zoom/navigation
  const menuTemplate = [
    ...(platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const level = mainWindow.webContents.getZoomLevel()
            mainWindow.webContents.setZoomLevel(Math.min(5, level + ZOOM_STEP))
          },
        },
        {
          label: 'Zoom In (Numpad)',
          accelerator: 'CmdOrCtrl+numadd',
          visible: false,
          click: () => {
            const level = mainWindow.webContents.getZoomLevel()
            mainWindow.webContents.setZoomLevel(Math.min(5, level + ZOOM_STEP))
          },
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const level = mainWindow.webContents.getZoomLevel()
            mainWindow.webContents.setZoomLevel(Math.max(-5, level - ZOOM_STEP))
          },
        },
        {
          label: 'Zoom Out (Numpad)',
          accelerator: 'CmdOrCtrl+numsub',
          visible: false,
          click: () => {
            const level = mainWindow.webContents.getZoomLevel()
            mainWindow.webContents.setZoomLevel(Math.max(-5, level - ZOOM_STEP))
          },
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            mainWindow.webContents.setZoomLevel(0)
          },
        },
        {
          label: 'Reset Zoom (Numpad)',
          accelerator: 'CmdOrCtrl+num0',
          visible: false,
          click: () => {
            mainWindow.webContents.setZoomLevel(0)
          },
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        ...(process.env.DEBUGGING ? [{ role: 'toggleDevTools' }] : []),
      ],
    },
    {
      label: 'Navigation',
      submenu: [
        {
          label: 'Back',
          accelerator: 'Alt+Left',
          click: () => {
            if (mainWindow.webContents.canGoBack()) {
              mainWindow.webContents.goBack()
            }
          },
        },
        {
          label: 'Forward',
          accelerator: 'Alt+Right',
          click: () => {
            if (mainWindow.webContents.canGoForward()) {
              mainWindow.webContents.goForward()
            }
          },
        },
      ],
    },
    { role: 'windowMenu' },
  ]
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  // Right-click context menu with spell check suggestions
  mainWindow.webContents.on('context-menu', (_event, params) => {
    const contextMenu = new Menu()

    if (params.misspelledWord) {
      if (params.dictionarySuggestions.length > 0) {
        for (const suggestion of params.dictionarySuggestions) {
          contextMenu.append(
            new MenuItem({
              label: suggestion,
              click: () => mainWindow.webContents.replaceMisspelling(suggestion),
            }),
          )
        }
      } else {
        contextMenu.append(new MenuItem({ label: 'No suggestions', enabled: false }))
      }
      contextMenu.append(new MenuItem({ type: 'separator' }))
    }

    contextMenu.append(
      new MenuItem({ label: 'Cut', role: 'cut', enabled: params.editFlags.canCut }),
    )
    contextMenu.append(
      new MenuItem({ label: 'Copy', role: 'copy', enabled: params.editFlags.canCopy }),
    )
    contextMenu.append(
      new MenuItem({ label: 'Paste', role: 'paste', enabled: params.editFlags.canPaste }),
    )
    contextMenu.append(new MenuItem({ type: 'separator' }))
    contextMenu.append(
      new MenuItem({
        label: 'Select All',
        role: 'selectAll',
        enabled: params.editFlags.canSelectAll,
      }),
    )

    contextMenu.popup()
  })

  // Mouse back/forward buttons (Windows/Linux)
  mainWindow.on('app-command', (_event, command) => {
    if (command === 'browser-backward') {
      if (mainWindow.webContents.canGoBack()) {
        mainWindow.webContents.goBack()
      }
    } else if (command === 'browser-forward') {
      if (mainWindow.webContents.canGoForward()) {
        mainWindow.webContents.goForward()
      }
    }
  })
}
