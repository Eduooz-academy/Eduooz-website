/**
 * Reusable scroll-linked parallax for images that must appear to float
 * behind their clipping card (Framer/Webflow style), instead of being
 * cropped/panned inside it.
 *
 * Usage:
 *   EduoozParallax.init({
 *     selector: '.my-img',       // the <img> to animate
 *     clipSelector: '.my-card',  // ancestor that clips (overflow: hidden)
 *     wrap: true,                // insert a translated wrapper around the img
 *     strength: 0.12             // max travel, as a fraction of clip height
 *   });
 *
 * All instances share one scroll/resize listener and one rAF loop, so
 * adding more parallax images anywhere on the page costs nothing extra.
 */
(function () {
  "use strict";

  const registry = [];
  let ticking = false;
  let listening = false;

  function measureAndApply(entry) {
    const rect = entry.clip.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom < 0 || rect.top > vh) return;

    const clipCenter = rect.top + rect.height / 2;
    const viewportCenter = vh / 2;
    const denom = vh / 2 + rect.height / 2;
    const progress = denom > 0
      ? Math.max(-1, Math.min(1, (viewportCenter - clipCenter) / denom))
      : 0;

    const travel = entry.strength * rect.height;
    const y = progress * travel;

    entry.target.style.transform = "translate3d(0, " + y.toFixed(2) + "px, 0)";
  }

  function update() {
    for (let i = 0; i < registry.length; i++) {
      measureAndApply(registry[i]);
    }
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function ensureListeners() {
    if (listening) return;
    listening = true;
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
  }

  function wrapImage(img) {
    if (img.parentElement && img.parentElement.classList.contains("parallax-layer")) {
      return img.parentElement;
    }
    const layer = document.createElement("div");
    layer.className = "parallax-layer";
    img.parentElement.insertBefore(layer, img);
    layer.appendChild(img);
    return layer;
  }

  function init(options) {
    const opts = options || {};
    const selector = opts.selector;
    if (!selector) return;

    const strength = typeof opts.strength === "number" ? opts.strength : 0.12;
    const root = opts.root || document;
    const imgs = Array.prototype.slice.call(root.querySelectorAll(selector));

    imgs.forEach(function (img) {
      const clip = opts.clipSelector
        ? img.closest(opts.clipSelector)
        : img.parentElement;
      if (!clip) return;

      const target = opts.wrap ? wrapImage(img) : img;
      target.style.willChange = "transform";

      registry.push({ target: target, clip: clip, strength: strength });
    });

    ensureListeners();
    requestTick();
  }

  window.EduoozParallax = { init: init };
})();
