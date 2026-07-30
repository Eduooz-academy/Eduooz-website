document.addEventListener("DOMContentLoaded", () => {
  const publicationsPage = document.querySelector(".publications-page");
  if (!publicationsPage) return;

  // --- Keep an expanding card from visually dragging its row-siblings
  //     along with it. The grid's equal-height rows (align-items: stretch)
  //     size every card in a row to the tallest one, so when a card grows
  //     via Read More, its siblings get stretched into blank empty space
  //     even though nothing in them changed. See syncRowAlignment below. ---
  const cardHasExpansion = (card) => {
    const desc = card.querySelector(".book-card-desc-wrap");
    const exams = card.querySelector(".book-card-exams");
    return (
      (desc && desc.classList.contains("is-expanded")) ||
      (exams && exams.classList.contains("is-expanded"))
    );
  };

  const getRowSiblings = (card) => {
    const grid = card.closest(".publications-grid");
    if (!grid) return [card];
    const rowTop = card.offsetTop;
    return Array.from(grid.querySelectorAll(".book-card")).filter(
      (c) => c.style.display !== "none" && Math.abs(c.offsetTop - rowTop) < 1,
    );
  };

  const syncRowAlignment = (card) => {
    const rowSiblings = getRowSiblings(card);
    // Once anything in the row is expanded, every card in it (expanded or
    // not) is pinned to its own natural height so growth in one never
    // shows up as blank stretch in another. .book-card is styled with
    // height: 100% (to stretch across the row) which has to be overridden
    // inline too, since align-self alone can't shrink an element whose
    // height is explicitly set to fill its area. With nothing expanded in
    // the row, the overrides are cleared and the default equal-height
    // layout is restored untouched.
    const rowHasExpansion = rowSiblings.some(cardHasExpansion);
    rowSiblings.forEach((sibling) => {
      sibling.style.alignSelf = rowHasExpansion ? "start" : "";
      sibling.style.height = rowHasExpansion ? "auto" : "";
    });
  };

  // --- Exam list Read More / Show Less toggle ---
  // Scoped with .closest() to the exams list inside the clicked button's own
  // card, so expanding one card's exam tags never affects any other card.
  publicationsPage.querySelectorAll(".btn-read-more").forEach((btn) => {
    btn.addEventListener("click", () => {
      const examsList = btn.closest(".book-card-exams");
      if (!examsList) return;
      const expanded = examsList.classList.toggle("is-expanded");
      btn.textContent = expanded
        ? btn.dataset.labelLess
        : btn.dataset.labelMore;
      const card = btn.closest(".book-card");
      if (card) syncRowAlignment(card);
    });
  });

  // --- Word-safe description truncation ---
  // The 4-line CSS clamp (-webkit-line-clamp) crops at a fixed character
  // position, which can slice a word in half. To always cut on a whole
  // word, measure the real text (with the actual Read More button appended,
  // exactly as it will render live) in a hidden, unclamped clone, and binary
  // search for the longest word count where that combination still fits the
  // clamped box's own height. The button is then moved to be the last
  // inline child of the <p> itself, so it renders right after the dots with
  // ordinary inline spacing — no separate gap/overlap accounting needed.
  // The untouched original text stays in dataset.fullText for Show Less.
  const computeTruncatedText = (desc, fullText, btn) => {
    const maxHeight = desc.clientHeight;
    if (!maxHeight) return fullText;

    const clone = desc.cloneNode(true);
    clone.style.cssText =
      "position:absolute; left:-9999px; top:0; visibility:hidden; " +
      "pointer-events:none; height:auto; max-height:none; " +
      "-webkit-line-clamp:unset; overflow:visible;";
    clone.style.width = `${desc.clientWidth}px`;
    const cloneTrailing = clone.lastChild;
    clone.appendChild(btn.cloneNode(true));
    document.body.appendChild(clone);

    cloneTrailing.textContent = fullText;
    if (clone.scrollHeight <= maxHeight + 1) {
      document.body.removeChild(clone);
      return fullText;
    }

    const words = fullText.trim().split(/\s+/);
    let lo = 0;
    let hi = words.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      cloneTrailing.textContent = `${words.slice(0, mid).join(" ")}...`;
      if (clone.scrollHeight <= maxHeight + 1) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }

    document.body.removeChild(clone);
    return lo > 0 ? `${words.slice(0, lo).join(" ")}...` : "...";
  };

  const applyDescriptionTruncation = () => {
    publicationsPage.querySelectorAll(".book-card-desc-wrap").forEach((wrap) => {
      const desc = wrap.querySelector(".book-card-desc");
      const btn = wrap.querySelector(".btn-read-more-desc");
      if (!desc || !btn) return;

      // On a re-run (resize, fonts ready) the button is already the last
      // child of desc from the previous pass — detach it first so cloning
      // desc for measurement below doesn't double-count it.
      if (btn.parentElement === desc) {
        btn.remove();
      }

      const trailingText = desc.lastChild;
      if (!trailingText || trailingText.nodeType !== Node.TEXT_NODE) return;

      if (!desc.dataset.fullText) {
        desc.dataset.fullText = trailingText.textContent;
      }
      desc.dataset.truncatedText = computeTruncatedText(
        desc,
        desc.dataset.fullText,
        btn,
      );
      if (!wrap.classList.contains("is-expanded")) {
        trailingText.textContent = desc.dataset.truncatedText;
      }
      desc.appendChild(btn);
    });
  };

  applyDescriptionTruncation();
  // Re-run once web fonts finish loading — if they're still swapping in at
  // DOMContentLoaded, the button's measured width (part of the fit check
  // above) can be off, based on the fallback font.
  if (document.fonts && document.fonts.status !== "loaded") {
    document.fonts.ready.then(applyDescriptionTruncation);
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyDescriptionTruncation, 200);
  });

  // --- Description Read More / Show Less toggle ---
  // Uses its own wrapper/class (.book-card-desc-wrap) so it toggles
  // independently of the exam list's Read More in the same card.
  publicationsPage.querySelectorAll(".btn-read-more-desc").forEach((btn) => {
    btn.addEventListener("click", () => {
      const descWrap = btn.closest(".book-card-desc-wrap");
      if (!descWrap) return;
      const expanded = descWrap.classList.toggle("is-expanded");
      btn.textContent = expanded
        ? btn.dataset.labelLess
        : btn.dataset.labelMore;

      // btn is the last child of desc (moved there by
      // applyDescriptionTruncation), so its previous sibling is the
      // trailing text node whose content needs to swap.
      const desc = descWrap.querySelector(".book-card-desc");
      const trailing = btn.previousSibling;
      if (desc && trailing && trailing.nodeType === Node.TEXT_NODE) {
        trailing.textContent = expanded
          ? desc.dataset.fullText
          : desc.dataset.truncatedText;
      }

      const card = btn.closest(".book-card");
      if (card) syncRowAlignment(card);
    });
  });

  const lightbox = publicationsPage.querySelector(".publications-lightbox");
  const lightboxImg = publicationsPage.querySelector(
    "#publication-lightbox-img",
  );
  const lightboxContent = publicationsPage.querySelector(".lightbox-content");
  const closeBtn = publicationsPage.querySelector(".lightbox-close");
  const prevBtn = publicationsPage.querySelector(".lightbox-prev");
  const nextBtn = publicationsPage.querySelector(".lightbox-next");
  const previewButtons = publicationsPage.querySelectorAll(".btn-preview");

  let lightboxImages = [];
  let lightboxIndex = 0;
  let lightboxZoom = 1;
  let lightboxBaseWidth = 0;
  let lightboxBaseHeight = 0;
  const LIGHTBOX_MIN_ZOOM = 1;
  const LIGHTBOX_MAX_ZOOM = 3;

  // Measures the image's natural "contain-fit" size so zoom can scale up
  // from a real value instead of guessing, letting width/height grow into
  // genuine (scrollable/pannable) overflow rather than a clipped transform.
  const captureLightboxBaseSize = () => {
    if (!lightboxImg) return;
    lightboxImg.style.width = "";
    lightboxImg.style.height = "";
    const rect = lightboxImg.getBoundingClientRect();
    lightboxBaseWidth = rect.width;
    lightboxBaseHeight = rect.height;
  };

  const applyLightboxZoom = () => {
    if (!lightboxImg || !lightboxContent) return;
    if (lightboxZoom <= 1 || !lightboxBaseWidth) {
      lightboxImg.style.width = "";
      lightboxImg.style.height = "";
    } else {
      lightboxImg.style.width = `${lightboxBaseWidth * lightboxZoom}px`;
      lightboxImg.style.height = `${lightboxBaseHeight * lightboxZoom}px`;
    }
    lightboxContent.classList.toggle("is-zoomed", lightboxZoom > 1);
  };

  const resetLightboxZoom = () => {
    lightboxZoom = 1;
    applyLightboxZoom();
  };

  const showLightboxImage = (index) => {
    if (!lightboxImg || lightboxImages.length === 0) return;
    lightboxIndex =
      (index + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[lightboxIndex];
    resetLightboxZoom();
  };

  if (lightboxImg) {
    lightboxImg.addEventListener("load", captureLightboxBaseSize);
  }

  const openLightbox = (images, alt, startIndex) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImages = (images || []).filter(Boolean);
    if (lightboxImages.length === 0) return;
    lightboxImg.alt = alt || "Publication preview";
    showLightboxImage(startIndex || 0);
    const hasMultiple = lightboxImages.length > 1;
    if (prevBtn) prevBtn.classList.toggle("visible", hasMultiple);
    if (nextBtn) nextBtn.classList.toggle("visible", hasMultiple);
    lightbox.classList.add("active");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("active");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    setTimeout(() => {
      lightboxImg.src = "";
      resetLightboxZoom();
    }, 300);
  };

  // --- Scroll to zoom the previewed image in/out ---
  if (lightboxContent) {
    lightboxContent.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const step = 0.15;
        lightboxZoom =
          event.deltaY < 0
            ? Math.min(LIGHTBOX_MAX_ZOOM, lightboxZoom + step)
            : Math.max(LIGHTBOX_MIN_ZOOM, lightboxZoom - step);
        applyLightboxZoom();
      },
      { passive: false },
    );
  }

  // --- Drag to pan a zoomed-in image (desktop) ---
  if (lightboxContent) {
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragScrollLeft = 0;
    let dragScrollTop = 0;

    lightboxContent.addEventListener("mousedown", (event) => {
      if (lightboxZoom <= 1) return;
      isDragging = true;
      lightboxContent.classList.add("is-dragging");
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragScrollLeft = lightboxContent.scrollLeft;
      dragScrollTop = lightboxContent.scrollTop;
      event.preventDefault();
    });

    window.addEventListener("mousemove", (event) => {
      if (!isDragging) return;
      lightboxContent.scrollLeft = dragScrollLeft - (event.clientX - dragStartX);
      lightboxContent.scrollTop = dragScrollTop - (event.clientY - dragStartY);
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      lightboxContent.classList.remove("is-dragging");
    });
  }

  previewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      openLightbox(
        [btn.dataset.previewSrc, btn.dataset.previewBack],
        btn.dataset.previewAlt,
        0,
      );
    });
  });

  // --- Clicking a cover image in the card also opens the preview ---
  publicationsPage.querySelectorAll(".book-card-images").forEach((container) => {
    const imgs = container.querySelectorAll("img");
    imgs.forEach((img, idx) => {
      img.addEventListener("click", () => {
        const card = container.closest(".book-card");
        const previewBtn = card ? card.querySelector(".btn-preview") : null;
        const front = previewBtn ? previewBtn.dataset.previewSrc : imgs[0].src;
        const back = previewBtn
          ? previewBtn.dataset.previewBack
          : imgs[1]
            ? imgs[1].src
            : "";
        const alt = previewBtn ? previewBtn.dataset.previewAlt : img.alt;
        openLightbox([front, back], alt, idx);
      });
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => showLightboxImage(lightboxIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => showLightboxImage(lightboxIndex + 1));
  }

  // --- Swipe to move between front/back covers on touch devices.
  //     Skipped while zoomed in, so a finger-drag pans the image
  //     (native touch scrolling) instead of triggering navigation. ---
  if (lightboxContent) {
    let touchStartX = null;
    lightboxContent.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = lightboxZoom > 1 ? null : event.touches[0].clientX;
      },
      { passive: true },
    );
    lightboxContent.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      const swipeThreshold = 40;
      if (deltaX <= -swipeThreshold) {
        showLightboxImage(lightboxIndex + 1);
      } else if (deltaX >= swipeThreshold) {
        showLightboxImage(lightboxIndex - 1);
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (
        event.target === lightbox ||
        event.target.classList.contains("publications-lightbox")
      ) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowRight") {
      showLightboxImage(lightboxIndex + 1);
    } else if (event.key === "ArrowLeft") {
      showLightboxImage(lightboxIndex - 1);
    }
  });

  // --- Filter Tabs: Book Category Filtering ---
  const emptyState = publicationsPage.querySelector(
    ".publications-empty-state",
  );

  publicationsPage.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) return;

      const filter = btn.getAttribute("data-filter");
      publicationsPage
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const cards = publicationsPage.querySelectorAll(".book-card");
      const hasGsap = typeof gsap !== "undefined";

      const applyFilter = () => {
        let visibleCount = 0;
        cards.forEach((card) => {
          const matches =
            filter === "all" || card.getAttribute("data-category") === filter;
          if (matches) {
            visibleCount++;
            card.style.display = "flex";
            if (hasGsap) {
              gsap.to(card, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: "back.out(1.5)",
                stagger: 0.05,
              });
            }
          } else {
            card.style.display = "none";
          }
        });
        if (emptyState) {
          emptyState.classList.toggle("visible", visibleCount === 0);
        }
      };

      if (hasGsap) {
        gsap.to(cards, {
          opacity: 0,
          scale: 0.9,
          y: 20,
          duration: 0.2,
          onComplete: applyFilter,
        });
      } else {
        applyFilter();
      }
    });
  });

  // --- Scroll to Top Button ---
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      // Use Lenis smooth scroll if available, otherwise native
      if (window.lenis) {
        window.lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});
