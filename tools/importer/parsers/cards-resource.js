/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-resource. Base block: cards (container).
 * Source: https://patients.stryker.com/us/en/ivs/treatments/balloon-kyphoplasty.html
 * Generated: 2026-07-30
 *
 * Source is a .tabs wrapper ("Resources") whose default tab contains a .cols4 grid of
 * resource items. Each populated column has a linked thumbnail image and a "LEARN MORE" CTA.
 *
 * Block library (Cards): container, each child card = one row with 2 cells:
 *   cell 1 = image, cell 2 = text (richtext, CTA here).
 * Model (card): image (reference), imageAlt collapsed onto <img alt>, text (richtext).
 * xwalk field hints: field:image on cell 1, field:text on cell 2.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Resource items live in the .cols4 grid inside the default-open tab content.
  const grid = element.querySelector('.cols4 .colctrl > .row, .cols4 .colctrl .row, .colctrl .row');
  const columns = grid
    ? Array.from(grid.querySelectorAll(':scope > [class*="col-md-3"], :scope > [class*="col-sm-6"]'))
    : Array.from(element.querySelectorAll('[class*="col-md-3"]'));

  columns.forEach((col) => {
    const img = col.querySelector('.cta-img img, img');
    const ctaSource = col.querySelector('a.btn-teal, a.btn, .cta-container a.btn');

    // Skip empty resource columns.
    if (!img && !ctaSource) return;

    const imageCell = img
      ? [document.createComment(' field:image '), img]
      : '';

    const textParts = [];
    if (ctaSource) {
      const a = document.createElement('a');
      a.setAttribute('href', ctaSource.getAttribute('href') || '#');
      a.textContent = ctaSource.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      textParts.push(p);
    }
    const textCell = textParts.length
      ? [document.createComment(' field:text '), ...textParts]
      : '';

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resource', cells });
  element.replaceWith(block);
}
