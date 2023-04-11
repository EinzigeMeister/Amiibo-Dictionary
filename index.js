console.log(`for more information about data drawn from this page, see https://www.amiiboapi.com/docs/`)
const gameFilter = document.getElementById('sidebar').querySelector('select');
const fetchGameSeriesURL = `https://www.amiiboapi.com/api/gameseries`
/*removing elements example
while(gameFilter.length>0){
    gameFilter.removeChild(gameFilter.firstElementChild)
}
*/
fetch(fetchGameSeriesURL).then(resp=>resp.json()).then(seriesList=>{
    //generate filter options
    const series = []
    for (item of seriesList.amiibo){
        //only adds new names
        if (series.indexOf(item.name)==-1){
            series.push(item.name)
            const optionElement = document.createElement('option')
            optionElement.innerHTML=item.name
            optionElement.value=item.name
            gameFilter.append(optionElement)
        }
    }
})