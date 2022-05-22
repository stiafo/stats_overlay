const { app, BrowserWindow, ipcMain } = require('electron')
const electronReload = require('electron-reload')

const path = require("path")
const fs = require("fs")
const fs_promise = require("fs/promises")

const createWindow = () => {
  const win = new BrowserWindow({
    width: 260,
    maxWidth: 260, minWidth: 260,
    height: 300,
    maxHeight: 300, minHeight: 300,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

async function getFixtures() {
    try {
      const data = await fs_promise.readFile('fixtures.json');
      return JSON.parse(data)
    } catch (err) {
      console.log(err);
    }
}

//we store the intervals here to have better control over them
let interval_list = []

function statsInterval(win, fixture_id) {
  let stats = JSON.parse(fs.readFileSync(`data_${fixture_id}.json`, 'utf-8'));
  win.webContents.send("stats", stats);

}

app.whenReady().then(() => {
  ipcMain.on('close-app', () => app.quit());

  ipcMain.on('select-fixture', (event, args) => {
    //clear any ongoing intervals
    if (interval_list != []) {
      interval_list.forEach((ongoing_interval) => {
        clearInterval(ongoing_interval);
      });
    }

    focused_win = BrowserWindow.getFocusedWindow()
    const interval = setInterval( () => { statsInterval(focused_win, args) }, 3000);
    interval_list.push(interval);
  });

  ipcMain.handle('dialog:get-fixtures', getFixtures);

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
