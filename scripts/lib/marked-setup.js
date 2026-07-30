'use strict';

const { marked } = require('marked');
const { default: GithubSlugger } = require('github-slugger');
const markedAlert = require('marked-alert');
const { markedHighlight } = require('marked-highlight');
const hljs = require('highlight.js');
const {
  flattenTokenText,
  escapeHtml,
  isExternalWebLink,
  addExternalLinkTargetAttrs,
} = require('./utils');
const { markedEmojiExtension } = require('./marked-emoji');

const defaultRenderer = new marked.Renderer();
const slugger = new GithubSlugger();

const shellLangs = new Set(['bash', 'sh', 'shell', 'zsh']);
const terminalOutputLangs = new Set(['console', 'output', 'plaintext', 'text']);

function extractCodeBlockFilename(meta = '') {
  let normalizedMeta = meta.trim();
  if (!normalizedMeta) return '';

  if (normalizedMeta.startsWith('{') && normalizedMeta.endsWith('}')) {
    normalizedMeta = normalizedMeta.slice(1, -1).trim();
  }

  const keyedFilenameMatch = normalizedMeta.match(
    /(?:^|\s)(?:file|filename|path|title)=(?:"([^"]+)"|'([^']+)'|(\S+))/
  );
  if (keyedFilenameMatch) {
    return keyedFilenameMatch[1] || keyedFilenameMatch[2] || keyedFilenameMatch[3] || '';
  }

  return /\s|=/.test(normalizedMeta) ? '' : normalizedMeta;
}

function parseCodeBlockInfo(lang = '') {
  const info = lang.trim();
  const firstTokenMatch = info.match(/^\S*/);
  const langKey = (firstTokenMatch?.[0] || '').toLowerCase();
  const meta = info.slice(firstTokenMatch?.[0]?.length || 0).trim();
  const filename = extractCodeBlockFilename(meta);

  return { langKey, filename };
}

