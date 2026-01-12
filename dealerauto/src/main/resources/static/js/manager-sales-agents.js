// Initialize Agent Performance Chart
document.addEventListener('DOMContentLoaded', () => {
    initAgentPerformanceChart();
});

function initAgentPerformanceChart() {
    initAgentSalesChart();
    initAgentProfitChart();
    initAgentMarkupChart();
}

// Sales Count Chart (Horizontal Bar)
function initAgentSalesChart() {
    const ctx = document.getElementById('agentSalesChart');

    if (!ctx || !agentPerformanceData || agentPerformanceData.length === 0) {
        console.log('No agent performance data available');
        return;
    }

    const labels = agentPerformanceData.map(item => item.agentName);
    const salesData = agentPerformanceData.map(item => item.salesCount || 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales Count',
                data: salesData,
                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                borderColor: '#3498db',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'Sales: ' + context.parsed.x;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 20
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)' ,
                        lineWidth: 2
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 20
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

// Profit Chart (Horizontal Bar)
function initAgentProfitChart() {
    const ctx = document.getElementById('agentProfitChart');

    if (!ctx || !agentPerformanceData || agentPerformanceData.length === 0) {
        console.log('No agent performance data available');
        return;
    }

    const labels = agentPerformanceData.map(item => item.agentName);
    const profitData = agentPerformanceData.map(item => item.totalProfit || 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Profit (€)',
                data: profitData,
                backgroundColor: 'rgba(243, 156, 18, 0.8)',
                borderColor: '#f39c12',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'Profit: ' + new Intl.NumberFormat('ro-RO', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(context.parsed.x);
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 20
                        },
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)',
                        line :2
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 20
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

function initAgentMarkupChart() {
    const ctx = document.getElementById('agentMarkupChart');

    if (!ctx || !agentPerformanceData || agentPerformanceData.length === 0) {
        console.log('No agent performance data available');
        return;
    }

    const labels = agentPerformanceData.map(item =>
        `${item.agentName} (${item.salesCount} sales)`
    );

    const markupData = agentPerformanceData.map(item => item.averageMarkup || 0);

    // Generate gradient colors based on markup value
    const backgroundColors = markupData.map(value => {
        if (value >= 20) {
            return 'rgba(46, 204, 113, 0.8)'; // Verde - markup mare
        } else if (value >= 10) {
            return 'rgba(52, 152, 219, 0.8)'; // Albastru - markup mediu
        } else if (value >= 5) {
            return 'rgba(243, 156, 18, 0.8)'; // Portocaliu - markup mic
        } else {
            return 'rgba(231, 76, 60, 0.8)'; // Roșu - markup foarte mic
        }
    });

    const borderColors = markupData.map(value => {
        if (value >= 20) return '#2ecc71';
        else if (value >= 10) return '#3498db';
        else if (value >= 5) return '#f39c12';
        else return '#e74c3c';
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Markup (%)',
                data: markupData,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'Avg Markup: ' + context.parsed.x.toFixed(2) + '%';
                        },
                        afterLabel: function(context) {
                            const value = context.parsed.x;
                            if (value >= 20) return '🟢 Excellent';
                            else if (value >= 10) return '🔵 Good';
                            else if (value >= 5) return '🟠 Fair';
                            else return '🔴 Low';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: Math.ceil(Math.max(...markupData) / 5) * 5 + 5, // Round to nearest 5 + padding
                    ticks: {
                        font: {
                            size: 20
                        },
                        callback: function(value) {
                            return value.toFixed(2) + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)' ,
                        line : 2
                    },
                    title: {
                        display: true,

                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#b8860b'
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 20,
                            weight: 'bold'
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