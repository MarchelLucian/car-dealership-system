

// schimbă starea mașinii
function toggleStatus(carId, iconElem) {

    const td = iconElem.closest("td");
    const btn = td.querySelector(".status-btn");

    //  ASCUNDEM ICONIȚA
    iconElem.style.display = "none";

    //  ÎNLOCUIM TEXTUL BUTONULUI CU SPINNER
    btn.innerHTML = `<i class="fa-solid fa-spinner status-spinner"></i>`;
    btn.disabled = true;

    //  FACEM REQUEST LA BACKEND
    fetch(`/agent-dashboard/car-inventory/toggle-status/${carId}`, { method: "POST" })
        .then(response => response.text())
        .then(result => {

            //  ARĂTĂM CHECK VERDE ✔
            iconElem.classList.remove("fa-rotate");
            iconElem.classList.add("fa-check", "status-check");
            iconElem.style.display = "inline-block";

            // SCHIMBĂM STAREA ÎN FUNDAL (fără reload)
            const isAvailable = btn.classList.contains("available");

            if (isAvailable) {
                btn.classList.remove("available");
                btn.classList.add("unavailable");
            } else {
                btn.classList.remove("unavailable");
                btn.classList.add("available");
            }

            //  AȘTEPTĂM 1 SECUNDĂ CU SPINNERUL ÎN BUTON
            setTimeout(() => {

                // REVENIM LA TEXTUL NORMAL AL BUTONULUI
                if (isAvailable) {
                    btn.innerHTML = "Indisponibilă";
                } else {
                    btn.innerHTML = "Disponibilă";
                }

                btn.disabled = false;

                // REFACEM ICONIȚA
                iconElem.classList.remove("fa-check", "status-check");
                iconElem.classList.add("fa-rotate");

            }, 800);
        });
}


function goToPage(url) {
    document.getElementById("tableOverlay").style.display = "flex";

    setTimeout(() => {
        window.location.href = url;
    }, 700); // <- aici controlezi durata spinnerului
}


function showSpinner() {
    document.getElementById("tableOverlay").style.display = "flex";
}

function changePageSize() {
    const size = document.getElementById("pageSizeSelect").value;
    window.location.href = `/agent-dashboard/car-inventory?page=1&pageSize=` + size;
}

function updatePageSize() {
    const size = document.getElementById("pageSizeInput").value;

    if (size < 5 || size > 30) {
        alert("Value must be between 5 and 30.");
        return;
    }

    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";

    const url = new URL(window.location.href);
    const params = url.searchParams;

    //  Șterge complet căutarea după ID
    params.delete("searchId");

    //  Șterge complet search by model
    params.delete("modelSearch");

    params.set("page", 1);
    params.set("pageSize", size);

    setTimeout(() => {
        window.location.href = `/agent-dashboard/car-inventory?${params.toString()}`;
    }, 700);
}



function searchById() {
    const id = document.getElementById("searchIdInput").value.trim();

    if (!id || id < 1) {
        alert("Enter a valid ID (positive number).");
        return;
    }

    // opțional: punem '-' în Rows per page
    const pageSizeInput = document.getElementById("pageSizeInput");
    if (pageSizeInput) pageSizeInput.value = "";

    resetFilters();

    // afișăm spinner doar pe tabel
    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";

    // Redirect către backend
    setTimeout(() => {
        window.location.href = `/agent-dashboard/car-inventory?searchId=${id}`;
    }, 700); // <-- aici controlezi durata (în milisecunde)
}


function toggleArrow(isOpen) {
    const arrow = document.getElementById("providerArrow");

    if (isOpen) {
        arrow.classList.remove("arrow-down");
        arrow.classList.add("arrow-up");
    } else {
        setTimeout(() => {
            arrow.classList.remove("arrow-up");
            arrow.classList.add("arrow-down");
        }, 150); // mic delay ca select-ul să se închidă mai întâi
    }
}


function toggleBrands(event) {
    event.stopPropagation();   // previne click pe tot titlul

    const content = document.getElementById("brands-content");
    const arrow   = document.getElementById("brands-arrow");

    const isHidden = (content.style.display === "none" || content.style.display === "");

    if (isHidden) {
        content.style.display = "grid";
        arrow.classList.remove("fa-chevron-down");
        arrow.classList.add("fa-chevron-up");
    } else {
        content.style.display = "none";
        arrow.classList.remove("fa-chevron-up");
        arrow.classList.add("fa-chevron-down");
    }
}

