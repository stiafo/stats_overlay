const { app, BrowserWindow, ipcMain } = require('electron')
const electronReload = require('electron-reload')

const path = require("path")
const fs = require("fs")
const fs_promise = require("fs/promises")
const fetch = require("node-fetch")

const { API_KEY } = require('./config.js')
const { Stat } = require('./models.js');


const createWindow = () => {
  const win = new BrowserWindow({
    width: 300,
    maxWidth: 300, minWidth: 300,
    //height: 300,
    //maxHeight: 300, minHeight: 300,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('static/index.html')
}

async function getFixtures() {
  let url = `https://apiv3.apifootball.com/?action=get_events&from=2022-04-25&to=2022-05-01&league_id=153&APIkey=${API_KEY}`;
  let settings = { method: "Get" };

  return fetch (url, settings)
    .then(res => res.json());
}

app.whenReady().then(() => {
  ipcMain.on('close-app', () => app.quit());

  ipcMain.on('select-fixture', (event, new_stat) => {
    new Stat(new_stat.action, new_stat.parameters, new_stat.type, new_stat.home_team, new_stat.away_team);
  });

  ipcMain.on('delete_stat', (event, args) => {
    let del_stat = Stat.stat_list.filter((stat_obj) => {
      return stat_obj.stat_id == args;
    });
    del_stat[0].deactivate();
    delete del_stat[0];
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
