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
        players = result.data;
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
        selectedPlayer = result.data;
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
 * @param {Player[]} player
 */
function PlayerCard(player) {
    /*
      Displayes:
      - name
      - image (with alt text of the player's name)
    */
    // on click: should select a player and display PlayerDetails
}
/**
 * Display a list of players
 * @param {Player[]} players
 */
function PlayerRoster(players) {
    // Displayes list of players
}
/**
 * Display detailed information on a individual Player
 * @param {Player} player
 */
function PlayerDetails(player) {
    // Display text when noSelectedPlayer
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
    // "Remove from Roster" button deletes player with and unselects the player
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
    // "Invit puppy" Button submits the form and calls addPlayer with the formData
}
// === Render ===
function render() {
    const $app = document.querySelector("#app");
}
// on initialization: call getPlayers
getPlayers();
