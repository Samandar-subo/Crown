document.addEventListener('DOMContentLoaded', function () {
  // Загружаем корзину из localStorage
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('cart-items');

  // Если корзина пуста
  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p>Ваша корзина пуста.</p>';
  } else {
    // Отображаем каждый товар из корзины
    cartItems.forEach(item => {
      const cartItemDiv = document.createElement('div');
      cartItemDiv.classList.add('cart-item');
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
  }

  // Удаление товара из корзины
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const titleToRemove = this.getAttribute('data-title');
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.title !== titleToRemove);
      localStorage.setItem('cart', JSON.stringify(cart));
      location.reload();
    });
  });
});







document.addEventListener('DOMContentLoaded', function () {
  const checkoutButton = document.getElementById('checkout-btn');

  checkoutButton.addEventListener('click', function () {
    // Получаем данные о корзине
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
      // Если корзина пуста, показываем уведомление
      showNotification('Корзина пуста. Добавьте товары в корзину для оформления заказа.', '#ff4444');
    } else {
      // Если в корзине есть товары, отображаем сообщение об успешном заказе
      showNotification('Ваши игры успешно куплены и добавлены в ваш профиль!', '#383838ff');
      
      // Очищаем корзину после оформления заказа
      localStorage.removeItem('cart');
    }
  });

  // Функция для показа уведомлений
  function showNotification(message, bgColor) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.backgroundColor = bgColor;
    notification.classList.add('notification');
    document.body.appendChild(notification);

    // Убираем уведомление через 3 секунды
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});
