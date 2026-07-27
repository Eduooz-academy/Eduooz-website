document.addEventListener("DOMContentLoaded", () => {
  const publicationsPage = document.querySelector(".publications-page");
  if (!publicationsPage) return;

  // --- Exam list Read More / Show Less toggle ---
  publicationsPage.querySelectorAll(".btn-read-more").forEach((btn) => {
    btn.addEventListener("click", () => {
      const examsList = btn.closest(".book-card-exams");
      if (!examsList) return;
      const expanded = examsList.classList.toggle("is-expanded");
      btn.textContent = expanded
        ? btn.dataset.labelLess
        : btn.dataset.labelMore;
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
