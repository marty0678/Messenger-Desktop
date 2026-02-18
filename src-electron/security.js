import { shell, session } from 'electron'
import { CHROME_USER_AGENT } from './config.js'

export function isTrustedURL(url) {
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

export function setupSecurity(mainWindow) {
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
      shell.openExternal(url).catch((err) => {
        console.error(`Failed to open external URL (new-window): ${url}`, err)
      })
    }
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isTrustedURL(url)) {
      event.preventDefault()
      if (url.startsWith('https://')) {
        shell.openExternal(url).catch((err) => {
          console.error(`Failed to open external URL (will-navigate): ${url}`, err)
        })
      }
    }
  })
}
