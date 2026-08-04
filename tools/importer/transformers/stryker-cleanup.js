/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Stryker site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors verified against migration-work/cleaned.html
 * for https://patients.stryker.com/us/en/ivs/treatments/balloon-kyphoplasty.html.
 *
 * Verified in captured DOM:
 *   - #onetrust-consent-sdk  (line 1304) — OneTrust cookie consent wrapper; all
 *                                          nested ot- / onetrust- nodes live
 *                                          inside it, incl. #ot-sdk-btn-floating.
 *   - #header (line 6, .g-header)         — global site header/nav.
 *   - #footer (line 1269, .footer)        — global site footer.
 *   - iframe#MktoForms2XDIframe (1302)    — Marketo cross-domain helper iframe
 *                                          (not authorable; the form block is
 *                                          reconstructed by its parser).
 *   - iframe.ot-text-resize (1553)        — OneTrust resize helper (nested under
 *                                          the consent SDK; removed with it, but
 *                                          iframes are stripped defensively too).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent overlay can block/skew block matching — remove first.
    // Removing the single #onetrust-consent-sdk wrapper takes every nested
    // ot-*/onetrust-* node (banner, preference center, floating button) with it.
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome and leftover helper elements.
    WebImporter.DOMUtils.remove(element, [
      '#header',
      '#footer',
      'iframe',
      'noscript',
      'link',
    ]);
  }
}
