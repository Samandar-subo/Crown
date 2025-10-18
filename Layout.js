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




