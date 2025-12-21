function validateAddProvider(event) {

    let valid = true;

    // Reset erori
    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));

    const fields = [
        {name: "nume", errorId: "error-name", label: "Name is required"},
        {name: "tip_furnizor", errorId: "error-type", label: "Select provider type"},
        {name: "telefon", errorId: "error-phone", label: "Phone is required"},
        {name: "cui_cnp", errorId: "error-id", label: "CUI / CNP required"},
        {name: "adresa", errorId: "error-address", label: "Address is required"}
    ];

    fields.forEach(f => {
        const el = document.getElementsByName(f.name)[0];

        if (!el.value || el.value.trim() === "") {
            document.getElementById(f.errorId).textContent = f.label;
            el.classList.add("input-error");
            valid = false;
        }
    });

    if (!valid) {
        event.preventDefault();
        return;
    }

    // PORNEȘTE SPINNER
    const btn = document.getElementById("addProviderBtn");
    document.getElementById("addProviderText").style.display = "none";
    document.getElementById("addProviderPlus").style.display = "none";
    document.getElementById("addProviderSpinner").style.display = "inline-block";

    btn.disabled = true;

    // delay 0.5s
    event.preventDefault();
    setTimeout(() => {
        btn.disabled = false;
        event.target.submit();
    }, 800);
}


// RESET BUTTON
function clearProviderForm() {
    // reset DOM values
    document.querySelector("form").reset();

    // șterge erorile și borderele
    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));

    // ascunde mesaje succes/eroare
    const success = document.getElementById("successMessage");
    if (success) success.style.display = "none";

    const err = document.getElementById("errorMessage");
    if (err) err.style.display = "none";

    // elimină valorile venite din backend → reload fără FlashAttributes!
    window.location.href = "/agent-dashboard/car-inventory/add-provider";
}
