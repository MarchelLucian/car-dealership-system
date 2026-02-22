/**
 * Aplică una din cele 8 variante de poziționare ale umbrelor pe fundalul .agent-dashboard-bg.
 * Folosește acest script pe orice pagină care include structura agent-dashboard-bg (gradient, mesh, shapes, grid)
 * și fișierul agent-dashboard-bg.css, pentru a avea la fiecare încărcare o aranjare aleatoare a umbrelor.
 */
(function () {
    var bg = document.querySelector('.agent-dashboard-bg');
    if (bg) {
        var preset = 'shadow-preset-' + (Math.floor(Math.random() * 8) + 1);
        bg.classList.add(preset);
    }
})();
