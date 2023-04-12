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
//4. display first filter options characters
//5. show the first character's amiibo on the amiibo container
//5.a. update amiibo name and image
//5.b. update amiibo game list (left & right)
//5.c. select first game's usage and display under image
//6. add filter 'change' action event to update characters based on selected game
//7. add game 'click' action event to update amiibo based on selected game
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
//obtain amiibos fetch from https://www.amiiboapi.com/api/amiibo/?type=figure&showusage used to generate db
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
    gameFilter[0].setAttribute('selected', 'true')
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
    console.log(character)
    gameList=[]
    //TODO - clear current game list
    //add new game list and update Amiibo
    document.getElementById('amiibo-image').src=character.image
    document.getElementById('amiibo-name').innerHTML=character.name
    character.games3DS.forEach(game=>addGame(game, '3ds'))
    character.gamesSwitch.forEach(game=>addGame(game, 'switch'))
    character.gamesWiiU.forEach(game=>addGame(game, 'wii-u'))
    //TODO- update initial usage
}
//TODO - add game action events to update "usage"
function addGame(game, system){
    const newGameObj = document.createElement('p')
    newGameObj.innerHTML = game.gameName
    document.getElementById(`game-list-${system}`).append(newGameObj)
}

