//Global Variables
const header = document.querySelector(".header");
const wrap = document.querySelector(".countries-wrap");
const countriesGrid = document.querySelector(".grid");
const singleCountry = document.querySelector(".country");
const backBtn = document.querySelector(".go-back-btn");
const searchBar = document.getElementById("search-bar");
const loader = document.querySelector(".loader");
const countryContainer = document.querySelector(".country-fill");
const navigationBar = document.querySelector(".countries-navigation");
const darkModeBtn = document.querySelector(".header-right");
const clearSearchBtn = document.getElementById("clear-input");
//dropdown and options
const dropdown = document.querySelector(".filter-options");
const dropdownBtn = document.querySelector(".options-btn");
const dropdownOptions = document.querySelectorAll(".filter-options li");

const loadInitialUI = async () => {
  searchBar.value = "";
  try {
    showLoader();
    const fetchData = await fetch("https://restcountries.com/v3.1/all");
    const data = await fetchData.json();
    showDataOnLoad(data);
  } catch (error) {
    console.log(error);
  }
};

const showDataOnLoad = (data) => {
  showLoader();

  let html;
  let gridCard;
  for (let index = 0; index <= 7; index++) {
    const num = Math.floor(Math.random() * 49);
    if (data[num].capital === undefined) continue;

    //destructure variables from objects needed for the grid card.
    const {
      name: { common },
      population,
      region,
      capital: [capital],
      flags: { png },
    } = data[num];

    html = `
          <div class="grid-card">
              <div class="grid-card-top">
                  <img src="${png}" alt="${common}'s flag" />
              </div>
              <div class="grid-card-bottom">
                  <h3>${common}</h3>
              <span class="flex">
                  <h4>Population:</h4>
                  <p>${population.toLocaleString()}</p>
              </span>
              <span class="flex">
                  <h4>Region:</h4>
                  <p>${region}</p>
              </span>
              <span class="flex">
                  <h4>Capital:</h4>
                  <p>${capital}</p>
              </span>
          </div>
      `;

    countriesGrid.insertAdjacentHTML("afterbegin", html);
    gridCard = document.querySelector(".grid-card");
    gridCard.addEventListener("click", () => {
      searchCountry(common);
    });
    hideLoader();
    removeInactiveClass(dropdown, "show");
    removeInactiveClass(countriesGrid, "inactive");
  }
};

//get search by name data
const searchCountry = async (name) => {
  try {
    showLoader();
    putInactiveClass(countriesGrid, "inactive");
    const fetchData = await fetch(
      `https://restcountries.com/v3.1/name/${
        searchBar.value ? searchBar.value : name
      }`
    );
    const data = await fetchData.json();
    showCountry(data);
  } catch (error) {
    console.log(error);
  }
};

