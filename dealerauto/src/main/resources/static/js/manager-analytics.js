let currentChart = null;
let currentChartType = null;
let currentCategory = 'sold';

function translateFuelType(fuel) {
    const translations = {
        'motorina': 'Diesel',
        'benzina': 'Gasoline',
        'hibrid': 'Hybrid',
        'electric': 'Electric',
        'gpl': 'LPG'
    };
    return translations[fuel.toLowerCase()] || fuel;
}

function translateTransmission(trans) {
    const translations = {
        'manuala': 'Manual',
        'automata': 'Automatic'
    };
    return translations[trans.toLowerCase()] || trans;
}

function translatePaymentMethod(method) {
    const translations = {
        'cash': 'Cash',
        'leasing': 'Leasing',
        'rate': 'Installments',
        'transfer bancar': 'Bank Transfer'
    };
    return translations[method.toLowerCase()] || method;
}

Chart.register({
    id: 'percentageLabels',
    afterDatasetsDraw(chart) {
        if (chart.config.type === 'bar') return;
        const { ctx, data } = chart;
        const meta = chart.getDatasetMeta(0);

        const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

        meta.data.forEach((datapoint, index) => {
            const value = data.datasets[0].data[index];
            const percentage = ((value / total) * 100).toFixed(1);

            if (percentage <= 1) return;

            let { x, y } = datapoint.tooltipPosition();

            // detectare tip chart
            const isBar = chart.config.type === 'bar';
            if (isBar) {
                const bar = meta.data[index];
                y = bar.y + (bar.base - bar.y) / 2;
            }

            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 26px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentage}%`, x, y);
            ctx.restore();
        });
    }
});


// Chart configurations
const chartConfigs = {
    monthlySales: {
        title: 'Monthly Sales Trend',
        icon: 'fa-calendar-days',
        type: 'line',
        getData: () => {
            // Doar pentru sold (stock nu are sales)
            if (currentCategory === 'stock') {
                return { labels: ['No Data'], datasets: [{ label: 'N/A', data: [0] }] };
            }
            return {
                labels: soldData.monthlySales.map(d => d.month),
                datasets: [{
                    label: 'Sales Count',
                    data: soldData.monthlySales.map(d => d.count),
                    borderColor: '#ff6600',
                    backgroundColor: 'rgba(255, 102, 0, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            };
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 16, weight: 'bold' },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',

                    titleFont: {
                        size: 18,
                        weight: 'bold'
                    },

                    bodyFont: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 12,
                    caretSize: 22,
                    position: 'nearest'
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    },
    topBrands: {
        title: 'Top Brands',
        icon: 'fa-ranking-star',
        type: 'bar',
        getData: () => {
            const data = currentCategory === 'sold' ? soldData.brandStats : stockData.brandStats;

            if (currentCategory === 'sold') {
                // SOLD: Cars Sold + Profit
                const profitColors = data.map(b =>
                    b.totalProfit >= 0
                        ? 'rgba(46, 204, 113, 0.8)'  // Verde pentru profit pozitiv
                        : 'rgba(231, 76, 60, 0.8)'   // Rosu pentru profit negativ
                );

                const profitBorderColors = data.map(b =>
                    b.totalProfit >= 0 ? '#2ecc71' : '#e74c3c'
                );
                return {
                    labels: data.map(b => b.brand),
                    datasets: [
                        {
                            label: 'Cars Sold',
                            data: data.map(b => b.carsSold),
                            backgroundColor: 'rgba(52, 152, 219, 0.8)',
                            borderColor: '#3498db',
                            borderWidth: 2,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Profit (€)',
                            data: data.map(b => b.totalProfit),
                            backgroundColor: profitColors,  // Culori dinamice
                            borderColor: profitBorderColors,
                            borderWidth: 2,
                            yAxisID: 'y1'
                        }
                    ]
                };
            } else {
                // STOCK: Cars in Stock + Stock Value
                return {
                    labels: data.map(b => b.brand),
                    datasets: [
                        {
                            label: 'Cars in Stock',
                            data: data.map(b => b.carsInStock),
                            backgroundColor: 'rgba(155, 89, 182, 0.8)',
                            borderColor: '#9b59b6',
                            borderWidth: 2,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Stock Value (€)',
                            data: data.map(b => b.stockValue),
                            backgroundColor: 'rgba(241, 196, 15, 0.8)',
                            borderColor: '#f1c40f',
                            borderWidth: 2,
                            yAxisID: 'y1'
                        }
                    ]
                };
            }
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {

                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 32,
                            weight: 'bold'
                        },
                        padding: 15,
                        boxWidth: 50,
                        boxHeight: 50
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',

                    titleFont: {
                        size: 24,
                        weight: 'bold'
                    },

                    bodyFont: {
                        size: 24,
                        weight: 'bold'
                    },
                    padding: 12,
                    caretSize: 22,
                    position: 'nearest',
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (label.includes('€')) {
                                    label += new Intl.NumberFormat('ro-RO', {
                                        style: 'decimal',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(context.parsed.y) + ' €';
                                } else {
                                    label += context.parsed.y;
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 22,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: currentCategory === 'sold' ? 'Cars Sold' : 'Cars in Stock',
                        font: {
                            size: 26,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 1,
                        precision: 0,
                        font: {
                            size: 22,
                            weight: 'bold'
                        },
                        callback: function(value) {
                            return Number.isInteger(value) ? value : null;
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: -1000,  // Începe de la -500
                    suggestedMax: function(context) {
                        const max = Math.max(...context.chart.data.datasets[1].data);
                        return Math.ceil(max / 1000) * 1000 + 500; // Rotunjește la 1000 sus
                    },
                    title: {
                        display: true,
                        text: currentCategory === 'sold' ? 'Value (€)' : 'Stock Value (€)',
                        font: {
                            size: 24,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 1000,  // Pas de 1000
                        font: { size: 22 },
                        callback: function(value) {
                            return new Intl.NumberFormat('ro-RO', {
                                style: 'decimal',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(value) + ' €';
                        }
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    },

    paymentMethods: {
        title: 'Payment Methods Distribution',
        icon: 'fa-credit-card',
        type: 'doughnut',
        getData: () => {
            // Doar pentru sold
            if (currentCategory === 'stock') {
                return { labels: ['No Data'], datasets: [{ data: [1] }] };
            }
            const labels = soldData.paymentMethods.map(pm => translatePaymentMethod(pm.paymentMethod));
            const values = soldData.paymentMethods.map(pm => pm.salesCount);

            return {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(241, 196, 15, 0.8)'
                    ],
                    borderWidth: 3,
                    hoverOffset: 10,
                    borderColor: '#fff'
                }]
            };

        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 240,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            size: 32,
                            weight: 'bold'
                        },
                        padding: 15,
                        boxWidth: 50,
                        boxHeight: 50
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',

                    titleFont: {
                        size: 24,
                        weight: 'bold'
                    },

                    bodyFont: {
                        size: 24,
                        weight: 'bold'
                    },
                    padding: 12,
                    caretSize: 22,
                    position: 'nearest'
                }
            }
        }
    },
    fuelDistribution: {
        title: 'Fuel Type Distribution',
        icon: 'fa-gas-pump',
        type: 'doughnut',
        getData: () => {
            const data = currentCategory === 'sold' ? soldData.fuelDistribution : stockData.fuelDistribution;
            const labels = Object.keys(data).map(fuel => translateFuelType(fuel));
            const values = Object.values(data);
            return {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(230, 126, 34, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ],
                    borderWidth: 3,
                    hoverOffset: 10,
                    borderColor: '#fff'
                }]
            };
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        layout: {
            padding: {
                left: 240,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            size: 32,
                            weight: 'bold'
                        },
                        padding: 15,
                        boxWidth: 50,
                        boxHeight: 50
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',

                    titleFont: {
                        size: 24,
                        weight: 'bold'
                    },

                    bodyFont: {
                        size: 24,
                        weight: 'bold'
                    },
                    padding: 12,
                    caretSize: 22,
                    position: 'nearest'
                }
            }
        }
    },
    transmission: {
        title: 'Transmission Type Distribution',
        icon: 'fa-gear',
        type: 'doughnut',
        getData: () => {
            const data = currentCategory === 'sold' ? soldData.transmissionDistribution : stockData.transmissionDistribution;
            const labels = Object.keys(data).map(trans => translateTransmission(trans));
            const values = Object.values(data);
            return {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(230, 126, 34, 0.8)'
                    ],
                    borderWidth: 3,
                    hoverOffset: 10,
                    borderColor: '#fff'
                }]
            };
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 240,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    align: 'center',
                    labels: {
                        font: {
                            size: 32,
                            weight: 'bold'
                        },
                        padding: 15,
                        boxWidth: 50,
                        boxHeight: 50
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',

                    titleFont: {
                        size: 24,
                        weight: 'bold'
                    },

                    bodyFont: {
                        size: 24,
                        weight: 'bold'
                    },
                    padding: 12,
                    caretSize: 22,
                    position: 'nearest'
                }
            }
        }
    }
};

// Switch între Sold și Stock
function switchCategory(category) {
    if (category === currentCategory) return;

    currentCategory = category;

    // Update butoane active
    document.getElementById('soldBtn').classList.toggle('active', category === 'sold');
    document.getElementById('stockBtn').classList.toggle('active', category === 'stock');

    // FILTERS visibility
    const yearFilter = document.getElementById('yearFilter');
    const stockCountFilter = document.getElementById('stockCountFilter');

    if (currentChartType === 'topBrands') {
        if (category === 'sold') {
            setTimeout(() => yearFilter.classList.add('visible'), 100);
            stockCountFilter.classList.remove('visible');
        } else {
            yearFilter.classList.remove('visible');
            setTimeout(() => stockCountFilter.classList.add('visible'), 100);
        }
    }

    // Reîncarcă chart-ul curent cu datele noi
    const wrapper = document.getElementById('chartWrapper');
    wrapper.classList.remove('active');

    setTimeout(() => {
        if (currentChart) {
            currentChart.destroy();
        }

        const config = chartConfigs[currentChartType];
        const titleElement = document.getElementById('mainChartTitle');

        let title = config.title;
        if (currentChartType === 'topBrands') {
            title = category === 'sold'
                ? 'Top Brands by Sales Count '
                : 'Top Brands by Cars in Stock Count';
        }
        titleElement.innerHTML = `<i class="fa-solid ${config.icon}"></i><span>${title}</span>`;

        const ctx = document.getElementById('mainChart');
        currentChart = new Chart(ctx, {
            type: config.type,
            data: config.getData(),
            options: config.options
        });
        currentChart.resize();
        setTimeout(() => {
            wrapper.classList.add('active');
        }, 50);
    }, 500);
}
function switchChart(chartType) {
    if (chartType === currentChartType) return;

    // Update active card
    document.querySelectorAll('.chart-option-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.chart === chartType) {
            card.classList.add('active');
        }
    });

    // Fade out
    const wrapper = document.getElementById('chartWrapper');
    wrapper.classList.remove('active');

    setTimeout(() => {
        // Update title
        const config = chartConfigs[chartType];
        const titleElement = document.getElementById('mainChartTitle');

        let title = config.title;
        if (chartType === 'topBrands') {
            title = currentCategory === 'sold'
                ? 'Top Brands by Sales Count '
                : 'Top Brands by Cars in Stock Count';
        }
        titleElement.innerHTML = `<i class="fa-solid ${config.icon}"></i><span>${title}</span>`;

        // FILTERS visibility
        const yearFilter = document.getElementById('yearFilter');
        const stockCountFilter = document.getElementById('stockCountFilter');

        if (chartType === 'topBrands') {
            if (currentCategory === 'sold') {
                setTimeout(() => yearFilter.classList.add('visible'), 100);
                stockCountFilter.classList.remove('visible');
            } else {
                yearFilter.classList.remove('visible');
                setTimeout(() => stockCountFilter.classList.add('visible'), 100);
            }
        } else {
            yearFilter.classList.remove('visible');
            stockCountFilter.classList.remove('visible');
        }

        // Destroy old chart
        if (currentChart) {
            currentChart.destroy();
        }

        // Create new chart
        const ctx = document.getElementById('mainChart');
        const wrapper = ctx.parentElement;
        const heights = {
            'topBrands': 950,
            'fuelDistribution': 550,
            'transmission': 550,
            'monthlySales': 550,
            'paymentMethods': 550
        };
        wrapper.style.height = heights[chartType] + 'px';

        currentChart = new Chart(ctx, {
            type: config.type,
            data: config.getData(),
            options: config.options
        });

        currentChart.resize();
        currentChartType = chartType;

        // Fade in
        setTimeout(() => {
            wrapper.classList.add('active');
        }, 50);

    }, 500);
}

function reloadDataForYear() {
    const year = document.getElementById('yearSelect').value;
    const minSales = document.getElementById('minSalesInput').value;
    window.location.href = `/manager-dashboard/analytics?year=${year}&minSales=${minSales}&chart=topBrands&category=${currentCategory}`;
}

function reloadDataForStockCount() {
    const stockCount = document.getElementById('stockCountSelect').value;
    window.location.href = `/manager-dashboard/analytics?stockCount=${stockCount}&chart=topBrands&category=${currentCategory}`;
}

// Initialize first chart
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    const selectedChart = urlParams.get('chart') || 'topBrands';
    const urlCategory = urlParams.get('category');

    if (urlCategory === 'stock' || urlCategory === 'sold') {
        currentCategory = urlCategory;
    }

    // Setează butoanele active corect
    document.getElementById('soldBtn').classList.toggle('active', currentCategory === 'sold');
    document.getElementById('stockBtn').classList.toggle('active', currentCategory === 'stock');

    // Setează visibility filtre corect
    const yearFilter = document.getElementById('yearFilter');
    const stockCountFilter = document.getElementById('stockCountFilter');

    if (selectedChart === 'topBrands') {
        if (currentCategory === 'sold') {
            setTimeout(() => yearFilter.classList.add('visible'), 400);
            stockCountFilter.classList.remove('visible');
        } else {
            yearFilter.classList.remove('visible');
            setTimeout(() => stockCountFilter.classList.add('visible'), 400);
        }
    } else {
        yearFilter.classList.remove('visible');
        stockCountFilter.classList.remove('visible');
    }

    switchChart(selectedChart);
});