function toggleProviders(event) {
    event.stopPropagation();

    const content = document.getElementById("providers-content");
    const arrow   = document.getElementById("providers-arrow");

    const hidden = content.style.display === "none" || content.style.display === "";

    if (hidden) {
        content.style.display = "grid";
        arrow.classList.replace("fa-chevron-down", "fa-chevron-up");
    } else {
        content.style.display = "none";
        arrow.classList.replace("fa-chevron-up", "fa-chevron-down");
    }
}

function resetFilters() {
    // numerice
    document.getElementById("priceMin").value = "";
    document.getElementById("priceMax").value = "";
    document.getElementById("yearMin").value = "";
    document.getElementById("yearMax").value = "";
    document.getElementById("kmMax").value = "";

    // checkbox-uri
    document.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);

    // dacă vrei și să reaplici filtrarea după reset:
    // applyFilters();
}

function toggleFilters() {
    const card = document.getElementById("filterCard");
    const icon = document.getElementById("filters-toggle-icon");
    const text = document.getElementById("filters-toggle-text");

    if (card.style.display === "none") {
        card.style.display = "block";
        icon.classList.remove("fa-sliders");
        icon.classList.add("fa-chevron-up");
        text.textContent = " Hide Filters";
    } else {
        card.style.display = "none";
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-sliders");
        text.textContent = " Show Filters";
    }
}


function selectModel(model) {
    document.getElementById("modelSearch").value = model;
    document.getElementById("modelSuggestions").style.display = "none";

    // trimitem formularul de căutare direct spre backend
    window.location.href = `/agent-dashboard/car-inventory?searchModel=${model}`;
}

// AUTOCOMPLETE
document.getElementById("modelSearchInput").addEventListener("input", function () {
    let query = this.value.trim();
    let box = document.getElementById("modelSearchSuggestions");

    if (query.length < 2) {
        box.style.display = "none";
        return;
    }

    fetch(`/agent-dashboard/car-inventory/search-model?query=` + query)
        .then(res => res.json())
        .then(data => {
            box.innerHTML = "";

            if (data.length === 0) {
                box.innerHTML = `<div class="model-suggestion-item">No model found</div>`;
                box.style.display = "block";
                return;
            }

            data.forEach(model => {
                let item = document.createElement("div");
                item.classList.add("model-suggestion-item");
                item.textContent = model;

                item.onclick = () => {
                    document.getElementById("modelSearchInput").value = model;
                    box.style.display = "none";

                    resetFilters();

                    // SPINNER pe tabel
                    const overlay = document.getElementById("tableOverlay");
                    if (overlay) overlay.style.display = "flex";

                    // redirect cu delay
                    setTimeout(() => {
                        window.location.href =
                            `/agent-dashboard/car-inventory?modelSearch=${encodeURIComponent(model)}`;
                    }, 500);
                };

                box.appendChild(item);
            });

            box.style.display = "block";
        });
});

document.getElementById("modelSearchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        let model = this.value.trim();

        const overlay = document.getElementById("tableOverlay");
        if (overlay) overlay.style.display = "flex";

        if (model === "") {
            // input gol → pagina default
            setTimeout(() => {
                window.location.href = `/agent-dashboard/car-inventory`;
            }, 500);
        } else {
            // redirect filtrat
            resetFilters();
            setTimeout(() => {
                window.location.href =
                    `/agent-dashboard/car-inventory?modelSearch=${encodeURIComponent(model)}`;
            }, 700);
        }
    }
});

document.getElementById("modelSearchButton").addEventListener("click", function () {
    let model = document.getElementById("modelSearchInput").value.trim();

    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";

    if (model === "") {
        setTimeout(() => {
            window.location.href = `/agent-dashboard/car-inventory`;
        }, 500);
    } else {
        setTimeout(() => {
            resetFilters();
            window.location.href =
                `/agent-dashboard/car-inventory?modelSearch=${encodeURIComponent(model)}`;
        }, 700);
    }
});

