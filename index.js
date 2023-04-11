console.log(`for more information about data drawn from this page, see https://www.amiiboapi.com/docs/`)
const gameFilter = document.getElementById('sidebar').querySelector('select');
const fetchGameSeriesURL = `https://www.amiiboapi.com/api/gameseries`
/*removing elements example
while(gameFilter.length>0){
    gameFilter.removeChild(gameFilter.firstElementChild)
}
*/
//1. generate amiibo object list
//2. generate filter options
//3. set first filter option to selected
//4. display first filter options characters
//5. show the first character's amiibo on the amiibo container
//5.a. update amiibo name and image
//5.b. update amiibo game list (left & right)
//5.c. select first game's usage and display under image
//6. add filter 'change' action event to update characters based on selected game
//7. add game 'click' action event to update amiibo based on selected game
//8. stretch: add 'hover' action to rotate/wiggle amiibo when hovered
fetch(fetchGameSeriesURL).then(resp=>resp.json()).then(seriesList=>{
    //generate filter options
    const series = []
    for (item of seriesList.amiibo){
        //only adds new names
        if (series.indexOf(item.name)===-1){
            series.push(item.name)
            const optionElement = document.createElement('option')
            if(series.length===1) optionElement.setAttribute('selected','true')
            optionElement.innerHTML=item.name
            optionElement.value=item.name
            gameFilter.append(optionElement)
        }
    }
    
})
