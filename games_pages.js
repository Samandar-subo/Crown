// Делаем глобальные функции которые будут доступны из Layout.js
window.addToCart = function(gameTitle, gamePrice, gameImage) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Текущая корзина:', cart);

    // Проверяем, не добавлена ли уже эта игра
    const alreadyInCart = cart.some(item => item.title === gameTitle);
    if (alreadyInCart) {
        window.showNotification(`${gameTitle} уже в корзине!`);
        console.log('Игра уже в корзине');
        return;
    }

    // Добавляем игру в корзину
    cart.push({ 
        title: gameTitle, 
        price: gamePrice, 
        image: gameImage 
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Игра добавлена в корзину, новая корзина:', cart);

    // Показываем уведомление
    window.showNotification(`${gameTitle} добавлена в корзину!`);
};

window.showNotification = function(message) {
    const notificationDiv = document.createElement('div');
    notificationDiv.textContent = message;
    notificationDiv.id = 'notification-' + Date.now();
    
    // Определяем тему для стилей уведомления
    const isLightTheme = document.body.classList.contains('light-theme');
    const bgColor = isLightTheme ? 'linear-gradient(135deg, #ffffff, #f7fafc)' : '#1a1a1a';
    const textColor = isLightTheme ? '#2d3748' : '#FFD700';
    const borderColor = '#FFD700';
    
    notificationDiv.style.cssText = `
        position: fixed;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 15px 25px;
        border-radius: 12px;
        font-weight: bold;
        border: 2px solid ${borderColor};
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

    // Удаляем уведомление после анимации
    setTimeout(() => {
        if (notificationDiv.parentNode) {
            notificationDiv.remove();
        }
    }, 3000);
};

// Функция для переключения темы
window.toggleTheme = function() {
    const body = document.body;
    const isLightTheme = body.classList.contains('light-theme');
    
    if (isLightTheme) {
        // Переключаем на темную тему
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
        console.log('Переключено на темную тему');
    } else {
        // Переключаем на светлую тему
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        console.log('Переключено на светлую тему');
    }
    
    // Обновляем прогресс-бар для соответствия теме
    updateProgressBarTheme();
};

// Функция для применения сохраненной темы
window.applySavedTheme = function() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        console.log('Применена светлая тема из localStorage');
    } else {
        body.classList.remove('light-theme');
        console.log('Применена темная тема из localStorage');
    }
    
    updateProgressBarTheme();
};

// Функция для обновления стилей прогресс-бара в соответствии с темой
function updateProgressBarTheme() {
    const progressBar = document.getElementById('progressBar');
    const scrollProgress = document.getElementById('scrollProgress');
    const isLightTheme = document.body.classList.contains('light-theme');
    
    if (progressBar && scrollProgress) {
        if (isLightTheme) {
            progressBar.style.background = 'linear-gradient(90deg, #FFD700, #ffed4a, #FFD700)';
            scrollProgress.style.background = 'linear-gradient(90deg, #FFD700, #ffed4a, #FFD700)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #FFD700, #ffed4a)';
            scrollProgress.style.background = 'linear-gradient(90deg, #FFD700, #ffed4a)';
        }
    }
}

// Функция для создания кнопки переключения темы
window.createThemeToggleButton = function() {
    // Проверяем, не существует ли уже кнопка
    if (document.getElementById('theme-toggle-btn')) {
        return;
    }
    
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.id = 'theme-toggle-btn';
    themeToggleBtn.innerHTML = '🌓';
    themeToggleBtn.title = 'Переключить тему';
    
    // Стили для кнопки переключения темы
    themeToggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #FFD700, #ffed4a);
        border: 2px solid #FFD700;
        color: #000;
        font-size: 20px;
        cursor: pointer;
        z-index: 9997;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    `;
    
    themeToggleBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)';
    });
    
    themeToggleBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
    });
    
    themeToggleBtn.addEventListener('click', window.toggleTheme);
    
    document.body.appendChild(themeToggleBtn);
    
    // Адаптируем стили для светлой темы если нужно
    setTimeout(() => {
        updateThemeToggleButton();
    }, 100);
};

