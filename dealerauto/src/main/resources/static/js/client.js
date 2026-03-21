const allCarsPromise = fetch("/client/all").then((r) => r.json());

function showSignInRequiredPopup() {
  const overlay = document.getElementById("signInRequiredOverlay");
  if (!overlay) return;
  overlay.style.display = "flex";
  requestAnimationFrame(function () {
    overlay.classList.add("active");
  });
}

function closeSignInRequiredPopup() {
  const overlay = document.getElementById("signInRequiredOverlay");
  if (!overlay) return;
  overlay.classList.remove("active");
  setTimeout(function () {
    overlay.style.display = "none";
  }, 300);
}

function initSignInRequiredPopup() {
  const overlay = document.getElementById("signInRequiredOverlay");
  if (!overlay) return;
  const btnOk = document.getElementById("signInRequiredOk");
  if (btnOk) {
    btnOk.addEventListener("click", closeSignInRequiredPopup);
  }
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeSignInRequiredPopup();
  });
}

function toggleFavorite(button, carId) {
  isTogglingFavorite = true;

  const isLogged = document.querySelector(".auth-buttons-horizontal") !== null; // sau alt indicator

  if (!isLogged) {
    showSignInRequiredPopup();
    return;
  }

  fetch("/api/favorite/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `masinaId=${carId}`,
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          alert("Please login first!");
          window.location.href = "/client";
          return;
        }
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        const icon = button.querySelector("i");
        if (data.isAdded) {
          button.classList.add("active");
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        } else {
          button.classList.remove("active");
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }
      }
    })
    .catch((error) => {
      console.error("Error toggling favorite:", error);
      alert("An error occurred. Please try again.");
    });
}

function loadCarLogos() {
  document.querySelectorAll(".car-logo[data-brand]").forEach((img) => {
    const brand = img.dataset.brand;

    img.src = `/api/car-logo/${encodeURIComponent(brand)}`;

    img.onerror = () => {
      img.src = "/images/logos/default.png";
    };
  });
}

async function loadCarImages() {
  const carousels = document.querySelectorAll(".car-images-carousel");

  if (carousels.length === 0) {
    console.error(" NO CAROUSELS FOUND! Check HTML!");
    return;
  }

  //const carousels = document.querySelectorAll('.car-images-carousel');

  for (const carousel of carousels) {
    const brand = carousel.dataset.brand;
    const model = carousel.dataset.model;
    try {
      const response = await fetch(
        `/api/car-images/${encodeURIComponent(brand)}/${encodeURIComponent(model)}`,
      );
      if (response.ok) {
        const imageUrls = await response.json();
        if (carousel.classList.contains("car-images-gallery")) {
          initializeImageGallery(carousel, imageUrls);
        } else {
          initializeCarousel(carousel, imageUrls);
        }
      } else {
        const fallback = ["/images/logos/car-placeholder.png"];
        if (carousel.classList.contains("car-images-gallery")) {
          initializeImageGallery(carousel, fallback);
        } else {
          initializeCarousel(carousel, fallback);
        }
      }
    } catch (error) {
      console.error("Failed to load images:", error);
      const fallback = ["/images/logos/car-placeholder.png"];
      if (carousel.classList.contains("car-images-gallery")) {
        initializeImageGallery(carousel, fallback);
      } else {
        initializeCarousel(carousel, fallback);
      }
    }
  }
}

// INITIALIZE IMAGE GALLERY (pagina /client: 3 stânga | 1 centru | 3 dreapta)
// Initial: centrul = prima poză (top-left). Click pe oricare din 6 = apare în centru.
function initializeImageGallery(galleryElement, imageUrls) {
  const leftEl = galleryElement.querySelector(".car-gallery-left");
  const centerEl = galleryElement.querySelector(".car-gallery-center");
  const rightEl = galleryElement.querySelector(".car-gallery-right");
  if (!leftEl || !centerEl || !rightEl) return;

  leftEl.innerHTML = "";
  centerEl.innerHTML = "";
  rightEl.innerHTML = "";

  const placeholder = "/images/logos/car-placeholder.png";
  if (!imageUrls.length) {
    imageUrls = [placeholder];
  }

  const mainImg = document.createElement("img");
  mainImg.src = imageUrls[0];
  mainImg.alt = "Car image";
  mainImg.className = "car-gallery-main-img";
  centerEl.appendChild(mainImg);
  const leftUrls = imageUrls.slice(0, 3);
  leftUrls.forEach((url, i) => {
    const index = i;
    const thumb = createGalleryThumb(url, index, index === 0, () => {
      mainImg.src = url;
      setActiveThumb(galleryElement, index);
    });
    leftEl.appendChild(thumb);
  });

  const rightUrls = imageUrls.slice(3, 6);
  rightUrls.forEach((url, i) => {
    const index = 3 + i;
    const thumb = createGalleryThumb(url, index, false, () => {
      mainImg.src = url;
      setActiveThumb(galleryElement, index);
    });
    rightEl.appendChild(thumb);
  });
}

function createGalleryThumb(url, index, isActive, onClick) {
  const thumb = document.createElement("button");
  thumb.type = "button";
  thumb.className = "car-gallery-thumb" + (isActive ? " active" : "");
  thumb.setAttribute("data-gallery-index", index);
  thumb.setAttribute("aria-label", "View image " + (index + 1));
  const img = document.createElement("img");
  img.src = url;
  img.alt = "";
  thumb.appendChild(img);
  thumb.addEventListener("click", onClick);
  return thumb;
}

