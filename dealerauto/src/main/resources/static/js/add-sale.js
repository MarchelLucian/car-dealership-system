document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const target = e.target;

    if (target.tagName === "INPUT") {
      e.preventDefault();
    }
  }
});

function hideSuccessMessage() {
  const success = document.getElementById("successMessage");
  if (success) {
    success.style.display = "none";
  }
}

// ===============================
// VALIDARE FORMULAR ADD-SALE
// ===============================
function validateAddSale(event) {
  let valid = true;

  document.querySelectorAll(".error-msg").forEach((e) => (e.textContent = ""));
  document
    .querySelectorAll("input, select")
    .forEach((e) => e.classList.remove("input-error"));

  const masinaId = document.getElementById("masina_id");

  if (!masinaId.value) {
    document.getElementById("error-car-validation").textContent =
      "Please search and select a valid car (by ID or VIN).";

    const carIdInput = document.getElementById("carIdInput");
    const carVinInput = document.getElementById("carVinInput");

    if (carIdInput && !carIdInput.disabled) {
      carIdInput.classList.add("input-error");
    }

    if (carVinInput && !carVinInput.disabled) {
      carVinInput.classList.add("input-error");
    }

    valid = false;
  }

  // === VALIDARE CLIENT (HIDDEN) ===
  const clientId = document.getElementById("client_id");
  if (!clientId.value) {
    document.getElementById("error-client-validation").textContent =
      "Please search and select a valid client.";
    document.getElementById("buyerCuiCnpInput").classList.add("input-error");
    valid = false;
  }

  // === PREȚ FINAL ===
  const price = document.getElementsByName("pret_final")[0];
  if (!price.value) {
    document.getElementById("error-price").textContent =
      "Final price is required.";
    price.classList.add("input-error");
    valid = false;
  }

  // === METODĂ PLATĂ ===
  const payment = document.getElementsByName("metoda_plata")[0];
  if (!payment.value) {
    document.getElementById("error-payment").textContent =
      "Select payment method.";
    payment.classList.add("input-error");
    valid = false;
  }

  // === DATA ===
  const date = document.getElementsByName("data_vanzare")[0];
  if (!date.value) {
    document.getElementById("error-date").textContent =
      "Sale date is required.";
    date.classList.add("input-error");
    valid = false;
  }

  if (!valid) {
    event.preventDefault();
    return;
  }

  // ===============================
  // SPINNER + DISABLE BUTTON
  // ===============================
  const btn = document.getElementById("addSaleBtn");

  document.getElementById("addSaleText").style.display = "none";
  document.getElementById("addSalePlus").style.display = "none";
  document.getElementById("addSaleSpinner").style.display = "inline-block";

  btn.disabled = true;

  event.preventDefault();
  setTimeout(() => {
    btn.disabled = false;
    event.target.submit();
  }, 700);
}

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

function enableCarSearchFields() {
  const vinInput = document.getElementById("carVinInput");
  const vinBtn = document.getElementById("searchVinBtn");
  const idInput = document.getElementById("carIdInput");
  const idBtn = document.getElementById("searchIdBtn");

  vinInput.disabled = false;
  vinBtn.disabled = false;
  idInput.disabled = false;
  idBtn.disabled = false;

  vinInput.classList.remove("disabled-input");
  vinBtn.classList.remove("disabled-btn");
  idInput.classList.remove("disabled-input");
  idBtn.classList.remove("disabled-btn");
}

document.getElementById("carIdInput").addEventListener("input", () => {
  document.getElementById("carVinInput").disabled = false;
});

document.getElementById("carVinInput").addEventListener("input", () => {
  document.getElementById("carIdInput").disabled = false;
});

