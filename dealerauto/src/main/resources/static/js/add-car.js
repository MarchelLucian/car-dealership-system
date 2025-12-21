// Pornește spinnerul
function showAddCarSpinner() {
    const btn = document.getElementById("addCarBtn");
    const spinner = document.getElementById("addCarSpinner");
    const text = document.getElementById("addCarText");
    const plus = document.getElementById("addCarPlus");

    text.style.display = "none";      // ascunde textul
    plus.style.display = "none";      // ascunde iconița plus
    spinner.style.display = "inline-block";  // arată spinnerul

    btn.disabled = true;
}



// Validare formular
function validateAddCarForm(event) {
    let valid = true;

    // Reset erori anterioare
    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));

    // Lista câmpurilor care trebuie validate
    const fields = [
        { name: "brandName", errorId: "error-brand", label: "Please select a brand" },
        { name: "model", errorId: "error-model", label: "Model is required" },
        { name: "providerName", errorId: "error-provider", label: "Please select a provider" },
        { name: "an", errorId: "error-year", label: "Year is required" },
        { name: "kilometraj", errorId: "error-km", label: "Kilometers required" },
        { name: "combustibil", errorId: "error-fuel", label: "Please select fuel type" },
        { name: "transmisie", errorId: "error-trans", label: "Please select transmission" },
        { name: "culoare", errorId: "error-color", label: "Color required" },
        { name: "pretAchizitie", errorId: "error-price", label: "Price required" },
        { name: "usi", errorId: "error-doors", label: "Doors required" },
        { name: "locuri", errorId: "error-seats", label: "Seats required" },
        { name: "vin", errorId: "error-vin", label: "VIN is required" }
    ];

    // Rulăm validarea
    fields.forEach(f => {
        const el = document.getElementsByName(f.name)[0];
        if (!el.value || el.value === "") {
            document.getElementById(f.errorId).textContent = f.label;
            el.classList.add("input-error");
            valid = false;
        }
    });

    const vinInput = document.getElementsByName("vin")[0];
    if (vinInput.value && vinInput.value.length !== 15) {
        document.getElementById("error-vin").textContent = "VIN must be exactly 15 characters";
        vinInput.classList.add("input-error");
        valid = false;
    }

    // Dacă NU e valid → OPRIM submitul
    if (!valid) {
        event.preventDefault();
        return;
    }

    // -------- Formular VALID --------
    // Pornește spinnerul
    showAddCarSpinner();

    // Așteptăm 500 ms înainte să permite submit-ul
    event.preventDefault();
    setTimeout(() => {
        event.target.submit();
    }, 800);
}


function clearCarForm() {
    // reset DOM
    document.querySelector("form").reset();

    // curăță erori
    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));

    // 🔥 reload curat (fără flash attributes)
    window.location.href = "/agent-dashboard/car-inventory/add-car";
}
