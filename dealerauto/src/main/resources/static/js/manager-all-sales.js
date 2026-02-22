let currentOffset = 0;
const limit = 5;
let hasMore = true;
let allFilters = {
    // Agent si sorting
    agentId: null,
    sortBy: 'data_vanzare',
    sortOrder: 'DESC',
    // Perioada
    startDate: null,
    endDate: null
};

let globalKPIs = {
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalPurchase: 0
};
let currentPeriodFilters = {
    startDate: null,
    endDate: null
};
// Funcție pentru a obține TOATE vânzările filtrate (pentru KPI-uri)
async function loadAllFilteredSales() {

    const params = new URLSearchParams({
        offset: 0,
        limit: 999,  // Limită mare pentru a lua tot
        sortBy: allFilters.sortBy,
        sortOrder: allFilters.sortOrder
    });

    if (allFilters.agentId && allFilters.agentId !== 'all') {
        params.append('agentId', allFilters.agentId);
    }
    if (allFilters.startDate) {
        params.append('startDate', allFilters.startDate);
    }
    if (allFilters.endDate) {
        params.append('endDate', allFilters.endDate);
    }
    try {
        const response = await fetch(`/api/manager/sales?${params}`);
        const data = await response.json();

        // Calculează totalurile
        let totalRevenue = 0;
        let totalProfit = 0;
        let totalPurchase = 0;

        data.sales.forEach(sale => {
            totalRevenue += sale.finalPrice || 0;
            totalProfit += sale.profit || 0;
            totalPurchase += sale.purchasePrice || 0;
        });

        globalKPIs = {
            totalSales: data.sales.length,
            totalRevenue: totalRevenue,
            totalProfit: totalProfit,
            totalPurchase: totalPurchase
        };

        updateFilteredKPIs();

    } catch (error) {
        console.error('Error loading all sales for KPIs:', error);
    }
}

function calculateDateRange(period) {
    const today = new Date();
    let startDate, endDate;

    switch(period) {
        case 'today':
            startDate = new Date(today);
            endDate = new Date(today);
            break;
        case 'week':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            endDate = today;
            break;
        case 'month':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 1);
            endDate = today;
            break;
        case '3months':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 3);
            endDate = today;
            break;
        case '6months':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 6);
            endDate = today;
            break;
        case 'year':
            startDate = new Date(today);
            startDate.setFullYear(today.getFullYear() - 1);
            endDate = today;
            break;
        case 'all':
        default:
            return { startDate: null, endDate: null };
    }

    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
}
// Format number RO
function formatNumber(num) {
    if (num == null || isNaN(num)) return "0,00";
    return num
        .toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;  // mm-dd-yyyy
}
// Update sort icon based on order
function updateSortIcon() {
    const sortIcon = document.getElementById('sortIcon');
    const sortOrder = document.getElementById('sortOrder').value;

    if (sortOrder === 'ASC') {
        sortIcon.className = 'fa-solid fa-arrow-down-short-wide sort-icon';
    } else {
        sortIcon.className = 'fa-solid fa-arrow-down-wide-short sort-icon';
    }
}

// Load sales
async function loadSales(append = false) {
    if (!append) {
        currentOffset = 0;
        document.getElementById('salesTableBody').innerHTML = '';
    }

    const params = new URLSearchParams({
        offset: currentOffset,
        limit: limit,
        sortBy: allFilters.sortBy,
        sortOrder: allFilters.sortOrder
    });

    if (allFilters.agentId && allFilters.agentId !== 'all') {
        params.append('agentId', allFilters.agentId);
    }
    if (allFilters.startDate) {
        params.append('startDate', allFilters.startDate);
    }

    if (allFilters.endDate) {
        params.append('endDate', allFilters.endDate);
    }
    try {
        const response = await fetch(`/api/manager/sales?${params}`);
        const data = await response.json();

        displaySales(data.sales, append);
        updateFilteredKPIs();
        hasMore = data.hasMore;

        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.disabled = !hasMore;
        loadMoreBtn.textContent = hasMore ? 'Load More' : 'No More Sales';

        const displayed = currentOffset + data.sales.length;
        const el = document.getElementById('salesCount');
        el.textContent = `Showing ${displayed} of ${data.total} sales`;
        el.style.fontSize = '30px';
        el.style.textAlign= 'center';
        el.style.marginBottom= '10px';

        currentOffset += limit;

    } catch (error) {
        console.error('Error loading sales:', error);
        alert('Failed to load sales data');
    }
}


