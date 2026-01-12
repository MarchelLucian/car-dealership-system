// Initialize all charts
document.addEventListener('DOMContentLoaded', () => {
    initMonthlySalesChart();
    initTopBrandsChart();
    initPaymentMethodsChart();
    initFuelDistributionChart();
    initTransmissionDistributionChart();
});

// Fuel Distribution Chart (Doughnut)
function initFuelDistributionChart() {
    const ctx = document.getElementById('fuelDistributionChart');

    if (!ctx || !fuelDistributionData) {
        console.log('No fuel distribution data available');
        return;
    }

    const labels = Object.keys(fuelDistributionData);
    const data = Object.values(fuelDistributionData);

    const backgroundColors = [
        'rgba(52, 152, 219, 0.8)',
        'rgba(46, 204, 113, 0.8)',
        'rgba(155, 89, 182, 0.8)',
        'rgba(230, 126, 34, 0.8)',
        'rgba(231, 76, 60, 0.8)'
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                }
            }
        }
    });
}

// Transmission Distribution Chart (Pie)
function initTransmissionDistributionChart() {
    const ctx = document.getElementById('transmissionDistributionChart');

    if (!ctx || !transmissionDistributionData) {
        console.log('No transmission distribution data available');
        return;
    }

    const labels = Object.keys(transmissionDistributionData);
    const data = Object.values(transmissionDistributionData);

    const backgroundColors = [
        'rgba(52, 152, 219, 0.8)',
        'rgba(230, 126, 34, 0.8)'
    ];

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                }
            }
        }
    });
}