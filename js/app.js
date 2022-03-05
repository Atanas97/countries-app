//Global Variables
const countriesGrid = document.querySelector(".grid");
const singleCountry = document.querySelector(".country");
const backBtn = document.querySelector(".go-back-btn");
const searchBar = document.getElementById("search-bar");
const loader = document.querySelector(".loader");
const countryContainer = document.querySelector(".country-fill");
const navigationBar = document.querySelector(".countries-navigation");
const darkModeBtn = document.querySelector(".header-right");

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
  if (data) {
    let html;
    for (let index = 0; index <= 7; index++) {
      const num = Math.floor(Math.random() * 250);
      if (data[num].capital === undefined) continue;
      //destructure variables from objects needed for the grid card.
      const {
        name: { common },
        population,
        region,
        capital: [capital],
        flags: { png },
        // cca2,
        // cca3,
        // ccn3,
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
                <p>${population}</p>
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
      //

      countriesGrid.insertAdjacentHTML("afterbegin", html);
      const gridCard = document.querySelector(".grid-card");
      gridCard.addEventListener("click", () => {
        searchCountry(common);
      });
      hideLoader();
    }
  }
};

//get search by name data
const searchCountry = async (name) => {
  try {
    showLoader();
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
            <div class="country-container-right-col">
                <h3>${common}</h3>
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
            <div class="country-container-right-col">
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
            <div class="country-container-right-col"> 
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

const goBack = () => {
  removeInactiveClass(countriesGrid, "inactive");
  removeInactiveClass(navigationBar, "inactive");
  putInactiveClass(singleCountry, "inactive");
};

const toggleMode = () => {};

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
darkModeBtn.addEventListener("click", toggleMode);
