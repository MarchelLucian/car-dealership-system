// ====================================================
// MY-ORDERS.JS - Cu traduceri și iconițe
// ====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadCarLogos();
    loadCarImages();

    // Traduce și adaugă iconițe pentru tipurile de plată
    translatePaymentMethods();
    updatePurchaseCount();
});

// ====================================================
// ACTUALIZEAZĂ PLURAL PENTRU PURCHASE
// ====================================================
function updatePurchaseCount() {
    const purchaseText = document.querySelector('.purchase-text');
    const countElement = document.querySelector('.orders-count strong');

    if (purchaseText && countElement) {
        const count = parseInt(countElement.textContent);

        if (count === 1) {
            purchaseText.textContent = 'purchase';
        } else {
            purchaseText.textContent = 'purchases';
        }
    }
}

// ====================================================
// TRADUCE TIPURILE DE PLATĂ ȘI ADAUGĂ ICONIȚE
// ====================================================
function translatePaymentMethods() {
    const paymentItems = document.querySelectorAll('.payment-type-item');

    paymentItems.forEach(item => {
        const paymentType = item.getAttribute('data-payment-type');
        const paymentText = item.querySelector('.payment-text');
        const paymentIcon = item.querySelector('.payment-icon');

        if (paymentType && paymentText && paymentIcon) {
            // Traduce textul
            paymentText.textContent = translatePaymentType(paymentType);

            // Adaugă iconița
            paymentIcon.className = `payment-icon ${getPaymentIcon(paymentType)}`;
        }
    });
}

// ====================================================
// FUNCȚIE TRADUCERE TIP PLATĂ
// ====================================================
function translatePaymentType(tipTranzactie) {
    if (!tipTranzactie) return 'Unknown';

    const translations = {
        'cash': 'Cash',
        'transfer bancar': 'Bank Transfer',
        'leasing': 'Leasing',
        'rate': 'Installments'
    };

    return translations[tipTranzactie.toLowerCase()] || tipTranzactie;
}

// ====================================================
// FUNCȚIE ICONIȚE TIP PLATĂ
// ====================================================
function getPaymentIcon(tipTranzactie) {
    if (!tipTranzactie) return 'fa-solid fa-money-bill';

    const icons = {
        'cash': 'fa-solid fa-money-bill-wave',
        'transfer bancar': 'fa-regular fa-credit-card',
        'leasing': 'fa-solid fa-file-invoice-dollar',
        'rate': 'fa-solid fa-calendar-days'
    };

    return icons[tipTranzactie.toLowerCase()] || 'fa-solid fa-money-bill';
}