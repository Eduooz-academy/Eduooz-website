/* ==================================================================================
   Course video playlists — one YouTube channel per course, no keyword or
   exam-slug filtering. To add a new course: add a key here and a matching
   path check in getCourseKey().
   ================================================================================== */
window._eduoozData = {
  nursing: [
    { id: "E1X1RFFt138", title: "Super Notes for Assistant Professor in Nursing", tag: "Latest" },
    { id: "4J_sUv_L5f0", title: "DHS Staff Nurse Exam Preparation 2025", tag: "Popular" },
    { id: "YglY46sa7oA", title: "POWER PLAN for DHA | MOH | DOH/HAAD | Prometric", tag: "Strategy" },
    { id: "w76w1arkX7E", title: "NCLEX-RN Animation Class", tag: "Guide" },
    { id: "tmP81NRePkA", title: "Pearson VUE Nursing Prometric Exam", tag: "Practice" },
    { id: "dcKOKETcrK4", title: "Nursing Prometric Exam", tag: "Practice" },
    { id: "XjogZEgAA2M", title: "Mission NORCET 11 | Eduooz Academy", tag: "Trending" },
    { id: "_iRggg9Y_UQ", title: "Nursing Prometric Exam", tag: "Practice" },
    { id: "ptIFWQ_cJIQ", title: "Nursing Saudi | Complete Career Details", tag: "Career" },
    { id: "ftKaRv5WUmk", title: "Nursing Kuwait Prometric Complete Exam Training", tag: "Exam Prep" },
  ],
  pharmacy: [
    { id: "Gab0IJ_-8tQ", title: "Paracetamol Pharmacology in 5 Minutes", tag: "Latest" },
    { id: "vcEzTp2HEF4", title: "Phenytoin Pharmacology in 5 Minutes", tag: "Popular" },
    { id: "ugvAoQFZCf8", title: "Sulfonamides in Pharmacology — Explained in 5 Min", tag: "Guide" },
    { id: "f47-76tui34", title: "Diazepam Pharmacology in 5 Min", tag: "Quick Revision" },
    { id: "Hp1yBFQ4e2o", title: "Insulin Pharmacology in 5 Min", tag: "Guide" },
    { id: "-GIBgYF63ko", title: "Pharmacology Quick Revision", tag: "Revision" },
    { id: "iElZRUtCE14", title: "Pharmacist Exam Strategy", tag: "Strategy" },
    { id: "dg9FUWQShk0", title: "RRB Pharmacist 2025 — Online Coaching", tag: "Trending" },
    { id: "lYvPIHaV4O0", title: "Markovnikov's Rule in 5 Min", tag: "Guide" },
    { id: "ChlT_2r96R4", title: "Metformin Pharmacology in 5 Minutes", tag: "Guide" },
  ],
  mlt: [
    { id: "ZqHuz3kBS-4", title: "Lab Technician DHS Long-Term Course", tag: "Latest" },
    { id: "l7QKm6WsqBA", title: "Lab Technician DHS Long Term Course", tag: "Popular" },
    { id: "Er5l3ptq6RM", title: "Kerala PSC Lab Technician: Scientist Nicknames", tag: "Guide" },
    { id: "8X8A_tso5Dk", title: "Lab Technician DHS Long Term — Calendar of Health", tag: "Guide" },
    { id: "ElQf1fTFPCw", title: "Mosquito Vector Chart Explained | PSC MLT Exams", tag: "MCQs" },
    { id: "DXZWVrGW3DI", title: "Lab Technician DHS Long Term Program", tag: "Guide" },
    { id: "N_aayNO3RmM", title: "Kerala PSC Junior Lab Assistant", tag: "Strategy" },
    { id: "Oe5m4qBXJYQ", title: "Kerala PSC Junior Lab Assistant | Level & Exam Details", tag: "Exam Prep" },
    { id: "z0h8iw7-pfc", title: "Lab Technician (DHS Long Term) | Complete Learning Program", tag: "Trending" },
  ],
};

// Detects the current course from the page URL. Individual course landing
// pages live under /courses/<course>/..., which is a reliable signal
// independent of exam name/slug wording. Falls back to EXAM_CONFIG.examSlug
// for any page not under the standard /courses/<course>/ path.
function getCourseKey() {
  var path = window.location.pathname.toLowerCase();
  if (path.indexOf("/courses/pharmacy/") !== -1) return "pharmacy";
  if (path.indexOf("/courses/mlt/") !== -1) return "mlt";
  if (path.indexOf("/courses/nursing/") !== -1) return "nursing";

  var slug =
    ((window.EXAM_CONFIG && window.EXAM_CONFIG.examSlug) || "").toLowerCase();
  if (slug.indexOf("lab-technician") !== -1) return "mlt";
  if (slug.indexOf("pharma") !== -1 || slug.indexOf("drug") !== -1)
    return "pharmacy";
  return "nursing";
}

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Initialize Lenis Smooth Scrolling ---
  function initLenis() {
    if (typeof Lenis === "undefined") {
      console.warn("Lenis script not loaded.");
      return;
    }
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    window.lenis = lenis;

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }
  initLenis();

  // --- 2. GSAP Text Reveal Sequence ---
  const tl = gsap.timeline();
  gsap.set(".g-reveal", { autoAlpha: 1 });

  tl.from(".g-reveal", {
    y: 50,
    opacity: 0,
    filter: "blur(15px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
    delay: 0.5,
    clearProps: "filter",
  });

  // --- 3. Navbar Light/Dark Blend Logic (If applicable to About page) ---
  function initNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    ScrollTrigger.create({
      start: 200,
      onEnter: () => navbar.classList.add("light-mode"),
      onLeaveBack: () => navbar.classList.remove("light-mode"),
    });
  }

  if (document.getElementById("navbar")) {
    initNavbarScroll();
  } else {
    window.addEventListener("headerLoaded", initNavbarScroll);
  }

  function initFooterAnimation() {
    let mmFooter = gsap.matchMedia();

    mmFooter.add("(min-width: 1025px)", () => {
      gsap.set(".luxury-footer-inner", { willChange: "transform, opacity" });

      gsap.from(".luxury-footer-inner", {
        scrollTrigger: {
          trigger: ".luxury-footer-wrapper",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
        yPercent: -20,
        scale: 0.95,
        opacity: 0.5,
        ease: "none",
        force3D: true,
      });
    });
  }

  if (document.querySelector(".luxury-footer-wrapper")) {
    initFooterAnimation();
  } else {
    window.addEventListener("footerLoaded", initFooterAnimation);
  }

  // --- 10. Scroll to Top Button ---
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

  {
    // --- 1. GSAP Hero Entrance Reveal ---
    const tl = gsap.timeline();
    gsap.set(".g-nexus-reveal", { autoAlpha: 1 });

    tl.from(".g-nexus-reveal", {
      y: 40,
      opacity: 0,
      filter: "blur(10px)",
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2,
    });

    // --- 2. Interactive Node Parallax Physics ---
    // We only attach the mouse listener to the wrapper on Desktop devices
    const nexusWrapper = document.querySelector(".nexus-hero-section");
    const parallaxElements = document.querySelectorAll(".parallax-element");

    if (
      nexusWrapper &&
      parallaxElements.length > 0 &&
      window.innerWidth > 1024
    ) {
      nexusWrapper.addEventListener("mousemove", (e) => {
        // Get mouse position relative to the center of the screen
        const x = e.clientX - window.innerWidth / 2;
        const y = e.clientY - window.innerHeight / 2;

        parallaxElements.forEach((el) => {
          // Get the unique speed data attribute for each node
          const speed = el.getAttribute("data-speed");

          // Calculate movement (Invert the movement so it feels like floating)
          const xMove = x * speed;
          const yMove = y * speed;

          // Apply movement smoothly using GSAP
          gsap.to(el, {
            x: xMove,
            y: yMove,
            duration: 1.5, // High duration gives it a "lazy, floating" feel
            ease: "power2.out",
          });
        });
      });

      // Reset to center smoothly when mouse leaves the hero section
      nexusWrapper.addEventListener("mouseleave", () => {
        parallaxElements.forEach((el) => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 1.5,
            ease: "power2.out",
          });
        });
      });
    }
  }

  {
    // --- 1. Reveal Animations ---
    gsap.set(".g-monolith-reveal", { autoAlpha: 1 });

    // Animate the cards upwards, but keep the staggered layout intact
    const monoElements = gsap.utils.toArray(".g-monolith-reveal");
    monoElements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        y: "+=40",
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        ease: "power3.out",
      });
    });

    // --- 3. Trajectory Tab Switching Logic ---
    const tabContainer = document.getElementById("trajectoryTabs");
    const contentWrapper = document.getElementById("trajectoryContent");

    if (tabContainer && contentWrapper) {
      const tabs = tabContainer.querySelectorAll(".trajectory-tab");
      const sections = contentWrapper.querySelectorAll(".trajectory-section");

      tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          const filter = this.getAttribute("data-filter");

          // Update active tab
          tabs.forEach((t) => t.classList.remove("active"));
          this.classList.add("active");

          // Filter sections with animation
          sections.forEach((section) => {
            const sectionType = section.getAttribute("data-section");

            if (filter === "all" || sectionType === filter) {
              section.classList.remove("is-hidden");
              section.classList.remove("is-entering");
              // Force reflow to restart animation
              void section.offsetWidth;
              section.classList.add("is-entering");
            } else {
              section.classList.add("is-hidden");
              section.classList.remove("is-entering");
            }
          });

          // Re-trigger GSAP scroll animations for newly visible cards
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        });
      });
    }
  }
});

