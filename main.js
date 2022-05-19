const { app, BrowserWindow } = require('electron')
const path = require("path")

const createWindow = () => {
  const win = new BrowserWindow({
    width: 200,
    height: 100,
    maxWidth: 200, minWidth: 200,
    maxHeight: 100, minHeight: 100,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
