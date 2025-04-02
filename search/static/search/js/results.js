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
        /* LANG ============= SINHALA */
        if(localStorage['sinhalen'] == 1){

            /* Translating Each Titles and Paragraphs */
            for(let i = 0; i < responseObj.length; i++){
                responseObj[i].titleSinhala = JSON.parse(httpGet(`https://translation.googleapis.com/language/translate/v2?target=si&key=AIzaSyCKEIom1asit_GetiD5jncOxYOSmYvDIBE&q=${responseObj[i].title}`)).data.translations[0].translatedText;
                responseObj[i].kwicSinhala = JSON.parse(httpGet(`https://translation.googleapis.com/language/translate/v2?target=si&key=AIzaSyCKEIom1asit_GetiD5jncOxYOSmYvDIBE&q=${responseObj[i].kwic}`)).data.translations[0].translatedText;
            };
            /* Updating To New Results */
            responseObj.forEach((element) => {
                tempView += `
                    <div class="result-item" onclick="window.location.assign('${element.url}')">
                        <h1>${element.titleSinhala}</h1>
                        <h3>${element.url}</h3>
                        <p>${element.kwicSinhala}</p>
                    </div>
                `;
            });
            document.getElementById('result-display').innerHTML = tempView;
        }else{
            /* LANG ============= ENGLISH */

            /* Adding New Results One By One */
            responseObj.forEach((element) => {
                tempView += `
                    <div class="result-item" onclick="window.location.assign('${element.url}')">
                        <h1>${element.title}</h1>
                        <h3>${element.url}</h3>
                        <p>${element.kwic}</p>
                    </div>
                `;
            });
            document.getElementById('result-display').innerHTML = tempView;
        };
        // ====================================END OF UPDATE ==================================
    });
};
// ==================================== ONLOAD FUNCTION =======================================
/* Results page Onload function */
getSearchResultsAndUpdate(localStorage['search_term']);
/* Asides Onload Functions */
updateAsideYtSection();
updateAsideMarketSection();
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
    window.location.assign('/search/results/');
}

/* ======================================= ASIDE FUNCTIONS ================================== */
function updateAsideYtSection(){
    let encodedSearchTerm = localStorage['search_term'].replace(' ', '%20');
    let items = JSON.parse(httpGet(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodedSearchTerm}&type=video&key=AIzaSyBLZIk976tGlmH-szspLZ5jugnVtEw9o6M`)).items;
    let tempView = `
        <p id="result-aside-yt-topic">වීඩියෝ</p>
    `;
    if(items){
        items.forEach((ele) => {
            tempView += `
                <div class="result-aside-yt-item" onclick="window.location.assign('https://www.youtube.com/watch?v=${ele['id']['videoId']}')">
                    <img src="${ele['snippet']['thumbnails']['medium'].url}">
                    <p>${ele['snippet'].title}</p>
                </div>
            `;;
        });
    }else{
        tempView += `<p></p>`;
    }
    tempView += `
        <a href="https://www.youtube.com/results?search_query=${localStorage['search_term']}">තවත්</a>
    `;
    document.getElementById('result-aside-yt').innerHTML = tempView;
}
function updateAsideMarketSection(){
    $.ajax({
        type: "POST",
        url: "/search/results/market/get/",
        data: {
            'searched_keyword':localStorage['search_term'],
            'csrfmiddlewaretoken': document.getElementsByName('csrfmiddlewaretoken')[0].value
        },
        success: function(json) {
            console.log(json);
            // Evaluating
            items = (eval(json)).slice(1, 5);
            // Setting ikman logo if image is not presented
            items.forEach((ele) => {
                if (ele.fields.img_url){
                    // pass
                }else{
                    ele.fields.img_url = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.licdn.com%2Fdms%2Fimage%2FC4E0BAQFEHA5-o6hnYQ%2Fcompany-logo_200_200%2F0%3Fe%3D2159024400%26v%3Dbeta%26t%3D-1TTUM_Td3re2aEPfYZq0-i03qc1HyzVbRMeMSEflQQ&f=1&nofb=1';
                }
            });
            
            let tempView = `<p id="result-aside-market-topic">වෙළදපොළ</p>`;
            if(items){
                items.forEach((ele) => {
                    tempView += `
                        <div class="result-aside-market-item">
                            <img src="${ele.fields.img_url}">
                            <p>${ele.fields.title}</p>
                        </div>
                    `;;
                });
            }else{
                tempView += '<h1>No Items Found!</h1>';
            }
            tempView += `
                <a href="#">තවත්</a>
            `;
            document.getElementById('result-aside-market').innerHTML = tempView;
        },
    });
};
function updateAsideStackOverFlowSection(){
    let encodedSearchTerm = localStorage['search_term'].replace(' ', '%20');
    let items = JSON.parse(httpGet(`https://api.stackexchange.com//2.2/search?page=10&pagesize=10&order=desc&sort=activity&intitle=python&site=stackoverflow`));
    console.log(items);
    let tempView = `
        <p id="result-aside-yt-topic">වීඩියෝ</p>
    `;
    if(items){
        items.forEach((ele) => {
            tempView += `
                <div class="result-aside-yt-item" onclick="window.location.assign('https://www.youtube.com/watch?v=${ele['id']['videoId']}')">
                    <img src="${ele['snippet']['thumbnails']['medium'].url}">
                    <p>${ele['snippet'].title}</p>
                </div>
            `;;
        });
    }else{
        tempView += `<p></p>`;
    }
    tempView += `
        <a href="https://www.youtube.com/results?search_query=${localStorage['search_term']}">තවත්</a>
    `;
    document.getElementById('result-aside-yt').innerHTML = tempView;
}