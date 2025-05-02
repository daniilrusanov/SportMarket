document.addEventListener('DOMContentLoaded', () => {
    // Завантаження даних про постачальників
    fetchSuppliers();

    // Обробка кнопки додавання постачальника
    document.getElementById('add-supplier-button').addEventListener('click', () => {
        document.getElementById('add-supplier-form-container').style.display = 'block';
    });

    // Обробка кнопки скасування додавання
    document.getElementById('cancel-supplier-add').addEventListener('click', () => {
        document.getElementById('add-supplier-form-container').style.display = 'none';
        document.getElementById('add-supplier-form').reset();
    });

    // Обробка кнопки скасування редагування
    document.getElementById('cancel-supplier-edit').addEventListener('click', () => {
        document.getElementById('edit-supplier-form-container').style.display = 'none';
    });

    // Обробка форми додавання постачальника
    const addForm = document.getElementById('add-supplier-form');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addSupplier();
    });

    // Обробка форми редагування постачальника
    const editForm = document.getElementById('edit-supplier-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateSupplier();
    });
});

// Функція для отримання постачальників з API
async function fetchSuppliers() {
    try {
        const response = await fetch('http://localhost:5000/api/Suppliers');

        // Перевіряємо тип відповіді
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Очікувався JSON, отримано інший формат');
        }

        if (!response.ok) {
            throw new Error('Помилка завантаження даних');
        }

        const suppliers = await response.json();
        renderSuppliers(suppliers);
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити постачальників: ' + error.message);
    }
}

// Рендеринг постачальників у таблицю
function renderSuppliers(suppliers) {
    const tableBody = document.getElementById('suppliers-data');
    tableBody.innerHTML = '';

    if (suppliers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center;">Немає доступних постачальників</td>';
        tableBody.appendChild(row);
        return;
    }

    suppliers.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${supplier.idSupplier}</td>
                <td>${supplier.Name}</td>
                <td>${supplier.Contacts}</td>
                <td>${supplier.Terms}</td>
                <td>${supplier.Status}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editSupplierForm(${supplier.idSupplier})">Редагувати</button>
                    <button class="btn-delete" onclick="deleteSupplier(${supplier.idSupplier})">Видалити</button>
                </td>
            `;
        tableBody.appendChild(row);
    });
}

// Функція для додавання нового постачальника
window.addSupplier = async function() {
    const formData = {
        Name: document.getElementById('add-Name-supplier').value.trim(),
        Contacts: document.getElementById('add-Contacts-supplier').value.trim(),
        Terms: document.getElementById('add-Terms-supplier').value.trim(),
        Status: parseInt(document.getElementById('add-Status-supplier').value)
    };

    // Валідація даних
    if (!formData.Name || !formData.Contacts || !formData.Terms) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/Suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Помилка додавання постачальника');
        }

        document.getElementById('add-supplier-form').reset();
        document.getElementById('add-supplier-form-container').style.display = 'none';
        fetchSuppliers(); // Оновлюємо таблицю
        alert('Постачальника успішно додано');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося додати постачальника: ' + error.message);
    }
}

// Функція для видалення постачальника
window.deleteSupplier = async function (id) {
    if (confirm('Ви впевнені, що хочете видалити цього постачальника?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/Suppliers/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Помилка видалення постачальника');
            }

            fetchSuppliers(); // Оновлюємо таблицю
            alert('Постачальника успішно видалено');
        } catch (error) {
            console.error('Помилка:', error);
            alert('Не вдалося видалити постачальника: ' + error.message);
        }
    }
}

// Функція для отримання даних постачальника за ID і відкриття форми редагування
window.editSupplierForm = async function (id) {
    try {
        // Запит даних постачальника за ID
        const response = await fetch(`http://localhost:5000/api/Suppliers/${id}`);

        if (!response.ok) {
            throw new Error('Помилка отримання даних постачальника');
        }

        const supplier = await response.json();

        // Вивід у консоль для діагностики
        console.log('Отримані дані постачальника:', supplier);

        // Перевірка, чи supplier це масив (іноді API повертає масив з одним елементом)
        const supplierData = Array.isArray(supplier) ? supplier[0] : supplier;

        if (!supplierData) {
            throw new Error('Отримано некоректні дані постачальника');
        }

        // Заповнюємо форму даними
        document.getElementById('edit-id-supplier').value = supplierData.idSupplier || id;
        document.getElementById('edit-Name-supplier').value = supplierData.Name || '';
        document.getElementById('edit-Contacts-supplier').value = supplierData.Contacts || '';
        document.getElementById('edit-Terms-supplier').value = supplierData.Terms || '';
        document.getElementById('edit-Status-supplier').value = supplierData.Status || 'Активний';
        // Відображаємо форму
        document.getElementById('edit-supplier-form-container').style.display = 'block';
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити дані постачальника: ' + error.message);
    }
}

// Функція для оновлення постачальника
window.updateSupplier = async function () {
    const id = parseInt(document.getElementById('edit-id-supplier').value);
    const formData = {
        Name: document.getElementById('edit-Name-supplier').value.trim(),
        Contacts: document.getElementById('edit-Contacts-supplier').value.trim(),
        Terms: document.getElementById('edit-Terms-supplier').value.trim(),
        Status: parseInt(document.getElementById('edit-Status-supplier').value)
    };

    // Валідація даних
    if (!formData.Name || !formData.Contacts || !formData.Terms) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    console.log('Відправляємо дані для оновлення:', formData);
    console.log('URL для оновлення:', `http://localhost:5000/api/Suppliers/${id}`);

    try {
        const response = await fetch(`http://localhost:5000/api/Suppliers/${id}`, {
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
            throw new Error(`Помилка оновлення постачальника: ${response.status}`);
        }

        document.getElementById('edit-supplier-form-container').style.display = 'none';
        fetchSuppliers(); // Оновлюємо таблицю
        alert('Постачальника успішно оновлено');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося оновити постачальника: ' + error.message);
    }
}
