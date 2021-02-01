const uri = 'https://www.balldontlie.io/api/v1';
const localStorageKey = 'playersLocal';
let params = {
    page: 1,
    per_page: 25,
    search: ''
}
$(document).ready(function () {
    getPlayers();
});

const getPlayers = async () => {
    try {
        const apiAction = '/players';
        const response = await fetch(`${uri}${apiAction}?page = ${params.page}&per_page=${params.per_page}&search=${params.search}`);
        const { data, meta } = await response.json();
        const tBody = $("#body-players");
        tBody.empty();
        $.each(data, function (i, player) {
            const tr = $("<tr id='" + player.id + "'> </tr>")
                .append($("<td></td>").text(player.id))
                .append($("<td></td>").text(player.first_name))
                .append($("<td></td>").text(player.last_name))
                .append($("<td></td>").text(player.position))
                .append($("<td></td>").text(player.height_feet))
                .append($("<td></td>").text(player.height_inches))
                .append($("<td></td>").text(player.weight_pounds))
                .append($("<td></td>").text(player.team.full_name))
                .append(
                    $("<td></td>").append(
                        $('<button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#formModal">Update</button>')
                            .on('click', function () {
                                getPlayerById(player.id);
                            })
                    )
                );
            tr.appendTo(tBody);
        });
        let info = document.querySelector('#tbl_historial_info');
        info.innerHTML = `Page ${params.page} of ${meta.total_pages}`;
        const paging = document.querySelector('#paging');
        for (i = 1; i <= meta.total_pages; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.innerHTML = `Pag ${i}`;
            option.selected = params.page === i;
            paging.appendChild(option);
        };
    } catch (err) {
        console.error(err);
    }
};
const getPlayerById = function (id) {
    const apiAction = '/players/';
    const httpCall = fetch(`${uri}${apiAction}${id}`);
    httpCall
        .then(response => response.json())
        .then(async (player) => {
            let id = document.querySelector("#player-id");
            let first_name = document.querySelector("#player-first-name");
            let last_name = document.querySelector("#player-last-name");
            let position = document.querySelector("#player-position");
            let height_feet = document.querySelector("#player-height-feet");
            let height_inches = document.querySelector("#player-height-inches");
            let weight_pounds = document.querySelector("#player-weight-pounds");
            let player_team = document.querySelector("#player-team");

            id.setAttribute("value", player.id);
            first_name.setAttribute("value", player.first_name);
            last_name.setAttribute("value", player.last_name);
            position.setAttribute("value", player.position);
            height_feet.setAttribute("value", (player.height_feet !== null) ? player.height_feet : 0);
            height_inches.setAttribute("value", (player.height_inches !== null) ? player.height_inches : 0);
            weight_pounds.setAttribute("value", (player.weight_pounds !== null) ? player.weight_pounds : 0);
            loadTeamsByPlayer(player.team.id);
        })
        .catch(console.error);
};
const updatePlayer = async () => {
    const teamId = document.querySelector("#player-team");
    const teamPlayer = await getTeamById(teamId.value);
    const player = {
        id: document.querySelector("#player-id").value,
        first_name: document.querySelector("#player-first-name").value,
        last_name: document.querySelector("#player-last-name").value,
        position: document.querySelector("#player-position").value,
        height_feet: document.querySelector("#player-height-feet").value,
        height_inches: document.querySelector("#player-height-inches").value,
        weight_pounds: document.querySelector("#player-weight-pounds").value,
        team: teamPlayer
    };
    setPlayerToLocalStorage(player);
    updatePlayerView(player);
    $('#formModal').modal('hide');
};
const updatePlayerView = (player) => {
    const tr = $(`#${player.id}`).empty()
        .append($("<td></td>").text(player.id))
        .append($("<td></td>").text(player.first_name))
        .append($("<td></td>").text(player.last_name))
        .append($("<td></td>").text(player.position))
        .append($("<td></td>").text(player.height_feet))
        .append($("<td></td>").text(player.height_inches))
        .append($("<td></td>").text(player.weight_pounds))
        .append($("<td></td>").text(player.team.full_name))
        .append(
            $("<td></td>").append(
                $('<button class="btn btn-sm btn-primary" data-toggle="modal" data-target="#formModal">Update</button>')
                    .on('click', function () {
                        getPlayerById(player.id);
                    })
            )
        );
};
const loadTeamsByPlayer = async (idTeam) => {
    const teams = await getTeams();
    const list_teams = document.querySelector("#player-team");
    $.each(teams, function (i, team) {
        let option = document.createElement('option');
        option.value = team.id;
        option.innerHTML = team.full_name;
        option.selected = idTeam === team.id;
        list_teams.appendChild(option);
    });
};
const getTeams = async () => {
    try {
        const apiAction = '/teams';
        const response = await fetch(`${uri}${apiAction}`);
        const { data, meta } = await response.json();
        return data;
    } catch (err) {
        console.error(err);
    }
};
const getTeamById = async (id) => {
    try {
        const apiAction = '/teams/';
        const response = await fetch(`${uri}${apiAction}${id}`);
        const team = await response.json();
        return team;
    } catch (err) {
        console.error(err);
    }
};
const loadPlayersFromLocalStorage = () => {
    let players = [];
    const dataInLocalStorage = localStorage.getItem(localStorageKey);
    players = dataInLocalStorage !== null && JSON.parse(dataInLocalStorage);
    return players;
};
const setPlayerToLocalStorage = (player) => {
    let players = [];
    const dataInLocalStorage = localStorage.getItem(localStorageKey);
    if (dataInLocalStorage === null) {
        players.push(player);
    } else {
        players = JSON.parse(dataInLocalStorage);
        const id = players.findIndex((i) => i.id === player.id);
        if (id >= 0) {
            console.log(id, players[id]);
            players[id] = player;
        } else {
            players.push(player);
        }
    }
    localStorage.setItem(localStorageKey, JSON.stringify(players));
};