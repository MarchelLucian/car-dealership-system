function showChangePasswordPopup() {
    document.getElementById('changePasswordOverlay').style.display = 'flex';
}

function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

function handleChangePassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const errorMessage = document.getElementById('passwordErrorMessage');
    errorMessage.style.display = 'none';
    if (newPassword !== confirmPassword) {
        showErrorMessage('New passwords do not match!');
        return;
    }

    if (newPassword.length < 3) {
        showErrorMessage('Password must be at least 3 characters long!');
        return;
    }

    fetch('/api/client/my-account/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `currentPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessMessage('Password changed successfully!');
                setTimeout(() => {
                    closeChangePasswordPopup();
                }, 1500);
            } else {
                showErrorMessage(data.message || 'Failed to change password');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorMessage('An error occurred. Please try again.');
        });
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById('passwordErrorMessage');
    errorMessage.textContent = message;
    errorMessage.className = 'acc-error-message';
    errorMessage.style.display = 'flex';
}

function showSuccessMessage(message) {
    const errorMessage = document.getElementById('passwordErrorMessage');
    errorMessage.textContent = message;
    errorMessage.className = 'acc-success-message';
    errorMessage.style.display = 'flex';
}

function closeChangePasswordPopup() {
    document.getElementById('changePasswordOverlay').style.display = 'none';
    document.getElementById('changePasswordForm').reset();
    document.getElementById('passwordErrorMessage').style.display = 'none';
}

document.addEventListener('click', function(e) {
    const overlay = document.getElementById('changePasswordOverlay');
    if (e.target === overlay) {
        closeChangePasswordPopup();
    }

    const editOverlay = document.getElementById('editDetailsOverlay');
    if (e.target === editOverlay) {
        closeEditDetailsPopup();
    }
});

// ================================
// EDIT PERSONAL DETAILS POPUP
// ================================

let fieldsUnlocked = false;

function showEditDetailsPopup() {
    document.getElementById('editDetailsOverlay').style.display = 'flex';
    fieldsUnlocked = false;
    resetEditDetailsState();
}

function closeEditDetailsPopup() {
    document.getElementById('editDetailsOverlay').style.display = 'none';
    fieldsUnlocked = false;
    resetEditDetailsState();
    document.getElementById('editDetailsForm').reset();
    document.getElementById('editVerifyPassword').value = '';

    // Restore original values from the page
    const infoItems = document.querySelectorAll('.acc-info-item');
    infoItems.forEach(item => {
        const label = item.querySelector('.acc-label');
        const value = item.querySelector('.acc-value');
        if (!label || !value) return;

        const labelText = label.textContent.trim().toLowerCase();
        if (labelText.includes('full name')) {
            const parts = value.textContent.trim().split(/\s+/);
            document.getElementById('editNume').value = parts[0] || '';
            document.getElementById('editPrenume').value = parts.slice(1).join(' ') || '';
        } else if (labelText.includes('phone')) {
            document.getElementById('editTelefon').value = value.textContent.trim();
        } else if (labelText.includes('email')) {
            document.getElementById('editEmail').value = value.textContent.trim();
        } else if (labelText.includes('address')) {
            document.getElementById('editAdresa').value = value.textContent.trim();
        }
    });
}

function resetEditDetailsState() {
    const lockIcon = document.getElementById('lockIcon');
    lockIcon.classList.remove('fa-lock-open', 'acc-lock-open');
    lockIcon.classList.add('fa-lock');

    const fields = document.querySelectorAll('#editFieldsContainer input');
    fields.forEach(input => {
        input.disabled = true;
        input.classList.remove('acc-field-unlocked');
    });

    document.getElementById('saveDetailsBtn').disabled = true;
    document.getElementById('verifyBtn').disabled = false;
    document.getElementById('editVerifyPassword').disabled = false;

    const msg = document.getElementById('editDetailsMessage');
    msg.style.display = 'none';

    const container = document.getElementById('editFieldsContainer');
    container.classList.remove('acc-fields-active');
}

function verifyPasswordForEdit() {
    const password = document.getElementById('editVerifyPassword').value;
    const msg = document.getElementById('editDetailsMessage');

    if (!password) {
        showEditMessage('Please enter your password', 'error');
        return;
    }

    const verifyBtn = document.getElementById('verifyBtn');
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';

    fetch('/api/client/my-account/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `password=${encodeURIComponent(password)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fieldsUnlocked = true;
                unlockEditFields();
                showEditMessage('Fields unlocked! You can now edit your details.', 'success');
            } else {
                showEditMessage(data.message || 'Incorrect password', 'error');
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showEditMessage('An error occurred. Please try again.', 'error');
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Verify';
        });
}

function unlockEditFields() {
    const lockIcon = document.getElementById('lockIcon');
    lockIcon.classList.remove('fa-lock');
    lockIcon.classList.add('fa-lock-open', 'acc-lock-open');

    const fields = document.querySelectorAll('#editFieldsContainer input');
    fields.forEach(input => {
        input.disabled = false;
        input.classList.add('acc-field-unlocked');
    });

    const container = document.getElementById('editFieldsContainer');
    container.classList.add('acc-fields-active');

    document.getElementById('saveDetailsBtn').disabled = false;
    document.getElementById('verifyBtn').disabled = true;
    document.getElementById('editVerifyPassword').disabled = true;
}

function handleUpdateDetails(event) {
    event.preventDefault();

    if (!fieldsUnlocked) {
        showEditMessage('Please verify your password first', 'error');
        return;
    }

    const nume = document.getElementById('editNume').value.trim();
    const prenume = document.getElementById('editPrenume').value.trim();
    const telefon = document.getElementById('editTelefon').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const adresa = document.getElementById('editAdresa').value.trim();

    if (!nume || !prenume || !telefon || !email || !adresa) {
        showEditMessage('All fields are required', 'error');
        return;
    }

    // Validare format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showEditMessage('Please enter a valid email address', 'error');
        return;
    }

    const saveBtn = document.getElementById('saveDetailsBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const body = `nume=${encodeURIComponent(nume)}&prenume=${encodeURIComponent(prenume)}&telefon=${encodeURIComponent(telefon)}&email=${encodeURIComponent(email)}&adresa=${encodeURIComponent(adresa)}`;

    fetch('/api/client/my-account/update-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showEditMessage('Personal details updated successfully!', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                showEditMessage(data.message || 'Failed to update details', 'error');
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Changes';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showEditMessage('An error occurred. Please try again.', 'error');
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Changes';
        });
}

function showEditMessage(message, type) {
    const msg = document.getElementById('editDetailsMessage');
    msg.textContent = message;
    msg.className = type === 'success' ? 'acc-success-message' : 'acc-error-message';
    msg.style.display = 'flex';
}

