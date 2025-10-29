const regForm = document.querySelector('form[action="registr.html"]');

if (regForm) {
  regForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = regForm.querySelector('input[name="email"]').value.trim();
    const username = regForm.querySelector('input[name="name"]').value.trim();
    const passwordFields = regForm.querySelectorAll('input[name="password"]');
    const password = passwordFields[0].value.trim();
    const repeatPassword = passwordFields[1].value.trim();

    
    if (!email || !username || !password || !repeatPassword) {
      alert(" Пожалуйста, заполните все поля!");
      return;
    }
    
    if (password !== repeatPassword) {
      alert(" Пароли не совпадают!");
      return;
    }

    if (localStorage.getItem(email)) {
      alert(" Пользователь с таким email уже существует!");
      return;
    }

    const userData = {
      email: email,
      username: username,
      password: password
    };
    localStorage.setItem(email, JSON.stringify(userData));

    alert(" Регистрация прошла успешно! Теперь войдите в свой аккаунт.");

    regForm.reset();
    window.location.href = "registr.html";
  });
}


document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = event.target.email.value.trim();
  const username = event.target.name.value.trim();
  const password = event.target.password.value.trim();
  const repeatPassword = event.target['repeat-password'].value.trim();

  if (password !== repeatPassword) {
    alert("Пароли не совпадают!");
    return;
  }

  // Проверка, если пользователь с таким email уже существует
  if (localStorage.getItem(email)) {
    alert("Пользователь с таким email уже существует!");
    return;
  }

  // Сохраняем данные в localStorage
  const userData = {
    email: email,
    username: username,
    password: password
  };

  localStorage.setItem(email, JSON.stringify(userData));

  // Уведомление о успешной регистрации
  alert("Регистрация прошла успешно! Теперь войдите в свой аккаунт.");
  // Очистка формы
  event.target.reset();

  // Перенаправление на страницу логина
  window.location.href = "login.html";
});