function validateAddBrand(event) {
    let valid = true;

    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input").forEach(e => e.classList.remove("input-error"));

    const fields = [
        {name: "nume", errorId: "error-name", label: "Brand name is required"},
        {name: "tara_origine", errorId: "error-country", label: "Country is required"}
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

    // ----- PORNEȘTE SPINNER -----
    const btn = document.getElementById("addBrandBtn");
    document.getElementById("addBrandText").style.display = "none";
    document.getElementById("addBrandPlus").style.display = "none";
    document.getElementById("addBrandSpinner").style.display = "inline-block";

    btn.disabled = true;
    event.preventDefault();
    setTimeout(() => {
        btn.disabled = false;
        event.target.submit();
    }, 800);
}

function clearBrandForm() {
    document.querySelector("form").reset();

    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));

    const success = document.getElementById("successMessage");
    if (success) success.style.display = "none";

    const err = document.getElementById("errorMessage");
    if (err) err.style.display = "none";
}

