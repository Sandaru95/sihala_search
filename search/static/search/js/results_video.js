// =================================== Navigations ======================================
function navigateToHome(){
    window.location.assign('/search/');
};

// ===================================== GENERAL =========================================
// Enter URL return Response
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
/* Function for searching and updating the search results list */
function getSearchResultsAndUpdate(search_term){
    let encodedSearchTerm = search_term.replace(' ', '%20');
    let items = JSON.parse(httpGet(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=36&q=${encodedSearchTerm}&type=video&key=AIzaSyBLZIk976tGlmH-szspLZ5jugnVtEw9o6M`)).items;
    console.log(items);
    let tempView = ``;
    if(items){
        items.forEach((ele) => {
            tempView += `
                <div class="video-item" onclick="window.location.assign('https://www.youtube.com/watch?v=${ele['id']['videoId']}')">
                    <img src="${ele['snippet']['thumbnails']['medium'].url}">
                    <h3>${ele['snippet'].title}</h3>
                    <p>${ele['snippet'].channelTitle}</p>
                </div>
            `;;
        });
    }else{
        tempView += '<h1>No Videos Found!</h1>';
    }
    document.getElementById('result-display').innerHTML = tempView;
    // ====================================END OF UPDATE ==================================
};
// ==================================== ONLOAD FUNCTION =======================================
/* Results page Onload function */
getSearchResultsAndUpdate(localStorage['search_term']);
/* Extra Things */
function updateSearchBoxText(){
    document.title = `${localStorage['search_term']} සඳහා රිසාල්ට්ස්`;
    document.getElementById('search-box-input').value = localStorage['search_term'];
}

// ======================================= END OF ============================================
// ===========================================================================================

/* ========================================= EVENT LISTNERS =================================== */
/* Event Listner */
document.addEventListener('keypress', (e) => {
    /* Searching On Enter */
    if(e.key == 'Enter'){
        searchSubmission();
    };
});

/* ============================================== SEARCH ======================================== */
/* The Search Submission */
function searchSubmission(){
    localStorage['search_term'] = document.getElementById('search-box-input').value;
    window.location.assign('/search/results/videos/');
}