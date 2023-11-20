console.log(`For more information about data drawn from this page, see https://www.amiiboapi.com/docs/`);
const amiiboSeriesBackup = {
  amiibo: [
    { name: "Super Smash Bros." },
    { name: "Super Mario Bros." },
    { name: "Chibi-Robo!" },
    { name: "Yoshi's Woolly World" },
    { name: "Splatoon" },
    { name: "Animal Crossing" },
    { name: "8-bit Mario" },
    { name: "Skylanders" },
    { name: "Legend Of Zelda" },
    { name: "Shovel Knight" },
    { name: "Kirby" },
    { name: "Pokemon" },
    { name: "Mario Sports Superstars" },
    { name: "Monster Hunter" },
    { name: "BoxBoy!" },
    { name: "Pikmin" },
    { name: "Fire Emblem" },
    { name: "Metroid" },
    { name: "Others" },
    { name: "Mega Man" },
    { name: "Diablo" },
    { name: "Power Pros" },
    { name: "Monster Hunter Rise" },
    { name: "Yu-Gi-Oh!" },
    { name: "Super Nintendo World" },
  ],
};
const gameFilter = document.getElementById("sidebar").querySelector("select");
//Use filter to select amiibo series and populate characters
gameFilter.addEventListener("change", (e) => {
  refreshCharacterList(e.target.value, "amiiboSeries");
});
const characterList = document.getElementById("character-list");
let amiiboLib = [];
let gameList = [];
const gameOptions = [];
//Generate list of amiibo series' to update filter
fetch("https://www.amiiboapi.com/api/amiiboseries")
  .then((resp) => resp.json())
  .then((seriesArr) => {
    seriesArr["amiibo"].forEach((series) => addGameToFilter(series));
  })
  .then(() => {
    gameOptions.sort();
    clearGameFilter();
    refreshGameFilter();
  });
function addGameToFilter(series) {
  gameOptions.push(series.name);
  newOption = document.createElement("option");
  newOption.value = series.name;
  newOption.innerText = series.name;
  gameFilter.append(newOption);
}
//Add submit event for character search
const characterSearch = document.getElementById("character-search");
characterSearch.addEventListener("submit", handleCharacterSearch);

//obtain amiibos. The fetch from https://www.amiiboapi.com/api/amiibo/?showusage was used to generate local db
fetch("https://www.amiiboapi.com/api/amiibo/?showusage")
  .then((resp) => resp.json())
  .then((amiiboObjs) => {
    amiiboLib = amiiboObjs["amiibo"];
    refreshCharacterList(gameFilter.value, "amiiboSeries");
    //refreshCharacterList("mario", "Character Name");
  });

//Helper functions
function handleCharacterSearch(event) {
  event.preventDefault();
  const characterToFind = document.getElementById("search-name").value;
  refreshCharacterList(characterToFind, "name");
}

function clearGameFilter() {
  while (gameFilter.length > 0) {
    gameFilter.removeChild(gameFilter.firstElementChild);
  }
}

function refreshGameFilter() {
  gameOptions.forEach((option) => {
    const newOption = document.createElement("option");
    newOption.textContent = option;
    newOption.value = option;
    gameFilter.append(newOption);
  });
  gameFilter[0].setAttribute("selected", "true");
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
  gameConsoles = ["Switch", "3DS", "WiiU"];
  for (gameConsole of gameConsoles) clearGameList(gameConsole);
  nullGame = {
    gameName: "None",
    amiiboUsage: {
      usage: "No game selected. Select a game to show usage",
    },
  };
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
  if (!firstDisplayed) updateUsage(undefined);
}

function clearGameList(gameConsole) {
  const games = document.getElementById(`game-list-${gameConsole}`);
  games.replaceChildren(`${gameConsole}`.toUpperCase());
}
function addGame(game, system) {
  const newGameObj = document.createElement("p");
  newGameObj.textContent = game.gameName;
  //only add event listeners for valid games
  if (game.gameName.localeCompare("None") != 0) {
    newGameObj.addEventListener("click", updateUsage.bind(null, game));
  }
  document.getElementById(`game-list-${system}`).append(newGameObj);
}
//updates the usage text for the selected game
function updateUsage(game) {
  if (game == undefined) {
    document.getElementById("amiibo-usage").textContent = `No games were found, guess this one is a regular toy.`;
    return;
  }
  let usageText = game.amiiboUsage[0].Usage;
  usageText = usageText.slice(0, 1).toLowerCase() + usageText.slice(1);
  document.getElementById("amiibo-usage").textContent = `In ${game.gameName}, you can ${usageText}`;
}
