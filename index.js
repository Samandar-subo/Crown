// index.js
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const gamesContainer = document.getElementById('gamesContainer');
    const gameBoxes = document.querySelectorAll('.game-box');
    const noGamesMessage = document.getElementById('noGamesMessage');
    const moreGamesSection = document.querySelector('.more-games-section');

    // Данные для подсказок поиска
    const searchData = [
        'forza',
        'gta',
        'backrooms',
        'гонки',
        'экшен',
        'хоррор',
        'racing',
        'action',
        'horror'
    ];

    // Функция для транслитерации русских букв в английские
    function transliterateToEnglish(text) {
        const rusToEng = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
            'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
            'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
            'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
            'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
            'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
            'э': 'e', 'ю': 'yu', 'я': 'ya'
        };

        return text.toLowerCase().split('').map(char => 
            rusToEng[char] || char
        ).join('');
    }

    // Функция для транслитерации английских букв в русские
    function transliterateToRussian(text) {
        const engToRus = {
            'a': 'а', 'b': 'б', 'c': 'ц', 'd': 'д', 'e': 'е',
            'f': 'ф', 'g': 'г', 'h': 'х', 'i': 'и', 'j': 'й',
            'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о',
            'p': 'п', 'q': 'к', 'r': 'р', 's': 'с', 't': 'т',
            'u': 'у', 'v': 'в', 'w': 'в', 'x': 'кс', 'y': 'й',
            'z': 'з'
        };

        return text.toLowerCase().split('').map(char => 
            engToRus[char] || char
        ).join('');
    }

    // Функция для показа модального окна авторизации
    function showLoginModal() {
        // Создаем модальное окно, если его нет
        let modal = document.getElementById('loginModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = 'loginModal';
            modal.tabIndex = -1;
            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Требуется авторизация</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="modal-icon">🔒</div>
                            <p>Для выполнения этого действия необходимо войти в свой аккаунт или зарегистрироваться.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <a href="registr.html" class="btn btn-warning">Войти / Зарегистрироваться</a>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Показываем модальное окно
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    // Улучшенный поиск игр
    function searchGames(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Показываем все игры при пустом поиске
            gameBoxes.forEach(game => {
                game.classList.remove('hidden');
                game.classList.add('visible');
            });
            updateContainerVisibility(gameBoxes.length, '');
            return;
        }

        let foundGames = 0;

        gameBoxes.forEach(game => {
            const gameData = game.getAttribute('data-game').toLowerCase();
            const gameTitle = game.querySelector('h2').textContent.toLowerCase();
            
            // Транслитерируем поисковый запрос в обе стороны
            const searchTermEng = transliterateToEnglish(searchTerm);
            const searchTermRus = transliterateToRussian(searchTerm);
            
            // Ищем совпадения в разных вариантах
            const matches = 
                // Прямое совпадение
                gameTitle.includes(searchTerm) ||
                gameData.includes(searchTerm) ||
                // Английская транслитерация
                gameTitle.includes(searchTermEng) ||
                gameData.includes(searchTermEng) ||
                // Русская транслитерация  
                gameTitle.includes(searchTermRus) ||
                gameData.includes(searchTermRus) ||
                // По первым буквам слов в названии
                checkFirstLetters(gameTitle, searchTerm);

            if (matches) {
                game.classList.remove('hidden');
                game.classList.add('visible');
                foundGames++;
            } else {
                game.classList.remove('visible');
                game.classList.add('hidden');
            }
        });

        updateContainerVisibility(foundGames, searchTerm);
        hideSuggestions();
    }

    // Проверка по первым буквам слов
    function checkFirstLetters(title, searchTerm) {
        const words = title.split(' ');
        const firstLetters = words.map(word => word[0]).join('');
        return firstLetters.includes(searchTerm);
    }

    // Обновляем видимость контейнеров
    function updateContainerVisibility(foundGames, searchTerm) {
        if (foundGames === 0 && searchTerm !== '') {
            noGamesMessage.style.display = 'flex';
            moreGamesSection.style.display = 'none';
            gamesContainer.style.display = 'none';
        } else {
            noGamesMessage.style.display = 'none';
            moreGamesSection.style.display = 'flex';
            gamesContainer.style.display = 'grid';
        }
    }

    // Показать подсказки
    function showSuggestions() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            hideSuggestions();
            return;
        }

        // Транслитерируем запрос для поиска подсказок
        const queryEng = transliterateToEnglish(query);
        const queryRus = transliterateToRussian(query);

        const filteredSuggestions = searchData.filter(item => 
            item.toLowerCase().includes(query) ||
            item.toLowerCase().includes(queryEng) ||
            item.toLowerCase().includes(queryRus)
        );

        if (filteredSuggestions.length > 0) {
            searchSuggestions.innerHTML = filteredSuggestions
                .map(item => `
                    <div class="search-suggestion-item" data-suggestion="${item}">
                        ${item}
                    </div>
                `).join('');
            searchSuggestions.style.display = 'block';
        } else {
            hideSuggestions();
        }
    }

    // Скрыть подсказки
    function hideSuggestions() {
        searchSuggestions.style.display = 'none';
    }

    // Очистить поиск
    function clearSearch() {
        searchInput.value = '';
        searchGames('');
        hideSuggestions();
    }

    // Обработчики событий для кнопок "Купить" и "Подробности"
    function initGameButtons() {
        const buyButtons = document.querySelectorAll('.buy-btn');
        const detailsButtons = document.querySelectorAll('.details-link');

        // Обработчики для кнопок "Купить"
        buyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showLoginModal();
            });
        });

        // Обработчики для кнопок "Подробности"
        detailsButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showLoginModal();
            });
        });
    }

    // Обработчики событий для навигации
    function initNavigationButtons() {
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            // Пропускаем ссылку "ВХОД" - она ведет на registr.html
            if (link.textContent === 'ВХОД') {
                return;
            }
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showLoginModal();
            });
        });
    }

    // Обработчики событий
    searchInput.addEventListener('input', function() {
        showSuggestions();
        searchGames(this.value);
    });

    searchInput.addEventListener('focus', showSuggestions);

    searchButton.addEventListener('click', function() {
        searchGames(searchInput.value);
    });

    // Поиск при нажатии Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchGames(this.value);
        }
    });

    // Клик по подсказке
    searchSuggestions.addEventListener('click', function(e) {
        if (e.target.classList.contains('search-suggestion-item')) {
            const suggestion = e.target.getAttribute('data-suggestion');
            searchInput.value = suggestion;
            searchGames(suggestion);
        }
    });

    // Скрыть подсказки при клике вне поиска
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            hideSuggestions();
        }
    });

    // Очистка поиска по кнопке
    document.querySelector('.clear-search-btn')?.addEventListener('click', clearSearch);

    // Навигация по подсказкам с клавиатуры
    let selectedSuggestionIndex = -1;

    searchInput.addEventListener('keydown', function(e) {
        const suggestions = searchSuggestions.querySelectorAll('.search-suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
            updateSelectedSuggestion(suggestions);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
            updateSelectedSuggestion(suggestions);
        } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
            e.preventDefault();
            const selectedSuggestion = suggestions[selectedSuggestionIndex];
            searchInput.value = selectedSuggestion.getAttribute('data-suggestion');
            searchGames(searchInput.value);
            hideSuggestions();
            selectedSuggestionIndex = -1;
        }
    });

    function updateSelectedSuggestion(suggestions) {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle('highlighted', index === selectedSuggestionIndex);
        });
    }

    // Инициализация
    searchGames('');
    initGameButtons();
    initNavigationButtons();
});

// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Закрытие меню при клике на ссылку
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container') && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});