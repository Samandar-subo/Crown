// === Загружаем звуки ===
const clickSound = new Audio('audio/sound_click.mp3');       // для кнопок и ссылок
const keySound = new Audio('audio/sound_keyboard.mp3');      // для клавиш
const transitionSound = new Audio('audio/sound_transition.mp3'); // для смены темы

// === Получаем все элементы ===
const buttons = document.querySelectorAll('button');
const links = document.querySelectorAll('a');
const themeToggleBtn = document.getElementById('themeToggleBtn'); // кнопка темы

// === Универсальная функция для проигрывания звука ===
function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

// === Звук для обычных кнопок ===
buttons.forEach(button => {
  // исключаем кнопку темы
  if (button !== themeToggleBtn) {
    button.addEventListener('click', () => playSound(clickSound));
  }
});

// === Звук для всех ссылок ===
links.forEach(link => {
  link.addEventListener('click', () => playSound(clickSound));
});

// === Звук клавиатуры (только буквы, цифры, пробел, backspace) ===
document.addEventListener('keydown', (event) => {
  const allowedKeys = ['Backspace', ' '];
  if (/^[a-zA-Z0-9а-яА-Я]$/.test(event.key) || allowedKeys.includes(event.key)) {
    playSound(keySound);
  }
});

// === Звук при смене темы ===
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    playSound(transitionSound);
  });
}
