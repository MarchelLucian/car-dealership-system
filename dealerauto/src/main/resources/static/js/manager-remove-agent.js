function confirmRemoveAgent(button) {
    const idAgent = button.getAttribute('data-id');
    const agentName = button.getAttribute('data-name');

    // overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-overlay';
    overlay.id = 'confirmOverlay';

    // modal
    overlay.innerHTML = `
        <div class="custom-modal">
            <div class="modal-icon">
                <i class="fa-solid fa-exclamation-triangle"></i>
            </div>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete agent <strong>"${agentName}"</strong>?</p>
            <p class="warning-text">This action cannot be undone.</p>
            <div class="modal-buttons">
                <button class="cancel-btn" onclick="closeConfirmModal()">
                    <i class="fa-solid fa-times"></i>
                    Cancel
                </button>
                <button class="confirm-btn" onclick="confirmDelete(${idAgent})">
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animație fade-in
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
}

function closeConfirmModal() {
    const overlay = document.getElementById('confirmOverlay');
    overlay.classList.remove('active');

    setTimeout(() => {
        overlay.remove();
    }, 300);
}

function confirmDelete(idAgent) {
    document.getElementById('agentIdToRemove').value = idAgent;
    document.getElementById('removeAgentForm').submit();
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('confirmOverlay');
        if (overlay) {
            closeConfirmModal();
        }
    }
});