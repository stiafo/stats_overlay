const show = document.getElementById('show');
const hide = document.getElementById('hide');
const fixture_div = document.getElementById('fixture_list');
const close_btn = document.getElementById('close');
const stats_element = document.getElementById('stats');
const stat_div = document.getElementById('stat-div');
const no_data = document.getElementById('no_stats');


window.electronAPI.Stat_obj((stat_obj) => {
  let elem = document.getElementById('span_' + stat_obj.stat_id);
  elem.innerHTML = stat_obj.data;
});

window.electronAPI.newStat((stat_obj) => {
  newStatistics(stat_obj);
});

function hideNoData() {
  no_data.style.display = 'none';
}

function showNoData() {
  no_data.style.display = 'block';
}


function newStatistics(stat_obj) {
  hideNoData();

  let stats = document.createElement("div");
  stats.classList.add('stats');
  stats.id = stat_obj.stat_id;

  let row = document.createElement("div");
  row.classList.add('row');

  stats.appendChild(row);

  let stat_teams = document.createElement("p");
  stat_teams.classList.add('stat_teams');
  stat_teams.innerHTML = stat_obj.home_team + 'vs. ' + stat_obj.away_team;

  let close_icon = document.createElement('span');
  close_icon.classList.add('icon');
  close_icon.classList.add('close-icon');
  close_icon.innerHTML = '&#xd7';
  close_icon.addEventListener("click", () => {
    deleteStat(stat_obj.stat_id);
  });

  row.appendChild(stat_teams);
  row.appendChild(close_icon);

  let stat_data = document.createElement('h3');
  stat_data.classList.add('stat_data');
  stat_data.innerHTML = stat_obj.type + ` <span id="span_${stat_obj.stat_id}">0</span>`;

  stats.appendChild(stat_data);
  stat_div.appendChild(stats);
}

function deleteStat(stat_id) {
  let stat = document.getElementById(stat_id);
  stat.remove();
  console.log(stat_id);

  window.electronAPI.deleteStat(stat_id);

  if (stat_div.childElementCount < 2) {
    showNoData();
  }
}

function showFixtures(fixture_list) {
  fixture_list.forEach((fixture) => {
    let parent_div = document.createElement("div");
    let team_names = document.createElement("p");
    let home_team = fixture.match_hometeam_name
    let away_team = fixture.match_awayteam_name

    team_names.innerHTML = home_team + " vs. " + away_team;
    team_names.classList.add("fixture");

    parent_div.id = fixture.match_id;
    parent_div.addEventListener("click", () => {
      selectFixture(parent_div.id, home_team, away_team);
    });

    parent_div.appendChild(team_names);
    fixture_div.appendChild(parent_div);
  });

  show.style.display = "none";
  hide.style.display = "block";
}

function hideFixtures() {
  fixture_div.innerHTML = '';

  show.style.display = "block";
  hide.style.display = "none";
}

function selectFixture(fixture_id, home_team, away_team) {
  window.electronAPI.selectFixture({
    action: 'get_statistics',
    parameters: [ `match_id=${fixture_id}` ],
    type: 'Shots On Goal',
    home_team: home_team,
    away_team: away_team,
  });

  hideFixtures();
}

show.addEventListener('click', async () => {
  const fixtures = await window.electronAPI.getFixtures();
  showFixtures(fixtures);
});

hide.addEventListener('click', () => {
  hideFixtures();
});

close_btn.addEventListener('click', () => {
  window.electronAPI.close();
});
