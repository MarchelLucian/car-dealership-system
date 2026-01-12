document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
        e.preventDefault();
    }
});


function openConfirmModal() {
    const modal = document.getElementById("confirmModal");

    const vinInput = document.getElementById("carVinInput");
    const confirmVin = document.getElementById("confirmVin");

    const vin = vinInput && vinInput.value ? vinInput.value : "—";
    confirmVin.textContent = vin;

    if (modal) modal.style.display = "flex";
}

function closeConfirmModal() {
    const modal = document.getElementById("confirmModal");
    if (modal) modal.style.display = "none";
}


// ===============================
// CONFIRM RETRACT (SUBMIT REAL)
// ===============================
function confirmRetractCar() {

    const btn = document.getElementById("retractCarBtn");
    const form = btn.closest("form");

    // închide modalul
    closeConfirmModal();

    // ----- PORNEȘTE SPINNER (EXACT CA ÎNAINTE) -----
    document.getElementById("retractCarText").style.display = "none";
    document.getElementById("retractCarMinus").style.display = "none";
    document.getElementById("retractCarSpinner").style.display = "inline-block";

    btn.disabled = true;

    // ⏳ Delay 0.8s înainte de submit efectiv
    setTimeout(() => {
        btn.disabled = false;
        form.submit();
    }, 1000);
}


// ===============================
// VALIDARE FORM
// ===============================
function validateRetractCar(event) {

    let valid = true;

    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, textarea").forEach(e => e.classList.remove("input-error"));

    const masinaId = document.getElementById("masina_id");
    const reason = document.getElementById("retractReason");

    const carIdInput = document.getElementById("carIdInput");
    const carVinInput = document.getElementById("carVinInput");

    if (!masinaId.value) {
        document.getElementById("error-car-validation")
            .textContent = "Please search and select a valid car (by ID or VIN).";

        carIdInput.classList.add("input-error");
        carVinInput.classList.add("input-error");

        valid = false;
    }

    if (!reason.value || reason.value.trim().length < 5) {
        document.getElementById("error-reason")
            .textContent = "Please provide a clear reason (minimum 5 characters).";
        reason.classList.add("input-error");
        valid = false;
    }

    if (!valid) {
        event.preventDefault();
        return;
    }

    // NU trimitem formularul
    event.preventDefault();

    //  DESCHIDEM MODALUL
    openConfirmModal();

}

// ===============================
// DISABLE / ENABLE SEARCH
// ===============================
function disableVinSearch() {
    const vinInput = document.getElementById("carVinInput");
    const vinBtn = document.getElementById("searchVinBtn");

    vinInput.disabled = true;
    vinBtn.disabled = true;

    vinInput.classList.add("disabled-input");
    vinBtn.classList.add("disabled-btn");
}

function disableIdSearch() {
    const idInput = document.getElementById("carIdInput");
    const idBtn = document.getElementById("searchIdBtn");

    idInput.disabled = true;
    idBtn.disabled = true;

    idInput.classList.add("disabled-input");
    idBtn.classList.add("disabled-btn");
}

function enableVinSearch() {
    const input = document.getElementById("carVinInput");
    const btn = document.getElementById("searchVinBtn");

    input.disabled = false;
    btn.disabled = false;

    input.classList.remove("disabled-input");
    btn.classList.remove("disabled-btn");
}

function enableIdSearch() {
    const input = document.getElementById("carIdInput");
    const btn = document.getElementById("searchIdBtn");

    input.disabled = false;
    btn.disabled = false;

    input.classList.remove("disabled-input");
    btn.classList.remove("disabled-btn");
}

function clearCarValidationError() {
    document.getElementById("error-car-validation").textContent = "";

    document.getElementById("carIdInput")
        .classList.remove("input-error");

    document.getElementById("carVinInput")
        .classList.remove("input-error");
}

