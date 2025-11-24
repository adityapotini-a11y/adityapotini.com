(function(){
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const yearEl = document.getElementById('year');
  const copyEmailBtn = document.getElementById('copy-email');
  const formMsg = document.getElementById('form-msg');

  // Current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Smooth scroll for links
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      nav.classList.remove('open');
    });
  });

  // Highlight current section
  function onScroll() {
    const scrollPos = window.scrollY + 100;
    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section && scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll);

  // Scroll to hash on load (fix for #home etc.)
  window.addEventListener('DOMContentLoaded', () => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Copy email
  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('adityapotini@gmail.com');
      formMsg.textContent = 'Email copied!';
      setTimeout(() => formMsg.textContent = '', 2500);
    } catch {
      formMsg.textContent = 'Copy failed. Please copy manually.';
    }
  });
})();
