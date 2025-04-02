const currencyP = document.getElementById("exchange-rate-p");
const populationP = document.getElementById("population-p");
const weatherTempP = document.getElementById("weather-p-temp");
const weatherWindP = document.getElementById("weather-p-wind");
const weatherRainChanceP = document.getElementById("weather-p-rainchance");
const weatherImage = document.getElementById("weather-img");

// On Load: Weather
$.ajax({
    url : 'http://api.weatherapi.com/v1/current.json?key=b46eb6f6b632482fb76174416250204&q=Sri Lanka&aqi=no',
    method: 'GET',
    success: function(response) {
        // Temperature and Wind Speed Handled Here
        weatherTempP.innerHTML = Math.floor(response["current"]["temp_c"]);
        weatherWindP.innerHTML = response["current"]["wind_kph"];
        // Weather Image handled here
        if(response["current"]["is_day"]){
            weatherImage.innerHTML = "";
        }else{
            weatherImage.innerHTML = `<img src="https://png.pngtree.com/png-vector/20190507/ourmid/pngtree-vector-moon-icon-png-image_1024711.jpg" alt="Weather by Sri Lanka">`;
        }
        console.log(response);
    },
    error: function(xhr, status, error) {
        // Handle errors here
        console.error(status, error);
    }
});
// On Load: Weather - Chance of Rain
$.ajax({
    url : 'http://api.weatherapi.com/v1/forecast.json?key=b46eb6f6b632482fb76174416250204&q=Sri Lanka&days=1&aqi=no&alerts=no',
    method: 'GET',
    success: function(response) {
        weatherRainChanceP.innerHTML = response["forecast"]["forecastday"]["0"]["day"]["daily_chance_of_rain"];
    },
    error: function(xhr, status, error) {
        // Handle errors here
        console.error(status, error);
    }
});
// On Load: Currency Rates
$.ajax({
    url : 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    method: 'GET',
    success: function(response) {
        // Handle the API response here
        currencyP.innerHTML = Math.floor(response['usd']['lkr']);
        
    },
    error: function(xhr, status, error) {
        // Handle errors here
        console.error(status, error);
    }
});
// On Load: Population Update
$.ajax({
    url : 'https://d6wn6bmjj722w.population.io:443/1.0/population/Sri%20Lanka/today-and-tomorrow/',
    method: 'GET',
    success: function(response) {
        // Handle the API response here
        populationP.innerHTML = response['total_population'][0]['population'];
        
    },
    error: function(xhr, status, error) {
        // Handle errors here
        console.error(status, error);
    }
});
// ===================================== GENERAL =========================================
function getSearchResults(search_term){
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://faroo-faroo-web-search.p.rapidapi.com/api?q=${search_term}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "faroo-faroo-web-search.p.rapidapi.com",
            "x-rapidapi-key": "ab045ea05emsh499f266fee90a9dp146e28jsn3a4cfc349f00"
        }
    }
    
    $.ajax(settings).done(function (response) {
        if(localStorage['search_response_obj']){
            delete localStorage['search_response_obj'];
        };
        localStorage.setItem('search_response_obj', JSON.stringify(response.results));
        window.location.assign('/search/results/');
    });
};

/* Event Listner For Enter */
document.addEventListener('keypress', (e) => {
    /* Searching On Enter */
    if(e.key == 'Enter'){
        searchSubmission();
    };
});

/* The Search Button */
function searchSubmission(){
    localStorage['search_term'] = document.getElementById('search-box-input').value;
    localStorage.setItem('search_term', document.getElementById('search-box-input').value);
    window.location.assign('/search/results/');
}

/* Language Changer Button */
function languageChange(checkbox){
    if(checkbox.checked){
        localStorage.setItem('sinhalen', 1);
    }else{
        localStorage.setItem('sinhalen', 0);
    }
}
/* Updating Some Extra Things */
function updateExtra(){
    if(localStorage['sinhalen'] == 1){
        document.getElementById('lang-checkbox').checked = true;
    }
}

/* On Load Section */
document.getElementById('search-box-input').focus();

/* ===================================== UNLOADED PART ================================== */
window.onscroll = function() {
    let pageHeight=document.documentElement.offsetHeight,
    windowHeight=window.innerHeight,
    scrollPosition=window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

    


    if (pageHeight <= windowHeight+scrollPosition) {
        document.getElementById('hot-news-section').style.display = 'block';
    }
};