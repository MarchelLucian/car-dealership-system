// ====================================================
// MANAGER-DASHBOARD.JS - Grafice și interactivitate
// ====================================================

document.addEventListener('DOMContentLoaded', () => {
    // Spinner pe cei 10 indici și la load/reload
    setKpiValuesLoading(true);

    // Inițializează toate graficele
    initMonthlySalesChart();
    initTopBrandsChart();
    initPaymentMethodsChart();
    initAgentPerformanceChart();

    // Încarcă Overview la start (All Time) – la final scoate spinnerul
    loadStats();

    // Select period dropdown – la schimbare, resetează From/To ca să nu rămână date vechi
    const periodSelect = document.getElementById('periodSelect');
    periodSelect.addEventListener('change', function() {
        const period = this.value;
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        loadStatsByPeriod(period);
    });

    // Custom date range – la Apply valid, pune select-ul pe "-Select" ca să reflecte că e perioadă custom
    document.getElementById('applyCustomRange').addEventListener('click', () => {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        if (!dateFrom || !dateTo) {
            alert('Please select both dates!');
            return;
        }

        loadStatsByCustomRange(dateFrom, dateTo);
        periodSelect.value = '';
    });
});

// ====================================================
// 1. MONTHLY SALES CHART (Line Chart)
// ====================================================

