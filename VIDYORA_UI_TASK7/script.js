document.addEventListener('DOMContentLoaded', () => {

  /* ===== PRELOADER ===== */
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    setTimeout(() => pre.classList.add('hide'), 400);
  });

  /* ===== HEADER SCROLL STATE ===== */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('show', window.scrollY > 500);
    updateActiveNav();
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===== MOBILE MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
  }
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    overlay.classList.toggle('show');
  });
  overlay.addEventListener('click', closeMobileMenu);
  document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMobileMenu));

  /* ===== ACTIVE NAV LINK ===== */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 140) current = sec.id; });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
  }

  /* ===== SCROLL REVEAL ===== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ===== HERO STAT COUNTERS ===== */
  const statNums = document.querySelectorAll('.stat-num');
  let countersStarted = false;
  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    statNums.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 80));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current.toLocaleString();
      }, 20);
    });
  }
  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl) {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => { if (entry.isIntersecting) { animateCounters(); obs.disconnect(); } });
    }, { threshold: 0.3 }).observe(heroStatsEl);
  }

  /* ===== COURSE TABS FILTER ===== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const courseCards = document.querySelectorAll('.course-card');
  function filterCourses(category) {
    courseCards.forEach(card => {
      card.classList.toggle('show', category === 'all' || card.getAttribute('data-category') === category);
    });
  }
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCourses(btn.getAttribute('data-tab'));
    });
  });

  /* ===== ENROLL MODAL ===== */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalEmail = document.getElementById('modalEmail');
  const modalSubmit = document.getElementById('modalSubmit');
  const modalStatus = document.getElementById('modalStatus');

  function openModal(title, text) {
    modalTitle.textContent = title || 'Begin Your VIDYORA Journey';
    modalText.textContent = text || "Enter your email and we'll help you take the next step.";
    modalStatus.textContent = '';
    modalEmail.value = '';
    modalOverlay.classList.add('show');
  }
  function closeModal() { modalOverlay.classList.remove('show'); }

  document.querySelectorAll('.explore-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseName = btn.closest('.course-card').querySelector('h3').textContent;
      openModal(`Explore ${courseName}`, "Enter your email and we'll send you the learning path.");
    });
  });
  document.getElementById('ctaNav').addEventListener('click', () => openModal());
  document.getElementById('ctaMobile').addEventListener('click', () => { closeMobileMenu(); openModal(); });
  document.getElementById('ctaHeroExplore').addEventListener('click', () => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('ctaHeroLearn').addEventListener('click', () => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('ctaAboutMore').addEventListener('click', () => openModal('Learn Our Method', "Enter your email and we'll send you our full curriculum guide."));
  document.getElementById('ctaFinal').addEventListener('click', () => openModal('Start Learning', "Enter your email and we'll guide you through your first course."));

  document.querySelectorAll('.plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.closest('.price-card').querySelector('h3').textContent;
      openModal(`Get Started with ${plan}`, "Enter your email to activate your plan.");
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  modalSubmit.addEventListener('click', () => {
    const val = modalEmail.value.trim();
    if (!val || !val.includes('@') || !val.includes('.')) {
      modalStatus.style.color = '#C0392B';
      modalStatus.textContent = 'Please enter a valid email address.';
      return;
    }
    modalStatus.style.color = '#8A7420';
    modalStatus.textContent = "You're in! Check your inbox to continue. ✓";
    setTimeout(() => { closeModal(); showToast('Welcome to VIDYORA — let’s grow together.'); }, 1200);
  });

  /* ===== TESTIMONIAL SLIDER ===== */
  const testiCards = document.querySelectorAll('.testi-card');
  const testiDotsWrap = document.getElementById('testiDots');
  let testiIndex = 0;
  testiCards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTesti(i));
    testiDotsWrap.appendChild(dot);
  });
  const dots = document.querySelectorAll('.dot');
  function goToTesti(index) {
    testiCards[testiIndex].classList.remove('active');
    dots[testiIndex].classList.remove('active');
    testiIndex = index;
    testiCards[testiIndex].classList.add('active');
    dots[testiIndex].classList.add('active');
  }
  setInterval(() => goToTesti((testiIndex + 1) % testiCards.length), 5000);

  /* ===== FAQ ACCORDION ===== */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight = null; });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ===== TOAST HELPER ===== */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ===== FOOTER YEAR ===== */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      }
    });
  });

});