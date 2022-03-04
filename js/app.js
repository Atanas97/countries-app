const loadInitialUI = async () => {
  const fetchData = await fetch("https://restcountries.com/v3.1/all");
  const data = await fetchData.json();

  showDataOnLoad(data);
};

const countriesGrid = document.querySelector(".grid");
const singleCountry = document.querySelector(".country");
const showDataOnLoad = (data) => {
  let html;
  for (let index = 0; index <= 7; index++) {
    const num = Math.floor(Math.random() * 250);

    //destructure variables from objects needed for the grid card.
    const {
      name: { common },
      population,
      region,
      capital: [capital],
      flags: { png },
      cca2,
      cca3,
      ccn3,
    } = data[num];
    // console.log(cca2, cca3, ccn3);
    html = `
        <div class="grid-card" onclick=showMoreDetails()>
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
    countriesGrid.insertAdjacentHTML("afterbegin", html);
  }
};

window.addEventListener("load", loadInitialUI);

const backBtn = document.querySelector(".go-back");
const showMoreDetails = (e) => {
  // countriesGrid.style.display = "none";
  putInactiveClass(countriesGrid);
};

//get search by name data
const searchBar = document.getElementById("search-bar");

const searchCountry = async () => {
  const fetchData = await fetch(
    `https://restcountries.com/v3.1/name/${searchBar.value}`
  );
  const data = await fetchData.json();

  showCountry(data);
};

let countryHtml;
const countryContainer = document.querySelector(".country-fill");
const showCountry = (countryEntry) => {
  const [country] = countryEntry;
  console.log(country);
  const {
    altSpellings,
    name: { common },
    population,
    region,
    subregion,
    capital: [capital],
    borders,
    currencies: { EUR: test },
    flags: { png },
    languages,
    tld,
  } = country;
  console.log(
    population,
    region,
    subregion,
    capital,
    borders,
    test,
    languages,
    tld
  );
  const languagesArr = Object.values(languages);
  const bordersArr = Object.values(borders);

  //mapping languages to show them all

  //   for (const language in languages) {
  //     console.log(language);
  //   }
  countryHtml = `
    <div class="country-container">
        <div class="country-container-left">
            <img src="${png}" alt="${common}'s flag">
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
                    ${tld
                      .map((domain) =>
                        `
                      <p class="flex">${domain}</p>
                      `.trim()
                      )
                      .join("")}
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
                    <p class="flex">${language}</p>
                    `.trim()
                      )
                      .join(",")}
                    </span>
            </div>
            <div class="country-container-right-col">
                <span class="flex">
                    <h4>Border Countries:</h4>
                        <div class="borders-wrap">
                        ${
                          borders
                            ? bordersArr
                                .map((border) =>
                                  `<p class="borders">${border}</p>
                              `.trim()
                                )
                                .join(",")
                            : `<p>${common} has no borders!</p>`
                        }
                            </div>
                    </span>
            </div>
        </div>
    </div>
  `;

  countryContainer.innerHTML = countryHtml;
};
searchCountry();

const goBack = () => {
  // countriesGrid.style.display = "grid";
  // singleCountry.style.display = "none";

  removeInactiveClass(countriesGrid);
  putInactiveClass(singleCountry);
};

//idea
const putInactiveClass = (element) => {
  return element.classList.add("inactive");
};
const removeInactiveClass = (element) => {
  return element.classList.remove("inactive");
};

//Event Listeners
searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchCountry();
});
backBtn.addEventListener("click", goBack);
