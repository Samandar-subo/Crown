// about_us.js - Специфичный JavaScript для страницы "О нас"

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initTheme();
    
    // Инициализация прогресс-бара
    initProgressBar();
    
    // Инициализация анимаций при скролле
    initScrollAnimations();
});

// Инициализация темы
function initTheme() {
    const body = document.body;
    
    // Проверяем сохранённую тему
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }
    
    // Слушаем изменения темы из других вкладок
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme') {
            if (e.newValue === 'light') {
                body.classList.add('light-theme');
            } else {
                body.classList.remove('light-theme');
            }
        }
    });
}

// Инициализация прогресс-бара
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (progressBar && scrollProgress) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = progress + '%';
            scrollProgress.style.width = progress + '%';
        });
    }
}

// Анимации при скролле
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.mission-card, .team-member, .contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Функция для показа уведомлений (совместимость с Layout.js)
function showNotification(message) {
    const notificationDiv = document.createElement('div');
    notificationDiv.textContent = message;
    notificationDiv.id = 'notification-' + Date.now();
    
    notificationDiv.style.cssText = `
        position: fixed;
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

// Совместимость с мобильными устройствами
$(document).ready(function() {
    // Закрытие навигации при клике на ссылку на мобильных
    $('.navbar-nav .nav-link').on('click', function() {
        $('.navbar-collapse').collapse('hide');
    });
    
    // Предотвращение масштабирования на мобильных при фокусе
    $('input, textarea, select').on('focus', function() {
        window.setTimeout(function() {
            document.body.style.zoom = 1;
        }, 100);
    });
});