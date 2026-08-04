/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-steps. Base block: cards (container).
 * Source: https://patients.stryker.com/us/en/ivs/treatments/balloon-kyphoplasty.html
 * Generated: 2026-07-30
 *
 * Block library (Cards): container, each child card = one row with 2 cells:
 *   cell 1 = image/icon, cell 2 = text (title + description) as richtext.
 * Model (card): image (reference), imageAlt collapsed onto <img alt>, text (richtext).
 * xwalk field hints: field:image on cell 1, field:text on cell 2. imageAlt = collapsed (no hint).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each card is a .col-md-4 / .col-sm-6 column in the .colctrl grid.
  const grid = element.querySelector('.colctrl > .row, .colctrl .row');
  const columns = grid
    ? Array.from(grid.querySelectorAll(':scope > [class*="col-md-4"], :scope > [class*="col-sm-6"]'))
    : Array.from(element.querySelectorAll('[class*="col-md-4"], [class*="col-sm-6"]'));

  columns.forEach((col) => {
    const img = col.querySelector('.standaloneimage img, img');

    // Text cell: heading + description from the rich-text editor.
    const textParts = [];
    const richBlocks = col.querySelectorAll('.c-rich-text-editor > div');
    richBlocks.forEach((rb) => {
      Array.from(rb.children).forEach((child) => textParts.push(child));
    });

    // Skip genuinely empty columns.
    if (!img && textParts.length === 0) return;

    const imageCell = img
      ? [document.createComment(' field:image '), img]
      : '';
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-steps', cells });
  element.replaceWith(block);
}
