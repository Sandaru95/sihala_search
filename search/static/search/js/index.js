const currencyP = document.getElementById("exchange-rate-p");
const populationP = document.getElementById("population-p");
const weatherTempP = document.getElementById("weather-p-temp");
const searchBox = document.getElementById("search-box");
const recentSearchSpan = document.getElementById("recent-search-span");
const newsCol1 = document.getElementById("news-col-1");

// General functions: navigateTo
function navigateTo(url){
    window.location.assign(url);
};

// On Load: Currency Rates
$.ajax({
    url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    method: 'GET',
    success: function (response) {
        // Handle the API response here
        currencyP.innerHTML = Math.floor(response['usd']['lkr']);

    },
    error: function (xhr, status, error) {
        // Handle errors here
        console.error(status, error);
    }
});
// On Load: Population Update
$.ajax({
    url: 'https://d6wn6bmjj722w.population.io:443/1.0/population/Sri%20Lanka/today-and-tomorrow/',
    method: 'GET',
    success: function (response) {
        let pop = response['total_population'][0]['population'];
        pop = Number(String(pop).slice(0, 4)) / 100;
        // Handle the API response here
        populationP.innerHTML = pop;

    },
    error: function (xhr, status, error) {
        // Handle errors here
        console.error(status, error);
    }
});
// On Load: Set Values of Recent Searches
const lSKeys = Object.keys(localStorage);
let lSSearchValues = [];
for (key of lSKeys) {
    if (key[0] == "_") {
        lSSearchValues.push(localStorage.getItem(key));
    };
};
lSSearchValues = lSSearchValues.slice(0, 5);
let inner = "";
for (value of lSSearchValues) {
    inner += `  <div class="recent-item d-flex align-items-center">
                    <i class="bi bi-clock-history me-2"></i>
                    <span>${value}</span>
                </div>`;
};
recentSearchSpan.innerHTML = inner;
// On Load: News
fetch('https://cors-anywhere.herokuapp.com/https://sinhala.adaderana.lk/sinhala-hot-news.php', {
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
})
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text(); // Because HTML is text
    })
    .then(html => {
        // Do something with the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Now you can query elements by class
        let tempHTML = ""
        const elements = doc.querySelectorAll('.news-story');
        for (let ele of elements) {
            tempHTML += `
                <div class="card" style="width:30%;">
                    <img src="${ele.getElementsByTagName("img")[0].src.replace("150", "600").replace("-s.jpg", "-l.jpg").replace("-S.jpg", "-L.jpg")}">
                    <p style="font-weight: bolder;">${ele.getElementsByTagName("p")[0].innerHTML.slice(0, 70)}</p>
                </div>
            `;
        };
        for (let ele of elements) {
            const img = new Image();
            img.src = `${ele.getElementsByTagName("img")[0].src.replace("150", "600").replace("-s.jpg", "-l.jpg").replace("-S.jpg", "-L.jpg")}`;
            img.onerror = function () {
                const images = document.querySelectorAll('img'); // Get all <img> elements
                for (let i of images) {
                    if (i.src === img.src) {
                        i.parentElement.remove();
                    }
                }
            };
        };
        newsCol1.innerHTML = tempHTML;
    })
    .catch(error => console.error('Fetch error:', error));
/* ============================================== SEARCH ======================================== */
/* The Search Submission */
function searchSubmission(){
    localStorage['search_term'] = document.getElementById('search-box').value;
    window.location.assign('/search/results/');
}
// On Enter: Search Box Searches
searchBox.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (searchBox.value) {
            localStorage.setItem(`_${searchBox.value}`, searchBox.value);
            localStorage.setItem('search_term', searchBox.value);
            searchSubmission();
        };
    }
});