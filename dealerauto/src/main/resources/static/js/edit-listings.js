// ===============================
// PREVENT ENTER SUBMIT
// ===============================
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
        e.preventDefault();
    }
});
// ===============================
// HIDE FLASH MESSAGES
// ===============================
function hideFlashMessages() {
    const successMsg = document.querySelector(".success-message");
    if (successMsg) successMsg.style.display = "none";

    const errorMsg = document.querySelector(".error-message");
    if (errorMsg) errorMsg.style.display = "none";

}

function showMarkupSpinner() {
    const markupInput = document.getElementById("newPriceMarkup");
    if (!markupInput) return;

    markupInput.classList.remove("positive", "negative");
    markupInput.value = "";
}


// ===============================
// New Markup
// ===============================
function updateNewMarkup() {

    const masinaId = document.getElementById("masina_id");
    if (!masinaId || !masinaId.value) {
        return; //  oprește complet calculul
    }

    const purchaseInput = document.getElementById("pretAchizitie");
    const newPriceInput = document.getElementById("pretVanzareNou");
    const markupInput = document.getElementById("newPriceMarkup");

    if (!purchaseInput || !newPriceInput || !markupInput) return;

    const purchasePrice = parseFloat(
        purchaseInput.value.replace("€", "").trim()
    );
    const newSellingPrice = parseFloat(newPriceInput.value);

    // dacă nu avem valori valide → placeholder
    if (!purchasePrice || !newSellingPrice || newSellingPrice <= 0) {
        markupInput.value = "------";
        markupInput.classList.remove("positive", "negative");
        return;
    }


    showMarkupSpinner();

    setTimeout(() => {
        if (!document.getElementById("masina_id").value) {
            return;
        }
    const markup = ((newSellingPrice - purchasePrice) / purchasePrice) * 100;
    const sign = markup > 0 ? "+" : "";

    markupInput.value = `${sign}${markup.toFixed(2)}%`;

    // colorare
    markupInput.classList.remove("positive", "negative");
    if (markup > 0) markupInput.classList.add("positive");
    if (markup < 0) markupInput.classList.add("negative");
    }, 400);

}

// ===============================
// VALIDARE FORM
// ===============================
function validateEditListing(event) {

    let valid = true;

    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input").forEach(e => e.classList.remove("input-error"));

    const masinaId = document.getElementById("masina_id");
    const pretNou = document.getElementById("pretVanzareNou");

    const carIdInput = document.getElementById("carIdInput");
    const carVinInput = document.getElementById("carVinInput");

    hideFlashMessages();
    if (!masinaId.value) {
        document.getElementById("error-car-validation")
            .textContent = "Please search and select a valid car (by ID or VIN).";

        carIdInput.classList.add("input-error");
        carVinInput.classList.add("input-error");

        valid = false;
    }

    if (!pretNou.value || parseFloat(pretNou.value) <= 0) {
        document.getElementById("error-new-price")
            .textContent = "Please enter a valid selling price.";
        pretNou.classList.add("input-error");
        valid = false;
    }

    if (!valid) {
        event.preventDefault();
        return;
    }

    // ----- SPINNER SUBMIT -----
    const btn = document.getElementById("editListingBtn");

    btn.disabled = true;
    document.getElementById("editListingIcon").style.display = "none";
    document.getElementById("editListingText").style.display = "none";
    document.getElementById("editListingSpinner").style.display = "inline-block";

    event.preventDefault();
    setTimeout(() => {
        btn.disabled = false;
        event.target.submit();
    }, 1200);
}

// ===============================
// DISABLE / ENABLE SEARCH
// ===============================
function disableVinSearch() {
    const vinInput = document.getElementById("carVinInput");
    const vinBtn = vinInput.nextElementSibling;

    vinInput.disabled = true;
    vinBtn.disabled = true;

    vinInput.classList.add("disabled-input");
    vinBtn.classList.add("disabled-btn");
}

function disableIdSearch() {
    const idInput = document.getElementById("carIdInput");
    const idBtn = idInput.nextElementSibling;

    idInput.disabled = true;
    idBtn.disabled = true;

    idInput.classList.add("disabled-input");
    idBtn.classList.add("disabled-btn");
}

function enableVinSearch() {
    const input = document.getElementById("carVinInput");
    const btn = input.nextElementSibling;

    input.disabled = false;
    btn.disabled = false;

    input.classList.remove("disabled-input");
    btn.classList.remove("disabled-btn");
}

