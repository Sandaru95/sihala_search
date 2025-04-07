const searchBox = document.getElementById("search-box");

// On Load: Load Searched Value
let search_term = localStorage.getItem("search_term");
searchBox.value = search_term;

/* Function for searching and updating the search results list */
function getSearchResultsAndUpdate(search_term){
    const settings = {
        async: true,
        crossDomain: true,
        url: `https://searx-search-api.p.rapidapi.com/search?q=${search_term}&format=json`,
        method: 'GET',
        headers: {
            'x-rapidapi-key': '14c4d469c4msh1ea868cafe9c788p1546cajsn40fbf288a511',
            'x-rapidapi-host': 'searx-search-api.p.rapidapi.com'
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
    
    $.ajax(settings).done(function (response) {
        if(localStorage['search_response_obj']){
            delete localStorage['search_response_obj'];
        };
        /* Reponse Got For Search Keyword */
        let responseObj = response.results;
        // ====================================== UPDATING ==================================
        let tempView = ``;
        /* Adding New Results One By One */
        responseObj.forEach((element) => {
            tempView += `
                <div class="card card-1 reels">
                    <h3>${element.title}</h3>
                    <a href="${element.url}">${element.url}</a>
                    <p>${element.content.slice(0,500)}</p>
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