$(document).ready(function(){
  console.log("✅ jQuery is ready and working!");
});

// ===================== Improved jQuery Filter =====================
function filterGames(genre) {
  const $games = $('.game-box');

  if (genre === 'all') {
    $games.show();
    return;
  }

  $games.each(function () {
    const g = $(this).data('genre');
    $(this).toggle(g === genre);
  });
}

// ===================== Live Search Filter (Assignment 7) =====================
$(function () {
  // При вводе в поле поиска фильтруем по названию
  $('#liveSearch').on('keyup', function () {
    const val = $(this).val().toLowerCase();
    $('.game-box').each(function () {
      const title = $(this).find('h2, h3').text().toLowerCase();
      $(this).toggle(title.includes(val));
    });
  });
});


// меню 



//=== for Karzina===

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
    const gameCard = button.closest('.game-box') || button.closest('.game-hero');
    const gameTitle = gameCard.querySelector('h2')?.textContent || gameCard.querySelector('h1').textContent;
    const gamePrice = gameCard.querySelector('.price').textContent;
    const gameImage = gameCard.querySelector('img').src;

    // Добавляем игру в корзину
    addToCart(gameTitle, gamePrice, gameImage);
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
// ======= конец твоих функций (фильтры, корзина, темы и т.д.) =======

// === Scroll Progress Bar ===
$(function () {
  if (!$('#progressBar').length)
    $('body').append('<div id="progressBar"></div>');
  $(window).on('scroll', function () {
    const s = $(window).scrollTop();
    const h = $(document).height() - $(window).height();
    $('#progressBar').css('width', (s / h * 100) + '%');
  });
});

// === Animated Counter ===
$(function () {
  function startCounters() {
    $('.countup').each(function () {
      const $el = $(this);
      if ($el.data('started')) return;
      if ($(window).scrollTop() + $(window).height() > $el.offset().top) {
        $el.data('started', true);
        $({ n: 0 }).animate({ n: $el.data('count') }, {
          duration: 2000,
          step: function (v) { $el.text(Math.floor(v)); },
          complete: function () { $el.text($el.data('count')); }
        });
      }
    });
  }
  $(window).on('scroll', startCounters);
  startCounters();
});

// === Lazy Loading ===
$(function () {
  function loadVisible() {
    $('.lazy').each(function () {
      const $img = $(this);
      if ($img.attr('src')) return;
      if ($(window).scrollTop() + $(window).height() + 100 > $img.offset().top) {
        $img.attr('src', $img.data('src')).hide().fadeIn(500);
      }
    });
  }
  $(window).on('scroll resize', loadVisible);
  loadVisible();
});

