function moveAfter(refElem, elemToMove) {
    refElem.insertAdjacentElement("afterend", elemToMove);
}

function toggleInfoSpinner(btn, show) {
    const wrapper = btn.parentElement;
    const spinner = wrapper.querySelector(".info-spinner");

    if (show) {
        btn.style.display = "none";
        spinner.style.display = "inline-block";
    } else {
        spinner.style.display = "none";
        btn.style.display = "inline-block";
    }
}
function showCarInfo(btn) {
    const saleId = btn.dataset.saleId;
    const carId = btn.dataset.carId;

    const carRow = document.getElementById(`car-details-${saleId}`);
    const clientRow = document.getElementById(`client-details-${saleId}`);
    const mainRow = btn.closest(".sales-row");

    // toggle OFF
    if (carRow.classList.contains("visible")) {
        carRow.classList.remove("visible");
        carRow.innerHTML = "";
        return;
    }

    // ===== PORNEȘTE SPINNER  =====
    const spinner = btn.nextElementSibling;   // iconița spinner
    btn.style.display = "none";
    spinner.style.display = "inline-block";

    setTimeout(() => {

        fetch(`/agent-dashboard/sales/car-info?carId=${carId}`)
            .then(r => r.json())
            .then(data => {
                if (!data.found) return;

                carRow.innerHTML = `
                    <div class="details-content">
                        <div class="denum">Car details</div>
                        <div><span>Year:</span> ${data.year}</div>
                        <div><span>Mileage:</span> ${data.mileage} km</div>
                        <div><span>Transmission:</span> ${data.transmission}</div>
                        <div><span>VIN:</span> ${data.vin}</div>

                        <i class="fa-regular fa-circle-xmark close-btn"
                           onclick="closeDetails('${carRow.id}')"></i>
                    </div>
                `;

                // ORDINE CORECTĂ
                if (clientRow.classList.contains("visible")) {
                    clientRow.after(carRow);
                } else {
                    mainRow.after(carRow);
                }

                carRow.classList.add("visible");
            })
            .finally(() => {
                // ===== OPREȘTE SPINNER =====
                spinner.style.display = "none";
                btn.style.display = "inline-block";
            });

    }, 1000); // exact ca la add-brand
}

function getMainSalesRows() {
    return Array.from(
        document.querySelectorAll(".sales-row")
    ).filter(row =>
        !row.classList.contains("sales-header") &&
        !row.classList.contains("details-row") &&
        row.id !== "noResultsRow"
    );
}


function showClientInfo(btn) {
    const saleId = btn.dataset.saleId;
    const clientId = btn.dataset.clientId;

    const clientRow = document.getElementById(`client-details-${saleId}`);
    const carRow = document.getElementById(`car-details-${saleId}`);
    const mainRow = btn.closest(".sales-row");

    if (clientRow.classList.contains("visible")) {
        clientRow.classList.remove("visible");
        clientRow.innerHTML = "";
        return;
    }

    const spinner = btn.nextElementSibling;
    btn.style.display = "none";
    spinner.style.display = "inline-block";

    setTimeout(() => {

        fetch(`/agent-dashboard/sales/client-info?clientId=${clientId}`)
            .then(r => r.json())
            .then(data => {
                if (!data.found) return;

                clientRow.innerHTML = `
                    <div class="details-content">
                        <div class="denum">Client details</div>
                        <div><span>Type:</span> ${data.type}</div>
                        <div><span>Phone:</span> ${data.phone}</div>
                        <div><span>Email:</span> ${data.email}</div>

                        <i class="fa-regular fa-circle-xmark close-btn"
                           onclick="closeDetails('${clientRow.id}')"></i>
                    </div>
                `;

                if (carRow.classList.contains("visible")) {
                    carRow.after(clientRow);
                } else {
                    mainRow.after(clientRow);
                }

                clientRow.classList.add("visible");
            })
            .finally(() => {
                spinner.style.display = "none";
                btn.style.display = "inline-block";
            });

    }, 1000);
}


function closeDetails(id) {
    const row = document.getElementById(id);
    row.classList.remove("visible");
    row.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const sortOrder = document.getElementById("sortOrder");
    const icon = document.querySelector("#sortButton i");

    sortOrder.addEventListener("change", () => {
        if (sortOrder.value === "asc") {
            icon.classList.remove("fa-arrow-down-wide-short");
            icon.classList.add("fa-arrow-down-short-wide");
        } else {
            icon.classList.remove("fa-arrow-down-short-wide");
            icon.classList.add("fa-arrow-down-wide-short");
        }
    });
});

function closeAllDetailsRows() {
    document.querySelectorAll(".details-row.visible").forEach(row => {
        row.classList.remove("visible");
        row.innerHTML = "";
    });
}



