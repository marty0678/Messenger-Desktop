# Messenger Desktop

A "lightweight" desktop wrapper for Facebook Messenger, built with [Quasar Framework](https://quasar.dev/) and [Electron](https://www.electronjs.org/). Quickly built after Facebook announced killing the [Messenger](http://messenger.com/) web app and their desktop apps. Installing Facebook as a PWA causes it to always open to the home page of Facebook, so I wanted a quick way to get back to my chats directly from the desktop.

This project is provided as is with no warranty or guarantee of continued functionality. Facebook may change their website in ways that break this app at any time but seeing as it's just a simple web wrapper, it likely won't require any updates to keep working.

## Installing

Note that the provided release copies are built for Windows (x64) and macOS (M series) and are self signed as I made this app for myself, but sharing is caring and all that.

Being self signed, it will cause warnings during installation on both platforms and you'll need allow the application to bypass the warnings if you trust it. If there are concerns, please feel free to build the app from source using the instructions below and/or audit the code (or just go to the Facebook Messenger website directly in your browser, which is what this app does).

Release copies are available on the [releases page](https://github.com/marty0678/Messenger-Desktop/releases).

### Windows

1. Download `messenger_desktop_setup_windows.exe` from the release page
2. Run the installer and wait for installation to complete

### macOS

1. Download `messenger_desktop_mac.zip` from the release page
2. Unzip the archive
3. Drag `Messenger Desktop.app` to your Applications folder

### Linux

1. Download messenger_desktop_linux.AppImage from the release page
2. Right-click and go to Properties > Permissions and enable "Allow executing file as program

## Contributing

PRs are welcome but I don't intend to personally add any new features or do any maintenance on this project unless required, but I will likely merge any PRs that add value (and function).

## Prerequisites

- [Node.js](https://nodejs.org/) v24+
- [pnpm](https://pnpm.io/) v10+

## Install

```bash
pnpm install
```

## Development

Run the app in Electron development mode with hot-reload:

```bash
pnpm dev
# or
quasar dev -m electron
```

## Build

Build the production Electron app (will build based on your current platform):

```bash
pnpm build
# or
quasar build -m electron
```

The output installer will be in `dist/electron/`.

## Lint & Format

```bash
pnpm lint
pnpm format
```

## Legal

Facebook, Messenger, and the Messenger logo are trademarks of Meta Platforms, Inc. This project is not affiliated with, endorsed by, or sponsored by Meta. All trademarks, logos, and brand assets belong to their respective owners and are used here solely for identification purposes.
