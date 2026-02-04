// registr2.js
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const repeatPasswordInput = document.getElementById('repeatPassword');
    
    const emailError = document.getElementById('emailError');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const repeatPasswordError = document.getElementById('repeatPasswordError');

    // Функция показа уведомления
    function showNotification(message, isError = false, isSuccess = false) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        
        if (isError) {
            notification.className = 'notification-visible notification-error';
        } else if (isSuccess) {
            notification.className = 'notification-visible notification-success';
        } else {
            notification.className = 'notification-visible';
        }
        
        setTimeout(() => {
            notification.className = 'notification-hidden';
        }, 4000);
    }

    // Функция показа ошибки поля
    function showFieldError(field, message) {
        const errorElements = {
            'email': emailError,
            'username': usernameError,
            'password': passwordError,
            'repeatPassword': repeatPasswordError
        };
        
        const inputElements = {
            'email': emailInput,
            'username': usernameInput,
            'password': passwordInput,
            'repeatPassword': repeatPasswordInput
        };

        const errorElement = errorElements[field];
        const inputElement = inputElements[field];
        
        if (errorElement && inputElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            inputElement.classList.add('error');
        }
    }

    // Валидация email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Валидация имени пользователя
    function validateUsername(username) {
        return username.length >= 3 && username.length <= 20;
    }

    // Валидация пароля
    function validatePassword(password) {
        return password.length >= 6;
    }

    // Функция для проверки совпадения паролей в реальном времени
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;
        
        if (password && repeatPassword && password !== repeatPassword) {
            showFieldError('password', 'Пароли не совпадают');
            showFieldError('repeatPassword', 'Пароли не совпадают');
        } else if (password && repeatPassword && password === repeatPassword) {
            // Сбрасываем ошибки если пароли совпадают
            passwordError.classList.remove('show');
            passwordInput.classList.remove('error');
            repeatPasswordError.classList.remove('show');
            repeatPasswordInput.classList.remove('error');
        }
    }

    // Обработчик изменения пароля
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length > 0 && password.length < 6) {
            showFieldError('password', 'Пароль должен содержать минимум 6 символов');
        } else {
            passwordError.classList.remove('show');
            passwordInput.classList.remove('error');
            // Проверяем совпадение паролей
            checkPasswordMatch();
        }
    });

    repeatPasswordInput.addEventListener('input', function() {
        checkPasswordMatch();
    });

    if (registrationForm) {
        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Сбрасываем ошибки
            [emailError, usernameError, passwordError, repeatPasswordError].forEach(error => {
                error.classList.remove('show');
            });
            [emailInput, usernameInput, passwordInput, repeatPasswordInput].forEach(input => {
                input.classList.remove('error');
            });

            const email = emailInput.value.trim();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const repeatPassword = repeatPasswordInput.value.trim();

            let hasErrors = false;

            // Валидация email
            if (!email) {
                showFieldError('email', 'Введите email');
                emailInput.focus();
                hasErrors = true;
                return;
            }

            if (!validateEmail(email)) {
                showFieldError('email', 'Введите корректный email');
                emailInput.focus();
                hasErrors = true;
                return;
            }

            // Валидация имени пользователя
            if (!username) {
                showFieldError('username', 'Введите имя пользователя');
                if (!hasErrors) usernameInput.focus();
                hasErrors = true;
                return;
            }

            if (!validateUsername(username)) {
                showFieldError('username', 'Имя пользователя должно быть от 3 до 20 символов');
                if (!hasErrors) usernameInput.focus();
                hasErrors = true;
                return;
            }

            // Валидация пароля
            if (!password) {
                showFieldError('password', 'Введите пароль');
                if (!hasErrors) passwordInput.focus();
                hasErrors = true;
                return;
            }

            if (!validatePassword(password)) {
                showFieldError('password', 'Пароль должен содержать минимум 6 символов');
                if (!hasErrors) passwordInput.focus();
                hasErrors = true;
                return;
            }

            // Проверка совпадения паролей
            if (!repeatPassword) {
                showFieldError('repeatPassword', 'Повторите пароль');
                if (!hasErrors) repeatPasswordInput.focus();
                hasErrors = true;
                return;
            }

            if (password !== repeatPassword) {
                // Подсвечиваем оба поля пароля
                showFieldError('password', 'Пароли не совпадают');
                showFieldError('repeatPassword', 'Пароли не совпадают');
                showNotification('Пароли не совпадают! Проверьте введенные данные.', true);
                if (!hasErrors) repeatPasswordInput.focus();
                hasErrors = true;
                return;
            }

            // Проверка существующего пользователя
            if (localStorage.getItem(email)) {
                showFieldError('email', 'Пользователь с таким email уже существует');
                showNotification('Пользователь с таким email уже зарегистрирован!', true);
                emailInput.focus();
                return;
            }

            // Регистрация пользователя
            const userData = {
                email: email,
                username: username,
                password: password
            };

            localStorage.setItem(email, JSON.stringify(userData));
            
            showNotification('Регистрация прошла успешно! Перенаправление на страницу входа...', false, true);
            
            // Задержка для показа уведомления и перенаправление
            setTimeout(() => {
                registrationForm.reset();
                window.location.href = "registr.html";
            }, 2000);
        });
    }

    // Обработчики для сброса ошибок при вводе
    emailInput.addEventListener('input', () => {
        emailError.classList.remove('show');
        emailInput.classList.remove('error');
    });

    usernameInput.addEventListener('input', () => {
        usernameError.classList.remove('show');
        usernameInput.classList.remove('error');
    });

    // Инициализация прогресс-бара
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progressBar = document.getElementById('scrollProgress');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });
});