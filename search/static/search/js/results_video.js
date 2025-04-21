const searchBox = document.getElementById("search-box");
const APIKey = "AIzaSyCJ3rNUHH8wZwjXrIegsV2hGOI6xn2zWX0";
// On Load: Load Searched Value
let search_term = localStorage.getItem("search_term");
searchBox.value = search_term;

/* Function for searching and updating the search results list */
function getSearchResultsAndUpdate(search_term){
    console.log("we are here");
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${search_term}&key=${APIKey}`,
        method: 'GET',
        headers: {"Accept": "application/json"}
    };
    $.ajax(settings).done(function (response) {
        /* Reponse Got For Search Keyword */
        let responseObj = response.items;
        // console.log(responseObj)
        // ====================================== UPDATING ==================================
        let tempView = ``;
        /* Adding New Results One By One */
        responseObj.forEach((element) => {
            console.log(element);
            tempView += `
                <div class="card card-1 reels yt-vid">
                    <img src="${element['snippet']['thumbnails']['high']['url']}">
                    <h3>${element['snippet']['title']}</h3>
                    <a href="https://www.youtube.com/watch?v=${element['id']['videoId']}">https://www.youtube.com/watch?v=${element['id']['videoId']}z</a>
                    <p>${element['snippet']['description']}</p>
                </div>
            `;
        });
        document.getElementById('results-section').innerHTML = tempView;
        // ====================================END OF UPDATE ==================================
    });
};
getSearchResultsAndUpdate(search_term);
function backToHome(){
    window.location.assign("/search/");
};