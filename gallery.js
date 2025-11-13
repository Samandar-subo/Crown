// ===== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
let currentTheme = 'dark'; // По умолчанию тёмная тема

// Функция инициализации темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    }
    applyTheme(currentTheme);
}

// Функция применения темы
function applyTheme(theme) {
    const body = document.body;
    
    if (theme === 'light') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }
    
    // Обновляем кнопку темы
    updateThemeButton(theme);
    
    // Сохраняем в localStorage
    localStorage.setItem('theme', theme);
    currentTheme = theme;
}

// Функция переключения темы
function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    
    // Показываем уведомление о смене темы
    showThemeNotification(newTheme);
}

// Обновление текста кнопки темы
function updateThemeButton(theme) {
    const themeButtons = document.querySelectorAll('.theme-btn, .mobile-theme-btn');
    themeButtons.forEach(btn => {
        if (theme === 'light') {
            btn.textContent = '🌙 Тёмная';
            btn.title = 'Переключить на тёмную тему';
        } else {
            btn.textContent = '☀️ Светлая';
            btn.title = 'Переключить на светлую тему';
        }
    });
}

// Показ уведомления о смене темы
function showThemeNotification(theme) {
    // Создаем или находим контейнер для уведомлений
    let notificationContainer = document.getElementById('theme-notifications');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'theme-notifications';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(notificationContainer);
    }

    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.textContent = theme === 'light' ? '🌞 Светлая тема включена' : '🌙 Тёмная тема включена';
    notification.style.cssText = `
        background: ${theme === 'light' ? '#ffffff' : '#333333'};
        color: ${theme === 'light' ? '#000000' : '#ffffff'};
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        border: 2px solid #FFD700;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;

    notificationContainer.appendChild(notification);

    // Удаляем уведомление через 2 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Добавляем CSS анимации для уведомлений
function addThemeStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .theme-transition {
            transition: all 0.5s ease !important;
        }
        
        body {
            transition: background-color 0.5s ease, color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");
const galleryItems = document.querySelectorAll(".gallery-item img");

let currentIndex = 0;

galleryItems.forEach((img, index) => {
    img.addEventListener("click", () => {
        lightbox.style.display = "block";
        lightboxImg.src = img.src;
        currentIndex = index;
        document.body.style.overflow = "hidden"; // Блокируем скролл при открытом lightbox
    });
});

closeBtn.onclick = () => {
    lightbox.style.display = "none";
    document.body.style.overflow = ""; // Восстанавливаем скролл
};

function changeSlide(n) {
    currentIndex += n;
    if (currentIndex < 0) currentIndex = galleryItems.length - 1;
    if (currentIndex >= galleryItems.length) currentIndex = 0;
    lightboxImg.src = galleryItems[currentIndex].src;
}

// Закрытие lightbox по клику на фон
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
    }
});

// Закрытие lightbox по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === "block") {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
    }
});

// ===== ФИЛЬТРАЦИЯ ГАЛЕРЕИ =====
function filterGallery(genre) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-buttons button');
    
    buttons.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    items.forEach(item => {
        if (genre === 'all' || item.dataset.genre === genre) {
            item.style.display = "block";
            // Анимация появления
            setTimeout(() => {
                item.style.opacity = "1";
                item.style.transform = "scale(1)";
            }, 50);
        } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.8)";
            setTimeout(() => {
                item.style.display = "none";
            }, 300);
        }
    });
}

// ===== КНОПКА "НАВЕРХ" =====
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        toTop.classList.add("show");
    } else {
        toTop.classList.remove("show");
    }
});

toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем тему
    initTheme();
    
    // Добавляем стили для анимаций
    addThemeStyles();
    
    // Добавляем плавные переходы для body
    document.body.classList.add('theme-transition');
    
    // Находим все кнопки темы и добавляем обработчики
    const themeButtons = document.querySelectorAll('.theme-btn, .mobile-theme-btn, [onclick*="toggleTheme"]');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
    
    // Инициализируем кнопку темы
    updateThemeButton(currentTheme);
    
    console.log('Тема инициализирована:', currentTheme);
});

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ ТЕМОЙ =====

// Функция для принудительной установки темы (можно использовать из консоли)
window.setTheme = function(theme) {
    if (theme === 'light' || theme === 'dark') {
        applyTheme(theme);
    } else {
        console.error('Используйте "light" или "dark"');
    }
};

// Функция для получения текущей темы
window.getCurrentTheme = function() {
    return currentTheme;
};

// Автоматическое переключение темы по времени (опционально)
function setupAutoTheme() {
    const hour = new Date().getHours();
    // С 6 утра до 18 вечера - светлая тема, остальное время - тёмная
    const autoTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    
    // Применяем автоматическую тему только если пользователь не выбирал вручную
    if (!localStorage.getItem('theme')) {
        applyTheme(autoTheme);
    }
}

// Раскомментируйте следующую строку, чтобы включить автоматическое переключение темы по времени:
// setupAutoTheme();