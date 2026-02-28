function toggleClientType() {
    const type = document.getElementById("tipClient").value;

    const prenumeBlock = document.getElementById("prenumeBlock");
    const labelNume = document.getElementById("labelNume");
    const labelPrenume = document.getElementById("labelPrenume");

    if (type === "persoana fizica") {
        // PF
        prenumeBlock.style.display = "contents";
        labelNume.textContent = "Last Name:";
        labelPrenume.textContent = "First Name:";
    } else if (type === "firma") {
        // Firmă
        prenumeBlock.style.display = "none";
        labelNume.textContent = "Name:";
    }
}

function validateAddClient(event) {

    let valid = true;

    // RESET
    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));

    const type = document.getElementById("tipClient").value;

    const fields = [
        {name: "tip_client", errorId: "error-tip", label: "Client type is required"},
        {name: "nume", errorId: "error-nume", label: "Name is required"},
        {name: "cnp_cui", errorId: "error-cnp", label: "CNP / CUI is required"},
        {name: "telefon", errorId: "error-telefon", label: "Phone is required"},
        {name: "email", errorId: "error-email", label: "Email is required"},
        {name: "adresa", errorId: "error-adresa", label: "Address is required"}
    ];

    if (type === "persoana fizica") {
        fields.push({name: "prenume", errorId: "error-prenume", label: "First name is required"});
    }

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

    // SPINNER
    const btn = document.getElementById("addClientBtn");
    document.getElementById("addClientText").style.display = "none";
    document.getElementById("addClientPlus").style.display = "none";
    document.getElementById("addClientSpinner").style.display = "inline-block";

    btn.disabled = true;

    event.preventDefault();
    setTimeout(() => {
        btn.disabled = false;
        event.target.submit();
    }, 800);
}

function clearClientForm() {
    document.querySelector("form").reset();
    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(e => e.classList.remove("input-error"));
}