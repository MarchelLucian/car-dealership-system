document.addEventListener("DOMContentLoaded", () => {

    loadCarLogos();
    loadCarImages();

    translatePaymentMethods();
    updatePurchaseCount();
});

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

// translate payment types and set icons for each item
function translatePaymentMethods() {
    const paymentItems = document.querySelectorAll('.payment-type-item');

    paymentItems.forEach(item => {
        const paymentType = item.getAttribute('data-payment-type');
        const paymentText = item.querySelector('.payment-text');
        const paymentIcon = item.querySelector('.payment-icon');

        if (paymentType && paymentText && paymentIcon) {
            paymentText.textContent = translatePaymentType(paymentType);
            paymentIcon.className = `payment-icon ${getPaymentIcon(paymentType)}`;
        }
    });
}

// map payment type key to display label
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

// map payment type key to icon class name
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