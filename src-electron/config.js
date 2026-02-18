import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

// needed in case process is undefined under Linux
export const platform = process.platform || os.platform()

export const currentDir = fileURLToPath(new URL('.', import.meta.url))

// QUASAR_PUBLIC_FOLDER is replaced at compile time by esbuild — points to public/ in dev, '.' in prod
const iconFile =
  platform === 'win32' ? 'icon.ico' : platform === 'darwin' ? 'icon.icns' : 'icon.png'
const iconPath = path.resolve(currentDir, 'icons', iconFile)
export const appIcon = existsSync(iconPath)
  ? iconPath
  : path.resolve(process.env.QUASAR_PUBLIC_FOLDER, '../src-electron/icons', iconFile)

export const MESSENGER_URL = 'https://www.facebook.com/messages/'

// Declare itself as a Chrome browser so Facebook doesn't block the embedded browser.
export const CHROME_USER_AGENT =
  platform === 'darwin'
    ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'
    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'
