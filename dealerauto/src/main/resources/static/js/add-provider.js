function validateAddProvider(event) {
    let valid = true;

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

    const btn = document.getElementById("addProviderBtn");
    document.getElementById("addProviderText").style.display = "none";
    document.getElementById("addProviderPlus").style.display = "none";
    document.getElementById("addProviderSpinner").style.display = "inline-block";

    btn.disabled = true;

    event.preventDefault();
    setTimeout(() => {
        btn.disabled = false;
        event.target.submit();
    }, 800);
}

function clearProviderForm() {
    document.querySelector("form").reset();

    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));

    const success = document.getElementById("successMessage");
    if (success) success.style.display = "none";

    const err = document.getElementById("errorMessage");
    if (err) err.style.display = "none";
}

