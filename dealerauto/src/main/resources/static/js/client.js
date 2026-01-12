const allCarsPromise = fetch("/client/all").then(r => r.json());

// ====================================================
// FUNCȚIE PENTRU TOGGLE FAVORITE
// ====================================================

function toggleFavorite(button, carId) {

    isTogglingFavorite = true;

    // Verifică dacă user-ul este logat
    const isLogged = document.querySelector('.auth-buttons-horizontal') !== null; // sau alt indicator

    if (!isLogged) {
        alert('Please sign in to add favorites!');
        //window.location.href = '/client';
        return;
    }

    // Apel AJAX către backend
    fetch('/api/favorite/toggle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `masinaId=${carId}`
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    alert('Please login first!');
                    window.location.href = '/client';
                    return;
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Toggle clasa 'active' pe buton
                const icon = button.querySelector('i');

                if (data.isAdded) {
                    // Adăugat la favorite
                    button.classList.add('active');
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid');


                } else {
                    // Șters de la favorite
                    button.classList.remove('active');
                    icon.classList.remove('fa-solid');
                    icon.classList.add('fa-regular');

                }
            }
        })
        .catch(error => {
            console.error('Error toggling favorite:', error);
            alert('An error occurred. Please try again.');
        });
}




function loadCarLogos() {
    document.querySelectorAll(".car-logo[data-brand]").forEach(img => {
        const brand = img.dataset.brand;

        // Acum apelează backend-ul tău, nu direct logo.dev
        img.src = `/api/car-logo/${encodeURIComponent(brand)}`;

        img.onerror = () => {
            img.src = "/images/logos/default.png";
        };
    });
}


// ================================
// LOAD CAR IMAGES
// ================================
async function loadCarImages() {

    const carousels = document.querySelectorAll('.car-images-carousel');

    if (carousels.length === 0) {
        console.error(' NO CAROUSELS FOUND! Check HTML!');
        return;
    }

    //const carousels = document.querySelectorAll('.car-images-carousel');

    for (const carousel of carousels) {
        const brand = carousel.dataset.brand;
        const model = carousel.dataset.model;

        try {
            const response = await fetch(`/api/car-images/${encodeURIComponent(brand)}/${encodeURIComponent(model)}`);

            if (response.ok) {
                const imageUrls = await response.json();
                initializeCarousel(carousel, imageUrls);
            } else {
                // Fallback la placeholder
                initializeCarousel(carousel, ['/images/logos/car-placeholder.png']);
            }
        } catch (error) {
            console.error('Failed to load images:', error);
            initializeCarousel(carousel, ['/images/logos/car-placeholder.png']);
        }
    }
}

