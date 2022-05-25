const { app, BrowserWindow, ipcMain } = require('electron')
const fetch = require('node-fetch')

const { API_KEY, API_URL } = require('./config.js');

class Stat {

  static stat_list = [];

  constructor(action, parameters=[], win) {
    this.stat_id = 'stat_' + action + parameters.concat();
    this.action = action;
    this.parameters = parameters;
    this.interval = setInterval( () => { this.statsInterval() }, 3000);
    this.active = true;

    Stat.stat_list.push(this);
  }

  get_url() {
    let url = API_URL + '?action=' + this.action
    this.parameters.forEach((param) => {
      url = url.concat('&', param);
    });

    url = url.concat('&APIkey=', API_KEY);

    return url;
  }

  deactivate() {
    if (this.active = true) {
      const index = Stat.stat_list.indexOf(this);
      Stat.stat_list.splice(index, 1);
    }

    this.active = false;
    clearInterval(this.interval);
  }

  statsInterval(win, fixture_id) {
    let settings = { method: "Get" };
    let url = this.get_url();

    fetch (url, settings)
      .then(res => res.json())
      .then((data) => {
        //console.log(data);
        BrowserWindow.getFocusedWindow().webContents.send("stat_from_class", data);
      }, (e) => { console.log(e) });

  }
}

module.exports = { Stat }
