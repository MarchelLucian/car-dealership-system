document.addEventListener('DOMContentLoaded', () => {
    initProviderPerformanceChart();
});


function initProviderPerformanceChart() {
    const ctx = document.getElementById('providerPerformanceChart');
    if (!ctx) return;

    // Luăm datele direct din tabel
    const rows = Array.from(document.querySelectorAll('.provider-row'));

    if (rows.length === 0) {
        console.log('No provider data available');
        return;
    }

    // Extragem datele
    const providers = rows.map(row => ({
        name: row.dataset.name,
        supplied: Number(row.dataset.supplied),
        sold: Number(row.dataset.sold)
    }));

    // Sort descrescător după Cars Supplied
    providers.sort((a, b) => b.supplied - a.supplied);

    // Luăm doar top 10
    const topProviders = providers.slice(0, 10);

    const labels = topProviders.map(p => p.name);
    const suppliedData = topProviders.map(p => p.supplied);
    const soldData = topProviders.map(p => p.sold);

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
                    font: { size: 28 } ,
                    borderWidth: 2 ,
                    barThickness: 40,
                    maxBarThickness: 50
                },
                {
                    label: 'Cars Sold',
                    data: soldData,
                    backgroundColor: 'rgba(46, 204, 113, 0.8)',
                    borderColor: '#2ecc71',
                    font: { size: 28 } ,
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
                }
            },

            scales: {
                x: {
                    ticks: {
                        font: { size: 22 }
                    } ,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)' ,
                        line : 2
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 22 }
                    } ,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.45)' ,
                        line : 2
                    }
                }
            }
        }
    });

}
