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
    console.log('We are in ajax');
    $.ajax({
        type: "POST",
        url: "/search/results/market/get/",
        data: {
            'searched_keyword':search_term,
            'csrfmiddlewaretoken': document.getElementsByName('csrfmiddlewaretoken')[0].value
        },
        success: function(json) {
            // Evaluating
            items = eval(json);
            // Setting ikman logo if image is not presented
            items.forEach((ele) => {
                if (ele.fields.img_url){
                    // pass
                }else{
                    ele.fields.img_url = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.licdn.com%2Fdms%2Fimage%2FC4E0BAQFEHA5-o6hnYQ%2Fcompany-logo_200_200%2F0%3Fe%3D2159024400%26v%3Dbeta%26t%3D-1TTUM_Td3re2aEPfYZq0-i03qc1HyzVbRMeMSEflQQ&f=1&nofb=1';
                }
            });
            
            let tempView = ``;
            if(items){
                items.forEach((ele) => {
                    tempView += `
                        <div class="market-item">
                            <img src="${ele.fields.img_url}">
                            <h2>${ele.fields.title}</h2>
                            <p>${ele.fields.content.slice(0, 200)}...</p>
                        </div>
                    `;;
                });
            }else{
                tempView += '<h1>No Items Found!</h1>';
            }
            document.getElementById('result-display').innerHTML = tempView;
        },
    });
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
    window.location.assign('/search/results/market/');
}