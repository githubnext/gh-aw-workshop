(function () {
  var STORAGE_KEY = 'gh-aw-workshop-checkboxes';

  // Victory banner — shown once when a page's checkboxes all become complete.
  var victoryTimer = null;
  var victoryEl = null;

  function showVictory() {
    if (victoryTimer) {
      clearTimeout(victoryTimer);
      victoryTimer = null;
    }
    if (victoryEl && victoryEl.parentNode) {
      victoryEl.parentNode.removeChild(victoryEl);
    }

    var starsEl = document.createElement('span');
    starsEl.className = 'page-victory-stars';
    starsEl.setAttribute('aria-hidden', 'true');

    var iconEl = document.createElement('span');
    iconEl.className = 'page-victory-icon';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.textContent = '\u2726';

    var textEl = document.createElement('span');
    textEl.className = 'page-victory-text';
    textEl.textContent = 'All checkpoints complete!';

    victoryEl = document.createElement('div');
    victoryEl.className = 'page-victory';
    victoryEl.setAttribute('role', 'status');
    victoryEl.setAttribute('aria-live', 'polite');
    victoryEl.appendChild(starsEl);
    victoryEl.appendChild(iconEl);
    victoryEl.appendChild(textEl);
    document.body.appendChild(victoryEl);

    victoryTimer = setTimeout(function () {
      if (victoryEl) {
        victoryEl.classList.add('page-victory--leaving');
        setTimeout(function () {
          if (victoryEl && victoryEl.parentNode) {
            victoryEl.parentNode.removeChild(victoryEl);
            victoryEl = null;
          }
        }, 500);
      }
      victoryTimer = null;
    }, 3500);
  }

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

  function clearAllState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }

  function applyItemState(li, checked) {
    var marker = li.querySelector('.task-list-item-marker');
    if (marker) {
      marker.classList.toggle('is-complete', checked);
      marker.classList.toggle('is-pending', !checked);
      marker.textContent = checked ? '●' : '○';
    }
    li.classList.toggle('is-complete', checked);
    li.classList.toggle('is-pending', !checked);
    li.setAttribute('aria-checked', checked ? 'true' : 'false');
    // Keep the accessible label in sync with the current state
    var label = li.getAttribute('aria-label') || '';
    li.setAttribute(
      'aria-label',
      label.replace(/\((?:completed|pending)\)/, '(' + (checked ? 'completed' : 'pending') + ')')
    );
  }

  function getHeadingText(heading) {
    var clone = heading.cloneNode(true);
    var anchors = clone.querySelectorAll('a.anchor');
    Array.prototype.forEach.call(anchors, function (a) {
      if (a.parentNode) a.parentNode.removeChild(a);
    });
    return clone.textContent.trim();
  }

  function findCheckpointHeading(page) {
    var headings = page.querySelectorAll('h1, h2, h3, h4, h5, h6');
    var found = null;
    Array.prototype.some.call(headings, function (heading) {
      if (/^✅?\s*checkpoint$/i.test(getHeadingText(heading))) {
        found = heading;
        return true;
      }
      return false;
    });
    return found;
  }

  function getCheckpointItems(page) {
    var checkpointTitle = findCheckpointHeading(page);
    if (!checkpointTitle) return [];

    return Array.from(page.querySelectorAll('li.task-list-item')).filter(function (li) {
      return checkpointTitle.compareDocumentPosition(li) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
  }

  function initPage(page, controllers) {
    var pageId = page.id;
    var checkpointHeading = findCheckpointHeading(page);

    // Mark task-list items before the checkpoint heading as static (non-interactive).
    Array.from(page.querySelectorAll('li.task-list-item')).forEach(function (li) {
      if (!checkpointHeading ||
          !(checkpointHeading.compareDocumentPosition(li) & Node.DOCUMENT_POSITION_FOLLOWING)) {
        li.classList.add('is-static');
      }
    });

    var items = checkpointHeading
      ? Array.from(page.querySelectorAll('li.task-list-item')).filter(function (li) {
          return checkpointHeading.compareDocumentPosition(li) & Node.DOCUMENT_POSITION_FOLLOWING;
        })
      : [];
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

    // Menu micro-progress bar for this page
    var menuProgress = document.querySelector('[data-menu-progress="' + pageId + '"]');
    var menuFill = menuProgress ? menuProgress.querySelector('.menu-item-progress-fill') : null;
    if (menuProgress) {
      menuProgress.setAttribute('data-has-checkpoints', '');
    }

    var prevAllDone = null; // null = initial render not yet complete

    function renderProgress() {
      var done = state.filter(Boolean).length;
      var total = state.length;
      var allDone = total > 0 && done === total;
      var pct = total > 0 ? Math.round((done / total) * 100) : 0;

      // Show victory banner only when transitioning to all-done after initial load
      if (allDone && prevAllDone === false) {
        showVictory();
      }
      prevAllDone = allDone;

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

      // Update the menu micro progress bar
      if (menuFill) {
        menuFill.style.width = pct + '%';
      }
    }

    function resetPage() {
      state = state.map(function () { return false; });
      items.forEach(function (li) {
        applyItemState(li, false);
      });
      renderProgress();
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
    controllers.push({ resetPage: resetPage });
  }

  function init() {
    var controllers = [];
    var pages = document.querySelectorAll('.markdown-body > details[id]');
    Array.prototype.forEach.call(pages, function (page) {
      initPage(page, controllers);
    });

    var clearButton = document.querySelector('[data-clear-workshop-progress]');
    if (clearButton) {
      clearButton.addEventListener('click', function () {
        clearAllState();
        controllers.forEach(function (controller) {
          controller.resetPage();
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
