console.log(`For more information about data drawn from this page, see https://www.amiiboapi.com/docs/`);
let seriesFilter, characterList, characterSearch;
let amiiboLib = [];
let gameList = [];
const seriesOptions = [];
const nullGame = {
  gameName: "None",
  amiiboUsage: [
    {
      Usage: "We're still learning what this Amiibo does. Come back later and check again!",
    },
  ],
};

init();

async function init() {
  getSideBarElements();
  addEventListeners();
  await buildSeriesList();
  await fetchAmiibos();
  refreshseriesFilter();
  refreshCharacterList(seriesFilter.value, "amiiboSeries");
}

function getSideBarElements() {
  seriesFilter = document.getElementById("sidebar").querySelector("select");
  characterSearch = document.getElementById("character-search");
  characterList = document.getElementById("character-list");
}

function addEventListeners() {
  seriesFilter.addEventListener("change", (e) => refreshCharacterList(e.target.value, "amiiboSeries"));
  characterSearch.addEventListener("submit", handleCharacterSearch);
}

async function buildSeriesList() {
  const seriesArray = await fetchSeriesList();
  seriesArray.forEach((series) => seriesOptions.push(series.name));
  seriesOptions.sort();
}

async function fetchSeriesList() {
  seriesFetch = await fetch("https://www.amiiboapi.com/api/amiiboseries");
  seriesJSON = await seriesFetch.json();
  return seriesJSON["amiibo"];
}

async function fetchAmiibos() {
  amiiboFetch = await fetch("https://www.amiiboapi.com/api/amiibo/?showusage");
  amiiboJSON = await amiiboFetch.json();
  amiiboLib = amiiboJSON["amiibo"];
}

function handleCharacterSearch(event) {
  event.preventDefault();
  const characterToFind = document.getElementById("search-name").value;
  refreshCharacterList(characterToFind, "name");
}

function refreshseriesFilter() {
  while (seriesFilter.length > 0) seriesFilter.removeChild(seriesFilter.firstElementChild);
  seriesOptions.forEach((series) => {
    const newOption = document.createElement("option");
    newOption.textContent = series;
    newOption.value = series;
    seriesFilter.append(newOption);
  });
  seriesFilter[0].setAttribute("selected", "true");
}

function refreshCharacterList(filterName, filterType) {
  characterList.replaceChildren();
  const filteredCharacters = amiiboLib.filter((amiibo) => amiibo[filterType].toLowerCase().includes(filterName.toLowerCase()));
  filteredCharacters.sort((a, b) => a.name.localeCompare(b.name));
  filteredCharacters.forEach((character) => AddToCharacterList(character));
  resetSelectedAmiibo(filteredCharacters[0]);
}

function AddToCharacterList(character) {
  const characterLi = document.createElement("li");
  const characterButton = document.createElement("button");
  characterButton.textContent = character.name;
  characterButton.addEventListener("click", resetSelectedAmiibo.bind(null, character));
  characterLi.append(characterButton);
  characterList.append(characterLi);
}

function resetSelectedAmiibo(character) {
  if (character == undefined) return;
  const gameConsoles = ["Switch", "3DS", "WiiU"];
  for (gameConsole of gameConsoles) clearGameList(gameConsole);
  document.getElementById("amiibo-image").src = character.image;
  document.getElementById("amiibo-name").textContent = character.name;

  //check each console games from object and add them to the list, if none are found, add a default "none" game. Display the first game's usage
  firstDisplayed = false;
  for (gameConsole of gameConsoles) {
    if (character["games" + gameConsole].length > 0) {
      character["games" + gameConsole].forEach((game) => addGame(game, gameConsole));
      if (!firstDisplayed) updateUsage(character["games" + gameConsole][0]);
      firstDisplayed = true;
    } else addGame(nullGame, gameConsole);
  }
  if (!firstDisplayed) updateUsage(nullGame);
}

function clearGameList(gameConsole) {
  const games = document.getElementById(`game-list-${gameConsole}`);
  games.replaceChildren(`${gameConsole}`.toUpperCase());
}
function addGame(game, system) {
  const newGameLi = document.createElement("li");
  newGameLi.textContent = game.gameName;
  if (game.gameName.localeCompare("None") != 0) {
    newGameLi.addEventListener("click", updateUsage.bind(null, game));
  }
  document.getElementById(`game-list-${system}`).append(newGameLi);
}
//updates the usage text for the selected game
function updateUsage(game) {
  let usageText =
    game.gameName !== "None"
      ? `In ${game.gameName} you can ${game.amiiboUsage[0].Usage.slice(0, 1).toLowerCase() + game.amiiboUsage[0].Usage.slice(1)}`
      : "We're still learning what this Amiibo does. Come back later and check again!";
  document.getElementById("amiibo-usage").textContent = usageText;
}
