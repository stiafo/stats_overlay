const show = document.getElementById('show');
const hide = document.getElementById('hide');
const fixture_div = document.getElementById('fixture_list');
const close_btn = document.getElementById('close');
const stats_element = document.getElementById('stats');


window.electronAPI.Stat_obj((data) => {
  console.log(data);
});

let stat = 0;

window.electronAPI.onStats((data) => {
  data.statistics.forEach((stat_type) => {
    if (stat_type.type == 'Shots On Goal') {
      stat = parseInt(stat_type.home) + parseInt(stat_type.away);
    }
  });
  stats_element.innerText = `Shots on goal: ${stat}`;
});

function showFixtures(fixture_list) {
  fixture_list.forEach((fixture) => {
    let parent_div = document.createElement("div");
    let team_names = document.createElement("p");

    team_names.innerHTML = fixture.match_hometeam_name + " vs. " + fixture.match_awayteam_name;
    team_names.classList.add("fixture");

    parent_div.id = fixture.match_id;
    parent_div.addEventListener("click", () => {
      selectFixture(parent_div.id);
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

function selectFixture(fixture_id) {
  window.electronAPI.selectFixture(parseInt(fixture_id));

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