// Funcție pentru actualizarea KPI-urilor - SIMPLIFICATĂ
function updateFilteredKPIs() {
    const salesCount = globalKPIs.totalSales;
    const totalRevenue = globalKPIs.totalRevenue;
    const totalProfit = globalKPIs.totalProfit;
    const totalPurchase = globalKPIs.totalPurchase;

    // Calculează markup-ul global
    const markup = totalPurchase > 0 ? ((totalRevenue - totalPurchase) / totalPurchase * 100) : 0;

    // Trigger animație
    const kpiValues = document.querySelectorAll('.kpi-value');
    kpiValues.forEach(el => {
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = 'fadeIn 0.6s ease';
        }, 10);
    });

    // Actualizează valorile
    document.getElementById('filteredSalesCount').textContent = salesCount;
    document.getElementById('filteredRevenue').textContent = formatNumber(totalRevenue) + ' €';

    const profitElement = document.getElementById('filteredProfit');
    profitElement.textContent = formatNumber(totalProfit) + ' €';
    profitElement.style.color = totalProfit >= 0 ? '#4CAF50' : '#f44336';

    const markupElement = document.getElementById('filteredMarkup');
    const markupSign = markup >= 0 ? '+' : '';
    markupElement.textContent = markupSign + formatNumber(markup) + '%';
    markupElement.style.color = markup >= 0 ? '#4CAF50' : '#f44336';
}

// Funcție pentru traducerea tipului de plată
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

