// ====================================================
// MY ACCOUNT.JS
// ====================================================

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

    // Validare
    if (newPassword !== confirmPassword) {
        showErrorMessage('New passwords do not match!');
        return;
    }

    if (newPassword.length < 3) {
        showErrorMessage('Password must be at least 3 characters long!');
        return;
    }

    // Trimite request
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
//  FUNCȚIE PENTRU AFIȘARE EROARE
function showErrorMessage(message) {
    const errorMessage = document.getElementById('passwordErrorMessage');
    errorMessage.textContent = message;
    errorMessage.className = 'acc-error-message';
    errorMessage.style.display = 'flex';
}

//  FUNCȚIE PENTRU AFIȘARE SUCCES
function showSuccessMessage(message) {
    const errorMessage = document.getElementById('passwordErrorMessage');
    errorMessage.textContent = message;
    errorMessage.className = 'acc-success-message';
    errorMessage.style.display = 'flex';
}

function closeChangePasswordPopup() {
    document.getElementById('changePasswordOverlay').style.display = 'none';
    document.getElementById('changePasswordForm').reset();
    //  Ascunde mesajul la închidere
    document.getElementById('passwordErrorMessage').style.display = 'none';
}


// Close popup când se dă click pe overlay
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('changePasswordOverlay');
    if (e.target === overlay) {
        closeChangePasswordPopup();
    }
});