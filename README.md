# Messenger Desktop

A lightweight desktop wrapper for Facebook Messenger, built with [Quasar Framework](https://quasar.dev/) and [Electron](https://www.electronjs.org/). Quickly built after Facebook announced killing the [Messenger](http://messenger.com/) web app and their desktop apps. Installing Facebook as a PWA causes it to always open to the home page of Facebook, so I wanted a quick way to get back to my chats directly from the desktop.

This project is provided as is with no warranty or guarantee of continued functionality. Facebook may change their website in ways that break this app at any time but seeing as it's just a simple web wrapper, it likely won't require any updates to keep working.

## Contributing

PRs are welcome but I don't intend to personally add any new features or do any maintenance on this project unless required, but I will likely merge any PRs that add value (and work).

## Prerequisites

- [Node.js](https://nodejs.org/) v24+ (see `.nvmrc` for the recommended version)
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

Build the production Electron app (Windows installer by default):

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
