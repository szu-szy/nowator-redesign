const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Arm reveal animations only once JS is confirmed running (fail-safe: content
// stays visible by default via CSS; see .reveal rules in style.css).
if (!prefersReduced) {
  document.documentElement.classList.add('js-reveal');
}

// Nav scroll state
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 60);
  }, { passive: true });
}

// Mobile menu
const burger = document.getElementById('burger');
const links = document.querySelector('.nav__links');
if (burger && links) {
  burger.addEventListener('click', () => {
    links.classList.toggle('is-open');
  });
  document.querySelectorAll('.nav__links > a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('is-open'));
  });
}

// Mobile dropdown toggle (tap to expand "Oferta")
const navItem = document.querySelector('.nav__item');
if (navItem && window.matchMedia('(max-width: 860px)').matches) {
  navItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    navItem.classList.toggle('is-open');
  });
}

// Scroll reveal
if (!prefersReduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

// Stat count-up (fail-safe: markup already shows the real final number;
// this only re-animates 0 -> target once the element is confirmed on screen)
if (!prefersReduced && 'IntersectionObserver' in window) {
  const statEls = document.querySelectorAll('.stats__num[data-count]');
  const easeOutQuad = t => t * (2 - t);
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const valEl = el.querySelector('.stats__num-val');
    if (!valEl || Number.isNaN(target)) return;
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      valEl.textContent = Math.round(target * easeOutQuad(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statsIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statEls.forEach(el => statsIo.observe(el));
}

// "Nearest trip" modal - shows once per session, closable via backdrop/X/Esc/CTA
const tripModal = document.getElementById('tripModal');
if (tripModal) {
  const openModal = () => {
    tripModal.classList.add('is-open');
    tripModal.setAttribute('aria-hidden', 'false');
  };
  const closeModal = () => {
    tripModal.classList.remove('is-open');
    tripModal.setAttribute('aria-hidden', 'true');
    try { sessionStorage.setItem('nowator-trip-modal-seen', '1'); } catch (e) {}
  };
  tripModal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tripModal.classList.contains('is-open')) closeModal();
  });
  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem('nowator-trip-modal-seen') === '1'; } catch (e) {}
  if (!alreadySeen) {
    setTimeout(openModal, 1600);
  }
}
