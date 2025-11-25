(function(){
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearEl = document.getElementById('year');
  const copyEmailBtn = document.getElementById('copy-email');
  const formMsg = document.getElementById('form-msg');

  // Current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // Smooth scroll for nav links (and close mobile nav)
  // This version accounts for the sticky header height so headings aren't hidden.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // header height from CSS variable or fallback
      const rootStyles = getComputedStyle(document.documentElement);
      const headerH = parseInt(rootStyles.getPropertyValue('--site-header-height')) || 72;

      const rect = target.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - headerH - 12; // extra spacing

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });

      // close mobile nav if open
      if (nav && nav.classList.contains('open')) nav.classList.remove('open');
    });
  });

  // Highlight current section while scrolling
  function onScroll() {
    const scrollPos = window.scrollY + 120;
    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', onScroll);

  // Scroll to hash on load (account for header)
  window.addEventListener('DOMContentLoaded', () => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        const rootStyles = getComputedStyle(document.documentElement);
        const headerH = parseInt(rootStyles.getPropertyValue('--site-header-height')) || 72;
        const rect = el.getBoundingClientRect();
        window.scrollTo({
          top: Math.max(0, window.scrollY + rect.top - headerH - 12),
          behavior: 'smooth'
        });
      }
    }
  });

  // Copy email button
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('adityapotini@gmail.com');
        if (formMsg) {
          formMsg.textContent = 'Email copied!';
          setTimeout(() => formMsg.textContent = '', 2500);
        }
      } catch {
        if (formMsg) formMsg.textContent = 'Copy failed. Please copy manually.';
      }
    });
  }

  // -----------------------------
  // Skills animation (IntersectionObserver)
  // -----------------------------
  const skills = Array.from(document.querySelectorAll('.skills-grid.revamp .skill'));

  if (skills.length > 0) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        animateSkill(el);
        obs.unobserve(el);
      });
    }, { threshold: 0.35 });

    skills.forEach(s => io.observe(s));
  }

  function animateSkill(skillEl){
    const percent = parseInt(skillEl.dataset.percent || '0', 10);
    const fill = skillEl.querySelector('.bar-fill');
    const valueNode = skillEl.querySelector('.skill-value');
    const progressWrap = skillEl.querySelector('.bar-wrap');

    // Update ARIA for screen readers
    if (progressWrap) {
      progressWrap.setAttribute('aria-valuenow', percent);
    }

    // animate bar width using CSS transition
    requestAnimationFrame(() => {
      if (fill) fill.style.width = percent + '%';
    });

    // animated numeric counter
    if (valueNode) {
      const duration = 900;
      const start = performance.now();
      function step(now){
        const elapsed = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3); // easeOutCubic
        const current = Math.round((percent) * eased);
        valueNode.textContent = current + '%';
        if (elapsed < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  // allow keyboard users to trigger animation on focus
  document.querySelectorAll('.skills-grid.revamp .skill').forEach(el => {
    el.addEventListener('focus', () => {
      const fill = el.querySelector('.bar-fill');
      if (fill && (fill.style.width === '' || fill.style.width === '0%')) {
        animateSkill(el);
      }
    });
  });

})();