function updateTaxaStationare(pretAchizitie) {

    const taxaInput = document.getElementById("taxaStationare");
    if (!taxaInput) return;

    const storageDaysInput = document.getElementById("storageDays");

    if (!pretAchizitie || pretAchizitie <= 0) {
        taxaInput.value = "------";
        return;
    }

    const storageDays = Number(storageDaysInput.value) || 0;

    const perioade = Math.floor(storageDays / 180) + 1;
    const taxa = perioade * pretAchizitie * 0.02;

    taxaInput.value = taxa.toFixed(2);
}



// ===============================
// SEARCH BY ID
// ===============================
function searchCarById() {
    const id = document.getElementById("carIdInput").value;
    const lookupError = document.getElementById("error-car-lookup");
    const infoBox = document.getElementById("carInfoBox");
    const providerInfoBox = document.getElementById("providerInfoBox");
    const hiddenId = document.getElementById("masina_id");

    const entryDateInput = document.getElementById("entryDate");
    const storageDaysInput = document.getElementById("storageDays");

    const btn = document.getElementById("searchIdBtn");
    const searchIcon = document.getElementById("idSearchIcon");
    const spinner = document.getElementById("idSpinner");

    lookupError.textContent = "";
    infoBox.style.display = "none";
    providerInfoBox.style.display = "none";
    hiddenId.value = "";


    // ascunde mesajele de succes / eroare venite din backend (FlashAttributes)
    const successMsg = document.querySelector(".success-message");
    if (successMsg) successMsg.style.display = "none";

    const errorMsg = document.querySelector(".error-message");
    if (errorMsg) errorMsg.style.display = "none";

    if (!id || id.trim() === "") {
        lookupError.textContent = "Please enter a car ID.";
        return;
    }

    searchIcon.style.display = "none";
    spinner.style.display = "inline-block";
    btn.disabled = true;

    setTimeout(() => {
        fetch(`/agent-dashboard/cars-management/lookup-car-with-provider?id=${id}`)
            .then(res => res.json())
            .then(data => {

                if (!data.found) {
                    lookupError.textContent = data.message;
                    return;
                }

                // ===============================
                // STORAGE ENTRY DATE + STORAGE DAYS
                // ===============================
                if (data.data_intrare_stoc) {

                    // afișăm data de intrare în stoc
                    entryDateInput.value = data.data_intrare_stoc;

                    // calcul zile de stocare
                    const entry = new Date(data.data_intrare_stoc);
                    const today = new Date();

                    const diffMs = today - entry;
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                    storageDaysInput.value = diffDays;

                } else {
                    entryDateInput.value = "------";
                    storageDaysInput.value = "------";
                }


                clearCarValidationError();

                hiddenId.value = data.id;
                document.getElementById("provider_id").value = data.provider_id;


                const vinInput = document.getElementById("carVinInput");
                vinInput.value = data.vin;

                disableVinSearch();

                // ===============================
                // SNAPSHOT pentru masini_retrase
                // ===============================

                // CAR
                document.getElementById("vin").value = data.vin;
                document.getElementById("marca_nume").value = data.marca;
                document.getElementById("model").value = data.model;
                document.getElementById("an_fabricatie").value = data.an;
                document.getElementById("kilometraj").value = data.km;
                document.getElementById("pret_achizitie").value = data.pretAchizitie;
                document.getElementById("combustibil").value = data.combustibil;
                document.getElementById("transmisie").value = data.transmisie;
                document.getElementById("numar_locuri").value = data.numar_locuri;


                updateTaxaStationare(data.pretAchizitie);
                // PROVIDER
                document.getElementById("provider_nume").value = data.provider_nume;

                infoBox.innerHTML = `
                    <strong>Vehicle Information</strong>
                    <div class="car-columns">
                        <div><span>Brand</span>${data.marca}</div>
                        <div><span>Model</span>${data.model}</div>
                        <div><span>Year</span>${data.an}</div>
                        <div><span>Mileage (km)</span>${data.km}</div>
                         <div><span>Purchase price</span>€${data.pretAchizitie}</div>
                    </div>
                `;
                infoBox.style.display = "block";

                const providerInfoBox = document.getElementById("providerInfoBox");
                providerInfoBox.innerHTML = `
    <strong>Provider Information</strong>

    <div class="client-columns">
        <div>
            <span>Name</span>
             ${data.provider_nume}
        </div>

        <div>
            <span>Type</span>
             ${data.provider_tip}
        </div>

        <div>
            <span>Phone</span>
             ${data.provider_telefon}
        </div>

        <div>
            <span>CUI / CNP</span>
             ${data.provider_cui_cnp}
        </div>
    </div>
`;

                providerInfoBox.style.display = "block";
            })
            .finally(() => {
                spinner.style.display = "none";
                searchIcon.style.display = "inline-block";
                btn.disabled = false;
            });
    }, 1200);
}

