document.addEventListener('DOMContentLoaded', () => {
    // Завантаження даних про замовлення
    fetchOrders();

    // Обробка кнопки додавання замовлення
    document.getElementById('add-order-button').addEventListener('click', () => {
        document.getElementById('add-order-form-container').style.display = 'block';
    });

    // Обробка кнопки скасування додавання
    document.getElementById('cancel-order-add').addEventListener('click', () => {
        document.getElementById('add-order-form-container').style.display = 'none';
        document.getElementById('add-order-form').reset();
    });

    // Обробка кнопки скасування редагування
    document.getElementById('cancel-order-edit').addEventListener('click', () => {
        document.getElementById('edit-order-form-container').style.display = 'none';
    });

    // Обробка форми додавання замовлення
    const addForm = document.getElementById('add-order-form');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addOrder();
    });

    // Обробка форми редагування замовлення
    const editForm = document.getElementById('edit-order-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateOrder();
    });
});

// Функція для отримання замовлень з API
async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:5000/api/Orders');

        // Перевіряємо тип відповіді
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Очікувався JSON, отримано інший формат');
        }

        if (!response.ok) {
            throw new Error('Помилка завантаження даних');
        }

        const orders = await response.json();
        renderOrders(orders);
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити замовлення: ' + error.message);
    }
}

// Рендеринг замовлень у таблицю
function renderOrders(orders) {
    const tableBody = document.getElementById('orders-data');
    tableBody.innerHTML = '';

    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center;">Немає доступних замовлень</td>';
        tableBody.appendChild(row);
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');

        // Перетворення статусу в текстовий формат
        let statusText = 'Невідомо';
        switch(order.Status) {
            case 1:
                statusText = 'В обробці';
                break;
            case 2:
                statusText = 'Відправлено';
                break;
            case 3:
                statusText = 'Доставлено';
                break;
            case 4:
                statusText = 'Скасовано';
                break;
        }

        row.innerHTML = `
            <td>${order.idOrder}</td>
            <td>${order.idSupplier}</td>
            <td>${order.idProduct}</td>
            <td>${order.Amount}</td>
            <td>${statusText}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editOrderForm(${order.idOrder})">Редагувати</button>
                <button class="btn-delete" onclick="deleteOrder(${order.idOrder})">Видалити</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Функція для додавання нового замовлення
window.addOrder = async function() {
    const formData = {
        idSupplier: parseInt(document.getElementById('add-idSupplier-order').value),
        idProduct: parseInt(document.getElementById('add-idProduct-order').value),
        Amount: parseInt(document.getElementById('add-Amount-order').value),
        Status: parseInt(document.getElementById('add-Status-order').value)
    };

    // Валідація даних
    if (isNaN(formData.idSupplier) || isNaN(formData.idProduct) ||
        isNaN(formData.Amount) || isNaN(formData.Status)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/Orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Помилка додавання замовлення');
        }

        document.getElementById('add-order-form').reset();
        document.getElementById('add-order-form-container').style.display = 'none';
        fetchOrders(); // Оновлюємо таблицю
        alert('Замовлення успішно додано');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося додати замовлення: ' + error.message);
    }
}

// Функція для видалення замовлення
window.deleteOrder = async function (id) {
    if (confirm('Ви впевнені, що хочете видалити це замовлення?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/Orders/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Помилка видалення замовлення');
            }

            fetchOrders(); // Оновлюємо таблицю
            alert('Замовлення успішно видалено');
        } catch (error) {
            console.error('Помилка:', error);
            alert('Не вдалося видалити замовлення: ' + error.message);
        }
    }
}

// Функція для отримання даних замовлення за ID і відкриття форми редагування
window.editOrderForm = async function (id) {
    try {
        // Запит даних замовлення за ID
        const response = await fetch(`http://localhost:5000/api/Orders/${id}`);

        if (!response.ok) {
            throw new Error('Помилка отримання даних замовлення');
        }

        const order = await response.json();

        // Вивід у консоль для діагностики
        console.log('Отримані дані замовлення:', order);

        // Перевірка, чи order це масив (іноді API повертає масив з одним елементом)
        const orderData = Array.isArray(order) ? order[0] : order;

        if (!orderData) {
            throw new Error('Отримано некоректні дані замовлення');
        }

        // Заповнюємо форму даними
        document.getElementById('edit-id-order').value = orderData.idOrder || id;
        document.getElementById('edit-idSupplier-order').value = orderData.idSupplier || '';
        document.getElementById('edit-idProduct-order').value = orderData.idProduct || '';
        document.getElementById('edit-Amount-order').value = orderData.Amount || '';
        document.getElementById('edit-Status-order').value = orderData.Status || '1';

        // Відображаємо форму
        document.getElementById('edit-order-form-container').style.display = 'block';
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити дані замовлення: ' + error.message);
    }
}

// Функція для оновлення замовлення
window.updateOrder = async function () {
    const id = document.getElementById('edit-id-order').value;
    const formData = {
        idSupplier: parseInt(document.getElementById('edit-idSupplier-order').value),
        idProduct: parseInt(document.getElementById('edit-idProduct-order').value),
        Amount: parseInt(document.getElementById('edit-Amount-order').value),
        Status: parseInt(document.getElementById('edit-Status-order').value)
    };

    // Валідація даних
    if (isNaN(formData.idSupplier) || isNaN(formData.idProduct) ||
        isNaN(formData.Amount) || isNaN(formData.Status)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    console.log('Відправляємо дані для оновлення:', formData);
    console.log('URL для оновлення:', `http://localhost:5000/api/Orders/${id}`);

    try {
        const response = await fetch(`http://localhost:5000/api/Orders/${id}`, {
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
            throw new Error(`Помилка оновлення замовлення: ${response.status}`);
        }

        document.getElementById('edit-order-form-container').style.display = 'none';
        fetchOrders(); // Оновлюємо таблицю
        alert('Замовлення успішно оновлено');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося оновити замовлення: ' + error.message);
    }
}
