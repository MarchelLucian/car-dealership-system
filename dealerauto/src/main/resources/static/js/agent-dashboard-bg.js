(function () {
    var bg = document.querySelector('.agent-dashboard-bg');
    if (bg) {
        var preset = 'shadow-preset-' + (Math.floor(Math.random() * 8) + 1);
        bg.classList.add(preset);
    }
})();
