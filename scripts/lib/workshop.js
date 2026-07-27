'use strict';

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { escapeHtml } = require('./utils');
const { setupLinkRewriter } = require('./marked-setup');

const workshopDir = path.join(__dirname, '..', '..', 'workshop');
const workshopImagesDir = path.join(workshopDir, 'images');
const headingRegex = /^#{1,6}\s+(.+)$/m;
const nextLinkRegex = /\*\*Next:\*\*\s*(?:Open\s+)?\[([^\]]+)\]\(([^)#?]+\.md)(?:#[^)]*)?\)\.?/g;

function renderWorkshopNavigation(markdown, currentFile, {
  previousFileByFile,
  sectionIdsByFile,
  pageTitleByFile,
}) {
  const previousFile = previousFileByFile.get(currentFile);
  const previousSectionId = previousFile ? sectionIdsByFile.get(previousFile) : null;
  const previousLabel = previousFile ? marked.parseInline(pageTitleByFile.get(previousFile)) : '';

  // Collect all valid next links from this page up front so we can render them
  // together in a single nav block (one previous, one or more next buttons).
  const nextButtons = [];
  for (const match of markdown.matchAll(nextLinkRegex)) {
    const nextFile = match[2];
    const nextSectionId = sectionIdsByFile.get(nextFile);
    if (nextSectionId) {
      nextButtons.push(
        `<a href="#${nextSectionId}" class="workshop-nav-btn workshop-nav-btn-primary">${marked.parseInline(match[1])} <span aria-hidden="true">→</span></a>`
      );
    }
  }

  if (nextButtons.length === 0) return markdown;

  const previousDiv = previousSectionId
    ? `<div class="workshop-navigation-previous"><a href="#${previousSectionId}" class="workshop-nav-btn workshop-nav-btn-secondary"><span aria-hidden="true">←</span> ${previousLabel}</a></div>`
    : '';

  const navHtml = `<nav class="workshop-navigation" aria-label="Workshop navigation">
  ${previousDiv}
  <div class="workshop-navigation-next">
    ${nextButtons.join('\n    ')}
  </div>
</nav>`;

  // Replace the first known next-link match with the full nav; remove the rest.
  let navInserted = false;
  return markdown.replace(nextLinkRegex, (_match, _label, nextFile) => {
    const sectionId = sectionIdsByFile.get(nextFile);
    if (!sectionId) return _match; // preserve links to unknown pages unchanged
    if (!navInserted) {
      navInserted = true;
      return navHtml;
    }
    return ''; // subsequent next-link occurrences are folded into the single nav
  });
}

// Discover workshop markdown files, extract metadata, set up the link rewriter,
// then render all HTML content and the sidebar menu.
function buildWorkshopContent() {
  // Collect and sort workshop markdown files (excludes non-md files; keeps README)
  const files = fs.readdirSync(workshopDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  const sectionIdsByFile = new Map(
    files.map(f => [f, path.basename(f, '.md')])
  );

  const markdownByFile = new Map(
    files.map(f => [f, fs.readFileSync(path.join(workshopDir, f), 'utf8').trim()])
  );
  const pageTitleByFile = new Map(
    [...markdownByFile].map(([f, markdown]) => {
      const headingMatch = markdown.match(headingRegex);
      const slug = path.basename(f, '.md').replace(/^\d+-?/, '').replace(/-/g, ' ');
      const title = headingMatch
        ? headingMatch[1].trim()
        : slug.charAt(0).toUpperCase() + slug.slice(1);
      return [f, title];
    })
  );
  const adventureByFile = new Map(
    [...markdownByFile].map(([f, markdown]) => {
      const adventureMatch = markdown.match(/^<!-- page-adventure: ([^ ]+) -->/m);
      return [f, adventureMatch?.[1] ?? 'other'];
    })
  );
  const previousFileByFile = new Map();

  for (const [sourceFile, markdown] of markdownByFile) {
    for (const match of markdown.matchAll(nextLinkRegex)) {
      const targetFile = match[2];
      if (sectionIdsByFile.has(targetFile) && !previousFileByFile.has(targetFile)) {
        previousFileByFile.set(targetFile, sourceFile);
      }
    }
  }

  // Now that sectionIdsByFile is ready, wire up the markdown link rewriter.
  setupLinkRewriter(sectionIdsByFile);

  const navContext = { previousFileByFile, sectionIdsByFile, pageTitleByFile };

  // Render each file as a closed <details> section with the first heading as <summary>
  const htmlContent = files.map((f, index) => {
    const markdown = markdownByFile.get(f);
    // Extract plain text of the first heading (strip leading # characters).
    // Workshop files use HTML comments (not YAML frontmatter), so the multiline
    // regex safely finds the first heading regardless of leading comment lines.
    const headingMatch = markdown.match(headingRegex);
    const title = pageTitleByFile.get(f);
    const titleHtml = escapeHtml(title);
    const sectionId = sectionIdsByFile.get(f);
    const sectionTitleId = `${sectionId}-title`;
    // Intentionally remove only the first heading because it is promoted to <summary>.
    const markdownWithoutTitle = headingMatch ? markdown.replace(headingRegex, '').trimStart() : markdown;
    const content = marked(renderWorkshopNavigation(markdownWithoutTitle, f, navContext));
    const detailsOpenAttr = index === 0 ? ' open' : '';
    return `<details id="${sectionId}"${detailsOpenAttr}>\n<summary>${titleHtml}</summary>\n<h2 id="${sectionTitleId}" class="workshop-page-title">${titleHtml}</h2>\n${content}\n</details>`;
  }).join('\n\n');

  const menuGroups = [
    ['core', 'Main workshop'],
    ['setup', 'Setup paths'],
    ['advanced', 'Advanced topics'],
    ['side-quest', 'Side quests'],
    ['other', 'Other pages'],
  ];
  const workshopMenu = menuGroups.map(([adventure, label]) => {
    const links = files
      .filter(f => adventureByFile.get(f) === adventure)
      .map(f => {
        const sectionId = sectionIdsByFile.get(f);
        const title = marked.parseInline(pageTitleByFile.get(f));
        return `<li><a href="#${sectionId}" data-workshop-page-link>${title}</a><div class="menu-item-progress" data-menu-progress="${sectionId}"><div class="menu-item-progress-fill"></div></div></li>`;
      })
      .join('\n');

    if (!links) return '';
    return `<section class="workshop-menu-group">
  <h3>${label}</h3>
  <ul>${links}</ul>
</section>`;
  }).join('\n');

  return { files, htmlContent, workshopMenu };
}

module.exports = { buildWorkshopContent, workshopDir, workshopImagesDir };
