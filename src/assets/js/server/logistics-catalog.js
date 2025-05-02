document.addEventListener('DOMContentLoaded', () => {
    // Завантаження даних про логістів
    fetchLogistics();

    // Обробка кнопки додавання логіста
    document.getElementById('add-logistic-button').addEventListener('click', () => {
        document.getElementById('add-logistic-form-container').style.display = 'block';
    });

    // Обробка кнопки скасування додавання
    document.getElementById('cancel-logistic-add').addEventListener('click', () => {
        document.getElementById('add-logistic-form-container').style.display = 'none';
        document.getElementById('add-logistic-form').reset();
    });

    // Обробка кнопки скасування редагування
    document.getElementById('cancel-logistic-edit').addEventListener('click', () => {
        document.getElementById('edit-logistic-form-container').style.display = 'none';
    });

    // Обробка форми додавання логіста
    const addForm = document.getElementById('add-logistic-form');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addLogistic();
    });

    // Обробка форми редагування логіста
    const editForm = document.getElementById('edit-logistic-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateLogistic();
    });
});

// Функція для отримання логістів з API
async function fetchLogistics() {
    try {
        const response = await fetch('http://localhost:5000/api/Logistics');

        // Перевіряємо тип відповіді
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Очікувався JSON, отримано інший формат');
        }

        if (!response.ok) {
            throw new Error('Помилка завантаження даних');
        }

        const logistics = await response.json();
        renderLogistics(logistics);
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити логістів: ' + error.message);
    }
}

// Форматування зарплати
function formatSalary(salary) {
    return new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(salary);
}

// Рендеринг логістів у таблицю
function renderLogistics(logistics) {
    const tableBody = document.getElementById('logistics-data');
    tableBody.innerHTML = '';

    if (logistics.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" style="text-align: center;">Немає доступних логістів</td>';
        tableBody.appendChild(row);
        return;
    }

    logistics.forEach(logistic => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${logistic.idLogistic}</td>
                <td>${logistic.Name}</td>
                <td>${logistic.Position}</td>
                <td>${logistic.Contacts}</td>
                <td>${formatSalary(logistic.Salary)}</td>
                <td>${logistic.idWarehouse}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editLogisticForm(${logistic.idLogistic})">Редагувати</button>
                    <button class="btn-delete" onclick="deleteLogistic(${logistic.idLogistic})">Видалити</button>
                </td>
            `;
        tableBody.appendChild(row);
    });
}

// Функція для додавання нового логіста
window.addLogistic = async function() {
    const formData = {
        Name: document.getElementById('add-Name-logistic').value.trim(),
        Position: document.getElementById('add-Position-logistic').value,
        Contacts: document.getElementById('add-Contacts-logistic').value.trim(),
        Salary: parseInt(document.getElementById('add-Salary-logistic').value),
        idWarehouse: parseInt(document.getElementById('add-idWarehouse-logistic').value)
    };

    // Валідація даних
    if (!formData.Name || !formData.Position || !formData.Contacts ||
        isNaN(formData.Salary) || isNaN(formData.idWarehouse)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/Logistics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Помилка додавання логіста');
        }

        document.getElementById('add-logistic-form').reset();
        document.getElementById('add-logistic-form-container').style.display = 'none';
        fetchLogistics(); // Оновлюємо таблицю
        alert('Логіста успішно додано');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося додати логіста: ' + error.message);
    }
}

// Функція для видалення логіста
window.deleteLogistic = async function(id) {
    if (confirm('Ви впевнені, що хочете видалити цього логіста?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/Logistics/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Помилка видалення логіста');
            }

            fetchLogistics(); // Оновлюємо таблицю
            alert('Логіста успішно видалено');
        } catch (error) {
            console.error('Помилка:', error);
            alert('Не вдалося видалити логіста: ' + error.message);
        }
    }
}

// Функція для отримання даних логіста за ID і відкриття форми редагування
window.editLogisticForm = async function(id) {
    try {
        // Запит даних логіста за ID
        const response = await fetch(`http://localhost:5000/api/Logistics/${id}`);

        if (!response.ok) {
            throw new Error('Помилка отримання даних логіста');
        }

        const logistic = await response.json();

        // Вивід у консоль для діагностики
        console.log('Отримані дані логіста:', logistic);

        // Перевірка, чи logistic це масив (іноді API повертає масив з одним елементом)
        const logisticData = Array.isArray(logistic) ? logistic[0] : logistic;

        if (!logisticData) {
            throw new Error('Отримано некоректні дані логіста');
        }

        // Заповнюємо форму даними
        document.getElementById('edit-id-logistic').value = logisticData.idLogistic || id;
        document.getElementById('edit-Name-logistic').value = logisticData.Name || '';
        document.getElementById('edit-Position-logistic').value = logisticData.Position || 'Інше';
        document.getElementById('edit-Contacts-logistic').value = logisticData.Contacts || '';
        document.getElementById('edit-Salary-logistic').value = logisticData.Salary || '';
        document.getElementById('edit-idWarehouse-logistic').value = logisticData.idWarehouse || '';

        // Відображаємо форму
        document.getElementById('edit-logistic-form-container').style.display = 'block';
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити дані логіста: ' + error.message);
    }
}

// Функція для оновлення логіста
window.updateLogistic = async function() {
    const id = parseInt(document.getElementById('edit-id-logistic').value);
    const formData = {
        Name: document.getElementById('edit-Name-logistic').value.trim(),
        Position: document.getElementById('edit-Position-logistic').value,
        Contacts: document.getElementById('edit-Contacts-logistic').value.trim(),
        Salary: parseInt(document.getElementById('edit-Salary-logistic').value),
        idWarehouse: parseInt(document.getElementById('edit-idWarehouse-logistic').value)
    };

    // Валідація даних
    if (!formData.Name || !formData.Position || !formData.Contacts ||
        isNaN(formData.Salary) || isNaN(formData.idWarehouse)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    console.log('Відправляємо дані для оновлення:', formData);
    console.log('URL для оновлення:', `http://localhost:5000/api/Logistics/${id}`);

    try {
        const response = await fetch(`http://localhost:5000/api/Logistics/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Виводимо статус відповіді для діагностики
        console.log('Статус відповіді:', response.status);

        // Якщо є текст відповіді, виводимо його
        const responseText = await response.text();
        if (responseText) {
            console.log('Відповідь сервера:', responseText);
        }

        if (!response.ok) {
            throw new Error(`Помилка оновлення логіста: ${response.status}`);
        }

        document.getElementById('edit-logistic-form-container').style.display = 'none';
        fetchLogistics(); // Оновлюємо таблицю
        alert('Логіста успішно оновлено');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося оновити логіста: ' + error.message);
    }
}
