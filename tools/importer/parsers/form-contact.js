/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form-contact. Custom block (no block-library convention).
 * Source: https://patients.stryker.com/us/en/ivs/treatments/balloon-kyphoplasty.html
 * Generated: 2026-07-30
 *
 * Source is a Marketo form (.marketoform > form#mktoForm_XXXX). The individual Marketo
 * fields are runtime-injected and not part of the EDS model, so they are not extracted.
 *
 * Model (form-contact): Simple block, 1 column.
 *   - reference (aem-content) -> form definition path; authored in Universal Editor (left empty).
 *   - action (text) -> form action / identifier.
 * Simple-block row rule: one row per unique (non-collapsed) field name = 2 rows.
 * xwalk field hints: field:action on the action cell (has content). reference cell is empty (no hint).
 */
export default function parse(element, { document }) {
  const form = element.querySelector('form[id^="mktoForm"], form.mktoForm, form');

  // action: prefer an explicit action attribute, otherwise the stable Marketo form id so the
  // specific form can be wired up downstream.
  let action = '';
  if (form) {
    action = form.getAttribute('action') || form.getAttribute('id') || '';
  }

  // Empty-block guard: if there is no form at all, unwrap.
  if (!form) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 1: reference (aem-content) — left empty, author selects the form in Universal Editor.
  cells.push(['']);

  // Row 2: action — hinted, carries the form identifier/action.
  if (action) {
    const p = document.createElement('p');
    p.textContent = action;
    cells.push([[document.createComment(' field:action '), p]]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'form-contact', cells });
  element.replaceWith(block);
}
