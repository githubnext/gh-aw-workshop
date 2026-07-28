'use strict';

// Generate the single-page workshop reader HTML.
function generatePage(htmlContent, workshopMenu) {
  return `<!DOCTYPE html>
<html lang="en" data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0d1117" media="(prefers-color-scheme: dark)">
  <title>GitHub Agentic Workflows Workshop</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="mona-sans.css">
  <link rel="stylesheet" href="primer.css">
  <link rel="stylesheet" href="alerts.css">
  <link rel="stylesheet" href="hljs.css">
  <link rel="stylesheet" href="docs.css">
  <script src="docs-theme.js"></script>
  <script src="docs-copy-code.js" defer></script>
  <script src="docs-checkboxes.js" defer></script>
</head>
<body>
  <header class="site-header">
    <button class="menu-toggle" type="button" aria-label="Open workshop pages" aria-controls="workshop-menu" title="Open workshop pages">
      <span class="menu-icon" aria-hidden="true"></span>
    </button>
    <h1 class="site-title"><a href="#00-welcome">GitHub Agentic Workflows Workshop</a></h1>
  </header>
  <dialog class="workshop-menu" id="workshop-menu" aria-labelledby="workshop-menu-title">
    <div class="workshop-menu-panel">
      <header class="workshop-menu-header">
        <h2 id="workshop-menu-title">Workshop pages</h2>
        <button class="menu-close" type="button" aria-label="Close workshop pages" title="Close workshop pages">&times;</button>
      </header>
      <nav class="workshop-menu-nav" aria-label="All workshop pages">
${workshopMenu}
      </nav>
      <footer class="workshop-menu-footer">
        <div class="workshop-menu-controls">
          <div class="workshop-theme-chooser" role="group" aria-label="Color theme">
            <button type="button" class="workshop-theme-btn" data-theme="light">Light</button>
            <button type="button" class="workshop-theme-btn" data-theme="auto">System</button>
            <button type="button" class="workshop-theme-btn" data-theme="dark">Dark</button>
          </div>
          <button type="button" class="workshop-progress-reset-btn" data-clear-workshop-progress>Clear checkmark progress</button>
        </div>
      </footer>
    </div>
  </dialog>
  <dialog class="image-inspector" id="image-inspector" aria-labelledby="image-inspector-title">
    <div class="image-inspector-panel">
      <button class="image-inspector-close" type="button" aria-label="Close image preview" title="Close image preview">Close</button>
      <figure class="image-inspector-figure">
        <img class="image-inspector-image" id="image-inspector-image" alt="Image preview">
        <figcaption class="image-inspector-caption" id="image-inspector-title" hidden></figcaption>
      </figure>
    </div>
  </dialog>
  <main class="container-xl px-3 py-5 markdown-body">
${htmlContent}</main>
  <footer class="container-xl px-3 py-3" style="border-top:1px solid var(--color-border-default,#d0d7de);margin-top:2rem;text-align:center">
    <sub><a href="https://github.com/githubnext/gh-aw-workshop" target="_blank" rel="noopener noreferrer">gh-aw-workshop</a> &mdash; made by github</sub>
  </footer>
  <script>
    const workshopPages = Array.from(document.querySelectorAll('.markdown-body > details'));
    const menuDialog = document.getElementById('workshop-menu');
    const imageInspectorDialog = document.getElementById('image-inspector');
    const imageInspectorImage = document.getElementById('image-inspector-image');
    const imageInspectorCaption = document.getElementById('image-inspector-title');
    const menuLinks = Array.from(document.querySelectorAll('[data-workshop-page-link]'));
    const previewableImages = Array.from(document.querySelectorAll('.markdown-body img'));

    function updateImageInspectorCaption(text) {
      if (text) {
        imageInspectorCaption.textContent = text;
        imageInspectorCaption.hidden = false;
      } else {
        imageInspectorCaption.textContent = '';
        imageInspectorCaption.hidden = true;
      }
    }

    function isPreviewableImageCandidate(img) {
      return !img.closest('a[href]') && (img.getAttribute('alt') || '').trim().length > 0;
    }

    function markImagePreviewable(img) {
      // Only enable previews for images that finished loading successfully.
      if (!img.complete || img.naturalWidth === 0) return;
      if (!isPreviewableImageCandidate(img)) return;
      img.setAttribute('data-image-inspector-ready', '');
      img.setAttribute('tabindex', '0');
      const altText = (img.getAttribute('alt') || '').trim();
      img.setAttribute(
        'aria-label',
        altText ? altText + ' (open image preview)' : 'Open image preview'
      );
    }

    function preparePreviewableImages() {
      previewableImages.forEach(function (img) {
        if (!isPreviewableImageCandidate(img)) return;
        markImagePreviewable(img);
        if (!img.hasAttribute('data-image-inspector-ready')) {
          img.addEventListener('load', function () {
            markImagePreviewable(img);
          }, { once: true });
        }
      });
    }

    function closeImageInspector() {
      imageInspectorDialog.close();
    }

    function openImageInspector(img) {
      if (!img || !img.hasAttribute('data-image-inspector-ready')) return;
      const src = img.currentSrc || img.getAttribute('src');
      if (!src) return;
      const altText = (img.getAttribute('alt') || '').trim();
      imageInspectorImage.setAttribute('src', src);
      imageInspectorImage.setAttribute('alt', altText);
      updateImageInspectorCaption(altText);
      imageInspectorDialog.showModal();
    }

    function showWorkshopPage(target, scrollPage) {
      const page = target?.matches('.markdown-body > details')
        ? target
        : target?.closest('.markdown-body > details');
      const activePage = page ?? workshopPages[0];
      if (!activePage) return;

      const currentPage = workshopPages.find(p => p.open);
      const currentIndex = currentPage ? workshopPages.indexOf(currentPage) : -1;
      const nextIndex = workshopPages.indexOf(activePage);
      const isBackward = currentIndex >= 0 && nextIndex >= 0 && currentIndex > nextIndex;
      document.documentElement.toggleAttribute('data-nav-backward', isBackward);

      function applyPageChange() {
        workshopPages.forEach(candidate => {
          candidate.open = candidate === activePage;
        });
        menuLinks.forEach(link => {
          const isActive = link.getAttribute('href') === '#' + activePage.id;
          if (isActive) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
        if (scrollPage) activePage.scrollIntoView({ block: 'start' });
      }

      if (document.startViewTransition && currentPage && currentPage !== activePage) {
        document.startViewTransition(applyPageChange);
      } else {
        applyPageChange();
      }
    }

    function openDetailsAncestors(target) {
      const detailsInPath = [];
      let current = target;
      while (current) {
        if (current.matches && current.matches('details')) {
          detailsInPath.push(current);
        }
        current = current.parentElement;
      }
      detailsInPath.reverse().forEach(detail => {
        detail.open = true;
      });
    }

    function findHashTarget(id) {
      const activePage = workshopPages.find(candidate => candidate.open);
      if (activePage?.id === id) return activePage;

      const localTarget = activePage
        ? Array.from(activePage.querySelectorAll('[id]')).find(candidate => candidate.id === id)
        : null;
      return localTarget ?? document.getElementById(id);
    }

    function showWorkshopPageForHash(scrollPage) {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id ? findHashTarget(id) : null;
      if (!target) {
        showWorkshopPage(target, false);
        return;
      }

      openDetailsAncestors(target);
      const isPageTarget = target.matches('.markdown-body > details');
      showWorkshopPage(target, scrollPage && isPageTarget);
      if (scrollPage && !isPageTarget) {
        target.scrollIntoView({ block: 'start' });
      }
    }

    document.addEventListener('click', function (e) {
      if (e.target.closest('.menu-toggle')) {
        menuDialog.showModal();
        requestAnimationFrame(function () {
          menuDialog.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'center' });
        });
        return;
      }
      if (e.target.closest('.menu-close')) {
        menuDialog.close();
        return;
      }
      if (e.target.closest('.image-inspector-close')) {
        closeImageInspector();
        return;
      }

      if (e.target.closest('.markdown-body > details > summary')) {
        e.preventDefault();
        return;
      }

      const clickedImage = e.target.closest('img[data-image-inspector-ready]');
      if (clickedImage) {
        e.preventDefault();
        openImageInspector(clickedImage);
        return;
      }

      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      if (!id) return;
      const target = findHashTarget(id);
      if (target) {
        if (menuDialog.open) menuDialog.close();
        const isPage = target.matches('.markdown-body > details');
        history.pushState(null, '', link.getAttribute('href'));
        openDetailsAncestors(target);
        showWorkshopPage(target, isPage);
        if (!isPage) target.scrollIntoView({ block: 'start' });
      }
    });

    menuDialog.addEventListener('click', function (e) {
      if (e.target === menuDialog) menuDialog.close();
    });
    imageInspectorDialog.addEventListener('click', function (e) {
      if (e.target === imageInspectorDialog) closeImageInspector();
    });
    imageInspectorDialog.addEventListener('close', function () {
      imageInspectorImage.removeAttribute('src');
      imageInspectorImage.setAttribute('alt', 'Image preview');
      updateImageInspectorCaption('');
    });

    document.addEventListener('keydown', function (e) {
      let previewImage = null;
      if (e.target.matches('img[data-image-inspector-ready]')) {
        previewImage = e.target;
      }
      if (previewImage && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openImageInspector(previewImage);
        return;
      }
      if (e.key === 'Escape' && menuDialog.open) {
        e.preventDefault();
        menuDialog.close();
      }
    });

    window.addEventListener('hashchange', function () {
      showWorkshopPageForHash(true);
    });

    preparePreviewableImages();
    showWorkshopPageForHash(false);
  </script>
</body>
</html>
`;
}

module.exports = { generatePage };
