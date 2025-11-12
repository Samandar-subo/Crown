function filterGames(genre) {
  const games = document.querySelectorAll('.game-box');

  games.forEach(game => {
    switch (genre) {
      case 'action':
        game.style.display = game.dataset.genre === 'action' ? 'block' : 'none';
        break;

      case 'racing':
        game.style.display = game.dataset.genre === 'racing' ? 'block' : 'none';
        break;

      case 'horror':
        game.style.display = game.dataset.genre === 'horror' ? 'block' : 'none';
        break;

      case 'rpg':
        game.style.display = game.dataset.genre === 'rpg' ? 'block' : 'none';
        break;
      case 'shooter':
        game.style.display = game.dataset.genre === 'shooter' ? 'block' : 'none';
        break;

      default:
        // Показать все игры, если жанр "all" или другой
        game.style.display = 'block';
        break;
    }
  });
}

// меню 

// ======= Поиск по названию игры ======= //
const searchInput = document.querySelector('.search-box input');

searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const games = document.querySelectorAll('.game-box');

  games.forEach(card => {
    const title = card.querySelector('h2').textContent.toLowerCase();
    card.style.display = title.includes(query) ? 'block' : 'none';
  });
});



//=== for Karzina===
$(document).ready(function () {
  console.log("✅ jQuery is ready and working!");

  // Функция для добавления игры в корзину
  function addToCart(gameTitle, gamePrice, gameImage) {
    // Загружаем текущую корзину
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Проверяем, не добавлена ли уже эта игра
    const alreadyInCart = cart.some(item => item.title === gameTitle);

    if (alreadyInCart) {
      showNotification(`${gameTitle} уже в корзине`, '#383838ff');
      return;
    }

    // Добавляем игру в корзину
    cart.push({ title: gameTitle, price: gamePrice, image: gameImage });
    localStorage.setItem('cart', JSON.stringify(cart));

    // Показываем уведомление
    showNotification(`${gameTitle} добавлена в корзину`, '#383838ff');
  }

  // Функция для показа уведомлений
  function showNotification(message, bgColor) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.backgroundColor = bgColor;
    notification.classList.add('notification');
    document.body.appendChild(notification);

    // Убираем уведомление через 3 секунды
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Обработчик событий на кнопки "Купить"
  const buyButtons = document.querySelectorAll('.buy-btn');
  buyButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();

      // Получаем информацию о игре
      const gameCard = button.closest('.game-box');
      const gameTitle = gameCard.querySelector('h2').textContent;
      const gamePrice = gameCard.querySelector('.price').textContent;
      const gameImage = gameCard.querySelector('img').src;

      // Добавляем игру в корзину
      addToCart(gameTitle, gamePrice, gameImage);
    });
  });
});

$(window).on('scroll', function () {
  const scrollTop = $(window).scrollTop();
  const docHeight = $(document).height() - $(window).height();
  const progress = (scrollTop / docHeight) * 100;
  $('#scrollProgress').css('width', progress + '%');
});

$(window).on('scroll', function () {
  const scrollTop = $(window).scrollTop();
  const docHeight = $(document).height() - $(window).height();
  const progress = (scrollTop / docHeight) * 100;
  $('#progressBar').css('width', progress + '%');
});
// === Highlight: toggle-режим с автообновлением при вводе ===
$(function () {
  let highlightOn = false; // состояние режима

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


  // При наборе в поиске — обновляем подсветку только если режим включен
  $('#liveSearch').on('input', function () {
    const term = $(this).val().trim();
    if (highlightOn) {
      doHighlight(term);
    } else if (!term) {
      clearHighlight(); // на всякий случай чистим, когда строка пустая
    }
  });
});






// ===== Переключатель темы (Day / Night) =====
const themeButton = document.getElementById('themeToggleBtn');
const body = document.body;

// Проверяем сохранённую тему
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-theme');
  themeButton.textContent = '🌙 Тёмная тема';
}

// Переключение темы с плавным переходом
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
// Обработчик клика
themeButton.addEventListener('click', toggleTheme);



// ===================== Scroll Progress Bar =====================
$(window).on('scroll', function () {
  const scrollTop = $(window).scrollTop();
  const docHeight = $(document).height() - $(window).height();
  const progress = (scrollTop / docHeight) * 100;
  $('#scrollProgress').css('width', progress + '%');
});

// Получаем кнопку гамбургера и саму панель навигации
const navbarToggler = document.querySelector('.navbar-toggler');
const navMenu = document.querySelector('nav');

// Обработчик события для открытия/закрытия навигации
navbarToggler.addEventListener('click', () => {
  navMenu.classList.toggle('show');  // Переключаем класс для отображения/скрытия
});
// Мобильные улучшения
$(document).ready(function() {
  // Предотвращение масштабирования при фокусе на инпуты
  $('input, textarea, select').on('focus', function() {
    window.setTimeout(function() {
      document.body.style.zoom = 1;
    }, 100);
  });
  
  // Закрытие меню при клике на ссылку (для мобильных)
  $('.navbar-nav .nav-link').on('click', function() {
    $('.navbar-collapse').collapse('hide');
  });
  
  // Оптимизация для touch устройств
  if ('ontouchstart' in window) {
    $('.game-box').css('cursor', 'pointer');
    
    // Улучшенные touch события
    $('.buy-btn').on('touchstart', function(e) {
      $(this).addClass('touch-active');
      e.preventDefault();
    }).on('touchend', function() {
      $(this).removeClass('touch-active');
    });
  }
}); 