function sortSales() {

    // 1 Activează overlay
    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";


    const field = document.getElementById("sortField").value;
    const order = document.getElementById("sortOrder").value;

    const container = document.querySelector(".sales-container");

    //  doar rândurile principale (NU details-row)
    const rows = getMainSalesRows();

    // 2 Mic delay pentru efect vizual (ca la car-inventory)
    setTimeout(() => {
        closeAllDetailsRows();

        rows.sort((a, b) => {
            let valA, valB;

            switch (field) {
                case "price":
                    valA = parseFloat(a.children[3]?.innerText || 0);
                    valB = parseFloat(b.children[3]?.innerText || 0);
                    break;

                case "profit":
                    valA = parseFloat(a.children[4]?.innerText || 0);
                    valB = parseFloat(b.children[4]?.innerText || 0);
                    break;

                case "markup":
                    valA = parseFloat(
                        (a.children[5]?.innerText || "0").replace("%", "")
                    );
                    valB = parseFloat(
                        (b.children[5]?.innerText || "0").replace("%", "")
                    );
                    break;

                case "date":
                    valA = new Date(a.children[6]?.innerText || "1970-01-01");
                    valB = new Date(b.children[6]?.innerText || "1970-01-01");
                    break;

                case "status":
                    valA = a.children[7]?.innerText || "";
                    valB = b.children[7]?.innerText || "";
                    break;
            }

            if (valA < valB) return order === "asc" ? -1 : 1;
            if (valA > valB) return order === "asc" ? 1 : -1;
            return 0;
        });


        // Reatașăm rândurile sortate
        rows.forEach(row => container.appendChild(row));

        updateSalesSummary();

        //  Oprim overlay-ul
        if (overlay) overlay.style.display = "none";

    }, 1000);
}

function resetAllTimeFilters() {
    const monthsInput = document.getElementById("monthsInput");
    const dateFrom = document.getElementById("dateFrom");
    const dateTo = document.getElementById("dateTo");
    const predefined = document.getElementById("predefinedRange");

    if (monthsInput) monthsInput.value = "";
    if (dateFrom) dateFrom.value = "";
    if (dateTo) dateTo.value = "";
    if (predefined) predefined.value = ""; // "-" (gol)
}


function clearMonthsInput() {
    const el = document.getElementById("monthsInput");
    if (el) el.value = "";
}

function clearBetweenDates() {
    const from = document.getElementById("dateFrom");
    const to = document.getElementById("dateTo");
    if (from) from.value = "";
    if (to) to.value = "";
}

function clearPredefinedRange() {
    const el = document.getElementById("predefinedRange");
    if (el) el.value = ""; // "-"
}


function getSaleDate(row) {
    const cell = row.children[6];
    if (!cell) return null;
    return new Date(cell.innerText);
}


function filterLastMonths() {
    clearBetweenDates();
    clearPredefinedRange();

    const months = parseInt(document.getElementById("monthsInput").value);
    if (!months) return;

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    applyDateFilter(date => date >= cutoff);
}

function filterBetweenDates() {
    clearMonthsInput();
    clearPredefinedRange();

    const from = document.getElementById("dateFrom").value;
    const to = document.getElementById("dateTo").value;

    if (!from || !to) return;

    const fromDate = new Date(from);
    const toDate = new Date(to);

    applyDateFilter(date => date >= fromDate && date <= toDate);
}

function filterQuickRange() {
    clearMonthsInput();
    clearBetweenDates();

    const value = document.getElementById("predefinedRange").value;

    // "-" selectat => nu face nimic
    if (value === "") return;

    // All time
    if (value === "all") {
        applyDateFilter(() => true);
        return;
    }

    const now = new Date();
    const days = parseInt(value, 10);

    const from = new Date();
    from.setDate(now.getDate() - days);

    applyDateFilter(date => date >= from);
}


function applyDateFilter(predicate) {

    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";

    const overlayProfit = document.getElementById("tableOverlayProfit");
    overlayProfit.style.display =
        overlayProfit.style.display === "flex" ? "none" : "flex";


    const overlayCount = document.getElementById("tableOverlayCount");
    overlayCount.style.display =
        overlayCount.style.display === "flex" ? "none" : "flex";

    const clientInput = document.getElementById("clientSearchInput");
    const carInput = document.getElementById("carSearchInput");

    const clientSuggestions = document.getElementById("clientSearchSuggestions");
    const carSuggestions = document.getElementById("carSearchSuggestions");

    setTimeout(() => {
        closeAllDetailsRows();
        hideNoResults();

        const rows = getMainSalesRows();
        let found = false;

        rows.forEach(row => {
            const saleDate = getSaleDate(row);
            if (!saleDate) {
                row.style.display = "none";
                return;
            }

            const match = predicate(saleDate);
            row.style.display = match ? "grid" : "none";
            if (match) found = true;
        });

        if (!found) {
            showNoResults("No sales found for selected period");
        }

        if (clientInput) clientInput.value = "";
        if (carInput) carInput.value = "";

        if (clientSuggestions) clientSuggestions.style.display = "none";
        if (carSuggestions) carSuggestions.style.display = "none";

        updateSalesSummary();

        if (overlay) overlay.style.display = "none";
        if (overlayProfit) overlayProfit.style.display = "none";
        if (overlayCount) overlayCount.style.display = "none";
    }, 1100);
}