// ===============================
// SEARCH BY VIN (IDENTIC cu add-sale)
// ===============================
function searchCarByVin() {
    const vin = document.getElementById("carVinInput").value;
    const lookupError = document.getElementById("error-car-lookup");
    const infoBox = document.getElementById("carInfoBox");
    const providerInfoBox = document.getElementById("providerInfoBox");
    const hiddenId = document.getElementById("masina_id");

    const entryDateInput = document.getElementById("entryDate");
    const storageDaysInput = document.getElementById("storageDays");

    const btn = document.getElementById("searchVinBtn");
    const searchIcon = document.getElementById("vinSearchIcon");
    const spinner = document.getElementById("vinSpinner");

    lookupError.textContent = "";
    infoBox.style.display = "none";
    providerInfoBox.style.display ="none";
    hiddenId.value = "";

    // ascunde mesajele de succes / eroare venite din backend (FlashAttributes)
    const successMsg = document.querySelector(".success-message");
    if (successMsg) successMsg.style.display = "none";

    const errorMsg = document.querySelector(".error-message");
    if (errorMsg) errorMsg.style.display = "none";

    if (!vin || vin.trim() === "") {
        lookupError.textContent = "Please enter a VIN.";
        return;
    }

    searchIcon.style.display = "none";
    spinner.style.display = "inline-block";
    btn.disabled = true;

    setTimeout(() => {
        fetch(`/agent-dashboard/cars-management/lookup-car-with-provider-by-vin?vin=${encodeURIComponent(vin)}`)
            .then(res => res.json())
            .then(data => {

                if (!data.found) {
                    lookupError.textContent = data.message;
                    return;
                }



                clearCarValidationError();

                // ===============================
                // STORAGE ENTRY DATE + STORAGE DAYS
                // ===============================
                if (data.data_intrare_stoc) {

                    // afișăm data de intrare în stoc
                    entryDateInput.value = data.data_intrare_stoc;

                    // calcul zile de stocare
                    const entry = new Date(data.data_intrare_stoc);
                    const today = new Date();

                    const diffMs = today - entry;
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                    storageDaysInput.value = diffDays;

                } else {
                    entryDateInput.value = "------";
                    storageDaysInput.value = "------";
                }

                hiddenId.value = data.id;

                document.getElementById("provider_id").value = data.provider_id;

                const idInput = document.getElementById("carIdInput");
                idInput.value = data.id;

                disableIdSearch();

                // ===============================
                // SNAPSHOT pentru masini_retrase
                // ===============================

                // CAR
                document.getElementById("vin").value = data.vin;
                document.getElementById("marca_nume").value = data.marca;
                document.getElementById("model").value = data.model;
                document.getElementById("an_fabricatie").value = data.an;
                document.getElementById("kilometraj").value = data.km;
                document.getElementById("pret_achizitie").value = data.pretAchizitie;
                document.getElementById("combustibil").value = data.combustibil;
                document.getElementById("transmisie").value = data.transmisie;
                document.getElementById("numar_locuri").value = data.numar_locuri;

                updateTaxaStationare(data.pretAchizitie);

                // PROVIDER
                document.getElementById("provider_nume").value = data.provider_nume;

                infoBox.innerHTML = `
                    <strong>Vehicle Information</strong>
                    <div class="car-columns">
                        <div><span>Brand</span>${data.marca}</div>
                        <div><span>Model</span>${data.model}</div>
                        <div><span>Year</span>${data.an}</div>
                        <div><span>Mileage (km)</span>${data.km}</div>
                        <div><span>Purchase price</span>€${data.pretAchizitie}</div>
                    </div>
                `;
                infoBox.style.display = "block";


                providerInfoBox.innerHTML = `
    <strong>Provider Information</strong>

    <div class="client-columns">
        <div>
            <span>Name</span>
           ${data.provider_nume}
        </div>

        <div>
            <span>Type</span>
            ${data.provider_tip}
        </div>

        <div>
            <span>Phone</span>
           ${data.provider_telefon}
        </div>

        <div>
            <span>CUI / CNP</span>
             ${data.provider_cui_cnp}
        </div>
    </div>
`;

                providerInfoBox.style.display = "block";
            })
            .finally(() => {
                spinner.style.display = "none";
                searchIcon.style.display = "inline-block";
                btn.disabled = false;
            });
    }, 1200);
}


