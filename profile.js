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






// ======== Редактирование профиля (имя, email, пароль + обновление в users) ========
const editBtn = document.querySelector(".edit-profile-btn");

if (editBtn) {
  editBtn.addEventListener("click", () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 1️⃣ Проверяем старый пароль
    const oldPassword = prompt("Введите текущий пароль:");
    if (oldPassword !== currentUser.password) {
      alert("❌ Неверный текущий пароль!");
      return;
    }

    // 2️⃣ Запрашиваем новые данные
    const newName = prompt("Введите новое имя:", currentUser.username || "Игрок");
    const newEmail = prompt("Введите новый email:", currentUser.email || "example@mail.com");
    const newPassword = prompt("Введите новый пароль:", currentUser.password || "");

    if (newName && newEmail && newPassword) {
      // 3️⃣ Обновляем currentUser
      currentUser = { ...currentUser, username: newName, email: newEmail, password: newPassword };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // 4️⃣ Обновляем данные в массиве users
      const updatedUsers = users.map(user => {
        if (user.email === currentUser.email || user.username === currentUser.username) {
          return currentUser; // заменяем старую запись новым объектом
        }
        return user;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // 5️⃣ Обновляем интерфейс
      document.getElementById("username").textContent = `Имя: ${newName}`;
      document.getElementById("email").textContent = `Email: ${newEmail}`;

      alert("✅ Профиль и пароль успешно обновлены!");
    } else {
      alert("⚠️ Изменения отменены.");
    }
  });
}









document.addEventListener('DOMContentLoaded', function () {
  // Загружаем данные текущего пользователя
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  if (currentUser) {
    document.getElementById("username").textContent = `Имя: ${currentUser.username}`;
    document.getElementById("email").textContent = `Email: ${currentUser.email}`;
  } else {
    alert("Вы не вошли в аккаунт!");
    window.location.href = "registr.html";
  }

  // Загружаем историю покупок из localStorage
  const profile = JSON.parse(localStorage.getItem('profile')) || {};
  const purchaseHistory = profile.purchaseHistory || [];
  const purchaseList = document.getElementById("purchase-list");

  if (purchaseHistory.length > 0) {
    purchaseList.innerHTML = ''; // Очистим список перед добавлением
    purchaseHistory.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("purchase-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="purchase-info">
          <h4>${item.title}</h4>
          <p>Цена: ${item.price}</p>
        </div>
      `;
      purchaseList.appendChild(div);
    });
  } else {
    purchaseList.innerHTML = "<p>Пока нет покупок.</p>";
  }

  // Очистить историю покупок
  document.querySelector(".clear-history-btn").addEventListener("click", () => {
    localStorage.removeItem("profile");
    purchaseList.innerHTML = "<p>История покупок очищена.</p>";
  });

  // Выход из аккаунта
  document.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("Вы вышли из аккаунта.");
    window.location.href = "registr.html";
  });
});