function applyFilters() {

    const params = new URLSearchParams();

    // —–––––––––––––––––––––––––––––
    //  1) Păstrăm pageSize curent
    // —–––––––––––––––––––––––––––––
    const pageSize = document.getElementById("pageSizeInput").value;
    if (pageSize) {
        params.append("pageSize", pageSize);
        params.append("page", 1); // mergem la pagina 1
    }

    // numeric
    let priceMin = document.getElementById("priceMin").value;
    let priceMax = document.getElementById("priceMax").value;
    let yearMin  = document.getElementById("yearMin").value;
    let yearMax  = document.getElementById("yearMax").value;
    let kmMax    = document.getElementById("kmMax").value;

    if (priceMin) params.append("priceMin", priceMin);
    if (priceMax) params.append("priceMax", priceMax);
    if (yearMin)  params.append("yearMin", yearMin);
    if (yearMax)  params.append("yearMax", yearMax);
    if (kmMax)    params.append("kmMax", kmMax);

    // brands
    document.querySelectorAll("#brands-content input:checked").forEach(cb => {
        params.append("brands", cb.value);
    });

    // providers
    document.querySelectorAll("#providers-content input:checked").forEach(cb => {
        params.append("providers", cb.value);
    });

    // transmissions
    document.querySelectorAll(".row-options-center input:checked").forEach(cb => {
        if (cb.value === "manuala" || cb.value === "automata") {
            params.append("transmissions", cb.value);
        }
    });

    // fuel
    document.querySelectorAll(".row-options input:checked").forEach(cb => {
        params.append("fuels", cb.value);
    });

    // doors
    document.querySelectorAll(".row-options-center input:checked").forEach(cb => {
        if (cb.value === "2" || cb.value === "4")
            params.append("doors", cb.value);
    });

    // seats
    document.querySelectorAll(".seat-option input:checked").forEach(cb => {
        params.append("seats", cb.value);
    });

    // pornește spinner pe tabel
    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";

    // redirect
    setTimeout(() => {
        window.location.href = "/agent-dashboard/car-inventory?" + params.toString();
    }, 700);
}


document.getElementById("sortOrder").addEventListener("change", function () {
    const icon = document.querySelector("#sortButton i");

    if (this.value === "asc") {
        icon.className = "fa-solid fa-arrow-down-short-wide";
    } else {
        icon.className = "fa-solid fa-arrow-down-wide-short";
    }
});

function applySort() {

    // 1) Activează overlay imediat
    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";

    const field = document.getElementById("sortField").value;
    const order = document.getElementById("sortOrder").value;
    const pageSize = document.getElementById("pageSizeInput").value || 10;

    // 2) Preluăm toți parametrii existenți (filtre, search, etc.)
    const params = new URLSearchParams(window.location.search);

    // 3) Setăm valorile noi
    params.set("sortField", field);
    params.set("sortOrder", order);
    params.set("page", 1);
    params.set("pageSize", pageSize);

    // 4) Construim noul URL
    const newUrl = "/agent-dashboard/car-inventory?" + params.toString();

    // 5) Timeout scurt – overlay să rămână vizibil o fracțiune înainte de redirect
    setTimeout(() => {
        window.location.href = newUrl;
    }, 700);
}

// AUTOCOMPLETE VIN
document.getElementById("vinSearchInput").addEventListener("input", function () {
    let query = this.value.trim();
    let box = document.getElementById("vinSearchSuggestions");

    if (query.length < 2) {
        box.style.display = "none";
        return;
    }

    fetch(`/agent-dashboard/car-inventory/search-vin?query=` + query)
        .then(res => res.json())
        .then(data => {
            box.innerHTML = "";

            if (data.length === 0) {
                box.innerHTML =
                    `<div class="model-suggestion-item">No VIN found</div>`;
                box.style.display = "block";
                return;
            }

            data.forEach(vin => {
                let item = document.createElement("div");
                item.classList.add("model-suggestion-item");
                item.textContent = vin;

                item.onclick = () => {
                    document.getElementById("vinSearchInput").value = vin;
                    box.style.display = "none";

                    resetFilters();

                    const overlay = document.getElementById("tableOverlay");
                    if (overlay) overlay.style.display = "flex";

                    setTimeout(() => {
                        window.location.href =
                            `/agent-dashboard/car-inventory?vinSearch=${encodeURIComponent(vin)}`;
                    }, 500);
                };

                box.appendChild(item);
            });

            box.style.display = "block";
        });
});

document.getElementById("vinSearchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        let vin = this.value.trim();

        const overlay = document.getElementById("tableOverlay");
        if (overlay) overlay.style.display = "flex";

        if (vin === "") {
            setTimeout(() => {
                window.location.href = `/agent-dashboard/car-inventory`;
            }, 500);
        } else {
            resetFilters();
            setTimeout(() => {
                window.location.href =
                    `/agent-dashboard/car-inventory?vinSearch=${encodeURIComponent(vin)}`;
            }, 700);
        }
    }
});

document.getElementById("vinSearchButton").addEventListener("click", function () {
    let vin = document.getElementById("vinSearchInput").value.trim();

    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";

    if (vin === "") {
        setTimeout(() => {
            window.location.href = `/agent-dashboard/car-inventory`;
        }, 500);
    } else {
        setTimeout(() => {
            resetFilters();
            window.location.href =
                `/agent-dashboard/car-inventory?vinSearch=${encodeURIComponent(vin)}`;
        }, 700);
    }
});