// ===============================
// RESET FORM
// ===============================
function clearSaleForm() {
  document.querySelector("form").reset();

  document.querySelectorAll(".error-msg").forEach((e) => (e.textContent = ""));
  document
    .querySelectorAll("input, select")
    .forEach((e) => e.classList.remove("input-error"));

  const success = document.getElementById("successMessage");
  if (success) success.style.display = "none";

  const err = document.getElementById("errorMessage");
  if (err) err.style.display = "none";

  document.getElementById("carIdInput").value = "";
  document.getElementById("carVinInput").value = "";
  document.getElementById("masina_id").value = "";

  document.getElementById("carInfoBox").style.display = "none";

  enableCarSearchFields();
}

document.addEventListener("DOMContentLoaded", () => {
  const carIdInput = document.getElementById("carIdInput");
  const carVinInput = document.getElementById("carVinInput");
  const clientInput = document.getElementById("buyerCuiCnpInput");

  // ENTER → search CAR by ID
  if (carIdInput) {
    carIdInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchCarById();
      }
    });
  }

  // ENTER → search CAR by VIN
  if (carVinInput) {
    carVinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchCarByVin();
      }
    });
  }

  // ENTER → search CLIENT
  if (clientInput) {
    clientInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchClientByCuiCnp();
      }
    });
  }
});

function clearCarValidationError() {
  const validationError = document.getElementById("error-car-validation");
  if (validationError) {
    validationError.textContent = "";
  }

  const carIdInput = document.getElementById("carIdInput");
  const carVinInput = document.getElementById("carVinInput");

  if (carIdInput) carIdInput.classList.remove("input-error");
  if (carVinInput) carVinInput.classList.remove("input-error");
}

function searchCarById() {
  const id = document.getElementById("carIdInput").value;
  const lookupError = document.getElementById("error-car-lookup");
  const validationError = document.getElementById("error-car-validation");
  const infoBox = document.getElementById("carInfoBox");
  const hiddenId = document.getElementById("masina_id");

  const btn = document.getElementById("searchIdBtn");
  const searchIcon = document.getElementById("idSearchIcon");
  const spinner = document.getElementById("idSpinner");

  lookupError.textContent = "";
  validationError.textContent = "";
  infoBox.style.display = "none";
  hiddenId.value = "";

  if (!id || id.trim() === "") {
    lookupError.textContent = "Please enter a car ID.";
    enableVinSearch();
    hideSuccessMessage();
    return;
  }

  //  swap icons
  searchIcon.style.display = "none";
  spinner.style.display = "inline-block";
  btn.disabled = true;

  setTimeout(() => {
    fetch(`/agent-dashboard/sales/lookup-car?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.found) {
          lookupError.textContent = data.message;
          hideSuccessMessage();
          return;
        }

        clearCarValidationError();

        hiddenId.value = data.id;

        //  completează VIN
        const vinInput = document.getElementById("carVinInput");
        vinInput.value = data.vin;

        disableVinSearch();

        carInfoBox.innerHTML = `
    <strong>Vehicle Information</strong>
    <div class="car-columns">
        <div><span>Brand</span>${data.marca}</div>
        <div><span>Model</span>${data.model}</div>
        <div><span>Year</span>${data.an}</div>
        <div><span>Mileage (km)</span>${data.km}</div>
    </div>
`;
        carInfoBox.style.display = "block";
      })
      .finally(() => {
        // ----- OPREȘTE SPINNER -----
        spinner.style.display = "none";
        searchIcon.style.display = "inline-block";
        btn.disabled = false;
        hideSuccessMessage();
      });
  }, 1000);
}

function searchCarByVin() {
  const vin = document.getElementById("carVinInput").value;
  const lookupError = document.getElementById("error-car-lookup");
  const validationError = document.getElementById("error-car-validation");
  const infoBox = document.getElementById("carInfoBox");
  const hiddenId = document.getElementById("masina_id");

  const btn = document.getElementById("searchVinBtn");
  const searchIcon = document.getElementById("vinSearchIcon");
  const spinner = document.getElementById("vinSpinner");

  lookupError.textContent = "";
  validationError.textContent = "";
  infoBox.style.display = "none";
  hiddenId.value = "";

  if (!vin || vin.trim() === "") {
    lookupError.textContent = "Please enter a VIN.";
    enableIdSearch();
    hideSuccessMessage();
    return;
  }

  //  swap icons
  searchIcon.style.display = "none";
  spinner.style.display = "inline-block";
  btn.disabled = true;

  setTimeout(() => {
    fetch(
      `/agent-dashboard/sales/lookup-car-by-vin?vin=${encodeURIComponent(vin)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.found) {
          lookupError.textContent = data.message;
          hideSuccessMessage();
          return;
        }

        clearCarValidationError();

        hiddenId.value = data.id;

        //  completează ID
        const idInput = document.getElementById("carIdInput");
        idInput.value = data.id;

        disableIdSearch();

        carInfoBox.innerHTML = `
    <strong>Vehicle Information</strong>
    <div class="car-columns">
        <div><span>Brand</span>${data.marca}</div>
        <div><span>Model</span>${data.model}</div>
        <div><span>Year</span>${data.an}</div>
        <div><span>Mileage (km)</span>${data.km}</div>
        <div> <span>Purchase price:</span> €${data.pretAchizitie}</div>
    </div>
`;
        carInfoBox.style.display = "block";
      })
      .catch(() => {
        lookupError.textContent = "Error while searching car.";
      })
      .finally(() => {
        // ----- OPREȘTE SPINNER -----
        spinner.style.display = "none";
        searchIcon.style.display = "inline-block";
        btn.disabled = false;
        hideSuccessMessage();
      });
  }, 1000);
}

