function toggleClientType() {
    const type = document.getElementById("tipClient").value;

    const prenumeBlock = document.getElementById("prenumeBlock");
    const cnpBlock = document.getElementById("cnpBlock");
    const cuiBlock = document.getElementById("cuiBlock");

    const labelNume = document.getElementById("labelNume");
    const labelPrenume = document.getElementById("labelPrenume");

    const cnpInput = document.getElementById("cnpInput");
    const cuiInput = document.getElementById("cuiInput");
    const prenumeInput = document.getElementById("prenumeInput");
    const numeInput = document.getElementsByName("nume")[0];

    if (type === "persoana fizica") {
        // Individual - Show prenume and CNP, hide CUI
        prenumeBlock.style.display = "contents";
        cnpBlock.style.display = "contents";
        cuiBlock.style.display = "none";

        labelNume.textContent = "Last Name:";
        labelPrenume.textContent = "First Name:";

        // Update placeholder for Individual
        numeInput.placeholder = "e.g. Popescu";

        // Enable required fields
        prenumeInput.disabled = false;
        cnpInput.disabled = false;
        cuiInput.disabled = true;
        cuiInput.value = "";

    } else if (type === "firma") {
        // Company - Hide prenume and CNP, show CUI
        prenumeBlock.style.display = "none";
        cnpBlock.style.display = "none";
        cuiBlock.style.display = "contents";

        labelNume.textContent = "Name:";

        // Update placeholder for Company
        numeInput.placeholder = "e.g. SC Auto SRL";

        // Enable CUI, disable prenume and CNP
        cuiInput.disabled = false;
        prenumeInput.disabled = true;
        cnpInput.disabled = true;
        prenumeInput.value = "";
        cnpInput.value = "";
    }
}
function validateClientRegister(event) {

    let valid = true;

    // RESET errors
    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));

    const type = document.getElementById("tipClient").value;

    // Base fields (always required)
    const fields = [
        {name: "tip_client", errorId: "error-tip", label: "Client type is required"},
        {name: "email", errorId: "error-email", label: "Email is required"},
        {name: "password", errorId: "error-password", label: "Password is required"},
        {name: "nume", errorId: "error-nume", label: "Name is required"},
        {name: "telefon", errorId: "error-telefon", label: "Phone is required"},
        {name: "adresa", errorId: "error-adresa", label: "Address is required"}
    ];

    // Add conditional fields based on client type
    if (type === "persoana fizica") {
        fields.push({name: "prenume", errorId: "error-prenume", label: "First name is required"});
        fields.push({name: "cnp", errorId: "error-cnp", label: "CNP is required"});
    } else if (type === "firma") {
        fields.push({name: "cui", errorId: "error-cui", label: "CUI is required"});
    }

    // Validate each field
    fields.forEach(f => {
        const el = document.getElementsByName(f.name)[0];
        if (!el || !el.value || el.value.trim() === "") {
            document.getElementById(f.errorId).textContent = f.label;
            el.classList.add("input-error");
            valid = false;
        }
    });

    if (!valid) {
        event.preventDefault();
        return;
    }

    // SPINNER animation
    const btn = document.getElementById("registerBtn");
    document.getElementById("registerText").style.display = "none";
    document.getElementById("registerPlus").style.display = "none";
    document.getElementById("registerSpinner").style.display = "inline-block";

    btn.disabled = true;

    event.preventDefault();
    setTimeout(() => {
        btn.disabled = false;
        event.target.submit();
    }, 800);
}

function clearRegisterForm() {
    document.querySelector("form").reset();
    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));

    window.location.href = "/client-register";
}

// Toggle Password Visibility
document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePassword");

    if (!passwordInput || !toggleIcon) return;

    toggleIcon.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        toggleIcon.classList.toggle("fa-eye-slash");
        toggleIcon.classList.toggle("fa-eye");
    });
});