// Register the heading anchor, task-list item, alert, syntax-highlight, and
// code-block renderer plugins.  Call this once before processing any markdown.
function setupBasePlugins() {
  // Plugin: clickable heading anchors with GitHub-compatible IDs
  marked.use({
    // Reset the slugger before each marked() call to avoid duplicate-ID drift
    hooks: {
      preprocess(src) { slugger.reset(); return src; },
    },
    useNewRenderer: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        // Extract plain text from tokens (avoids regex-based HTML stripping)
        const raw = flattenTokenText(tokens).trim();
        // slugger.slug() always returns a URL-safe [a-z0-9-] string, safe for attribute interpolation
        const id = slugger.slug(raw);
        // text is the HTML output of parseInline(), which escapes user content
        return `<h${depth} id="${id}">${text} <sub><a href="#${id}" class="anchor" aria-label="Link to this heading">#</a></sub></h${depth}>\n`;
      },
      // Plugin: render GFM task list items with GitHub-compatible CSS classes
      listitem(item) {
        if (item.task) {
          // Extract inline tokens after the checkbox token. In tight lists the
          // item tokens are [checkbox, ...inline]; in loose lists they are
          // [paragraph{ tokens: [checkbox, ...inline] }, ...].
          const inlineTokens = item.loose && item.tokens[0]?.tokens
            ? item.tokens[0].tokens.slice(1)
            : item.tokens.slice(1);
          const text = this.parser.parseInline(inlineTokens);
          const accessibleName = flattenTokenText(inlineTokens).replace(/\s+/g, ' ').trim();
          const status = item.checked ? 'completed' : 'pending';
          const markerClass = item.checked
            ? 'task-list-item-marker is-complete'
            : 'task-list-item-marker is-pending';
          const labelAttr = accessibleName
            ? ` aria-label="Checkpoint item (${status}): ${escapeHtml(accessibleName)}"`
            : ` aria-label="Checkpoint item (${status})"`;
          // Primer octicons: check-circle-fill (complete) and circle (pending), 16px
          const markerIcon = item.checked
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z"></path></svg>';
          return `<li class="task-list-item"${labelAttr}><span class="${markerClass}" aria-hidden="true">${markerIcon}</span> ${text}</li>\n`;
        }
        return false; // use default rendering for non-task items
      },
    },
  });

  // Plugin: render GitHub GFM emoji shortcodes (:rocket:, :white_check_mark:, etc.)
  marked.use({ extensions: [markedEmojiExtension()] });

  // Plugin: render GitHub GFM alert callouts (> [!NOTE], > [!TIP], etc.)
  marked.use(markedAlert());

  // Plugin: syntax-highlight fenced code blocks at build time using highlight.js
  marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      // Markdown workflow files contain YAML frontmatter + a prose brief,
      // so YAML highlighting renders them more usefully than markdown mode.
      const effectiveLang = (lang === 'markdown' || lang === 'md') ? 'yaml' : lang;
      const language = hljs.getLanguage(effectiveLang) ? effectiveLang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }));

  // Plugin: render shell, terminal output, and agent prompt code blocks with distinct UI wrappers
  marked.use({
    useNewRenderer: true,
    renderer: {
      code({ text, lang, escaped }) {
        const { langKey, filename } = parseCodeBlockInfo(lang || '');
        const codeText = text.replace(/\n$/, '') + '\n';
        const codeHtml = escaped ? codeText : escapeHtml(codeText);
        const filenameHtml = filename
          ? `<span class="code-block-filename">${escapeHtml(filename)}</span>`
          : '';
        if (langKey === 'prompt') {
          return `<div class="agent-prompt-block" role="region" aria-label="Agent prompt">\n<div class="agent-prompt-bar"><span class="agent-prompt-icon" aria-hidden="true">✦</span><span class="agent-prompt-label">Agent prompt</span>${filenameHtml}</div>\n<pre class="agent-prompt-pre"><code class="language-prompt">${codeHtml}</code></pre>\n</div>\n`;
        }
        if (langKey === 'markdown' || langKey === 'md') {
          return `<div class="markdown-editor-block" role="region" aria-label="Markdown">\n<div class="markdown-editor-bar"><span class="markdown-editor-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M14.85 3c.63 0 1.15.52 1.14 1.15v7.7c0 .63-.51 1.15-1.15 1.15H1.15C.52 13 0 12.48 0 11.84V4.15C0 3.52.52 3 1.15 3ZM9 11V5H7L5.5 7 4 5H2v6h2V8l1.5 1.92L7 8v3Zm2.99.5L14.5 8H13V5h-2v3H9.5Z"></path></svg></span>${filenameHtml}</div>\n<pre class="markdown-editor-pre"><code class="hljs language-yaml">${codeHtml}</code></pre>\n</div>\n`;
        }
        if (langKey === 'yaml' || langKey === 'yml') {
          return `<div class="yaml-editor-block" role="region" aria-label="YAML">\n<div class="yaml-editor-bar"><span class="yaml-editor-icon" aria-hidden="true">≡</span>${filenameHtml}</div>\n<pre class="yaml-editor-pre"><code class="hljs language-yaml">${codeHtml}</code></pre>\n</div>\n`;
        }
        const terminalLabel = shellLangs.has(langKey) ? langKey : terminalOutputLangs.has(langKey) ? 'output' : '';
        if (!terminalLabel) return false;
        const escapedLang = escapeHtml(langKey);
        const terminalBarAria = filename ? '' : ' aria-hidden="true"';
        return `<div class="terminal-block">\n<div class="terminal-bar"${terminalBarAria}><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-label">${terminalLabel}</span>${filenameHtml}</div>\n<pre class="terminal-pre"><code class="language-${escapedLang}">${codeHtml}</code></pre>\n</div>\n`;
      },
    },
  });
}

// Register the link-rewriting renderer plugin.  Must be called after workshop
// files have been loaded so that sectionIdsByFile is available.
function setupLinkRewriter(sectionIdsByFile) {
  marked.use({
    useNewRenderer: true,
    renderer: {
      link(link) {
        const { href } = link;
        if (href) {
          const markdownPageLink = href.match(/^(?<file>[^/?#]+\.md)(?<hash>#[^?]+)?$/);
          if (markdownPageLink) {
            const targetFile = markdownPageLink.groups?.file;
            const targetHash = markdownPageLink.groups?.hash;
            const targetSectionId = sectionIdsByFile.get(targetFile);
            if (targetSectionId) {
              const rewrittenHref = targetHash ?? `#${targetSectionId}`;
              return defaultRenderer.link.call(this, { ...link, href: rewrittenHref });
            }
          }

          if (isExternalWebLink(href)) {
            return addExternalLinkTargetAttrs(defaultRenderer.link.call(this, link));
          }
        }
        return false;
      },
    },
  });
}

module.exports = { setupBasePlugins, setupLinkRewriter };
