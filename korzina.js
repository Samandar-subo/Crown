// Функция для применения темы
function applyTheme() {
    const body = document.body;
    
    // Проверяем сохранённую тему
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }
}

// Добавляем фон glow
const backgroundGlow = document.createElement('div');
backgroundGlow.className = 'background-glow';
document.body.insertBefore(backgroundGlow, document.body.firstChild);

// Функция для показа уведомлений
function showNotification(message) {
    const notificationDiv = document.createElement('div');
    notificationDiv.textContent = message;
    notificationDiv.id = 'notification-' + Date.now();
    
    // Стили для уведомления
    notificationDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #1a1a1a;
        color: #FFD700;
        padding: 15px 25px;
        border-radius: 12px;
        font-weight: bold;
        border: 2px solid #FFD700;
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
        z-index: 9998;
        animation: fadeInOut 3s ease-in-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Позиционируем уведомление относительно других
    const existingNotifications = document.querySelectorAll('[id^="notification-"]');
    const topOffset = 100 + (existingNotifications.length * 80);
    notificationDiv.style.top = topOffset + 'px';
    
    document.body.appendChild(notificationDiv);

    setTimeout(() => {
        if (notificationDiv.parentNode) {
            notificationDiv.remove();
        }
    }, 3000);
}

// Добавляем стили для анимации уведомления
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(100px); }
        10% { opacity: 1; transform: translateX(0); }
        90% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(100px); }
    }
    
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(100px);
            height: 0;
            margin-bottom: 0;
            padding-top: 0;
            padding-bottom: 0;
        }
    }
    
    .cart-item.removing {
        animation: slideOut 0.4s ease forwards;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Функция для отображения корзины
function displayCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-btn');

    // Очищаем контейнер
    cartContainer.innerHTML = '';

    // Если корзина пуста
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-message">Ваша корзина пуста.</p>';
        checkoutButton.disabled = true;
        checkoutButton.textContent = 'Корзина пуста';
        return;
    }

    // Отображаем каждый товар из корзины
    cartItems.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.style.animationDelay = `${index * 0.1}s`;
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>Цена: ${item.price}</p>
            </div>
            <button class="remove-btn" data-title="${item.title}">Удалить</button>
        `;
        cartContainer.appendChild(cartItemDiv);
    });

    // Активируем кнопку оформления заказа
    checkoutButton.disabled = false;
    checkoutButton.textContent = `Оформить заказ (${cartItems.length})`;
}

// Функция для плавного удаления элемента
function removeCartItem(itemToRemove, cartItemElement) {
    // Добавляем класс для анимации удаления
    cartItemElement.classList.add('removing');
    
    // Ждем завершения анимации
    setTimeout(() => {
        // Удаляем элемент из DOM
        cartItemElement.remove();
        
        // Удаляем из localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.title !== itemToRemove);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Показываем уведомление
        showNotification(`${itemToRemove} удален из корзины`);
        
        // Обновляем отображение корзины
        displayCart();
    }, 400); // Время должно совпадать с длительностью анимации
}

document.addEventListener('DOMContentLoaded', function () {
    // Применяем тему при загрузке
    applyTheme();
    
    // Слушаем изменения в localStorage для синхронизации темы между вкладками
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme') {
            applyTheme();
        }
    });
    
    // Также проверяем тему периодически
    setInterval(function() {
        applyTheme();
    }, 1000);

    // Отображаем корзину при загрузке
    displayCart();

    // Обработчик для кнопки оформления заказа
    const checkoutButton = document.getElementById('checkout-btn');
    checkoutButton.addEventListener('click', function () {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cartItems.length === 0) {
            showNotification("Корзина пуста. Добавьте товары в корзину.");
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            let profile = JSON.parse(localStorage.getItem('profile')) || {};
            profile.purchaseHistory = profile.purchaseHistory || [];

            // Переносим товары из корзины в историю покупок профиля
            profile.purchaseHistory.push(...cartItems);

            // Сохраняем обновленный профиль в localStorage
            localStorage.setItem('profile', JSON.stringify(profile));

            // Очищаем корзину
            localStorage.removeItem('cart');

            showNotification("Ваши игры успешно куплены и добавлены в ваш профиль!");
            
            // Обновляем отображение корзины
            setTimeout(() => {
                displayCart();
            }, 1500);
        } else {
            showNotification("Для оформления заказа нужно войти в аккаунт.");
            
            setTimeout(() => {
                window.location.href = "registr.html";
            }, 1500);
        }
    });

    // Обработчик удаления товаров (делегирование событий)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const titleToRemove = e.target.getAttribute('data-title');
            const cartItemElement = e.target.closest('.cart-item');
            
            // Плавно удаляем элемент
            removeCartItem(titleToRemove, cartItemElement);
        }
    });
});