/* ==================================================================================
   courses.js — Course landing page animations (course-hero, video, faculty, etc.)
   ================================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Initialize Lenis Smooth Scrolling (skip if already initialized) ---
  function initLenis() {
    if (window.lenis) return;
    if (typeof Lenis === "undefined") {
      console.warn("Lenis script not loaded.");
      return;
    }
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    window.lenis = lenis;

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }
  initLenis();

  // --- 3. Navbar Light/Dark Blend Logic (If applicable to About page) ---
  function initNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    ScrollTrigger.create({
      start: 700,
      onEnter: () => navbar.classList.add("light-mode"),
      onLeaveBack: () => navbar.classList.remove("light-mode"),
    });
  }

  if (document.getElementById("navbar")) {
    initNavbarScroll();
  } else {
    window.addEventListener("headerLoaded", initNavbarScroll);
  }

  // --- 1. GSAP Premium Entrance Reveal ---
  const tl = gsap.timeline();
  gsap.set(".g-course-reveal", { autoAlpha: 1 });

  tl.from(".g-course-reveal", {
    y: 50,
    opacity: 0,
    filter: "blur(15px)",
    duration: 1.5,
    stagger: 0.2,
    ease: "power4.out",
    delay: 0.1,
  });

  // --- 1B. Dynamic FOMO Urgency Timer ---
  const timerEl = document.getElementById("fomo-timer");
  if (timerEl) {
    let timeRemaining = 48 * 3600 + Math.floor(Math.random() * 3600); // Randomized 48+ hours in seconds
    setInterval(() => {
      timeRemaining--;
      const h = Math.floor(timeRemaining / 3600);
      const m = Math.floor((timeRemaining % 3600) / 60);
      const s = timeRemaining % 60;
      timerEl.innerHTML = `<i class="fa-regular fa-clock"></i> Closes in ${h}h ${m}m ${s}s`;
    }, 1000);
  }

  // --- 2. Jitter-Free 3D Dashboard Tilt ---
  // We attach the mouse listener to the wrapper, but animate the inner card.
  const wrapper = document.querySelector(".course-vital-wrapper");
  const card = document.getElementById("vital-card");

  if (wrapper && card) {
    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();

      // Mouse position relative to the wrapper
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Rotation Limits (Max tilt: 10 degrees)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      // Apply 3D Rotation to the inner card
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Update the Glare position
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    });

    // Reset smoothly when mouse leaves
    wrapper.addEventListener("mouseleave", () => {
      card.style.transform = `rotateX(0deg) rotateY(0deg)`;

      // Add a temporary transition for the snap-back
      card.style.transition = `transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)`;
      setTimeout(() => {
        // Remove transition so mouse tracking is instant again
        card.style.transition = `none`;
      }, 500);
    });
  }

  // --- 3. GSAP Video Section Reveal ---
  gsap.set(".g-vid-reveal", { autoAlpha: 1 });
  gsap.from(".course-video-section .g-vid-reveal", {
    scrollTrigger: { trigger: ".course-video-section", start: "top 80%" },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
  });

  // --- 4. Cinematic YouTube Lazy-Load Logic ---
  const videoPlayer = document.getElementById("custom-video-player");

  if (videoPlayer) {
    videoPlayer.addEventListener("click", function () {
      // Check if iframe already exists to prevent multiple clicks
      if (this.querySelector(".youtube-iframe")) return;

      // Get the YouTube ID from the data attribute
      const ytId = this.getAttribute("data-yt-id");
      const innerWrapper = this.querySelector(".video-player-inner");

      // Construct the YouTube iframe URL (Autoplay ON, no rel videos)
      const iframeHTML = `
                <iframe class="youtube-iframe" 
                        src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            `;

      // Fade out the custom UI to black, then inject the iframe
      gsap.to(innerWrapper.children, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          // Inject iframe
          innerWrapper.insertAdjacentHTML("beforeend", iframeHTML);
        },
      });
    });
  }

  // --- 5. GSAP Curriculum Reveal ---
  gsap.set(".g-curr-reveal", { autoAlpha: 1 });
  gsap.from(".g-curr-reveal", {
    scrollTrigger: { trigger: ".curriculum-premium-section", start: "top 80%" },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
  });

  // --- 6. Interactive Phase Filter Logic ---
  const phaseBtns = document.querySelectorAll(".phase-btn");
  const phaseGrids = document.querySelectorAll(".matrix-grid");

  if (phaseBtns.length > 0 && phaseGrids.length > 0) {
    phaseBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // If already active, do nothing
        if (this.classList.contains("active")) return;

        // 1. Update Button UI
        phaseBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        // 2. Identify target grid
        const targetId = this.getAttribute("data-target");
        const targetGrid = document.getElementById(targetId);
        const currentGrid = document.querySelector(".matrix-grid.active-grid");

        // 3. GSAP Transition Sequence
        const tl = gsap.timeline();

        // Fade out current grid
        if (currentGrid) {
          tl.to(currentGrid.querySelectorAll(".module-glass-card"), {
            y: 20,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in",
            onComplete: () => {
              currentGrid.style.display = "none";
              currentGrid.classList.remove("active-grid");
            },
          });
        }

        // Fade in new grid
        tl.call(() => {
          targetGrid.style.display = "grid";
          targetGrid.classList.add("active-grid");
          // Reset opacity for GSAP to animate from
          gsap.set(targetGrid, { opacity: 1 });
        }).fromTo(
          targetGrid.querySelectorAll(".module-glass-card"),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.2)",
          },
        );
      });
    });

    // Mobile touch support for cards
    if (window.innerWidth <= 1024) {
      const moduleCards = document.querySelectorAll(".module-glass-card");
      moduleCards.forEach((card) => {
        card.addEventListener("click", () => {
          card.classList.toggle("is-open");
        });
      });
    }
  }

  // --- 7. Vercel-Style Spotlight Physics ---
  const syllabusSection = document.getElementById("syllabus");
  if (syllabusSection) {
    syllabusSection.addEventListener("mousemove", (e) => {
      const cards = document.querySelectorAll(".module-glass-card");
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    });
  }

  // --- 7. GSAP Duration & Schedule Reveal ---

  // 1. Fade up the elements
  gsap.set(".g-dur-reveal", { autoAlpha: 1 });
  gsap.from(".g-dur-reveal", {
    scrollTrigger: { trigger: ".duration-light-section", start: "top 80%" },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
  });

  // 2. The Number Counter Animation
  const durationCounter = document.getElementById("duration-counter");

  if (durationCounter) {
    // We create an object to hold the starting value
    const targetValue = 6; // Target duration (6 Months)
    const counterObj = { val: 0 };

    gsap.to(counterObj, {
      val: targetValue,
      duration: 2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".massive-time-block",
        start: "top 85%", // Triggers animation as soon as the number comes into view
      },
      // On every frame of the animation, update the HTML text
      onUpdate: function () {
        // Math.floor ensures we only show whole numbers while it counts up
        durationCounter.innerHTML = Math.floor(counterObj.val);
      },
    });
  }

  // --- 9. GSAP Pricing Vault Interactions ---

  // 1. Reveal Animation
  gsap.set(".g-price-reveal", { autoAlpha: 1 });
  gsap.from(".g-price-reveal", {
    scrollTrigger: { trigger: ".pricing-premium-section", start: "top 80%" },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
  });

  // 2. The Toggle Engine (One-Time vs EMI)
  const btnOnetime = document.getElementById("btn-onetime");
  const btnEmi = document.getElementById("btn-emi");
  const togglePill = document.querySelector(".toggle-pill");
  const priceValues = document.querySelectorAll(".price-value");
  const priceSuffixes = document.querySelectorAll(".price-suffix");

  if (btnOnetime && btnEmi && togglePill) {
    // Initialize pill width based on first button
    togglePill.style.width = `${btnOnetime.offsetWidth}px`;

    function switchPricing(mode) {
      // Animate Numbers
      priceValues.forEach((el) => {
        const targetVal = el.getAttribute(`data-${mode}`);

        // Fade out, change value, fade in
        gsap.to(el, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          onComplete: () => {
            el.innerHTML = targetVal;
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: "back.out(1.5)",
            });
          },
        });
      });

      // Update Suffixes (e.g., "/ mo")
      priceSuffixes.forEach((el) => {
        const targetSuffix = el.getAttribute(`data-${mode}-suffix`);
        el.innerHTML = targetSuffix;
      });
    }

    btnOnetime.addEventListener("click", () => {
      if (btnOnetime.classList.contains("active")) return;

      btnEmi.classList.remove("active");
      btnOnetime.classList.add("active");

      // Move pill to the left
      togglePill.style.transform = `translateX(0)`;
      togglePill.style.width = `${btnOnetime.offsetWidth}px`;

      switchPricing("onetime");
    });

    btnEmi.addEventListener("click", () => {
      if (btnEmi.classList.contains("active")) return;

      btnOnetime.classList.remove("active");
      btnEmi.classList.add("active");

      // Move pill to the right
      togglePill.style.transform = `translateX(${btnOnetime.offsetWidth}px)`;
      togglePill.style.width = `${btnEmi.offsetWidth}px`;

      switchPricing("emi");
    });
  }

  // 3. Jitter-Free 3D Hover Physics for Pricing Cards
  const vaultWrappers = document.querySelectorAll(".vault-card-wrapper");

  vaultWrappers.forEach((wrapper) => {
    const card = wrapper.querySelector(".vault-card");

    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    });

    wrapper.addEventListener("mouseleave", () => {
      card.style.transform = `rotateX(0deg) rotateY(0deg)`;
      card.style.transition = `transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)`;
      setTimeout(() => {
        card.style.transition = `none`;
      }, 500);
    });
  });

  // --- 7. GSAP Cinematic Video Section ---

  // Scroll Reveal
  gsap.set(".g-vid-reveal", { autoAlpha: 1 });
  gsap.from(".video-luxury-section .g-vid-reveal", {
    scrollTrigger: {
      trigger: ".video-luxury-section",
      start: "top 80%",
    },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
    clearProps: "filter",
  });

  // --- Cinematic Lights Out & Magnetic Cursor Logic ---
  const mainPortal = document.getElementById("main-portal");
  const playCursor = document.querySelector(".magnetic-play-cursor");

  if (mainPortal && playCursor) {
    // 1. Hover Entrance: Snap cursor to mouse entry
    mainPortal.addEventListener("mouseenter", (e) => {
      const rect = mainPortal.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.set(playCursor, {
        x: x,
        y: y,
        xPercent: -50,
        yPercent: -50,
        scale: 0.5,
      });
    });

    // 2. Hover Exit
    mainPortal.addEventListener("mouseleave", () => {
      gsap.to(playCursor, { opacity: 0, scale: 0.5, duration: 0.3 });
    });

    // 3. Mouse Move: Magnetic Tracking using separated coordinates and percentages
    mainPortal.addEventListener("mousemove", (e) => {
      const rect = mainPortal.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(playCursor, {
        x: x,
        y: y,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "sine.out",
      });
    });
  }

  // --- 11. GSAP Testimonials Reveal ---
  gsap.set(".g-test-reveal", { autoAlpha: 1 });
  gsap.from(".g-test-reveal", {
    scrollTrigger: {
      trigger: ".testimonials-premium-section",
      start: "top 80%",
    },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
  });

  // --- 12. Testimonial Marquee: JS-Driven Infinite Scroll + Drag ---
  document
    .querySelectorAll(".test-marquee-container")
    .forEach((container, idx) => {
      const track = container.querySelector(".test-marquee-track");
      if (!track) return;

      const direction = idx === 0 ? -1 : 1; // Row 1 scrolls left, Row 2 scrolls right
      const autoSpeed = 0.5; // Pixels per frame

      let targetX = 0;
      let currentX = 0;
      let isDragging = false;
      let startPointerX = 0;
      let dragAnchorX = 0;
      let halfWidth = 0;

      function measure() {
        halfWidth = track.scrollWidth / 2;
        // Start Row 2 at -halfWidth so it can scroll rightward
        if (direction === 1 && targetX === 0) {
          targetX = -halfWidth;
          currentX = -halfWidth;
        }
      }
      setTimeout(measure, 300);
      window.addEventListener("resize", measure);

      // Pointer Down
      function onDown(e) {
        isDragging = true;
        startPointerX = e.clientX ?? e.touches[0].clientX;
        dragAnchorX = targetX;
      }
      // Pointer Move
      function onMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const px = e.clientX ?? e.touches?.[0]?.clientX;
        if (px == null) return;
        targetX = dragAnchorX + (px - startPointerX);
      }
      // Pointer Up
      function onUp() {
        isDragging = false;
      }

      container.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      container.addEventListener("touchstart", onDown, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onUp);

      // Render Loop
      function animate() {
        if (!isDragging) {
          targetX += autoSpeed * direction;
        }
        // LERP for smoothness
        currentX += (targetX - currentX) * 0.06;

        // Seamless loop wrap
        if (currentX <= -halfWidth) {
          currentX += halfWidth;
          targetX += halfWidth;
        } else if (currentX >= 0) {
          currentX -= halfWidth;
          targetX -= halfWidth;
        }

        track.style.transform = `translateX(${currentX}px)`;
        requestAnimationFrame(animate);
      }
      animate();
    });

  // --- 15. FACULTY MORPHING: DYNAMIC DOM WRAPPER FOR CSS GRID ---
  document.querySelectorAll(".fac-hidden-details").forEach((details) => {
    if (details.querySelector(".fac-hidden-inner")) return;
    const inner = document.createElement("div");
    inner.className = "fac-hidden-inner";
    while (details.firstChild) {
      inner.appendChild(details.firstChild);
    }
    details.appendChild(inner);
  });

  // Mobile Interaction for Morph Cards
  const morphCards = document.querySelectorAll(".fac-morph-card");
  if (window.innerWidth <= 1024 && morphCards.length > 0) {
    morphCards.forEach((card) => {
      card.addEventListener("click", function () {
        const isOpen = this.classList.contains("is-open");
        morphCards.forEach((c) => c.classList.remove("is-open"));
        if (!isOpen) this.classList.add("is-open");
      });
    });
  }

  // --- 16. PLACEMENTS: CINEMATIC INFINITE DRAG FILMSTRIP ---
  const facTrack = document.getElementById("faculty-track");
  const facWrapper = document.querySelector(".filmstrip-track-wrapper");

  if (facTrack && facWrapper) {
    const cards = Array.from(facTrack.children);

    // 1. Clone cards to create the seamless loop illusion
    cards.forEach((card) => {
      let clone = card.cloneNode(true);
      facTrack.appendChild(clone);
    });

    const allCards = Array.from(facTrack.children);

    // 2. Physics Variables
    let targetX = 0;
    let currentX = 0;
    let isDragging = false;
    let startX = 0;
    let dragStartX = 0;
    let autoScrollSpeed = 1;
    let trackWidth = 0;

    function updateMeasurements() {
      trackWidth = facTrack.scrollWidth / 2;
    }
    setTimeout(updateMeasurements, 500);
    window.addEventListener("resize", updateMeasurements);

    facWrapper.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      dragStartX = targetX;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      targetX = dragStartX + dx * 1.5;
    });

    window.addEventListener("mouseup", () => (isDragging = false));
    window.addEventListener("mouseleave", () => (isDragging = false));

    // Touch for Mobile
    facWrapper.addEventListener("touchstart", (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      dragStartX = targetX;
      autoScrollSpeed = 0;
    });

    window.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - startX;
        targetX = dragStartX + dx * 1.5;
      },
      { passive: true },
    );

    window.addEventListener("touchend", () => {
      isDragging = false;
      autoScrollSpeed = 1;
    });

    facWrapper.addEventListener("mouseenter", () => (autoScrollSpeed = 0));
    facWrapper.addEventListener("mouseleave", () => (autoScrollSpeed = 1));

    // Render Loop
    function animateFaculty() {
      if (!isDragging) {
        targetX -= autoScrollSpeed;
      }

      currentX += (targetX - currentX) * 0.08;

      if (currentX <= -trackWidth) {
        currentX += trackWidth;
        targetX += trackWidth;
      } else if (currentX > 0) {
        currentX -= trackWidth;
        targetX -= trackWidth;
      }

      gsap.set(facTrack, { x: currentX });

      // Mobile auto-reveal
      if (window.innerWidth <= 1024) {
        const screenCenter = window.innerWidth / 2;
        allCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          if (
            cardCenter > screenCenter - rect.width * 0.55 &&
            cardCenter < screenCenter + rect.width * 0.55
          ) {
            card.classList.add("mobile-active");
          } else {
            card.classList.remove("mobile-active");
          }
        });
      } else {
        allCards.forEach((card) => card.classList.remove("mobile-active"));
      }

      requestAnimationFrame(animateFaculty);
    }
    animateFaculty();
  }

  // --- 17. FINAL REVEAL ANIMATIONS (Faculty & Placements) ---
  gsap.set(".g-fac-reveal, .g-place-reveal", { autoAlpha: 1 });

  gsap.from(".g-fac-reveal", {
    scrollTrigger: { trigger: ".faculty-morph-section", start: "top 80%" },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
  });

  gsap.from(".g-place-reveal", {
    scrollTrigger: { trigger: ".faculty-filmstrip-section", start: "top 80%" },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
  });

  // --- 11. GSAP Application Terminal Logic ---

  // 1. Reveal Animation
  gsap.set(".g-cta-reveal", { autoAlpha: 1 });
  gsap.from(".g-cta-reveal", {
    scrollTrigger: { trigger: ".cta-terminal-section", start: "top 80%" },
    y: 40,
    opacity: 0,
    filter: "blur(10px)",
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
  });
});

// Tab Filtering Logic with GSAP
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const boxes = document.querySelectorAll(".course-box");

    // Hide all first
    gsap.to(boxes, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.2,
      onComplete: () => {
        boxes.forEach((box) => {
          if (
            filter === "all" ||
            box.getAttribute("data-category") === filter
          ) {
            box.style.display = "flex";
            // Show filtered
            gsap.to(box, {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.4,
              ease: "back.out(1.5)",
              stagger: 0.05,
            });
          } else {
            box.style.display = "none";
          }
        });
      },
    });
  });
});

// FAQ Accordion
document.querySelectorAll(".faq-q").forEach((q) => {
  q.addEventListener("click", () => {
    const answer = q.nextElementSibling;
    const icon = q.querySelector("i");
    const isOpen =
      answer.style.maxHeight !== "0px" && answer.style.maxHeight !== "";

    // Close all others
    document
      .querySelectorAll(".faq-a")
      .forEach((a) => (a.style.maxHeight = "0px"));
    document
      .querySelectorAll(".faq-q i")
      .forEach((i) => (i.style.transform = "rotate(0deg)"));

    if (!isOpen) {
      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.style.transform = "rotate(45deg)";
    }
  });
});

// --- Video Testimonials Logic (light landing-page theme) ---
// Ports the working 23-video / playlist / pagination behavior from
// courses.js onto the existing light testimonial markup. Safe no-op on
// pages without a #testiPlaylist section.
(function () {
  const testiPlaylist = document.getElementById("testiPlaylist");
  const testiFeatured = document.getElementById("testiFeatured");
  if (!testiPlaylist || !testiFeatured) return;

  // Same 23 YouTube Shorts as the main courses.html testimonials section.
  const TESTI_VIDEO_IDS = [
    "r1wSiAmjMcA",
    "oeJcpXOwWnw",
    "ltbkEbdV4fU",
    "OQhRZWuG664",
    "NYpUjEJiqHQ",
    "KzH05e2b1vE",
    "BzHwBxq78M4",
    "J2p7BVRiTho",
    "ihz7PxJr9ts",
    "QNQJaa76VOo",
    "RFrX_Rut6UA",
    "INU_90s4UxI",
    "3S5HbF6sCDY",
    "sNVG7mmMWsU",
    "78xAMnUJLco",
    "vpkzal8K4KY",
    "GGombj0VRYE",
    "6amewOeC2oY",
    "-YyLEigHEC8",
    "E9hW6In9ZOI",
    "Kh8_nSzEuFg",
    "hQDioIUOKRc",
    "lX94AzT_hrw",
  ];

  // Rebuild the playlist with all 23 videos so every landing page has the
  // same working data set as courses.html (replaces any placeholder items).
  testiPlaylist.innerHTML = TESTI_VIDEO_IDS.map((id, i) => {
    const n = String(i + 1).padStart(2, "0");
    const thumb = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    return (
      '<div class="testi-playlist-item' +
      (i === 0 ? " active" : "") +
      '" data-index="' +
      i +
      '" data-url="https://www.youtube.com/watch?v=' +
      id +
      '" data-img="' +
      thumb +
      '" data-avatar="' +
      thumb +
      '" data-name="Testimonial Video ' +
      n +
      '" data-sub="YouTube Shorts" data-badge="Shorts">' +
      '<div class="testi-item-thumb"><img src="' +
      thumb +
      '" alt="Testimonial ' +
      n +
      '" loading="lazy"><div class="testi-item-play"><i class="fa-solid fa-play"></i></div></div>' +
      '<div class="testi-item-info"><h3 class="testi-item-name">Testimonial Video ' +
      n +
      '</h3><div class="testi-item-role"><i class="fa-solid fa-location-dot"></i> YouTube Shorts</div></div>' +
      '<div class="testi-item-number">' +
      n +
      "</div></div>"
    );
  }).join("");

  // Ensure the playlist + pagination dots share one grid column (wraps the
  // playlist exactly like courses.html's .testi-playlist-wrap).
  let wrap = testiPlaylist.closest(".testi-playlist-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "testi-playlist-wrap";
    testiPlaylist.parentNode.insertBefore(wrap, testiPlaylist);
    wrap.appendChild(testiPlaylist);
  }
  let testiDots = document.getElementById("testiDots");
  if (!testiDots) {
    testiDots = document.createElement("div");
    testiDots.id = "testiDots";
    testiDots.className = "testi-dots";
    testiDots.setAttribute("aria-hidden", "false");
    wrap.appendChild(testiDots);
  }

  const playlistItems = testiPlaylist.querySelectorAll(".testi-playlist-item");
  const featuredImg = document.getElementById("testiFeaturedImg");
  const avatarImg = document.getElementById("testiAvatarImg");
  const nameEl = document.getElementById("testiName");
  const subEl = document.getElementById("testiSub");
  const badgeEl = document.getElementById("testiBadge");
  const quoteEl = document.getElementById("testiQuote");
  const playBtn = document.getElementById("testiPlayBtn");
  const featuredThumb = testiFeatured.querySelector(".testi-featured-thumb");

  if (!playlistItems.length) return;

  let currentIndex = 0;
  let autoPlayInterval;
  let currentUrl = playlistItems[0].dataset.url || "";

  function applyFeaturedContent(currentItem) {
    // Switching the featured selection stops whatever was playing in it —
    // the user picks a new video, they don't get two playing at once.
    if (featuredThumb && window.EduoozInlinePlayer)
      window.EduoozInlinePlayer.stopIfBox(featuredThumb);
    if (featuredImg) featuredImg.src = currentItem.dataset.img;
    if (avatarImg) avatarImg.src = currentItem.dataset.avatar;
    if (nameEl) nameEl.textContent = currentItem.dataset.name;
    if (subEl) subEl.textContent = currentItem.dataset.sub;
    if (badgeEl)
      badgeEl.innerHTML =
        '<i class="fa-solid fa-check"></i> ' + currentItem.dataset.badge;
    if (quoteEl) {
      if (currentItem.dataset.quote && currentItem.dataset.quote.trim()) {
        quoteEl.style.display = "";
        quoteEl.innerHTML =
          '<i class="fa-solid fa-quote-left testi-quote-icon"></i> <p>' +
          currentItem.dataset.quote +
          "</p>";
      } else {
        quoteEl.style.display = "none";
        quoteEl.innerHTML = "";
      }
    }
    currentUrl = currentItem.dataset.url || currentUrl;
  }

  function updateFeatured(index, immediate) {
    playlistItems.forEach((item) => item.classList.remove("active"));
    const currentItem = playlistItems[index];
    if (!currentItem) return;
    currentItem.classList.add("active");

    if (immediate || typeof gsap === "undefined") {
      applyFeaturedContent(currentItem);
    } else {
      gsap.to(testiFeatured, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          applyFeaturedContent(currentItem);
          gsap.to(testiFeatured, { opacity: 1, duration: 0.3 });
        },
      });
    }

    try {
      updateActiveDotForIndex(index);
    } catch (e) {
      /* pagination not ready yet */
    }
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (currentUrl && featuredThumb && window.EduoozInlinePlayer)
        window.EduoozInlinePlayer.play(featuredThumb, currentUrl);
    });
  }

  function nextItem() {
    currentIndex = (currentIndex + 1) % playlistItems.length;
    updateFeatured(currentIndex);
  }

  function startAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextItem, 2000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Event delegation: survives the innerHTML rebuild above and any future
  // re-renders without needing per-item listeners.
  testiPlaylist.addEventListener("click", (e) => {
    const item = e.target.closest(".testi-playlist-item");
    if (!item || !testiPlaylist.contains(item)) return;
    const idxAttr = item.getAttribute("data-index");
    let index = idxAttr !== null ? parseInt(idxAttr, 10) : -1;
    if (isNaN(index) || index < 0) {
      index = Array.from(playlistItems).indexOf(item);
    }
    if (index < 0) return;
    currentIndex = index;
    updateFeatured(currentIndex);
    stopAutoPlay();
    setTimeout(startAutoPlay, 5000);
  });

  // --- Pagination dots: ~2 videos per dot ---
  const itemsPerDot = 2;
  const totalDots = Math.ceil(playlistItems.length / itemsPerDot);

  function buildDots() {
    testiDots.innerHTML = "";
    for (let d = 0; d < totalDots; d++) {
      const btn = document.createElement("button");
      btn.className = "testi-dot" + (d === 0 ? " active" : "");
      btn.setAttribute("aria-label", "Go to group " + (d + 1));
      btn.addEventListener("click", () => {
        const itemIndex = d * itemsPerDot;
        try {
          const cs = window.getComputedStyle(testiPlaylist);
          const playlistVisible =
            testiPlaylist.clientHeight > 0 && cs.display !== "none";
          const target = playlistItems[itemIndex];
          if (playlistVisible) {
            // Desktop/tablet: dot click scrolls the playlist only.
            if (target)
              testiPlaylist.scrollTo({
                top: target.offsetTop,
                behavior: "smooth",
              });
          } else {
            // Mobile (playlist hidden): dot click selects the featured video.
            updateFeatured(itemIndex);
          }
        } catch (e) {}
      });
      testiDots.appendChild(btn);
    }
  }

  function updateActiveDotForIndex(itemIndex) {
    const dotIndex = Math.floor(itemIndex / itemsPerDot);
    testiDots
      .querySelectorAll(".testi-dot")
      .forEach((d, i) => d.classList.toggle("active", i === dotIndex));
  }

  // Sync active dot on manual scroll (mouse wheel, trackpad, touch, scrollbar drag).
  let scrollSyncTimer = null;
  testiPlaylist.addEventListener("scroll", () => {
    if (scrollSyncTimer) clearTimeout(scrollSyncTimer);
    scrollSyncTimer = setTimeout(() => {
      let firstVisible = 0;
      const parentRect = testiPlaylist.getBoundingClientRect();
      for (let i = 0; i < playlistItems.length; i++) {
        const rect = playlistItems[i].getBoundingClientRect();
        if (rect.top >= parentRect.top - 4) {
          firstVisible = i;
          break;
        }
      }
      updateActiveDotForIndex(firstVisible);
    }, 120);
  });

  // --- Single thin scroll indicator (discoverability, light theme) ---
  let indicator = wrap.querySelector(".testi-scroll-indicator");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.className = "testi-scroll-indicator";
    indicator.innerHTML = '<div class="track"><div class="thumb"></div></div>';
    wrap.appendChild(indicator);
  }
  const indicatorThumb = indicator.querySelector(".thumb");
  function updateIndicator() {
    const sh = testiPlaylist.scrollHeight;
    const ch = testiPlaylist.clientHeight;
    if (!indicator || !indicatorThumb) return;
    if (sh <= ch) {
      indicator.style.display = "none";
      return;
    }
    indicator.style.display = "block";
    const trackHeight = indicator.getBoundingClientRect().height;
    const thumbHeight = Math.max(24, (ch / sh) * trackHeight);
    const maxTop = Math.max(0, trackHeight - thumbHeight);
    const top = (testiPlaylist.scrollTop / Math.max(1, sh - ch)) * maxTop;
    indicatorThumb.style.height = thumbHeight + "px";
    indicatorThumb.style.transform = "translateY(" + top + "px)";
  }
  testiPlaylist.addEventListener("scroll", updateIndicator, { passive: true });
  window.addEventListener("resize", updateIndicator);

  buildDots();
  testiPlaylist.scrollTop = 0;
  updateFeatured(0, true);
  updateIndicator();

  // Pause autoplay while interacting with the featured card or playlist.
  const playlistSection = testiPlaylist;
  testiFeatured.addEventListener("mouseenter", stopAutoPlay);
  testiFeatured.addEventListener("mouseleave", startAutoPlay);
  playlistSection.addEventListener("mouseenter", stopAutoPlay);
  playlistSection.addEventListener("mouseleave", startAutoPlay);

  // Let native scrolling work inside the playlist without the global
  // smooth-scroller (Lenis) hijacking wheel/touch input.
  playlistSection.addEventListener("mouseenter", () => {
    try {
      if (window.lenis && typeof window.lenis.stop === "function")
        window.lenis.stop();
    } catch (e) {}
  });
  playlistSection.addEventListener("mouseleave", () => {
    try {
      if (window.lenis && typeof window.lenis.start === "function")
        window.lenis.start();
    } catch (e) {}
  });
  playlistSection.addEventListener(
    "touchstart",
    () => {
      try {
        if (window.lenis && typeof window.lenis.stop === "function")
          window.lenis.stop();
      } catch (e) {}
    },
    { passive: true },
  );
  playlistSection.addEventListener("touchend", () => {
    try {
      if (window.lenis && typeof window.lenis.start === "function")
        window.lenis.start();
    } catch (e) {}
  });
  playlistSection.addEventListener(
    "wheel",
    (e) => {
      try {
        const delta = e.deltaY;
        const atTop = playlistSection.scrollTop === 0;
        const atBottom =
          Math.ceil(playlistSection.scrollTop + playlistSection.clientHeight) >=
          playlistSection.scrollHeight;
        if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) {
          e.stopPropagation();
        }
      } catch (err) {}
    },
    { passive: true },
  );

  // Fallback: if a global smooth-scroller captures wheel events at the
  // document level, still let the playlist scroll natively.
  document.addEventListener(
    "wheel",
    function (e) {
      try {
        if (!testiPlaylist.contains(e.target)) return;
        const delta = e.deltaY;
        const atTop = testiPlaylist.scrollTop === 0;
        const atBottom =
          Math.ceil(testiPlaylist.scrollTop + testiPlaylist.clientHeight) >=
          testiPlaylist.scrollHeight;
        if ((delta > 0 && !atBottom) || (delta < 0 && !atTop)) {
          e.preventDefault();
          e.stopPropagation();
          testiPlaylist.scrollTop += delta;
        }
      } catch (err) {}
    },
    { passive: false, capture: true },
  );

  startAutoPlay();
})();

// --- YouTube Carousel ---
(function () {
  const track = document.getElementById("ytTrack");
  const viewport = document.getElementById("ytViewport");
  const prevBtn = document.getElementById("ytPrev");
  const nextBtn = document.getElementById("ytNext");
  const dotsEl = document.getElementById("ytDots");
  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".yt-card"));
  let currentIndex = 0;

  function getSlidesVisible() {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 991) return 2;
    return 3;
  }

  function getTotal() {
    return Math.ceil(cards.length / getSlidesVisible());
  }

  // Build dots
  function buildDots() {
    dotsEl.innerHTML = "";
    const total = getTotal();
    for (let i = 0; i < total; i++) {
      const d = document.createElement("button");
      d.className = "yt-dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function updateDots() {
    const dotBtns = dotsEl.querySelectorAll(".yt-dot");
    dotBtns.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  }

  function goTo(index) {
    const slidesVisible = getSlidesVisible();
    const total = getTotal();
    currentIndex = Math.max(0, Math.min(index, total - 1));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24;
    const slideOffset = currentIndex * slidesVisible * (cardWidth + gap);
    track.style.transform = `translateX(-${slideOffset}px)`;

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= total - 1;
    updateDots();
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  buildDots();
  goTo(0);
  window.addEventListener("resize", () => {
    buildDots();
    goTo(0);
  });
})();

// Animations
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  if (window.lenis) return;
  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.utils.toArray(".g-reveal").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 85%" },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  });

  // Placement stat cards entrance
  gsap.utils.toArray(".placement-stat-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 88%" },
      y: 40,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.1,
      ease: "power2.out",
    });
  });

  const tl = gsap.timeline();
  tl.from(".glass-pill", { opacity: 0, y: 20, duration: 0.6 })
    .from(".hero-title-main", { opacity: 0, y: 30, duration: 0.8 }, "-=0.3")
    .from(".hero-desc", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
    .from(".cta-cluster", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5");
});

/* ==================================================================================
   exam-landing.js — Data-driven exam page renderer (reads window.EXAM_CONFIG)
   ================================================================================== */
/**
 * Exam Landing Page — Dynamic Renderer & Interactivity
 * Reads window.EXAM_CONFIG and populates all sections
 */
