export function initHero() {
  const trigger = document.querySelector('[data-infographic="trigger"]');
  const fullscreen = document.querySelector('[data-infographic="overlay"]');
  const closeBtn = document.querySelector('[data-infographic="close"]');
  const backdrop = document.querySelector('[data-infographic="backdrop"]');
  if (!trigger || !fullscreen) return;

  function openFullscreen() {
    fullscreen.hidden = false;
    fullscreen.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeFullscreen() {
    fullscreen.classList.remove('is-open');
    document.body.style.overflow = '';
    fullscreen.addEventListener('transitionend', function onEnd() {
      fullscreen.removeEventListener('transitionend', onEnd);
      fullscreen.hidden = true;
    }, { once: true });
  }

  trigger.addEventListener('click', openFullscreen);
  closeBtn?.addEventListener('click', closeFullscreen);
  backdrop?.addEventListener('click', closeFullscreen);
  fullscreen.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFullscreen();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreen.classList.contains('is-open')) closeFullscreen();
  });
}