let countryHtml;
let bordersArr;
let topDomain;
const showCountry = (countryEntry) => {
  putInactiveClass(countriesGrid, "inactive");
  const [country] = countryEntry;
  const {
    altSpellings,
    name: { common },
    population,
    region,
    subregion,
    capital: [capital],
    borders,
    currencies: { EUR: test },
    flags: { svg },
    languages,
    tld,
    cca3,
  } = country;

  const languagesArr = Object.values(languages);
  if ("borders" in country) bordersArr = Object.values(borders);

  if ("tld" in country) topDomain = Object.values(tld);

  countryHtml = `
              <div class="country-container">
              <div class="country-container-left">
              <img src="${svg}" alt="${common}'s flag">
              </div>
              <div class="country-container-right">
                <h3>${common}</h3>
                  <div>
                    <div>
                      <span class="flex">
                        <h4>Native Name:</h4>
                        <p>${altSpellings[1]}</p>
                      </span>
                      <span class="flex">
                          <h4>Population:</h4>
                          <p>${population}</p>
                        </span>
                      <span class="flex">
                        <h4>Region:</h4>
                        <p>${region}</p>
                      </span>
                      <span class="flex">
                        <h4>Sub Region</h4>
                        <p>${subregion}</p>
                      </span>
                      <span class="flex">
                        <h4>Capital:</h4>
                        <p>${capital}</p>
                      </span>
                    </div>
                  
                  <div class="">
                  <span class="flex">
                  <h4>Top Domain:</h4>
                  ${
                    tld
                      ? topDomain
                          .map((domain) =>
                            `
                    <p>${domain}</p>
                    `.trim()
                          )
                          .join("")
                      : `<p>${common} has no top domains!</p>`
                  }
                  </span>
                  <span class="flex">
                    <h4>Currency:</h4>
                    <p>$</p>
                  </span>
                  <span class="flex">
                    <h4>Languages:</h4>
                    ${languagesArr
                      .map((language) =>
                        `
                    <p>${language}</p>
                    `.trim()
                      )
                      .join(",")}
                  </span>
                  </div>
                </div>
                  <div>
                      <span>
                          <h4>Border Countries:</h4>
                          <div class="borders-wrap">
                  ${
                    borders
                      ? bordersArr
                          .map((border) =>
                            `<p class="borders" data-border="${border}">${border}</p>
                        `.trim()
                          )
                          .join("")
                      : `<p>${common} has no borders!</p>`
                  }
                      </div>
                        </span>
                  </div>
              </div> 
            </div>
  `;

  countryContainer.innerHTML = countryHtml;

  const bordersEl = document.querySelectorAll(".borders");
  bordersEl.forEach((border) => {
    border.addEventListener("click", (e) => {
      e.stopPropagation();
      const searchCountry = e.target.dataset.border;
      countryCodeFetch(searchCountry);
    });
  });

  putInactiveClass(countriesGrid, "inactive");
  putInactiveClass(navigationBar, "inactive");
  removeInactiveClass(singleCountry, "inactive");
  removeInactiveClass(backBtn, "hide");
  hideLoader();
};

//Make cca3 request
const countryCodeFetch = async (code) => {
  const fetchData = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
  const data = await fetchData.json();

  showCountry(data);
};

//Fetch by region function
//API - https://restcountries.com/v3.1/region/{region}
const fetchByRegion = async (region) => {
  try {
    showLoader();
    putInactiveClass(countriesGrid, "inactive");
    countriesGrid.innerHTML = "";
    const fetchRegion = await fetch(
      `https://restcountries.com/v3.1/region/${region}`
    );
    const regionData = await fetchRegion.json();
    showDataOnLoad(regionData);
  } catch (error) {
    console.log(error);
  }
};

const goBack = () => {
  removeInactiveClass(countriesGrid, "inactive");
  removeInactiveClass(navigationBar, "inactive");
  putInactiveClass(singleCountry, "inactive");
};

const displayClearSearch = (e) => {
  const inputVal = e.target.value;
  inputVal
    ? putInactiveClass(clearSearchBtn, "show")
    : removeInactiveClass(clearSearchBtn, "show");

  // if (inputVal === "") removeInactiveClass(clearSearchBtn, "show");
};

const clearSearch = () => {
  searchBar.value = "";
  removeInactiveClass(clearSearchBtn, "show");
};

//Toggle Dark/Light Mode
const btnIcon = document.getElementById("darkmodeBtn");
const toggleMode = () => {
  // putInactiveClass(header, "darkmode");
  // putInactiveClass(navigationBar, "darkmode");
  // putInactiveClass(wrap, "darkmode");
  // putInactiveClass(singleCountry, "darkmode");
  // putInactiveClass(gridCard, "darkmode");
  // console.log(btnIcon);
  // btnIcon.className = "fa-solid fa-brightness";
};

//idea
const putInactiveClass = (element, className) => {
  return element.classList.add(className);
};

const removeInactiveClass = (element, className) => {
  return element.classList.remove(className);
};

//loader functions
const showLoader = () => {
  return loader.classList.remove("hide");
};
const hideLoader = () => {
  return loader.classList.add("hide");
};

//Event Listeners
window.addEventListener("load", loadInitialUI);
searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchCountry();
});
backBtn.addEventListener("click", goBack);
window.addEventListener("load", hideLoader());
darkModeBtn.addEventListener("click", () => {
  console.log(btnIcon.className);
  toggleMode();
});

//Show cross to clear input from text
searchBar.addEventListener("input", displayClearSearch);
clearSearchBtn.addEventListener("click", clearSearch);

//Dropdown with filter options by region
dropdownBtn.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

dropdownOptions.forEach((region) => {
  region.addEventListener("click", (e) => {
    const region = e.target.dataset.region;
    fetchByRegion(region);
  });
});