document.addEventListener("DOMContentLoaded", () => {
  const CONFIG = window.EXAM_CONFIG;
  if (!CONFIG) {
    console.warn("EXAM_CONFIG not found.");
    return;
  }

  // --- 1. RENDER EXAM SNAPSHOT ---
  function renderSnapshot() {
    const grids = Array.from(
      document.querySelectorAll(".exam-snapshot-section .snapshot-grid"),
    );
    if (!grids.length) return;

    grids.forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll(".snapshot-card"));

      if (!cards.length && CONFIG.snapshot) {
        const items = CONFIG.snapshot;
        grid.innerHTML = items
          .map(
            (item) => `
              <div class="snapshot-card g-exam-reveal">
                <div class="snap-icon"><i class="${item.icon}"></i></div>
                <div class="snap-label">${item.label}</div>
                <div class="snap-value">${item.link ? `<a href="${item.link}" target="_blank">${item.value}</a>` : item.value}</div>
              </div>
            `,
          )
          .join("");
      }

      initSnapshotCarousel(grid);
    });

    function initSnapshotCarousel(grid) {
      const cards = Array.from(grid.querySelectorAll(".snapshot-card"));
      if (!cards.length) return;

      const existingPager = grid.parentNode.querySelector(".snapshot-dots");
      const dotsEl = existingPager || document.createElement("div");
      dotsEl.className = "snapshot-dots";

      if (!existingPager) {
        grid.parentNode.insertBefore(dotsEl, grid.nextSibling);
      } else {
        dotsEl.innerHTML = "";
      }

      function setActiveDot(index) {
        dotsEl.querySelectorAll("button").forEach((btn, i) => {
          btn.classList.toggle("active", i === index);
        });
      }

      function scrollToCard(index) {
        const card = cards[index];
        if (!card) return;
        card.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }

      cards.forEach((card, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to snapshot ${index + 1}`);
        dot.addEventListener("click", () => scrollToCard(index));
        dotsEl.appendChild(dot);
      });

      function updateActiveDot() {
        if (!window.matchMedia("(max-width: 480px)").matches) {
          dotsEl
            .querySelectorAll("button")
            .forEach((btn) => btn.classList.remove("active"));
          return;
        }

        const gridRect = grid.getBoundingClientRect();
        const center = gridRect.left + gridRect.width / 2;
        let bestIndex = 0;
        let bestDistance = Infinity;

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(cardCenter - center);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
          }
        });

        setActiveDot(bestIndex);
      }

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            let bestEntry = null;
            let bestRatio = 0;

            entries.forEach((entry) => {
              if (entry.intersectionRatio > bestRatio) {
                bestRatio = entry.intersectionRatio;
                bestEntry = entry;
              }
            });

            if (bestEntry) {
              const index = cards.indexOf(bestEntry.target);
              if (index >= 0) setActiveDot(index);
            }
          },
          {
            root: grid,
            threshold: [0.4, 0.5, 0.6, 0.75],
          },
        );

        cards.forEach((card) => observer.observe(card));
      } else {
        let scrollTimer = null;
        grid.addEventListener("scroll", () => {
          if (scrollTimer) clearTimeout(scrollTimer);
          scrollTimer = window.setTimeout(updateActiveDot, 50);
        });
      }

      if (!("IntersectionObserver" in window)) {
        grid.addEventListener("scroll", () =>
          requestAnimationFrame(updateActiveDot),
        );
      }

      window.addEventListener("resize", updateActiveDot);
      updateActiveDot();
    }
  }

  // --- 2. RENDER ABOUT SECTION (Video Carousel + Stat Counters) ---
  function renderAbout() {
    var track = document.getElementById("aev-track");
    var dotsWrap = document.getElementById("aev-dots");
    var prevBtn = document.getElementById("aev-prev");
    var nextBtn = document.getElementById("aev-next");
    var trackWrap = document.getElementById("aev-track-wrap");
    var statsEl = document.getElementById("aev-stats");

    if (!track) return;

    // Videos are grouped by course (nursing / pharmacy / mlt) in
    // window._eduoozData, defined at the top of this file — each course now
    // has its own YouTube channel, so no keyword or exam-slug matching is
    // needed. getCourseKey() detects the course from the page URL.
    var videos = (window._eduoozData && window._eduoozData[getCourseKey()]) || [];
    if (!videos.length) return;

    var current = 0;
    var isHovered = false;
    var autoTimer = null;
    var touchStartX = 0;

    /* ── Build cards ── */
    function buildCards() {
      track.innerHTML = videos
        .map(function (v, i) {
          return (
            '<a class="aev-card' +
            (i === 0 ? " aev-active" : "") +
            '"' +
            ' href="https://www.youtube.com/watch?v=' +
            v.id +
            '"' +
            ' target="_blank" rel="noopener" data-idx="' +
            i +
            '">' +
            '<img class="aev-thumb" loading="lazy"' +
            '  src="https://img.youtube.com/vi/' +
            v.id +
            '/maxresdefault.jpg"' +
            "  onerror=\"this.onerror=null;this.src='https://img.youtube.com/vi/" +
            v.id +
            "/hqdefault.jpg'\"" +
            '  alt="' +
            v.title +
            '">' +
            '<div class="aev-overlay"></div>' +
            '<div class="aev-play"><i class="fa-solid fa-play" style="margin-left:3px"></i></div>' +
            '<span class="aev-tag">' +
            v.tag +
            "</span>" +
            '<div class="aev-caption"><p class="aev-card-title">' +
            v.title +
            "</p></div>" +
            "</a>"
          );
        })
        .join("");

      buildDots();
      updateCarousel(false);
    }

    /* ── Dots ── */
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = videos
        .map(function (_, i) {
          return (
            '<button class="aev-dot' +
            (i === 0 ? " aev-dot-active" : "") +
            '" aria-label="Video ' +
            (i + 1) +
            '"></button>'
          );
        })
        .join("");
      dotsWrap.querySelectorAll(".aev-dot").forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          goTo(i);
        });
      });
    }

    /* ── Position track to center active card ── */
    function updateCarousel(animate) {
      var cards = track.querySelectorAll(".aev-card");
      if (!cards.length || !trackWrap) return;

      var containerW = trackWrap.offsetWidth;
      var cardW = cards[0].offsetWidth;
      var gap = 16;
      var peekOffset = (containerW - cardW) / 2;
      var offset = peekOffset - current * (cardW + gap);

      track.style.transition = animate
        ? "transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)"
        : "none";
      track.style.transform = "translateX(" + offset + "px)";

      cards.forEach(function (c, i) {
        c.classList.toggle("aev-active", i === current);
      });

      if (dotsWrap) {
        dotsWrap.querySelectorAll(".aev-dot").forEach(function (d, i) {
          d.classList.toggle("aev-dot-active", i === current);
        });
      }
    }

    function goTo(idx) {
      current = ((idx % videos.length) + videos.length) % videos.length;
      updateCarousel(true);
    }

    function next() {
      goTo(current + 1);
    }
    function prev() {
      goTo(current - 1);
    }

    /* ── Auto-slide ── */
    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        if (!isHovered) next();
      }, 4000);
    }

    /* ── Nav buttons ── */
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        next();
        startAuto();
      });
    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        prev();
        startAuto();
      });

    /* ── Play inline inside the card instead of navigating/opening a modal ── */
    track.addEventListener("click", function (e) {
      var card = e.target.closest(".aev-card");
      if (!card) return;
      e.preventDefault();
      if (window.EduoozInlinePlayer) window.EduoozInlinePlayer.play(card, card.href);
    });

    /* ── Hover pause ── */
    var carousel = document.getElementById("aev-carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", function () {
        isHovered = true;
      });
      carousel.addEventListener("mouseleave", function () {
        isHovered = false;
      });
    }

    /* ── Touch swipe ── */
    if (trackWrap) {
      trackWrap.addEventListener(
        "touchstart",
        function (e) {
          touchStartX = e.touches[0].clientX;
        },
        { passive: true },
      );
      trackWrap.addEventListener(
        "touchend",
        function (e) {
          var dx = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(dx) > 40) {
            if (dx < 0) next();
            else prev();
            startAuto();
          }
        },
        { passive: true },
      );
    }

    /* ── Recalculate on resize ── */
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updateCarousel(false);
      }, 150);
    });

    /* ── Animated stat counters (Intersection Observer) ── */
    if (statsEl) {
      var countersRun = false;
      var statsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !countersRun) {
              countersRun = true;
              statsEl.querySelectorAll(".aev-stat-num").forEach(function (el) {
                var target = parseInt(el.dataset.target, 10);
                var suffix = el.dataset.suffix || "";
                var prefix = el.dataset.prefix || "";
                var duration = 1600;
                var startTs = null;
                (function tick(ts) {
                  if (!startTs) startTs = ts;
                  var p = Math.min((ts - startTs) / duration, 1);
                  var ease = 1 - Math.pow(1 - p, 3);
                  el.textContent = prefix + Math.round(ease * target) + suffix;
                  if (p < 1) requestAnimationFrame(tick);
                })(performance.now());
              });
              statsObserver.disconnect();
            }
          });
        },
        { threshold: 0.5 },
      );
      statsObserver.observe(statsEl);
    }

    /* ── Init ── */
    buildCards();
    startAuto();
  }

  // --- 3. RENDER ELIGIBILITY CARDS (from window.courseEligibility.qualification) ---
  // Cards are now pre-rendered as static HTML for SEO; this only backfills
  // the track if a page hasn't been migrated to static markup yet.
  function renderEligibilityCards() {
    const track = document.getElementById("elig-col-track");
    const cfg = window.courseEligibility;
    if (!track || track.children.length) return;
    if (!cfg || !cfg.qualification || !cfg.qualification.length) return;

    track.innerHTML = cfg.qualification
      .map(
        (item) => `
            <div class="elig-card">
                <div class="elig-card-header">
                    <div class="elig-icon"><i class="${item.icon}"></i></div>
                    <h4>${item.title}</h4>
                </div>
                <p>${item.description}</p>
            </div>
        `,
      )
      .join("");
  }

  // --- 4. RENDER AGE RULES (from window.courseEligibility.ageRules) ---
  // Cards are now pre-rendered as static HTML for SEO; this only backfills
  // the track if a page hasn't been migrated to static markup yet.
  // initAgeExplorer() still runs separately (see PREMIUM INTERACTIONS below)
  // to bind the accordion toggle to the static cards.
  function renderAgeRules() {
    const track = document.getElementById("age-col-track");
    const cfg = window.courseEligibility;
    if (!track || track.children.length) return;
    if (!cfg || !cfg.ageRules || !cfg.ageRules.length) return;

    track.innerHTML = cfg.ageRules
      .map(
        (rule) => `
            <div class="age-explorer-card">
                <div class="age-explorer-front">
                    <div class="age-explorer-icon"><i class="${rule.icon || "fa-solid fa-user"}"></i></div>
                    <div class="age-explorer-info">
                        <h4>${rule.category}</h4>
                        <span class="age-badge">${rule.maxAge || rule.badge || "—"}</span>
                    </div>
                    <div class="age-explorer-toggle"><i class="fa-solid fa-chevron-down"></i></div>
                </div>
                <div class="age-explorer-detail"><p>${rule.description || rule.detail || ""}</p></div>
            </div>
        `,
      )
      .join("");

    initAgeExplorer();
  }

  // --- 5. ELIGIBILITY CHECKER — dynamic form builder + validation engine ---
  // --- 5. ELIGIBILITY CHECKER — field-driven form builder + validation engine ---

  function initEligibilityChecker() {
    const form = document.getElementById("elig-checker-form");
    const resultEl = document.getElementById("elig-result");
    if (!form || !resultEl) return;

    const rawCfg = window.eligibilityCheckerConfig;
    if (!rawCfg) return;

    const cfg = normalizeCheckerConfig(rawCfg);

    buildCheckerForm(form, cfg);
    initConditionalFields(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      runEligibilityCheck(form, resultEl, cfg);
    });
  }

  // Converts old-format config (acceptedQualifications as objects, acceptedCategories,
  // additionalFields) to the canonical field-driven format. Pages using fields[] pass through.
  function normalizeCheckerConfig(cfg) {
    if (cfg.fields && cfg.fields.length) return cfg;

    const fields = [];
    fields.push({
      type: "text",
      id: "name",
      label: "Full Name",
      required: true,
    });

    if (cfg.acceptedQualifications && cfg.acceptedQualifications.length) {
      const opts = cfg.acceptedQualifications.map((q) =>
        typeof q === "string" ? { value: q, label: q } : q,
      );
      if (cfg.showOtherQualification !== false) {
        opts.push({ value: "other", label: "Other / Not Listed" });
      }
      fields.push({
        type: "select",
        id: "qualification",
        label: "Qualification",
        required: true,
        options: opts,
      });
    }

    const needsReg = cfg.registrationRequired || cfg.showRegistration;
    if (needsReg) {
      fields.push({
        type: "select",
        id: "registration",
        label: cfg.registrationLabel || "Nursing Council Registration",
        required: true,
        options: [
          { value: "yes", label: "Yes – Active Registration" },
          { value: "no", label: "No" },
        ],
      });
    }

    if (cfg.acceptedCategories && cfg.acceptedCategories.length) {
      fields.push({
        type: "select",
        id: "category",
        label: "Caste / Category",
        required: true,
        options: cfg.acceptedCategories.map((c) => ({
          value: c.value,
          label: c.label,
        })),
      });
    }

    fields.push({
      type: "date",
      id: "dob",
      label: "Date of Birth",
      required: true,
    });

    (cfg.additionalFields || []).forEach((f) => {
      fields.push({ ...f, id: f.name || f.id });
    });

    // Derive baseMaxAge and ageRelaxation from absolute per-category maxAge values
    const baseMaxAge =
      cfg.baseMaxAge ||
      cfg.maxAge ||
      (cfg.acceptedCategories
        ? (cfg.acceptedCategories.find((c) => c.value === "general") || {})
            .maxAge || null
        : null);

    const ageRelaxation = {};
    if (cfg.ageRelaxation) {
      Object.assign(ageRelaxation, cfg.ageRelaxation);
    } else if (cfg.acceptedCategories) {
      cfg.acceptedCategories.forEach((c) => {
        ageRelaxation[c.value] =
          c.maxAge != null && baseMaxAge != null ? c.maxAge - baseMaxAge : 0;
      });
    }

    return {
      fields,
      minAge: cfg.minAge || 18,
      baseMaxAge,
      ageRelaxation,
      acceptedQualifications: (cfg.acceptedQualifications || []).map((q) =>
        typeof q === "string" ? q : q.value,
      ),
      registrationFieldId: needsReg ? "registration" : false,
    };
  }

  function buildCheckerForm(form, cfg) {
    const fields = cfg.fields || [];
    let html = "";
    let i = 0;

    while (i < fields.length) {
      const f = fields[i];
      const next = fields[i + 1];

      if (f.span === "full" || !next) {
        html += `<div class="form-row">${buildFieldHTML(f)}</div>`;
        i++;
      } else {
        html += `<div class="form-row">${buildFieldHTML(f)}${buildFieldHTML(next)}</div>`;
        i += 2;
      }
    }

    html += `<button type="submit" class="btn-check-elig">
      <i class="fa-solid fa-magnifying-glass"></i> Check Eligibility
    </button>`;

    form.innerHTML = html;
  }

  function buildFieldHTML(field) {
    const showWhenAttrs = field.showWhen
      ? ` data-show-when-field="${field.showWhen.field}" data-show-when-value="${field.showWhen.value}"`
      : "";
    const hiddenClass = field.showWhen ? " ec-hidden" : "";
    const fid = `ec-${field.id}`;
    let inputHTML = "";

    if (field.type === "select") {
      const opts = (field.options || [])
        .map((o) => `<option value="${o.value}">${o.label}</option>`)
        .join("");
      inputHTML = `<select id="${fid}" name="${field.id}"><option value="">Select…</option>${opts}</select>`;
    } else if (field.type === "date") {
      inputHTML = `<input type="date" id="${fid}" name="${field.id}" />`;
    } else if (field.type === "number") {
      inputHTML = `<input type="number" id="${fid}" name="${field.id}"
        placeholder="${field.placeholder || ""}"
        min="${field.min != null ? field.min : ""}"
        max="${field.max != null ? field.max : ""}" />`;
    } else {
      inputHTML = `<input type="text" id="${fid}" name="${field.id}"
        placeholder="${field.placeholder || "Enter " + field.label.toLowerCase()}" />`;
    }

    return `<div class="form-group${hiddenClass}"${showWhenAttrs}>
      <label for="${fid}">${field.label}</label>
      ${inputHTML}
    </div>`;
  }

  // Wire up showWhen conditional visibility — run once after form is built
  function initConditionalFields(form) {
    form.querySelectorAll("[data-show-when-field]").forEach((group) => {
      const controlEl = form.querySelector(
        `[name="${group.dataset.showWhenField}"]`,
      );
      if (!controlEl) return;

      function update() {
        const visible = controlEl.value === group.dataset.showWhenValue;
        group.classList.toggle("ec-hidden", !visible);
        if (!visible) {
          const input = group.querySelector("input, select");
          if (input) input.value = "";
        }
      }

      controlEl.addEventListener("change", update);
      update();
    });
  }

  function runEligibilityCheck(form, resultEl, cfg) {
    // Collect values from visible fields only
    const data = {};
    form
      .querySelectorAll(".form-group:not(.ec-hidden) [name]")
      .forEach((el) => {
        data[el.name] = el.value.trim();
      });

    // Required field check (visible fields only)
    const missing = (cfg.fields || [])
      .filter((f) => {
        if (!f.required) return false;
        if (f.showWhen && data[f.showWhen.field] !== f.showWhen.value)
          return false;
        return !data[f.id];
      })
      .map((f) => f.label);

    if (missing.length) {
      showResult(
        resultEl,
        "warning",
        buildResultHTML(
          "warning",
          "Incomplete Form",
          `Please fill in: <strong>${missing.join(", ")}</strong>`,
          null,
        ),
      );
      return;
    }

    // Age calculation
    let age = null;
    if (data.dob) {
      const birth = new Date(data.dob);
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    }

    // Age limit via relaxation engine: effectiveMax = baseMaxAge + relaxation[category]
    const category = data.category || "general";
    const relaxation = cfg.ageRelaxation
      ? (cfg.ageRelaxation[category] ?? 0)
      : 0;
    const effectiveMaxAge =
      cfg.baseMaxAge != null ? cfg.baseMaxAge + relaxation : null;
    const minAge = cfg.minAge || 18;

    // Resolve display labels from field definitions
    const fields = cfg.fields || [];
    const qualField = fields.find((f) => f.id === "qualification");
    const catField = fields.find((f) => f.id === "category");
    const qualLabel =
      (
        (qualField &&
          (qualField.options || []).find(
            (o) => o.value === data.qualification,
          )) ||
        {}
      ).label ||
      data.qualification ||
      "—";
    const catLabel =
      (
        (catField &&
          (catField.options || []).find((o) => o.value === category)) ||
        {}
      ).label || category;

    const regFieldId = cfg.registrationFieldId || false;
    const regField = regFieldId
      ? fields.find((f) => f.id === regFieldId)
      : null;
    const summary = {
      qualification: qualLabel,
      age: age != null ? `${age} yrs` : "—",
      ageLimit:
        effectiveMaxAge != null
          ? `${minAge}–${effectiveMaxAge} yrs${relaxation ? ` (base ${cfg.baseMaxAge} + ${relaxation} relaxation)` : ""}`
          : "—",
      registrationLabel: regField ? regField.label : "Registration",
      registration:
        data[regFieldId] === "yes"
          ? "Active"
          : data[regFieldId] === "no"
            ? "Not registered"
            : "—",
    };

    // --- Validation chain ---
    let status = null;
    let reason = null;

    // 1. Qualification
    if (
      cfg.acceptedQualifications &&
      cfg.acceptedQualifications.length &&
      !cfg.acceptedQualifications.includes(data.qualification)
    ) {
      status = "notEligible";
      reason = `Your qualification (<strong>${qualLabel}</strong>) does not meet the minimum requirement for this examination.`;
    }

    // 2. Registration
    if (!status && regFieldId && data[regFieldId] === "no") {
      status = "notEligible";
      reason = `A valid and active <strong>${summary.registrationLabel}</strong> is mandatory for this examination.`;
    }

    // 3. Age – minimum
    if (!status && age != null && age < minAge) {
      status = "notEligible";
      reason = `Minimum age is <strong>${minAge} years</strong>. Your calculated age is <strong>${age} years</strong>.`;
    }

    // 4. Age – maximum (warning, not hard fail — notification may have relaxations)
    if (
      !status &&
      age != null &&
      effectiveMaxAge != null &&
      age > effectiveMaxAge
    ) {
      status = "warning";
      reason = `Age limit for <strong>${catLabel}</strong> is <strong>${effectiveMaxAge} yrs</strong>. Your age is <strong>${age} yrs</strong>. Verify the official notification for any additional relaxations.`;
    }

    // 5. Custom rules array (window.customEligibilityRules)
    if (!status && Array.isArray(window.customEligibilityRules)) {
      for (const rule of window.customEligibilityRules) {
        try {
          const r = rule(data);
          if (!r) continue;
          const s =
            r.status ||
            (r.eligible === false ? "notEligible" : r.warn ? "warning" : null);
          if (s === "notEligible") {
            status = "notEligible";
            reason = r.reason;
            break;
          }
          if (s === "warning") {
            status = "warning";
            reason = r.reason;
            break;
          }
        } catch (e) {
          console.warn("[eligibility] custom rule error:", e);
        }
      }
    }

    // 6. Legacy single function — backward compat for pages not yet migrated
    if (!status && typeof window.customEligibilityCheck === "function") {
      try {
        const r = window.customEligibilityCheck(data);
        if (r && r.eligible === false) {
          status = "notEligible";
          reason = r.reason;
        } else if (r && (r.warn || r.status === "warning")) {
          status = "warning";
          reason = r.reason;
        }
      } catch (e) {
        console.warn("[eligibility] customEligibilityCheck error:", e);
      }
    }

    if (!status) {
      status = "eligible";
      reason = `You meet all the eligibility criteria for this examination. You are eligible to apply.`;
    }

    showResult(
      resultEl,
      status === "notEligible" ? "error" : status,
      buildResultHTML(status, null, reason, summary),
    );
  }

  function buildResultHTML(status, titleOverride, reason, summary) {
    const meta = {
      eligible: {
        icon: "fa-solid fa-circle-check",
        title: "Congratulations! You appear eligible.",
      },
      warning: {
        icon: "fa-solid fa-triangle-exclamation",
        title: "Please Verify Official Notification",
      },
      notEligible: { icon: "fa-solid fa-circle-xmark", title: "Not Eligible" },
    };
    const { icon, title } = meta[status] || meta.eligible;

    const summaryHTML = summary
      ? `<div class="elig-summary-grid">
          <div class="elig-summary-row">
            <span class="elig-summary-label">Qualification</span>
            <span class="elig-summary-value">${summary.qualification}</span>
          </div>
          <div class="elig-summary-row">
            <span class="elig-summary-label">Calculated Age</span>
            <span class="elig-summary-value">${summary.age}</span>
          </div>
          <div class="elig-summary-row">
            <span class="elig-summary-label">Age Limit</span>
            <span class="elig-summary-value">${summary.ageLimit}</span>
          </div>
          <div class="elig-summary-row">
            <span class="elig-summary-label">${summary.registrationLabel}</span>
            <span class="elig-summary-value">${summary.registration}</span>
          </div>
        </div>`
      : "";

    const confidence = `<p class="elig-confidence">Based on the eligibility criteria configured for this examination. Candidates should verify final eligibility using the official notification before applying.</p>`;

    return `<i class="${icon}"></i>
      <div class="elig-result-body">
        <strong>${titleOverride || title}</strong>
        ${reason ? `<p>${reason}</p>` : ""}
        ${summaryHTML}
        ${confidence}
      </div>`;
  }

  function showResult(el, type, html) {
    el.className = "elig-result show " + type;
    el.innerHTML = html;
  }

  // --- 6. RENDER SYLLABUS ---
  function renderSyllabus() {
    const grid = document.getElementById("syllabus-grid");
    if (!grid || !CONFIG.syllabus) return;

    grid.innerHTML = CONFIG.syllabus
      .map(
        (subject) => `
            <div class="subject-card g-exam-reveal" data-subject="${subject.name.toLowerCase()}">
                <h4>
                    <span class="subj-icon"><i class="${subject.icon || "fa-solid fa-book"}"></i></span>
                    ${subject.name}
                </h4>
                <ul>
                    ${subject.topics.map((t) => `<li><i class="fa-solid fa-chevron-right"></i> ${t}</li>`).join("")}
                </ul>
            </div>
        `,
      )
      .join("");

    // Search functionality
    const searchInput = document.getElementById("syllabus-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = grid.querySelectorAll(".subject-card");
        cards.forEach((card) => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(query) ? "" : "none";
        });
      });
    }
  }

  // --- 7. RENDER PREPARATION STEPS ---
  function renderPreparation() {
    const container = document.getElementById("prepare-timeline");
    if (!container || !CONFIG.preparation) return;

    container.innerHTML = CONFIG.preparation
      .map(
        (step, i) => `
            <div class="prepare-step g-exam-reveal" data-step="${String(i + 1).padStart(2, "0")}">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
                ${step.duration ? `<span class="step-duration"><i class="fa-regular fa-clock"></i> ${step.duration}</span>` : ""}
            </div>
        `,
      )
      .join("");
  }

  // --- 8. RENDER EXAM PROCESS ---
  function renderProcess() {
    const flow = document.getElementById("process-flow");
    if (!flow || !CONFIG.examProcess) return;

    flow.innerHTML = CONFIG.examProcess
      .map(
        (node) => `
            <div class="process-node g-exam-reveal">
                <div class="node-circle"><i class="${node.icon}"></i></div>
                <div>
                    <h5>${node.title}</h5>
                    <span>${node.subtitle || ""}</span>
                </div>
            </div>
        `,
      )
      .join("");
  }

  // --- 9. RENDER WHY EDUOOZ ---
  function renderWhyEduooz() {
    const grid = document.getElementById("why-grid");
    if (!grid || !CONFIG.whyEduooz) return;

    grid.innerHTML = CONFIG.whyEduooz
      .map(
        (item) => `
            <div class="why-card g-exam-reveal">
                <div class="why-icon"><i class="${item.icon}"></i></div>
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            </div>
        `,
      )
      .join("");
  }

  // --- 10c. QP EXPLORER — New unified question-papers design (qp- prefix) ---
  function initQPExplorer() {
    var cardGrid = document.querySelector(".qp-card-grid");
    if (!cardGrid) return;

    var iframe = document.getElementById("qp-iframe");
    var skeleton = document.getElementById("qp-skeleton");
    var emptyState = document.getElementById("qp-empty-state");
    var lockedState = document.getElementById("qp-locked-state");
    var lockedTitle = document.getElementById("qp-locked-title");
    var infoYear = document.getElementById("qp-info-year");
    var infoTitle = document.getElementById("qp-info-title");
    var dlBtn = document.getElementById("qp-download-btn");
    var zoomLbl = document.getElementById("qp-zoom-label");
    var noResults = document.getElementById("qp-no-results");
    var tabsEl = document.querySelector(".qp-year-tabs");
    var toolbarActions = document.querySelector(".qp-toolbar-actions");
    var frameWrap = document.querySelector(".qp-frame-wrap");
    var currentZoom = 100;

    /* ── Subscription-gate state ── */
    var SUB_STORAGE_KEY = "previousPaperSubscribed";
    var isSubscribed = sessionStorage.getItem(SUB_STORAGE_KEY) === "true";
    var selectedPaper = null; /* { pdfUrl, downloadUrl, title, year } */
    var lastFocusedEl = null;

    /* ── Mobile inline preview placement ──
       Reuses the existing single-column card-grid breakpoint (768px) —
       the same breakpoint that already turns .qp-card-grid into one
       column — as the desktop/mobile boundary for this feature. */
    var explorerEl = document.querySelector(".qp-explorer");
    var libraryPanel = document.querySelector(".qp-library-panel");
    var previewPanel = document.querySelector(".qp-preview-panel");
    var MOBILE_MQ = window.matchMedia("(max-width: 768px)");

    function isMobileLayout() {
      return MOBILE_MQ.matches;
    }

    function placePreviewForDesktop() {
      if (!previewPanel || !libraryPanel || !explorerEl) return;
      if (
        previewPanel.parentElement !== explorerEl ||
        previewPanel.nextElementSibling !== libraryPanel
      ) {
        libraryPanel.insertAdjacentElement("beforebegin", previewPanel);
      }
    }

    function detachPreviewPanel() {
      if (previewPanel && previewPanel.parentNode) previewPanel.remove();
    }

    function placePreviewAfterCard(card) {
      if (!previewPanel || !card) return;
      if (card.nextElementSibling !== previewPanel) {
        card.insertAdjacentElement("afterend", previewPanel);
      }
      requestAnimationFrame(function () {
        if (previewPanel.isConnected)
          previewPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }

    function syncPreviewPlacement() {
      if (!isMobileLayout()) {
        placePreviewForDesktop();
        return;
      }
      var activeCard = cardGrid.querySelector(".qp-card.qp-active");
      if (selectedPaper && activeCard && activeCard.style.display !== "none") {
        placePreviewAfterCard(activeCard);
      } else {
        detachPreviewPanel();
      }
    }

    if (typeof MOBILE_MQ.addEventListener === "function") {
      MOBILE_MQ.addEventListener("change", syncPreviewPlacement);
    } else if (typeof MOBILE_MQ.addListener === "function") {
      MOBILE_MQ.addListener(syncPreviewPlacement); /* legacy Safari fallback */
    }

    /* ── Build subscription lock overlay (blur + Subscribe/Download) ── */
    var subLock = null,
      subBtn = null,
      subDlBtn = null;
    if (frameWrap && !document.getElementById("qp-sub-lock")) {
      frameWrap.insertAdjacentHTML(
        "beforeend",
        '<div class="qp-sub-lock" id="qp-sub-lock">' +
          '<div class="qp-sub-lock-inner">' +
          '<div class="qp-sub-lock-icon"><i class="fa-solid fa-lock"></i></div>' +
          '<p class="qp-sub-lock-title">Subscribe to unlock this paper</p>' +
          '<p class="qp-sub-lock-sub">This paper is selected and ready — subscribe to view and download the full PDF.</p>' +
          '<div class="qp-sub-lock-actions">' +
          '<button type="button" class="qp-sub-btn" id="qp-sub-btn"><i class="fa-solid fa-envelope-open-text"></i> Subscribe</button>' +
          '<button type="button" class="qp-sub-dl-btn" id="qp-sub-dl-btn" aria-disabled="true"><i class="fa-solid fa-download"></i> Download</button>' +
          "</div>" +
          "</div>" +
          "</div>",
      );
    }
    if (frameWrap) {
      subLock = document.getElementById("qp-sub-lock");
      subBtn = document.getElementById("qp-sub-btn");
      subDlBtn = document.getElementById("qp-sub-dl-btn");
    }

    /* ── Build toolbar "Subscribed" status badge ── */
    var subscribedBadge = null;
    if (toolbarActions && dlBtn && !document.getElementById("qp-tbtn-subscribed")) {
      dlBtn.insertAdjacentHTML(
        "beforebegin",
        '<span class="qp-tbtn-subscribed" id="qp-tbtn-subscribed" title="Subscribed">' +
          '<i class="fa-solid fa-circle-check"></i> Subscribed</span>',
      );
    }
    if (toolbarActions) subscribedBadge = document.getElementById("qp-tbtn-subscribed");
    if (subscribedBadge && isSubscribed) subscribedBadge.classList.add("qp-show");

    /* ── Build lead-enquiry subscribe modal (reuses .glass-form/.lead-form) ── */
    var leadModalOverlay = document.getElementById("qp-lead-modal-overlay");
    if (!leadModalOverlay) {
      document.body.insertAdjacentHTML(
        "beforeend",
        '<div class="qp-lead-modal-overlay" id="qp-lead-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="qp-lead-modal-title">' +
          '<div class="qp-lead-modal-content">' +
          '<button type="button" class="qp-lead-modal-close" id="qp-lead-modal-close" aria-label="Close subscribe form"><i class="fa-solid fa-xmark"></i></button>' +
          '<div class="qp-lead-modal-header">' +
          '<span class="qp-lead-modal-eyebrow"><i class="fa-solid fa-lock"></i> Unlock Full Access</span>' +
          '<h3 class="qp-lead-modal-title" id="qp-lead-modal-title">Subscribe to view &amp; download</h3>' +
          "<p class=\"qp-lead-modal-sub\">Share your details and we'll unlock the full question paper preview and download instantly.</p>" +
          "</div>" +
          '<form class="glass-form lead-form" id="qp-lead-modal-form">' +
          '<div class="form-row">' +
          '<div class="input-group"><input type="text" name="name" required placeholder="Full Name"></div>' +
          '<div class="input-group"><input type="tel" name="phone" required placeholder="Phone Number"></div>' +
          "</div>" +
          '<div class="input-group"><input type="email" name="email" placeholder="Email Address"></div>' +
          '<div class="input-group select-wrapper">' +
          '<select name="course" required>' +
          '<option value="" disabled selected>Select Course Category</option>' +
          '<option value="nursing">Nursing Coaching</option>' +
          '<option value="pharmacy">Pharmacist Exams</option>' +
          '<option value="mlt">Lab Technician Courses</option>' +
          '<option value="german">German Languages</option>' +
          "</select>" +
          '<i class="fa-solid fa-chevron-down select-icon"></i>' +
          "</div>" +
          '<div class="input-group"><textarea name="message" rows="3" placeholder="How can we help you?"></textarea></div>' +
          '<input type="hidden" name="source" value="Previous Year Question Paper">' +
          '<input type="hidden" name="paperTitle" value="">' +
          '<input type="hidden" name="paperYear" value="">' +
          '<button type="submit" class="btn-form-submit">Submit &amp; Unlock <i class="fa-solid fa-unlock" style="margin-left:8px;"></i></button>' +
          "</form>" +
          "</div>" +
          "</div>",
      );
      leadModalOverlay = document.getElementById("qp-lead-modal-overlay");
    }
    var leadModalContent = leadModalOverlay
      ? leadModalOverlay.querySelector(".qp-lead-modal-content")
      : null;
    var leadModalForm = document.getElementById("qp-lead-modal-form");
    var leadModalClose = document.getElementById("qp-lead-modal-close");

    function onModalKeydown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLeadModal();
        return;
      }
      if (e.key === "Tab" && leadModalContent) {
        var focusables = leadModalContent.querySelectorAll(
          "input, select, textarea, button:not([disabled])",
        );
        if (!focusables.length) return;
        var first = focusables[0],
          last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function openLeadModal() {
      if (!leadModalOverlay) return;
      lastFocusedEl = document.activeElement;
      if (leadModalForm) {
        if (leadModalForm.elements["paperTitle"])
          leadModalForm.elements["paperTitle"].value = selectedPaper
            ? selectedPaper.title
            : "";
        if (leadModalForm.elements["paperYear"])
          leadModalForm.elements["paperYear"].value = selectedPaper
            ? selectedPaper.year
            : "";
      }
      leadModalOverlay.classList.add("qp-active");
      document.body.classList.add("qp-modal-open");
      document.addEventListener("keydown", onModalKeydown);
      var firstField = leadModalForm
        ? leadModalForm.querySelector("input, select, textarea")
        : null;
      if (firstField) firstField.focus();
    }

    function closeLeadModal() {
      if (!leadModalOverlay) return;
      leadModalOverlay.classList.remove("qp-active");
      document.body.classList.remove("qp-modal-open");
      document.removeEventListener("keydown", onModalKeydown);
      if (lastFocusedEl && typeof lastFocusedEl.focus === "function")
        lastFocusedEl.focus();
    }

    if (leadModalClose) leadModalClose.addEventListener("click", closeLeadModal);
    if (leadModalOverlay) {
      leadModalOverlay.addEventListener("click", function (e) {
        if (e.target === leadModalOverlay) closeLeadModal();
      });
    }
    if (subBtn) subBtn.addEventListener("click", openLeadModal);

    /* ── Filename helper for real downloads ── */
    function makeDownloadFilename(title) {
      var base = (title || "question-paper")
        .trim()
        .replace(/[^\w-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      return (base || "question-paper") + ".pdf";
    }

    /* ── Reflect current subscription state onto the preview/toolbar ── */
    function applyAccessState() {
      if (subscribedBadge) subscribedBadge.classList.toggle("qp-show", isSubscribed);

      if (!selectedPaper || !selectedPaper.pdfUrl) {
        if (subLock) subLock.classList.remove("qp-show");
        return;
      }

      if (isSubscribed) {
        if (subLock) subLock.classList.remove("qp-show");
        if (dlBtn) {
          dlBtn.href = selectedPaper.downloadUrl;
          dlBtn.setAttribute("download", makeDownloadFilename(selectedPaper.title));
          dlBtn.removeAttribute("target");
          dlBtn.removeAttribute("aria-disabled");
          dlBtn.style.opacity = "";
          dlBtn.style.pointerEvents = "";
        }
      } else {
        if (subLock) subLock.classList.add("qp-show");
        if (dlBtn) {
          dlBtn.setAttribute("href", "#");
          dlBtn.setAttribute("aria-disabled", "true");
          dlBtn.removeAttribute("download");
          dlBtn.style.opacity = "";
          dlBtn.style.pointerEvents = "";
        }
      }
    }

    function unlockSubscription() {
      isSubscribed = true;
      sessionStorage.setItem(SUB_STORAGE_KEY, "true");
      applyAccessState();
    }

    if (leadModalForm) {
      leadModalForm.addEventListener("leadFormSuccess", function () {
        closeLeadModal();
        unlockSubscription();
      });
      leadModalForm.addEventListener("leadFormError", function () {
        /* keep modal open, PDF stays locked — forms.js already surfaced the error */
      });
    }

    if (subDlBtn) {
      subDlBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (!isSubscribed) {
          openLeadModal();
          return;
        }
        if (dlBtn) dlBtn.click();
      });
    }

    if (dlBtn) {
      dlBtn.addEventListener("click", function (e) {
        if (!selectedPaper || !selectedPaper.pdfUrl) {
          e.preventDefault();
          return;
        }
        if (!isSubscribed) {
          e.preventDefault();
          openLeadModal();
        }
      });
    }

    /* ── Initial idle state ── */
    function resetToIdle() {
      if (emptyState) emptyState.classList.remove("qp-hidden");
      if (lockedState) lockedState.classList.remove("qp-show");
      if (skeleton) skeleton.classList.remove("qp-show");
      if (subLock) subLock.classList.remove("qp-show");
      if (iframe) {
        iframe.classList.remove("qp-loaded");
        iframe.src = "";
      }
    }
    resetToIdle();

    /* ── Zoom ── */
    function setZoom(z) {
      currentZoom = Math.max(60, Math.min(200, z));
      if (iframe) {
        iframe.style.transform = "scale(" + currentZoom / 100 + ")";
        iframe.style.transformOrigin = "top center";
      }
      if (zoomLbl) zoomLbl.textContent = currentZoom + "%";
    }
    var zIn = document.getElementById("qp-zoom-in");
    var zOut = document.getElementById("qp-zoom-out");
    if (zIn)
      zIn.addEventListener("click", function () {
        setZoom(currentZoom + 20);
      });
    if (zOut)
      zOut.addEventListener("click", function () {
        setZoom(currentZoom - 20);
      });

    /* ── Fullscreen ── */
    var fsBtn = document.getElementById("qp-fullscreen-btn");
    if (fsBtn) {
      fsBtn.addEventListener("click", function () {
        var card = document.getElementById("qp-preview-card");
        if (!card) return;
        if (document.fullscreenElement) {
          document.exitFullscreen();
          fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        } else {
          if (card.requestFullscreen) card.requestFullscreen();
          fsBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        }
      });
    }

    /* ── Load preview ── */
    function loadPreview(pdfUrl, year, title, downloadUrl) {
      if (infoYear) infoYear.textContent = year || "";
      if (infoTitle) infoTitle.textContent = title || "";

      if (!pdfUrl) {
        selectedPaper = null;
        /* No PDF — show Coming Soon state */
        if (emptyState) emptyState.classList.add("qp-hidden");
        if (skeleton) skeleton.classList.remove("qp-show");
        if (subLock) subLock.classList.remove("qp-show");
        if (lockedTitle) lockedTitle.textContent = "Coming Soon";
        var lockedSub = lockedState
          ? lockedState.querySelector(".qp-state-sub")
          : null;
        if (lockedSub)
          lockedSub.textContent = "This question paper will be available soon.";
        var lockedDlBtn = document.getElementById("qp-locked-dl-btn");
        if (lockedDlBtn) lockedDlBtn.style.display = "none";
        if (lockedState) lockedState.classList.add("qp-show");
        if (iframe) {
          iframe.classList.remove("qp-loaded");
          iframe.src = "";
        }
        if (dlBtn) {
          dlBtn.removeAttribute("href");
          dlBtn.style.opacity = "0.38";
          dlBtn.style.pointerEvents = "none";
        }
        return;
      }

      /* Has PDF — load in iframe */
      selectedPaper = {
        pdfUrl: pdfUrl,
        year: year,
        title: title,
        downloadUrl: downloadUrl || pdfUrl,
      };
      if (emptyState) emptyState.classList.add("qp-hidden");
      if (lockedState) lockedState.classList.remove("qp-show");
      if (skeleton) skeleton.classList.add("qp-show");
      if (iframe) {
        iframe.classList.remove("qp-loaded");
        iframe.src = "";
        setTimeout(function () {
          iframe.onload = function () {
            if (skeleton) skeleton.classList.remove("qp-show");
            iframe.classList.add("qp-loaded");
          };
          iframe.onerror = function () {
            if (skeleton) skeleton.classList.remove("qp-show");
          };
          iframe.src = pdfUrl;
        }, 100);
      }
      applyAccessState();
    }

    /* ── Card click ── */
    function activateCard(card) {
      cardGrid.querySelectorAll(".qp-card").forEach(function (c) {
        c.classList.remove("qp-active");
        var b = c.querySelector(".qp-preview-badge");
        if (b && c.dataset.pdf) b.textContent = "Preview Available";
      });
      card.classList.add("qp-active");
      var activeBadge = card.querySelector(".qp-preview-badge");
      if (activeBadge && card.dataset.pdf)
        activeBadge.textContent = "Previewing";

      var pdfUrl = card.dataset.pdf || "";
      var title =
        card.dataset.title ||
        (card.querySelector(".qp-card-title")
          ? card.querySelector(".qp-card-title").textContent.trim()
          : "");
      var year =
        card.dataset.year ||
        (card.querySelector(".qp-card-year")
          ? card.querySelector(".qp-card-year").textContent.trim()
          : "");
      var downloadUrl = card.dataset.download || pdfUrl;

      loadPreview(pdfUrl, year, title, downloadUrl);

      if (isMobileLayout()) placePreviewAfterCard(card);
    }

    cardGrid.querySelectorAll(".qp-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        // Cards contain a real <a href> (added for crawlability) over the
        // title so search engines can discover the PDF directly; prevent
        // its default navigation so a human click still opens the in-page
        // preview exactly as before, instead of leaving the page.
        e.preventDefault();
        activateCard(card);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activateCard(card);
        }
      });
    });

    /* ── Update badge text for cards without a PDF ── */
    cardGrid.querySelectorAll(".qp-card").forEach(function (card) {
      var badge = card.querySelector(".qp-preview-badge");
      if (badge && !card.dataset.pdf) {
        badge.textContent = "Coming Soon";
      }
    });

    /* ── Year filter tabs ── */
    function applyFilter(year) {
      var anyVisible = false;
      cardGrid.querySelectorAll(".qp-card").forEach(function (card) {
        var cardYear =
          card.dataset.year ||
          (card.querySelector(".qp-card-year")
            ? card.querySelector(".qp-card-year").textContent.trim()
            : "");
        var visible = year === "all" || cardYear === year;
        card.style.display = visible ? "" : "none";
        if (visible) anyVisible = true;
      });
      if (noResults) noResults.classList.toggle("qp-show", !anyVisible);

      if (isMobileLayout() && selectedPaper) {
        var activeCard = cardGrid.querySelector(".qp-card.qp-active");
        if (!activeCard || activeCard.style.display === "none") {
          detachPreviewPanel();
        }
      }
    }

    if (tabsEl) {
      tabsEl.addEventListener("click", function (e) {
        var btn = e.target.closest(".qp-year-tab");
        if (!btn) return;
        tabsEl.querySelectorAll(".qp-year-tab").forEach(function (t) {
          t.classList.remove("active");
        });
        btn.classList.add("active");
        applyFilter(btn.dataset.year || "all");
      });
    }

    /* Everything above must finish wiring while the preview panel is
       still attached to the document (so document.getElementById lookups
       inside it resolve). Only now, at the very end, detach it for the
       mobile idle state — moving/detaching it never re-runs any of the
       setup above. */
    if (isMobileLayout()) detachPreviewPanel();
  }

  // --- 11. RENDER PRACTICE TESTS ---
  function renderPracticeTests() {
    const grid = document.getElementById("practice-grid");
    if (!grid || !CONFIG.practiceTests) return;

    grid.innerHTML = CONFIG.practiceTests
      .map(
        (test) => `
            <div class="practice-card g-exam-reveal">
                <div class="practice-header">
                    <span class="difficulty-badge ${test.difficulty}">${test.difficulty}</span>
                </div>
                <h4>${test.title}</h4>
                <div class="practice-meta">
                    <span><i class="fa-regular fa-circle-question"></i> ${test.questions} Questions</span>
                    <span><i class="fa-regular fa-clock"></i> ${test.duration}</span>
                </div>
                <a href="${test.url || "#"}" class="btn-start-test">
                    <i class="fa-solid fa-play"></i> Start Test
                </a>
            </div>
        `,
      )
      .join("");
  }

  // --- 13. RENDER RELATED RESOURCES ---
  function renderResources() {
    const container = document.getElementById("resources-pills");
    if (!container || !CONFIG.relatedResources) return;

    container.innerHTML = CONFIG.relatedResources
      .map(
        (res) => `
            <a href="${res.url || "#"}" class="resource-pill">
                <i class="${res.icon}"></i> ${res.label}
            </a>
        `,
      )
      .join("");
  }

  // --- 14. RENDER FAQ ---
  function renderFAQ() {
    const container = document.getElementById("faq-accordion");
    if (!container || !CONFIG.faqs) return;

    const half = Math.ceil(CONFIG.faqs.length / 2);
    const col1 = CONFIG.faqs.slice(0, half);
    const col2 = CONFIG.faqs.slice(half);

    function renderColumn(items, startIdx) {
      return items
        .map(
          (faq, i) => `
                <div class="faq-item">
                    <button class="faq-question">
                        <span class="faq-num">${String(startIdx + i + 1).padStart(2, "0")}</span>
                        <span class="faq-text">${faq.question}</span>
                        <div class="faq-toggle">
                            <div class="horizontal-line"></div>
                            <div class="vertical-line"></div>
                        </div>
                    </button>
                    <div class="faq-answer-wrapper">
                        <div class="faq-answer-inner">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                </div>
            `,
        )
        .join("");
    }

    container.innerHTML = `
            <div class="faq-column">${renderColumn(col1, 0)}</div>
            <div class="faq-column">${renderColumn(col2, half)}</div>
        `;
  }

  // --- 15. STICKY NAVIGATION ---
  function initStickyNav() {
    const nav = document.getElementById("exam-sticky-nav");
    if (!nav) return;

    document.body.classList.add("has-sticky-nav");

    const links = nav.querySelectorAll('.esn-btn[href^="#"]');
    const sectionMap = [];

    links.forEach((link) => {
      const id = link.getAttribute("href").substring(1);
      const section = document.getElementById(id);
      if (section) sectionMap.push({ link, section, id });
    });

    if (!sectionMap.length) return;

    let currentActiveId = null;
    let clickScrollTarget = null;
    let clickScrollTimer = null;

    // Apply active class with deduplication to prevent unnecessary DOM writes
    function setActive(id) {
      if (currentActiveId === id) return;
      currentActiveId = id;
      links.forEach((l) => l.classList.remove("active"));
      const activeLink = nav.querySelector(`.esn-btn[href="#${id}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
        // On mobile horizontal bar, scroll active item into view
        if (window.innerWidth <= 1024) {
          const track = nav.querySelector(".esn-track");
          const item = activeLink.closest(".esn-item");
          if (track && item) {
            const trackRect = track.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            const center =
              track.scrollLeft +
              (itemRect.left - trackRect.left) -
              trackRect.width / 2 +
              itemRect.width / 2;
            track.scrollTo({ left: center, behavior: "smooth" });
          }
        }
      }
    }

    // Fallback: find the section whose center is nearest to viewport center
    function getActiveSectionByPosition() {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;

      if (scrollY < 50) return sectionMap[0].id;
      if (scrollY + viewportH >= document.documentElement.scrollHeight - 80) {
        return sectionMap[sectionMap.length - 1].id;
      }

      const viewportMid = scrollY + viewportH * 0.5;
      let bestId = sectionMap[0].id;
      let bestDist = Infinity;

      sectionMap.forEach(({ section, id }) => {
        const sMid = section.offsetTop + section.offsetHeight * 0.5;
        const dist = Math.abs(viewportMid - sMid);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = id;
        }
      });

      return bestId;
    }

    // Smooth scroll + ripple on click
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const ripple = document.createElement("span");
        ripple.className = "esn-ripple";
        link.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        const id = link.getAttribute("href").substring(1);
        const target = document.getElementById(id);

        // Set active immediately and lock observer overrides during smooth scroll
        setActive(id);
        clickScrollTarget = id;
        clearTimeout(clickScrollTimer);

        if (target) {
          const offset = window.innerWidth <= 1024 ? 80 : 0;
          const y =
            target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
          // Release lock after smooth scroll settles (~900ms)
          clickScrollTimer = setTimeout(() => {
            clickScrollTarget = null;
          }, 900);
        }
      });
    });

    // Keyboard navigation (arrow keys between items)
    nav.addEventListener("keydown", (e) => {
      const btns = Array.from(links);
      const idx = btns.indexOf(document.activeElement);
      if (idx === -1) return;
      const isMobile = window.innerWidth <= 1024;
      const prev = isMobile ? "ArrowLeft" : "ArrowUp";
      const next = isMobile ? "ArrowRight" : "ArrowDown";
      if (e.key === prev && idx > 0) {
        e.preventDefault();
        btns[idx - 1].focus();
      }
      if (e.key === next && idx < btns.length - 1) {
        e.preventDefault();
        btns[idx + 1].focus();
      }
    });

    // Track intersection ratios for all observed sections simultaneously
    const visibleRatios = new Map();

    function resolveActiveSection() {
      if (clickScrollTarget) return;

      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;

      // Edge: bottom of page → last section
      if (scrollY + viewportH >= document.documentElement.scrollHeight - 80) {
        setActive(sectionMap[sectionMap.length - 1].id);
        return;
      }

      if (visibleRatios.size === 0) {
        setActive(getActiveSectionByPosition());
        return;
      }

      // Among visible sections score by: intersection ratio (primary) and
      // how close the section center is to the viewport center (secondary).
      // Scoring in sectionMap order preserves document order as a tiebreaker.
      const viewportCenter = viewportH * 0.5;
      let bestId = null;
      let bestScore = -Infinity;

      sectionMap.forEach(({ section, id }) => {
        if (!visibleRatios.has(id)) return;
        const ratio = visibleRatios.get(id);
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height * 0.5;
        const distFromCenter = Math.abs(sectionCenter - viewportCenter);
        // Higher ratio and closer to viewport center wins
        const score = ratio * 100 - distFromCenter * 0.05;
        if (score > bestScore) {
          bestScore = score;
          bestId = id;
        }
      });

      if (bestId) setActive(bestId);
    }

    // Multiple thresholds give smooth ratio updates for accurate scoring
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleRatios.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleRatios.delete(entry.target.id);
          }
        });
        resolveActiveSection();
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
    );

    sectionMap.forEach(({ section }) => observer.observe(section));

    // Activate first section immediately on page load
    setActive(sectionMap[0].id);

    // Hide nav while hero is visible
    const hero = document.querySelector(".course-hero-section");
    if (hero) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          nav.classList.toggle("is-hidden", entry.isIntersecting);
        },
        { threshold: 0.3 },
      );
      heroObserver.observe(hero);
    }

    // Unified scroll handler: bottom-edge detection + hide-on-scroll-down
    let lastScrollY = window.scrollY;
    let rafId = null;

    window.addEventListener(
      "scroll",
      () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const currentY = window.scrollY;

          // Bottom-of-page: guarantee last section stays active
          if (
            !clickScrollTarget &&
            currentY + window.innerHeight >=
              document.documentElement.scrollHeight - 80
          ) {
            setActive(sectionMap[sectionMap.length - 1].id);
          }

          // Hide nav on scroll-down, reveal on scroll-up
          if (currentY > 150) {
            nav.classList.toggle(
              "esn-scrolled-down",
              currentY > lastScrollY + 6,
            );
          } else {
            nav.classList.remove("esn-scrolled-down");
          }
          lastScrollY = currentY;
          rafId = null;
        });
      },
      { passive: true },
    );

    // Mobile: tap to show tooltip briefly
    nav.querySelectorAll(".esn-item").forEach((item) => {
      item.addEventListener(
        "touchstart",
        () => {
          nav
            .querySelectorAll(".esn-item")
            .forEach((i) => i.classList.remove("esn-tapped"));
          item.classList.add("esn-tapped");
          setTimeout(() => item.classList.remove("esn-tapped"), 2000);
        },
        { passive: true },
      );
    });
  }

  // --- 16. GSAP SCROLL ANIMATIONS ---
  function initAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    gsap.registerPlugin(ScrollTrigger);

    // Reveal all elements with g-exam-reveal class
    gsap.utils.toArray(".g-exam-reveal").forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  // --- INITIALIZE ALL ---
  // Renders are isolated too: a bad CONFIG section won't block later steps.
  [
    renderSnapshot,
    renderAbout,
    renderEligibilityCards,
    renderAgeRules,
    initEligibilityChecker,
    renderSyllabus,
    renderPreparation,
    renderProcess,
    renderWhyEduooz,
    renderPracticeTests,
    renderResources,
    renderFAQ,
    initFaqAccordion,
    initStickyNav,
    initSyllabusTabs,
    initPrepareAccordion,
  ].forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn("[Render Init] " + fn.name + " failed:", e);
    }
  });

  // --- PREMIUM INTERACTIONS ---
  // Each init is isolated: one failure cannot cascade to the next.
  [
    initWhyShowcase,
    initAgeExplorer,
    initVerticalCarousels,
    initJourneyTimeline,
    initFacultyCarousel,
    initReviewCounters,
    initReviewCarousel,
    initMockTestSystem,
    initQPExplorer,
  ].forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn("[Carousel Init] " + fn.name + " failed:", e);
    }
  });

  // Delay animations to let DOM render
  setTimeout(() => {
    try {
      initAnimations();
    } catch (e) {
      console.warn("[Init] initAnimations failed:", e);
    }
  }, 100);
});

