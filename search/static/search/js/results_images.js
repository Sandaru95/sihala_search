// =================================== Navigations ======================================
function navigateToHome(){
    window.location.assign('/search/');
};

// ===================================== GENERAL =========================================
// Enter URL return Response
function httpGet(theUrl, headerValues = [])
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    if(headerValues.length > 0 ){
        xmlHttp.setRequestHeader(headerValues[0], headerValues[1])
    }
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
/* Function for searching and updating the search results list */
function getSearchResultsAndUpdate(search_term){
    let encodedSearchTerm = search_term.replace(' ', '+');
    /* Item Bucket */
    let items = [];


    /* Pixa Bay */
    let jsonReturnThingPixa = JSON.parse(httpGet(`https://pixabay.com/api/?key=14525907-fd2a94548f93e1e8bafd74a90&q=${encodedSearchTerm}&image_type=photo`));
    for(let e = 0; e < jsonReturnThingPixa.hits.length; e++){
        items.push(jsonReturnThingPixa.hits[e].largeImageURL)
    };
    /* Unsplash */
    let jsonReturnThingUnsplash = JSON.parse(httpGet(`https://api.unsplash.com/search/photos?page=1&query=${encodedSearchTerm}&client_id=2fc8432457cbbdf53e00cdac81baf8980f700d1fdc4454cb803868e8773da382`)).results;
    for(let e = 0; e < jsonReturnThingUnsplash.length; e++){
        items.push(jsonReturnThingUnsplash[e].links.download)
    };
    /* Pixels */
    let jsonReturnThingPixels = JSON.parse(httpGet(`https://api.pexels.com/v1/search?query=${encodedSearchTerm}&per_page=15&page=1`, ['Authorization', '563492ad6f917000010000017ab5379219d04fd2af6ef9c94e936970'])).photos;
    for(let e = 0; e < jsonReturnThingPixels.length; e++){
        items.push(jsonReturnThingPixels[e].src.medium)
    };


    items = items.slice(0, 36);

    /* View Stuff */
    let tempView = ``;
    items.forEach((ele) => {
        tempView += `
            <div class="image-item" onclick="window.location.assign('${ele}')">
                <img src="${ele}">
            </div>
        `;
    });
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
    window.location.assign('/search/results/images/');
}