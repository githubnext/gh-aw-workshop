'use strict';

const nodeEmoji = require('node-emoji');
const { escapeHtml } = require('./utils');

// Compute the GitHub-style fallback image URL for an emoji character.
// GitHub uses the Unicode codepoints joined by dashes, e.g. 1f680 for 🚀.
function emojiFallbackSrc(emojiChar) {
  const codepoints = [...emojiChar]
    .map(c => c.codePointAt(0).toString(16))
    .filter(cp => cp !== 'fe0f'); // strip variation selector-16
  return `https://github.githubassets.com/images/icons/emoji/unicode/${codepoints.join('-')}.png`;
}

// Returns a marked extension object that converts GFM emoji shortcodes
// (:rocket:, :white_check_mark:, etc.) into <g-emoji> elements styled by
// Primer CSS.  Unknown shortcodes are passed through unchanged.
function markedEmojiExtension() {
  return {
    name: 'emoji',
    level: 'inline',
    start(src) {
      return src.indexOf(':');
    },
    tokenizer(src) {
      const match = src.match(/^:([a-zA-Z0-9_+\-]+):/);
      if (!match) return undefined;
      const name = match[1];
      const emojiChar = nodeEmoji.get(`:${name}:`);
      if (!emojiChar) return undefined;
      return { type: 'emoji', raw: match[0], name, emojiChar };
    },
    renderer(token) {
      const fallbackSrc = emojiFallbackSrc(token.emojiChar);
      return `<g-emoji class="g-emoji" alias="${escapeHtml(token.name)}" fallback-src="${escapeHtml(fallbackSrc)}">${token.emojiChar}</g-emoji>`;
    },
  };
}

module.exports = { markedEmojiExtension };
