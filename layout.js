// Layout.js
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем фон glow
    const backgroundGlow = document.createElement('div');
    backgroundGlow.className = 'background-glow';
    document.body.insertBefore(backgroundGlow, document.body.firstChild);

    // Функция для автоматического применения темы
    function applyTheme() {
        const body = document.body;
        
        // Проверяем сохранённую тему
        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }
    }

    // Функция для показа уведомлений
    function showNotification(message) {
        const notificationDiv = document.createElement('div');
        notificationDiv.textContent = message;
        notificationDiv.id = 'notification-' + Date.now();
        
        // Стили для уведомления
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
        
        // Позиционируем уведомление относительно других
        const existingNotifications = document.querySelectorAll('[id^="notification-"]');
        const topOffset = 100 + (existingNotifications.length * 80); // 80px между уведомлениями
        notificationDiv.style.top = topOffset + 'px';
        
        document.body.appendChild(notificationDiv);

        // Удаляем уведомление после анимации
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
    `;
    document.head.appendChild(style);

    // Функция для добавления игры в корзину
    function addToCart(gameTitle, gamePrice, gameImage) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const alreadyInCart = cart.some(item => item.title === gameTitle);

        if (alreadyInCart) {
            showNotification(`${gameTitle} уже в корзине`);
            return;
        }

        cart.push({ title: gameTitle, price: gamePrice, image: gameImage });
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification(`${gameTitle} добавлена в корзину`);
    }

    // Обработчики для кнопок "Купить" - теперь просто добавляют в корзину
    function initBuyButtons() {
        const buyButtons = document.querySelectorAll('.buy-btn');
        buyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Получаем информацию о игре
                const gameCard = this.closest('.game-box');
                const gameTitle = gameCard.querySelector('h2').textContent;
                const gamePrice = gameCard.querySelector('.price').textContent;
                const gameImage = gameCard.querySelector('img').src;

                // Добавляем игру в корзину
                addToCart(gameTitle, gamePrice, gameImage);
            });
        });
    }

    // Улучшенный поиск игр
    function initSearch() {
        const searchInput = document.querySelector('.search-box input');
        const gameBoxes = document.querySelectorAll('.game-box');

        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            let visibleCount = 0;
            
            gameBoxes.forEach(game => {
                const title = game.querySelector('h2').textContent.toLowerCase();
                const description = game.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query) || query === '') {
                    game.style.display = 'block';
                    game.classList.remove('hidden');
                    game.classList.add('visible');
                    visibleCount++;
                } else {
                    game.style.display = 'none';
                    game.classList.remove('visible');
                    game.classList.add('hidden');
                }
            });

            // Обновляем grid в зависимости от количества видимых карточек
            updateGridLayout(visibleCount);
        });
    }

    // Функция для обновления layout grid
    function updateGridLayout(visibleCount) {
        const rowCards = document.querySelector('.row-cards');
        
        if (visibleCount === 0) {
            rowCards.style.gridTemplateColumns = '1fr';
            rowCards.style.justifyItems = 'center';
        } else if (visibleCount === 1) {
            rowCards.style.gridTemplateColumns = 'minmax(300px, 400px)';
            rowCards.style.justifyItems = 'center';
        } else if (visibleCount === 2) {
            rowCards.style.gridTemplateColumns = 'repeat(2, minmax(280px, 1fr))';
            rowCards.style.justifyItems = 'stretch';
        } else {
            rowCards.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            rowCards.style.justifyItems = 'center';
        }
    }

    // Фильтрация по жанрам
    function initGenreFilter() {
        const genreLinks = document.querySelectorAll('aside a');
        
        genreLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const genre = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                filterGames(genre);
            });
        });
    }

    // Инициализация
    applyTheme(); // Применяем тему при загрузке
    initBuyButtons(); // Инициализируем кнопки "Купить"
    initSearch();
    initGenreFilter();
});

// Функция фильтрации игр
function filterGames(genre) {
    const games = document.querySelectorAll('.game-box');
    let visibleCount = 0;

    games.forEach(game => {
        if (genre === 'all') {
            game.style.display = 'block';
            game.classList.remove('hidden');
            game.classList.add('visible');
            visibleCount++;
        } else {
            if (game.dataset.genre === genre) {
                game.style.display = 'block';
                game.classList.remove('hidden');
                game.classList.add('visible');
                visibleCount++;
            } else {
                game.style.display = 'none';
                game.classList.remove('visible');
                game.classList.add('hidden');
            }
        }
    });

    // Обновляем grid layout после фильтрации
    updateGridLayout(visibleCount);
}

// Функция для обновления layout grid (глобальная)
function updateGridLayout(visibleCount) {
    const rowCards = document.querySelector('.row-cards');
    
    if (!rowCards) return;
    
    if (visibleCount === 0) {
        rowCards.style.gridTemplateColumns = '1fr';
        rowCards.style.justifyItems = 'center';
    } else if (visibleCount === 1) {
        rowCards.style.gridTemplateColumns = 'minmax(300px, 400px)';
        rowCards.style.justifyItems = 'center';
    } else if (visibleCount === 2) {
        rowCards.style.gridTemplateColumns = 'repeat(2, minmax(280px, 1fr))';
        rowCards.style.justifyItems = 'stretch';
    } else {
        rowCards.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        rowCards.style.justifyItems = 'center';
    }
}

// Корзина и уведомления
$(document).ready(function () {
    // Прогресс-бар
    $(window).on('scroll', function () {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const progress = (scrollTop / docHeight) * 100;
        $('#progressBar, #scrollProgress').css('width', progress + '%');
    });

    // Highlight
    $(function () {
        let highlightOn = false;

        function clearHighlight() {
            $('mark.hl').each(function () {
                $(this).replaceWith($(this).text());
            });
        }

        function doHighlight(term) {
            clearHighlight();
            if (!term) return;
            const re = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            $('.game-box h2, .game-box p').each(function () {
                $(this).html($(this).text().replace(re, '<mark class="hl">$1</mark>'));
            });
        }

        $('#liveSearch').on('input', function () {
            const term = $(this).val().trim();
            if (highlightOn) {
                doHighlight(term);
            } else if (!term) {
                clearHighlight();
            }
        });
    });

    // Переключатель темы
    const themeButton = document.getElementById('themeToggleBtn');
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        if (themeButton) themeButton.textContent = '🌙 Тёмная тема';
    }

    if (themeButton) {
        themeButton.addEventListener('click', () => {
            body.classList.add('theme-transition');

            if (body.classList.contains('light-theme')) {
                body.classList.remove('light-theme');
                themeButton.textContent = '☀️ Светлая тема';
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.add('light-theme');
                themeButton.textContent = '🌙 Тёмная тема';
                localStorage.setItem('theme', 'light');
            }

            setTimeout(() => body.classList.remove('theme-transition'), 700);
        });
    }

    // Навигация для мобильных
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navMenu = document.querySelector('nav');

    if (navbarToggler && navMenu) {
        navbarToggler.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

    // Мобильные улучшения
    $('input, textarea, select').on('focus', function() {
        window.setTimeout(function() {
            document.body.style.zoom = 1;
        }, 100);
    });
    
    $('.navbar-nav .nav-link').on('click', function() {
        $('.navbar-collapse').collapse('hide');
    });
    
    if ('ontouchstart' in window) {
        $('.game-box').css('cursor', 'pointer');
        
        $('.buy-btn').on('touchstart', function(e) {
            $(this).addClass('touch-active');
            e.preventDefault();
        }).on('touchend', function() {
            $(this).removeClass('touch-active');
        });
    }

    // Слушаем изменения в localStorage для синхронизации темы
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme') {
            const body = document.body;
            if (e.newValue === 'light') {
                body.classList.add('light-theme');
            } else {
                body.classList.remove('light-theme');
            }
        }
    });

    // Также проверяем тему периодически (на случай если вкладки в одном браузере)
    setInterval(function() {
        const body = document.body;
        const currentTheme = localStorage.getItem('theme');
        
        if (currentTheme === 'light' && !body.classList.contains('light-theme')) {
            body.classList.add('light-theme');
        } else if (currentTheme !== 'light' && body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
        }
    }, 1000);
});