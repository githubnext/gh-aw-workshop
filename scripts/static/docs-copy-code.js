(function () {
  function addCopyButton(pre) {
    var btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.setAttribute('title', 'Copy code');
    btn.textContent = 'Copy';

    btn.addEventListener('click', function () {
      var code = pre.querySelector('code');
      var text = code ? code.textContent : pre.textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied';
        btn.classList.add('code-copy-btn--copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('code-copy-btn--copied');
        }, 2000);
      }, function () {
        btn.textContent = 'Failed';
        setTimeout(function () {
          btn.textContent = 'Copy';
        }, 2000);
      });
    });

    pre.appendChild(btn);
  }

  function initCopyButtons() {
    var blocks = document.querySelectorAll('.markdown-body pre');
    for (var i = 0; i < blocks.length; i++) {
      addCopyButton(blocks[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }
}());