function setActiveThumb(galleryElement, activeIndex) {
  galleryElement.querySelectorAll(".car-gallery-thumb").forEach((t) => {
    t.classList.toggle(
      "active",
      parseInt(t.getAttribute("data-gallery-index"), 10) === activeIndex,
    );
  });
}

function initializeCarousel(carouselElement, imageUrls) {
  const container = carouselElement.querySelector(".carousel-images");
  const dotsContainer = carouselElement.querySelector(".carousel-dots");
  const prevBtn = carouselElement.querySelector(".prev-btn");
  const nextBtn = carouselElement.querySelector(".next-btn");

  container.innerHTML = "";
  dotsContainer.innerHTML = "";
  imageUrls.forEach((url, index) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = `Car image ${index + 1}`;
    img.className = "carousel-image" + (index === 0 ? " active" : "");
    container.appendChild(img);

    const dot = document.createElement("span");
    dot.className = "carousel-dot" + (index === 0 ? " active" : "");
    dotsContainer.appendChild(dot);
  });
  if (imageUrls.length > 1) {
    prevBtn.classList.remove("carousel-btn-hidden");
    nextBtn.classList.remove("carousel-btn-hidden");

    let currentIndex = 0;
    const images = container.querySelectorAll(".carousel-image");
    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    function updateCarousel(index) {
      images.forEach((img, i) => {
        img.classList.toggle("active", i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
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
    dots.forEach((dot, index) => {
      dot.onclick = () => {
        currentIndex = index;
        updateCarousel(currentIndex);
      };
    });
    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      updateCarousel(currentIndex);
    }, 5000);
  }
}

function formatUpdateDate(dateStr) {
  if (!dateStr) return "Updated recently";

  const date = new Date(dateStr);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];

  return `Updated on ${day} ${month}`;
}

