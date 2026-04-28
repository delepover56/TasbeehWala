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

const getVisibleCount = (carousel) => {
  const mobile = Number(carousel.dataset.visibleMobile || 1);
  const tablet = Number(carousel.dataset.visibleTablet || mobile);
  const desktop = Number(carousel.dataset.visibleDesktop || tablet);

  if (window.innerWidth <= 640) {
    return mobile;
  }

  if (window.innerWidth <= 1080) {
    return tablet;
  }

  return desktop;
};

const setupInfiniteCarousel = (name) => {
  const carousel = document.querySelector(`[data-carousel="${name}"]`);

  if (!carousel) {
    return;
  }

  const track = carousel.querySelector('.carousel-track');
  const prevButton = document.querySelector(`[data-carousel-prev="${name}"]`);
  const nextButton = document.querySelector(`[data-carousel-next="${name}"]`);
  let currentIndex = 0;
  let cloneCount = 0;
  let originalCount = 0;
  let slideStep = 0;

  const getOriginalSlides = () => Array.from(track.children).filter((slide) => !slide.hasAttribute('data-clone'));

  const cloneSlide = (slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('data-clone', 'true');
    return clone;
  };

  const updateTransform = (animate = true) => {
    track.style.transition = animate ? 'transform 0.35s ease' : 'none';
    track.style.transform = `translateX(-${currentIndex * slideStep}px)`;
  };

  const rebuild = () => {
    Array.from(track.querySelectorAll('[data-clone]')).forEach((clone) => clone.remove());

    const originals = getOriginalSlides();

    if (!originals.length) {
      return;
    }

    const visibleCount = Math.min(getVisibleCount(carousel), originals.length);
    cloneCount = visibleCount;
    originalCount = originals.length;

    const leading = originals.slice(-cloneCount).map(cloneSlide);
    const trailing = originals.slice(0, cloneCount).map(cloneSlide);

    leading.forEach((slide) => track.insertBefore(slide, track.firstChild));
    trailing.forEach((slide) => track.appendChild(slide));

    const firstSlide = track.children[0];
    const gap = parseFloat(getComputedStyle(track).gap || '0');
    slideStep = firstSlide.getBoundingClientRect().width + gap;
    currentIndex = cloneCount;
    updateTransform(false);
  };

  const move = (direction) => {
    currentIndex += direction;
    updateTransform(true);
  };

  track.addEventListener('transitionend', () => {
    if (currentIndex >= originalCount + cloneCount) {
      currentIndex -= originalCount;
      updateTransform(false);
    }

    if (currentIndex < cloneCount) {
      currentIndex += originalCount;
      updateTransform(false);
    }
  });

  prevButton?.addEventListener('click', () => move(-1));
  nextButton?.addEventListener('click', () => move(1));

  let resizeTimer = null;

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(rebuild, 120);
  });

  rebuild();
};

setupInfiniteCarousel('arrivals');
setupInfiniteCarousel('bestsellers');
setupInfiniteCarousel('collections');

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
