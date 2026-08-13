document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  initHeader();
  initMobileMenu();
  initReveal();
  initCounters();
  initTicker();
  initContactForm();
  initSmoothScroll();
  initToTop();
});

/* ---- Header scroll state + active link ---- */
function initHeader() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);

    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 130;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const close = document.getElementById('mobileClose');
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const links = menu.querySelectorAll('.mobile-link, .mobile-cta');

  toggle?.addEventListener('click', () => {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  function closeMenu() {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
  close?.addEventListener('click', closeMenu);
  links.forEach((link) => link.addEventListener('click', closeMenu));
}

/* ---- Scroll reveal ---- */
function initReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach((el) => observer.observe(el));
}

/* ---- Animated counters ---- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counters.forEach((counter) => {
          const target = parseInt(counter.dataset.count, 10);
          if (reduceMotion) { counter.textContent = target; return; }
          animateCounter(counter, target);
        });
        obs.disconnect();
      });
    },
    { threshold: 0.4 }
  );

  const statsBlock = document.querySelector('.hero-stats');
  if (statsBlock) observer.observe(statsBlock);
}

function animateCounter(el, target) {
  const duration = 1600;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

/* ---- Ticker seamless loop ---- */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (track) track.innerHTML += track.innerHTML;
}

/* ---- Contact form -> WhatsApp ---- */
const WHATSAPP_NUMBERS = ['237675864792', '237655914465', '237693512174'];

const SERVICE_LABELS = {
  maintenance: 'Maintenance Industrielle',
  mecanique: 'Mécanique de Fabrication',
  charpente: 'Charpente Métallique',
  rebobinage: 'Rebobinage Industrielle',
  froid: 'Froid & Climatisation',
  genie: 'Génie Civil',
  telecom: 'Télécom',
  fourniture: 'Fourniture de Matériels et Équipements',
  agricole: 'Travaux Agricoles',
};

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();
    const serviceLabel = SERVICE_LABELS[service] || 'Non précisé';

    const text = [
      'Bonjour SSPIT,',
      '',
      `*Nom:* ${name}`,
      `*Email:* ${email}`,
      `*Service:* ${serviceLabel}`,
      '',
      '*Message:*',
      message,
    ].join('\n');

    const phone = WHATSAPP_NUMBERS[Math.floor(Math.random() * WHATSAPP_NUMBERS.length)];
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });
}

/* ---- Smooth scroll for anchor links ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ---- Back to top ---- */
function initToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 700);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
