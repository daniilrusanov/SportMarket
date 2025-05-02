document.addEventListener('DOMContentLoaded', () => {
    // Завантаження даних про фінансові транзакції
    fetchTransactions();

    // Обробка кнопки додавання транзакції
    document.getElementById('add-transaction-button').addEventListener('click', () => {
        document.getElementById('add-transaction-form-container').style.display = 'block';
    });

    // Обробка кнопки скасування додавання
    // Обробка кнопки скасування додавання
    document.getElementById('cancel-transaction-add').addEventListener('click', () => {
        document.getElementById('add-transaction-form-container').style.display = 'none';
        document.getElementById('add-transaction-form').reset();
    });

    // Обробка кнопки скасування редагування
    document.getElementById('cancel-transaction-edit').addEventListener('click', () => {
        document.getElementById('edit-transaction-form-container').style.display = 'none';
    });

    // Обробка форми додавання транзакції
    const addForm = document.getElementById('add-transaction-form');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTransaction();
    });

    // Обробка форми редагування транзакції
    const editForm = document.getElementById('edit-transaction-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateTransaction();
    });
});

// Функція для отримання транзакцій з API
async function fetchTransactions() {
    try {
        const response = await fetch('http://localhost:5000/api/FinancialTransactions');

        // Перевіряємо тип відповіді
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Очікувався JSON, отримано інший формат');
        }

        if (!response.ok) {
            throw new Error('Помилка завантаження даних');
        }

        const transactions = await response.json();
        renderTransactions(transactions);
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити транзакції: ' + error.message);
    }
}

// Перетворення статусу в текстовий опис
function getStatusText(statusCode) {
    const statuses = {
        0: 'Неоплачено',
        1: 'Оплачено',
        2: 'В обробці',
        3: 'Завершено'
    };
    return statuses[statusCode] || `Невідомий (${statusCode})`;
}

// Форматування дати
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
}

// Рендеринг транзакцій у таблицю
function renderTransactions(transactions) {
    const tableBody = document.getElementById('transactions-data');
    tableBody.innerHTML = '';

    if (transactions.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" style="text-align: center;">Немає доступних транзакцій</td>';
        tableBody.appendChild(row);
        return;
    }

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${transaction.idFinancialTransaction}</td>
                <td>${transaction.idOrder}</td>
                <td>${transaction.Amount}</td>
                <td>${formatDate(transaction.Date)}</td>
                <td>${getStatusText(transaction.Status)}</td>
                <td>${transaction.idWarehouse}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editTransactionForm(${transaction.idFinancialTransaction})">Редагувати</button>
                    <button class="btn-delete" onclick="deleteTransaction(${transaction.idFinancialTransaction})">Видалити</button>
                </td>
            `;
        tableBody.appendChild(row);
    });
}

// Функція для додавання нової транзакції
window.addTransaction = async function() {
    const formData = {
        idOrder: parseInt(document.getElementById('add-idOrder-transaction').value),
        Amount: parseInt(document.getElementById('add-Amount-transaction').value),
        Date: new Date(document.getElementById('add-Date-transaction').value),
        Status: parseInt(document.getElementById('add-Status-transaction').value),
        idWarehouse: parseInt(document.getElementById('add-idWarehouse-transaction').value)
    };

    // Валідація даних
    if (isNaN(formData.idOrder) || isNaN(formData.Amount) || !formData.Date ||
        isNaN(formData.Status) || isNaN(formData.idWarehouse)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/FinancialTransactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Помилка додавання транзакції');
        }

        document.getElementById('add-transaction-form').reset();
        document.getElementById('add-transaction-form-container').style.display = 'none';
        fetchTransactions(); // Оновлюємо таблицю
        alert('Транзакцію успішно додано');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося додати транзакцію: ' + error.message);
    }
}

// Функція для видалення транзакції
window.deleteTransaction = async function(id) {
    if (confirm('Ви впевнені, що хочете видалити цю транзакцію?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/FinancialTransactions/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Помилка видалення транзакції');
            }

            fetchTransactions(); // Оновлюємо таблицю
            alert('Транзакцію успішно видалено');
        } catch (error) {
            console.error('Помилка:', error);
            alert('Не вдалося видалити транзакцію: ' + error.message);
        }
    }
}

// Функція для отримання даних транзакції за ID і відкриття форми редагування
window.editTransactionForm = async function(id) {
    try {
        // Запит даних транзакції за ID
        const response = await fetch(`http://localhost:5000/api/FinancialTransactions/${id}`);

        if (!response.ok) {
            throw new Error('Помилка отримання даних транзакції');
        }

        const transaction = await response.json();

        // Вивід у консоль для діагностики
        console.log('Отримані дані транзакції:', transaction);

        // Перевірка, чи transaction це масив (іноді API повертає масив з одним елементом)
        const transactionData = Array.isArray(transaction) ? transaction[0] : transaction;

        if (!transactionData) {
            throw new Error('Отримано некоректні дані транзакції');
        }

        // Форматуємо дату для введення в поле input type="date"
        const dateObj = new Date(transactionData.Date);
        const formattedDate = dateObj.toISOString().split('T')[0];

        // Заповнюємо форму даними
        document.getElementById('edit-id-transaction').value = transactionData.idFinancialTransaction || id;
        document.getElementById('edit-idOrder-transaction').value = transactionData.idOrder || '';
        document.getElementById('edit-Amount-transaction').value = transactionData.Amount || '';
        document.getElementById('edit-Date-transaction').value = formattedDate;
        document.getElementById('edit-Status-transaction').value = transactionData.Status;
        document.getElementById('edit-idWarehouse-transaction').value = transactionData.idWarehouse || '';

        // Відображаємо форму
        document.getElementById('edit-transaction-form-container').style.display = 'block';
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити дані транзакції: ' + error.message);
    }
}

// Функція для оновлення транзакції
window.updateTransaction = async function() {
    const id = document.getElementById('edit-id-transaction').value;
    const formData = {
        idOrder: parseInt(document.getElementById('edit-idOrder-transaction').value),
        Amount: parseInt(document.getElementById('edit-Amount-transaction').value),
        Date: new Date(document.getElementById('edit-Date-transaction').value),
        Status: parseInt(document.getElementById('edit-Status-transaction').value),
        idWarehouse: parseInt(document.getElementById('edit-idWarehouse-transaction').value)
    };

    // Валідація даних
    if (isNaN(formData.idOrder) || isNaN(formData.Amount) || !formData.Date ||
        isNaN(formData.Status) || isNaN(formData.idWarehouse)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    console.log('Відправляємо дані для оновлення:', formData);
    console.log('URL для оновлення:', `http://localhost:5000/api/FinancialTransactions/${id}`);

    try {
        const response = await fetch(`http://localhost:5000/api/FinancialTransactions/${id}`, {
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
            throw new Error(`Помилка оновлення транзакції: ${response.status}`);
        }

        document.getElementById('edit-transaction-form-container').style.display = 'none';
        fetchTransactions(); // Оновлюємо таблицю
        alert('Транзакцію успішно оновлено');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося оновити транзакцію: ' + error.message);
    }
}
