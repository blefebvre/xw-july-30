/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-treatment-detail.js
  var import_treatment_detail_exports = {};
  __export(import_treatment_detail_exports, {
    default: () => import_treatment_detail_default
  });

  // tools/importer/parsers/hero-treatment.js
  function parse(element, { document }) {
    const picture = element.querySelector(".imgBoxId picture, .full-width-img picture, picture");
    const img = element.querySelector(".imgBoxId img, .full-width-img img, picture img, img");
    const headingEl = element.querySelector(".largeheadline h1, .largeheadline h2, .hero-space h1, h1, h2");
    const ctaEl = element.querySelector(".curatedcta a, .cta-container a, a.btn-gold, a.btn");
    const cells = [];
    const imageNode = picture || img;
    if (imageNode) {
      cells.push([[document.createComment(" field:image "), imageNode]]);
    }
    const textParts = [];
    if (headingEl) {
      const h = document.createElement("h1");
      h.textContent = headingEl.textContent.trim();
      textParts.push(h);
    }
    if (ctaEl) {
      const a = document.createElement("a");
      a.setAttribute("href", ctaEl.getAttribute("href") || "#");
      a.textContent = ctaEl.textContent.trim();
      const p = document.createElement("p");
      p.appendChild(a);
      textParts.push(p);
    }
    if (!imageNode && textParts.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (textParts.length) {
      cells.push([[document.createComment(" field:text "), ...textParts]]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-treatment", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-benefits.js
  function parse2(element, { document }) {
    const grid = element.querySelector(".colctrl > .row, .colctrl .row");
    let columns = grid ? Array.from(grid.querySelectorAll(':scope > [class*="col-sm-6"]')) : Array.from(element.querySelectorAll('[class*="col-sm-6"]'));
    const row = columns.map((col) => {
      const cellContent = [];
      const richBlocks = col.querySelectorAll(".c-rich-text-editor > div");
      richBlocks.forEach((rb) => {
        Array.from(rb.children).forEach((child) => cellContent.push(child));
      });
      col.querySelectorAll(".buttonset a, .button-group a").forEach((a) => {
        const link = document.createElement("a");
        link.setAttribute("href", a.getAttribute("href") || "#");
        link.textContent = a.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(link);
        cellContent.push(p);
      });
      return cellContent;
    });
    if (!row.length || row.every((c) => c.length === 0)) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-benefits", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-steps.js
  function parse3(element, { document }) {
    const cells = [];
    const grid = element.querySelector(".colctrl > .row, .colctrl .row");
    const columns = grid ? Array.from(grid.querySelectorAll(':scope > [class*="col-md-4"], :scope > [class*="col-sm-6"]')) : Array.from(element.querySelectorAll('[class*="col-md-4"], [class*="col-sm-6"]'));
    columns.forEach((col) => {
      const img = col.querySelector(".standaloneimage img, img");
      const textParts = [];
      const richBlocks = col.querySelectorAll(".c-rich-text-editor > div");
      richBlocks.forEach((rb) => {
        Array.from(rb.children).forEach((child) => textParts.push(child));
      });
      if (!img && textParts.length === 0) return;
      const imageCell = img ? [document.createComment(" field:image "), img] : "";
      const textCell = textParts.length ? [document.createComment(" field:text "), ...textParts] : "";
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-steps", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resource.js
  function parse4(element, { document }) {
    const cells = [];
    const grid = element.querySelector(".cols4 .colctrl > .row, .cols4 .colctrl .row, .colctrl .row");
    const columns = grid ? Array.from(grid.querySelectorAll(':scope > [class*="col-md-3"], :scope > [class*="col-sm-6"]')) : Array.from(element.querySelectorAll('[class*="col-md-3"]'));
    columns.forEach((col) => {
      const img = col.querySelector(".cta-img img, img");
      const ctaSource = col.querySelector("a.btn-teal, a.btn, .cta-container a.btn");
      if (!img && !ctaSource) return;
      const imageCell = img ? [document.createComment(" field:image "), img] : "";
      const textParts = [];
      if (ctaSource) {
        const a = document.createElement("a");
        a.setAttribute("href", ctaSource.getAttribute("href") || "#");
        a.textContent = ctaSource.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        textParts.push(p);
      }
      const textCell = textParts.length ? [document.createComment(" field:text "), ...textParts] : "";
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resource", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form-contact.js
  function parse5(element, { document }) {
    const form = element.querySelector('form[id^="mktoForm"], form.mktoForm, form');
    let action = "";
    if (form) {
      action = form.getAttribute("action") || form.getAttribute("id") || "";
    }
    if (!form) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([""]);
    if (action) {
      const p = document.createElement("p");
      p.textContent = action;
      cells.push([[document.createComment(" field:action "), p]]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "form-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/stryker-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#header",
        "#footer",
        "iframe",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/stryker-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/transformers/stryker-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var STYLED_SECTIONS = [
    { selector: ".fullbleedpanel", style: "dark-teal-gradient" },
    { selector: "div.text.parbase .has-background.bg-gold", style: "gold" },
    { selector: "div.text.parbase .has-background.bg-light-gray", style: "light-gray" }
  ];
  function transform3(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const doc = element.ownerDocument;
    for (let i = STYLED_SECTIONS.length - 1; i >= 0; i -= 1) {
      const { selector, style } = STYLED_SECTIONS[i];
      const region = element.querySelector(selector);
      if (!region) {
        console.warn("Section transformer: styled region not found, skipped:", selector);
        continue;
      }
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: "Section Metadata",
        cells: { style }
      });
      const before = region.previousElementSibling;
      if (!before || before.tagName !== "HR") {
        region.parentNode.insertBefore(doc.createElement("hr"), region);
      }
      region.parentNode.insertBefore(metadataBlock, region.nextSibling);
      metadataBlock.parentNode.insertBefore(doc.createElement("hr"), metadataBlock.nextSibling);
    }
  }

  // tools/importer/import-treatment-detail.js
  var parsers = {
    "hero-treatment": parse,
    "columns-benefits": parse2,
    "cards-steps": parse3,
    "cards-resource": parse4,
    "form-contact": parse5
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "treatment-detail",
    description: "Treatment detail page with hero, intro/benefits columns, full-bleed callout, how-it-works cards, contact form, resources, and disclaimer/references.",
    urls: [
      "https://patients.stryker.com/us/en/ivs/treatments/balloon-kyphoplasty.html"
    ],
    blocks: [
      {
        name: "hero-treatment",
        instances: [".fullWidthImageHero"]
      },
      {
        name: "columns-benefits",
        instances: [".cols2"]
      },
      {
        name: "cards-steps",
        instances: [".cols3"]
      },
      {
        name: "form-contact",
        instances: [".marketoform"]
      },
      {
        name: "cards-resource",
        instances: [".tabs"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_treatment_detail_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_treatment_detail_exports);
})();
