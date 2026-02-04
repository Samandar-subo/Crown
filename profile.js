// Функция для применения темы
function applyTheme() {
    const body = document.body;
    const themeButton = document.getElementById('themeToggleBtn');
    
    // Проверяем сохранённую тему
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        themeButton.textContent = '🌙 Тёмная тема';
    } else {
        body.classList.remove('light-theme');
        themeButton.textContent = '☀️ Светлая тема';
    }
}

// Функция показа уведомления
function showNotification(message, isError = false, isSuccess = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    
    if (isError) {
        notification.className = 'notification-visible notification-error';
    } else if (isSuccess) {
        notification.className = 'notification-visible notification-success';
    } else {
        notification.className = 'notification-visible';
    }
    
    setTimeout(() => {
        notification.className = 'notification-hidden';
    }, 4000);
}

// Функция показа ошибки поля
function showFieldError(field, message) {
    const errorElement = document.getElementById(field);
    const inputElement = document.getElementById(field.replace('Error', ''));
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.classList.add('error');
        
        setTimeout(() => {
            errorElement.classList.remove('show');
            inputElement.classList.remove('error');
        }, 3000);
    }
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Валидация пароля
function validatePassword(password) {
    return password.length >= 6;
}

// Добавляем фон glow
const backgroundGlow = document.createElement('div');
backgroundGlow.className = 'background-glow';
document.body.insertBefore(backgroundGlow, document.body.firstChild);

// Функция для расчета уровня и прогресса
function calculateLevelAndProgress(purchasedGamesCount) {
    let level = 1;
    let gamesForNextLevel = 1;
    let currentProgress = 0;
    
    // Логика уровней: для перехода на следующий уровень нужно купить столько игр, сколько текущий уровень
    let gamesNeeded = 0;
    let totalGames = 0;
    
    for (let i = 1; i <= 10; i++) {
        gamesNeeded = i; // Для уровня i нужно i игр
        totalGames += gamesNeeded;
        
        if (purchasedGamesCount >= totalGames) {
            level = i + 1;
        } else {
            gamesForNextLevel = gamesNeeded;
            currentProgress = purchasedGamesCount - (totalGames - gamesNeeded);
            break;
        }
    }
    
    // Если пользователь купил больше игр, чем нужно для максимального уровня
    if (purchasedGamesCount >= totalGames) {
        level = 10; // Максимальный уровень
        gamesForNextLevel = 0;
        currentProgress = 0;
    }
    
    return {
        level: level,
        currentProgress: currentProgress,
        gamesForNextLevel: gamesForNextLevel,
        progressPercentage: gamesForNextLevel > 0 ? (currentProgress / gamesForNextLevel) * 100 : 100
    };
}

