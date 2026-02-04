// Lightbox с поддержкой фильтрации
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");
let currentVisibleItems = [];
let currentIndex = 0;

// Функция для применения темы
function applyTheme() {
    const body = document.body;
    
    // Проверяем сохранённую тему
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }
}

// Функция для получения видимых элементов
function getVisibleItems() {
    return Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"]) img'));
}

// Функция для обновления количества видимых элементов
function updateItemCount() {
    const visibleItems = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
    const galleryGrid = document.querySelector('.gallery-grid');
    galleryGrid.setAttribute('data-item-count', visibleItems.length);
}

// Открытие lightbox
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function() {
        currentVisibleItems = getVisibleItems();
        currentIndex = currentVisibleItems.indexOf(this);
        
        if (currentIndex !== -1) {
            lightbox.style.display = "block";
            lightboxImg.src = this.src;
            document.body.style.overflow = "hidden";
        }
    });
});

// Закрытие lightbox
function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
}

// Смена слайда
function changeSlide(n) {
    currentIndex += n;
    
    if (currentIndex < 0) {
        currentIndex = currentVisibleItems.length - 1;
    } else if (currentIndex >= currentVisibleItems.length) {
        currentIndex = 0;
    }
    
    lightboxImg.src = currentVisibleItems[currentIndex].src;
}

// Фильтрация галереи
function filterGallery(genre) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-buttons button');
    
    buttons.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    let visibleCount = 0;
    
    items.forEach((item, index) => {
        if (genre === 'all' || item.dataset.genre === genre) {
            item.style.display = "block";
            visibleCount++;
            setTimeout(() => {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
            }, index * 50);
        } else {
            item.style.display = "none";
            item.style.opacity = "0";
        }
    });
    
    // Обновляем счетчик видимых элементов
    updateItemCount();
}

// ===== КНОПКА "НАВЕРХ" =====
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        toTop.classList.add("show");
    } else {
        toTop.classList.remove("show");
    }
});

toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Обработчики событий
closeBtn.onclick = closeLightbox;

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Обработчики клавиатуры
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Слушаем изменения в localStorage для синхронизации темы между вкладками
window.addEventListener('storage', function(e) {
    if (e.key === 'theme') {
        applyTheme();
    }
});

// Также проверяем тему периодически
setInterval(function() {
    applyTheme();
}, 1000);

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    filterGallery('all');
    updateItemCount();
    applyTheme(); // Применяем тему при загрузке
});