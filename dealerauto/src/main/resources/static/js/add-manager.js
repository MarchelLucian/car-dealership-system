function validateAddManager(event) {
    let valid = true;

    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input").forEach(e => e.classList.remove("input-error"));

    const fields = [
        {name: "nume", errorId: "error-nume", label: "Last name is required"},
        {name: "prenume", errorId: "error-prenume", label: "First name is required"},
        {name: "username", errorId: "error-username", label: "Username is required"},
        {name: "password", errorId: "error-password", label: "Password is required"}
    ];

    fields.forEach(f => {
        const el = document.getElementsByName(f.name)[0];
        if (!el.value || el.value.trim() === "") {
            document.getElementById(f.errorId).textContent = f.label;
            el.classList.add("input-error");
            valid = false;
        }
    });

    const password = document.getElementsByName("password")[0];
    if (password.value && password.value.length < 6) {
        document.getElementById("error-password").textContent = "Password must be at least 6 characters";
        password.classList.add("input-error");
        valid = false;
    }

    if (!valid) {
        event.preventDefault();
        return;
    }

    const btn = document.getElementById("addManagerBtn");
    document.getElementById("addManagerText").style.display = "none";
    document.getElementById("addManagerPlus").style.display = "none";
    document.getElementById("addManagerSpinner").style.display = "inline-block";
    btn.disabled = true;

    event.preventDefault();
    setTimeout(() => {
        btn.disabled = false;
        event.target.submit();
    }, 800);
}

function clearManagerForm() {
    document.querySelector("form").reset();
    document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    document.querySelectorAll("input").forEach(e => e.classList.remove("input-error"));

    const success = document.getElementById("successMessage");
    if (success) success.style.display = "none";

    const err = document.getElementById("errorMessage");
    if (err) err.style.display = "none";
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.querySelector('input[name="password"]');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // Toggle type
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle icon
            if (type === 'text') {
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    }
});