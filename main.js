// Mobile nav toggle
document.querySelector('.nav-mobile-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('open');
});

// Scroll to top button
document.getElementById('scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Tabs - support multiple tab groups
document.querySelectorAll('.tabs').forEach(tabGroup => {
  tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      const section = tabGroup.parentElement;
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      section.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
    });
  });
});

// Scroll progress
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progressBar').style.width = (scrollTop / docHeight) * 100 + '%';
  document.getElementById('scrollTop').classList.toggle('visible', scrollTop > 400);
});

// Fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Active nav tracking
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => { if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id'); });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

// Roadmap item toggle (event delegation)
document.querySelector('.roadmap')?.addEventListener('click', (e) => {
  const item = e.target.closest('.roadmap-item');
  if (item) item.classList.toggle('open');
});

// Animate task bars on scroll
const taskObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.task-bar').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        requestAnimationFrame(() => { requestAnimationFrame(() => { bar.style.width = w; }); });
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.task-spectrum').forEach(el => taskObserver.observe(el));
