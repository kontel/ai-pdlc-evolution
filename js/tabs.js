export function initTabs() {
  document.querySelectorAll('.tabs').forEach((tabGroup) => {
    tabGroup.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        const scope = tabGroup.parentElement;
        tabGroup.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        scope.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = scope.querySelector(`[data-panel="${tab}"]`) ?? document.getElementById('tab-' + tab);
        panel?.classList.add('active');
      });
    });
  });
}
