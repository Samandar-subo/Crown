// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");
const galleryItems = document.querySelectorAll(".gallery-item img");

let currentIndex = 0;

galleryItems.forEach((img, index) => {
  img.addEventListener("click", () => {
    lightbox.style.display = "block";
    lightboxImg.src = img.src;
    currentIndex = index;
  });
});

closeBtn.onclick = () => { lightbox.style.display = "none"; };
function changeSlide(n) {
  currentIndex += n;
  if (currentIndex < 0) currentIndex = galleryItems.length - 1;
  if (currentIndex >= galleryItems.length) currentIndex = 0;
  lightboxImg.src = galleryItems[currentIndex].src;
}

// Фильтрация
function filterGallery(genre) {
  const items = document.querySelectorAll('.gallery-item');
  const buttons = document.querySelectorAll('.filter-buttons button');
  buttons.forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  items.forEach(item => {
    if (genre === 'all' || item.dataset.genre === genre) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}


// Кнопка "Наверх"
const toTop = document.getElementById("toTop");
window.onscroll = () => {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    toTop.style.display = "block";
  } else {
    toTop.style.display = "none";
  }
};
toTop.onclick = () => { window.scrollTo({top:0, behavior:"smooth"}); };