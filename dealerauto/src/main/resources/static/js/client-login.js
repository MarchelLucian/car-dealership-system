document.addEventListener("DOMContentLoaded", () => {

    const demoBtn = document.getElementById("demoLoginBtn");

    if (demoBtn) {
        demoBtn.addEventListener("click", () => {

            // Setăm username + password pentru demo
            document.getElementById("email").value = "ceva@altceva";
            document.getElementById("password").value = "parola123";

            // Trimitem formularul
            document.getElementById("loginForm").submit();
        });
    }
});
