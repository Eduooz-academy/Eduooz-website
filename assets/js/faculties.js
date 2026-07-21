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

  /* =========================================
     MOBILE — TAP TO EXPAND FACULTY CARD
     ========================================= */
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const cards = Array.from(grid.querySelectorAll(".fpc-card"));

  cards.forEach(function (card) {
    const glass = card.querySelector(".fpc-glass");
    if (!glass || glass.querySelector(".fpc-tap-indicator")) return;

    const indicator = document.createElement("div");
    indicator.className = "fpc-tap-indicator";
    indicator.innerHTML = '<span class="fpc-tap-indicator-text">Tap to View Details</span><i class="fa-solid fa-chevron-down"></i>';
    glass.appendChild(indicator);
  });

  function collapseCard(card) {
    card.classList.remove("fpc-expanded");
    card.setAttribute("aria-expanded", "false");
    const text = card.querySelector(".fpc-tap-indicator-text");
    if (text) text.textContent = "Tap to View Details";
  }

  function expandCard(card) {
    card.classList.add("fpc-expanded");
    card.setAttribute("aria-expanded", "true");
    const text = card.querySelector(".fpc-tap-indicator-text");
    if (text) text.textContent = "Tap to Hide Details";
  }

  function toggleCard(card) {
    if (!mobileQuery.matches) return;
    const isExpanded = card.classList.contains("fpc-expanded");
    cards.forEach(function (c) { if (c !== card) collapseCard(c); });
    if (isExpanded) collapseCard(card);
    else expandCard(card);
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () { toggleCard(card); });
    card.addEventListener("keydown", function (e) {
      if (!mobileQuery.matches) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard(card);
      }
    });
  });

  function syncMobileA11y(matches) {
    cards.forEach(function (card) {
      if (matches) {
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-expanded", "false");
      } else {
        card.classList.remove("fpc-expanded");
        card.removeAttribute("role");
        card.removeAttribute("tabindex");
        card.removeAttribute("aria-expanded");
        const text = card.querySelector(".fpc-tap-indicator-text");
        if (text) text.textContent = "Tap to View Details";
      }
    });
  }

  syncMobileA11y(mobileQuery.matches);
  function handleMobileChange(e) { syncMobileA11y(e.matches); }
  if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", handleMobileChange);
  else if (mobileQuery.addListener) mobileQuery.addListener(handleMobileChange);
})();
