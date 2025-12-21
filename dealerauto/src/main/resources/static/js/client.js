const allCarsPromise = fetch("/client/all").then(r => r.json());


document.addEventListener("DOMContentLoaded",async () => {

    const container = document.getElementById("lista");
    const loadMoreBtn = document.getElementById("loadMore");


    const brandsContainer = document.getElementById("brandsContainer");
// load brands dynamically
    fetch("/client/brands")
        .then(r => r.json())
        .then(brands => {
            brands.forEach(brand => {
                brandsContainer.innerHTML += `
              <label class="brand-option">
                  <input type="checkbox" value="${brand}">
                  ${brand}
              </label>
          `;
            });
        });




    let visible = 0;

    // Așteptăm rezultatul — DAR request-ul a început deja înainte!
    const allCars = await allCarsPromise;

    // înainte de filtre → lista filtrată = toată lista
    filteredCars = [...allCars];


    // ----------------------------------------------------
    // Funcție care afișează următoarele 5 mașini
    // ----------------------------------------------------
    function showMore() {
        const nextCars = filteredCars.slice(visible, visible + 5);

        nextCars.forEach(m => {
            container.innerHTML += `
                <div class="car-box">
                    <p><b>Brand:</b> ${m.marca}</p>
                    <p><b>Model:</b> ${m.model}</p>
                    <p><b>Year:</b> ${m.an}</p>
                    <p><b>Mileage:</b> ${m.kilometraj} km</p>
                    <p><b>Price:</b> ${m.pret} €</p>
                </div>
            `;
        });

        visible += nextCars.length;

    }

    // ----------------------------------------------------
    // 1. AFIȘĂM AUTOMAT primele 5 la încărcarea paginii
    // ----------------------------------------------------
    showMore();
    loadMoreBtn.style.visibility = "visible";

    document.querySelector(".back-btn").style.visibility = "visible";
    // ----------------------------------------------------
    // 2. Când se apasă Load More
    // ----------------------------------------------------
    loadMoreBtn.addEventListener("click", () => {

        // 1. Dacă nu mai sunt mașini de afișat → nu afișăm spinner
        if (visible >= filteredCars.length) {

            if (filtersActive) {
                loadMoreBtn.innerText = "No more results for these filters";
            } else {
                loadMoreBtn.innerText = "No more offers";
            }

            loadMoreBtn.disabled = true;
            return;
        }

        // 2. Dacă mai sunt mașini → punem spinner
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner spin-icon"></i>';

        // 3. Delay vizual
        setTimeout(() => {

            // afișăm următoarele 5
            showMore();

            // 4. Dacă încă mai sunt mașini rămase
            if (visible < filteredCars.length) {
                loadMoreBtn.innerText = "Load More Offers";
                loadMoreBtn.disabled = false;
            }
            // 5. Dacă S-AU TERMINAT mașinile filtrate
            else {

                if (filtersActive) {
                    loadMoreBtn.innerText = "No more results for these filters";
                } else {
                    loadMoreBtn.innerText = "No more offers";
                }

                loadMoreBtn.disabled = true;
            }

        }, 500);
    });



    const sortBtn = document.getElementById("sortBtn");
    const sortFieldSelect = document.getElementById("sortField");
    const sortOrderSelect = document.getElementById("sortOrder");

    sortBtn.addEventListener("click", () => {

        const field = sortFieldSelect.value;
        const order = sortOrderSelect.value; // "cresc" sau "desc"

        // 1. sortăm întreaga listă
        filteredCars.sort((a, b) => {
            let valA = a[field];
            let valB = b[field];
            return order === "cresc" ? valA - valB : valB - valA;
        });

        // 2. luăm EXACT câte erau vizibile
        const countToShow = visible;
        visible = 0; // resetăm pointerul intern, dar îl refacem imediat

        // 3. ștergem vizual conținutul
        container.innerHTML = "";

        // 4. afișăm (countToShow) mașini din lista SORTATĂ
        const nextCars = filteredCars.slice(0, countToShow);
        nextCars.forEach(m => {
            container.innerHTML += `
            <div class="car-box">
                <p><b>Brand:</b> ${m.marca}</p>
                <p><b>Model:</b> ${m.model}</p>
                <p><b>Year:</b> ${m.an}</p>
                <p><b>Mileage:</b> ${m.kilometraj} km</p>
                <p><b>Price:</b> ${m.pret} €</p>
            </div>
        `;
        });

        // 5. actualizăm visible la același număr ca înainte
        visible = countToShow;

        // 6. schimbăm iconița
        const icon = document.getElementById("sortIcon");
        icon.className = (order === "cresc")
            ? "fa-solid fa-arrow-down-short-wide"
            : "fa-solid fa-arrow-down-wide-short";
    });



// ============================
// BRAND LOADING WITH SHOW MORE
// ============================

    let allBrands = [];
    let brandsVisible = 8;


    const showMoreBrandsBtn = document.getElementById("showMoreBrands");
    const showLessBrandsBtn = document.getElementById("showLessBrands"); // ADĂUGAT

    async function loadBrands() {
        try {
            const res = await fetch("/client/brands");
            allBrands = await res.json();

            renderBrands();
        } catch (e) {
            console.error("Eroare la citirea brandurilor", e);
        }
    }

    function renderBrands() {
        brandsContainer.innerHTML = "";

        const brandsToShow = allBrands.slice(0, brandsVisible);

        brandsToShow.forEach(brand => {
            const div = document.createElement("div");
            div.classList.add("brand-option");

            div.innerHTML = `
            <input type="checkbox" value="${brand}">
            <span>${brand}</span>
        `;
            brandsContainer.appendChild(div);
        });

        // SHOW MORE logic (codul tău original)
        if (brandsVisible >= allBrands.length) {
            showMoreBrandsBtn.style.display = "none";
        } else {
            showMoreBrandsBtn.style.display = "block";
        }

        // SHOW LESS logic (ADĂUGAT)
        if (brandsVisible > 8) {
            showLessBrandsBtn.style.display = "block";
        } else {
            showLessBrandsBtn.style.display = "none";
        }
    }

// CLICK → SHOW MORE
    showMoreBrandsBtn.addEventListener("click", () => {
        brandsVisible += 8;
        renderBrands();
    });

// CLICK → SHOW LESS (ADĂUGAT)
    showLessBrandsBtn.addEventListener("click", () => {
        brandsVisible = Math.max(8, brandsVisible - 8);
        renderBrands();
    });

// initial load
    loadBrands();

    let filtersActive = false;

// filters
// ============================
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");
    const minYearInput = document.getElementById("minYear");
    const maxYearInput = document.getElementById("maxYear");
    const maxMileageInput = document.getElementById("maxMileage");

    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    const resetFiltersBtn = document.getElementById("resetFilters");


    function applyFilters() {

        filtersActive = true;
        searchInput.value = "";

        const minPrice = Number(minPriceInput.value);
        const maxPrice = Number(maxPriceInput.value);
        const minYear = Number(minYearInput.value);
        const maxYear = Number(maxYearInput.value);
        const maxMileage = Number(maxMileageInput.value);

        // BRANDS
        const selectedBrands = Array.from(
            document.querySelectorAll("#brandsContainer input[type='checkbox']:checked")
        ).map(chk => chk.value);

        // TRANSMISSION
        const selectedTransmissions = Array.from(
            document.querySelectorAll(".trans-filter:checked")
        ).map(chk => chk.value);

        // DOORS
        const selectedDoors = Array.from(
            document.querySelectorAll(".door-filter:checked")
        ).map(chk => Number(chk.value));

        // SEATS
        const selectedSeats = Array.from(
            document.querySelectorAll(".seat-filter:checked")
        ).map(chk => Number(chk.value));

        // FUEL TYPE
        const selectedFuelTypes = Array.from(
            document.querySelectorAll(".fuel-filter:checked")
        ).map(chk => chk.value);

        // ======================
        //  FILTRARE PRINCIPALĂ
        // ======================

        filteredCars = allCars.filter(m => {

            // PRICE
            if (!isNaN(minPrice) && minPrice > 0 && m.pret < minPrice) return false;
            if (!isNaN(maxPrice) && maxPrice > 0 && m.pret > maxPrice) return false;

            // YEAR
            if (!isNaN(minYear) && minYear > 0 && m.an < minYear) return false;
            if (!isNaN(maxYear) && maxYear > 0 && m.an > maxYear) return false;

            // MILEAGE
            if (!isNaN(maxMileage) && maxMileage > 0 && m.kilometraj > maxMileage) return false;

            // BRAND
            if (selectedBrands.length > 0 && !selectedBrands.includes(m.marca))
                return false;

            // TRANSMISSION (manual / automata)
            if (selectedTransmissions.length > 0 && !selectedTransmissions.includes(m.transmisie))
                return false;

            // DOORS (2 / 4)
            if (selectedDoors.length > 0 && !selectedDoors.includes(m.numarUsi))
                return false;

            // SEATS (2–9)
            if (selectedSeats.length > 0 && !selectedSeats.includes(m.numarLocuri))
                return false;

            // FUEL TYPE
            if (selectedFuelTypes.length > 0 && !selectedFuelTypes.includes(m.combustibil))
                return false;

            return true;
        });

        // NO RESULTS
        if (filteredCars.length === 0) {
            container.innerHTML = `
            <div class="car-box" style="text-align:center; padding:20px; font-size:18px;">
                No result for these filters
            </div>
        `;
            visible = 0;
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerText = "No more offers";
            updateResultsCount("");
            return;
        }

        // RESET & SHOW NEW RESULTS
        visible = 0;
        container.innerHTML = "";
        showMore();

        loadMoreBtn.disabled = false;
        loadMoreBtn.innerText = "Load More Offers";

        updateResultsCount("");
    }




    applyFiltersBtn.addEventListener("click", () => {

        // dezactivez butonul
        applyFiltersBtn.disabled = true;

        // pun iconita spinner
        applyFiltersBtn.innerHTML = '<i class="fa-solid fa-spinner spin-icon"></i>';


        // loader în container
        container.innerHTML = `
        <div class="loading-box">
            <i class="fa-solid fa-spinner spin-icon"></i>
        </div>
    `;
        // delay vizual de 400-500 ms
        setTimeout(() => {

            applyFilters();   // rulează filtrarea

            // readuce textul inițial
            applyFiltersBtn.innerText = "Apply Filters";
            applyFiltersBtn.disabled = false;

        }, 750); // 0.75 secunde delay
    });


    // =============================
// RESET FILTERS
// =============================
    document.getElementById("resetFilters").addEventListener("click", () => {

        // 1. Golește toate input-urile numerice
        minPrice.value = "";
        maxPrice.value = "";
        minYear.value = "";
        maxYear.value = "";
        maxMileage.value = "";
        searchInput.value = "";
        filtersActive = false;

        // 2. Debifează toate brandurile
        document.querySelectorAll("#brandsContainer input[type='checkbox']")
            .forEach(chk => chk.checked = false);

        // 3. Debifează TRANSMISSION TYPE
        document.querySelectorAll("input[id='trans_manual'], input[id='trans_auto']")
            .forEach(chk => chk.checked = false);

        // 4. Debifează NUMBER OF DOORS
        document.querySelectorAll(".door-filter")
            .forEach(chk => chk.checked = false);

        // 5. Debifează NUMBER OF SEATS
        document.querySelectorAll(".seat-filter")
            .forEach(chk => chk.checked = false);

        // 6. Debifează FUEL TYPE
        document.querySelectorAll(".fuel-filter")
            .forEach(chk => chk.checked = false);

        // 7. Resetează lista
        filteredCars = [...allCars];

        // 8. Resetează afișarea
        visible = 0;
        container.innerHTML = "";
        showMore();

        // 9. Reactivează load more
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerText = "Load More Offers";

        updateResultsCount("");
    });


    // Search
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    function applySearch() {
        //  RESET ALL FILTERS
        minPriceInput.value = "";
        maxPriceInput.value = "";
        minYearInput.value = "";
        maxYearInput.value = "";
        maxMileageInput.value = "";

        document.querySelectorAll("#brandsContainer input[type='checkbox']")
            .forEach(chk => chk.checked = false);

        // Transmission (Manual / Automatic)
        document.querySelectorAll("#advancedSection input[type='checkbox'][value='manuala'], #advancedSection input[type='checkbox'][value='automata']")
            .forEach(chk => chk.checked = false);

        // Number of Doors
        document.querySelectorAll(".door-filter")
            .forEach(chk => chk.checked = false);

        // Number of Seats
        document.querySelectorAll(".seat-filter")
            .forEach(chk => chk.checked = false);

        // Fuel Type
        document.querySelectorAll(".fuel-filter")
            .forEach(chk => chk.checked = false);


        const query = searchInput.value.toLowerCase().trim();

        // 1. Loading vizual în container
        container.innerHTML = `
        <div class="loading-box">
            <i class="fa-solid fa-spinner spin-icon" style="font-size:80px;"></i>
        </div>
    `;

        // 2. Loading pe buton
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fa-solid fa-spinner spin-icon"></i>';

        setTimeout(() => {

            // dacă câmpul este gol → revenim la allCars
            if (query.length === 0) {
                filteredCars = [...allCars];
            } else {

                // 🔥 SEARCH INTELIGENT CU MULTI-KEYWORDS
                const keywords = query.split(" ").filter(k => k.length > 0);

                filteredCars = allCars.filter(m => {
                    const haystack =
                        `${m.marca} ${m.model} ${m.an} ${m.kilometraj} ${m.pret}`
                            .toLowerCase();

                    // toate cuvintele introduse trebuie să fie găsite în anunț
                    return keywords.every(kw => haystack.includes(kw));
                });
            }

            // 3. Dacă nu există rezultate
            if (filteredCars.length === 0) {
                container.innerHTML = `
                <div class="loading-box">
                    <i class="fa-solid fa-magnifying-glass" style="font-size:60px;"></i>
                    <p style="font-size:18px; margin-top:10px;">No results found</p>
                </div>
            `;

                visible = 0;
                loadMoreBtn.disabled = true;
                loadMoreBtn.innerText = "No offers";

                // reactivăm butonul
                searchBtn.disabled = false;
                searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';

                filteredCars = [];
                updateResultsCount(query);

                return;
            }

            // 4. Avem rezultate → resetăm vizibilul și afișăm primele 5
            visible = 0;
            container.innerHTML = "";
            showMore();

            // reactivăm load more
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerText = "Load More Offers";

            // reactivăm search button
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';

            updateResultsCount(query);
        }, 750); // delay vizual


    }



    searchBtn.addEventListener("click", applySearch);
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") applySearch();
    });

    // autocomplete
    const autoList = document.getElementById("autocompleteList");

    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();

        autoList.innerHTML = "";
        autoList.style.display = "none";

        if (query.length < 3) return;

        const suggestions = allCars
            .map(c => `${c.marca} ${c.model} ${c.an}`)
            .filter(txt => txt.toLowerCase().includes(query))
            .slice(0, 10);

        if (suggestions.length === 0) return;

        autoList.style.display = "block";

        suggestions.forEach(s => {
            const item = document.createElement("div");
            item.className = "autocomplete-item";
            item.textContent = s;

            item.onclick = () => {
                searchInput.value = s;

                autoList.innerHTML = "";
                autoList.style.display = "none";

                // 🔥 trigger automat pe functionarea ta de search
                applySearch();

                // trimite Enter dacă ai eveniment pe Enter
                searchInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
            };

            autoList.appendChild(item);
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-wrapper")) {
            autoList.innerHTML = "";
            autoList.style.display = "none";
        }
    });

    function updateResultsCount(queryText = "") {
        const resultsDiv = document.getElementById("resultsCount");
        const count = filteredCars.length;

        if (!filteredCars || count === 0) {
            resultsDiv.style.display = "none";
            return;
        }

        resultsDiv.style.display = "block";


        const resultWord = count === 1 ? "result" : "results";
        const carWord = count === 1 ? "car" : "cars";
        const carVerb = count === 1 ? "matches" : "match";

        if (count === allCars.length && queryText === "") {
            resultsDiv.innerHTML = `Showing all ${count} available ${carWord}.`;
            return;
        }

        if (queryText) {
            resultsDiv.innerHTML = `${count} ${resultWord} found for "<strong>${queryText}</strong>"`;
        } else {
            resultsDiv.innerHTML = `${count} ${carWord} ${carVerb} your filters.`;
        }
    }

    const advancedToggle = document.getElementById("advancedToggle");
    const advancedSection = document.getElementById("advancedSection");

    let advancedOpen = false;

    advancedToggle.addEventListener("click", () => {
        advancedOpen = !advancedOpen;

        if (advancedOpen) {
            advancedSection.style.display = "block";
            advancedToggle.innerHTML = "<i class=\"fa-solid fa-atom\"></i> Advanced Options ▲";
        } else {
            advancedSection.style.display = "none";
            advancedToggle.innerHTML = "<i class=\"fa-solid fa-atom\"></i> Advanced Options ▼";
        }
    });




});