function updatePriceUpdateBadges() {
  const badges = document.querySelectorAll(".price-update-badge");

  badges.forEach((badge) => {
    const dateStr = badge.getAttribute("data-update-date");
    const span = badge.querySelector("span");

    if (dateStr && span) {
      span.textContent = formatUpdateDate(dateStr);
    } else if (span) {
      badge.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("listaContent");
  const loadMoreBtn = document.getElementById("loadMore");

  let activeBodyTypes = new Set(); // empty = all

  const bodyTypeMap = {
    "Sedan": "sedan", "Hatchback": "hatchback", "Break": "break",
    "SUV": "suv", "Coupe": "coupe", "Cabriolet": "cabriolet", "MPV": "mpv"
  };
  function showBodyTypeSpinners() {
    document.querySelectorAll(".body-type-count").forEach(el => {
      el.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    });
    showResultsCountSpinner();
  }

  function showResultsCountSpinner() {
    const resultsDiv = document.getElementById("resultsCount");
    if (resultsDiv && resultsDiv.style.display !== "none" && resultsDiv.innerHTML.trim() !== "") {
      resultsDiv.innerHTML = resultsDiv.innerHTML.replace(/^\d+/, '<i class="fa-solid fa-spinner fa-spin"></i>');
    }
  }

  function updateBodyTypeCounts(cars) {
    const counts = {};
    cars.forEach(c => {
      const key = bodyTypeMap[c.caroserie] || "sedan";
      counts[key] = (counts[key] || 0) + 1;
    });
    let total = 0;
    document.querySelectorAll(".body-type-btn").forEach(btn => {
      const type = btn.getAttribute("data-body-type");
      if (type === "all-options") return;
      const cnt = counts[type] || 0;
      total += cnt;
      btn.querySelector(".body-type-count").textContent = cnt;
    });
    const allBtn = document.querySelector('[data-body-type="all-options"]');
    if (allBtn) allBtn.querySelector(".body-type-count").textContent = total;
  }

  function applyBodyTypeFilter() {
    // filteredCars = sidebar-filtered; displayCars = final list for rendering
    displayCars = [...filteredCars];
    if (activeBodyTypes.size > 0) {
      const dbTypes = new Set();
      activeBodyTypes.forEach(bt => {
        const dbType = Object.keys(bodyTypeMap).find(k => bodyTypeMap[k] === bt);
        if (dbType) dbTypes.add(dbType);
      });
      displayCars = filteredCars.filter(c => dbTypes.has(c.caroserie));
    }
    visible = 0;
    container.innerHTML = "";
    if (displayCars.length === 0) {
      container.innerHTML = `
        <div class="loading-box">
            <i class="fa-solid fa-magnifying-glass" style="font-size:60px;"></i>
            <p style="font-size:18px; margin-top:10px;">No cars found for these filters</p>
        </div>`;
      loadMoreBtn.disabled = true;
      loadMoreBtn.innerText = "No more offers";
      updateResultsCount("");
      return;
    }
    showMore();
    loadMoreBtn.disabled = false;
    loadMoreBtn.innerText = "Load More Offers";
    updateResultsCount("");
  }

  function updateBodyTypeCheckIcons() {
    document.querySelectorAll(".body-type-btn").forEach(btn => {
      const type = btn.getAttribute("data-body-type");
      const existing = btn.querySelector(".body-type-check");
      if (type !== "all-options" && activeBodyTypes.has(type)) {
        if (!existing) {
          const icon = document.createElement("i");
          icon.className = "fa-solid fa-check body-type-check";
          btn.appendChild(icon);
        }
      } else if (existing) {
        existing.remove();
      }
    });
  }

  function selectAllBodyTypes() {
    activeBodyTypes.clear();
    document.querySelectorAll(".body-type-btn").forEach(b => b.classList.remove("selected"));
    document.querySelector('[data-body-type="all-options"]').classList.add("selected");
    updateBodyTypeCheckIcons();
  }

  document.querySelectorAll(".body-type-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const type = this.getAttribute("data-body-type");

      if (type === "all-options") {
        // All: dezactivează toate selecțiile
        selectAllBodyTypes();
      } else {
        // Toggle individual body type
        const allBtn = document.querySelector('[data-body-type="all-options"]');
        if (activeBodyTypes.has(type)) {
          activeBodyTypes.delete(type);
          this.classList.remove("selected");
        } else {
          activeBodyTypes.add(type);
          this.classList.add("selected");
          allBtn.classList.remove("selected");
        }
        // Dacă nu mai e nimic selectat, revenim la All
        if (activeBodyTypes.size === 0) {
          allBtn.classList.add("selected");
        }
        updateBodyTypeCheckIcons();
      }

      container.innerHTML = `
        <div class="loading-box">
            <i class="fa-solid fa-spinner spin-icon"></i>
        </div>
      `;
      showResultsCountSpinner();
      loadMoreBtn.style.visibility = "hidden";

      setTimeout(() => {
        applyBodyTypeFilter();
        renderActiveFilterTags();
        loadMoreBtn.style.visibility = "visible";
      }, 750);
    });
  });

  const brandsContainer = document.getElementById("brandsContainer");
  fetch("/client/brands")
    .then((r) => r.json())
    .then((brands) => {
      brands.forEach((brand) => {
        brandsContainer.innerHTML += `
              <label class="brand-option">
                  <input type="checkbox" value="${brand}">
                  ${brand}
              </label>
          `;
      });
    });

  function translateFuel(combustibil) {
    const translations = {
      benzina: "Petrol",
      motorina: "Diesel",
      electric: "Electric",
      hibrid: "Hybrid",
    };
    return translations[combustibil] || combustibil;
  }

  function translateTransmission(transmisie) {
    const translations = {
      manuala: "Manual",
      automata: "Automatic",
    };
    return translations[transmisie] || transmisie;
  }

  let visible = 0;
  let displayCars = []; // final list after body type filter (used by showMore + Load More)

  const allCars = await allCarsPromise;

  const maxCarPrice = allCars.reduce((mx, c) => Math.max(mx, c.pret || 0), 0);
  const priceSliderMax = Math.ceil(maxCarPrice / 10000) * 10000; // rotunjit la următoarele zeci de mii
  const priceSliderMin = 0;

  const priceWrapEl = document.getElementById("priceRangeWrap");
  if (priceWrapEl) {
    priceWrapEl.setAttribute("data-min", priceSliderMin);
    priceWrapEl.setAttribute("data-max", priceSliderMax);
    const pMinR = document.getElementById("priceMin");
    const pMaxR = document.getElementById("priceMax");
    if (pMinR) { pMinR.min = priceSliderMin; pMinR.max = priceSliderMax; pMinR.value = priceSliderMin; pMinR.step = 200; }
    if (pMaxR) { pMaxR.min = priceSliderMin; pMaxR.max = priceSliderMax; pMaxR.value = priceSliderMax; pMaxR.step = 200; }
  }

  const currentYear = new Date().getFullYear();
  const yearWrapEl = document.getElementById("yearRangeWrap");
  if (yearWrapEl) {
    yearWrapEl.setAttribute("data-max", currentYear);
    const yMinR = document.getElementById("yearMin");
    const yMaxR = document.getElementById("yearMax");
    if (yMinR) { yMinR.max = currentYear; }
    if (yMaxR) { yMaxR.max = currentYear; yMaxR.value = currentYear; }
  }

  function generateTicks(containerId, tickValues, rangeMin, rangeMax, formatFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    const span = rangeMax - rangeMin || 1;
    tickValues.forEach(val => {
      const pct = ((val - rangeMin) / span) * 100;
      const tick = document.createElement("div");
      tick.className = "range-tick";
      tick.style.left = pct + "%";
      tick.innerHTML = `<span class="range-tick-label">${formatFn(val)}</span><span class="range-tick-line"></span>`;
      container.appendChild(tick);
    });
  }

  const priceTicks = [priceSliderMin];
  for (let v = 10000; v < priceSliderMax; v += 10000) priceTicks.push(v);
  priceTicks.push(priceSliderMax);
  generateTicks("priceTicks", priceTicks, priceSliderMin, priceSliderMax, v => (v / 1000) + "K");

  const yearMin = 2000;
  const yearRange = currentYear - yearMin;
  const yearTickValues = [
    yearMin,
    Math.round(yearMin + yearRange * 0.25),
    Math.round(yearMin + yearRange * 0.5),
    Math.round(yearMin + yearRange * 0.75),
    currentYear
  ];
  generateTicks("yearTicks", yearTickValues, yearMin, currentYear, v => String(v));

  // Mileage ticks: din 100K în 100K, inclusiv capetele 0 și 800K
  const mileageTicks = [0];
  for (let v = 100000; v < 800000; v += 100000) mileageTicks.push(v);
  mileageTicks.push(800000);
  generateTicks("mileageTicks", mileageTicks, 0, 800000, v => (v / 1000) + "K");

  filteredCars = [...allCars];
  displayCars = [...filteredCars];
  updateBodyTypeCounts(filteredCars);

  function formatNum(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function renderActiveFilterTags() {
    const tagsContainer = document.getElementById("activeFilterTags");
    if (!tagsContainer) return;
    const tags = [];

    if (minPriceInput.value) tags.push({ label: "Min Price: " + formatNum(minPriceInput.value), remove: () => { minPriceInput.value = ""; syncSliderFromInput("price"); } });
    if (maxPriceInput.value) tags.push({ label: "Max Price: " + formatNum(maxPriceInput.value), remove: () => { maxPriceInput.value = ""; syncSliderFromInput("price"); } });

    if (minYearInput.value) tags.push({ label: "Min Year: " + minYearInput.value, remove: () => { minYearInput.value = ""; syncSliderFromInput("year"); } });
    if (maxYearInput.value) tags.push({ label: "Max Year: " + maxYearInput.value, remove: () => { maxYearInput.value = ""; syncSliderFromInput("year"); } });

    if (minMileageInput.value) tags.push({ label: "Min Mileage: " + formatNum(minMileageInput.value), remove: () => { minMileageInput.value = ""; syncSliderFromInput("mileage"); } });
    if (maxMileageInput.value) tags.push({ label: "Max Mileage: " + formatNum(maxMileageInput.value), remove: () => { maxMileageInput.value = ""; syncSliderFromInput("mileage"); } });

    document.querySelectorAll("#brandsContainer input[type='checkbox']:checked").forEach(chk => {
      tags.push({ label: chk.value, remove: () => { chk.checked = false; } });
    });

    document.querySelectorAll(".trans-filter:checked").forEach(chk => {
      tags.push({ label: translateTransmission(chk.value), remove: () => { chk.checked = false; } });
    });

    document.querySelectorAll(".door-filter:checked").forEach(chk => {
      tags.push({ label: "Doors: " + chk.value, remove: () => { chk.checked = false; } });
    });

    document.querySelectorAll(".seat-filter:checked").forEach(chk => {
      tags.push({ label: "Seats: " + chk.value, remove: () => { chk.checked = false; } });
    });

    document.querySelectorAll(".fuel-filter:checked").forEach(chk => {
      tags.push({ label: translateFuel(chk.value), remove: () => { chk.checked = false; } });
    });

    // Body type tags (separate badge per selection)
    const bodyTypeLabelMap = { sedan: "Sedan", hatchback: "Hatchback", break: "Break", suv: "SUV", coupe: "Coupe", cabriolet: "Cabriolet", mpv: "MPV" };
    activeBodyTypes.forEach(bt => {
      tags.push({
        label: "Body Type: " + (bodyTypeLabelMap[bt] || bt),
        remove: () => {
          activeBodyTypes.delete(bt);
          const btn = document.querySelector(`[data-body-type="${bt}"]`);
          if (btn) btn.classList.remove("selected");
          if (activeBodyTypes.size === 0) {
            document.querySelector('[data-body-type="all-options"]').classList.add("selected");
          }
          updateBodyTypeCheckIcons();
        },
        isBodyType: true
      });
    });

    tagsContainer.innerHTML = "";
    tags.forEach((tag, i) => {
      const el = document.createElement("span");
      el.className = "filter-tag";
      el.innerHTML = `${tag.label}<i class="fa-regular fa-circle-xmark filter-tag-x"></i>`;
      el.querySelector(".filter-tag-x").addEventListener("click", () => {
        tag.remove();

        container.innerHTML = `
          <div class="loading-box">
              <i class="fa-solid fa-spinner spin-icon"></i>
          </div>
        `;
        showBodyTypeSpinners();
        loadMoreBtn.style.visibility = "hidden";

        setTimeout(() => {
          applyFilters();
          renderActiveFilterTags();
          updateBodyTypeCounts(filteredCars);
          applyBodyTypeFilter();
          loadMoreBtn.style.visibility = "visible";
        }, 750);
      });
      tagsContainer.appendChild(el);
    });
  }

  // Sync slider position when an input is cleared via tag remove
  function syncSliderFromInput(type) {
    if (type === "price" && priceMinRange && priceMaxRange && priceRangeWrap && priceRangeFill) {
      const { min, max } = getRangeBounds(priceRangeWrap);
      priceMinRange.value = minPriceInput.value || min;
      priceMaxRange.value = maxPriceInput.value || max;
      updateDualFill(priceRangeWrap, priceRangeFill, Number(priceMinRange.value), Number(priceMaxRange.value));
    }
    if (type === "year" && yearMinRange && yearMaxRange && yearRangeWrap && yearRangeFill) {
      const { min, max } = getRangeBounds(yearRangeWrap);
      yearMinRange.value = minYearInput.value || min;
      yearMaxRange.value = maxYearInput.value || max;
      updateDualFill(yearRangeWrap, yearRangeFill, Number(yearMinRange.value), Number(yearMaxRange.value));
    }
    if (type === "mileage" && mileageMinRange && mileageMaxRange && mileageRangeWrap && mileageRangeFill) {
      const { min, max } = getRangeBounds(mileageRangeWrap);
      mileageMinRange.value = minMileageInput.value || min;
      mileageMaxRange.value = maxMileageInput.value || max;
      updateDualFill(mileageRangeWrap, mileageRangeFill, Number(mileageMinRange.value), Number(mileageMaxRange.value));
    }
  }

  function generateCarHTML(m) {
    const isFavorite =
      favoriteMasinaIds && Array.isArray(favoriteMasinaIds)
        ? favoriteMasinaIds.includes(m.id)
        : false;
    const activeClass = isFavorite ? "active" : "";
    const iconClass = isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart";

    const dataActualizare = dateActualizareMap[m.id] || "";

    return `
        <div class="car-box" data-car-id="${m.id}">

<!-- Buton Favorite -->
            <button class="favorite-btn ${activeClass}" onclick="toggleFavorite(this, ${m.id})">
                <i class="${iconClass}"></i>
            </button>
            
             <!-- Preț -->
            <div class="car-price">
            ${Math.round(m.pret).toLocaleString("ro-RO")} €
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
                       <b>Mileage:</b> ${Number(m.kilometraj).toLocaleString("ro-RO")} km
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
            
             <!-- GALERIE: 3 stânga | 1 centru | 3 dreapta (6 imagini din API) -->
            <div class="car-images-carousel car-images-gallery" 
                 data-brand="${m.marca}" 
                 data-model="${m.model}">
                <div class="car-gallery">
                    <div class="car-gallery-left"></div>
                    <div class="car-gallery-center">
                        <div class="car-gallery-loading">
                            <i class="fa-solid fa-spinner fa-spin"></i>
                        </div>
                    </div>
                    <div class="car-gallery-right"></div>
                </div>
            </div>
            
            ${
              dataActualizare
                ? `
            <div class="price-update-badge" data-update-date="${dataActualizare}">
                <i class="fa-regular fa-clock"></i>
                <span>Updated recently</span>
            </div>
            `
                : ""
            }
            
        </div>
    `;
  }

  function showMore() {
    const nextCars = displayCars.slice(visible, visible + 5);

    nextCars.forEach((m) => {
      container.innerHTML += generateCarHTML(m);
    });
    visible += nextCars.length;
    loadCarLogos();
    loadCarImages();
    updatePriceUpdateBadges();
  }

  showMore();
  loadMoreBtn.style.visibility = "visible";

  document.querySelector(".back-btn").style.visibility = "visible";
  loadMoreBtn.addEventListener("click", () => {
    if (visible >= displayCars.length) {
      if (filtersActive) {
        loadMoreBtn.innerText = "No more results for these filters";
      } else {
        loadMoreBtn.innerText = "No more offers";
      }

      loadMoreBtn.disabled = true;
      return;
    }

    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner spin-iconita"></i>';

    setTimeout(() => {
      showMore();
      if (visible < displayCars.length) {
        loadMoreBtn.innerText = "Load More Offers";
        loadMoreBtn.disabled = false;
      }
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

  // --- Custom dropdowns logic ---
  document.querySelectorAll(".custom-select").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".custom-select__trigger");
    const textEl = dropdown.querySelector(".custom-select__text");
    const options = dropdown.querySelectorAll(".custom-select__option");

    // Determine which native select to sync
    const isField = dropdown.id === "customSortField";
    const nativeSelect = isField ? sortFieldSelect : sortOrderSelect;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close other open dropdowns
      document.querySelectorAll(".custom-select.open").forEach((d) => {
        if (d !== dropdown) d.classList.remove("open");
      });
      dropdown.classList.toggle("open");
    });

    options.forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        const val = opt.dataset.value;
        const label = opt.textContent.trim();

        // Update visual state
        options.forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
        textEl.textContent = label;

        // Sync native select
        nativeSelect.value = val;
        nativeSelect.dispatchEvent(new Event("change"));

        dropdown.classList.remove("open");
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select.open").forEach((d) => {
      d.classList.remove("open");
    });
  });

  function updateSortIcon() {
    const icon = document.getElementById("sortIcon");
    const order = sortOrderSelect.value;
    icon.className =
      order === "cresc"
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
        displayCars.sort((a, b) => {
          const valA = Number(a[field]) || 0;
          const valB = Number(b[field]) || 0;
          return order === "cresc" ? valA - valB : valB - valA;
        });
        const countToShow = visible;
        visible = 0;

        container.querySelectorAll(".car-box").forEach((el) => el.remove());

        displayCars.slice(0, countToShow).forEach((m) => {
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

    brandsToShow.forEach((brand) => {
      const div = document.createElement("div");
      div.classList.add("brand-option");
      div.innerHTML = `
            <input type="checkbox" value="${brand}">
            <span>${brand}</span>
        `;
      brandsContainer.appendChild(div);
    });

    if (brandsVisible >= allBrands.length) {
      showMoreBrandsBtn.style.display = "none";
    } else {
      showMoreBrandsBtn.style.display = "block";
    }

    if (brandsVisible > 8) {
      showLessBrandsBtn.style.display = "block";
    } else {
      showLessBrandsBtn.style.display = "none";
    }
  }

  showMoreBrandsBtn.addEventListener("click", () => {
    brandsVisible += 8;
    renderBrands();
  });

  showLessBrandsBtn.addEventListener("click", () => {
    brandsVisible = Math.max(8, brandsVisible - 8);
    renderBrands();
  });
  loadBrands();
  let filtersActive = false;

  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const minYearInput = document.getElementById("minYear");
  const maxYearInput = document.getElementById("maxYear");
  const minMileageInput = document.getElementById("minMileage");
  const maxMileageInput = document.getElementById("maxMileage");

  const resetFiltersBtn = document.getElementById("resetFilters");

  // ---------- Range sliders: sync with number inputs & visual fill ----------
  const priceRangeWrap = document.getElementById("priceRangeWrap");
  const priceRangeFill = document.getElementById("priceRangeFill");
  const priceMinRange = document.getElementById("priceMin");
  const priceMaxRange = document.getElementById("priceMax");
  const yearRangeWrap = document.getElementById("yearRangeWrap");
  const yearRangeFill = document.getElementById("yearRangeFill");
  const yearMinRange = document.getElementById("yearMin");
  const yearMaxRange = document.getElementById("yearMax");
  const mileageRangeWrap = document.getElementById("mileageRangeWrap");
  const mileageRangeFill = document.getElementById("mileageRangeFill");
  const mileageMinRange = document.getElementById("mileageMin");
  const mileageMaxRange = document.getElementById("mileageMax");

  function getRangeBounds(wrap) {
    const min = Number(wrap.getAttribute("data-min")) || 0;
    const max = Number(wrap.getAttribute("data-max")) || 100;
    return { min, max, span: max - min || 1 };
  }

  function updateDualFill(wrap, fillEl, minVal, maxVal) {
    if (!wrap || !fillEl) return;
    const { min, span } = getRangeBounds(wrap);
    const left = ((minVal - min) / span) * 100;
    const width = ((maxVal - minVal) / span) * 100;
    fillEl.style.left = Math.max(0, left) + "%";
    fillEl.style.width = Math.max(0, Math.min(100 - left, width)) + "%";
  }

  // ---- Funcție generică pentru dual-range slider ----
  function initDualSlider(minRange, maxRange, minInput, maxInput, wrap, fillEl, sliderGap) {
    let lastActive = null;
    minRange.addEventListener("input", () => {
      if (lastActive !== "min") { minRange.style.zIndex = "5"; maxRange.style.zIndex = "3"; lastActive = "min"; }
    });
    maxRange.addEventListener("input", () => {
      if (lastActive !== "max") { maxRange.style.zIndex = "5"; minRange.style.zIndex = "3"; lastActive = "max"; }
    });
    function fromRange() {
      let minV = Number(minRange.value);
      let maxV = Number(maxRange.value);
      const { min, max } = getRangeBounds(wrap);
      if (lastActive === "min" && minV > maxV - sliderGap) {
        maxV = Math.min(max, minV + sliderGap);
        if (maxV === max) minV = max - sliderGap;
        maxRange.value = maxV;
      } else if (lastActive === "max" && maxV < minV + sliderGap) {
        minV = Math.max(min, maxV - sliderGap);
        if (minV === min) maxV = min + sliderGap;
        minRange.value = minV;
      }
      minRange.value = minV;
      maxRange.value = maxV;
      minInput.value = minV === min ? "" : minV;
      maxInput.value = maxV === max ? "" : maxV;
      updateDualFill(wrap, fillEl, minV, maxV);
    }

    function fromInput(editedSide) {
      const { min, max } = getRangeBounds(wrap);
      let rawMin = minInput.value === "" ? min : Number(minInput.value);
      let rawMax = maxInput.value === "" ? max : Number(maxInput.value);
      if (isNaN(rawMin)) rawMin = min;
      if (isNaN(rawMax)) rawMax = max;
      const minInRange = rawMin >= min && rawMin <= max;
      const maxInRange = rawMax >= min && rawMax <= max;
      let minV = Math.max(min, Math.min(max, rawMin));
      let maxV = Math.max(min, Math.min(max, rawMax));
      if (minInRange && maxInRange && minV > maxV) {
        if (editedSide === "min") {
          maxV = max;
          maxInput.value = "";
        } else {
          minV = min;
          minInput.value = "";
        }
      }
      minRange.value = minV;
      maxRange.value = maxV;
      updateDualFill(wrap, fillEl, minV, maxV);
    }

    minRange.addEventListener("input", fromRange);
    maxRange.addEventListener("input", fromRange);
    minInput.addEventListener("input", () => fromInput("min"));
    minInput.addEventListener("change", () => fromInput("min"));
    maxInput.addEventListener("input", () => fromInput("max"));
    maxInput.addEventListener("change", () => fromInput("max"));
    updateDualFill(wrap, fillEl, Number(minRange.value), Number(maxRange.value));
  }

  if (priceMinRange && priceMaxRange && minPriceInput && maxPriceInput && priceRangeFill && priceRangeWrap) {
    initDualSlider(priceMinRange, priceMaxRange, minPriceInput, maxPriceInput, priceRangeWrap, priceRangeFill, 500);
  }

  if (yearMinRange && yearMaxRange && minYearInput && maxYearInput && yearRangeFill && yearRangeWrap) {
    initDualSlider(yearMinRange, yearMaxRange, minYearInput, maxYearInput, yearRangeWrap, yearRangeFill, 0);
  }

  if (mileageMinRange && mileageMaxRange && minMileageInput && maxMileageInput && mileageRangeFill && mileageRangeWrap) {
    initDualSlider(mileageMinRange, mileageMaxRange, minMileageInput, maxMileageInput, mileageRangeWrap, mileageRangeFill, 20000);
  }

  function resetRangeSliders() {
    if (priceRangeWrap && priceMinRange && priceMaxRange && priceRangeFill) {
      const { min, max } = getRangeBounds(priceRangeWrap);
      priceMinRange.value = min;
      priceMaxRange.value = max;
      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";
      updateDualFill(priceRangeWrap, priceRangeFill, min, max);
    }
    if (yearRangeWrap && yearMinRange && yearMaxRange && yearRangeFill) {
      const { min, max } = getRangeBounds(yearRangeWrap);
      yearMinRange.value = min;
      yearMaxRange.value = max;
      if (minYearInput) minYearInput.value = "";
      if (maxYearInput) maxYearInput.value = "";
      updateDualFill(yearRangeWrap, yearRangeFill, min, max);
    }
    if (mileageRangeWrap && mileageMinRange && mileageMaxRange && mileageRangeFill) {
      const { min, max } = getRangeBounds(mileageRangeWrap);
      mileageMinRange.value = min;
      mileageMaxRange.value = max;
      if (minMileageInput) minMileageInput.value = "";
      if (maxMileageInput) maxMileageInput.value = "";
      updateDualFill(mileageRangeWrap, mileageRangeFill, min, max);
    }
  }

  function applyFilters() {
    filtersActive = true;
    searchInput.value = "";

    const minPrice = Number(minPriceInput.value);
    const maxPrice = Number(maxPriceInput.value);
    const minYear = Number(minYearInput.value);
    const maxYear = Number(maxYearInput.value);
    const minMileage = Number(minMileageInput.value);
    const maxMileage = Number(maxMileageInput.value);

    const selectedBrands = Array.from(
      document.querySelectorAll(
        "#brandsContainer input[type='checkbox']:checked",
      ),
    ).map((chk) => chk.value);

    const selectedTransmissions = Array.from(
      document.querySelectorAll(".trans-filter:checked"),
    ).map((chk) => chk.value);
    const selectedDoors = Array.from(
      document.querySelectorAll(".door-filter:checked"),
    ).map((chk) => Number(chk.value));
    const selectedSeats = Array.from(
      document.querySelectorAll(".seat-filter:checked"),
    ).map((chk) => Number(chk.value));

    const selectedFuelTypes = Array.from(
      document.querySelectorAll(".fuel-filter:checked"),
    ).map((chk) => chk.value);

    filteredCars = allCars.filter((m) => {
      if (!isNaN(minPrice) && minPrice > 0 && m.pret < minPrice) return false;
      if (!isNaN(maxPrice) && maxPrice > 0 && m.pret > maxPrice) return false;

      if (!isNaN(minYear) && minYear > 0 && m.an < minYear) return false;
      if (!isNaN(maxYear) && maxYear > 0 && m.an > maxYear) return false;

      if (!isNaN(minMileage) && minMileage > 0 && m.kilometraj < minMileage)
        return false;
      if (!isNaN(maxMileage) && maxMileage > 0 && m.kilometraj > maxMileage)
        return false;

      if (selectedBrands.length > 0 && !selectedBrands.includes(m.marca))
        return false;

      if (
        selectedTransmissions.length > 0 &&
        !selectedTransmissions.includes(m.transmisie)
      )
        return false;

      if (selectedDoors.length > 0 && !selectedDoors.includes(m.numarUsi))
        return false;

      if (selectedSeats.length > 0 && !selectedSeats.includes(m.numarLocuri))
        return false;

      if (
        selectedFuelTypes.length > 0 &&
        !selectedFuelTypes.includes(m.combustibil)
      )
        return false;
      return true;
    });
    updateBodyTypeCounts(filteredCars);
    renderActiveFilterTags();
    applyBodyTypeFilter();
  }

  let autoApplyTimer = null;

  function triggerAutoApply(delay = 750) {
    if (autoApplyTimer) clearTimeout(autoApplyTimer);

    container.innerHTML = `
      <div class="loading-box">
          <i class="fa-solid fa-spinner spin-icon"></i>
      </div>
    `;
    showBodyTypeSpinners();
    loadMoreBtn.style.visibility = "hidden";

    autoApplyTimer = setTimeout(() => {
      applyFilters();
      loadMoreBtn.style.visibility = "visible";
    }, delay);
  }

  // Checkboxes: transmission, doors, seats, fuel — trigger imediat la change
  document.querySelectorAll(".trans-filter, .door-filter, .seat-filter, .fuel-filter").forEach(chk => {
    chk.addEventListener("change", () => triggerAutoApply());
  });

  // Brands — event delegation (checkboxes sunt generate dinamic)
  brandsContainer.addEventListener("change", (e) => {
    if (e.target.matches("input[type='checkbox']")) {
      triggerAutoApply();
    }
  });

  // Number inputs (price, year, mileage) — trigger pe change (blur / Enter)
  [minPriceInput, maxPriceInput, minYearInput, maxYearInput, minMileageInput, maxMileageInput].forEach(input => {
    if (input) {
      input.addEventListener("change", () => triggerAutoApply());
    }
  });

  // Range sliders — trigger la release (change event pe range input)
  [priceMinRange, priceMaxRange, yearMinRange, yearMaxRange, mileageMinRange, mileageMaxRange].forEach(range => {
    if (range) {
      range.addEventListener("change", () => triggerAutoApply());
    }
  });

  document.getElementById("resetFilters").addEventListener("click", () => {
    const overlay = getListaOverlay();
    if (overlay) overlay.style.display = "flex";

    setTimeout(() => {
      try {
        resetRangeSliders();
        searchInput.value = "";
        filtersActive = false;
        document
          .querySelectorAll("#brandsContainer input[type='checkbox']")
          .forEach((chk) => (chk.checked = false));

        document
          .querySelectorAll("input[id='trans_manual'], input[id='trans_auto']")
          .forEach((chk) => (chk.checked = false));

        document
          .querySelectorAll(".door-filter")
          .forEach((chk) => (chk.checked = false));

        document
          .querySelectorAll(".seat-filter")
          .forEach((chk) => (chk.checked = false));

        document
          .querySelectorAll(".fuel-filter")
          .forEach((chk) => (chk.checked = false));

        filteredCars = [...allCars];
        displayCars = [...filteredCars];
        visible = 0;
        container.innerHTML = "";
        showMore();
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerText = "Load More Offers";

        updateResultsCount("");

        selectAllBodyTypes();
        updateBodyTypeCounts(filteredCars);
        renderActiveFilterTags();
      } finally {
        const overlay2 = getListaOverlay();
        if (overlay2) overlay2.style.display = "none";
      }
    }, 750);
  });

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  function applySearch() {
    resetRangeSliders();
    document
      .querySelectorAll("#brandsContainer input[type='checkbox']")
      .forEach((chk) => (chk.checked = false));

    document
      .querySelectorAll(
        "#advancedSection input[type='checkbox'][value='manuala'], #advancedSection input[type='checkbox'][value='automata']",
      )
      .forEach((chk) => (chk.checked = false));

    document
      .querySelectorAll(".door-filter")
      .forEach((chk) => (chk.checked = false));

    document
      .querySelectorAll(".seat-filter")
      .forEach((chk) => (chk.checked = false));

    document
      .querySelectorAll(".fuel-filter")
      .forEach((chk) => (chk.checked = false));

    const query = searchInput.value.toLowerCase().trim();

    container.innerHTML = `
        <div class="loading-box">
            <i class="fa-solid fa-spinner spin-icon" "></i>  
        </div>
    `;
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fa-solid fa-spinner spin-iconSearch"></i>';

    setTimeout(() => {
      if (query.length === 0) {
        filteredCars = [...allCars];
      } else {
        const keywords = query.split(" ").filter((k) => k.length > 0);

        filteredCars = allCars.filter((m) => {
          const haystack =
            `${m.marca} ${m.model} ${m.an} ${m.kilometraj} ${m.pret}`.toLowerCase();

          return keywords.every((kw) => haystack.includes(kw));
        });
      }

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
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';

        filteredCars = [];
        displayCars = [];
        updateResultsCount(query);
        updateBodyTypeCounts(filteredCars);
        renderActiveFilterTags();
        return;
      }

      displayCars = [...filteredCars];
      visible = 0;
      container.innerHTML = "";
      showMore();
      loadMoreBtn.disabled = false;
      loadMoreBtn.innerText = "Load More Offers";

      searchBtn.disabled = false;
      searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';

      updateResultsCount(query);
      updateBodyTypeCounts(filteredCars);
      renderActiveFilterTags();
    }, 750); // delay vizual
  }

  searchBtn.addEventListener("click", applySearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applySearch();
  });

  const autoList = document.getElementById("autocompleteList");

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();

    autoList.innerHTML = "";
    autoList.style.display = "none";
    if (query.length < 3) return;
    const suggestions = allCars
      .map((c) => `${c.marca} ${c.model} ${c.an}`)
      .filter((txt) => txt.toLowerCase().includes(query))
      .slice(0, 10);
    if (suggestions.length === 0) return;
    autoList.style.display = "block";
    suggestions.forEach((s) => {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      item.textContent = s;
      item.onclick = () => {
        searchInput.value = s;
        autoList.innerHTML = "";
        autoList.style.display = "none";

        applySearch();

        searchInput.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter" }),
        );
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
    const count = displayCars.length;
    if (!displayCars || count === 0) {
      resultsDiv.style.display = "none";
      return;
    }

    resultsDiv.style.display = "block";

    const resultWord = count === 1 ? "result" : "results";
    const carWord = count === 1 ? "car" : "cars";
    const carVerb = count === 1 ? "matches" : "match";

    if (count === allCars.length && queryText === "") {
      resultsDiv.innerHTML = `Showing all ${count} available ${carWord}`;
      return;
    }

    if (queryText) {
      resultsDiv.innerHTML = `${count} ${resultWord} found for "<strong>${queryText}</strong>"`;
    } else {
      resultsDiv.innerHTML = `${count} ${carWord} ${carVerb} your filters`;
    }
  }

  const advancedToggle = document.getElementById("advancedToggle");
  const advancedSection = document.getElementById("advancedSection");

  let advancedOpen = false;

  advancedToggle.addEventListener("click", () => {
    advancedOpen = !advancedOpen;
    if (advancedOpen) {
      advancedSection.style.display = "block";
      advancedToggle.innerHTML =
        '<i class="fa-solid fa-atom"></i> Advanced Options ▲';
    } else {
      advancedSection.style.display = "none";
      advancedToggle.innerHTML =
        '<i class="fa-solid fa-atom"></i> Advanced Options ▼';
    }
  });
  initSignInRequiredPopup();
});

