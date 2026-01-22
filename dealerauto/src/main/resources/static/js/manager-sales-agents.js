
// Initialize Agent Performance Chart
document.addEventListener('DOMContentLoaded', () => {
    colorMarkupBadges();
    initAgentPerformanceChart();
});

function colorMarkupBadges() {
    const spans = document.querySelectorAll('.markup-badge');

    spans.forEach(span => {
        const text = span.textContent.trim();
        const markup = parseFloat(text.replace('%', ''));

        let color;
        if (markup >= 10) {
            color = 'linear-gradient(135deg, #3d8312 0%, #36da45 100%)';  // Verde
        } else if (markup >= 5) {
            color = 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)';  // Albastru
        } else {
            color = 'linear-gradient(135deg, #f57c00 0%, #ffa726 100%)';  // Galben
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

function initAgentPerformanceChart() {
    initAgentSalesChart();
    initAgentProfitChart();
    initAgentMarkupChart();
    initAgentPerformanceChart2();
}



/**
 * Apply sorting for Agents table
 */
function applyAgentSort() {
    const sortBy = document.getElementById('agentSortBy').value;
    const sortOrder = document.getElementById('agentSortOrder').value;
    const tbody = document.querySelector('#agentsTable tbody');
    const rows = Array.from(tbody.querySelectorAll('.agent-row'));

    rows.sort((a, b) => {
        let aValue, bValue;

        switch(sortBy) {
            case 'salesCount':
                aValue = parseInt(a.dataset.sales);
                bValue = parseInt(b.dataset.sales);
                break;
            case 'totalRevenue':
                aValue = parseFloat(a.dataset.revenue);
                bValue = parseFloat(b.dataset.revenue);
                break;
            case 'totalProfit':
                aValue = parseFloat(a.dataset.profit);
                bValue = parseFloat(b.dataset.profit);
                break;
            case 'averageMarkup':
                aValue = parseFloat(a.dataset.markup);
                bValue = parseFloat(b.dataset.markup);
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

    // Clear tbody and recalculate ranks
    tbody.innerHTML = '';
    rows.forEach((row, index) => {
        // Actualizează rank badge
        const rankBadge = row.querySelector('.rank-badge');
        rankBadge.textContent = '#' + (index + 1);

        // Resetează clasele
        rankBadge.className = 'rank-badge';

        // Adaugă culori pentru top 3
        if (index === 0) rankBadge.classList.add('rank-gold');
        else if (index === 1) rankBadge.classList.add('rank-silver');
        else if (index === 2) rankBadge.classList.add('rank-bronze');

        tbody.appendChild(row);
    });

    // Visual feedback
    showSortFeedback('agentsTable');
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
        if (value >= 10) {
            return 'rgba(46, 204, 113, 0.8)'; // Verde - markup mare
        } else if (value >= 5) {
            return 'rgba(52, 152, 219, 0.8)'; // Albastru - markup mediu
        } else if (value >= 2) {
            return 'rgba(243, 156, 18, 0.8)'; // Portocaliu - markup mic
        } else {
            return 'rgba(231, 76, 60, 0.8)'; // Roșu - markup foarte mic
        }
    });

    const borderColors = markupData.map(value => {
        if (value >= 10) return '#2ecc71';
        else if (value >= 5) return '#3498db';
        else if (value >= 2) return '#f39c12';
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
                            return 'Avg Markup: ' + context.parsed.x.toFixed(2) + '%';
                        },
                        afterLabel: function(context) {
                            const value = context.parsed.x;
                            if (value >= 10) return '🟢 Excellent';
                            else if (value >= 5) return '🔵 Good';
                            else if (value >= 2) return '🟠 Fair';
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

function initAgentPerformanceChart2() {
    const ctx = document.getElementById('agentPerformanceChart');
    if (!ctx || !topAgentsData || topAgentsData.length === 0) {
        console.log('No agent data available');
        return;
    }

    console.log('🔍 Top Agents Data:', topAgentsData);

    // Extrage lunile unice și sortează
    const uniqueMonths = [...new Set(topAgentsData.map(d => d.monthDate))].sort();
    const labels = uniqueMonths.map(date => {
        const d = new Date(date);
        return `${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    });

    // Grupează datele per agent
    const agentNames = [...new Set(topAgentsData.map(d => d.agentName))];

    console.log('📅 Labels:', labels);
    console.log('👥 Agents:', agentNames);

    // Culori pentru agenți
    const colors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
        '#1abc9c', '#e67e22', '#34495e', '#16a085', '#d35400'
    ];

    // Creează dataset pentru fiecare agent - DOAR Sales
    const salesDatasets = agentNames.map((agentName, index) => {
        const agentData = topAgentsData.filter(d => d.agentName === agentName);
        const salesData = uniqueMonths.map(month => {
            const found = agentData.find(d => d.monthDate === month);
            return found ? found.salesCount : 0;
        });

        return {
            label: agentName,
            data: salesData,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '40',
            borderWidth: 5,
            tension: 0.4,
            fill: false,

            // BULINE
            pointRadius: 8,
            pointHoverRadius: 12,
            pointBackgroundColor: colors[index % colors.length],
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBackgroundColor: colors[index % colors.length],
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3
        };
    });

    const allSalesValues = salesDatasets.flatMap(ds => ds.data);
    const maxSales = Math.max(...allSalesValues);

    console.log('📊 Max Sales:', maxSales);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: salesDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,

            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 50,
                        boxHeight: 50,
                        padding: 20,
                        font: {
                            size: 28,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'nearest',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 18, weight: 'bold' },
                    bodyFont: { size: 18, weight: 'bold' },
                    padding: 12,
                    caretSize: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' sales';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timeline',
                        font: {
                            size: 28,
                            weight: 'bold'
                        },
                        color: '#b8860b'
                    },
                    ticks: {
                        font: {
                            size: 22,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)',
                        lineWidth: 2  // Îngroșat
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    max: Math.ceil(maxSales * 1.1),
                    ticks: {
                        stepSize: Math.max(1, Math.ceil(maxSales / 10)),
                        font: {
                            size: 22,
                            weight: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Sales Count',
                        font: {
                            size: 26,
                            weight: 'bold'
                        },
                        color: '#b8860b'
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
                    max: Math.ceil(maxSales * 1.1),
                    ticks: {
                        stepSize: Math.max(1, Math.ceil(maxSales / 10)),
                        font: {
                            size: 22,
                            weight: 'bold'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Sales Count',
                        font: {
                            size: 26,
                            weight: 'bold'
                        },
                        color: '#b8860b'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
        }
    });
}

function reloadAgentChart() {
    const fromMonth = document.getElementById('fromMonthSelect').value;
    const fromYear = document.getElementById('fromYearSelect').value;
    const toMonth = document.getElementById('toMonthSelect').value;
    const toYear = document.getElementById('toYearSelect').value;
    const topAgents = document.getElementById('topAgentsInput').value;

    window.location.href = `/manager-dashboard/sales-agents?fromMonth=${fromMonth}&fromYear=${fromYear}&toMonth=${toMonth}&toYear=${toYear}&topAgents=${topAgents}`;
}