// ===============================
// CLEAR DETAILS (IDENTIC cu add-sale)
// ===============================
function clearRetractForm() {

    // reset input-uri
    const carIdInput = document.getElementById("carIdInput");
    const carVinInput = document.getElementById("carVinInput");

    carIdInput.value = "";
    carVinInput.value = "";
    document.getElementById("masina_id").value = "";

    // reset highlight input-uri
    carIdInput.classList.remove("input-error");
    carVinInput.classList.remove("input-error");

    // reset reason
    const reason = document.getElementById("retractReason");
    reason.value = "";
    reason.classList.remove("input-error");

    // ascunde info box-uri
    document.getElementById("carInfoBox").style.display = "none";
    document.getElementById("providerInfoBox").style.display = "none";

    // reset provider id
    document.getElementById("provider_id").value = "";

    // șterge erori text
    document.querySelectorAll(".error-msg")
        .forEach(e => e.textContent = "");

    // ascunde mesajele de succes / eroare venite din backend (FlashAttributes)
    const successMsg = document.querySelector(".success-message");
    if (successMsg) successMsg.style.display = "none";

    const errorMsg = document.querySelector(".error-message");
    if (errorMsg) errorMsg.style.display = "none";

    const taxaInput = document.getElementById("taxaStationare");
    if (taxaInput) {
        taxaInput.value = "";
    }

    // reset storage entry date & storage days
    const entryDateInput = document.getElementById("entryDate");
    if (entryDateInput) {
        entryDateInput.value = "";
    }

    const storageDaysInput = document.getElementById("storageDays");
    if (storageDaysInput) {
        storageDaysInput.value = "";
    }


    // re-activează câmpurile de căutare
    enableVinSearch();
    enableIdSearch();

}


// ===============================
// DOM READY – INPUT LISTENERS
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    // ===== SET CURRENT DATE (READ-ONLY) =====
    const dateInput = document.getElementById("withdrawDate");
    if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
    }


    const carIdInput = document.getElementById("carIdInput");
    const carVinInput = document.getElementById("carVinInput");

    if (carIdInput) {
        carIdInput.addEventListener("input", () => {
            const idVal = carIdInput.value;

            if (!idVal || idVal.trim() === "") {
                enableVinSearch();

            }
        });
    }

    if (carVinInput) {
        carVinInput.addEventListener("input", () => {
            const vinVal = carVinInput.value;

            if (!vinVal || vinVal.trim() === "") {
                enableIdSearch();

            }
        });
    }
});
