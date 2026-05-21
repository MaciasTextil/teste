// Macias Têxtil — interações principais
(function () {
  'use strict';

  // ---------- Menu mobile ----------
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.main-nav__toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a') && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------- Header: transparente sobre o hero, opaco ao rolar ----------
  const header = document.querySelector('.site-header');
  if (header && !header.classList.contains('is-static')) {
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 60);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ---------- Scroll reveal ----------
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ---------- Marquee: pausa quando fora da viewport (perf) ----------
  const marquees = document.querySelectorAll('[data-marquee]');
  if (marquees.length && 'IntersectionObserver' in window) {
    const mio = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const track = entry.target.querySelector('.marquee__track');
        if (track) track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      }
    });
    marquees.forEach(m => mio.observe(m));
  }

  // ---------- Lightbox vanilla ----------
  const lbTriggers = document.querySelectorAll('[data-lightbox]');
  if (lbTriggers.length) {
    // agrupa por valor de data-lightbox (galeria)
    const groups = {};
    lbTriggers.forEach(el => {
      const g = el.getAttribute('data-lightbox');
      if (!groups[g]) groups[g] = [];
      groups[g].push(el);
    });

    // monta UI (uma vez)
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Visualização ampliada');
    lb.innerHTML = `
      <img class="lightbox__img" alt="">
      <button class="lightbox__btn lightbox__close" type="button" aria-label="Fechar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <button class="lightbox__btn lightbox__prev" type="button" aria-label="Anterior">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button class="lightbox__btn lightbox__next" type="button" aria-label="Próximo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="lightbox__counter" aria-live="polite"></div>
    `;
    document.body.appendChild(lb);

    const img = lb.querySelector('.lightbox__img');
    const counter = lb.querySelector('.lightbox__counter');
    const btnPrev = lb.querySelector('.lightbox__prev');
    const btnNext = lb.querySelector('.lightbox__next');
    const btnClose = lb.querySelector('.lightbox__close');

    let currentGroup = null;
    let currentIndex = 0;

    function show(group, index) {
      currentGroup = group;
      currentIndex = (index + group.length) % group.length;
      const el = group[currentIndex];
      const href = el.getAttribute('href') || el.dataset.src || el.querySelector('img')?.src;
      img.src = href;
      img.alt = el.getAttribute('aria-label') || el.querySelector('img')?.alt || '';
      counter.textContent = `${currentIndex + 1} / ${group.length}`;
      counter.style.display = group.length > 1 ? '' : 'none';
      btnPrev.style.display = group.length > 1 ? '' : 'none';
      btnNext.style.display = group.length > 1 ? '' : 'none';
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      currentGroup = null;
    }
    function nav(delta) {
      if (currentGroup) show(currentGroup, currentIndex + delta);
    }

    Object.entries(groups).forEach(([name, group]) => {
      group.forEach((el, i) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          show(group, i);
        });
      });
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => nav(-1));
    btnNext.addEventListener('click', () => nav(1));
    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') nav(-1);
      else if (e.key === 'ArrowRight') nav(1);
    });
  }
})();
