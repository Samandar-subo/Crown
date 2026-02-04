// registr.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Функция показа уведомления
    function showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = isError ? 'notification-visible notification-error' : 'notification-visible';
        
        setTimeout(() => {
            notification.className = 'notification-hidden';
        }, 4000);
    }

    // Функция показа ошибки поля
    function showFieldError(field, message) {
        const errorElement = field === 'email' ? emailError : passwordError;
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        const inputElement = field === 'email' ? emailInput : passwordInput;
        inputElement.classList.add('error');
        
        setTimeout(() => {
            errorElement.classList.remove('show');
            inputElement.classList.remove('error');
        }, 3000);
    }

    // Валидация email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Сбрасываем ошибки
            emailError.classList.remove('show');
            passwordError.classList.remove('show');
            emailInput.classList.remove('error');
            passwordInput.classList.remove('error');

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Валидация
            if (!email) {
                showFieldError('email', 'Введите email');
                emailInput.focus();
                return;
            }

            if (!validateEmail(email)) {
                showFieldError('email', 'Введите корректный email');
                emailInput.focus();
                return;
            }

            if (!password) {
                showFieldError('password', 'Введите пароль');
                passwordInput.focus();
                return;
            }

            if (password.length < 6) {
                showFieldError('password', 'Пароль должен содержать минимум 6 символов');
                passwordInput.focus();
                return;
            }

            // Проверка пользователя
            const savedUser = localStorage.getItem(email);
            if (!savedUser) {
                showFieldError('email', 'Пользователь не найден');
                showNotification('Пользователь не найден! Зарегистрируйтесь.', true);
                emailInput.focus();
                return;
            }

            const userData = JSON.parse(savedUser);

            if (userData.password === password) {
                localStorage.setItem('currentUser', JSON.stringify(userData));
                showNotification('Вход выполнен успешно! Перенаправление...');
                
                // Задержка для показа уведомления
                setTimeout(() => {
                    window.location.href = "Layout.html";
                }, 1500);
            } else {
                showFieldError('password', 'Неверный пароль');
                showNotification('Неверный пароль! Попробуйте снова.', true);
                passwordInput.focus();
                passwordInput.value = '';
            }
        });
    }

    // Обработчики для сброса ошибок при вводе
    emailInput.addEventListener('input', () => {
        emailError.classList.remove('show');
        emailInput.classList.remove('error');
    });

    passwordInput.addEventListener('input', () => {
        passwordError.classList.remove('show');
        passwordInput.classList.remove('error');
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