// === Live Search + Suggestions ===
$(function () {
  const games = [];
  $('.game-box h2').each(function () {
    games.push($(this).text());
  });

  $('#liveSearch').on('input', function () {
    const val = $(this).val().toLowerCase();
    $('.game-box').each(function () {
      const title = $(this).find('h2').text().toLowerCase();
      $(this).toggle(title.includes(val));
    });

    const $sug = $('#suggestions');
    $sug.empty();
    if (!val) return $sug.hide();
    const matches = games.filter(t => t.toLowerCase().includes(val)).slice(0, 5);
    matches.forEach(m => $sug.append(`<div class="suggest-item">${m}</div>`));
    $sug.show();
  });

  $('#suggestions').on('click', '.suggest-item', function () {
    $('#liveSearch').val($(this).text()).trigger('input');
    $('#suggestions').empty().hide();
  });
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

  // Включение/выключение режима по кнопке
  $('#highlightBtn').on('click', function () {
    highlightOn = !highlightOn;
    $(this).toggleClass('active', highlightOn)
           .text(highlightOn ? 'Highlight' : 'Highlight');
    if (!highlightOn) {
      clearHighlight();            // выключили — убрали подсветку
    } else {
      doHighlight($('#liveSearch').val().trim()); // включили — подсветили текущее
    }
  });

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



$(function () {
  // Функция для показа уведомлений (Toast)
  function showToast(msg) {
    if ($('#toast-container').length === 0) {
      $('body').append('<div id="toast-container"></div>');
    }
    const $t = $('<div class="toast-item"></div>').text(msg);
    $('#toast-container').append($t);
    $t.fadeIn(200).delay(1500).fadeOut(400, () => $t.remove());
  }

  // Обработчик для кнопки Copy
  $('.copy-btn').on('click', function () {
    const text = $($(this).data('target')).text(); // Копируем текст из указанного элемента (например, описание игры)
    navigator.clipboard.writeText(text);  // Копируем в буфер обмена
    showToast('Описание скопировано!');   // Показать уведомление
  });

  // Обработчик для отправки формы с добавлением спиннера
  $('form.with-spinner').on('submit', function (e) {
    e.preventDefault();  // Отменить стандартное поведение формы
    const $btn = $(this).find('button');  // Находим кнопку формы
    const orig = $btn.html();  // Сохраняем исходный текст на кнопке
    $btn.prop('disabled', true).html('⏳ Please wait...');  // Делаем кнопку неактивной и меняем текст

    // Эмуляция задержки, например, для валидации
    setTimeout(() => {
      $btn.prop('disabled', false).html(orig);  // Восстанавливаем кнопку
      showToast('Форма отправлена!');  // Показываем уведомление
    }, 1200);
  });
});
// === Scroll Progress Bar ===
$(function () {
  if (!$('#progressBar').length)
    $('body').append('<div id="progressBar"></div>');
  
  $(window).on('scroll', function () {
    const s = $(window).scrollTop();
    const h = $(document).height() - $(window).height();
    $('#progressBar').css('width', (s / h * 100) + '%');
  });
});

// === Animated Counter ===
$(function () {
  function startCounters() {
    $('.countup').each(function () {
      const $el = $(this);
      if ($el.data('started')) return;
      if ($(window).scrollTop() + $(window).height() > $el.offset().top) {
        $el.data('started', true);
        $({ n: 0 }).animate({ n: $el.data('count') }, {
          duration: 2000,
          step: function (v) { $el.text(Math.floor(v)); },
          complete: function () { $el.text($el.data('count')); }
        });
      }
    });
  }
  $(window).on('scroll', startCounters);
  startCounters();
});
$(function () {
  const games = [];
  
  // Заполняем массив названиями игр
  $('.game-box h2').each(function () {
    games.push($(this).text());
  });

  // Логируем массив игр
  console.log('Games:', games);

  // Обработчик ввода в поле поиска
  $('#liveSearch').on('input', function () {
    const val = $(this).val().toLowerCase();  // Получаем текст из поля поиска
    const $sug = $('#suggestions');
    console.log('Input value:', val);  // Логируем введённый текст

    // Очистка старых подсказок
    $sug.empty();

    // Если поле пустое — скрываем подсказки
    if (!val) {
      $sug.hide();
      return;
    }

    // Фильтруем совпадения
    const matches = games.filter(t => t.toLowerCase().includes(val)).slice(0, 5);
    console.log('Matches found:', matches); // Логируем найденные совпадения

    // Если есть совпадения, показываем их
    if (matches.length > 0) {
      matches.forEach(m => $sug.append(`<div class="suggest-item">${m}</div>`));  // Добавляем каждую подсказку
      $sug.show();  // Показываем подсказки
    } else {
      $sug.hide();  // Если нет совпадений — скрываем подсказки
    }
  });

  // При клике на подсказку вставляем её в поле поиска
  $('#suggestions').on('click', '.suggest-item', function () {
    $('#liveSearch').val($(this).text()).trigger('input');
    $('#suggestions').empty().hide();  // Очищаем и скрываем подсказки
  });
});
// ===================== Autocomplete Suggestions =====================
$(function () {
  const $searchInput = $('#liveSearch');
  const $suggestions = $('#suggestions');

  $searchInput.on('keyup', function () {
    const text = $(this).val().toLowerCase();
    if (!text) {
      $suggestions.empty().hide();
      return;
    }

    const items = $('.game-box').map(function () {
      return $(this).find('h2, h3').text();
    }).get();

    const filterList = items.filter(item => item.toLowerCase().includes(text));

    $suggestions.empty().show();
    filterList.forEach(item => {
      $suggestions.append(`<li class="suggest-item">${item}</li>`);
    });
  });

  $(document).on('click', '.suggest-item', function () {
    $searchInput.val($(this).text());
    $suggestions.empty().hide();
  });
});
// ===================== Scroll Progress Bar =====================
$(window).on('scroll', function () {
  const scrollTop = $(window).scrollTop();
  const docHeight = $(document).height() - $(window).height();
  const progress = (scrollTop / docHeight) * 100;
  $('#scrollProgress').css('width', progress + '%');
});
// ===================== Counter Animation =====================
$(document).ready(function () {
  $('.counter').each(function () {
    const $this = $(this);
    const countTo = parseInt($this.attr('data-count'));
    $({ value: 0 }).animate({
      value: countTo
    }, {
      duration: 1800,
      easing: 'swing',
      step: function () {
        $this.text(Math.floor(this.value));
      },
      complete: function () {
        $this.text(countTo);
      }
    });
  });
});







// ===================== SEARCH HISTORY =====================
$(function () {
  const KEY = 'searchHistory';
  const $input = $('#liveSearch');
  const $history = $('#searchHistory');
  const $btn = $('#searchBtn');

  // 1. читаем историю
  function getHistory() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  }

  // 2. сохраняем запрос
  function saveToHistory(q) {
    q = q.trim();
    if (!q) return;
    let arr = getHistory();

    // убираем дубликат
    arr = arr.filter(item => item !== q);
    // добавляем в начало
    arr.unshift(q);
    // максимум 6
    if (arr.length > 6) arr.pop();

    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  // 3. показываем список
  function renderHistory() {
    const arr = getHistory();
    // если пусто — покажем "история пуста", чтобы ты видел, что оно РИСУЕТСЯ
    if (arr.length === 0) {
      $history.html('<div class="history-item" style="opacity:.6;">История пуста</div>').show();
      return;
    }

    let html = '';
    arr.forEach(item => {
      html += `<div class="history-item">${item}</div>`;
    });
    html += `<div class="clear-history">Очистить историю ✖</div>`;
    $history.html(html).show();
  }

  // 4. показать при фокусе
  $input.on('focus', function () {
    renderHistory();
  });

  // 5. скрыть при потере фокуса (чуть позже, чтобы можно было кликнуть)
  $input.on('blur', function () {
    setTimeout(() => $history.hide(), 150);
  });

  // 6. при клике на элемент истории — вставляем в инпут
  $(document).on('click', '.history-item', function () {
    const text = $(this).text();
    if (text === 'История пуста') return;
    $input.val(text).trigger('input');
    $history.hide();
  });

  // 7. очистка
  $(document).on('click', '.clear-history', function () {
    localStorage.removeItem(KEY);
    $history.hide();
  });

  // 8. сохраняем при клике на кнопку поиска
  if ($btn.length) {
    $btn.on('click', function () {
      const q = $input.val();
      saveToHistory(q);
    });
  }

  // 9. сохраняем при Enter
  $input.on('keypress', function (e) {
    if (e.which === 13) {
      const q = $input.val();
      saveToHistory(q);
    }
  });

  // 10. для отладки — покажем в консоли
  console.log('Search history loaded:', getHistory());
});


