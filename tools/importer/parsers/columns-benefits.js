/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-benefits. Base block: columns.
 * Source: https://patients.stryker.com/us/en/ivs/treatments/balloon-kyphoplasty.html
 * Generated: 2026-07-30
 *
 * Block library (Columns): row 1 = block name; row 2 = one cell per column.
 * Model (columns-benefits): columns/v1/columns, 2 columns, 1 row.
 * xwalk: Columns blocks do NOT use field hints (hinting Rule 4) — cells hold default content only.
 */
export default function parse(element, { document }) {
  // --- INPUT EXTRACTION (validated against source.html) ---
  // The two columns are the direct .col-sm-6 children of the .colctrl > .row grid.
  const grid = element.querySelector('.colctrl > .row, .colctrl .row');
  let columns = grid
    ? Array.from(grid.querySelectorAll(':scope > [class*="col-sm-6"]'))
    : Array.from(element.querySelectorAll('[class*="col-sm-6"]'));

  // --- BRIDGE: build one cell per column ---
  const row = columns.map((col) => {
    const cellContent = [];
    // Rich-text content of the column (heading, paragraphs, lists).
    const richBlocks = col.querySelectorAll('.c-rich-text-editor > div');
    richBlocks.forEach((rb) => {
      Array.from(rb.children).forEach((child) => cellContent.push(child));
    });
    // Optional CTA button(s) at the bottom of the column.
    col.querySelectorAll('.buttonset a, .button-group a').forEach((a) => {
      const link = document.createElement('a');
      link.setAttribute('href', a.getAttribute('href') || '#');
      link.textContent = a.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(link);
      cellContent.push(p);
    });
    return cellContent;
  });

  // Empty-block guard.
  if (!row.length || row.every((c) => c.length === 0)) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-benefits', cells });
  element.replaceWith(block);
}
