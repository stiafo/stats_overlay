const { app, BrowserWindow, ipcMain } = require('electron')
const fetch = require('node-fetch')

const { API_KEY, API_URL } = require('./config.js');
const utilities = require('./utils.js');

class Stat {

  static stat_list = [];

  constructor(action, parameters=[], type, home_team, away_team) {
    this.stat_id = utilities.parameters_as_url(action, parameters, type);
    this.action = action;
    this.parameters = parameters;
    this.type = type;
    this.home_team = home_team;
    this.away_team = away_team;
    this.interval = setInterval( () => { this.statsInterval() }, 3000);
    this.active = true;

    Stat.stat_list.push(this);

    BrowserWindow.getFocusedWindow().webContents.send("new_stat", {
      stat_id: this.stat_id,
      type: this.type,
      home_team: this.home_team,
      away_team: this.away_team,
    });
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
        let statistics = data[Object.keys(data)[0]].statistics
        let stat;

        statistics.forEach((stat_type) => {
          if (stat_type.type == this.type) {
            stat = parseInt(stat_type.home) + parseInt(stat_type.away);
          }
        });

        BrowserWindow.getFocusedWindow().webContents.send("stat_from_class", {
          stat_id: this.stat_id, data: stat });
      }, (e) => { console.log(e) });

  }
}

module.exports = { Stat }