// ===========================================
// WHY EDUOOZ — Rotating Feature Showcase
// Slides between two sets of why-cards with
// CSS-driven progress-bar dots and auto-advance.
// ===========================================
function initWhyShowcase() {
  const wrapper = document.getElementById("why-showcase");
  if (!wrapper) return;

  const slides = Array.from(wrapper.querySelectorAll(".why-showcase-slide"));
  const dots = Array.from(wrapper.querySelectorAll(".progress-dot"));
  if (slides.length < 2) return;

  let current = 0;
  let timer = null;
  const DELAY = 4500; // must match CSS @keyframes progress-fill duration

  function goTo(idx) {
    const prev = current;
    current = ((idx % slides.length) + slides.length) % slides.length;
    if (prev === current) return;

    // Exit old slide with left-slide animation
    slides[prev].classList.add("exit-left");
    slides[prev].classList.remove("active");
    setTimeout(() => slides[prev].classList.remove("exit-left"), 700);

    // Activate incoming slide
    slides[current].classList.add("active");

    // Restart dot progress animation: remove then force reflow then re-add
    dots.forEach((d, i) => {
      d.classList.remove("active");
      if (i === current) {
        void d.offsetWidth; // flush so CSS animation restarts
        d.classList.add("active");
      }
    });
  }

  function next() {
    goTo(current + 1);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, DELAY);
  }

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      startAuto();
    });
  });

  // Touch swipe
  let touchStartX = 0;
  wrapper.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      clearInterval(timer);
    },
    { passive: true },
  );
  wrapper.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) dx < 0 ? next() : goTo(current - 1);
      startAuto();
    },
    { passive: true },
  );

  // Hover pause (CSS pauses the ::after fill animation; JS pauses the interval)
  wrapper.addEventListener("mouseenter", () => clearInterval(timer));
  wrapper.addEventListener("mouseleave", startAuto);

  // Ensure clean initial state
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === 0);
    s.classList.remove("exit-left");
  });
  dots.forEach((d, i) => d.classList.toggle("active", i === 0));

  startAuto();
}

