import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import path from 'path'
import { readFileSync } from 'fs'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    fullscreen: true,
    frame: false,
    center: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: false,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setFullScreen(true)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('get-my-config', async () => {
  try {
    const jsonPath = is.dev
      ? join(__dirname, '../../resources/assets/config/config.json')
      : join(process.resourcesPath, 'resources/assets/config/config.json')

    const content = readFileSync(jsonPath, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    console.error('Gagal membaca config:', err)
    return null
  }
})

ipcMain.handle('get-assets-path', async () => {
  const assetsPathConfig = is.dev
    ? join(__dirname, '../../resources/assets')
    : join(process.resourcesPath, 'resources/assets')

  return assetsPathConfig
})

ipcMain.on('print-order-receipt', (_, data) => {
  const rWin = new BrowserWindow({
    show: false,
    webPreferences: {
      // devTools: false,
      nodeIntegration: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js')
    }
  })

  const RESOURCES_PATH_PRINT = app.isPackaged
    ? path.join(process.resourcesPath, `resources/assets/receipt/print-order-receipt.html`)
    : path.join(__dirname, `../../resources/assets/receipt/print-order-receipt.html`)

  // rWin.loadFile(RESOURCES_PATH_PRINT);
  rWin.loadURL(RESOURCES_PATH_PRINT).then(() => {
    // send structured payload into print window and let it render HTML
    const payload = JSON.stringify(data || {})
    rWin.webContents.executeJavaScript(`(function(){
      try {
        const data = ${payload}
        document.getElementById('header1').innerText = data.header1 || ''
        document.getElementById('header2').innerText = data.header2 || ''
        document.getElementById('header3').innerText = data.header3 || ''
        document.getElementById('content').innerHTML = data.contentHTML || ''
        document.getElementById('footer1').innerText = data.footer1 || ''
        document.getElementById('footer2').innerText = data.footer2 || ''
        document.getElementById('footer3').innerText = data.footer3 || ''
      } catch (e) { console.error(e) }
    })()`)

    setTimeout(() => {
      rWin.webContents.print({
        silent: true,
        margins: {
          marginType: 'printableArea'
        },
        printBackground: false,
        pagesPerSheet: 1,
        landscape: false,
        header: 'Header of the Page',
        footer: 'Footer of the Page',
        collate: false
      })
    }, 200)
  })
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.on('window-minimize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window?.minimize()
})

ipcMain.on('window-maximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window?.isMaximized()) {
    window.unmaximize()
  } else {
    window?.maximize()
  }
})

ipcMain.on('window-close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window?.webContents.executeJavaScript('localStorage.clear()')
  window?.close()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
