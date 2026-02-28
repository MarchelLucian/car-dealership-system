document.addEventListener('DOMContentLoaded', () => {
    initProviderPerformanceChart();
    initProviderPerformanceChart2();
    colorConversionRates();
});

function colorConversionRates() {
    const spans = document.querySelectorAll('.conversion-rate');

    spans.forEach(span => {
        const text = span.textContent.trim();
        const rate = parseFloat(text.replace('%', ''));

        let color;
        if (rate === 0) {
            color = 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)';  
        } else if (rate <= 20) {
            color = 'linear-gradient(135deg, #c62828 0%, #f44336 100%)';  
        } else if (rate < 50) {
            color = 'linear-gradient(135deg, #f57c00 0%, #ffa726 100%)';  
        } else {
            color = 'linear-gradient(135deg, #3d8312 0%, #36da45 100%)';  
        }

        span.style.background = color;
        span.style.color = 'white';
        span.style.padding = '6px 12px';
        span.style.borderRadius = '20px';
        span.style.fontWeight = '700';
        span.style.display = 'inline-block';
        span.style.minWidth = '60px';
        span.style.textAlign = 'center';
    });
}

function initProviderPerformanceChart() {
    const ctx = document.getElementById('providerPerformanceChart');
    if (!ctx) return;

    // Preia datele din Thymeleaf
    if (typeof topProfitableProviders === 'undefined' || topProfitableProviders.length === 0) {
        console.log('No profitable provider data available');
        return;
    }

    const labels = topProfitableProviders.map(p => p.providerName);
    const profits = topProfitableProviders.map(p => p.totalProfit);
    const suppliedData = topProfitableProviders.map(p => p.carsSupplied);
    const soldData = topProfitableProviders.map(p => p.carsSold);
    const revenues = topProfitableProviders.map(p => p.totalRevenue);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Purchase Value (€)',
                    data: revenues,
                    backgroundColor: 'rgba(155, 89, 182, 0.8)',
                    borderColor: '#9b59b6',
                    borderWidth: 2,
                    barThickness: 40,
                    maxBarThickness: 50,
                    yAxisID: 'y1'
                },
                {
                    label: 'Cars Sold',
                    data: soldData,
                    backgroundColor: 'rgba(46, 204, 113, 0.8)',
                    borderColor: '#2ecc71',
                    borderWidth: 2,
                    barThickness: 40,
                    maxBarThickness: 50,
                    yAxisID: 'y'
                },
                {
                    label: 'Total Profit (€)',
                    data: profits,
                    backgroundColor: 'rgba(255, 102, 0, 0.8)',
                    borderColor: '#ff6600',
                    borderWidth: 2,
                    barThickness: 40,
                    maxBarThickness: 50,
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
                            size: 28,
                            weight: 'bold'
                        },
                        boxWidth: 60,
                        boxHeight: 35,
                        padding: 25
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
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
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
                        font: { size: 22 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)',
                        lineWidth: 2
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cars Count',
                        font: {
                            size: 24,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: { size: 22 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)',
                        lineWidth: 2
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: ' Value (€)',
                        font: {
                            size: 24,
                            weight: 'bold'
                        }
                    },
                    ticks: {
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
                        drawOnChartArea: false  // Nu suprapune grid-ul cu axa Y stângă
                    }
                }
            }
        }
    });

}

function initProviderPerformanceChart2() {
    const ctx = document.getElementById('providerPerformanceChart2');
    if (!ctx) return;

    const rows = Array.from(document.querySelectorAll('.provider-row'));

    if (rows.length === 0) {
        console.log('No provider data available');
        return;
    }

    const providers = rows.map(row => ({
        name: row.dataset.name,
        supplied: Number(row.dataset.supplied),
        sold: Number(row.dataset.sold)
    }));

    // Sort descrescător după Cars Supplied
    providers.sort((a, b) => b.supplied - a.supplied);

    const top10 = providers.slice(0, 10);

    const labels = top10.map(p => p.name);
    const suppliedData = top10.map(p => p.supplied);
    const soldData = top10.map(p => p.sold);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cars Supplied',
                    data: suppliedData,
                    backgroundColor: 'rgba(52, 152, 219, 0.8)',
                    borderColor: '#3498db',
                    borderWidth: 2,
                    barThickness: 40,
                    maxBarThickness: 50
                },
                {
                    label: 'Cars Sold',
                    data: soldData,
                    backgroundColor: 'rgba(46, 204, 113, 0.8)',
                    borderColor: '#2ecc71',
                    borderWidth: 2,
                    barThickness: 40,
                    maxBarThickness: 50
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
                            size: 28,
                            weight: 'bold'
                        },
                        boxWidth: 60,
                        boxHeight: 35,
                        padding: 25
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
                x: {
                    ticks: {
                        font: { size: 22 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)',
                        lineWidth: 2
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 22 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)',
                        lineWidth: 2
                    }
                }
            }
        }
    });
}

function reloadProviderChart() {
    const minCars = document.getElementById('minCarsInput').value;
    window.location.href = `/manager-dashboard/providers?minCarsSold=${minCars}`;
}