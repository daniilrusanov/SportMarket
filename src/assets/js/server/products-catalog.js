document.addEventListener('DOMContentLoaded', () => {
    // Завантаження даних про товари
    fetchProducts();

    // Обробка кнопки додавання товару
    document.getElementById('add-product-button').addEventListener('click', () => {
        document.getElementById('add-product-form-container').style.display = 'block';
    });

    // Обробка кнопки скасування додавання
    document.getElementById('cancel-product-add').addEventListener('click', () => {
        document.getElementById('add-product-form-container').style.display = 'none';
        document.getElementById('add-product-form').reset();
    });

    // Обробка кнопки скасування редагування
    document.getElementById('cancel-product-edit').addEventListener('click', () => {
        document.getElementById('edit-product-form-container').style.display = 'none';
    });

    // Обробка форми додавання товару
    const addForm = document.getElementById('add-product-form');
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addProduct();
    });

    // Обробка форми редагування товару
    const editForm = document.getElementById('edit-product-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateProduct();
    });
});

// Функція для отримання товарів з API
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/Products');

        // Перевіряємо тип відповіді
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Очікувався JSON, отримано інший формат');
        }

        if (!response.ok) {
            throw new Error('Помилка завантаження даних');
        }

        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити товари: ' + error.message);
    }
}

// Рендеринг товарів у таблицю
function renderProducts(products) {
    const tableBody = document.getElementById('products-data');
    tableBody.innerHTML = '';

    if (products.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" style="text-align: center;">Немає доступних товарів</td>';
        tableBody.appendChild(row);
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${product.idProduct}</td>
                <td>${product.Name}</td>
                <td>${product.Category}</td>
                <td>${product.Price}</td>
                <td>${product.Amount}</td>
                <td>${product.idSupplier}</td>
                <td>${product.idWarehouse}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editProductForm(${product.idProduct})">Редагувати</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.idProduct})">Видалити</button>
                </td>
            `;
        tableBody.appendChild(row);
    });
}

// Функція для додавання нового товару
window.addProduct = async function() {
    const formData = {
        Name: document.getElementById('add-Name-product').value.trim(),
        Category: document.getElementById('add-Category-product').value,
        Price: parseFloat(document.getElementById('add-Price-product').value),
        Amount: parseInt(document.getElementById('add-Amount-product').value),
        idSupplier: parseInt(document.getElementById('add-idSupplier-product').value),
        idWarehouse: parseInt(document.getElementById('add-idWarehouse-product').value)
    };

    // Валідація даних
    if (!formData.Name || isNaN(formData.Price) || isNaN(formData.Amount) ||
        isNaN(formData.idSupplier) || isNaN(formData.idWarehouse)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/Products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Помилка додавання товару');
        }

        document.getElementById('add-product-form').reset();
        document.getElementById('add-product-form-container').style.display = 'none';
        fetchProducts(); // Оновлюємо таблицю
        alert('Товар успішно додано');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося додати товар: ' + error.message);
    }
}

// Функція для видалення товару
window.deleteProduct = async function (id) {
    if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/Products/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Помилка видалення товару');
            }

            fetchProducts(); // Оновлюємо таблицю
            alert('Товар успішно видалено');
        } catch (error) {
            console.error('Помилка:', error);
            alert('Не вдалося видалити товар: ' + error.message);
        }
    }
}

// Функція для отримання даних товару за ID і відкриття форми редагування
window.editProductForm = async function (id) {
    try {
        // Запит даних товару за ID
        const response = await fetch(`http://localhost:5000/api/Products/${id}`);

        if (!response.ok) {
            throw new Error('Помилка отримання даних товару');
        }

        const product = await response.json();

        // Вивід у консоль для діагностики
        console.log('Отримані дані товару:', product);

        // Перевірка, чи product це масив (іноді API повертає масив з одним елементом)
        const productData = Array.isArray(product) ? product[0] : product;

        if (!productData) {
            throw new Error('Отримано некоректні дані товару');
        }

        // Заповнюємо форму даними
        document.getElementById('edit-id-product').value = productData.idProduct || id;
        document.getElementById('edit-Name-product').value = productData.Name || '';
        document.getElementById('edit-Category-product').value = productData.Category || 'Sneakers';
        document.getElementById('edit-Price-product').value = productData.Price || '';
        document.getElementById('edit-Amount-product').value = productData.Amount || '';
        document.getElementById('edit-idSupplier-product').value = productData.idSupplier || '';
        document.getElementById('edit-idWarehouse-product').value = productData.idWarehouse || '';

        // Відображаємо форму
        document.getElementById('edit-product-form-container').style.display = 'block';
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося завантажити дані товару: ' + error.message);
    }
}

// Функція для оновлення товару
window.updateProduct = async function () {
    const id = document.getElementById('edit-id-product').value;
    const formData = {
        Name: document.getElementById('edit-Name-product').value.trim(),
        Category: document.getElementById('edit-Category-product').value,
        Price: parseFloat(document.getElementById('edit-Price-product').value),
        Amount: parseInt(document.getElementById('edit-Amount-product').value),
        idSupplier: parseInt(document.getElementById('edit-idSupplier-product').value),
        idWarehouse: parseInt(document.getElementById('edit-idWarehouse-product').value)
    };

    // Валідація даних
    if (!formData.Name || isNaN(formData.Price) || isNaN(formData.Amount) ||
        isNaN(formData.idSupplier) || isNaN(formData.idWarehouse)) {
        alert('Будь ласка, заповніть всі поля коректно');
        return;
    }

    console.log('Відправляємо дані для оновлення:', formData);
    console.log('URL для оновлення:', `http://localhost:5000/api/Products/${id}`);

    try {
        const response = await fetch(`http://localhost:5000/api/Products/${id}`, {
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
            throw new Error(`Помилка оновлення товару: ${response.status}`);
        }

        document.getElementById('edit-product-form-container').style.display = 'none';
        fetchProducts(); // Оновлюємо таблицю
        alert('Товар успішно оновлено');
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося оновити товар: ' + error.message);
    }
}