// --- FACULTY SHOWCASE CAROUSEL ---
function initFacultyCarousel() {
  const stage = document.getElementById("fac-car-stage");
  const track = document.getElementById("fac-car-track");
  const prevBtn = document.getElementById("fac-car-prev");
  const nextBtn = document.getElementById("fac-car-next");
  const dotsEl = document.getElementById("fac-car-dots");
  if (!track || !stage) return;

  const cards = Array.from(track.querySelectorAll(".fac-car-card"));
  if (cards.length === 0) return;

  const GAP = 28;
  let current = 0;
  let autoTimer = null;
  let isPaused = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragCurrentX = 0;

  // Animated counters
  function animateCounters(card) {
    card.querySelectorAll("[data-count]").forEach((el) => {
      const target = parseInt(el.dataset.count);
      if (el.dataset.counted) {
        el.textContent = target.toLocaleString() + "+";
        return;
      }
      el.dataset.counted = "1";
      const duration = 1400;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * ease);
        el.textContent = val.toLocaleString() + "+";
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }

  function getCardWidth() {
    const sw = stage.offsetWidth;
    if (window.innerWidth <= 600) return sw * 0.88;
    if (window.innerWidth <= 900) return sw * 0.65;
    return sw * 0.34;
  }

  function update() {
    const cardW = getCardWidth();
    const sw = stage.offsetWidth;
    const offset = (sw - cardW) / 2 - current * (cardW + GAP);
    cards.forEach((c) => {
      c.style.width = cardW + "px";
    });
    track.style.transform = `translateX(${offset}px)`;
    cards.forEach((c, i) => {
      c.classList.remove("fac-car-active", "fac-car-nearby");
      if (i === current) {
        c.classList.add("fac-car-active");
        animateCounters(c);
      } else if (
        Math.abs(i - current) === 1 ||
        (current === 0 && i === cards.length - 1) ||
        (current === cards.length - 1 && i === 0)
      ) {
        c.classList.add("fac-car-nearby");
      }
    });
    if (dotsEl) {
      Array.from(dotsEl.querySelectorAll(".fac-car-dot")).forEach((d, i) => {
        d.classList.toggle("fac-car-dot-active", i === current);
      });
    }
  }

  function goTo(idx) {
    current = ((idx % cards.length) + cards.length) % cards.length;
    update();
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = "";
    cards.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.className = "fac-car-dot" + (i === 0 ? " fac-car-dot-active" : "");
      btn.setAttribute("aria-label", `Go to faculty ${i + 1}`);
      btn.addEventListener("click", () => {
        goTo(i);
        resetAuto();
      });
      dotsEl.appendChild(btn);
    });
  }

  function resetAuto() {
    clearInterval(autoTimer);
    if (!isPaused) {
      autoTimer = setInterval(() => goTo(current + 1), 4000);
    }
  }

  // Arrow buttons
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      goTo(current - 1);
      resetAuto();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      goTo(current + 1);
      resetAuto();
    });

  // Pause on hover
  const root = document.querySelector(".fac-car-root");
  if (root) {
    root.addEventListener("mouseenter", () => {
      isPaused = true;
      clearInterval(autoTimer);
    });
    root.addEventListener("mouseleave", () => {
      isPaused = false;
      resetAuto();
    });
  }

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  track.addEventListener(
    "touchend",
    (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 44) {
        goTo(current + (diff > 0 ? 1 : -1));
        resetAuto();
      }
    },
    { passive: true },
  );

  // Mouse drag
  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    track.style.cursor = "grabbing";
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    dragCurrentX = e.clientX;
  });
  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = "";
    const diff = dragStartX - dragCurrentX;
    if (Math.abs(diff) > 50) {
      goTo(current + (diff > 0 ? 1 : -1));
      resetAuto();
    }
  });

  // Click to focus card
  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      if (i !== current) {
        goTo(i);
        resetAuto();
      }
    });
  });

  // Keyboard navigation
  const section = document.querySelector(".fac-showcase-section");
  if (section) {
    section.setAttribute("tabindex", "0");
    section.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(current - 1);
        resetAuto();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(current + 1);
        resetAuto();
      }
    });
  }

  // Mouse wheel
  if (stage) {
    stage.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.deltaX > 0 ? goTo(current + 1) : goTo(current - 1);
        } else {
          e.deltaY > 0 ? goTo(current + 1) : goTo(current - 1);
        }
        resetAuto();
      },
      { passive: false },
    );
  }

  // Floating particles
  const particlesEl = document.getElementById("fac-particles");
  if (particlesEl) {
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement("div");
      const size = 3 + Math.random() * 4;
      dot.style.cssText = `
                position:absolute;
                width:${size}px;height:${size}px;
                border-radius:50%;
                background:rgba(6,182,212,${0.08 + Math.random() * 0.12});
                left:${Math.random() * 100}%;
                top:${Math.random() * 100}%;
                animation: fac-float-particle ${8 + Math.random() * 12}s ease-in-out ${Math.random() * 5}s infinite;
            `;
      particlesEl.appendChild(dot);
    }
  }

  window.addEventListener("resize", update, { passive: true });

  buildDots();
  goTo(0);
  resetAuto();
}

// --- FAQ ACCORDION ---
function initFaqAccordion() {
  const container = document.getElementById("faq-accordion");
  if (!container || container.dataset.faqInitialized === "true") return;

  container.dataset.faqInitialized = "true";

  container.addEventListener("click", (event) => {
    const btn = event.target.closest(".faq-question");
    if (!btn) return;

    const item = btn.closest(".faq-item");
    if (!item) return;

    const isActive = item.classList.contains("active");

    // Close all open items and remove wrapper dimming
    container
      .querySelectorAll(".faq-item.active")
      .forEach((open) => open.classList.remove("active"));
    container.classList.remove("has-active");

    // Open clicked item if it was closed
    if (!isActive) {
      item.classList.add("active");
      container.classList.add("has-active");
    }
  });
}

// --- GOOGLE REVIEWS COUNTERS ---
function initReviewCounters() {
  const bar = document.getElementById("greview-stats-bar");
  if (!bar) return;

  const counters = bar.querySelectorAll(".greview-count[data-target]");
  if (!counters.length) return;

  let triggered = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || triggered) return;
      triggered = true;

      counters.forEach((el) => {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        const isDecimal = target % 1 !== 0;
        const duration = 1600;
        const start = performance.now();

        (function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const val = target * ease;
          el.textContent =
            (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });

      observer.disconnect();
    },
    { threshold: 0.4 },
  );

  observer.observe(bar);
}
window.initReviewCounters = initReviewCounters;

// --- GOOGLE REVIEWS CAROUSEL ---
function initReviewCarousel() {
  // Stop any timer left by a previous init (used by google-reviews.js re-init)
  if (typeof window._greviewAutoTimer !== "undefined") {
    clearInterval(window._greviewAutoTimer);
    window._greviewAutoTimer = undefined;
  }

  const viewport = document.getElementById("greview-carousel-viewport");
  const track = document.getElementById("greview-track");
  const prevBtn = document.getElementById("greview-prev");
  const nextBtn = document.getElementById("greview-next");
  const dotsEl = document.getElementById("greview-dots");

  if (!track || !viewport) return;

  const cards = Array.from(track.querySelectorAll(".greview-card"));
  const GAP = 18; // matches CSS gap
  let current = 0;
  let autoTimer = null;

  function getVisible() {
    const w = window.innerWidth;
    // 767px matches the CSS mobile breakpoint that hides the arrow
    // buttons for this carousel — one full-width card on mobile.
    if (w <= 767) return 1;
    if (w <= 768) return 2;
    return 3;
  }

  function getMax() {
    return Math.max(0, cards.length - getVisible());
  }

  function setWidths() {
    const visible = getVisible();
    const vpW = viewport.offsetWidth;
    const cardW = (vpW - GAP * (visible - 1)) / visible;
    cards.forEach((c) => {
      c.style.width = cardW + "px";
      c.style.flexShrink = "0";
    });
  }

  function buildDots() {
    const max = getMax();
    dotsEl.innerHTML = "";
    for (let i = 0; i <= max; i++) {
      const btn = document.createElement("button");
      btn.className =
        "greview-dot" + (i === current ? " greview-dot-active" : "");
      btn.setAttribute("aria-label", `Go to review ${i + 1}`);
      btn.addEventListener("click", () => {
        goTo(i);
        resetAuto();
      });
      dotsEl.appendChild(btn);
    }
  }

  function updateDots() {
    Array.from(dotsEl.querySelectorAll(".greview-dot")).forEach((d, i) => {
      d.classList.toggle("greview-dot-active", i === current);
    });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, getMax()));

    const visible = getVisible();
    const vpW = viewport.offsetWidth;
    const cardW = (vpW - GAP * (visible - 1)) / visible;
    track.style.transform = `translateX(-${current * (cardW + GAP)}px)`;

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= getMax();

    updateDots();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      goTo(current >= getMax() ? 0 : current + 1);
    }, 5000);
    window._greviewAutoTimer = autoTimer; // allows google-reviews.js to clear on re-init
  }

  prevBtn.addEventListener("click", () => {
    goTo(current - 1);
    resetAuto();
  });
  nextBtn.addEventListener("click", () => {
    goTo(current + 1);
    resetAuto();
  });

  // Pause auto on hover
  const wrap = document.getElementById("greview-carousel-wrap");
  if (wrap) {
    wrap.addEventListener("mouseenter", () => clearInterval(autoTimer));
    wrap.addEventListener("mouseleave", resetAuto);
    wrap.addEventListener("focusin", () => clearInterval(autoTimer));
    wrap.addEventListener("focusout", resetAuto);
  }

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  track.addEventListener(
    "touchend",
    (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 44) {
        goTo(current + (diff > 0 ? 1 : -1));
        resetAuto();
      }
    },
    { passive: true },
  );

  // Keyboard on focused arrows
  [prevBtn, nextBtn].forEach((btn) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        goTo(current - 1);
        resetAuto();
      }
      if (e.key === "ArrowRight") {
        goTo(current + 1);
        resetAuto();
      }
    });
  });

  // Resize
  window.addEventListener(
    "resize",
    () => {
      setWidths();
      buildDots();
      goTo(Math.min(current, getMax()));
    },
    { passive: true },
  );

  // Init
  setWidths();
  buildDots();
  goTo(0);
  resetAuto();
}
window.initReviewCarousel = initReviewCarousel;

// ===========================================
// MOCK TEST SYSTEM — moved to practice-test.js
// Initialized by question-bank.js after loading
// ===========================================
function initMockTestSystem() {}

// ===========================================
// HOW TO PREPARE — Accordion
// Hover on desktop, click on touch devices
// ===========================================
function initPrepareAccordion() {
  const steps = document.querySelectorAll(".prepare-timeline .prepare-step");
  if (!steps.length) return;

  const isTouch = () => window.matchMedia("(hover: none)").matches;
  let openStep = null;

  function open(step) {
    if (openStep && openStep !== step) close(openStep);
    step.classList.add("is-open");
    step.setAttribute("aria-expanded", "true");
    openStep = step;
  }

  function close(step) {
    step.classList.remove("is-open");
    step.setAttribute("aria-expanded", "false");
    if (openStep === step) openStep = null;
  }

  function toggle(step) {
    step.classList.contains("is-open") ? close(step) : open(step);
  }

  steps.forEach((step) => {
    // Desktop: hover
    step.addEventListener("mouseenter", () => {
      if (!isTouch()) open(step);
    });
    step.addEventListener("mouseleave", () => {
      if (!isTouch()) close(step);
    });

    // Touch: click/tap
    step.addEventListener("click", () => {
      if (isTouch()) toggle(step);
    });

    // Keyboard: Enter / Space always works
    step.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(step);
      }
    });
  });
}