// Display sales in table
function displaySales(sales, append) {
    const tbody = document.getElementById('salesTableBody');

    if (!append) {
        tbody.innerHTML = '';
    }

    if (sales.length === 0 && !append) {
        tbody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align: center; padding: 40px; color: #666;">
                    <i class="fa-solid fa-inbox" style="font-size: 32px; margin-bottom: 10px;"></i>
                    <p>No sales found for the selected filters.</p>
                </td>
            </tr>
        `;
        return;
    }

    sales.forEach(sale => {
        const row = document.createElement('tr');

        const profitClass = sale.profit >= 0 ? 'profit-positive' : 'profit-negative';
        const profitIcon = sale.profit >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';

        // Markup logic
        const markupValue = sale.markupPercentage;
        const markupColor = markupValue >= 0 ? '#4CAF50' : '#f44336';
        const markupSign = markupValue >= 0 ? '+' : '';

        // Traducere tip tranzacție
        const translatedType = translatePaymentType(sale.transactionType);

        // Culoare pentru tip tranzacție
        const typeColors = {
            'Cash': '#4CAF50',
            'Bank Transfer': '#2196F3',
            'Leasing': '#9C27B0',
            'Installments': '#FF9800'
        };
        const typeColor = typeColors[translatedType] || '#757575';

        row.innerHTML = `
            <td>
                <strong style="color: #b8860b;font-weight: 700">#${sale.saleId}</strong>
            </td>
            <td>
                <strong>${formatDate(sale.saleDate)}</strong>
            </td>
            <td>
                <strong style="color: #b8860b;font-weight: 600">${sale.brandName}</strong> ${sale.model}
            </td>
            <td>
                <div style="line-height: 1.5;">
                    ${sale.clientName}<br>
                </div>
            </td>
            <td>
                <span style=" color: #b8860b;font-weight: 600">
                    ${sale.agentName}
                </span>
            </td>
            <td>
                ${sale.providerName || '-'}
            </td>
            <td>
                <strong>${formatNumber(sale.purchasePrice)} €</strong>
            </td>
            <td>
                <span style="  font-size:24px; margin-left:15px;font-weight: 600; color: #1976d2;">
                    ${sale.daysInStock}
                </span>
            </td>
            <td>
                <strong>${formatNumber(sale.finalPrice)} €</strong>
            </td>
            <td>
                <div class="${profitClass}" style="display: flex; align-items: center;font-size:24px; gap: 5px;margin-left: -5px;">
                    <i class="fa-solid ${profitIcon}" style="font-size:24px; margin-right: 5px;"></i>
                    <strong>${formatNumber(sale.profit)} €</strong>
                </div>
            </td>
            <td>
                <span class="provider-type-badge" style="background: ${markupColor}; color: white;">
                    ${markupSign}${formatNumber(markupValue)}%
                </span>
            </td>
           <td>
                <span style="padding: 4px 10px; border-radius: 6px; 
                       background: ${typeColor}; color: white;">
                    ${translatedType}
                </span>
            </td>
        `;

        tbody.appendChild(row);
    });
}

let salesChart = null;
let currentPeriodType = '6months';

// Helper pentru parsing date românești
function parseRomanianDate(dateStr) {
    const [month, day, year] = dateStr.split('-');
    return new Date(year, month - 1, day);
}

// Functie pentru a determina intervalul de grupare in functie de numarul de zile
function getGroupingInterval(startDate, endDate, periodType) {
    // PRIORITATE 1: Verifică mai întâi periodType specific
    if (periodType === 'today') {
        return 'day';
    }

    if (periodType === 'week') {
        return 'day';  // Last Week: zi în zi
    }

    if (periodType === 'month') {
        return '2days';  // Last Month: din 2 în 2 zile
    }

    if (periodType === '3months') {
        return '5days';  // Last 3 Months: din 5 în 5 zile
    }

    if (periodType === '6months') {
        return '5days';  // Last 6 Months: din 5 în 5 zile
    }

    if (periodType === 'year') {
        return 'month';  // Last Year: pe lună
    }

    if (periodType === 'all') {
        return 'month';  // All Time: pe lună
    }

    // PRIORITATE 2: Pentru custom range (când periodType nu e setat sau e gol)
    if (startDate && endDate && (!periodType || periodType === '')) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 'day';
        if (diffDays <= 15) return 'day';
        if (diffDays <= 30) return '2days';
        if (diffDays <= 60) return '3days';
        if (diffDays <= 120) return '5days';
        return 'month';
    }

    // Fallback
    return 'month';
}

function groupSalesSingleDay(sales, selectedDate) {
    const centerDay = new Date(selectedDate);
    centerDay.setHours(0, 0, 0, 0);

    const grouped = {};

    // Creează 5 zile: ziua-2 → ziua+2
    for (let i = -1; i <= 3; i++) {
        const date = new Date(centerDay);
        date.setDate(date.getDate() + i);

        const key = formatDate(date.toISOString().split('T')[0]);

        grouped[key] = {
            date: key,
            salesCount: 0,
            revenue: 0,
            profit: 0
        };
    }

    // Adaugă vânzările DOAR pe ziua selectată
    sales.forEach(sale => {
        const saleKey = formatDate(sale.saleDate);
        if (grouped[saleKey]) {
            grouped[saleKey].salesCount++;
            grouped[saleKey].revenue += sale.finalPrice || 0;
            grouped[saleKey].profit += sale.profit || 0;
        }
    });

    // Returnează sortat cronologic
    return Object.values(grouped).sort(
        (a, b) => parseRomanianDate(a.date) - parseRomanianDate(b.date)
    );
}


// Functie pentru a grupa datele pe perioade
// Funcție pentru a grupa datele pe perioade - CALCULARE INVERSĂ de la endDate
function groupSalesByPeriod(sales, groupInterval, startDate, endDate , periodType) {
    // Cazuri o singura zi
    // CAZ 1: Today
    if (periodType === 'today') {
        return groupSalesSingleDay(sales, endDate);
    }

    // CAZ 2: Custom range cu o singură zi
    if (startDate && endDate && startDate === endDate) {
        return groupSalesSingleDay(sales, endDate);
    }

    if (!startDate || !endDate) {
        // Fallback pentru All Time
        if (sales.length === 0) return [];
        const dates = sales.map(s => new Date(s.saleDate)).sort((a, b) => a - b);
        startDate = dates[0].toISOString().split('T')[0];
        endDate = dates[dates.length - 1].toISOString().split('T')[0];
    }

    const grouped = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (groupInterval === 'month') {
        // Grupare pe lună - CALCULARE INVERSĂ de la endDate
        const endMonth = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        const startMonth = new Date(start.getFullYear(), start.getMonth(), 1);

        // Creează buckets mergând înapoi de la endDate
        let currentDate = new Date(endMonth);

        while (currentDate >= startMonth) {
            const displayDate = formatDate(currentDate.toISOString().split('T')[0]);
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            // Ajustează la limitele perioadei
            const bucketStart = monthStart < start ? start : monthStart;
            const bucketEnd = monthEnd > end ? end : monthEnd;

            grouped[displayDate] = {
                date: displayDate,
                startDate: bucketStart,
                endDate: bucketEnd,
                salesCount: 0,
                revenue: 0,
                profit: 0
            };

            // Mergi înapoi cu o lună
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
        }

        // Adaugă vânzările
        sales.forEach(sale => {
            const saleDate = new Date(sale.saleDate);

            for (let key in grouped) {
                const bucket = grouped[key];
                if (saleDate >= bucket.startDate && saleDate <= bucket.endDate) {
                    bucket.salesCount++;
                    bucket.revenue += sale.finalPrice || 0;
                    bucket.profit += sale.profit || 0;
                    break;
                }
            }
        });

    } else if (groupInterval === 'day') {
        // Grupare zilnică - CALCULARE INVERSĂ de la endDate
        let currentDate = new Date(end);

        while (currentDate >= start) {
            const key = formatDate(currentDate.toISOString().split('T')[0]);
            grouped[key] = {
                date: key,
                salesCount: 0,
                revenue: 0,
                profit: 0
            };
            currentDate.setDate(currentDate.getDate() - 1);
        }

        // Adaugă vânzările
        sales.forEach(sale => {
            const key = formatDate(sale.saleDate);
            if (grouped[key]) {
                grouped[key].salesCount++;
                grouped[key].revenue += sale.finalPrice || 0;
                grouped[key].profit += sale.profit || 0;
            }
        });

    } else if (groupInterval === '2days' || groupInterval === '3days' || groupInterval === '5days') {
        // Determină intervalul de zile
        const dayInterval = groupInterval === '2days' ? 2 : (groupInterval === '3days' ? 3 : 5);

        // Creează buckets mergând înapoi de la endDate
        let currentDate = new Date(end);

        while (currentDate >= start) {
            const displayDate = formatDate(currentDate.toISOString().split('T')[0]);
            const bucketStart = new Date(currentDate.getTime() - (dayInterval - 1) * 24 * 60 * 60 * 1000);

            // Ajustează dacă depășește startDate
            const adjustedStart = bucketStart < start ? start : bucketStart;

            grouped[displayDate] = {
                date: displayDate,
                startDate: adjustedStart,
                endDate: new Date(currentDate),
                salesCount: 0,
                revenue: 0,
                profit: 0
            };

            // Mergi înapoi cu dayInterval zile
            currentDate.setDate(currentDate.getDate() - dayInterval);
        }

        // Distribuie vânzările în buckets
        sales.forEach(sale => {
            const saleDate = new Date(sale.saleDate);

            for (let key in grouped) {
                const bucket = grouped[key];
                if (saleDate >= bucket.startDate && saleDate <= bucket.endDate) {
                    bucket.salesCount++;
                    bucket.revenue += sale.finalPrice || 0;
                    bucket.profit += sale.profit || 0;
                    break;
                }
            }
        });
    }

    // Convertește în array și sortează CRONOLOGIC (de la vechi la nou)
    return Object.values(grouped).sort((a, b) => {
        const dateA = parseRomanianDate(a.date);
        const dateB = parseRomanianDate(b.date);
        return dateA - dateB;
    });
}
// Funcție pentru a obține datele pentru grafic
// Funcție pentru a obține datele pentru grafic
async function loadChartData() {
    const params = new URLSearchParams({
        offset: 0,
        limit: 9999,
        sortBy: 'data_vanzare',
        sortOrder: 'ASC'
    });

    if (allFilters.agentId && allFilters.agentId !== 'all') {
        params.append('agentId', allFilters.agentId);
    }

    // NU MAI EXTINDE perioada - folosește exact startDate și endDate
    if (allFilters.startDate) {
        params.append('startDate', allFilters.startDate);
    }

    if (allFilters.endDate) {
        params.append('endDate', allFilters.endDate);
    }

    try {
        const response = await fetch(`/api/manager/sales?${params}`);
        const data = await response.json();

        return {
            sales: data.sales,
            startDate: allFilters.startDate,
            endDate: allFilters.endDate
        };

    } catch (error) {
        console.error('Error loading chart data:', error);
        return { sales: [], startDate: null, endDate: null };
    }
}

// Funcție pentru crearea/actualizarea graficului - MODIFICATĂ
async function updateChart() {
    const { sales, startDate, endDate } = await loadChartData();

    // determina intervalul de grupare
    const groupInterval = getGroupingInterval(startDate, endDate, currentPeriodType);
    console.log(' Grouping interval:', groupInterval, 'Period type:', currentPeriodType);

    // TRIMITE startDate și endDate la groupSalesByPeriod
    const groupedData = groupSalesByPeriod(sales, groupInterval, startDate, endDate,currentPeriodType);
    const isSingleDay =
        currentPeriodType === 'today' ||
        (startDate && endDate && startDate === endDate);
    const labels = groupedData.map(d => d.date);
    const salesCountData = groupedData.map(d => d.salesCount);
    const revenueData = groupedData.map(d => d.revenue);
    const profitData = groupedData.map(d => d.profit);

    const ctx = document.getElementById('salesChart').getContext('2d');

    // Distruge chart-ul vechi dacă există
    if (salesChart) {
        salesChart.destroy();
    }

    // Creează chart nou
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Profit (€)',
                    data: profitData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y',
                    revenue: revenueData,
                    // ADAUGĂ ACESTEA pentru buline mai mari
                    pointRadius: 8,
                    pointHoverRadius: 12,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#2e7d32',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3
                },
                {
                    label: 'Number of Sales',
                    data: salesCountData,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    yAxisID: 'y1',
                    revenue: revenueData,
                    // ADAUGĂ ACESTEA pentru buline mai mari
                    pointRadius: 8,
                    pointHoverRadius: 12,
                    pointBackgroundColor: '#2196F3',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#1565c0',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
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
                    intersect: false,
                    callbacks: {
                        afterTitle: function(context) {
                            const dataIndex = context[0].dataIndex;
                            const revenue = revenueData[dataIndex];
                            return 'Revenue: ' + formatNumber(revenue) + ' €';
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (label.includes('€')) {
                                    label += formatNumber(context.parsed.y) + ' €';
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
                    display: true,
                    title: {
                        display: true,
                        text: groupInterval === 'month' ? 'Month' : 'Date',
                        font: {
                            size: 32,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 18
                        },
                        //
                        callback: function(value, index, ticks) {
                            if (isSingleDay) {
                                // indexul 2 din 5
                                return index === 2 ? this.getLabelForValue(value) : '';
                            }
                            return this.getLabelForValue(value);
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Profit (€)',
                        font: {
                            size: 30,
                            weight: 'bold'
                        }
                    },
                    min: -1000,
                    ticks: {
                        callback: function(value) {
                            if (Math.abs(value) >= 1000) {
                                return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'K €';
                            }
                            return value + ' €';
                        },
                        font: {
                            size: 24
                        }
                    },
                    afterBuildTicks: function(axis) {
                        const max = Math.max(...profitData);
                        const min = -1000;
                        const range = max - min;

                        let stepSize;
                        if (range <= 6000) {
                            stepSize = 500;
                        } else if (range <= 14000) {
                            stepSize = 1000;
                        } else {
                            stepSize = 2000;
                        }

                        axis.ticks = [];
                        for (let i = min; i <= Math.ceil(max / stepSize) * stepSize; i += stepSize) {
                            axis.ticks.push({ value: i });
                        }
                        const hasZero = axis.ticks.some(tick => tick.value === 0);
                        if (!hasZero && min < 0 && max > 0) {
                            axis.ticks.push({ value: 0 });
                            axis.ticks.sort((a, b) => a.value - b.value);
                        }
                    },
                    grace: '5%',
                    grid: {
                        color: function(context) {
                            if (context.tick.value === 0) {
                                return '#333';  //  linia la 0
                            }
                            return 'rgba(0, 0, 0, 0.1)';  // celelalte linii
                        },
                        lineWidth: function(context) {
                            if (context.tick && context.tick.value === 0) {
                                return 3;  // Grosime 3px pentru linia la 0
                            }
                            return 1;  // Grosime normală pentru celelalte
                        },
                        drawTicks: true,
                        z: 1
                    },
                    afterDraw: function(chart) {
                        const ctx = chart.ctx;
                        const yAxis = chart.scales.y;
                        const xAxis = chart.scales.x;

                        if (!yAxis || !xAxis) return;
                        // Calculează poziția y pentru valoarea 0
                        const yPos = yAxis.getPixelForValue(0);

                        // Verifică dacă 0 este în vizibil range
                        if (yPos >= yAxis.top && yPos <= yAxis.bottom) {
                            ctx.save();
                            ctx.strokeStyle = '#333';
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(xAxis.left, yPos);
                            ctx.lineTo(xAxis.right, yPos);
                            ctx.stroke();
                            ctx.restore();
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Number of Sales',
                        font: {
                            size: 30,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        precision: 0,
                        callback: function(value) {
                            return Number.isInteger(value) ? value : '';
                        },
                        font: {
                            size: 24
                        }
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// Funcții pentru overlay chart
function showChartOverlay() {
    document.getElementById('chartOverlay').style.display = 'flex';
}

function hideChartOverlay() {
    document.getElementById('chartOverlay').style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    const dateRange = calculateDateRange('6months');
    allFilters.startDate = dateRange.startDate;
    allFilters.endDate = dateRange.endDate;
    currentPeriodType = '6months';

    loadSales();
    loadAllFilteredSales();
    updateChart();
    updateSortIcon();
    // Auto-apply când schimbi Period Select - fara Apply button
    document.getElementById('periodFilter').addEventListener('change', function() {
        showTableOverlay();
        showChartOverlay();

        const periodSelect = this.value;
        currentPeriodType = periodSelect;

        if (periodSelect === 'all') {
            // All Time - resetează perioada
            allFilters.startDate = null;
            allFilters.endDate = null;
        } else if (periodSelect && periodSelect !== '') {
            // Altă perioadă - calculează range
            const dateRange = calculateDateRange(periodSelect);
            allFilters.startDate = dateRange.startDate;
            allFilters.endDate = dateRange.endDate;
        }

        // RESETEAZĂ câmpurile custom
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';

        setTimeout(() => {
            loadSales(false);
            loadAllFilteredSales();
            updateChart();
            hideTableOverlay();
            hideChartOverlay();
        }, 900);
    });

    // Apply Period Filter - DOAR pentru Custom Date Range
    document.getElementById('applyPeriod').addEventListener('click', () => {
        showTableOverlay();
        showChartOverlay();

        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        if (dateFrom && dateTo) {
            if (new Date(dateFrom) > new Date(dateTo)) {
                alert('Start date cannot be after end date!');
                hideTableOverlay();
                hideChartOverlay();
                return;
            }
            // Actualizează perioada cu custom dates
            allFilters.startDate = dateFrom;
            allFilters.endDate = dateTo;
            currentPeriodType = '';
            // RESETEAZĂ selectul la "-"
            document.getElementById('periodFilter').value = '';

            setTimeout(() => {
                loadSales(false);
                loadAllFilteredSales();
                updateChart();
                hideTableOverlay();
                hideChartOverlay();
            }, 500);
        } else {
            alert('Please select both From and To dates!');
            hideTableOverlay();
            hideChartOverlay();
        }
    });
    // Apply filters button
    document.getElementById('applyFilters').addEventListener('click', () => {

        showTableOverlay();
        showChartOverlay();

        const agentFilter = document.getElementById('agentFilter').value;
        const sortBy = document.getElementById('sortBy').value;
        const sortOrder = document.getElementById('sortOrder').value;

        allFilters.agentId = agentFilter === 'all' ? null : agentFilter;
        allFilters.sortBy = sortBy;
        allFilters.sortOrder = sortOrder;

        updateSortIcon();

        setTimeout(() => {
            loadSales(false);
            loadAllFilteredSales();
            updateChart();
            hideTableOverlay();
            hideChartOverlay();
        }, 900);
    });

    // Update icon when sort order changes
    document.getElementById('sortOrder').addEventListener('change', updateSortIcon);
    // Load more button
    document.getElementById('loadMoreBtn').addEventListener('click', () => {
        if (hasMore) {
            // Arata overlay-ul
            showTableOverlay();

            setTimeout(() => {
                loadSales(true);
                hideTableOverlay();
            }, 700);
        }
    });
});

// Arată overlay-ul
function showTableOverlay() {
    document.getElementById('tableOverlay').style.display = 'flex';
}

// Ascunde overlay-ul
function hideTableOverlay() {
    document.getElementById('tableOverlay').style.display = 'none';
}