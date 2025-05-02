document.addEventListener('DOMContentLoaded', () => {
    // Завантаження даних про склади
    fetchWarehouses();

    // Обробка кнопки додавання складу
    document.getElementById('add-warehouse-button').addEventListener('click', () => {
        document.getElementById('add-warehouse-form-container').style.display = 'block';
    });

    // Обробка кнопки скасування додавання
    document.getElementById('cancel-warehouse-add').addEventListener('click', () => {
        document.getElementById('add-warehouse-form-container').style.display = 'none';
        document.getElementById('add-warehouse-form').reset();
    });

    // Обробка кнопки скасування редагування
    document.getElementById('cancel-warehouse-edit').addEventListener('click', () => {
        document.getElementById('edit-warehouse-form-container').style.display = 'none';
    });

    // Обробка форми додавання складу
    const addForm = document.getElementById('add-warehouse-form');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addWarehouse();
    });

    // Обробка форми редагування складу
    const editForm = document.getElementById('edit-warehouse-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateWarehouse();
    });
});

// Функція для отримання складів з API
async function fetchWarehouses() {
    try {
        const response = await fetch('http://localhost:5000/api/Warehouses');

        // Перевіряємо тип відповіді
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Очікувався JSON, отримано інший формат');
        }

        if (!response.ok) {
            throw new Error('Помилка завантаження даних');
        }

        const warehouses = await response.json();
        renderWarehouses(warehouses);
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити склади: ' + error.message);
    }
}

// Рендеринг складів у таблицю
function renderWarehouses(warehouses) {
    const tableBody = document.getElementById('warehouses-data');
    tableBody.innerHTML = '';

    if (warehouses.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center;">Немає доступних складів</td>';
        tableBody.appendChild(row);
        return;
    }

    warehouses.forEach(warehouse => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${warehouse.idWarehouse}</td>
                <td>${warehouse.Location}</td>
                <td>${warehouse.Capacity}</td>
                <td>${warehouse.Workload}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editWarehouseForm(${warehouse.idWarehouse})">Редагувати</button>
                    <button class="btn-delete" onclick="deleteWarehouse(${warehouse.idWarehouse})">Видалити</button>
                </td>
            `;
        tableBody.appendChild(row);
    });
}

// Функція для додавання нового складу
window.addWarehouse = async function() {
    const formData = {
        Location: document.getElementById('add-Location-warehouse').value.trim(),
        Capacity: parseInt(document.getElementById('add-Capacity-warehouse').value),
        Workload: parseInt(document.getElementById('add-Workload-warehouse').value)
    };

    // Валідація даних
    if (!formData.Location || isNaN(formData.Capacity) || isNaN(formData.Workload)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/Warehouses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Помилка додавання складу');
        }

        document.getElementById('add-warehouse-form').reset();
        document.getElementById('add-warehouse-form-container').style.display = 'none';
        fetchWarehouses(); // Оновлюємо таблицю
        alert('Склад успішно додано');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося додати склад: ' + error.message);
    }
}

// Функція для видалення складу
window.deleteWarehouse = async function (id) {
    if (confirm('Ви впевнені, що хочете видалити цей склад?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/Warehouses/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Помилка видалення складу');
            }

            fetchWarehouses(); // Оновлюємо таблицю
            alert('Склад успішно видалено');
        } catch (error) {
            console.error('Помилка:', error);
            alert('Не вдалося видалити склад: ' + error.message);
        }
    }
}

// Функція для отримання даних складу за ID і відкриття форми редагування
window.editWarehouseForm = async function (id) {
    try {
        // Запит даних складу за ID
        const response = await fetch(`http://localhost:5000/api/Warehouses/${id}`);

        if (!response.ok) {
            throw new Error('Помилка отримання даних складу');
        }

        const warehouse = await response.json();

        // Вивід у консоль для діагностики
        console.log('Отримані дані складу:', warehouse);

        // Перевірка, чи warehouse це масив (іноді API повертає масив з одним елементом)
        const warehouseData = Array.isArray(warehouse) ? warehouse[0] : warehouse;

        if (!warehouseData) {
            throw new Error('Отримано некоректні дані складу');
        }

        // Заповнюємо форму даними
        document.getElementById('edit-id-warehouse').value = warehouseData.idWarehouse || id;
        document.getElementById('edit-Location-warehouse').value = warehouseData.Location || '';
        document.getElementById('edit-Capacity-warehouse').value = warehouseData.Capacity || '';
        document.getElementById('edit-Workload-warehouse').value = warehouseData.Workload || '';

        // Відображаємо форму
        document.getElementById('edit-warehouse-form-container').style.display = 'block';
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити дані складу: ' + error.message);
    }
}

// Функція для оновлення складу
window.updateWarehouse = async function () {
    const id = parseInt(document.getElementById('edit-id-warehouse').value);
    const formData = {
        Location: document.getElementById('edit-Location-warehouse').value.trim(),
        Capacity: parseInt(document.getElementById('edit-Capacity-warehouse').value),
        Workload: parseInt(document.getElementById('edit-Workload-warehouse').value)
    };

    // Валідація даних
    if (!formData.Location || isNaN(formData.Capacity) || isNaN(formData.Workload)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    console.log('Відправляємо дані для оновлення:', formData);
    console.log('URL для оновлення:', `http://localhost:5000/api/Warehouses/${id}`);

    try {
        const response = await fetch(`http://localhost:5000/api/Warehouses/${id}`, {
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
            throw new Error(`Помилка оновлення складу: ${response.status}`);
        }

        document.getElementById('edit-warehouse-form-container').style.display = 'none';
        fetchWarehouses(); // Оновлюємо таблицю
        alert('Склад успішно оновлено');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося оновити склад: ' + error.message);
    }
}