// ===========================================
// SYLLABUS TAB EXPLORER
// ===========================================
function initSyllabusTabs() {
  const tabNav = document.querySelector(".syllabus-tabs-nav");
  const tabs = document.querySelectorAll(".syl-tab");
  const panels = document.querySelectorAll(".syl-panel");
  if (!tabs.length) return;

  // --- Floating scroll progress indicator (replaces the native scrollbar) ---
  const SYL_TRACK_WIDTH = 160;
  const SYL_MIN_THUMB = 80;
  const SYL_MAX_THUMB = 160;
  let progressEl = null;
  let progressThumb = null;

  if (tabNav) {
    const existing = tabNav.nextElementSibling;
    if (existing && existing.classList.contains("syl-scroll-progress")) {
      progressEl = existing;
    } else {
      progressEl = document.createElement("div");
      progressEl.className = "syl-scroll-progress";
      progressEl.setAttribute("aria-hidden", "true");
      const track = document.createElement("span");
      track.className = "syl-scroll-progress-track";
      const thumb = document.createElement("span");
      thumb.className = "syl-scroll-progress-thumb";
      track.appendChild(thumb);
      progressEl.appendChild(track);
      tabNav.insertAdjacentElement("afterend", progressEl);
    }
    progressThumb = progressEl.querySelector(".syl-scroll-progress-thumb");
  }

  function updateScrollProgress() {
    if (!tabNav) return;
    const { scrollWidth, clientWidth, scrollLeft } = tabNav;
    const overflowing = scrollWidth > clientWidth + 1;
    tabNav.classList.toggle("is-overflowing", overflowing);

    if (!progressEl || !progressThumb) return;
    progressEl.classList.toggle("is-visible", overflowing);
    if (!overflowing) return;

    const visibleRatio = clientWidth / scrollWidth;
    const thumbWidth = Math.min(
      SYL_MAX_THUMB,
      Math.max(SYL_MIN_THUMB, SYL_TRACK_WIDTH * visibleRatio),
    );
    const maxScroll = scrollWidth - clientWidth;
    const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    const maxOffset = SYL_TRACK_WIDTH - thumbWidth;

    progressThumb.style.width = `${thumbWidth}px`;
    progressThumb.style.transform = `translateX(${scrollRatio * maxOffset}px)`;
  }

  // --- Drag the floating progress thumb to scroll the tab strip ---
  if (tabNav && progressEl && progressThumb) {
    let dragging = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;

    const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    const onDragMove = (e) => {
      if (!dragging) return;
      const maxScroll = tabNav.scrollWidth - tabNav.clientWidth;
      const thumbWidth = progressThumb.offsetWidth;
      const usableTrack = SYL_TRACK_WIDTH - thumbWidth;
      if (maxScroll <= 0 || usableTrack <= 0) return;
      if (e.cancelable) e.preventDefault();
      const deltaX = pointerX(e) - dragStartX;
      const scrollDelta = (deltaX / usableTrack) * maxScroll;
      tabNav.scrollLeft = dragStartScrollLeft + scrollDelta;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      progressEl.classList.remove("is-dragging");
      tabNav.classList.remove("syl-scroll-no-smooth");
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onDragMove);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchmove", onDragMove);
      document.removeEventListener("touchend", endDrag);
    };

    const startDrag = (e) => {
      if (tabNav.scrollWidth <= tabNav.clientWidth) return;
      dragging = true;
      dragStartX = pointerX(e);
      dragStartScrollLeft = tabNav.scrollLeft;
      progressEl.classList.add("is-dragging");
      // Direct manipulation needs 1:1 tracking — CSS scroll-behavior:smooth
      // would lag the thumb behind the pointer, so it's suspended mid-drag.
      tabNav.classList.add("syl-scroll-no-smooth");
      document.body.style.userSelect = "none";
      if (e.cancelable) e.preventDefault();
      document.addEventListener("mousemove", onDragMove);
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchmove", onDragMove, { passive: false });
      document.addEventListener("touchend", endDrag);
    };

    progressThumb.addEventListener("mousedown", startDrag);
    progressThumb.addEventListener("touchstart", startDrag, {
      passive: false,
    });
  }

  function buildSyllabusAccordions() {
    const MIN_HEADING_COUNT = 2;
    const MIN_TOPIC_COUNT = 8;
    const MIN_TEXT_LENGTH = 750;

    panels.forEach((panel) => {
      if (panel.dataset.sylAccordionReady === "true") return;

      const panelLists = panel.querySelector(".syl-panel-lists");
      if (!panelLists) return;

      const headingCount = panel.querySelectorAll(".syl-sub-heading").length;
      const topicCount = panel.querySelectorAll(".syllabus-list li").length;
      const contentLength = panelLists.textContent
        .replace(/\s+/g, " ")
        .trim().length;

      if (
        headingCount < MIN_HEADING_COUNT ||
        (topicCount < MIN_TOPIC_COUNT && contentLength < MIN_TEXT_LENGTH)
      ) {
        return;
      }

      const columnGroups = Array.from(panelLists.children).filter((child) =>
        child.matches("div"),
      );

      if (!columnGroups.length) return;

      const tabId = panel.getAttribute("aria-labelledby");
      const tabLabel = tabId
        ? document.getElementById(tabId)?.textContent.trim() || "Syllabus"
        : "Syllabus";

      const accordionGrid = document.createElement("div");
      accordionGrid.className = "syl-panel-lists syl-panel-accordion";

      const createAccordionItem = (
        columnIndex,
        sectionIndex,
        title,
        contentNodes,
        options = {},
      ) => {
        const item = document.createElement("div");
        item.className = "syl-accordion-item";

        if (options.fullWidth) {
          item.classList.add("syl-panel-static-item");
        }

        const buttonId = `${panel.id}-acc-btn-${columnIndex}-${sectionIndex}`;
        const contentId = `${panel.id}-acc-panel-${columnIndex}-${sectionIndex}`;

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "syl-accordion-trigger";
        trigger.id = buttonId;
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-controls", contentId);

        const headingWrap = document.createElement("span");
        headingWrap.className = "syl-accordion-heading";

        const titleWrap = document.createElement("span");
        titleWrap.className = "syl-accordion-title";
        titleWrap.textContent = title;

        const chevron = document.createElement("i");
        chevron.className = "fa-solid fa-chevron-down syl-accordion-chevron";

        headingWrap.append(titleWrap);
        trigger.append(headingWrap, chevron);

        const panelBody = document.createElement("div");
        panelBody.className = "syl-accordion-panel";
        panelBody.id = contentId;
        panelBody.setAttribute("role", "region");
        panelBody.setAttribute("aria-labelledby", buttonId);
        panelBody.setAttribute(
          "aria-hidden",
          String(!Boolean(options.openByDefault)),
        );

        const panelInner = document.createElement("div");
        panelInner.className = "syl-accordion-panel-inner";

        if (options.openByDefault) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }

        if (options.fullWidth) {
          panelInner.classList.add("syl-accordion-panel-inner-static");
        }

        contentNodes.forEach((node) => {
          panelInner.appendChild(node.cloneNode(true));
        });

        panelBody.appendChild(panelInner);

        const toggle = () => {
          const isOpen = item.classList.toggle("is-open");
          trigger.setAttribute("aria-expanded", String(isOpen));
          panelBody.setAttribute("aria-hidden", String(!isOpen));
        };

        trigger.addEventListener("click", toggle);

        item.append(trigger, panelBody);
        return item;
      };

      const isCompactPanel =
        headingCount < MIN_HEADING_COUNT ||
        (topicCount < MIN_TOPIC_COUNT && contentLength < MIN_TEXT_LENGTH);

      if (isCompactPanel) {
        const staticItem = createAccordionItem(0, 0, tabLabel, [panelLists], {
          openByDefault: true,
          fullWidth: true,
        });
        accordionGrid.appendChild(staticItem);
        panelLists.replaceWith(accordionGrid);
        panel.dataset.sylAccordionReady = "true";
        return;
      }

      columnGroups.forEach((column, columnIndex) => {
        const accordionColumn = document.createElement("div");
        accordionColumn.className = "syl-accordion-column";

        const children = Array.from(column.children);
        let currentTitle = "";
        let currentContent = [];

        const flushSection = (sectionIndex) => {
          if (!currentTitle || !currentContent.length) return;
          accordionColumn.appendChild(
            createAccordionItem(
              columnIndex,
              sectionIndex,
              currentTitle,
              currentContent,
            ),
          );
          currentTitle = "";
          currentContent = [];
        };

        let sectionIndex = 0;
        children.forEach((child) => {
          if (child.classList.contains("syl-sub-heading")) {
            flushSection(sectionIndex);
            currentTitle = child.textContent.trim();
            sectionIndex += 1;
            return;
          }

          if (currentTitle) {
            currentContent.push(child);
          }
        });

        flushSection(sectionIndex);

        if (accordionColumn.children.length) {
          accordionGrid.appendChild(accordionColumn);
        }
      });

      if (!accordionGrid.children.length) return;

      panelLists.replaceWith(accordionGrid);
      panel.dataset.sylAccordionReady = "true";
    });
  }

  function syncTabNavScrollState() {
    if (!tabNav) return;
    tabNav.scrollLeft = 0;
    updateScrollProgress();
  }

  function activateTab(tab) {
    const target = tab.dataset.tab;

    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");

    panels.forEach((p) => {
      p.classList.remove("active", "entering");
    });
    const panel = document.getElementById(`syl-panel-${target}`);
    if (panel) {
      panel.classList.add("active");
      void panel.offsetWidth; // force reflow to restart animation
      panel.classList.add("entering");
    }
  }

  tabs.forEach((tab, idx) => {
    tab.setAttribute("tabindex", idx === 0 ? "0" : "-1");
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (e) => {
      const arr = Array.from(tabs);
      const i = arr.indexOf(tab);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = arr[(i + 1) % arr.length];
        next.focus();
        activateTab(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = arr[(i - 1 + arr.length) % arr.length];
        prev.focus();
        activateTab(prev);
      } else if (e.key === "Home") {
        e.preventDefault();
        arr[0].focus();
        activateTab(arr[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        arr[arr.length - 1].focus();
        activateTab(arr[arr.length - 1]);
      }
    });
  });

  buildSyllabusAccordions();

  // Trigger entrance animation on first panel
  const firstPanel = document.querySelector(".syl-panel.active");
  if (firstPanel) {
    void firstPanel.offsetWidth;
    firstPanel.classList.add("entering");
  }

  if (tabNav) {
    let scrollRaf = null;
    tabNav.addEventListener(
      "scroll",
      () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          updateScrollProgress();
          scrollRaf = null;
        });
      },
      { passive: true },
    );

    // Convert plain vertical mouse-wheel input into horizontal scroll.
    // The native scrollbar (previously the only drag handle for non-trackpad
    // mice) is hidden in favour of the floating progress indicator, so this
    // is now the primary way desktop mouse users can scroll the tab strip.
    //
    // Root cause of the earlier failed attempt: this site runs Lenis, a
    // global smooth-scroller bound to `window` (see initLenis() above,
    // exposed as window.lenis). A plain tabNav-only wheel listener that
    // calls preventDefault() still lets the same event bubble up to
    // Lenis's own window-level listener, which scrolls the whole page
    // vertically at the same time — confirmed by logging: on one wheel
    // tick, window.lenis.scroll jumped ~120px within 50ms while
    // tabNav.scrollLeft only caught up ~800ms later, via CSS
    // scroll-behavior:smooth. The page-level scroll visually dominated,
    // making the tab strip look unresponsive. The fix mirrors the
    // existing, working pattern used for the testimonial playlist above
    // (search "smooth-scroller (Lenis) hijacking"): pause Lenis while
    // hovering/touching the tab strip, and stopPropagation so the event
    // never reaches Lenis's listener at all.
    const pauseLenisForTabNav = () => {
      try {
        if (window.lenis && typeof window.lenis.stop === "function") {
          window.lenis.stop();
        }
      } catch (e) {}
    };
    const resumeLenisForTabNav = () => {
      try {
        if (window.lenis && typeof window.lenis.start === "function") {
          window.lenis.start();
        }
      } catch (e) {}
    };
    tabNav.addEventListener("mouseenter", pauseLenisForTabNav);
    tabNav.addEventListener("mouseleave", resumeLenisForTabNav);
    tabNav.addEventListener("touchstart", pauseLenisForTabNav, {
      passive: true,
    });
    tabNav.addEventListener("touchend", resumeLenisForTabNav);

    const handleTabNavWheel = (e) => {
      if (tabNav.scrollWidth <= tabNav.clientWidth) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      e.stopPropagation();
      tabNav.scrollLeft += e.deltaY;
    };
    tabNav.addEventListener("wheel", handleTabNavWheel, { passive: false });

    // Fallback: if Lenis's window-level listener still wins the race
    // (e.g. the very first wheel tick, before mouseenter has fired),
    // intercept in the capture phase — before the event ever reaches
    // Lenis — same fallback pattern as the playlist above.
    document.addEventListener(
      "wheel",
      (e) => {
        if (e.target !== tabNav && !tabNav.contains(e.target)) return;
        handleTabNavWheel(e);
      },
      { passive: false, capture: true },
    );
  }

  syncTabNavScrollState();
  window.addEventListener("load", syncTabNavScrollState, { once: true });
  window.addEventListener("resize", syncTabNavScrollState);
}

// ===========================================
// PREMIUM INTERACTION: Age Explorer Accordion
// Only handles standalone instances (not in vcarousel)
// ===========================================
function initAgeExplorer() {
  const containers = [
    document.getElementById("age-explorer"),
    document.getElementById("age-col-track"),
    document.getElementById("elig-scroll-scene"),
  ].filter(Boolean);

  if (!containers.length) return;

  containers.forEach((container) => {
    const cards = Array.from(container.querySelectorAll(".age-explorer-card"));
    if (!cards.length) return;

    cards.forEach((card) => {
      if (card.dataset.ageToggleBound === "true") return;

      const toggleTarget = card.querySelector(".age-explorer-front") || card;
      toggleTarget.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isExpanded = card.classList.contains("expanded");
        cards.forEach((c) => c.classList.remove("expanded"));
        if (!isExpanded) card.classList.add("expanded");
      });

      card.dataset.ageToggleBound = "true";
    });
  });
}

// ===========================================
// PREMIUM: Vertical Carousels (Eligibility + Age Relaxation)
// Independent auto-scroll, keyboard, wheel, touch, expand-pause
// ===========================================
function initVerticalCarousels() {
  document.querySelectorAll(".vcarousel-viewport").forEach((viewport) => {
    const track = viewport.querySelector(".vcarousel-track");
    const dotsContainer = viewport.querySelector(".vcarousel-dots");
    if (!track) return;

    const cards = Array.from(track.children);
    const totalCards = cards.length;
    if (totalCards === 0) return;
    const visibleCount = 2;
    const autoplayDelay = parseInt(viewport.dataset.autoplay) || 8000;
    const transitionDuration = "1s cubic-bezier(0.25, 1, 0.5, 1)";

    let currentSlide = 0;
    let interval = null;
    let isPaused = false;
    let isCardExpanded = false;
    let wheelLocked = false;
    const totalSlides = Math.ceil(totalCards / visibleCount);

    function goToSlide(index, smooth = true) {
      if (index >= totalSlides) index = 0;
      if (index < 0) index = totalSlides - 1;
      currentSlide = index;
      const cardHeight = cards[0] ? cards[0].offsetHeight : 180;
      const gap = 16;
      const offset =
        currentSlide * (cardHeight * visibleCount + gap * visibleCount);
      track.style.transition = smooth
        ? `transform ${transitionDuration}`
        : "none";
      track.style.transform = `translateY(-${offset}px)`;
      updateDots();
      updateActiveCards();
    }

    function next() {
      goToSlide(currentSlide + 1);
    }
    function prev() {
      goToSlide(currentSlide - 1);
    }

    function updateActiveCards() {
      cards.forEach((card, i) => {
        card.classList.remove("is-active");
        const startIdx = currentSlide * visibleCount;
        if (i >= startIdx && i < startIdx + visibleCount) {
          card.classList.add("is-active");
        }
      });
    }

    // --- Dots ---
    if (dotsContainer) {
      dotsContainer.innerHTML = ""; // clear any stale dots from prior init
      dotsContainer.classList.add("vertical-dots");
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("div");
        dot.className = "vdot" + (i === 0 ? " active" : "");
        dot.dataset.index = i;
        dot.addEventListener("click", () => {
          goToSlide(i);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll(".vdot").forEach((d, i) => {
        d.classList.toggle("active", i === currentSlide);
      });
    }

    // --- Autoplay (independent per viewport) ---
    function startAutoplay() {
      stopAutoplay();
      interval = setInterval(() => {
        if (!isPaused && !isCardExpanded) next();
      }, autoplayDelay);
    }
    function stopAutoplay() {
      if (interval) clearInterval(interval);
    }
    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // --- Hover pause (only this column) ---
    viewport.addEventListener("mouseenter", () => {
      isPaused = true;
    });
    viewport.addEventListener("mouseleave", () => {
      isPaused = false;
    });

    // --- Mouse wheel with debounce (only this column) ---
    viewport.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        if (wheelLocked) return;
        wheelLocked = true;
        if (e.deltaY > 0) next();
        else prev();
        resetAutoplay();
        setTimeout(() => {
          wheelLocked = false;
        }, 900);
      },
      { passive: false },
    );

    // --- Touch swipe (only this column) ---
    let touchStartY = 0;
    viewport.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
        isPaused = true;
      },
      { passive: true },
    );

    viewport.addEventListener(
      "touchend",
      (e) => {
        const deltaY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(deltaY) > 30) {
          if (deltaY > 0) next();
          else prev();
        }
        isPaused = false;
        resetAutoplay();
      },
      { passive: true },
    );

    // --- Keyboard navigation (only when focused) ---
    viewport.setAttribute("tabindex", "0");
    viewport.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        prev();
        resetAutoplay();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        next();
        resetAutoplay();
      }
    });

    // --- Expand/collapse pause (age explorer cards) ---
    const ageCards = track.querySelectorAll(".age-explorer-card");
    ageCards.forEach((card) => {
      const front = card.querySelector(".age-explorer-front");
      if (!front) return;
      const newFront = front.cloneNode(true);
      front.parentNode.replaceChild(newFront, front);
      newFront.addEventListener("click", () => {
        const isExpanded = card.classList.contains("expanded");
        ageCards.forEach((c) => c.classList.remove("expanded"));
        if (!isExpanded) {
          card.classList.add("expanded");
          isCardExpanded = true;
        } else {
          isCardExpanded = false;
        }
      });
    });

    goToSlide(0, false);
    startAutoplay();
  });
}

// ===========================================
// PREMIUM: Exam Process — Journey Timeline
// Milestones, expandable cards, progress line
// ===========================================
function initJourneyTimeline() {
  const section = document.querySelector(".journey-timeline-section");
  if (!section) return;

  const milestones = Array.from(section.querySelectorAll(".journey-milestone"));
  const cards = Array.from(section.querySelectorAll(".journey-card"));
  const progressFill = document.getElementById("journey-progress-fill");
  const counterCurrent = document.getElementById("journey-current");
  const prevBtn = document.getElementById("journey-prev");
  const nextBtn = document.getElementById("journey-next");
  if (!milestones.length || !cards.length) return;

  const totalSteps = milestones.length;
  let currentStep = -1; // -1 forces first activate(0) to run fully

  function activate(index) {
    if (index < 0 || index >= totalSteps || index === currentStep) return;
    currentStep = index;

    // Milestones
    milestones.forEach((m, i) => m.classList.toggle("active", i === index));

    // Exit all cards, then force a reflow so the entrance transition fires from opacity:0
    cards.forEach((c) => c.classList.remove("active"));
    const nextCard = cards[index];
    if (nextCard) {
      void nextCard.offsetWidth; // flush style so transition starts from hidden state
      nextCard.classList.add("active");
    }

    // Progress bar
    const pct = totalSteps > 1 ? (index / (totalSteps - 1)) * 100 : 100;
    if (progressFill) progressFill.style.width = pct + "%";

    // Counter
    if (counterCurrent) counterCurrent.textContent = index + 1;

    // Button states
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === totalSteps - 1;

    // Scroll milestone into view only on small screens
    if (milestones[index] && window.innerWidth <= 768) {
      milestones[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  // Milestone clicks
  milestones.forEach((m, i) => m.addEventListener("click", () => activate(i)));

  // Nav buttons
  if (prevBtn)
    prevBtn.addEventListener("click", () => activate(currentStep - 1));
  if (nextBtn)
    nextBtn.addEventListener("click", () => activate(currentStep + 1));

  // Keyboard
  section.setAttribute("tabindex", "0");
  section.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      activate(currentStep - 1);
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      activate(currentStep + 1);
    }
  });

  // Swipe on roadmap
  const roadmap = section.querySelector(".journey-roadmap");
  if (roadmap) {
    let touchStartX = 0;
    roadmap.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    roadmap.addEventListener(
      "touchend",
      (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40)
          activate(delta < 0 ? currentStep + 1 : currentStep - 1);
      },
      { passive: true },
    );
  }

  // Swipe on detail cards area too
  const detailCards = section.querySelector(".journey-detail-cards");
  if (detailCards) {
    let touchStartX = 0;
    detailCards.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    detailCards.addEventListener(
      "touchend",
      (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40)
          activate(delta < 0 ? currentStep + 1 : currentStep - 1);
      },
      { passive: true },
    );
  }

  activate(0);
}

