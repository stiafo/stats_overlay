const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onStats: (callback) => ipcRenderer.on('stats', (event, args) => {
    callback(args);
  }),
  getFixtures: () => ipcRenderer.invoke('dialog:get-fixtures'),
  selectFixture: (fixture_id) => ipcRenderer.send('select-fixture', fixture_id),
  close: () => ipcRenderer.send('close-app'),
  Stat_obj: (callback) => ipcRenderer.on('stat_from_class', (event, args) => {
    callback(args);
  }),
})
