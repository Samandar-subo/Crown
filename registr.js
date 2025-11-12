const loginForm = document.querySelector('form[action="layout.html"]');


if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = loginForm.querySelector('#email').value.trim();
    const password = loginForm.querySelector('#password').value.trim();

    if (!email || !password) {
      alert(" Введите email и пароль!");
      return;
    }

    const savedUser = localStorage.getItem(email);
    if (!savedUser) {
      alert(" Пользователь не найден! Зарегистрируйтесь.");
      return;
    }

    const userData = JSON.parse(savedUser);

    if (userData.password === password) {
      localStorage.setItem('currentUser', JSON.stringify(userData));


      window.location.href = "layout.html";
    } else {
      alert(" Неверный пароль!");
    }
  });
}