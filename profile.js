// Загружаем данные текущего пользователя
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const purchaseList = document.getElementById("purchase-list");

if (currentUser) {
  document.getElementById("username").textContent = `Имя: ${currentUser.username}`;
  document.getElementById("email").textContent = `Email: ${currentUser.email}`;
} else {
  alert("Вы не вошли в аккаунт!");
  window.location.href = "registr.html";
}

// ======== Загружаем покупки из корзины ========
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

if (cartItems.length > 0) {
  purchaseList.innerHTML = "";
  cartItems.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("purchase-item");
    div.innerHTML = `
      <h4>${item.title}</h4>
      <p>Цена: ${item.price}</p>
    `;
    purchaseList.appendChild(div);
  });
} else {
  purchaseList.innerHTML = "<p>История покупок пуста.</p>";
}

// ======== Очистить историю ========
document.querySelector(".clear-history-btn").addEventListener("click", () => {
  localStorage.removeItem("cart");
  purchaseList.innerHTML = "<p>История покупок очищена.</p>";
});

// ======== Выйти из аккаунта ========
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  alert("Вы вышли из аккаунта.");
  window.location.href = "registr.html";
});
