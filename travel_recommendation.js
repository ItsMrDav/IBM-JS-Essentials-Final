"strict mode";
/* *********************************************************************************/
/* **************************       DOM ELEMENTS    ********************************/
/* *********************************************************************************/
const searchInput = document.querySelector(`#search-input`);
const searchButton = document.querySelector(`#search-button`);
const searchClean = document.querySelector(`#search-clean`);
const resultsContainer = document.querySelector(`#results-container`);

/* *********************************************************************************/
/* **************************       FETCH DATA      ********************************/
/* *********************************************************************************/
let travelData;

async function fetchData() {
  try {
    const response = await fetch("travel_recommendation.api.json");
    const data = await response.json();
    travelData = data;
    console.log(travelData);
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
}
fetchData();

/* *********************************************************************************/
/* **************************     SEARCH FUNCTION   ********************************/
/* *********************************************************************************/
// Set up event listener for search button
searchButton.addEventListener(`click`, (e) => {
  e.preventDefault();
  performSearch();
});

// Main search function
function performSearch() {
  // Clear previous results
  resultsContainer.innerHTML = ``;

  // Get search term and convert to lowercase
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Exit if search term is empty
  if (!searchTerm) return;

  let results = [];

  // Check if the search term is related to countries
  if (searchTerm.includes(`country`) || searchTerm.includes(`countries`)) {
    // Add all countries to results
    travelData.countries.forEach((country) => {
      results.push({
        type: `country`,
        name: country.name,
        imageUrl: country.cities[0]?.imageUrl || ``,
        description: country.cities[0]?.description,
      });
    });
  }

  // Check if the search term is related to temples
  if (searchTerm.includes(`temple`) || searchTerm.includes(`temples`)) {
    // Add all temples to results
    travelData.temples.forEach((temple) => {
      results.push({
        type: `temple`,
        name: temple.name,
        imageUrl: temple.imageUrl,
        description: temple.description,
      });
    });
  }
  // Check if the search term is related to beaches
  if (searchTerm.includes(`beach`) || searchTerm.includes(`beaches`)) {
    // Add all beaches to results
    travelData.beaches.forEach((beach) => {
      results.push({
        type: `beach`,
        name: beach.name,
        imageUrl: beach.imageUrl,
        description: beach.description,
      });
    });
  }
  displayResults(results);
}

/* *********************************************************************************/
/* **************************     RESULT FUNCTION   ********************************/
/* *********************************************************************************/

function displayResults(results) {
  if (results.length === 0) {
    resultsContainer.innerHTML = `<p class="no-results">No results found. Try a different search term.</p>`;
    return;
  }

  // Create a results wrapper
  const resultsWrapper = document.createElement(`div`);
  resultsWrapper.className = `results-wrapper`;

  // Add results to the wrapper
  results.forEach((item) => {
    const resultCard = document.createElement(`div`);
    resultCard.className = `result-card`;

    resultCard.innerHTML = `
        <div class="result-image">
            <img src="${item.imageUrl}" alt="${item.name}">
        </div>
        <div class="result-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        </div>
    `;
    resultsWrapper.appendChild(resultCard);
  });

  // Add the wrapper to the results container
  resultsContainer.appendChild(resultsWrapper);
}

// Load data when the page loads
document.addEventListener(`DOMContentLoaded`, fetchData);

// Clear button
searchClean.addEventListener(`click`, () => {
  searchInput.value = ``;
});
