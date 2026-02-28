document.addEventListener("DOMContentLoaded", () => {
  const demoBtn = document.getElementById("demoLoginBtn");

  if (demoBtn) {
    demoBtn.addEventListener("click", () => {
      // Setăm username + password pentru demo
      document.getElementById("email").value = "cristian.mihai@gmail.com";
      document.getElementById("password").value = "love";

      // Trimitem formularul
      document.getElementById("loginForm").submit();
    });
  }
});

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
