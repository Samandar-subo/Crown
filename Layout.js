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