// ================================
// INITIALIZE CAROUSEL
// ================================
function initializeCarousel(carouselElement, imageUrls) {
    const container = carouselElement.querySelector('.carousel-images');
    const dotsContainer = carouselElement.querySelector('.carousel-dots');
    const prevBtn = carouselElement.querySelector('.prev-btn');
    const nextBtn = carouselElement.querySelector('.next-btn');

    // Clear loading state
    container.innerHTML = '';
    dotsContainer.innerHTML = '';

    // Add images
    imageUrls.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Car image ${index + 1}`;
        img.className = 'carousel-image' + (index === 0 ? ' active' : '');
        container.appendChild(img);

        // Add dot
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dotsContainer.appendChild(dot);
    });

    // Show navigation only if multiple images
    if (imageUrls.length > 1) {
        prevBtn.classList.remove('carousel-btn-hidden');
        nextBtn.classList.remove('carousel-btn-hidden');

        let currentIndex = 0;
        const images = container.querySelectorAll('.carousel-image');
        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        // Navigation functions
        function updateCarousel(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        prevBtn.onclick = () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel(currentIndex);
        };

        nextBtn.onclick = () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel(currentIndex);
        };

        // Dots click
        dots.forEach((dot, index) => {
            dot.onclick = () => {
                currentIndex = index;
                updateCarousel(currentIndex);
            };
        });

        // Auto-play (opțional - comentează dacă nu vrei)
        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel(currentIndex);
        }, 5000);
    }
}

// ====================================================
// FORMATARE DATA ACTUALIZARE PREȚ
// ====================================================
function formatUpdateDate(dateStr) {
    if (!dateStr) return 'Updated recently';

    const date = new Date(dateStr);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getDate();
    const month = monthNames[date.getMonth()];

    return `Updated on ${day} ${month}`;
}

// ====================================================
// ACTUALIZEAZĂ BADGE-URILE DE DATĂ
// ====================================================
function updatePriceUpdateBadges() {
    const badges = document.querySelectorAll('.price-update-badge');

    badges.forEach(badge => {
        const dateStr = badge.getAttribute('data-update-date');
        const span = badge.querySelector('span');

        if (dateStr && span) {
            span.textContent = formatUpdateDate(dateStr);
        } else if (span) {
            // Dacă nu are dată, ascunde badge-ul
            badge.style.display = 'none';
        }
    });
}

document.addEventListener("DOMContentLoaded",async () => {

    const container = document.getElementById("listaContent");
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




    // ====================================================
// FUNCȚII DE TRADUCERE
// ====================================================
    function translateFuel(combustibil) {
        const translations = {
            'benzina': 'Petrol',
            'motorina': 'Diesel',
            'electric': 'Electric',
            'hibrid': 'Hybrid'
        };
        return translations[combustibil] || combustibil;
    }

    function translateTransmission(transmisie) {
        const translations = {
            'manuala': 'Manual',
            'automata': 'Automatic'
        };
        return translations[transmisie] || transmisie;
    }

    let visible = 0;

    // Așteptăm rezultatul — DAR request-ul a început deja înainte!
    const allCars = await allCarsPromise;

    // înainte de filtre → lista filtrată = toată lista
    filteredCars = [...allCars];


    // ================================
// HELPER: Generează HTML pentru o mașină
// ================================
    function generateCarHTML(m) {

        // Verifică dacă mașina este la favorite
        const isFavorite = favoriteMasinaIds && Array.isArray(favoriteMasinaIds)
            ? favoriteMasinaIds.includes(m.id)
            : false;
        const activeClass = isFavorite ? 'active' : '';
        const iconClass = isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart';

        const dataActualizare = dateActualizareMap[m.id] || '';

        return `
        <div class="car-box" data-car-id="${m.id}">
            
           
              <!-- Buton Favorite -->
            <button class="favorite-btn ${activeClass}" onclick="toggleFavorite(this, ${m.id})">
                <i class="${iconClass}"></i>
            </button>
            
             <!-- 🆕 BADGE DATA ACTUALIZARE -->
        ${dataActualizare ? `
        <div class="price-update-badge" data-update-date="${dataActualizare}">
            <i class="fa-regular fa-clock"></i>
            
            <span>Updated recently</span>
        </div>
        ` : ''}
            
          
             <!-- Pret -->
            <div class="car-price">
            ${Math.round(m.pret).toLocaleString('ro-RO')} €
            </div>
            
            <!-- Header cu Brand & Model -->
            <div class="car-header">
                <div class="car-title-section">
                    <img class="car-logo"
                         data-brand="${m.marca}"
                         src="/images/logos/loading.gif"
                         alt="Loading...">
                    <div>
                        <h3 class="car-title">${m.marca}</h3>
                        <p class="car-model">${m.model}</p>
                    </div>
                </div>
            </div>
            
            
            <!-- Detalii principale -->
            <div class="car-main-details">
                <p>
                    <i class="fa-solid fa-calendar-days"></i>
                    <b>Year:</b> ${m.an}
                </p>
                
                <p>
                      <i class="fa-solid fa-road"></i>
                       <b>Mileage:</b> ${Number(m.kilometraj).toLocaleString('ro-RO')} km
                </p>

                
                <p>
                    <i class="fa-solid fa-gas-pump"></i>
                    <b>Fuel:</b> ${translateFuel(m.combustibil)}
                </p>
                
                <p>
                    <i class="fa-solid fa-gears"></i>
                    <b>Transmission:</b> ${translateTransmission(m.transmisie)}
                </p>
            </div>
            
             <!--  CAROUSEL IMAGINI MAȘINĂ -->
            <div class="car-images-carousel" 
                 data-brand="${m.marca}" 
                 data-model="${m.model}">
                
                <div class="carousel-container">
                    <button class="carousel-btn prev-btn carousel-btn-hidden">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    
                    <div class="carousel-images">
                        <div class="carousel-loading">
                            <i class="fa-solid fa-spinner fa-spin"></i>
                        </div>
                    </div>
                    
                    <button class="carousel-btn next-btn carousel-btn-hidden">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="carousel-dots"></div>
            </div>
            
        </div>
    `;
    }

    // ----------------------------------------------------
    // Funcție care afișează următoarele 5 mașini
    // ----------------------------------------------------
    function showMore() {
        const nextCars = filteredCars.slice(visible, visible + 5);

        nextCars.forEach(m => {
            container.innerHTML += generateCarHTML(m);
        });

        visible += nextCars.length;
        loadCarLogos();
        loadCarImages();

        updatePriceUpdateBadges();
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
        loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner spin-iconita"></i>';

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
    const overlay = document.getElementById("listaOverlay");


    function updateSortIcon() {
        const icon = document.getElementById("sortIcon");
        const order = sortOrderSelect.value;

        icon.className = (order === "cresc")
            ? "fa-solid fa-arrow-down-short-wide"
            : "fa-solid fa-arrow-down-wide-short";
    }

    sortOrderSelect.addEventListener("change", updateSortIcon);
    function getListaOverlay() {
        return document.getElementById("listaOverlay");
    }

    sortBtn.addEventListener("click", () => {

        const overlay = getListaOverlay();
        if (overlay) overlay.style.display = "flex";

        setTimeout(() => {
            try {
                const field = sortFieldSelect.value;
                const order = sortOrderSelect.value;

                filteredCars.sort((a, b) => {
                    const valA = Number(a[field]) || 0;
                    const valB = Number(b[field]) || 0;
                    return order === "cresc" ? valA - valB : valB - valA;
                });

                const countToShow = visible;
                visible = 0;

                container.querySelectorAll(".car-box").forEach(el => el.remove());

                filteredCars.slice(0, countToShow).forEach(m => {
                    container.innerHTML += generateCarHTML(m);

                });

                visible = countToShow;
                updateSortIcon();
                loadCarLogos();
                loadCarImages();

                updatePriceUpdateBadges();

            } finally {
                const overlay2 = getListaOverlay();
                if (overlay2) overlay2.style.display = "none";
            }
        }, 750);
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
        applyFiltersBtn.innerHTML = '<i class="fa-solid fa-spinner spin-iconita" ></i>';


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

        const overlay = getListaOverlay();
        if (overlay) overlay.style.display = "flex";

        setTimeout(() => {
            try {
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

        updateResultsCount(""); }

            finally {
                const overlay2 = getListaOverlay();
                if (overlay2) overlay2.style.display = "none";
            }
        }, 750);

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
            <i class="fa-solid fa-spinner spin-icon" "></i>  
        </div>
    `;

        // 2. Loading pe buton
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fa-solid fa-spinner spin-iconSearch"></i>';

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