function enableIdSearch() {
    const input = document.getElementById("carIdInput");
    const btn = input.nextElementSibling;

    input.disabled = false;
    btn.disabled = false;

    input.classList.remove("disabled-input");
    btn.classList.remove("disabled-btn");
}

function updateMarkup(purchasePrice, sellingPrice) {

    const markupInput = document.getElementById("priceMarkup");

    // reset
    markupInput.classList.remove("positive", "negative");

    if (!purchasePrice || !sellingPrice) {
        markupInput.value = "------";
        return;
    }

    const markup = ((sellingPrice - purchasePrice) / purchasePrice) * 100;

    const sign = markup > 0 ? "+" : "";
    markupInput.value = `${sign}${markup.toFixed(2)}%`;

    // colorare
    if (markup > 0) markupInput.classList.add("positive");
    if (markup < 0) markupInput.classList.add("negative");
}

// ===============================
// RESET READ-ONLY PRICE FIELDS
// ===============================
function resetListingPrices() {

    const pretAch = document.getElementById("pretAchizitie");
    const pretVanz = document.getElementById("pretVanzareCurent");
    const markup = document.getElementById("priceMarkup");

    if (pretAch) pretAch.value = "------";
    if (pretVanz) pretVanz.value = "------";

    if (markup) {
        markup.value = "------";
        markup.classList.remove("positive", "negative");
    }

    // NEW SELLING PRICE
    const newPriceInput = document.getElementById("pretVanzareNou");
    if (newPriceInput) {
        newPriceInput.value = "";
        newPriceInput.classList.remove("input-error");
    }

    // NEW MARKUP
    const newMarkupInput = document.getElementById("newPriceMarkup");
    if (newMarkupInput) {
        newMarkupInput.value = "------";
        newMarkupInput.classList.remove("positive", "negative");
    }
}




// ===============================
// SEARCH BY ID
// ===============================
function searchCarById() {

    const id = document.getElementById("carIdInput").value;
    const lookupError = document.getElementById("error-car-lookup");
    const infoBox = document.getElementById("carInfoBox");
    const hiddenId = document.getElementById("masina_id");

    const btn = document.getElementById("searchIdBtn");
    const searchIcon = document.getElementById("idSearchIcon");
    const spinner = document.getElementById("idSpinner");

    lookupError.textContent = "";
    infoBox.style.display = "none";
    hiddenId.value = "";

    // ascunde mesajele Flash
    hideFlashMessages();
    resetListingPrices();


    if (!id || id.trim() === "") {
        lookupError.textContent = "Please enter a car ID.";
        return;
    }

    searchIcon.style.display = "none";
    spinner.style.display = "inline-block";
    btn.disabled = true;

    setTimeout(() => {
        fetch(`/agent-dashboard/cars-management/lookup-car-for-listing?id=${id}`)
            .then(res => res.json())
            .then(data => {

                if (!data.found) {
                    lookupError.textContent = data.message;
                    return;
                }

                hiddenId.value = data.id;
                document.getElementById("carVinInput").value = data.vin;

                disableVinSearch();

                // PREȚURI
                document.getElementById("pretAchizitie").value = data.pretAchizitie;
                document.getElementById("pretVanzareCurent").value = data.pretVanzare;

                updateMarkup(data.pretAchizitie, data.pretVanzare);

                infoBox.innerHTML = `
                    <strong>Vehicle Information</strong>
                    <div class="car-columns">
                        <div><span>Brand</span>${data.marca}</div>
                        <div><span>Model</span>${data.model}</div>
                        <div><span>Year</span>${data.an}</div>
                        <div><span>Mileage (km)</span>${data.km}</div>
                        <div><span>Transmission</span>${data.transmisie}</div>
                        <div><span>Fuel</span>${data.combustibil}</div>
                        <div><span>Seats</span>${data.numar_locuri}</div>
                        <div><span>Color</span>${data.culoare}</div>
                    </div>
                `;
                infoBox.style.display = "block";
            })
            .finally(() => {
                spinner.style.display = "none";
                searchIcon.style.display = "inline-block";
                btn.disabled = false;
            });
    }, 1200);
}


