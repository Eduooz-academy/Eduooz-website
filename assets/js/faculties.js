(function () {
  "use strict";

  /* =========================================
     LENIS SMOOTH SCROLL
     ========================================= */
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  function rafLoop(time) { lenis.raf(time); requestAnimationFrame(rafLoop); }
  requestAnimationFrame(rafLoop);

  /* =========================================
     SCROLL-TO-TOP
     ========================================= */
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
    });
    scrollTopBtn.addEventListener("click", () => lenis.scrollTo(0, { duration: 1.2 }));
  }

  /* =========================================
     SCROLL REVEAL
     ========================================= */
  const grid = document.getElementById("fac-grid");
  if (!grid) return;

  const revealEls = document.querySelectorAll(".fac-reveal");
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("fac-revealed");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  revealEls.forEach(function (el) { observer.observe(el); });
})();
