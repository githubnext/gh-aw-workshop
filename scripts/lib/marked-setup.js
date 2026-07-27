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

const defaultRenderer = new marked.Renderer();
const slugger = new GithubSlugger();

const shellLangs = new Set(['bash', 'sh', 'shell', 'zsh']);
const terminalOutputLangs = new Set(['console', 'output', 'plaintext', 'text']);

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
          const markerSymbol = item.checked ? '●' : '○';
          return `<li class="task-list-item"${labelAttr}><span class="${markerClass}" aria-hidden="true">${markerSymbol}</span> ${text}</li>\n`;
        }
        return false; // use default rendering for non-task items
      },
    },
  });

  // Plugin: render GitHub GFM alert callouts (> [!NOTE], > [!TIP], etc.)
  marked.use(markedAlert());

  // Plugin: syntax-highlight fenced code blocks at build time using highlight.js
  marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }));

  // Plugin: render shell, terminal output, and agent prompt code blocks with distinct UI wrappers
  marked.use({
    useNewRenderer: true,
    renderer: {
      code({ text, lang, escaped }) {
        const langKey = (lang || '').match(/^\S*/)?.[0]?.toLowerCase() ?? '';
        const codeText = text.replace(/\n$/, '') + '\n';
        const codeHtml = escaped ? codeText : escapeHtml(codeText);
        if (langKey === 'prompt') {
          return `<div class="agent-prompt-block" role="region" aria-label="Agent prompt">\n<div class="agent-prompt-bar"><span class="agent-prompt-icon" aria-hidden="true">✦</span><span class="agent-prompt-label">Agent prompt</span></div>\n<pre class="agent-prompt-pre"><code class="language-prompt">${codeHtml}</code></pre>\n</div>\n`;
        }
        if (langKey === 'markdown' || langKey === 'md') {
          return `<div class="markdown-editor-block" role="region" aria-label="Markdown">\n<div class="markdown-editor-bar"><span class="markdown-editor-icon" aria-hidden="true">◇</span></div>\n<pre class="markdown-editor-pre"><code class="language-markdown">${codeHtml}</code></pre>\n</div>\n`;
        }
        if (langKey === 'yaml' || langKey === 'yml') {
          return `<div class="yaml-editor-block" role="region" aria-label="YAML">\n<div class="yaml-editor-bar"><span class="yaml-editor-icon" aria-hidden="true">≡</span></div>\n<pre class="yaml-editor-pre"><code class="hljs language-yaml">${codeHtml}</code></pre>\n</div>\n`;
        }
        const terminalLabel = shellLangs.has(langKey) ? langKey : terminalOutputLangs.has(langKey) ? 'output' : '';
        if (!terminalLabel) return false;
        const escapedLang = escapeHtml(langKey);
        return `<div class="terminal-block">\n<div class="terminal-bar" aria-hidden="true"><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-label">${terminalLabel}</span></div>\n<pre class="terminal-pre"><code class="language-${escapedLang}">${codeHtml}</code></pre>\n</div>\n`;
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
