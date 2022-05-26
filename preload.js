const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getFixtures: () => ipcRenderer.invoke('dialog:get-fixtures'),
  selectFixture: (stat_obj) => ipcRenderer.send('select-fixture', stat_obj),
  close: () => ipcRenderer.send('close-app'),
  Stat_obj: (callback) => ipcRenderer.on('stat_from_class', (event, args) => {
    callback(args);
  }),
  newStat: (callback) => ipcRenderer.on('new_stat', (event, args) => {
    callback(args);
  }),
  deleteStat: (stat_id) => ipcRenderer.send('delete_stat', stat_id),
})
