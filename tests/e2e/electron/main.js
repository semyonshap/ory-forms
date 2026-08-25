const {
  app,
  BrowserWindow,
  protocol,
  ipcMain,
  shell,
} = require('electron')
const path = require('path')

protocol.registerSchemesAsPrivileged([
  { scheme: 'myapp', privileges: { standard: true, secure: true } },
])

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      webSecurity: false,
    },
  })
  mainWindow.loadFile('index.html')
}

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, argv) => {
    const rawUrl = argv.find((a) => a.startsWith('myapp://'))

    const url = new URL(rawUrl)

    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    if (mainWindow) {
      mainWindow.webContents.send('oauth-callback', { code, state })
    }
  })

  app.whenReady().then(() => {
    app.setAsDefaultProtocolClient('myapp', process.execPath, [
      path.resolve(__filename),
    ])

    ipcMain.on('open-external', (event, url) => {
      shell.openExternal(url)
    })

    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
