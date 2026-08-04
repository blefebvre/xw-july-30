/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-treatment. Base block: hero.
 * Source: https://patients.stryker.com/us/en/ivs/treatments/balloon-kyphoplasty.html
 * Generated: 2026-07-30
 *
 * Block library (Hero): 1 column, up to 3 rows.
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title / subheading / CTA (richtext)
 * Model (hero-treatment): image (reference), imageAlt (collapsed -> alt attr), text (richtext).
 * xwalk field hints: field:image on the image cell, field:text on the text cell.
 * imageAlt is a collapsed field (Alt suffix) and stays on the <img alt> attribute (no hint).
 */
export default function parse(element, { document }) {
  // --- INPUT EXTRACTION (selectors validated against source.html) ---
  const picture = element.querySelector('.imgBoxId picture, .full-width-img picture, picture');
  const img = element.querySelector('.imgBoxId img, .full-width-img img, picture img, img');
  const headingEl = element.querySelector('.largeheadline h1, .largeheadline h2, .hero-space h1, h1, h2');
  const ctaEl = element.querySelector('.curatedcta a, .cta-container a, a.btn-gold, a.btn');

  // --- BRIDGE: build hero cells (1 column) ---
  const cells = [];

  // Row 2: background image (optional). imageAlt is collapsed into the <img alt> attribute.
  const imageNode = picture || img;
  if (imageNode) {
    cells.push([[document.createComment(' field:image '), imageNode]]);
  }

  // Row 3: text (title + CTA) as richtext.
  const textParts = [];
  if (headingEl) {
    const h = document.createElement('h1');
    h.textContent = headingEl.textContent.trim();
    textParts.push(h);
  }
  if (ctaEl) {
    const a = document.createElement('a');
    a.setAttribute('href', ctaEl.getAttribute('href') || '#');
    a.textContent = ctaEl.textContent.trim();
    const p = document.createElement('p');
    p.appendChild(a);
    textParts.push(p);
  }

  // Empty-block guard.
  if (!imageNode && textParts.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  if (textParts.length) {
    cells.push([[document.createComment(' field:text '), ...textParts]]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-treatment', cells });
  element.replaceWith(block);
}
