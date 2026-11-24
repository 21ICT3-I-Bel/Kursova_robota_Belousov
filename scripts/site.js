const menu = document.querySelector('#menu-button');
const nav = document.querySelector('#navigation');
const narrow = window.matchMedia('(max-width: 46rem)');

function setMenu(open) {
  nav.hidden = narrow.matches && !open;
  menu.setAttribute('aria-expanded', String(open));
}

function syncLayout() {
  menu.hidden = !narrow.matches;
  setMenu(false);
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && narrow.matches && !nav.hidden) {
    setMenu(false);
    menu.focus();
  }
});
narrow.addEventListener('change', syncLayout);
syncLayout();

const filters = document.querySelector('#filters');
if (filters) {
  const cards = [...document.querySelectorAll('[data-case]')];
  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const selected = event.target.closest('button[data-filter]');
    if (!selected) return;
    filters.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button === selected));
    });
    const category = selected.dataset.filter;
    cards.forEach((card) => {
      card.hidden = category !== 'all' && card.dataset.case !== category;
    });
  });
}

const threshold = document.querySelector('#threshold');
if (threshold) {
  const scores = [0.18, 0.61, 0.83];
  const result = document.querySelector('#decision');
  function updateDecision() {
    const limit = Number(threshold.value) / 100;
    threshold.setAttribute('aria-valuetext', limit.toFixed(2).replace('.', ','));
    const flagged = scores.map((score, index) => score >= limit ? index + 1 : null)
      .filter((index) => index !== null);
    const letters = flagged.length ? flagged.join(', ') : 'жодного';
    result.textContent = 'Поріг ' + limit.toFixed(2).replace('.', ',') +
      '. Позначено листів: ' + flagged.length + '. Номери: ' + letters + '.';
  }
  threshold.closest('.demo').hidden = false;
  threshold.addEventListener('input', updateDecision);
  updateDecision();
}

const contents = document.querySelector('#contents');
if (contents) {
  function arrangeContents() {
    contents.open = !narrow.matches;
  }
  arrangeContents();
  narrow.addEventListener('change', arrangeContents);
}
