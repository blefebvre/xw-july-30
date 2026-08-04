/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stryker section breaks and Section Metadata.
 *
 * The treatment-detail template has three styled sections that must carry a
 * Section Metadata block so the imported page reproduces their backgrounds.
 * This project's page-templates.json encodes section styles on the relevant
 * blocks via a `section` property (rather than a top-level `sections` array),
 * so the section definitions below are transcribed from those entries and each
 * selector is verified against migration-work/cleaned.html.
 *
 * Section definitions (block name => selector => style):
 *   - section-full-bleed-callout : .fullbleedpanel                              (line 516)  => dark-teal-gradient
 *   - section-gold-cta           : div.text.parbase .has-background.bg-gold      (line 695)  => gold
 *   - section-potential-risks    : div.text.parbase .has-background.bg-light-gray (line 1172) => light-gray
 *
 * For each styled region the transformer brackets it as its own EDS section:
 * an <hr> before the region, the region content, a Section Metadata block
 * carrying the style, then an <hr> after — so the section between the breaks
 * receives the intended background style on import.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Selectors from captured DOM (page-templates.json blocks[].section entries).
// Document order; processed in reverse so insertions never disturb the
// positions of not-yet-processed regions.
const STYLED_SECTIONS = [
  { selector: '.fullbleedpanel', style: 'dark-teal-gradient' },
  { selector: 'div.text.parbase .has-background.bg-gold', style: 'gold' },
  { selector: 'div.text.parbase .has-background.bg-light-gray', style: 'light-gray' },
];

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const doc = element.ownerDocument;

  // Reverse order keeps earlier regions' selectors valid after later inserts.
  for (let i = STYLED_SECTIONS.length - 1; i >= 0; i -= 1) {
    const { selector, style } = STYLED_SECTIONS[i];
    const region = element.querySelector(selector);
    if (!region) {
      // eslint-disable-next-line no-console
      console.warn('Section transformer: styled region not found, skipped:', selector);
      continue;
    }

    // Section Metadata block carrying the section style.
    const metadataBlock = WebImporter.Blocks.createBlock(doc, {
      name: 'Section Metadata',
      cells: { style },
    });

    // Section break before the styled region (unless it already follows one).
    const before = region.previousElementSibling;
    if (!before || before.tagName !== 'HR') {
      region.parentNode.insertBefore(doc.createElement('hr'), region);
    }

    // Place Section Metadata immediately after the styled region, then an <hr>
    // to close the section off from the following (unstyled) content.
    region.parentNode.insertBefore(metadataBlock, region.nextSibling);
    metadataBlock.parentNode.insertBefore(doc.createElement('hr'), metadataBlock.nextSibling);
  }
}