// Функция для обновления статистики
function updateStats() {
    const profile = JSON.parse(localStorage.getItem('profile')) || {};
    const purchaseHistory = profile.purchaseHistory || [];
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    const purchasedGamesCount = purchaseHistory.length;
    const cartGamesCount = cartItems.length;
    
    // Рассчитываем уровень и прогресс
    const levelData = calculateLevelAndProgress(purchasedGamesCount);
    
    // Обновляем уровень
    document.querySelector('.level-circle').textContent = levelData.level;
    
    // Обновляем прогресс-бар
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = levelData.progressPercentage + '%';
        if (levelData.gamesForNextLevel > 0) {
            progressText.textContent = `${levelData.currentProgress}/${levelData.gamesForNextLevel} XP`;
        } else {
            progressText.textContent = 'Макс. уровень';
        }
    }
    
    // Обновляем статистику
    const statsContainer = document.querySelector('.stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <h4>Статистика</h4>
            <p>Всего игр: <span class="stats-value">${purchasedGamesCount}</span></p>
            <p>Игр в корзине: <span class="stats-value">${cartGamesCount}</span></p>
            <p>Уровень: <span class="stats-value">${levelData.level}</span></p>
            <p>Следующий уровень: <span class="stats-value">${levelData.gamesForNextLevel > 0 ? levelData.gamesForNextLevel + ' игр' : 'Максимум'}</span></p>
        `;
    }
}

// Функции для работы с модальным окном
function openEditModal() {
    const modal = document.getElementById('editProfileModal');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        document.getElementById('editUsername').value = currentUser.username || '';
        document.getElementById('editEmail').value = currentUser.email || '';
        // Очищаем поля паролей
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('repeatNewPassword').value = '';
        // Сбрасываем ошибки
        resetModalErrors();
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetModalErrors();
}

function resetModalErrors() {
    const errorElements = document.querySelectorAll('.modal-profile-body .error-message');
    const inputElements = document.querySelectorAll('.modal-profile-body input');
    
    errorElements.forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
    
    inputElements.forEach(input => {
        input.classList.remove('error');
    });
}

// Функция для проверки совпадения паролей
function checkPasswordMatch() {
    const newPassword = document.getElementById('newPassword').value;
    const repeatPassword = document.getElementById('repeatNewPassword').value;
    
    if (newPassword && repeatPassword && newPassword !== repeatPassword) {
        showFieldError('repeatPasswordError', 'Пароли не совпадают');
        return false;
    }
    
    return true;
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

    // Загружаем данные текущего пользователя
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        document.getElementById("username").textContent = `Имя: ${currentUser.username}`;
        document.getElementById("email").textContent = `Email: ${currentUser.email}`;
    } else {
        showNotification('Вы не вошли в аккаунт!', true);
        setTimeout(() => {
            window.location.href = "registr.html";
        }, 2000);
        return;
    }

    // Загружаем историю покупок из localStorage
    const profile = JSON.parse(localStorage.getItem('profile')) || {};
    const purchaseHistory = profile.purchaseHistory || [];
    const purchaseList = document.getElementById("purchase-list");

    if (purchaseHistory.length > 0) {
        purchaseList.innerHTML = '';
        purchaseHistory.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("purchase-item");
            div.style.animationDelay = `${index * 0.1}s`;
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
        purchaseList.innerHTML = "<p>Пока нет покупок</p>";
    }

    // Обновляем статистику
    updateStats();

    // Очистить историю покупок (НЕ сбрасывает уровень)
    document.querySelector(".clear-history-btn").addEventListener("click", () => {
        if (confirm("Вы уверены, что хотите очистить историю покупок?")) {
            const profile = JSON.parse(localStorage.getItem('profile')) || {};
            // Сохраняем количество игр для статистики уровня
            const purchasedGamesCount = profile.purchaseHistory ? profile.purchaseHistory.length : 0;
            
            // Очищаем историю
            profile.purchaseHistory = [];
            localStorage.setItem('profile', JSON.stringify(profile));
            
            // Сохраняем статистику уровня отдельно
            const userStats = JSON.parse(localStorage.getItem('userStats')) || {};
            userStats.totalGamesPurchased = purchasedGamesCount;
            localStorage.setItem('userStats', JSON.stringify(userStats));
            
            purchaseList.innerHTML = "<p>История покупок очищена</p>";
            // Обновляем статистику, но уровень остается прежним
            updateStats();
        }
    });

    // Выход из аккаунта
    document.querySelector(".logout-btn").addEventListener("click", () => {
        if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
            localStorage.removeItem("currentUser");
            showNotification('Вы вышли из аккаунта');
            setTimeout(() => {
                window.location.href = "registr.html";
            }, 1500);
        }
    });

    // Открытие модального окна редактирования профиля
    document.querySelector(".edit-profile-btn").addEventListener("click", openEditModal);

    // Закрытие модального окна
    document.querySelector(".close-modal").addEventListener("click", closeEditModal);
    document.querySelector(".cancel-btn").addEventListener("click", closeEditModal);

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('editProfileModal');
        if (event.target === modal) {
            closeEditModal();
        }
    });

    // Обработка формы редактирования профиля
    document.getElementById('editProfileForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Сбрасываем ошибки
        resetModalErrors();
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const username = document.getElementById('editUsername').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const currentPassword = document.getElementById('currentPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const repeatNewPassword = document.getElementById('repeatNewPassword').value.trim();
        
        let hasErrors = false;
        
        // Валидация имени пользователя
        if (!username) {
            showFieldError('usernameEditError', 'Введите имя пользователя');
            hasErrors = true;
        }
        
        // Валидация email
        if (!email) {
            showFieldError('emailEditError', 'Введите email');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            showFieldError('emailEditError', 'Введите корректный email');
            hasErrors = true;
        }
        
        // Проверка текущего пароля
        if (!currentPassword) {
            showFieldError('currentPasswordError', 'Введите текущий пароль');
            hasErrors = true;
        } else if (currentPassword !== currentUser.password) {
            showFieldError('currentPasswordError', 'Неверный текущий пароль');
            hasErrors = true;
        }
        
        // Проверка нового пароля (если введен)
        if (newPassword) {
            if (!validatePassword(newPassword)) {
                showFieldError('newPasswordError', 'Пароль должен содержать минимум 6 символов');
                hasErrors = true;
            }
            
            if (newPassword !== repeatNewPassword) {
                showFieldError('repeatPasswordError', 'Пароли не совпадают');
                hasErrors = true;
            }
        }
        
        if (hasErrors) {
            return;
        }
        
        // Обновление данных пользователя
        const updatedUser = {
            ...currentUser,
            username: username,
            email: email,
            password: newPassword || currentPassword // Если новый пароль не введен, оставляем старый
        };
        
        // Обновляем в localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Обновляем в списке пользователей
        const updatedUsers = users.map(user => {
            if (user.email === currentUser.email) {
                return updatedUser;
            }
            return user;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Обновляем отображение на странице
        document.getElementById("username").textContent = `Имя: ${username}`;
        document.getElementById("email").textContent = `Email: ${email}`;
        
        // Закрываем модальное окно
        closeEditModal();
        
        // Показываем уведомление об успехе
        showNotification('Профиль успешно обновлен!', false, true);
    });

    // Проверка совпадения паролей в реальном времени
    document.getElementById('repeatNewPassword').addEventListener('input', function() {
        checkPasswordMatch();
    });

    // Переключатель темы
    const themeButton = document.getElementById('themeToggleBtn');
    themeButton.addEventListener('click', () => {
        document.body.classList.add('theme-transition');

        if (document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
            themeButton.textContent = '☀️ Светлая тема';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-theme');
            themeButton.textContent = '🌙 Тёмная тема';
            localStorage.setItem('theme', 'light');
        }

        setTimeout(() => document.body.classList.remove('theme-transition'), 700);
    });

    // Навигация для мобильных
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navMenu = document.querySelector('nav');
    if (navbarToggler && navMenu) {
        navbarToggler.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }
});