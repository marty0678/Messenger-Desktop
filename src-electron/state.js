import { app } from 'electron'
import path from 'node:path'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

export const ZOOM_STEP = 0.5

const stateFile = path.join(app.getPath('userData'), 'window-state.json')

const DEFAULT_STATE = { width: 1200, height: 800, zoomLevel: 0 }

export function loadWindowState() {
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
    if (!Number.isFinite(state.zoomLevel)) {
      state.zoomLevel = 0
    }
    return state
  } catch {
    return DEFAULT_STATE
  }
}

let normalBounds = null

export function trackNormalBounds(win) {
  normalBounds = win.getBounds()
  const update = () => {
    if (!win.isMaximized()) {
      normalBounds = win.getBounds()
    }
  }
  win.on('resize', update)
  win.on('move', update)
}

export function saveWindowState(win) {
  try {
    const bounds = win.isMaximized() && normalBounds ? normalBounds : win.getBounds()
    writeFileSync(
      stateFile,
      JSON.stringify({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        maximized: win.isMaximized(),
        zoomLevel: win.webContents.getZoomLevel(),
      }),
    )
  } catch (e) {
    console.error('Failed to save window state:', e)
  }
}