function showAllRows() {
    closeAllDetailsRows();
    hideNoResults();

    const rows = getMainSalesRows();
    rows.forEach(row => row.style.display = "grid");
}


function showNoResults(message) {
    const row = document.getElementById("noResultsRow");
    const text = row?.querySelector(".no-results-text");

    if (!row || !text) return;

    text.textContent = message;
    row.style.display = "grid";
}

function hideNoResults() {
    const row = document.getElementById("noResultsRow");
    if (row) row.style.display = "none";
}


function getAllClientsFromTable() {
    const rows = getMainSalesRows();

    const clients = new Set();

    rows.forEach(row => {
        const clientCell = row.children[2]; // coloana Client
        if (clientCell) {
            const name = clientCell.querySelector("span")?.innerText.trim();
            if (name) clients.add(name);
        }
    });

    return Array.from(clients);
}

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("clientSearchInput");
    const suggestionsBox = document.getElementById("clientSearchSuggestions");

    if (!input || !suggestionsBox) {
        console.error("Client search elements not found in DOM");
        return;
    }

    const allClients = getAllClientsFromTable();
    console.log("All clients:", allClients); // 🔎 verificare

    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        suggestionsBox.innerHTML = "";

        if (query.length < 2) {
            suggestionsBox.style.display = "none";
            return;
        }

        const matches = allClients.filter(c =>
            c.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            suggestionsBox.innerHTML =
                `<div class="model-suggestion-item">No results</div>`;
            suggestionsBox.style.display = "block";
            return;
        }

        matches.forEach(name => {
            const item = document.createElement("div");
            item.className = "model-suggestion-item";
            item.textContent = name;

            item.onclick = () => {
                input.value = name;
                suggestionsBox.style.display = "none";
                filterSalesByClient(name);
            };

            suggestionsBox.appendChild(item);
        });

        suggestionsBox.style.display = "block";
    });

    // Enter = cautare
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            filterSalesByClient(input.value.trim());
            suggestionsBox.style.display = "none";
        }
    });

});

function filterSalesByClient(clientName) {
    const rows = getMainSalesRows();

    //  overlay ON
    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";

    const overlayProfit = document.getElementById("tableOverlayProfit");
    overlayProfit.style.display =
        overlayProfit.style.display === "flex" ? "none" : "flex";


    const overlayCount = document.getElementById("tableOverlayCount");
    overlayCount.style.display =
        overlayCount.style.display === "flex" ? "none" : "flex";

    // 3 închide details rows
    closeAllDetailsRows();
    hideNoResults();

    setTimeout(() => {
    let found = false;
    rows.forEach(row => {
        const cell = row.children[2];
        const name = cell?.querySelector("span")?.innerText.trim();

        const match =
            name && name.toLowerCase().includes(clientName.toLowerCase());

        row.style.display = match ? "grid" : "none";

        if (match) found = true;
    });
        if (!found) {
            showNoResults(`No results found for "${clientName}"`);
        }

        //  golim
        const carInput = document.getElementById("carSearchInput");
        if (carInput) carInput.value = "";

        const carSuggestions = document.getElementById("carSearchSuggestions");
        if (carSuggestions) carSuggestions.style.display = "none";

        const clientSuggestions = document.getElementById("clientSearchSuggestions");
        if (clientSuggestions) clientSuggestions.style.display = "none";
        //  reset alte filtre
        resetAllTimeFilters();
        updateSalesSummary();

        //  overlay OFF
        if (overlay) overlay.style.display = "none";
        if (overlayProfit) overlayProfit.style.display = "none";
        if (overlayCount) overlayCount.style.display = "none";
    }, 1000);
}

function filterByClient() {
    const input = document.getElementById("clientSearchInput");
    if (!input) return;

    const value = input.value.trim();
    if (value === "") return;

    filterSalesByClient(value);
}


