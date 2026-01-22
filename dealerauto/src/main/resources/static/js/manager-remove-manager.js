function confirmRemoveManager(button) {
    const id = button.getAttribute('data-id');
    const managerName = button.getAttribute('data-name');

    const overlay = document.createElement('div');
    overlay.className = 'custom-overlay';
    overlay.id = 'confirmOverlay';

    overlay.innerHTML = `
        <div class="custom-modal">
            <div class="modal-icon">
                <i class="fa-solid fa-exclamation-triangle"></i>
            </div>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete manager <strong>"${managerName}"</strong>?</p>
            <p class="warning-text">This action cannot be undone.</p>
            <div class="modal-buttons">
                <button class="cancel-btn" onclick="closeConfirmModal()">
                    <i class="fa-solid fa-times"></i>
                    Cancel
                </button>
                <button class="confirm-btn" onclick="confirmDelete(${id})">
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

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

function confirmDelete(id) {
    document.getElementById('managerIdToRemove').value = id;
    document.getElementById('removeManagerForm').submit();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('confirmOverlay');
        if (overlay) {
            closeConfirmModal();
        }
    }
});