function updateClientType() {
    const type = document.getElementById("tip_client").value;

    const cnpField = document.getElementById("cnp");
    const cuiField = document.getElementById("cui");
    const prenumeField = document.getElementById("prenume");

    if (type === "persoana fizica") {
        // Individual
        cnpField.disabled = false;
        cnpField.value = "";

        prenumeField.disabled = false;
        prenumeField.value = "";

        cuiField.disabled = true;
        cuiField.value = "---";  // vizual
    } else {
        // Company
        cuiField.disabled = false;
        cuiField.value = "";

        cnpField.disabled = true;
        cnpField.value = "---";

        prenumeField.disabled = true;
        prenumeField.value = "---";
    }
}

// ruleaza automat la încărcare
window.addEventListener("load", updateClientType);