function getAllCarsFromTable() {
    const rows = getMainSalesRows();

    const cars = new Set();

    rows.forEach(row => {
        const carCell = row.children[1]; // coloana Car
        if (carCell) {
            const name = carCell.querySelector("span")?.innerText.trim();
            if (name) cars.add(name);
        }
    });

    return Array.from(cars);
}

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("carSearchInput");
    const suggestionsBox = document.getElementById("carSearchSuggestions");

    if (!input || !suggestionsBox) return;

    const allCars = getAllCarsFromTable();
    console.log("All cars:", allCars); // debug

    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        suggestionsBox.innerHTML = "";

        if (query.length < 2) {
            suggestionsBox.style.display = "none";
            return;
        }

        const matches = allCars.filter(c =>
            c.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            suggestionsBox.innerHTML =
                `<div class="model-suggestion-item">No results</div>`;
            suggestionsBox.style.display = "block";
            return;
        }

        matches.forEach(name => {
            const item = document.createElement("div");
            item.className = "model-suggestion-item";
            item.textContent = name;

            item.onclick = () => {
                input.value = name;
                suggestionsBox.style.display = "none";
                filterSalesByCar(name);
            };

            suggestionsBox.appendChild(item);
        });

        suggestionsBox.style.display = "block";
    });

    // ENTER = search
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            filterSalesByCar(input.value.trim());
            suggestionsBox.style.display = "none";
        }
    });
});

function filterSalesByCar(carName) {
    const rows = getMainSalesRows();

    // overlay ON
    const overlay = document.getElementById("tableOverlay");
    if (overlay) overlay.style.display = "flex";

    const overlayProfit = document.getElementById("tableOverlayProfit");
    overlayProfit.style.display =
        overlayProfit.style.display === "flex" ? "none" : "flex";


    const overlayCount = document.getElementById("tableOverlayCount");
    overlayCount.style.display =
        overlayCount.style.display === "flex" ? "none" : "flex";

    closeAllDetailsRows(); // închide details
    hideNoResults();

    setTimeout(() => {
        let found = false;

        rows.forEach(row => {
            const cell = row.children[1];
            const name = cell?.querySelector("span")?.innerText.trim();

            if (name && name.toLowerCase().includes(carName.toLowerCase())) {
                row.style.display = "grid";
                found = true;
            } else {
                row.style.display = "none";
            }
        });

        if (!found) {
            showNoResults(`No results found for "${carName}"`);
        }

        // reset alte filtre
        resetAllTimeFilters();

        const clientInput = document.getElementById("clientSearchInput");
        if (clientInput) clientInput.value = "";

        const clientSuggestions = document.getElementById("clientSearchSuggestions");
        if (clientSuggestions) clientSuggestions.style.display = "none";

        const carSuggestions = document.getElementById("carSearchSuggestions");
        if (carSuggestions) carSuggestions.style.display = "none";
        // overlay OFF
        updateSalesSummary();

        if (overlay) overlay.style.display = "none";
        if (overlayProfit) overlayProfit.style.display = "none";
        if (overlayCount) overlayCount.style.display = "none";
    }, 1000);
}
function filterByCar() {
    const input = document.getElementById("carSearchInput");
    const value = input.value.trim();

    if (!value) return;

    filterSalesByCar(value);
}

document.addEventListener("click", (e) => {

    const clientWrapper = document.querySelector("#clientSearchInput")?.closest(".model-search-wrapper");
    const carWrapper = document.querySelector("#carSearchInput")?.closest(".model-search-wrapper");

    // CLIENT dropdown
    if (clientWrapper && !clientWrapper.contains(e.target)) {
        const box = document.getElementById("clientSearchSuggestions");
        if (box) box.style.display = "none";
    }

    // CAR dropdown
    if (carWrapper && !carWrapper.contains(e.target)) {
        const box = document.getElementById("carSearchSuggestions");
        if (box) box.style.display = "none";
    }
});

function updateSalesSummary() {
    const rows = document.querySelectorAll(
        ".sales-row:not(.sales-header):not(.details-row)"
    );

    let totalProfit = 0;
    let count = 0;

    rows.forEach(row => {
        if (row.style.display === "none") return;

        const profitCell = row.children[4];
        if (!profitCell) return;

        const profit = parseFloat(profitCell.innerText);
        if (!isNaN(profit)) {
            totalProfit += profit;
            count++;
        }
    });

    document.getElementById("totalProfit").innerText =
        totalProfit.toFixed(2);

    document.getElementById("salesCount").innerText = count;
}

document.addEventListener("DOMContentLoaded", () => {
    updateSalesSummary();

    document.querySelectorAll(".markup").forEach(cell => {
        const finalPrice = parseFloat(cell.dataset.finalPrice);
        const profit = parseFloat(cell.dataset.profit);

        const purchasePrice = finalPrice - profit;
        if (purchasePrice <= 0) {
            cell.textContent = "—";
            return;
        }

        const markup = (profit / purchasePrice) * 100;
        const sign = markup > 0 ? "+" : "";

        cell.textContent = `${sign}${markup.toFixed(2)}%`;
        cell.classList.add(markup >= 0 ? "markup-positive" : "markup-negative");
    });

});