function clearClientValidationError() {
  const validationError = document.getElementById("error-client-validation");
  if (validationError) {
    validationError.textContent = "";
  }

  const input = document.getElementById("buyerCuiCnpInput");
  if (input) {
    input.classList.remove("input-error");
  }
}

function searchClientByCuiCnp() {
  const cuiCnp = document.getElementById("buyerCuiCnpInput").value;
  const lookupError = document.getElementById("error-client-lookup");
  const validationError = document.getElementById("error-client-validation");
  const infoBox = document.getElementById("clientInfoBox");
  const hiddenId = document.getElementById("client_id");

  const btn = document.getElementById("searchClientBtn");
  const searchIcon = document.getElementById("clientSearchIcon");
  const spinner = document.getElementById("clientSpinner");

  lookupError.textContent = "";
  validationError.textContent = "";
  infoBox.style.display = "none";
  hiddenId.value = "";

  if (!cuiCnp || cuiCnp.trim() === "") {
    lookupError.textContent = "Please enter CUI or CNP.";
    hideSuccessMessage();
    return;
  }

  //  swap icons
  searchIcon.style.display = "none";
  spinner.style.display = "inline-block";
  btn.disabled = true;

  setTimeout(() => {
    fetch(
      `/agent-dashboard/sales/lookup-client?cuiCnp=${encodeURIComponent(cuiCnp)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.found) {
          lookupError.innerHTML = `
        ${data.message}
        <br>
        <a href="/agent-dashboard/sales/add-client"
           class="register-client-link">
           Click here to register a new client .
       </a> 
    `;
          return;
        }

        clearClientValidationError();

        hiddenId.value = data.id;

        const displayName =
          data.tip === "persoana fizica" && data.prenume
            ? `${data.prenume} ${data.nume}`
            : data.nume;

        infoBox.innerHTML = `
    <strong>Client Information</strong>

    <div class="client-columns">
        <div>
            <span>Name</span>
            ${displayName}
        </div>

        <div>
            <span>Type</span>
            ${data.tip === "persoana fizica" ? "Individual" : "Company"}
        </div>

        <div>
            <span>Phone</span>
            ${data.telefon}
        </div>

        <div>
            <span>Email</span>
            ${data.email}
        </div>
    </div>
`;

        infoBox.style.display = "block";
      })
      .catch(() => {
        lookupError.textContent = "Error while searching client.";
      })
      .finally(() => {
        // ----- OPREȘTE SPINNER -----
        spinner.style.display = "none";
        searchIcon.style.display = "inline-block";
        btn.disabled = false;
        hideSuccessMessage();
      });
  }, 1000);
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