// 2. Faculty Data Pool (Replaces Alumni Pool for Fade-in Grid)
const facultyPool = [
  // Batch 1
  {
    name: "Shine Stephen",
    role: "Former AIIMS Faculty | UGC NET | MHA | PGDHSR",
    badge: "Assistant Professor | PGIMER MSc (N) | PhD Scholar",
    icon: '<i class="fa-solid fa-trophy"></i>',
    img: "/assets/images/Mentors/SHINE.png",
    quals: [
      "Asst. Professor – Govt. Nursing College (on leave)",
      "Former Faculty, College of Nursing AIIMS",
      "MSc (N) – PGIMER | MHA | PGDHSR | UGC NET",
      "PhD Scholar (INC-WHO)",
      "9th Rank – KPSC Asst. Professor Exam (2024)",
      "19th Rank – Nursing Tutor KPSC (2023)",
    ],
  },
  {
    name: "Nayana Shaji",
    role: "Distinction Holder | Kerala & Central Exam Ranker",
    badge: "M.Pharm Pharmacology | GPAT Rank Holder",
    icon: '<i class="fa-solid fa-award"></i>',
    img: "/assets/images/Mentors/nayana-shaji.jpg",
    quals: [
      "M.Pharm Pharmacology",
      "Distinction Holder",
      "GPAT Rank Holder",
      "Kerala & Central Exams Rank Holder",
    ],
  },
  {
    name: "Vidhu R Vijayan",
    role: "NCLEX RN Passed",
    badge: "MSc Nursing (Orthopedic)",
    icon: '<i class="fa-solid fa-stethoscope"></i>',
    img: "/assets/images/Mentors/vidhu-r-vijayan.jpg",
    quals: ["MSc. Nursing (Orthopedic)", "NCLEX RN Passed"],
  },
  // Batch 2
  {
    name: "Honey Mol P.V",
    role: "Kerala PSC Rank Holder",
    badge: "MSc Molecular Biology | Distinction Holder",
    icon: '<i class="fa-solid fa-flask"></i>',
    img: "/assets/images/Mentors/honey-mol-pv.jpg",
    quals: [
      "MSc Molecular Biology",
      "Distinction Holder",
      "Kerala PSC Rank Holder",
    ],
  },
  {
    name: "Sreelakshmi E.M",
    role: "Kerala PSC Rank Holder",
    badge: "MSc Microbiology | 2nd Rank Holder",
    icon: '<i class="fa-solid fa-microscope"></i>',
    img: "/assets/images/Mentors/sreelakshmi-em.jpg",
    quals: ["MSc Microbiology", "2nd Rank Holder", "Kerala PSC Rank Holder"],
  },
  {
    name: "Arathy Surendran",
    role: "Kerala PSC Rank Holder",
    badge: "MSc Nursing (Pediatrics) – KUHS",
    icon: '<i class="fa-solid fa-child"></i>',
    img: "/assets/images/Mentors/arathy-surendran.jpg",
    quals: ["MSc Nursing (Pediatrics) – KUHS", "Kerala PSC Rank Holder"],
  },
  // Batch 3
  {
    name: "Sai Kiran T C",
    role: "GPAT Kerala Rank Holder | Research Conclave Winner",
    badge: "M.Pharm Pharmaceutical Chemistry | GPAT Kerala Rank Holder",
    icon: '<i class="fa-solid fa-flask-vial"></i>',
    img: "/assets/images/Mentors/sai-kiran-tc.jpg",
    quals: [
      "Senior Pharmacy Faculty",
      "M.Pharm – Pharmaceutical Chemistry",
      "GPAT Kerala Rank Holder",
      "ATPI KSB Poster Presentation 2025",
      "Pharmaceutical Research Conclave Winner 2025",
    ],
  },
  {
    name: "Dr. Manjima G.S",
    role: "International Scholar | MSc Pharmacology (UK) – Commendation",
    badge: "Doctor of Pharmacy | MSc Pharmacology (UK)",
    icon: '<i class="fa-solid fa-graduation-cap"></i>',
    img: "/assets/images/Mentors/MANJIMA.jpeg",
    quals: [
      "Doctor of Pharmacy",
      "MSc Pharmacology (UK) – Commendation",
      "International Scholarship Awardee",
    ],
  },
  {
    name: "Jesna Prasad",
    role: "German A1–B2 Qualified | Nursing Background",
    badge: "German B1–B2 Certified | BSc Nursing",
    icon: '<i class="fa-solid fa-language"></i>',
    img: "/assets/images/Mentors/jesna-prasad.jpg",
    quals: ["BSc Nursing", "German A1-A2 Certified", "German B1-B2 Certified"],
  },
  // Batch 4
  {
    name: "Jeethu Paul",
    role: "Kerala PSC Rank Holder",
    badge: "MSc Nursing (Pediatric)",
    icon: '<i class="fa-solid fa-heart-pulse"></i>',
    img: "/assets/images/Mentors/jeethu-paul.jpg",
    quals: ["MSc Nursing (Pediatric)", "Kerala PSC Rank Holder"],
  },
  {
    name: "Reshma R",
    role: "AIIMS Raipur & RRB Nursing Officer Rank Holder",
    badge: "MSc Nursing (Paediatrics)",
    icon: '<i class="fa-solid fa-baby"></i>',
    img: "/assets/images/Mentors/RESHMA R.png",
    quals: [
      "MSc Nursing (Paediatrics)",
      "Cleared AIIMS Raipur Nursing Officer Exam",
      "RRB Nursing Officer",
      "DHS/DME Nursing Officer",
    ],
  },
  {
    name: "Revathy B C",
    role: "Oncology Nursing Specialist",
    badge: "BSc Nursing (Oncology Nursing)",
    icon: '<i class="fa-solid fa-ribbon"></i>',
    img: "/assets/images/Mentors/revathy-bc.jpg",
    quals: ["BSc Nursing", "Speciality in Oncology Nursing"],
  },
  // Batch 5
  {
    name: "Ashna Ashok",
    role: "OBG Nursing Specialist",
    badge: "MSc Nursing (OBG)",
    icon: '<i class="fa-solid fa-baby-carriage"></i>',
    img: "/assets/images/Mentors/ASHNA ASHOK.png",
    quals: ["BSc Nursing", "MSc Nursing (OBG)"],
  },
  {
    name: "Shine Stephen",
    role: "Former AIIMS Faculty | UGC NET | MHA | PGDHSR",
    badge: "Assistant Professor | PGIMER MSc (N) | PhD Scholar",
    icon: '<i class="fa-solid fa-trophy"></i>',
    img: "/assets/images/Mentors/SHINE.png",
    quals: [
      "Asst. Professor – Govt. Nursing College (on leave)",
      "Former Faculty, College of Nursing AIIMS",
      "MSc (N) – PGIMER | MHA | PGDHSR | UGC NET",
      "PhD Scholar (INC-WHO)",
      "9th Rank – KPSC Asst. Professor Exam (2024)",
      "19th Rank – Nursing Tutor KPSC (2023)",
    ],
  },
  {
    name: "Nayana Shaji",
    role: "Distinction Holder | Kerala & Central Exam Ranker",
    badge: "M.Pharm Pharmacology | GPAT Rank Holder",
    icon: '<i class="fa-solid fa-award"></i>',
    img: "/assets/images/Mentors/nayana-shaji.jpg",
    quals: [
      "M.Pharm Pharmacology",
      "Distinction Holder",
      "GPAT Rank Holder",
      "Kerala & Central Exams Rank Holder",
    ],
  },
];

let currentFacultyBatch = 0; // Tracks which group of 3 is currently displayed

// --- PERFORMANCE FIX: Shadowing DOM Nodes instead of arbitrary innerHTML insertion ---
// And decoupling Parallax animation layer from Fade animation layer
const activeWrappers = document.querySelectorAll(".alumni-card-wrapper");
const facultyDOMNodes = Array.from(activeWrappers).map((wrapper) => {
  return {
    wrapper: wrapper,
    cycleNode: wrapper.querySelector(".alumni-cycle-animator") || wrapper,
    img: wrapper.querySelector("img"),
    badge: wrapper.querySelector(".rank-badge"),
    name:
      wrapper.querySelector(".alumni-text-overlay h3") ||
      wrapper.querySelector("h3"),
    role: wrapper.querySelector(".exam-name"),
    descContainer: wrapper.querySelector(".placement-dest"),
  };
});

function buildQualList(quals) {
  if (!quals || !quals.length) return "";
  return (
    '<ul class="fac-desc-list">' +
    quals
      .map(function (q) {
        return "<li>" + q + "</li>";
      })
      .join("") +
    "</ul>"
  );
}

function updateFacultyDots() {
  var dots = document.querySelectorAll(".fac-batch-dot");
  if (!dots.length) return;
  var start = currentFacultyBatch * 3;
  var end = Math.min(start + 3, 13);
  dots.forEach(function (dot, i) {
    dot.classList.toggle("fac-batch-dot-active", i >= start && i < end);
  });
}

function initFacultyDots() {
  var grid = document.querySelector(".alumni-showcase-grid");
  if (!grid) return;

  var section = document.createElement("div");
  section.className = "fac-dots-section";

  // 13 dots — one per unique faculty member
  var dotsEl = document.createElement("div");
  dotsEl.className = "fac-batch-dots";
  for (var i = 0; i < 13; i++) {
    var dot = document.createElement("span");
    dot.className = "fac-batch-dot" + (i < 3 ? " fac-batch-dot-active" : "");
    dotsEl.appendChild(dot);
  }
  section.appendChild(dotsEl);

  // Meet All Mentors link
  var ctaWrap = document.createElement("div");
  ctaWrap.innerHTML =
    '<a href="/faculties.html" class="btn-meet-mentors">' +
    '<i class="fa-solid fa-users"></i> Meet All Mentors' +
    "</a>";
  section.appendChild(ctaWrap);

  grid.insertAdjacentElement("afterend", section);
}

function bindTiltPhysics(nodeInfo) {
  const wrapper = nodeInfo.wrapper;
  const card = wrapper.querySelector(".prismatic-card");
  if (!card) return;

  let rect, centerX, centerY;
  let activeRAF = null;

  wrapper.addEventListener("mouseenter", () => {
    rect = wrapper.getBoundingClientRect();
    centerX = rect.width / 2;
    centerY = rect.height / 2;
    card.style.transition = "none";
  });

  wrapper.addEventListener("mousemove", (e) => {
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    // Cancel unexecuted frames to prevent bottlenecking
    if (activeRAF) window.cancelAnimationFrame(activeRAF);

    activeRAF = window.requestAnimationFrame(() => {
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    });
  });

  wrapper.addEventListener("mouseleave", () => {
    if (activeRAF) window.cancelAnimationFrame(activeRAF);
    card.style.transition = `transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease`;
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    setTimeout(() => {
      card.style.transition = `transform 0.15s ease, box-shadow 0.15s ease`;
    }, 600);
    rect = null;
  });
}

// Bind tilt physics EXACTLY ONCE to avoid Compound Listener Leaks
facultyDOMNodes.forEach(bindTiltPhysics);

// Initialize first batch description as qualification list on page load
(function initFacultyDescriptions() {
  var initialBatch = facultyPool.slice(0, 3);
  facultyDOMNodes.forEach(function (node, i) {
    var fac = initialBatch[i];
    if (fac && node.descContainer) {
      node.descContainer.innerHTML = buildQualList(fac.quals);
    }
  });
  initFacultyDots();
})();

// Pre-load all images so no pop-in happens during cycle
facultyPool.forEach((fac) => {
  if (fac.img) {
    const img = new Image();
    img.src = fac.img;
  }
});

// 3. Cycling Engine (Zero DOM Reflow Edition)
function cycleFaculty() {
  const totalBatches = Math.ceil(facultyPool.length / 3);
  currentFacultyBatch = (currentFacultyBatch + 1) % totalBatches;
  updateFacultyDots();
  const batch = facultyPool.slice(
    currentFacultyBatch * 3,
    currentFacultyBatch * 3 + 3,
  );

  // Phase 1: Fade Out + Jump Up (staggered cascade strictly on decopled inner node)
  facultyDOMNodes.forEach((node, i) => {
    setTimeout(() => {
      node.cycleNode.classList.add("cycling-out");
    }, i * 150);
  });

  // Phase 2: Direct Text Modification safely masked by CSS invisibility
  setTimeout(() => {
    facultyDOMNodes.forEach((node, i) => {
      const fac = batch[i];
      if (fac) {
        if (node.img) {
          node.img.src = fac.img;
          node.img.alt = fac.name;
        }
        if (node.badge) node.badge.textContent = fac.badge;
        if (node.name) node.name.textContent = fac.name;
        if (node.role) node.role.textContent = fac.role;
        if (node.descContainer)
          node.descContainer.innerHTML = buildQualList(fac.quals);
      }

      node.cycleNode.classList.remove("cycling-out");
      node.cycleNode.classList.add("cycling-in");
    });

    // Phase 3: Jump Reveal from Below
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        facultyDOMNodes.forEach((node, i) => {
          setTimeout(() => {
            node.cycleNode.classList.remove("cycling-in");
          }, i * 150);
        });
      });
    });
  }, 800);
}

// Start cycling every 5 seconds
setInterval(cycleFaculty, 5000);

// --- 11. GSAP Testimonials Reveal ---
gsap.set(".g-test-reveal", { autoAlpha: 1 });
gsap.from(".g-test-reveal", {
  scrollTrigger: { trigger: ".testimonials-premium-section", start: "top 80%" },
  y: 40,
  opacity: 0,
  filter: "blur(10px)",
  duration: 1.2,
  stagger: 0.15,
  ease: "power3.out",
  clearProps: "filter,transform",
});

/* ==========================================================
   VFC TILT 3D — Vital Feature Card 3D Hover
   ========================================================== */
