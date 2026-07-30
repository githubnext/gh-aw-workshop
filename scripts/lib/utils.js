'use strict';

const relAttrRegex = /\brel=(["'])(.*?)\1/i;

// Prefix every selector in a flat (non-nested) CSS string with the given string.
// Used to scope highlight.js dark-theme rules under dark-mode selectors.
function prefixCssSelectors(css, prefix) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return stripped.replace(/([^{}]+)\{([^{}]*)\}/g, (_, selectors, props) => {
    const prefixed = selectors.trim().split(',').map(s => `${prefix} ${s.trim()}`).join(', ');
    return `${prefixed} { ${props.trim()} }\n`;
  });
}

function flattenTokenText(tokenOrTokens) {
  if (Array.isArray(tokenOrTokens)) {
    return tokenOrTokens.map(flattenTokenText).join('');
  }
  if (!tokenOrTokens) return '';
  return tokenOrTokens.tokens
    ? flattenTokenText(tokenOrTokens.tokens)
    : (tokenOrTokens.text || tokenOrTokens.raw || '');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\'', '&#39;');
}

function isExternalWebLink(href) {
  return /^https?:\/\//i.test(href);
}

function addExternalLinkTargetAttrs(anchorHtml) {
  return anchorHtml.replace(/^<a\b([^>]*)>/i, (match, attrs) => {
    let updatedAttrs = attrs;

    if (!/\btarget\s*=/.test(updatedAttrs)) {
      updatedAttrs += ' target="_blank"';
    }

    const relMatch = updatedAttrs.match(relAttrRegex);
    if (relMatch) {
      const relValues = new Set(relMatch[2].split(/\s+/).filter(Boolean));
      relValues.add('noopener');
      relValues.add('noreferrer');
      updatedAttrs = updatedAttrs.replace(relAttrRegex, `rel="${[...relValues].join(' ')}"`);
    } else {
      updatedAttrs += ' rel="noopener noreferrer"';
    }

    return `<a${updatedAttrs}>`;
  });
}

module.exports = {
  prefixCssSelectors,
  flattenTokenText,
  escapeHtml,
  isExternalWebLink,
  addExternalLinkTargetAttrs,
};
