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
  
  // Загрузка товаров из корзины
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('cart-items');
  
  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p>Корзина пуста.</p>";
  } else {
    cartItems.forEach(item => {
      const cartItemDiv = document.createElement('div');
      cartItemDiv.classList.add('cart-item');
      cartItemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="cart-item-info">
          <h3>${item.title}</h3>
          <p>Цена: ${item.price}</p>
        </div>
      `;
      cartContainer.appendChild(cartItemDiv);
    });
  }

  // Обработчик для кнопки оформления заказа
  checkoutButton.addEventListener('click', function () {
    if (cartItems.length === 0) {
      alert("Корзина пуста. Добавьте товары в корзину.");
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

      alert("Ваши игры успешно куплены и добавлены в ваш профиль!");
      window.location.href = "profile.html"; // Перенаправляем в профиль
    } else {
      alert("Для оформления заказа нужно войти в аккаунт.");
      window.location.href = "login.html"; // Перенаправляем на страницу входа
    }
  });
});