// ===============================
// SEARCH BY VIN
// ===============================
function searchCarByVin() {

    const vin = document.getElementById("carVinInput").value;
    const lookupError = document.getElementById("error-car-lookup");
    const infoBox = document.getElementById("carInfoBox");
    const hiddenId = document.getElementById("masina_id");

    const btn = document.getElementById("searchVinBtn");
    const searchIcon = document.getElementById("vinSearchIcon");
    const spinner = document.getElementById("vinSpinner");

    lookupError.textContent = "";
    infoBox.style.display = "none";
    hiddenId.value = "";

    // ascunde mesajele Flash
    hideFlashMessages();
    resetListingPrices();

    if (!vin || vin.trim() === "") {
        lookupError.textContent = "Please enter a VIN.";
        return;
    }

    searchIcon.style.display = "none";
    spinner.style.display = "inline-block";
    btn.disabled = true;

    setTimeout(() => {
        fetch(`/agent-dashboard/cars-management/lookup-car-for-listing-by-vin?vin=${encodeURIComponent(vin)}`)
            .then(res => res.json())
            .then(data => {

                if (!data.found) {
                    lookupError.textContent = data.message;
                    return;
                }

                hiddenId.value = data.id;
                document.getElementById("carIdInput").value = data.id;

                disableIdSearch();

                // PREȚURI
                document.getElementById("pretAchizitie").value = data.pretAchizitie;
                document.getElementById("pretVanzareCurent").value = data.pretVanzare;

                updateMarkup(data.pretAchizitie, data.pretVanzare);

                infoBox.innerHTML = `
                    <strong>Vehicle Information</strong>
                    <div class="car-columns">
                        <div><span>Brand</span>${data.marca}</div>
                        <div><span>Model</span>${data.model}</div>
                        <div><span>Year</span>${data.an}</div>
                        <div><span>Mileage (km)</span>${data.km}</div>
                        <div><span>Transmission</span>${data.transmisie}</div>
                        <div><span>Fuel</span>${data.combustibil}</div>
                        <div><span>Seats</span>${data.numar_locuri}</div>
                        <div><span>Color</span>${data.culoare}</div>
                    </div>
                `;
                infoBox.style.display = "block";
            })
            .finally(() => {
                spinner.style.display = "none";
                searchIcon.style.display = "inline-block";
                btn.disabled = false;
            });
    }, 1200);
}




// ===============================
// DOM READY – INPUT LISTENERS
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    const carIdInput = document.getElementById("carIdInput");
    const carVinInput = document.getElementById("carVinInput");

    if (carIdInput) {
        carIdInput.addEventListener("input", () => {
            const idVal = carIdInput.value;

            // dacă ID a fost șters → reactivăm VIN + resetăm selecția
            if (!idVal || idVal.trim() === "") {
                enableVinSearch();

            }
        });
    }

    if (carVinInput) {
        carVinInput.addEventListener("input", () => {
            const vinVal = carVinInput.value;

            // dacă VIN a fost șters → reactivăm ID + resetăm selecția
            if (!vinVal || vinVal.trim() === "") {
                enableIdSearch();

            }
        });
    }

    /* ===============================
       NEW SELLING PRICE → NEW MARKUP
    =============================== */

    const newPriceInput = document.getElementById("pretVanzareNou");

    if (newPriceInput ) {

        // ENTER  calculează New Markup
        newPriceInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); // nu submit form
                updateNewMarkup();
            }
        });

        // CLICK ÎN AFARĂ  calculează New Markup
        newPriceInput.addEventListener("blur", () => {
            if (newPriceInput.value && newPriceInput.value.trim() !== "") {
                updateNewMarkup();
            }
        });
    }

});

// ===============================
// CLEAR FORM
// ===============================
function clearEditListingForm() {

    // reset input-uri (inclusiv newSellingPrice)
    document.querySelectorAll("input").forEach(i => i.value = "");

    // reset erori
    document.querySelectorAll(".error-msg")
        .forEach(e => e.textContent = "");


    const newPriceInput = document.getElementById("pretVanzareNou");
    if (newPriceInput) {
        newPriceInput.classList.remove("input-error");
    }

    const carVinInput = document.getElementById("carVinInput");
    if (carVinInput) {
        carVinInput.classList.remove("input-error");
    }

    const carIdInput = document.getElementById("carIdInput");
    if (carIdInput) {
        carIdInput.classList.remove("input-error");
    }

    // ascunde info box
    const infoBox = document.getElementById("carInfoBox");
    if (infoBox) infoBox.style.display = "none";

    // RESET CURRENT MARKUP
    const markupInput = document.getElementById("priceMarkup");
    if (markupInput) {
        markupInput.value = "";
        markupInput.classList.remove("positive", "negative");
    }

    // RESET NEW MARKUP
    const newMarkupInput = document.getElementById("newPriceMarkup");
    if (newMarkupInput) {
        newMarkupInput.value = "";
        newMarkupInput.classList.remove("positive", "negative");
    }

    // re-enable search
    enableIdSearch();
    enableVinSearch();

    // ascunde mesajele backend
    hideFlashMessages();
}
