import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо canvas елемент
    const canvas = document.getElementById('stabilityChart');
    if (!canvas) return;

    // Функція для генерації випадкових даних в заданому діапазоні
    function generateRandomData(min, max, count) {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return data;
    }

    // Генеруємо випадкові дані для графіка
    const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    const processedRequestsData = generateRandomData(900, 1500, 7);
    const activeUsersData = generateRandomData(30, 60, 7);
    const completedRequestsData = generateRandomData(700, 1000, 7);

    // Оновлюємо значення в метриках на поточний день (індекс 6 - неділя)
    const processedRequestsMetric = document.querySelector('.metric-card:nth-child(1) .metric-value');
    const activeUsersMetric = document.querySelector('.metric-card:nth-child(2) .metric-value');
    const completedRequestsMetric = document.querySelector('.metric-card:nth-child(3) .metric-value');

    if (processedRequestsMetric) processedRequestsMetric.textContent = processedRequestsData[6].toLocaleString();
    if (activeUsersMetric) activeUsersMetric.textContent = activeUsersData[6].toLocaleString();
    if (completedRequestsMetric) completedRequestsMetric.textContent = completedRequestsData[6].toLocaleString();

    // Дані для графіка
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Оброблені запити',
                data: processedRequestsData,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Активні користувачі',
                data: activeUsersData,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Виконані запити',
                data: completedRequestsData,
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    // Опції для графіка
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 15
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: 10,
                cornerRadius: 4
            }
        }
    };

    // Перевіряємо, чи підключена бібліотека Chart.js
    if (typeof Chart === 'undefined') {
        console.error('Chart.js не знайдено. Переконайтеся, що бібліотека підключена.');
        return;
    }

    // Ініціалізуємо графік
    let stabilityChart = new Chart(canvas, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });

    // Додаємо обробники подій для елементів керування
    const periodSelects = document.querySelectorAll('.filter-select');

    periodSelects.forEach(select => {
        select.addEventListener('change', () => {
            // Генеруємо нові випадкові дані при зміні фільтрів
            const newProcessedRequestsData = generateRandomData(900, 1500, 7);
            const newActiveUsersData = generateRandomData(30, 60, 7);
            const newCompletedRequestsData = generateRandomData(700, 1000, 7);

            // Оновлюємо дані графіка
            stabilityChart.data.datasets[0].data = newProcessedRequestsData;
            stabilityChart.data.datasets[1].data = newActiveUsersData;
            stabilityChart.data.datasets[2].data = newCompletedRequestsData;

            // Оновлюємо метрики
            if (processedRequestsMetric) processedRequestsMetric.textContent = newProcessedRequestsData[6].toLocaleString();
            if (activeUsersMetric) activeUsersMetric.textContent = newActiveUsersData[6].toLocaleString();
            if (completedRequestsMetric) completedRequestsMetric.textContent = newCompletedRequestsData[6].toLocaleString();

            // Оновлюємо графік
            stabilityChart.update();

            console.log('Графік оновлено з випадковими даними');
        });
    });
});