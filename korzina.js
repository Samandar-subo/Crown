    const cartContainer = document.getElementById("cart-container");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Загружаем корзину из localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
      cartContainer.innerHTML = "";
      if (cart.length === 0) {
        cartContainer.innerHTML = "<p class='empty'>Ваша корзина пуста.</p>";
        return;
      }

      cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <div>
            <h3>${item.title}</h3>
            <p>${item.price}</p>
          </div>
          <button onclick="removeFromCart(${index})">Удалить</button>
        `;
        cartContainer.appendChild(div);
      });
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }

    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Ваша корзина пуста!");
      } else {
        alert("Спасибо за покупку! 🎉");
        localStorage.removeItem("cart");
        renderCart();
      }
    });

    renderCart();



    
// ======== Оформление покупки ========
const buyButton = document.getElementById("buyBtn");

if (buyButton) {
  buyButton.addEventListener("click", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Сначала войдите в аккаунт!");
      window.location.href = "registr.html";
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length === 0) {
      alert("Корзина пуста!");
      return;
    }

    // создаём уникальный ключ для истории конкретного пользователя
    const key = `purchaseHistory_${currentUser.email}`;
    const purchaseHistory = JSON.parse(localStorage.getItem(key)) || [];

    // переносим товары из корзины в историю
    cartItems.forEach(item => {
      purchaseHistory.push({
        title: item.title || item.name || "Без названия",
        price: item.price || "0₸",
        date: new Date().toLocaleString()
      });
    });

    // сохраняем и очищаем корзину
    localStorage.setItem(key, JSON.stringify(purchaseHistory));
    localStorage.removeItem("cart");

    alert("✅ Покупка успешно оформлена!");
    window.location.href = "profile.html";
  });
} else {
  console.warn("❗ Кнопка 'Купить' не найдена. Проверь id в HTML!");
}



window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