(function vfcTilt3D() {
  "use strict";

  function init() {
    var card = document.getElementById("vital-card");
    if (!card) return;

    /* â”€â”€ Perspective container â”€â”€ */
    var wrapper = card.closest(".course-vital-wrapper");
    if (wrapper) {
      wrapper.style.perspective = "1200px";
      wrapper.style.perspectiveOrigin = "50% 40%";
    }
    card.style.transformStyle = "preserve-3d";
    card.style.willChange = "transform";
    card.style.transition = "none";

    /* â”€â”€ Enable preserve-3d on the feature card chain â”€â”€ */
    [".vfc-grid-wrap", ".vfc-slide", ".vfc-card-grid"].forEach(function (sel) {
      var el = card.querySelector(sel);
      if (el) {
        el.style.transformStyle = "preserve-3d";
      }
    });

    /* â”€â”€ Moving light reflection overlay â”€â”€ */
    var light = document.createElement("div");
    light.style.cssText = [
      "position:absolute",
      "inset:0",
      "border-radius:inherit",
      "pointer-events:none",
      "z-index:200",
      "opacity:0",
      "transition:opacity 0.35s ease",
      "background:radial-gradient(circle at 50% 50%,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0.05) 38%,transparent 60%)",
      "mix-blend-mode:overlay",
      "will-change:background,opacity",
    ].join(";");
    card.appendChild(light);

    /* â”€â”€ Layer parallax config â”€â”€ */
    var LAYER_DEFS = [
      { sel: ".vfc-header", factor: 0.1 },
      { sel: ".vfc-stats", factor: 0.18 },
      { sel: ".vfc-grid-wrap", factor: 0.28 },
      { sel: ".vfc-footer", factor: 0.36 },
    ];
    var MAX_PARALLAX = 11;

    var layers = [];
    LAYER_DEFS.forEach(function (cfg) {
      var el = card.querySelector(cfg.sel);
      if (el) {
        el.style.willChange = "transform";
        el.style.transition = "none";
        layers.push({ el: el, factor: cfg.factor });
      }
    });

    /* â”€â”€ Animation state â”€â”€ */
    var isHovered = false;
    var mouseNX = 0,
      mouseNY = 0;
    var curRX = 0,
      curRY = 0;
    var curTX = 0,
      curTY = 0;
    var curLX = 0,
      curLY = 0;
    var tgtRX = 0,
      tgtRY = 0;
    var tgtTX = 0,
      tgtTY = 0;
    var rafId = null;

    var LERP_R = 0.075;
    var LERP_T = 0.055;
    var LERP_L = 0.065;
    var MAX_ROT = 6;
    var MAX_FLT = 6;
    var EPS = 0.005;

    function lerp(c, t, f) {
      return c + (t - c) * f;
    }

    /* â”€â”€ rAF loop â”€â”€ */
    function animate() {
      curRX = lerp(curRX, tgtRX, LERP_R);
      curRY = lerp(curRY, tgtRY, LERP_R);
      curTX = lerp(curTX, tgtTX, LERP_T);
      curTY = lerp(curTY, tgtTY, LERP_T);
      curLX = lerp(curLX, mouseNX, LERP_L);
      curLY = lerp(curLY, mouseNY, LERP_L);

      card.style.transform =
        "rotateX(" +
        curRX.toFixed(3) +
        "deg) " +
        "rotateY(" +
        curRY.toFixed(3) +
        "deg) " +
        "translateX(" +
        curTX.toFixed(3) +
        "px) " +
        "translateY(" +
        curTY.toFixed(3) +
        "px)";

      layers.forEach(function (l) {
        var tx = curLX * MAX_PARALLAX * l.factor;
        var ty = curLY * MAX_PARALLAX * l.factor;
        l.el.style.transform =
          "translateX(" +
          tx.toFixed(3) +
          "px) translateY(" +
          ty.toFixed(3) +
          "px)";
      });

      var settled =
        Math.abs(curRX - tgtRX) < EPS &&
        Math.abs(curRY - tgtRY) < EPS &&
        Math.abs(curTX - tgtTX) < EPS &&
        Math.abs(curTY - tgtTY) < EPS &&
        Math.abs(curLX - mouseNX) < EPS &&
        Math.abs(curLY - mouseNY) < EPS;

      if (!settled || isHovered) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
        if (!isHovered) {
          card.style.transform =
            "rotateX(0deg) rotateY(0deg) translateX(0) translateY(0)";
          layers.forEach(function (l) {
            l.el.style.transform = "translateX(0) translateY(0)";
          });
        }
      }
    }

    /* â”€â”€ mouseenter â”€â”€ */
    card.addEventListener("mouseenter", function () {
      isHovered = true;
      light.style.opacity = "1";
      card.style.transition = "none";
      layers.forEach(function (l) {
        l.el.style.transition = "none";
      });
      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    /* â”€â”€ mousemove â”€â”€ */
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      mouseNX = x * 2 - 1;
      mouseNY = y * 2 - 1;

      tgtRY = mouseNX * MAX_ROT;
      tgtRX = -mouseNY * MAX_ROT;
      tgtTX = mouseNX * MAX_FLT * 0.45;
      tgtTY = mouseNY * MAX_FLT * 0.45;

      light.style.background =
        "radial-gradient(circle at " +
        (x * 100).toFixed(1) +
        "% " +
        (y * 100).toFixed(1) +
        "%, " +
        "rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 38%, transparent 60%)";
    });

    /* â”€â”€ mouseleave â”€â”€ */
    card.addEventListener("mouseleave", function () {
      isHovered = false;
      mouseNX = 0;
      mouseNY = 0;
      tgtRX = 0;
      tgtRY = 0;
      tgtTX = 0;
      tgtTY = 0;
      light.style.opacity = "0";

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      /* Smooth CSS spring-back */
      card.style.transition = "transform 0.6s cubic-bezier(0.22,1,0.36,1)";
      card.style.transform =
        "rotateX(0deg) rotateY(0deg) translateX(0) translateY(0)";

      layers.forEach(function (l) {
        l.el.style.transition = "transform 0.6s cubic-bezier(0.22,1,0.36,1)";
        l.el.style.transform = "translateX(0) translateY(0)";
      });

      /* Reset any active feature-box lift */
      card.querySelectorAll(".vfc-card").forEach(function (vc) {
        vc.style.transition =
          "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease, opacity 0.45s ease, background 0.45s ease";
        vc.style.transform = "translateZ(0) translateY(0) scale(1)";
        vc.style.boxShadow = "";
        vc.style.opacity = "1";
        vc.style.background = "";
      });

      setTimeout(function () {
        if (!isHovered) {
          card.style.transition = "none";
          curRX = 0;
          curRY = 0;
          curTX = 0;
          curTY = 0;
          curLX = 0;
          curLY = 0;
          layers.forEach(function (l) {
            l.el.style.transition = "none";
          });
        }
      }, 660);
    });

    /* â”€â”€ Feature-box 3D lift (translateZ + Y + scale) â”€â”€ */
    var allVfcCards = Array.prototype.slice.call(
      card.querySelectorAll(".vfc-card"),
    );
    allVfcCards.forEach(function (vc) {
      vc.style.willChange = "transform, box-shadow, opacity";

      vc.addEventListener("mouseenter", function () {
        var grid = vc.closest(".vfc-card-grid");
        var siblings = grid
          ? Array.prototype.slice.call(grid.querySelectorAll(".vfc-card"))
          : [vc];

        siblings.forEach(function (other) {
          if (other === vc) {
            other.style.transition =
              "transform 0.26s cubic-bezier(0.22,1,0.36,1), box-shadow 0.26s ease, opacity 0.26s ease, background 0.26s ease";
            other.style.transform =
              "translateZ(24px) translateY(-5px) scale(1.03)";
            other.style.boxShadow =
              "0 20px 48px rgba(0,0,0,0.4), 0 0 22px rgba(6,182,212,0.22)";
            other.style.background = "rgba(255,255,255,0.12)";
            other.style.opacity = "1";
          } else {
            other.style.transition =
              "transform 0.26s cubic-bezier(0.22,1,0.36,1), opacity 0.26s ease";
            other.style.transform =
              "translateZ(-7px) translateY(2px) scale(0.972)";
            other.style.opacity = "0.65";
          }
        });
      });

      vc.addEventListener("mouseleave", function () {
        var grid = vc.closest(".vfc-card-grid");
        var siblings = grid
          ? Array.prototype.slice.call(grid.querySelectorAll(".vfc-card"))
          : [vc];

        siblings.forEach(function (other) {
          other.style.transition =
            "transform 0.42s cubic-bezier(0.22,1,0.36,1), box-shadow 0.42s ease, opacity 0.42s ease, background 0.42s ease";
          other.style.transform = "translateZ(0) translateY(0) scale(1)";
          other.style.boxShadow = "";
          other.style.background = "";
          other.style.opacity = "1";
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ==========================================================
   PREMIUM APP SHOWCASE (PAS) — Initialization
   ========================================================== */
(function pasInit() {
  "use strict";

  var CIRCUMFERENCE = 207.3;
  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* 1. SCREEN CAROUSEL */
  var slides = Array.prototype.slice.call(
    document.querySelectorAll(".pas-slide"),
  );
  var currentSlide = 0;
  var carouselTimer = null;
  var phoneHovered = false;

  function goToSlide(idx) {
    var prev = currentSlide;
    currentSlide = ((idx % slides.length) + slides.length) % slides.length;
    if (prev === currentSlide) return;

    slides[prev].classList.add("pas-slide-exit");
    slides[prev].classList.remove("pas-slide-active");

    setTimeout(function () {
      slides[prev].classList.remove("pas-slide-exit");
    }, 520);

    slides[currentSlide].classList.add("pas-slide-active");
  }

  function startCarousel() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(function () {
      if (!phoneHovered) goToSlide(currentSlide + 1);
    }, 3500);
  }

  function goToScreenByKey(screenKey) {
    var idx = slides.findIndex(function (s) {
      return s.getAttribute("data-screen") === screenKey;
    });
    if (idx !== -1 && idx !== currentSlide) {
      goToSlide(idx);
      clearInterval(carouselTimer);
      startCarousel();
    }
  }

  /* 2. NOTIFICATION QUEUE */
  var notifications = [
    {
      icon: "fa-check-circle",
      title: "Mock Test Completed!",
      sub: "Score: 178/200 Â· Rank Top 5%",
      color: "#10b981",
    },
    {
      icon: "fa-arrow-trend-up",
      title: "Your Rank Improved!",
      sub: "Up 24 positions â†’ AIR 42",
      color: "#06b6d4",
    },
    {
      icon: "fa-bell",
      title: "New AIIMS NORCET Notification",
      sub: "Application window opens tomorrow",
      color: "#c026d3",
    },
    {
      icon: "fa-video",
      title: "Live Class Starts in 15 Minutes",
      sub: "Pharmacology Â· Prof. Shine Stephen",
      color: "#f59e0b",
    },
  ];
  var notifIdx = 0;
  var notifBadge = document.getElementById("pasNotifBadge");
  var notifTitle = document.getElementById("pasNotifTitle");
  var notifSub = document.getElementById("pasNotifSub");
  var notifIcon = document.getElementById("pasNotifIcon");

  function showNotif() {
    if (!notifBadge) return;
    var n = notifications[notifIdx % notifications.length];
    notifIdx++;

    /* Update content */
    notifTitle.textContent = n.title;
    notifSub.textContent = n.sub;
    notifIcon.className = "fa-solid " + n.icon;
    notifIcon.parentElement.style.background =
      "linear-gradient(135deg, " + n.color + ", " + n.color + "88)";

    /* Slide in */
    notifBadge.classList.add("pas-notif-visible");

    /* Fade out after 2.4s */
    setTimeout(function () {
      notifBadge.classList.remove("pas-notif-visible");
    }, 2400);
  }

  function scheduleNotifs() {
    setTimeout(function loop() {
      showNotif();
      setTimeout(loop, 7000 + Math.random() * 3000);
    }, 2000);
  }

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           3. 3D TILT (phone frame only, not wrapper)
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  var phoneScene = document.getElementById("pasPhoneScene");
  var phoneWrapper = document.getElementById("pasPhoneWrapper");
  var phoneFrame = document.getElementById("pasPhoneFrame");
  var phoneShadow = document.getElementById("pasPhoneShadow");

  if (phoneScene && phoneFrame && !prefersReduced) {
    var tgtRX = 0,
      tgtRY = 0;
    var curRX = 0,
      curRY = 0;
    var tiltRaf = null;

    function tiltTick() {
      curRX += (tgtRX - curRX) * 0.08;
      curRY += (tgtRY - curRY) * 0.08;

      phoneFrame.style.transform =
        "rotateX(" +
        curRX.toFixed(3) +
        "deg) rotateY(" +
        curRY.toFixed(3) +
        "deg)";

      /* Shadow shifts opposite to tilt */
      if (phoneShadow) {
        var sx = 50 + curRY * 1.5;
        var sy = 50 + curRX * 1.5;
        phoneShadow.style.transform =
          "translateX(" + (curRY * 2).toFixed(1) + "px)";
      }

      var settled =
        Math.abs(curRX - tgtRX) < 0.02 && Math.abs(curRY - tgtRY) < 0.02;
      if (!settled || phoneHovered) {
        tiltRaf = requestAnimationFrame(tiltTick);
      } else {
        tiltRaf = null;
      }
    }

    phoneScene.addEventListener("mousemove", function (e) {
      var rect = phoneScene.getBoundingClientRect();
      var nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      var ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      tgtRY = nx * 10;
      tgtRX = -ny * 8;
      if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltTick);
    });

    phoneScene.addEventListener("mouseleave", function () {
      phoneHovered = false;
      tgtRX = 0;
      tgtRY = 0;
      if (!tiltRaf) tiltRaf = requestAnimationFrame(tiltTick);

      /* Spring back phone frame */
      phoneFrame.style.transition =
        "transform 0.6s cubic-bezier(0.22,1,0.36,1)";
      setTimeout(function () {
        phoneFrame.style.transition = "";
      }, 640);
    });

    phoneScene.addEventListener("mouseenter", function () {
      phoneHovered = true;
    });
  }

  /*  3b. MOUSE EFFECTS: spotlight Â· rim light Â· scale lift */
  (function () {
    if (!phoneScene || !phoneFrame || prefersReduced) return;

    var phoneScreenEl = phoneFrame.querySelector(".pas-screen");

    /*  Spotlight overlay injected into the screen  */
    var spotlight = document.createElement("div");
    spotlight.style.cssText =
      "position:absolute;inset:0;border-radius:44px;" +
      "pointer-events:none;z-index:30;" +
      "opacity:0;transition:opacity 0.4s ease;" +
      "mix-blend-mode:soft-light;" +
      "background:radial-gradient(circle 110px at 50% 50%," +
      "rgba(200,180,255,0.55) 0%,transparent 70%)";
    if (phoneScreenEl) phoneScreenEl.appendChild(spotlight);

    /* â”€â”€ Rim-glow overlay behind the frame â”€â”€ */
    var rimEl = document.createElement("div");
    rimEl.style.cssText =
      "position:absolute;inset:-3px;border-radius:58px;" +
      "pointer-events:none;z-index:-1;" +
      "opacity:0;transition:opacity 0.4s ease;" +
      "background:transparent;" +
      "filter:blur(8px)";
    phoneFrame.style.position = "relative";
    phoneFrame.style.overflow = "visible";
    phoneFrame.insertBefore(rimEl, phoneFrame.firstChild);

    /* â”€â”€ Lerp state â”€â”€ */
    var tSpotX = 50,
      tSpotY = 50;
    var cSpotX = 50,
      cSpotY = 50;
    var tRimX = 0,
      tRimY = 0;
    var cRimX = 0,
      cRimY = 0;
    var efxRaf = null;
    var isOver = false;

    /* base box-shadow tokens */
    var BASE_SHADOW =
      "0 0 0 1px rgba(0,0,0,0.14)," +
      "0 40px 80px rgba(15,23,42,0.28)," +
      "0 14px 36px rgba(91,33,182,0.2)," +
      "0 3px 8px rgba(0,0,0,0.1)";

    function efxTick() {
      var L = 0.1;
      cSpotX += (tSpotX - cSpotX) * L;
      cSpotY += (tSpotY - cSpotY) * L;
      cRimX += (tRimX - cRimX) * L;
      cRimY += (tRimY - cRimY) * L;

      /* spotlight */
      spotlight.style.background =
        "radial-gradient(circle 110px at " +
        cSpotX.toFixed(1) +
        "% " +
        cSpotY.toFixed(1) +
        "%," +
        "rgba(200,180,255,0.55) 0%," +
        "rgba(167,139,250,0.2) 45%," +
        "transparent 70%)";

      /* rim glow â€” directional */
      var mag = Math.sqrt(cRimX * cRimX + cRimY * cRimY);
      var opa = Math.min(mag * 0.65, 0.75).toFixed(2);
      var ox = (cRimX * 10).toFixed(1);
      var oy = (cRimY * 10).toFixed(1);
      phoneFrame.style.boxShadow =
        BASE_SHADOW +
        "," +
        ox +
        "px " +
        oy +
        "px 28px rgba(167,139,250," +
        opa +
        ")," +
        "0 0 48px 4px rgba(139,92,246," +
        (opa * 0.35).toFixed(2) +
        ")";

      var settled =
        Math.abs(cSpotX - tSpotX) < 0.3 &&
        Math.abs(cSpotY - tSpotY) < 0.3 &&
        Math.abs(cRimX - tRimX) < 0.005 &&
        Math.abs(cRimY - tRimY) < 0.005;

      if (!settled || isOver) efxRaf = requestAnimationFrame(efxTick);
      else efxRaf = null;
    }

    /* mousemove â€” update targets */
    phoneScene.addEventListener("mousemove", function (e) {
      var fr = phoneFrame.getBoundingClientRect();
      var nx = (e.clientX - fr.left) / fr.width;
      var ny = (e.clientY - fr.top) / fr.height;

      tSpotX = nx * 100;
      tSpotY = ny * 100;
      tRimX = nx * 2 - 1;
      tRimY = ny * 2 - 1;

      if (!efxRaf) efxRaf = requestAnimationFrame(efxTick);
    });

    /* mouseenter  show effects, scale lift */
    phoneScene.addEventListener("mouseenter", function () {
      isOver = true;
      spotlight.style.opacity = "1";
      rimEl.style.opacity = "1";

      if (phoneWrapper) {
        phoneWrapper.style.transition =
          "transform 0.45s cubic-bezier(0.22,1,0.36,1)";
        phoneWrapper.style.transform = "scale(1.045)";
      }
      if (!efxRaf) efxRaf = requestAnimationFrame(efxTick);
    });

    /* mouseleave â€” hide effects, spring back */
    phoneScene.addEventListener("mouseleave", function () {
      isOver = false;
      spotlight.style.opacity = "0";
      rimEl.style.opacity = "0";
      tRimX = 0;
      tRimY = 0;

      /* restore base shadow smoothly */
      setTimeout(function () {
        if (!isOver) phoneFrame.style.boxShadow = BASE_SHADOW;
      }, 420);

      if (phoneWrapper) {
        phoneWrapper.style.transition =
          "transform 0.55s cubic-bezier(0.22,1,0.36,1)";
        phoneWrapper.style.transform = "";
        setTimeout(function () {
          if (!isOver) phoneWrapper.style.transition = "";
        }, 570);
      }
      if (!efxRaf) efxRaf = requestAnimationFrame(efxTick);
    });
  })();

  /* 4. FEATURE CARD â†’ SWITCH SCREEN */
  var featureCards = Array.prototype.slice.call(
    document.querySelectorAll(".pas-feature-card"),
  );

  featureCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      var screenKey = card.getAttribute("data-screen");
      featureCards.forEach(function (c) {
        c.classList.remove("pas-card-active");
      });
      card.classList.add("pas-card-active");
      goToScreenByKey(screenKey);
    });
    card.addEventListener("mouseleave", function () {
      card.classList.remove("pas-card-active");
    });
  });

  /* 5. INTERSECTION OBSERVER â€” entrance + stats  */
  var statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    /* Circular SVG progress + counters */
    var progEls = Array.prototype.slice.call(
      document.querySelectorAll(".pas-circle-progress"),
    );
    progEls.forEach(function (el, i) {
      var pct = parseInt(el.getAttribute("data-pct"), 10) || 0;
      var offset = CIRCUMFERENCE * (1 - pct / 100);

      setTimeout(function () {
        el.style.strokeDashoffset = offset;
      }, i * 120);
    });

    /* Number counter */
    var numEls = Array.prototype.slice.call(
      document.querySelectorAll(".pas-circle-num"),
    );
    numEls.forEach(function (el, i) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      var start = 0;
      var delay = i * 120;
      var dur = prefersReduced ? 0 : 1200;
      var startTs = null;

      setTimeout(function () {
        function step(ts) {
          if (!startTs) startTs = ts;
          var progress = Math.min((ts - startTs) / dur, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        if (dur === 0) {
          el.textContent = target;
        } else requestAnimationFrame(step);
      }, delay);
    });

    /* Stat items fade in */
    var statItems = Array.prototype.slice.call(
      document.querySelectorAll(".pas-stat-item"),
    );
    statItems.forEach(function (item, i) {
      setTimeout(function () {
        item.classList.add("pas-stat-visible");
      }, i * 100);
    });
  }

  function animateEntrance() {
    /* Cards stagger */
    var cards = Array.prototype.slice.call(
      document.querySelectorAll(".pas-feature-card"),
    );
    cards.forEach(function (card, i) {
      setTimeout(
        function () {
          card.classList.add("pas-card-visible");
        },
        300 + i * 80,
      );
    });

    /* CTA */
    var cta = document.getElementById("pasCta");
    if (cta)
      setTimeout(function () {
        cta.classList.add("pas-cta-visible");
      }, 600);
  }

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateEntrance();
          animateStats();
          sectionObserver.disconnect();
        }
      });
    },
    { threshold: 0.15 },
  );

  var pasSection = document.querySelector(".pas-section");
  if (pasSection) sectionObserver.observe(pasSection);

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
           6. BOOTSTRAP
        â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function init() {
    if (!slides.length) return;

    /* Pause float on hover */
    if (phoneWrapper) {
      phoneWrapper.addEventListener("mouseenter", function () {
        phoneHovered = true;
        phoneWrapper.style.animationPlayState = "paused";
        var shadow = document.getElementById("pasPhoneShadow");
        if (shadow) shadow.style.animationPlayState = "paused";
      });
      phoneWrapper.addEventListener("mouseleave", function () {
        phoneHovered = false;
        phoneWrapper.style.animationPlayState = "running";
        var shadow = document.getElementById("pasPhoneShadow");
        if (shadow) shadow.style.animationPlayState = "running";
      });
    }

    startCarousel();
    if (!prefersReduced) scheduleNotifs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ==========================================================
   VFC CAROUSEL — Vital Feature Card Auto-Slide
   ========================================================== */
(function vfcInit() {
  var DURATION = 4000;
  var current = 0;
  var timer = null;
  var isHovered = false;
  var slides, dots, progressFill;

  function init() {
    var card = document.getElementById("vital-card");
    if (!card) return;

    slides = Array.prototype.slice.call(card.querySelectorAll(".vfc-slide"));
    dots = Array.prototype.slice.call(card.querySelectorAll(".vfc-dot"));
    progressFill = document.getElementById("vfc-progress");

    if (!slides.length) return;

    /* Dot click handlers */
    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        goTo(idx);
      });
    });

    /* Pause on hover */
    card.addEventListener("mouseenter", function () {
      isHovered = true;
      if (progressFill) progressFill.classList.add("vfc-paused");
    });
    card.addEventListener("mouseleave", function () {
      isHovered = false;
      if (progressFill) progressFill.classList.remove("vfc-paused");
    });

    goTo(0);
    startTimer();
  }

  function goTo(idx) {
    var prev = current;
    current = ((idx % slides.length) + slides.length) % slides.length;

    slides[prev].classList.remove("active");
    slides[current].classList.add("active");

    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });

    resetProgress();
  }

  function resetProgress() {
    if (!progressFill) return;
    progressFill.classList.remove("vfc-animating", "vfc-paused");
    void progressFill.offsetWidth; /* force reflow â€” restarts CSS animation */
    progressFill.classList.add("vfc-animating");
    if (isHovered) progressFill.classList.add("vfc-paused");
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () {
      if (!isHovered) goTo((current + 1) % slides.length);
    }, DURATION);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ==========================================================
   ELIGIBILITY SCROLL-LOCK SYSTEM
   ========================================================== */
(function () {
  "use strict";

  /* ---- Age relaxation accordion ---- */
  function initAccordion() {
    document
      .querySelectorAll("#elig-scroll-scene .age-explorer-card")
      .forEach(function (card) {
        if (card.dataset.ageToggleBound === "true") return;

        var trigger = card.querySelector(".age-explorer-front") || card;
        trigger.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();

          var isOpen = card.classList.contains("expanded");
          document
            .querySelectorAll("#elig-scroll-scene .age-explorer-card.expanded")
            .forEach(function (c) {
              c.classList.remove("expanded");
            });
          if (!isOpen) card.classList.add("expanded");
        });

        card.dataset.ageToggleBound = "true";
      });
  }

  /* ---- Slide-in entry animation ---- */
  function initEntryAnim() {
    var scene = document.getElementById("elig-scroll-scene");
    if (!scene) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("elig-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    scene.querySelectorAll(".split-column").forEach(function (c) {
      io.observe(c);
    });
  }

  /* ====================================================
           SCROLL-LOCK ENGINE
           Wheel events are intercepted while the sticky section
           is in the viewport. ONLY the left (Eligibility) column
           scrolls as a vertical carousel â€” the right column is a
           static reference panel showing all cards at once.

           Page scroll resumes only when:
             - scrolling DOWN: left column reaches its bottom
             - scrolling UP:   left column returns to its top
           ==================================================== */
  function initScrollLock() {
    var scene = document.getElementById("elig-scroll-scene");
    var leftPane = document.getElementById("elig-col-pane");

    if (!scene || !leftPane) return;

    /* Skip on touch/mobile â€” CSS resets the sticky layout there */
    var mq = window.matchMedia("(max-width: 767px)");
    if (mq.matches) return;
    mq.addEventListener("change", function (e) {
      if (e.matches) document.removeEventListener("wheel", onWheel);
      else document.addEventListener("wheel", onWheel, { passive: false });
    });

    var justUnlocked = false;
    var unlockTimer = null;
    var vel = 0;
    var rafId = null;

    /* ---- Helpers ---- */
    function isInLockZone() {
      var r = scene.getBoundingClientRect();
      return r.top <= 2 && r.bottom > window.innerHeight * 0.05;
    }

    function leftAtEdge(goingDown) {
      var max = leftPane.scrollHeight - leftPane.clientHeight;
      if (max <= 1) return true; /* not scrollable â€” treat as done */
      return goingDown
        ? leftPane.scrollTop >= max - 4
        : leftPane.scrollTop <= 4;
    }

    function normDelta(e) {
      if (e.deltaMode === 1) return e.deltaY * 20;
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
      return e.deltaY;
    }

    function setJustUnlocked() {
      justUnlocked = true;
      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(function () {
        justUnlocked = false;
      }, 350);
    }

    /* ---- Momentum animation loop (left column only) ---- */
    function tick() {
      if (Math.abs(vel) > 0.3) {
        var maxL = leftPane.scrollHeight - leftPane.clientHeight;
        leftPane.scrollTop = Math.max(
          0,
          Math.min(maxL, leftPane.scrollTop + vel),
        );
        vel *= 0.87;
        rafId = requestAnimationFrame(tick);
      } else {
        vel = 0;
        rafId = null;
      }
    }

    /* ---- Wheel handler ---- */
    function onWheel(e) {
      if (justUnlocked) return;
      if (!isInLockZone()) return;

      var goingDown = e.deltaY > 0;

      if (leftAtEdge(goingDown)) {
        setJustUnlocked();
        vel = 0;
        return; /* let page scroll through */
      }

      e.preventDefault();

      var delta = normDelta(e);
      var MAX_VEL = 55;
      vel = Math.max(-MAX_VEL, Math.min(MAX_VEL, vel + delta * 0.75));

      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    document.addEventListener("wheel", onWheel, { passive: false });
  }

  /* ---- Bootstrap ---- */
  function init() {
    initAccordion();
    initEntryAnim();
    initScrollLock();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/**
 * Syllabus component — single JS module for every course landing page.
 *
 * Structure (max 3 levels, no recursion):
 *   Level 1: .syllabus-tabs > .syllabus-tablist > .syllabus-tab (+ .syllabus-panels > .syllabus-panel)
 *   Level 2: .syllabus-accordion > .syllabus-accordion-item > .syllabus-accordion-trigger + .syllabus-accordion-content
 *   Level 3 (optional): a second .syllabus-accordion nested inside a level-2 .syllabus-accordion-content,
 *                        using the exact same markup/classes as level 2.
 *
 * No JS changes are needed to add tabs or accordion items — this module works purely
 * off the class names above via event delegation, so pages only need to add HTML.
 */
(function () {
  "use strict";

  // Floating scroll-progress pill dimensions (mirrors the site's other
  // horizontally-scrollable tab strips).
  const SCROLL_TRACK_WIDTH = 160;
  const SCROLL_MIN_THUMB = 80;
  const SCROLL_MAX_THUMB = 160;

  function initScrollProgress(tablist) {
    let progressEl = tablist.nextElementSibling;
    if (!progressEl || !progressEl.classList.contains("syllabus-scroll-progress")) {
      progressEl = document.createElement("div");
      progressEl.className = "syllabus-scroll-progress";
      progressEl.setAttribute("aria-hidden", "true");
      const track = document.createElement("span");
      track.className = "syllabus-scroll-progress-track";
      const thumb = document.createElement("span");
      thumb.className = "syllabus-scroll-progress-thumb";
      track.appendChild(thumb);
      progressEl.appendChild(track);
      tablist.insertAdjacentElement("afterend", progressEl);
    }
    const thumb = progressEl.querySelector(".syllabus-scroll-progress-thumb");

    function update() {
      const { scrollWidth, clientWidth, scrollLeft } = tablist;
      const overflowing = scrollWidth > clientWidth + 1;
      tablist.classList.toggle("is-overflowing", overflowing);
      progressEl.classList.toggle("is-visible", overflowing);
      if (!overflowing) return;

      const visibleRatio = clientWidth / scrollWidth;
      const thumbWidth = Math.min(
        SCROLL_MAX_THUMB,
        Math.max(SCROLL_MIN_THUMB, SCROLL_TRACK_WIDTH * visibleRatio),
      );
      const maxScroll = scrollWidth - clientWidth;
      const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      const maxOffset = SCROLL_TRACK_WIDTH - thumbWidth;

      thumb.style.width = thumbWidth + "px";
      thumb.style.transform = "translateX(" + scrollRatio * maxOffset + "px)";
    }

    tablist.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    // Drag the thumb to scroll the tab strip.
    let dragging = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    function onDragMove(e) {
      if (!dragging) return;
      const maxScroll = tablist.scrollWidth - tablist.clientWidth;
      const thumbWidth = thumb.offsetWidth;
      const usableTrack = SCROLL_TRACK_WIDTH - thumbWidth;
      if (maxScroll <= 0 || usableTrack <= 0) return;
      if (e.cancelable) e.preventDefault();
      const deltaX = pointerX(e) - dragStartX;
      tablist.scrollLeft = dragStartScrollLeft + (deltaX / usableTrack) * maxScroll;
    }

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      progressEl.classList.remove("is-dragging");
      tablist.classList.remove("syllabus-scroll-no-smooth");
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onDragMove);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchmove", onDragMove);
      document.removeEventListener("touchend", endDrag);
    }

    function startDrag(e) {
      if (tablist.scrollWidth <= tablist.clientWidth) return;
      dragging = true;
      dragStartX = pointerX(e);
      dragStartScrollLeft = tablist.scrollLeft;
      progressEl.classList.add("is-dragging");
      tablist.classList.add("syllabus-scroll-no-smooth");
      document.body.style.userSelect = "none";
      if (e.cancelable) e.preventDefault();
      document.addEventListener("mousemove", onDragMove);
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchmove", onDragMove, { passive: false });
      document.addEventListener("touchend", endDrag);
    }

    thumb.addEventListener("mousedown", startDrag);
    thumb.addEventListener("touchstart", startDrag, { passive: false });
  }

  function initTabs(root) {
    const tablist = root.querySelector(":scope > .syllabus-tablist");
    const panelsWrap = root.querySelector(":scope > .syllabus-panels");
    if (!tablist || !panelsWrap) return;

    const tabs = Array.from(tablist.querySelectorAll(".syllabus-tab"));
    const panels = Array.from(panelsWrap.querySelectorAll(":scope > .syllabus-panel"));

    function activate(index) {
      tabs.forEach((tab, i) => {
        const isActive = i === index;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
        tab.tabIndex = isActive ? 0 : -1;
      });
      panels.forEach((panel, i) => {
        panel.classList.toggle("active", i === index);
      });
      tabs[index].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(i));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = (i + dir + tabs.length) % tabs.length;
        tabs[next].focus();
        activate(next);
      });
    });

    initScrollProgress(tablist);
  }

  function initAccordions(root) {
    root.querySelectorAll(".syllabus-accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const item = trigger.closest(".syllabus-accordion-item");
        if (!item) return;
        const group = item.parentElement; // the .syllabus-accordion this item belongs to
        const isOpen = item.classList.contains("is-open");

        // Close sibling accordion items within the same group only —
        // ancestor accordions (if this is a nested level-3 group) are left untouched.
        Array.from(group.children).forEach((sibling) => {
          if (sibling !== item && sibling.classList.contains("syllabus-accordion-item")) {
            sibling.classList.remove("is-open");
            const sibTrigger = sibling.querySelector(".syllabus-accordion-trigger");
            if (sibTrigger) sibTrigger.setAttribute("aria-expanded", "false");
          }
        });

        item.classList.toggle("is-open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  function initSyllabus() {
    document.querySelectorAll(".syllabus-tabs").forEach((root) => {
      initTabs(root);
      initAccordions(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSyllabus);
  } else {
    initSyllabus();
  }
})();