// Функция для обновления внешнего вида кнопки переключения темы
function updateThemeToggleButton() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (!themeToggleBtn) return;
    
    const isLightTheme = document.body.classList.contains('light-theme');
    
    if (isLightTheme) {
        themeToggleBtn.style.background = 'linear-gradient(135deg, #2d3748, #4a5568)';
        themeToggleBtn.style.border = '2px solid #2d3748';
        themeToggleBtn.style.color = '#FFD700';
        themeToggleBtn.style.boxShadow = '0 4px 15px rgba(45, 55, 72, 0.3)';
        themeToggleBtn.innerHTML = '🌙';
    } else {
        themeToggleBtn.style.background = 'linear-gradient(135deg, #FFD700, #ffed4a)';
        themeToggleBtn.style.border = '2px solid #FFD700';
        themeToggleBtn.style.color = '#000';
        themeToggleBtn.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
        themeToggleBtn.innerHTML = '☀️';
    }
}

// Слушатель изменения темы для обновления кнопки
const themeObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
            updateThemeToggleButton();
            updateProgressBarTheme();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Game page loaded');
    
    // Применяем сохраненную тему
    window.applySavedTheme();
    
    // Создаем кнопку переключения темы
    window.createThemeToggleButton();
    
    // Начинаем наблюдение за изменениями класса body
    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Инициализация кнопки покупки
    initBuyButton();
    
    // Инициализация галереи
    initGallery();
    
    // Добавляем стили для анимации если их нет
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(100px); }
                10% { opacity: 1; transform: translateX(0); }
                90% { opacity: 1; transform: translateX(0); }
                100% { opacity: 0; transform: translateX(100px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Инициализация прогресс-бара скролла
    initScrollProgress();
});

// Инициализация кнопки покупки
function initBuyButton() {
    const buyButton = document.querySelector('.buy-btn');

    if (buyButton) {
        buyButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Кнопка "Купить сейчас" нажата');

            // Получаем информацию о текущей игре
            const gameTitle = document.querySelector('.game-info h1').textContent;
            const gamePrice = document.querySelector('.price').textContent;
            const gameImage = document.querySelector('.game-image img').src;

            console.log('Данные игры:', { gameTitle, gamePrice, gameImage });

            // Добавляем игру в корзину используя глобальную функцию
            if (typeof window.addToCart === 'function') {
                window.addToCart(gameTitle, gamePrice, gameImage);
            } else {
                // Fallback если функция не доступна
                console.error('Функция addToCart не найдена!');
                alert(`Игра "${gameTitle}" добавлена в корзину!`);
                
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push({ title: gameTitle, price: gamePrice, image: gameImage });
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        });
    }
}

// Инициализация галереи
function initGallery() {
    const galleryImages = document.querySelectorAll('.gallery img');
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            console.log(`Clicked on screenshot ${index + 1}`);
        });
    });
}

// Инициализация прогресс-бара скролла
function initScrollProgress() {
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progressBar = document.getElementById('scrollProgress');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });
}

// Совместимость с мобильными устройствами
$(document).ready(function() {
    // Закрытие навигации при клике на ссылку на мобильных
    $('.navbar-nav .nav-link').on('click', function() {
        $('.navbar-collapse').collapse('hide');
    });
    
    // Адаптация темы для мобильных устройств
    if (window.innerWidth <= 768) {
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.style.bottom = '70px'; // Поднимаем выше чтобы не мешало другим элементам
            themeToggleBtn.style.right = '15px';
            themeToggleBtn.style.width = '45px';
            themeToggleBtn.style.height = '45px';
            themeToggleBtn.style.fontSize = '18px';
        }
    }
});

// Обработчик изменения размера окна для адаптации кнопки темы
window.addEventListener('resize', function() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        if (window.innerWidth <= 768) {
            themeToggleBtn.style.bottom = '70px';
            themeToggleBtn.style.right = '15px';
            themeToggleBtn.style.width = '45px';
            themeToggleBtn.style.height = '45px';
            themeToggleBtn.style.fontSize = '18px';
        } else {
            themeToggleBtn.style.bottom = '20px';
            themeToggleBtn.style.right = '20px';
            themeToggleBtn.style.width = '50px';
            themeToggleBtn.style.height = '50px';
            themeToggleBtn.style.fontSize = '20px';
        }
    }
});