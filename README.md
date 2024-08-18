# Tile38 Viewer

Tile38 Viewer is a utility application for viewing and interacting with data in a [Tile38](https://tile38.com) server.

[![Build/release Electron app](https://github.com/Kilowhisky/tile38-viewer/actions/workflows/release.yml/badge.svg)](https://github.com/Kilowhisky/tile38-viewer/actions/workflows/release.yml)

![Terminal Screenshot](https://github.com/Kilowhisky/tile38-viewer/blob/2ec47007881c43f98a7d8d3882bef0b81c41a23a/resources/screenshot-terminal.png?raw=true "Terminal Screenshot")

## How to Get

Head over to [releases](https://github.com/Kilowhisky/tile38-viewer/releases) to get the latest desktop binary.

### Running on Mac

Due to signing limitations and Mac OS. You need to perform the following in order to open the app.
See [this thread on apple.com for more info about it](https://discussions.apple.com/thread/253714860?sortBy=rank)

```bash
xattr -c <path/to/application.app>
```

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
