document.addEventListener("DOMContentLoaded", () => {
  const publicationsPage = document.querySelector(".publications-page");
  if (!publicationsPage) return;

  const lightbox = publicationsPage.querySelector(".publications-lightbox");
  const lightboxImg = publicationsPage.querySelector(
    "#publication-lightbox-img",
  );
  const closeBtn = publicationsPage.querySelector(".lightbox-close");
  const previewButtons = publicationsPage.querySelectorAll(".btn-preview");

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Publication preview";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightboxImg.src = "";
    }, 300);
  };

  previewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      openLightbox(btn.dataset.previewSrc, btn.dataset.previewAlt);
    });
  });

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
    if (
      event.key === "Escape" &&
      lightbox &&
      lightbox.classList.contains("active")
    ) {
      closeLightbox();
    }
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
