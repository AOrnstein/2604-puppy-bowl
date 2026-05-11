"use strict";
// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2604-Adam"; // Make sure to change this!
const API = BASE + COHORT;
// Player status enum {"bench"(default), "field"}
/**
 * PlayerStatus
 * @default PlayerStatus.Bench
 */
const PlayerStatus = {
    Bench: "bench",
    Field: "field",
};
const PLAYER_STATUS_BENCH = "bench"; // default
const PLAYER_STATUS_FIELD = "field";
// === State ===
// The roster of puppies
let players = [];
// The selected puppy for more info
let selectedPlayer = null;
// Get a list of all players from the API
async function getPlayers() {
    try {
        // GET a list of players from the API/players endpoint
        const response = await fetch(API + "/players");
        const result = await response.json();
        // Set the players state to the result
        players = result.data.players;
        // re-render the page
        render();
    }
    catch (error) {
        console.error(error);
    }
}
/**
 * Get and select a player by id from the API
 * @param {number} id
 */
async function getPlayer(id) {
    try {
        // GET a of player from the API/players/{id} endpoint
        const response = await fetch(API + "/players/" + id);
        const result = await response.json();
        // Set the selectedPlayer state to the result
        selectedPlayer = result.data.player;
        // re-render the page
        render();
    }
    catch (error) {
        console.error(error);
    }
}
/** Add a player vie the API */
async function addPlayer({ name, breed, status = PlayerStatus.Bench, }) {
    try {
        // POST a player of players from the API/players endpoint
        const response = await fetch(API + "/players/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, breed, status }),
        });
        const result = await response.json();
        // get the new state and re-render the page
        await getPlayers();
    }
    catch (error) {
        console.error(error);
    }
}
/** Clear selectedPlayer state and remove the player with the API */
async function removePlayer(id) {
    try {
        // DELETE a of player from the API/players/{id} endpoint
        const response = await fetch(API + "/players/" + id, {
            method: "DELETE",
        });
        // Unset the selectedPlayer state
        selectedPlayer = null;
        // get the new state and re-render the page
        await getPlayers();
    }
    catch (error) {
        console.error(error);
    }
}
// === Components ===
/**
 * Display minimal information about a player.
 * @param {Player} player
 */
function PlayerCard(player) {
    /*
      Displayes:
      - name
      - image (with alt text of the player's name)
    */
    const $li = document.createElement("li");
    if (player.id === selectedPlayer?.id) {
        $li.classList.add("selected");
    }
    $li.innerHTML = `
    <a href="#selected">${player.name}</a>
    <figure>
      <img alt=${player.name} src=${player.imageUrl} />
    </figure>
  `;
    // on click: should select a player and display PlayerDetails
    $li.addEventListener("click", () => getPlayer(player.id));
    return $li;
}
/**
 * Display a list of players
 */
function PlayerRoster() {
    // Displayes list of players
    const $ul = document.createElement("ul");
    $ul.classList.add("parties");
    const $players = players.map(PlayerCard);
    $ul.replaceChildren(...$players);
    return $ul;
}
/**
 * Display detailed information on a individual Player
 * @param {Player} player
 */
function PlayerDetails() {
    // Display text when no SelectedPlayer
    if (!selectedPlayer) {
        const $p = document.createElement("p");
        $p.textContent = "Please select puppy to learn more!";
        return $p;
    }
    /*
      Displays the following when a player is selected:
      - name
      - id
      - breed
      - status
      - image (with alt text of the player's name)
      - team name, if the player has one, or "Unassigned"
  
      - "Remove from Roster" Button
    */
    const $player = document.createElement("section");
    $player.innerHTML = `
    <figure>
      <img alt=${selectedPlayer.name} src=${selectedPlayer.imageUrl} />
    </figure>
    <p><strong>Name:</strong> ${selectedPlayer.name}</p>
    <p><strong></strong> ${selectedPlayer.id}</p>
    <p><strong></strong> ${selectedPlayer.breed}</p>
    <p><strong></strong> ${selectedPlayer.team?.name ?? "Unasigned"}</p>
    <p><strong></strong> ${selectedPlayer.status}</p>
    <button>Remove from roster</button>
  `;
    // "Remove from Roster" button deletes player with and unselects the player
    $player.addEventListener("click", () => removePlayer(selectedPlayer.id));
    return $player;
}
/** Form to add a new Player */
function AddPlayerForm() {
    /*
      Display input form with:
      - Name: text input (required)
      - Breed: text input (requird)
      - Status (Optional): dropdown with "bench" (default) or "field"
      - Team (Optional): Get a team from a dropdown populated by a getTeam API
      
      - Submint button with label "Invite puppy"
      */
    const $form = document.createElement("form");
    $form.innerHTML = `
    <label>
      Name
      <input name="name" required />
    </label>
    <label>
      Breed
      <input name="breed" required />
    </label>
    <label>
      Status
      <select name="status" >
        <option value="${PlayerStatus.Bench}">Bench</option>
        <option value="${PlayerStatus.Field}">Field</option>
      </select>
    </label>
    <label>
      Image URL
      <input name="imageUrl" />
    </label>
    <button>Add party</button>
  `;
    // "Invit puppy" Button submits the form and calls addPlayer with the formData
    $form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData($form);
        addPlayer({
            name: formData.get("name").toString(),
            breed: formData.get("name").toString(),
            status: formData.get("status")?.toString() === PlayerStatus.Field
                ? PlayerStatus.Field
                : PlayerStatus.Bench,
        });
    });
    return $form;
}
// === Render ===
function render() {
    const $app = document.querySelector("#app");
    $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Roster</h2>
        <PlayerRoster></PlayerRoster>
        <h3>Invite a puppy</h3>
        <AddPlayerForm></AddPlayerForm>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
        <PlayerDetails></PlayerDetails>
      </section>
    </main>
  `;
    $app.querySelector("PlayerRoster").replaceWith(PlayerRoster());
    $app.querySelector("PlayerDetails").replaceWith(PlayerDetails());
    $app.querySelector("AddPlayerForm").replaceWith(AddPlayerForm());
}
// on initialization: call getPlayers
getPlayers();
