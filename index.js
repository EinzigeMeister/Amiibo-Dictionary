console.log(`For more information about data drawn from this page, see https://www.amiiboapi.com/docs/`)
const gameFilter = document.getElementById('sidebar').querySelector('select');
//Use filter to select game series and populate characters
gameFilter.addEventListener('change', e => {
    refreshCharacterList(e.target.value, "Game Series")
})
const characterList = document.getElementById('character-list')
let amiiboLib = []
let filteredCharacters = []
let gameList = []

//Generate list of game series' to update filter 
const gameOptionNodes = document.querySelectorAll('option')
const gameOptions = []
gameOptionNodes.forEach(option => gameOptions.push(option.value))
gameOptions.sort();
clearGameFilter();
refreshGameFilter();

//Add submit event for character search
const characterSearch = document.getElementById('character-search')
characterSearch.addEventListener('submit', handleCharacterSearch)


//obtain amiibos. The fetch from https://www.amiiboapi.com/api/amiibo/?showusage was used to generate local db
fetch("http://localhost:3000/amiibo").then(resp => resp.json()).then(amiiboObjs => {
    amiiboLib = amiiboObjs
    //refreshCharacterList(gameFilter.value, "Game Series")
    refreshCharacterList("mario", "Character Name")
})

//Helper functions
function handleCharacterSearch(event){
    event.preventDefault()
    const characterToFind = document.getElementById("search-name").value
    refreshCharacterList(characterToFind, "Character Name")
}

function clearGameFilter() {
    while (gameFilter.length > 0) {
        gameFilter.removeChild(gameFilter.firstElementChild)
    }
}
//update the filter if any new game series are added
function refreshGameFilter() {
    gameOptions.forEach(option => {
        const newOption = document.createElement('option')
        newOption.textContent = option
        newOption.value = option
        gameFilter.append(newOption)
    })
    //force a selected filter
    gameFilter[0].setAttribute('selected', 'true')
}

//empties current character list
function clearCharacterList() {
    characterList.replaceChildren()
}

function refreshCharacterList(filterName, filterType) {
    //creates a modified array of selected filter
    filteredCharacters = []
    if (filterType.localeCompare("Game Series")==0){
        filteredCharacters = amiiboLib.filter(amiibo => {
            if (amiibo.gameSeries.localeCompare(filterName) == 0) return true
            else return false
        })
    }
    else if (filterType.localeCompare("Character Name")==0){
        filteredCharacters = amiiboLib.filter(amiibo => {
            return amiibo.character.toLowerCase().includes(filterName.toLowerCase())
        })
    }
    if (filteredCharacters.length>0)    
        clearCharacterList()
    else {
        window.alert("No characters found")
        return 
    }

    filteredCharacters.sort((a, b) => a.name.localeCompare(b.name))
    //displays each character from the array
    filteredCharacters.forEach(character => {
        const characterLi = document.createElement('li')
        const characterButton = document.createElement('button')
        characterButton.textContent = character.name
        characterButton.addEventListener('click', resetSelectedAmiibo.bind(null, character))
        characterLi.append(characterButton)
        characterList.append(characterLi)
    })
    //Inializes the first character as the displayed Amiibo
    resetSelectedAmiibo(filteredCharacters[0])
}

function resetSelectedAmiibo(character) {
    if (character == undefined) return
    clearGameList('3ds')
    clearGameList('switch')
    clearGameList('wii-u')
    //add new game list and update Amiibo
    nullGame = {
        gameName: 'None',
        amiiboUsage: {
            usage: 'No game selected. Select a game to show usage'
        }
    }
    document.getElementById('amiibo-image').src = character.image
    document.getElementById('amiibo-name').textContent = character.name
    firstDisplayed = false
    //check each console games from object and add them to the list, if none are found, add a default "none" game. Display the first game's usage
    if (character.gamesSwitch.length > 0) {
        character.gamesSwitch.forEach(game => addGame(game, 'switch'))
        updateUsage(character.gamesSwitch[0])
        firstDisplayed = true
    }
    else addGame(nullGame, 'switch')

    if (character.games3DS.length > 0) {
        character.games3DS.forEach(game => addGame(game, '3ds'))
        if (!firstDisplayed) {
            updateUsage(character.games3DS[0])
            firstDisplayed = true
        }
    }
    else addGame(nullGame, '3ds')

    if (character.gamesWiiU.length > 0) {
        character.gamesWiiU.forEach(game => addGame(game, 'wii-u'))
        if (!firstDisplayed) {
            updateUsage(character.games3DS[0])
            firstDisplayed = true
        }
    }
    else addGame(nullGame, 'wii-u')

}

function clearGameList(system) {
    const games = document.getElementById(`game-list-${system}`)
    games.replaceChildren(`${system}`.toUpperCase())
}

function addGame(game, system) {
    const newGameObj = document.createElement('p')
    newGameObj.textContent = game.gameName
    //only add event listeners for valid games
    if (game.gameName.localeCompare('None') != 0) {
        newGameObj.addEventListener('click', updateUsage.bind(null, game))
    }
    document.getElementById(`game-list-${system}`).append(newGameObj)
}
//updates the usage text for the selected game
function updateUsage(game) {
    let usageText = game.amiiboUsage[0].Usage
    usageText = usageText.slice(0, 1).toLowerCase() + usageText.slice(1)
    document.getElementById('amiibo-usage').textContent = `In ${game.gameName}, you can ${usageText}`
}