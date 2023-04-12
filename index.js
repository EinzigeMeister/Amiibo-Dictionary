console.log(`for more information about data drawn from this page, see https://www.amiiboapi.com/docs/`)
const gameFilter = document.getElementById('sidebar').querySelector('select');
const characterList = document.getElementById('character-list')
const fetchGameSeriesURL = `https://www.amiiboapi.com/api/gameseries`
let amiiboLib = []
let filteredCharacters = []
let gameList = []
/*removing elements example
while(gameFilter.length>0){
    gameFilter.removeChild(gameFilter.firstElementChild)
}
*/
//1. generate amiibo object list (COMPLETE)
//2. generate filter options (COMPLETE)
//3. set first filter option to selected (COMPLETE)
//4. display first filter options characters (COMPLETE)
//5. show the first character's amiibo on the amiibo container (COMPLETE)
//5.a. update amiibo name and image (COMPLETE)
//5.b. update amiibo game list (COMPLETE)
//5.c. select first game's usage and display under image (COMPLETE)
//6. add filter 'change' action event to update characters based on selected game
//7. add game 'click' action event to update amiibo based on selected game (COMPLETE)
//8. stretch: add 'hover' action to rotate/wiggle amiibo when hovered (COMPLETE)

//commented out API call & manually added options to minimize usage during development
// fetch(fetchGameSeriesURL).then(resp=>resp.json()).then(seriesList=>{
//     //generate filter options
//     const series = []
//     for (item of seriesList.amiibo){
//         //only adds new names
//          if (series.indexOf(item.name)===-1){
//             series.push(item.name)
//          } 
//     }
//     series.sort()
//     for (game of series){ //displays sorted filter
//         const optionElement = document.createElement('option')
//         optionElement.innerHTML=item.name
//         optionElement.value=item.name
//         gameFilter.append(optionElement) 
//     }
// })

//Filter characters based off gameseries
const gameOptionNodes = document.querySelectorAll('option')
const gameOptions =[]
gameOptionNodes.forEach(option=>gameOptions.push(option.value))
 gameOptions.sort();
 clearGameFilter();
 refreshGameFilter();
//obtain amiibos. The fetch from https://www.amiiboapi.com/api/amiibo/?type=figure&showusage was used to generate local db
fetch("http://localhost:3000/amiibo").then(resp=>resp.json()).then(amiiboObjs=>{
    amiiboLib=amiiboObjs
    refreshCharacterList()
})



//Helper functions
function clearGameFilter(){
    while(gameFilter.length>0){
        gameFilter.removeChild(gameFilter.firstElementChild)
    }
}
//add action event for 'change' to refresh character list
function refreshGameFilter(){
    gameOptions.forEach(option=>{
        const newOption = document.createElement('option')
        newOption.innerHTML = option
        newOption.value = option
        gameFilter.append(newOption)
    })
    gameFilter[1].setAttribute('selected', 'true')
}

function clearCharacterList(){
    while(characterList.length>0){
        characterList.removeChild(characterList.firstElementChild)
    }
}
//add action event for button 'click' to change selected Amiibo
function refreshCharacterList(){
    filteredCharacters = amiiboLib.filter(amiibo=>{
        //insert logic here check each amiibo's gameSeries element against the selected filter 
        if(amiibo.gameSeries===gameFilter.value)  return true
        else return false
    })
    filteredCharacters.sort((a, b) => a.name.localeCompare(b.name))
    filteredCharacters.forEach(character=>{
        const characterLi = document.createElement('li')
        const characterButton = document.createElement('button')
        characterButton.innerHTML = character.name
        //characterButton.setAttribute('class', 'character-list')
        characterLi.append(characterButton)
        characterList.append(characterLi)
    })
    resetSelectedAmiibo(filteredCharacters[0])
}
function resetSelectedAmiibo(character){
    //TODO - clear current game list
    //add new game list and update Amiibo
    nullGame = {
        gameName: 'None',
        amiiboUsage: {
            usage:'No game selected. Select a game to show usage'
        }
    }
    document.getElementById('amiibo-image').src=character.image
    document.getElementById('amiibo-name').innerHTML=character.name
    firstDisplayed = false

    if(character.gamesSwitch.length>0){
        character.gamesSwitch.forEach(game=>addGame(game, 'switch'))
        updateUsage(character.gamesSwitch[0])
        firstDisplayed = true
    }
    else addGame(nullGame, 'switch')

    if(character.games3DS.length>0){
        character.games3DS.forEach(game=>addGame(game, '3ds'))
        if(!firstDisplayed){
           updateUsage(character.games3DS[0])
           firstDisplayed = true
        }
    }
    else addGame(nullGame, '3ds')

    if(character.gamesWiiU.length>0){
        character.gamesWiiU.forEach(game=>addGame(game, 'wii-u'))
        if(!firstDisplayed){
            updateUsage(character.games3DS[0])
            firstDisplayed = true
         }
    }
    else addGame(nullGame, 'wii-u')
    
}
function addGame(game, system){
    const newGameObj = document.createElement('p')
    newGameObj.innerHTML = game.gameName
    //only add event listeners for valid games
    if(game.gameName.localeCompare('None')!=0){
        newGameObj.addEventListener('click', updateUsage.bind(null, game))
    }
    document.getElementById(`game-list-${system}`).append(newGameObj)
}
//updates the usage text for the selected game
function updateUsage(game){
    let usageText = game.amiiboUsage[0].Usage
    usageText = usageText.slice(0,1).toLowerCase() + usageText.slice(1)
    document.getElementById('amiibo-usage').innerHTML= `In ${game.gameName}, you can ${usageText}`
}