function initMonthlySalesChart() {
    const ctx = document.getElementById('monthlySalesChart');

    if (!ctx || !monthlySalesData || monthlySalesData.length === 0) {

        return;
    }

    // Extrage datele
    const labels = monthlySalesData.map(item => formatMonthLabel(item.month));
    const revenueData = monthlySalesData.map(item => item.revenue || 0);
    const profitData = monthlySalesData.map(item => item.profit || 0);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue (€)',
                    data: revenueData,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Profit (€)',
                    data: profitData,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' +
                                formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ====================================================
// 2. TOP BRANDS CHART (Bar Chart)
// ====================================================

function initTopBrandsChart() {
    const ctx = document.getElementById('topBrandsChart');

    if (!ctx || !brandStatsData || brandStatsData.length === 0) {

        return;
    }

    // Preia top 10 branduri
    const topBrands = brandStatsData.slice(0, 10);

    const labels = topBrands.map(item => item.brand);
    const salesData = topBrands.map(item => item.carsSold || 0);
    const revenueData = topBrands.map(item => item.totalRevenue || 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cars Sold',
                    data: salesData,
                    backgroundColor: 'rgba(52, 152, 219, 0.8)',
                    borderColor: '#3498db',
                    borderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'Revenue (€)',
                    data: revenueData,
                    backgroundColor: 'rgba(46, 204, 113, 0.8)',
                    borderColor: '#2ecc71',
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return 'Cars Sold: ' + context.parsed.y;
                            } else {
                                return 'Revenue: ' + formatCurrency(context.parsed.y);
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cars Sold',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue (€)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ====================================================
// 3. PAYMENT METHODS CHART (Pie Chart)
// ====================================================

function initPaymentMethodsChart() {
    const ctx = document.getElementById('paymentMethodsChart');

    if (!ctx || !paymentMethodsData || paymentMethodsData.length === 0) {

        return;
    }

    const labels = paymentMethodsData.map(item => translatePaymentMethod(item.paymentMethod));
    const data = paymentMethodsData.map(item => item.salesCount || 0);

    // Culori pentru fiecare metodă
    const backgroundColors = [
        'rgba(46, 204, 113, 0.8)',  // Cash - Verde
        'rgba(52, 152, 219, 0.8)',  // Transfer - Albastru
        'rgba(155, 89, 182, 0.8)',  // Leasing - Mov
        'rgba(230, 126, 34, 0.8)'   // Rate - Portocaliu
    ];

    const borderColors = [
        '#2ecc71',
        '#3498db',
        '#9b59b6',
        '#e67e22'
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
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
                        padding: 15,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return {
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const value = context.parsed;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} sales (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ====================================================
// 4. AGENT PERFORMANCE CHART (Horizontal Bar Chart)
// ====================================================

function initAgentPerformanceChart() {
    const ctx = document.getElementById('agentPerformanceChart');

    if (!ctx || !topAgentsData || topAgentsData.length === 0) {

        return;
    }

    const labels = topAgentsData.map(item => item.agentName);
    const salesData = topAgentsData.map(item => item.salesCount || 0);
    const profitData = topAgentsData.map(item => item.totalProfit || 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Sales Count',
                    data: salesData,
                    backgroundColor: 'rgba(52, 152, 219, 0.8)',
                    borderColor: '#3498db',
                    borderWidth: 2
                },
                {
                    label: 'Profit (€)',
                    data: profitData,
                    backgroundColor: 'rgba(243, 156, 18, 0.8)',
                    borderColor: '#f39c12',
                    borderWidth: 2
                }
            ]
        },
        options: {
            indexAxis: 'y', // Horizontal bars
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return 'Sales: ' + context.parsed.x;
                            } else {
                                return 'Profit: ' + formatCurrency(context.parsed.x);
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ====================================================
// HELPER FUNCTIONS
// ====================================================

function formatMonthLabel(monthStr) {
    if (!monthStr) return '';

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const [year, month] = monthStr.split('-');
    const monthIndex = parseInt(month) - 1;

    return `${monthNames[monthIndex]} ${year}`;
}

/**
 * Formatează valoarea în EUR
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

/**
 * Traduce tipul de plată în engleză
 */
function translatePaymentMethod(tipTranzactie) {
    if (!tipTranzactie) return 'Unknown';

    const translations = {
        'Cash': 'Cash',
        'cash': 'Cash',
        'Transfer bancar': 'Bank Transfer',
        'transfer bancar': 'Bank Transfer',
        'Leasing': 'Leasing',
        'leasing': 'Leasing',
        'Rate': 'Installments',
        'rate': 'Installments'
    };

    return translations[tipTranzactie] || tipTranzactie;
}

// ====================================================
// SORTING FUNCTIONALITY
// ====================================================

// Update icon when order changes
document.addEventListener('DOMContentLoaded', () => {
    // Agent sort order listener
    const agentSortOrder = document.getElementById('agentSortOrder');
    const agentSortIcon = document.getElementById('agentSortIcon');

    if (agentSortOrder && agentSortIcon) {
        agentSortOrder.addEventListener('change', function() {
            updateSortIcon(this.value, agentSortIcon);
        });
        // Set initial icon
        updateSortIcon(agentSortOrder.value, agentSortIcon);
    }

    // Provider sort order listener
    const providerSortOrder = document.getElementById('providerSortOrder');
    const providerSortIcon = document.getElementById('providerSortIcon');

    if (providerSortOrder && providerSortIcon) {
        providerSortOrder.addEventListener('change', function() {
            updateSortIcon(this.value, providerSortIcon);
        });
        // Set initial icon
        updateSortIcon(providerSortOrder.value, providerSortIcon);
    }
});

/**
 * Update sort icon based on order
 */
function updateSortIcon(order, iconElement) {
    if (order === 'asc') {
        iconElement.className = 'fa-solid fa-arrow-down-short-wide sort-icon';
    } else {
        iconElement.className = 'fa-solid fa-arrow-down-wide-short sort-icon';

    }
}

/**
 * Apply sorting for Providers table
 */
function applyProviderSort() {
    const sortBy = document.getElementById('providerSortBy').value;
    const sortOrder = document.getElementById('providerSortOrder').value;
    const tbody = document.querySelector('#providersTable tbody');
    const rows = Array.from(tbody.querySelectorAll('.provider-row'));

    rows.sort((a, b) => {
        let aValue, bValue;

        switch(sortBy) {
            case 'name':
                aValue = a.dataset.name.toLowerCase();
                bValue = b.dataset.name.toLowerCase();
                if (sortOrder === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            case 'supplied':
                aValue = parseInt(a.dataset.supplied);
                bValue = parseInt(b.dataset.supplied);
                break;
            case 'sold':
                aValue = parseInt(a.dataset.sold);
                bValue = parseInt(b.dataset.sold);
                break;
            case 'conversion':
                aValue = parseFloat(a.dataset.conversion);
                bValue = parseFloat(b.dataset.conversion);
                break;
            default:
                return 0;
        }

        if (sortOrder === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });

    // Clear tbody and append sorted rows
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));

    // Visual feedback
    showSortFeedback('providersTable');
}

/**
 * Visual feedback when sorting is applied
 */
function showSortFeedback(tableId) {
    const table = document.getElementById(tableId);
    if (table) {
        table.style.animation = 'none';
        setTimeout(() => {
            table.style.animation = 'slideUp 0.5s ease';
        }, 10);
    }
}

// Funcție pentru calcularea datelor perioadelor
function calculateDateRange(period) {
    const endDate = new Date();
    let startDate = new Date();

    switch(period) {
        case 'today':
            startDate.setDate(endDate.getDate());
            break;
        case 'week':
            startDate.setDate(endDate.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(endDate.getMonth() - 1);
            break;
        case '2months':
            startDate.setMonth(endDate.getMonth() - 2);
            break;
        case '3months':
            startDate.setMonth(endDate.getMonth() - 3);
            break;
        case '6months':
            startDate.setMonth(endDate.getMonth() - 6);
            break;
        case 'year':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        case 'all':
        default:
            startDate = new Date(2020, 0, 1); // 01 ianuarie 2020
            endDate.setDate(endDate.getDate() + 30); // azi + 30 zile

            return {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0]
            };
    }

    return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
    };
}

function setKpiValuesLoading(loading) {
    document.querySelectorAll('.kpi-value-period').forEach(el => {
        el.classList.toggle('kpi-value--loading', loading);
    });
}

// Încarcă statistici pentru perioadă
async function loadStatsByPeriod(period) {
    const dateRange = calculateDateRange(period);

    let url = '/api/dashboard/stats';
    if (dateRange) {
        url += `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
    }

    setKpiValuesLoading(true);
    const minSpinnerMs = 750;
    const start = Date.now();
    try {
        const response = await fetch(url);
        const stats = await response.json();
        updateDashboard(stats);
    } catch (error) {
        console.error(' Error loading stats:', error);
    } finally {
        const elapsed = Date.now() - start;
        setTimeout(() => setKpiValuesLoading(false), Math.max(0, minSpinnerMs - elapsed));
    }
}

// Încarcă statistici pentru interval custom
async function loadStatsByCustomRange(startDate, endDate) {
    const url = `/api/dashboard/stats?startDate=${startDate}&endDate=${endDate}`;

    setKpiValuesLoading(true);
    const minSpinnerMs = 750;
    const start = Date.now();
    try {
        const response = await fetch(url);
        const stats = await response.json();
        updateDashboard(stats);
    } catch (error) {
        console.error('Error loading stats:', error);
    } finally {
        const elapsed = Date.now() - start;
        setTimeout(() => setKpiValuesLoading(false), Math.max(0, minSpinnerMs - elapsed));
    }
}
function updateDashboard(stats) {
    // SALES
    document.querySelector('.cars-value').textContent = stats.totalCarsSold || 0;

    // Caută și actualizează fiecare valoare
    updateKpiValue('Total Revenue', formatNumber(stats.totalSalesRevenue) + ' €');
    updateKpiValue('Total Profit', formatNumber(stats.totalProfit) + ' €');
    updateKpiValue('Profit Margin', formatNumber(stats.profitMargin) + '%');

    document.getElementById('stockValueAmount').textContent = formatNumber(stats.currentStockValue) + ' €';
    document.getElementById('carsInStockValue').textContent = stats.carsInStock || 0;
    updateKpiValue('New Cars', stats.newCarsAdded || 0);
    updateKpiValue('New Cars Value', formatNumber(stats.newCarsValue) + ' €');

    updateKpiValue('Retracted Cars', stats.carsRetracted || 0);
    updateKpiValue('Retraction Costs', formatNumber(stats.totalRetractedCost) + ' €');
}

// Helper function
function updateKpiValue(label, value) {
    const cards = document.querySelectorAll('.kpi-card');
    cards.forEach(card => {
        const labelEl = card.querySelector('.kpi-label');
        if (labelEl && labelEl.textContent.trim() === label) {
            card.querySelector('.kpi-value').textContent = value;
        }
    });
}

// Format număr RO: mii cu punct, zecimale cu virgulă
function formatNumber(num) {
    if (num == null || isNaN(num)) {
        return "0,00";
    }

    return num
        .toFixed(2)                 // 68650.00
        .replace('.', ',')          // 68650,00
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // 68.650,00
}

// Încărcare inițială
function loadStats() {
    loadStatsByPeriod('all');
}
