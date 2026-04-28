const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('menu-open', !expanded);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
    });
  });
}

const ensureLoopableSlides = (carousel) => {
  const wrapper = carousel.querySelector('.swiper-wrapper');

  if (!wrapper) {
    return;
  }

  Array.from(wrapper.children)
    .filter((slide) => slide.hasAttribute('data-swiper-extra-clone'))
    .forEach((slide) => slide.remove());

  const slides = Array.from(wrapper.children);
  const desktopCount = Number(carousel.dataset.visibleDesktop || 3);
  const minimumSlides = Math.max(desktopCount * 2, 6);

  if (slides.length >= minimumSlides) {
    return;
  }

  let index = 0;

  while (wrapper.children.length < minimumSlides) {
    const clone = slides[index % slides.length].cloneNode(true);
    clone.setAttribute('data-swiper-extra-clone', 'true');
    wrapper.appendChild(clone);
    index += 1;
  }
};

const initCarousel = (name) => {
  const carousel = document.querySelector(`[data-carousel="${name}"]`);

  if (!carousel || typeof Swiper === 'undefined') {
    return;
  }

  ensureLoopableSlides(carousel);

  const mobile = Number(carousel.dataset.visibleMobile || 1);
  const tablet = Number(carousel.dataset.visibleTablet || 2);
  const desktop = Number(carousel.dataset.visibleDesktop || 3);

  new Swiper(carousel, {
    loop: true,
    speed: 700,
    spaceBetween: 18,
    grabCursor: true,
    allowTouchMove: true,
    watchOverflow: true,
    slidesPerView: mobile,
    loopAdditionalSlides: desktop + 3,
    autoplay: {
      delay: 2600,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      prevEl: `[data-carousel-prev="${name}"]`,
      nextEl: `[data-carousel-next="${name}"]`,
    },
    breakpoints: {
      641: {
        slidesPerView: tablet,
      },
      1081: {
        slidesPerView: desktop,
      },
    },
  });
};

initCarousel('arrivals');
initCarousel('bestsellers');
initCarousel('collections');

const accordion = document.querySelector('[data-accordion]');

if (accordion) {
  const items = Array.from(accordion.querySelectorAll('[data-accordion-item]'));
  const panels = Array.from(accordion.querySelectorAll('.accordion-panel'));

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      items.forEach((button) => button.classList.remove('is-active'));
      panels.forEach((panel) => panel.classList.remove('is-active'));

      item.classList.add('is-active');
      panels[index].classList.add('is-active');
    });
  });
}
