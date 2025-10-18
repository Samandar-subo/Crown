const games = document.querySelectorAll('.game-box');

function filterGames(genre) {
  games.forEach(game => {
    if (genre === 'all' || game.dataset.genre === genre) {
      alert("Hello ")
      game.style.display = 'block';
    } else {
      game.style.display = 'none';
    }
  });
}




// меню 

const searchInput = document.querySelector('.search-box input');

searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  games.forEach(card => {
    const title = card.querySelector('h2').textContent.toLowerCase(); 
    card.style.display = title.includes(query) ? 'block' : 'none';
  });
});
