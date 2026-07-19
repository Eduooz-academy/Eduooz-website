(function () {
  "use strict";

  /**
   * Detect base path for components.
   * It looks at the current script's src to determine the relative path to the root.
   * This ensures it works on local files, root domains, and subdirectories (GitHub Pages).
   */
  function getBasePath() {
    const script = document.querySelector('script[src*="components.js"]');
    if (!script) return "./";

    const src = script.getAttribute("src");
    // If the src is root-relative (starts with /), we return it up to the assets folder
    if (src.startsWith("/")) {
      return src.substring(0, src.indexOf("assets/"));
    }

    // Otherwise, return the relative part before 'assets/'
    const assetsIndex = src.indexOf("assets/");
    if (assetsIndex === -1) return "./";

    return src.substring(0, assetsIndex);
  }

  const basePath = getBasePath();

  function ensureFontAwesome() {
    if (document.querySelector('link[href*="font-awesome"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(link);
  }

  /**
   * Shared Inline YouTube Video Player
   * ---------------------------------------------------------------------
   * A single reusable player used across the whole site so that clicking a
   * video thumbnail/card/button never navigates away to youtube.com and
   * never opens a popup or fullscreen modal. Instead the iframe is inserted
   * directly inside the clicked video's own box (mediaBox) — that box
   * already owns its size, border-radius, shadow and overflow:hidden via
   * the page's existing CSS, so the iframe just fills it and inherits all
   * of that for free. Only one video plays at a time: starting a new one
   * tears down whichever box was previously playing.
   */
  let evmCurrentlyPlaying = null; // { mediaBox, iframe }

  function extractYouTubeId(input) {
    if (!input) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const re of patterns) {
      const match = input.match(re);
      if (match) return match[1];
    }
    return null;
  }

  function ensureInlinePlayerStylesheet() {
    if (document.querySelector('link[href*="inline-video-player.css"]'))
      return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = basePath + "assets/css/inline-video-player.css";
    document.head.appendChild(link);
  }

  function stopInlineVideo() {
    if (!evmCurrentlyPlaying) return;
    const { mediaBox, iframe } = evmCurrentlyPlaying;
    if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
    const watchBtn = mediaBox.querySelector(":scope > .evm-inline-watch");
    if (watchBtn) watchBtn.remove();
    mediaBox.classList.remove("evm-inline-active");
    evmCurrentlyPlaying = null;
  }

  // Stops playback only if the given box is the one currently playing —
  // used when a page swaps which video a "featured" box represents
  // (e.g. clicking a playlist thumbnail) without itself starting playback.
  function stopInlineVideoIn(mediaBox) {
    if (evmCurrentlyPlaying && evmCurrentlyPlaying.mediaBox === mediaBox) {
      stopInlineVideo();
    }
  }

  function playInlineVideo(mediaBox, idOrUrl) {
    if (!mediaBox) return;
    const videoId = extractYouTubeId(idOrUrl);
    if (!videoId) return;

    if (evmCurrentlyPlaying && evmCurrentlyPlaying.mediaBox !== mediaBox) {
      stopInlineVideo();
    }

    ensureInlinePlayerStylesheet();
    mediaBox.classList.add("evm-inline-active");

    let iframe = mediaBox.querySelector(":scope > .evm-inline-iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.className = "evm-inline-iframe";
      iframe.title = "YouTube video player";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      );
      iframe.setAttribute("allowfullscreen", "");
      mediaBox.appendChild(iframe);
    }
    iframe.src =
      "https://www.youtube.com/embed/" +
      videoId +
      "?autoplay=1&rel=0&modestbranding=1";

    let watchBtn = mediaBox.querySelector(":scope > .evm-inline-watch");
    if (!watchBtn) {
      watchBtn = document.createElement("a");
      watchBtn.className = "evm-inline-watch";
      watchBtn.target = "_blank";
      watchBtn.rel = "noopener noreferrer";
      watchBtn.innerHTML =
        '<i class="fa-brands fa-youtube" aria-hidden="true"></i> Watch on YouTube';
      mediaBox.appendChild(watchBtn);
    }
    watchBtn.href = /^https?:\/\//.test(idOrUrl)
      ? idOrUrl
      : "https://www.youtube.com/watch?v=" + videoId;

    evmCurrentlyPlaying = { mediaBox, iframe };
  }

  window.EduoozInlinePlayer = {
    play: playInlineVideo,
    stop: stopInlineVideo,
    stopIfBox: stopInlineVideoIn,
  };

  // Opt-in safety net: any element anywhere on the site can trigger inline
  // playback of itself just by carrying one of these data attributes
  // (it must already be a position:relative, sized, overflow:hidden box),
  // without needing its own JS wiring.
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(
      "[data-yt-video], [data-youtube], [data-video-url]",
    );
    if (!trigger) return;
    const raw =
      trigger.getAttribute("data-yt-video") ||
      trigger.getAttribute("data-youtube") ||
      trigger.getAttribute("data-video-url");
    if (!extractYouTubeId(raw)) return;
    e.preventDefault();
    playInlineVideo(trigger, raw);
  });

  // Component paths - automatically adjusted for subdirectories
  const components = {
    header: basePath + "components/header.html",
    footer: basePath + "components/footer.html",
    chat: basePath + "components/chat.html",
    enquiryForm: basePath + "components/lead-enquiry-form.html",
  };

  /**
   * Load a component into a container element
   * @param {string} componentPath - Path to the component HTML file
   * @param {string} containerId - ID of the container element
   */
  function loadComponent(componentPath, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(componentPath)
      .then((response) => {
        if (!response.ok)
          throw new Error("Component not found: " + componentPath);
        return response.text();
      })
      .then((html) => {
        // Fix relative paths if we are in a subdirectory
        if (basePath && basePath !== "" && basePath !== "/") {
          // Update href and src that don't start with http(s), mailto, tel,
          // javascript, data, a hash anchor, or a root-relative path
          html = html.replace(
            /(href|src)="(?!(?:https?:|mailto:|tel:|javascript:|data:|#|\/))([^"]+)"/g,
            '$1="' + basePath + '$2"',
          );
        }

        ensureFontAwesome();
        container.innerHTML = html;

        if (containerId === "header-container") {
          highlightActiveNav();
          // initMobileAccordion must run first: it wraps the course-section
          // content and builds the toggle buttons that the other two
          // functions' selectors and reset logic rely on.
          initMobileAccordion();
          // initMegaMenu must attach its sidebar-item click handler before
          // initMobileNavbar's "close on link click" handler (registration
          // order = firing order for listeners on the same element), so the
          // category-switch preventDefault() lands before the closer checks
          // e.defaultPrevented.
          initMegaMenu();
          initMobileNavbar();
          window.dispatchEvent(new Event("headerLoaded"));
        }

        if (containerId === "footer-container") {
          initScrollToTop();
          initSocialDropdown();
          window.dispatchEvent(new Event("footerLoaded"));
        }

        if (containerId === "chat-container") {
          initChatFab();
        }

        if (containerId === "enquiry-form-container") {
          window.dispatchEvent(new Event("enquiryFormLoaded"));
        }
      })
      .catch((error) => {
        console.error("Error loading component:", error);
      });
  }

  /**
   * Initialize Scroll To Top Button
   */
  function initScrollToTop() {
    const scrollBtn = document.getElementById("scrollToTopBtn");
    if (!scrollBtn) return;

    // Show/Hide on scroll
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 500) {
          scrollBtn.classList.add("show");
        } else {
          scrollBtn.classList.remove("show");
        }
      },
      { passive: true },
    );

    // Smooth scroll to top
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /**
   * Initialize the per-platform (Facebook/YouTube/Instagram) social icon
   * panels in the footer, each listing that platform's profile/page/channel
   * links. Opens on hover or keyboard focus (desktop), with a short close
   * delay so moving the cursor from the button up into the panel doesn't
   * lose the hover state. Click is kept as a tap-to-toggle fallback for
   * touch devices. Panels reposition horizontally (via a --dd-shift custom
   * property) so they never overflow the viewport edge.
   */
  function initSocialDropdown() {
    const wraps = document.querySelectorAll(".social-dropdown-wrap");
    if (!wraps.length) return;

    const closeTimers = new WeakMap();

    function clearCloseTimer(wrap) {
      const timer = closeTimers.get(wrap);
      if (timer) {
        clearTimeout(timer);
        closeTimers.delete(wrap);
      }
    }

    function closeDropdown(wrap) {
      clearCloseTimer(wrap);
      wrap.classList.remove("open");
      const trigger = wrap.querySelector(".social-dropdown-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    }

    function closeAll(except) {
      wraps.forEach((wrap) => {
        if (wrap !== except) closeDropdown(wrap);
      });
    }

    function repositionMenu(wrap) {
      const menu = wrap.querySelector(".social-dropdown-menu");
      if (!menu) return;
      const margin = 10;
      const menuWidth = menu.offsetWidth;
      const wrapRect = wrap.getBoundingClientRect();
      const wrapCenter = wrapRect.left + wrapRect.width / 2;
      const halfMenu = menuWidth / 2;
      const leftEdge = wrapCenter - halfMenu;
      const rightEdge = wrapCenter + halfMenu;
      let shift = 0;
      if (leftEdge < margin) {
        shift = margin - leftEdge;
      } else if (rightEdge > window.innerWidth - margin) {
        shift = window.innerWidth - margin - rightEdge;
      }
      wrap.style.setProperty("--dd-shift", shift + "px");
    }

    function openDropdown(wrap) {
      clearCloseTimer(wrap);
      closeAll(wrap);
      repositionMenu(wrap);
      wrap.classList.add("open");
      const trigger = wrap.querySelector(".social-dropdown-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    }

    // True on desktops with a real mouse: hover/mouseleave already manage
    // the open state there, and a mouse always fires "mouseenter" (opening
    // the panel) before "click", so letting click also toggle would just
    // immediately re-close whatever hover opened. Touch devices have no
    // hover, so click is their only way to open/close (tap-to-toggle).
    const isTouchOnly = !window.matchMedia("(hover: hover) and (pointer: fine)")
      .matches;

    // Tracks whether a wrap was already open the instant a pointer press
    // landed on it, captured before the browser's own focus() call (which
    // fires before "click") can flip that state via the focusin handler.
    const pointerOpenState = new WeakMap();

    wraps.forEach((wrap) => {
      const trigger = wrap.querySelector(".social-dropdown-trigger");
      if (!trigger) return;

      wrap.addEventListener("mouseenter", () => openDropdown(wrap));
      wrap.addEventListener("mouseleave", () => {
        const timer = setTimeout(() => closeDropdown(wrap), 200);
        closeTimers.set(wrap, timer);
      });

      wrap.addEventListener("focusin", () => openDropdown(wrap));
      wrap.addEventListener("focusout", () => {
        // relatedTarget isn't reliably populated across browsers for
        // Tab-driven focus changes, so re-check on the next tick instead,
        // once document.activeElement has definitely settled.
        setTimeout(() => {
          if (!wrap.contains(document.activeElement)) closeDropdown(wrap);
        }, 0);
      });

      trigger.addEventListener("pointerdown", () => {
        pointerOpenState.set(wrap, wrap.classList.contains("open"));
      });

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!isTouchOnly) return; // desktop: hover/mouseleave already handle it

        const wasOpenBeforeInteraction = pointerOpenState.get(wrap) || false;
        pointerOpenState.delete(wrap);
        if (wasOpenBeforeInteraction) {
          closeDropdown(wrap);
        } else {
          openDropdown(wrap);
        }
      });

      wrap.querySelectorAll(".social-dropdown-menu a").forEach((link) => {
        link.addEventListener("click", () => closeDropdown(wrap));
      });
    });

    document.addEventListener("click", (e) => {
      wraps.forEach((wrap) => {
        if (!wrap.contains(e.target)) closeDropdown(wrap);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAll();
        const activeWrap = Array.from(wraps).find((wrap) =>
          wrap.contains(document.activeElement),
        );
        if (activeWrap) {
          const trigger = activeWrap.querySelector(".social-dropdown-trigger");
          if (trigger) trigger.focus();
        }
      }
    });

    window.addEventListener("resize", () => {
      wraps.forEach((wrap) => {
        if (wrap.classList.contains("open")) repositionMenu(wrap);
      });
    });
  }

  /**
   * Initialize the Premium Chat FAB button
   * - Delayed entrance animation on scroll
   * - Toggle active state on click (opens panel)
   * - Quick replies, message sending, typing indicator
   */
  function initChatFab() {
    const chatFab = document.getElementById("chatFab");
    const chatBtn = document.getElementById("chatFabBtn");
    const chatPanelClose = document.getElementById("chatPanelClose");

    if (!chatFab || !chatBtn) return;

    let chatShown = false;

    // Show chat button after scrolling 300px OR after 4 seconds
    const showChat = () => {
      if (chatShown) return;
      chatShown = true;
      chatFab.classList.add("visible");
    };

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 300) showChat();
      },
      { passive: true },
    );

    setTimeout(showChat, 4000);

    // Toggle panel on FAB click
    chatBtn.addEventListener("click", () => {
      chatFab.classList.toggle("active");

      // Add class to body to hide scroll-to-top button
      const isActive = chatFab.classList.contains("active");
      document.body.classList.toggle("chat-is-open", isActive);
    });

    // Close panel via minimize button
    if (chatPanelClose) {
      chatPanelClose.addEventListener("click", () => {
        chatFab.classList.remove("active");
        document.body.classList.remove("chat-is-open");
      });
    }
  }

  /**
   * Initialize Mega Menu functionality (Desktop)
   * - Handles category switching on hover and keyboard (Enter/Space)
   * - Tracks aria-expanded on the trigger link
   */
  function initMegaMenu() {
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const panels = document.querySelectorAll(".category-panel");
    const dropdownWrapper = document.querySelector(".nav-item.dropdown");
    const trigger = document.getElementById("courses-menu-trigger");

    if (!sidebarItems.length || !panels.length) return;

    function activateCategory(category) {
      sidebarItems.forEach((si) => {
        si.classList.remove("active");
        si.setAttribute("aria-selected", "false");
      });
      panels.forEach((panel) => {
        panel.classList.remove("active");
        if (panel.id === category) panel.classList.add("active");
      });
      const active = document.querySelector(
        '.sidebar-item[data-category="' + category + '"]',
      );
      if (active) {
        active.classList.add("active");
        active.setAttribute("aria-selected", "true");
      }

      // Switching category always starts from the fully-collapsed course
      // list, so the panel that opens is never the huge, all-expanded one.
      document.querySelectorAll(".course-section.expanded").forEach((s) => {
        s.classList.remove("expanded");
        const t = s.querySelector(".course-section-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }

    sidebarItems.forEach((item) => {
      item.addEventListener("mouseenter", function () {
        activateCategory(this.getAttribute("data-category"));
      });

      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activateCategory(this.getAttribute("data-category"));
        }
      });

      // On mobile there's no hover preview, so tapping a category tab
      // switches the panel instead of navigating straight to its page.
      item.addEventListener("click", function (e) {
        if (window.innerWidth > 1024) return; // desktop: let the link navigate
        e.preventDefault();
        activateCategory(this.getAttribute("data-category"));
      });
    });

    if (dropdownWrapper && trigger) {
      dropdownWrapper.addEventListener("mouseenter", () =>
        trigger.setAttribute("aria-expanded", "true"),
      );
      dropdownWrapper.addEventListener("mouseleave", () =>
        trigger.setAttribute("aria-expanded", "false"),
      );
    }
  }

  /**
   * Prepare the mobile "About Us" / "Courses" panels and the deep course
   * lists for progressive disclosure:
   * - Wraps each dropdown panel's content in a single element so it can be
   *   collapsed/expanded with a CSS grid-template-rows transition instead
   *   of an abrupt display:none/block swap.
   * - Turns each course-section heading ("Central Nursing Exams", etc.)
   *   into an accordion toggle so its course list only renders on demand,
   *   instead of dumping every course for a category on screen at once.
   * All of this is inert on desktop: the wrapper elements default to
   * display:contents (see header-footer.css) and the collapse styling only
   * exists inside the mobile media query, so desktop's layout is unchanged.
   */
  function initMobileAccordion() {
    function wrapChildrenOnce(el, wrapperClass) {
      if (!el || el.querySelector(":scope > ." + wrapperClass)) return;
      const wrapper = document.createElement("div");
      wrapper.className = wrapperClass;
      while (el.firstChild) wrapper.appendChild(el.firstChild);
      el.appendChild(wrapper);
    }

    wrapChildrenOnce(document.querySelector(".simple-menu"), "dropdown-panel-inner");
    wrapChildrenOnce(document.querySelector(".mega-menu"), "dropdown-panel-inner");

    let sectionId = 0;
    document.querySelectorAll(".course-section").forEach((section) => {
      const title = section.querySelector(":scope > .course-section-title");
      if (!title || section.querySelector(":scope > .course-section-body")) {
        return;
      }

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "course-section-toggle";
      while (title.firstChild) toggle.appendChild(title.firstChild);

      const caret = document.createElement("i");
      caret.className = "fa-solid fa-chevron-down section-caret";
      caret.setAttribute("aria-hidden", "true");
      toggle.appendChild(caret);

      const bodyId = "course-section-body-" + ++sectionId;
      const body = document.createElement("div");
      body.className = "course-section-body";
      body.id = bodyId;
      const inner = document.createElement("div");
      inner.className = "course-section-body-inner";
      body.appendChild(inner);

      let node = title.nextSibling;
      while (node) {
        const next = node.nextSibling;
        inner.appendChild(node);
        node = next;
      }

      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", bodyId);
      // This control only does something inside the mobile collapse CSS, so
      // keep it out of the desktop tab order rather than adding an inert
      // stop to desktop's keyboard flow.
      toggle.tabIndex = window.innerWidth <= 1024 ? 0 : -1;

      title.appendChild(toggle);
      section.appendChild(body);

      toggle.addEventListener("click", function () {
        const currentSection = this.closest(".course-section");
        const panel = this.closest(".category-panel");
        const wasExpanded = currentSection.classList.contains("expanded");

        if (panel) {
          panel
            .querySelectorAll(":scope .course-section.expanded")
            .forEach((s) => {
              if (s === currentSection) return;
              s.classList.remove("expanded");
              const t = s.querySelector(".course-section-toggle");
              if (t) t.setAttribute("aria-expanded", "false");
            });
        }

        currentSection.classList.toggle("expanded", !wasExpanded);
        this.setAttribute("aria-expanded", String(!wasExpanded));

        // If opening this section pushed it toward/past the bottom edge,
        // gently bring it back into view once the expand transition has
        // had a moment to run — never a hard jump, and never on collapse.
        if (!wasExpanded) {
          const toggleEl = this;
          setTimeout(() => {
            toggleEl.scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
              block: "nearest",
            });
          }, 240);
        }
      });
    });
  }

  /**
   * Initialize mobile navbar functionality
   * - Close on outside click
   * - Toggle overlay
   * - Close on nav link click
   */
  function initMobileNavbar() {
    const navbarToggler = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!navbarToggler || !navLinks) return;

    function closeOpenDropdowns() {
      navLinks.querySelectorAll(".nav-item.dropdown.open").forEach((el) => {
        el.classList.remove("open");
        const trigger = el.querySelector(":scope > a");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
      // Reset the deep course accordion too, so reopening the menu later
      // always starts from the compact, fully-collapsed state.
      navLinks.querySelectorAll(".course-section.expanded").forEach((el) => {
        el.classList.remove("expanded");
        const toggle = el.querySelector(":scope > .course-section-title .course-section-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    }

    navbarToggler.addEventListener("click", function () {
      this.classList.toggle("active");
      navLinks.classList.toggle("active");
      const isOpen = navLinks.classList.contains("active");
      document.body.style.overflow = isOpen ? "hidden" : "";
      this.setAttribute("aria-expanded", String(isOpen));
      this.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu",
      );

      if (!isOpen) closeOpenDropdowns();
    });

    // role="button" alone doesn't give this <div> native Enter/Space
    // activation, so wire it up explicitly.
    navbarToggler.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });

    // On mobile, dropdown triggers (About Us, Courses) toggle their submenu
    // instead of navigating away immediately, since there's no hover on touch.
    const dropdownTriggers = navLinks.querySelectorAll(".nav-item.dropdown > a");
    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", function (e) {
        if (window.innerWidth > 1024) return; // desktop uses hover

        const navItem = this.closest(".nav-item.dropdown");
        const isOpen = navItem.classList.contains("open");
        const tappedCaret = !!e.target.closest(".dropdown-caret");

        if (isOpen && !tappedCaret) return; // already open: let the link navigate

        e.preventDefault();

        if (isOpen) {
          navItem.classList.remove("open");
          this.setAttribute("aria-expanded", "false");
          return;
        }

        closeOpenDropdowns();
        navItem.classList.add("open");
        this.setAttribute("aria-expanded", "true");
      });
    });

    // Close navbar when clicking a nav link
    const links = navLinks.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        if (e.defaultPrevented) return; // dropdown toggle handled this click
        navbarToggler.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
        closeOpenDropdowns();
      });
    });
  }

  /**
   * Highlight the active navigation link based on current page
   */
  function highlightActiveNav() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      // Check if this link matches current page
      if (link.classList.contains("header-cta")) return;

      if (
        href === currentPage ||
        (currentPage === "index.html" && href === "#home") ||
        (currentPage === "" && href === "#home")
      ) {
        link.classList.add("active");
      } else if (!href.startsWith("#")) {
        link.classList.remove("active");
      }
    });
  }

  // Load components when DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    loadComponent(components.header, "header-container");
    loadComponent(components.footer, "footer-container");
    loadComponent(components.chat, "chat-container");
    loadComponent(components.enquiryForm, "enquiry-form-container");
  });
})();
