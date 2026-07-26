(function () {
  var STORAGE_KEY = 'gh-aw-workshop-checkboxes';

  function loadAllState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return (raw && typeof raw === 'string') ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function saveAllState(all) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (_) {}
  }

  function applyItemState(li, checked) {
    var marker = li.querySelector('.task-list-item-marker');
    if (marker) {
      marker.classList.toggle('is-complete', checked);
      marker.classList.toggle('is-pending', !checked);
    }
    li.setAttribute('aria-checked', checked ? 'true' : 'false');
    // Keep the accessible label in sync with the current state
    var label = li.getAttribute('aria-label') || '';
    li.setAttribute(
      'aria-label',
      label.replace(/\((?:completed|pending)\)/, '(' + (checked ? 'completed' : 'pending') + ')')
    );
  }

  function initPage(page) {
    var pageId = page.id;
    var items = Array.from(page.querySelectorAll('li.task-list-item'));
    if (items.length === 0) return;

    var allState = loadAllState();
    var pageState = (allState[pageId] && typeof allState[pageId] === 'object') ? allState[pageId] : {};

    // Resolve initial checked state: stored value takes precedence over HTML class
    var state = items.map(function (li, i) {
      var key = String(i);
      if (typeof pageState[key] === 'boolean') return pageState[key];
      return li.querySelector('.task-list-item-marker.is-complete') !== null;
    });

    // Progress element inserted immediately after the page title heading.
    // Child elements are created once and updated on each render call.
    var progressEl = document.createElement('div');
    progressEl.className = 'task-progress';
    progressEl.setAttribute('aria-live', 'polite');

    var barEl = document.createElement('div');
    barEl.className = 'task-progress-bar';
    barEl.setAttribute('role', 'progressbar');
    barEl.setAttribute('aria-valuemin', '0');
    barEl.setAttribute('aria-label', 'Page checkpoint progress');

    var fillEl = document.createElement('div');
    fillEl.className = 'task-progress-bar-fill';
    barEl.appendChild(fillEl);

    var labelEl = document.createElement('span');
    labelEl.className = 'task-progress-label';

    progressEl.appendChild(barEl);
    progressEl.appendChild(labelEl);

    var pageTitle = page.querySelector('.workshop-page-title');
    if (pageTitle) {
      pageTitle.insertAdjacentElement('afterend', progressEl);
    }

    function renderProgress() {
      var done = state.filter(Boolean).length;
      var total = state.length;
      var allDone = total > 0 && done === total;
      var pct = total > 0 ? Math.round((done / total) * 100) : 0;

      progressEl.classList.toggle('task-progress--done', allDone);

      barEl.setAttribute('aria-valuenow', String(done));
      barEl.setAttribute('aria-valuemax', String(total));
      fillEl.style.width = pct + '%';

      labelEl.textContent = allDone
        ? 'All\u00a0' + total + ' checkpoints complete'
        : done + '\u202f/\u202f' + total + ' complete';

      // Mark the menu link for this page as complete
      var menuLink = document.querySelector('a[href="#' + pageId + '"][data-workshop-page-link]');
      if (menuLink) {
        menuLink.toggleAttribute('data-page-complete', allDone);
      }
    }

    // Wire up each item
    items.forEach(function (li, i) {
      applyItemState(li, state[i]);
      li.setAttribute('role', 'checkbox');
      li.setAttribute('tabindex', '0');

      function toggle() {
        state[i] = !state[i];
        applyItemState(li, state[i]);

        // Re-read from storage so concurrent tabs stay in sync
        var all = loadAllState();
        if (!all[pageId] || typeof all[pageId] !== 'object') all[pageId] = {};
        all[pageId][String(i)] = state[i];
        saveAllState(all);

        renderProgress();
      }

      li.addEventListener('click', toggle);
      li.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      });
    });

    renderProgress();
  }

  function init() {
    var pages = document.querySelectorAll('.markdown-body > details[id]');
    Array.prototype.forEach.call(pages, initPage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
