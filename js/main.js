document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  initCursorGlow();
  initHeader();
  initMobileMenu();
  initServiceTabs();
  initFloatingNav();
  initCarousels();
  initCounters();
  initReveal();
  initServiceCards();
  initContactForm();
  initScrollScrews();
  initSmoothScroll();
});

/* ---- Cursor glow ---- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let raf;
  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  });
}

/* ---- Header scroll ---- */
function initHeader() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const close = document.getElementById('mobileClose');
  const menu = document.getElementById('mobileMenu');
  const links = menu.querySelectorAll('.mobile-link');

  toggle?.addEventListener('click', () => menu.classList.add('open'));
  close?.addEventListener('click', () => menu.classList.remove('open'));
  links.forEach((link) => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* ---- Service tabs with liquid indicator ---- */
function initServiceTabs() {
  const tabs = document.querySelectorAll('.service-tab');
  const panels = document.querySelectorAll('.service-panel');
  const indicator = document.getElementById('tabIndicator');
  const tabsContainer = document.getElementById('serviceTabs');

  function moveIndicator(tab) {
    if (!indicator || !tab || window.innerWidth <= 768) return;
    indicator.style.width = tab.offsetWidth + 'px';
    indicator.style.left = tab.offsetLeft + 'px';
  }

  const activeTab = tabsContainer?.querySelector('.service-tab.active');
  if (activeTab) {
    requestAnimationFrame(() => moveIndicator(activeTab));
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const service = tab.dataset.service;

      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      moveIndicator(tab);

      panels.forEach((panel) => {
        panel.classList.remove('active');
        if (panel.id === `panel-${service}`) {
          panel.classList.add('active');
          resetCarousel(panel);
        }
      });
    });
  });

  window.addEventListener('resize', () => {
    const current = tabsContainer?.querySelector('.service-tab.active');
    if (current) moveIndicator(current);
  });
}

/* ---- Floating bottom nav ---- */
function initFloatingNav() {
  const floatTabs = document.querySelectorAll('.float-tab');
  const floatIndicator = document.getElementById('floatIndicator');
  const sections = ['accueil', 'services', 'galerie', 'contact'];

  function moveFloatIndicator(tab) {
    if (!floatIndicator || !tab) return;
    floatIndicator.style.width = tab.offsetWidth + 'px';
    floatIndicator.style.left = tab.offsetLeft + 'px';
  }

  const activeFloat = document.querySelector('.float-tab.active');
  if (activeFloat) {
    requestAnimationFrame(() => moveFloatIndicator(activeFloat));
  }

  floatTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      floatTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      moveFloatIndicator(tab);
    });
  });

  window.addEventListener('scroll', () => {
    let current = 'accueil';
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 200) {
        current = id;
      }
    });

    floatTabs.forEach((tab) => {
      const isActive = tab.dataset.section === current;
      tab.classList.toggle('active', isActive);
      if (isActive) moveFloatIndicator(tab);
    });
  });

  window.addEventListener('resize', () => {
    const current = document.querySelector('.float-tab.active');
    if (current) moveFloatIndicator(current);
  });
}

/* ---- Image carousels in service panels ---- */
function initCarousels() {
  document.querySelectorAll('.service-panel').forEach((panel) => {
    startCarousel(panel);
  });
}

function startCarousel(panel) {
  const images = panel.querySelectorAll('.carousel-img');
  const dots = panel.querySelectorAll('.carousel-dots .dot');
  if (!images.length) return;

  let current = 0;
  let interval;

  function show(index) {
    images.forEach((img, i) => img.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    current = index;
  }

  function next() {
    show((current + 1) % images.length);
  }

  interval = setInterval(next, 4000);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      show(i);
      interval = setInterval(next, 4000);
    });
  });

  panel._carouselInterval = interval;
}

function resetCarousel(panel) {
  if (panel._carouselInterval) clearInterval(panel._carouselInterval);
  const images = panel.querySelectorAll('.carousel-img');
  const dots = panel.querySelectorAll('.carousel-dots .dot');
  images.forEach((img, i) => img.classList.toggle('active', i === 0));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === 0));
  startCarousel(panel);
}

/* ---- Animated counters ---- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach((counter) => {
            const target = parseInt(counter.dataset.count, 10);
            animateCounter(counter, target);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

/* ---- Scroll reveal ---- */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ---- Service cards click -> tabs ---- */
function initServiceCards() {
  const cards = document.querySelectorAll('.service-card[data-hover]');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const service = card.dataset.hover;
      const tab = document.querySelector(`.service-tab[data-service="${service}"]`);
      if (tab) {
        tab.click();
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ---- Contact form → WhatsApp ---- */
const WHATSAPP_NUMBERS = ['237675864792', '237655914465', '237693512174'];

const SERVICE_LABELS = {
  maintenance: 'Maintenance Industrielle',
  mecanique: 'Mécanique de Fabrication',
  charpente: 'Charpente Métallique',
  rebobinage: 'Rebobinage Industriel',
  froid: 'Froid & Climatisation',
  genie: 'Génie Civil',
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
      'Bonjour ETSSSPIT,',
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

/* ---- Vis qui se dévissent au scroll ---- */
function initScrollScrews() {
  const screws = [
    { el: document.getElementById('scrollScrew1'), rotate: 1, unscrew: false },
    { el: document.getElementById('scrollScrew2'), rotate: -0.8, unscrew: false },
    { el: document.getElementById('scrollScrew3'), rotate: 1.5, unscrew: true },
  ].filter((s) => s.el);

  if (!screws.length) return;

  let ticking = false;

  function update() {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollMax > 0 ? window.scrollY / scrollMax : 0;

    screws.forEach(({ el, rotate, unscrew }) => {
      const deg = progress * 1080 * rotate;
      const y = unscrew ? progress * window.innerHeight * 0.85 : 0;
      el.style.transform = unscrew
        ? `translateY(${y}px) rotate(${deg}deg)`
        : `rotate(${deg}deg)`;
    });

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}

/* ---- Smooth scroll ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
