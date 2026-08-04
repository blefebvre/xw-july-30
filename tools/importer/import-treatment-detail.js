/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroTreatmentParser from './parsers/hero-treatment.js';
import columnsBenefitsParser from './parsers/columns-benefits.js';
import cardsStepsParser from './parsers/cards-steps.js';
import cardsResourceParser from './parsers/cards-resource.js';
import formContactParser from './parsers/form-contact.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/stryker-cleanup.js';
import dmImagesTransformer from './transformers/stryker-dm-images.js';
import sectionsTransformer from './transformers/stryker-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-treatment': heroTreatmentParser,
  'columns-benefits': columnsBenefitsParser,
  'cards-steps': cardsStepsParser,
  'cards-resource': cardsResourceParser,
  'form-contact': formContactParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions.
// Order: cleanup (remove chrome) -> DM/Scene7 images (carrier anchors) -> sections (breaks + metadata).
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'treatment-detail',
  description: 'Treatment detail page with hero, intro/benefits columns, full-bleed callout, how-it-works cards, contact form, resources, and disclaimer/references.',
  urls: [
    'https://patients.stryker.com/us/en/ivs/treatments/balloon-kyphoplasty.html',
  ],
  blocks: [
    {
      name: 'hero-treatment',
      instances: ['.fullWidthImageHero'],
    },
    {
      name: 'columns-benefits',
      instances: ['.cols2'],
    },
    {
      name: 'cards-steps',
      instances: ['.cols3'],
    },
    {
      name: 'form-contact',
      instances: ['.marketoform'],
    },
    {
      name: 'cards-resource',
      instances: ['.tabs'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + DM images + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (full localized path without extension)
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
