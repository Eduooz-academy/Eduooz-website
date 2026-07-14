document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Initialize Lenis Smooth Scrolling ---
    function initLenis() {
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis script not loaded.');
            return;
        }
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });
        window.lenis = lenis;

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => { lenis.raf(time * 1000); });
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


    // --- Gallery Wall: reveals the statically rendered .gal-img-card elements ---
    function initGalleryWall() {
        const wrapper = document.getElementById('galleryWallWrapper');
        const showMoreBtn = document.getElementById('galleryShowMoreBtn');
        if (!wrapper || !showMoreBtn) return;

        const BATCH_SIZE = 18;

        function hiddenCardsByIndex() {
            return Array.from(wrapper.querySelectorAll('.gal-img-card[hidden]'))
                .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
        }

        function revealBatch() {
            const remaining = hiddenCardsByIndex();
            remaining.slice(0, BATCH_SIZE).forEach((card) => card.removeAttribute('hidden'));

            if (remaining.length <= BATCH_SIZE) {
                showMoreBtn.setAttribute('hidden', '');
            }

            // Recalculate parallax scroll boundaries now that column heights changed
            if (typeof ScrollTrigger !== 'undefined') {
                requestAnimationFrame(() => ScrollTrigger.refresh());
            }
        }

        if (hiddenCardsByIndex().length === 0) {
            showMoreBtn.setAttribute('hidden', '');
        }

        showMoreBtn.addEventListener('click', revealBatch);
    }
    initGalleryWall();


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
            delay: 0.1
        });
    

    // --- 3. Navbar Light/Dark Blend Logic (If applicable to About page) ---
    function initNavbarScroll() {
        const navbar = document.getElementById("navbar");
        if (!navbar) return;
        ScrollTrigger.create({
            start: 50, 
            onEnter: () => navbar.classList.add("light-mode"),
            onLeaveBack: () => navbar.classList.remove("light-mode")
        });
    }

    if (document.getElementById("navbar")) {
        initNavbarScroll();
    } else {
        window.addEventListener('headerLoaded', initNavbarScroll);
    }

    
    // --- 1. Hero Reveal ---
    gsap.set(".g-gal-reveal", { autoAlpha: 1 });
    gsap.from(".g-gal-reveal", {
        y: 40, opacity: 0, filter: "blur(10px)", 
        duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2
    });

    // --- 2. Asymmetrical Column Parallax (Desktop Only) ---
    let mmGallery = gsap.matchMedia();
    mmGallery.add("(min-width: 1025px)", () => {
        
        // Fast Column (Moves Up Faster)
        gsap.to(".col-fast", {
            y: -120,
            ease: "none",
            scrollTrigger: {
                trigger: ".gallery-wall-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Slow Column (Moves Up Slower)
        gsap.to(".col-slow", {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".gallery-wall-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Medium Column (Moves Up Normal)
        gsap.to(".col-medium", {
            y: -85,
            ease: "none",
            scrollTrigger: {
                trigger: ".gallery-wall-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // --- 3. Magnetic Glass Cursor Logic ---
        const cursor = document.getElementById('gallery-cursor');
        const gallerySection = document.getElementById('gallery-trigger');

        // GSAP quickTo is incredibly performant for mouse tracking
        let xTo = gsap.quickTo(cursor, "x", {duration: 0.2, ease: "power3"});
        let yTo = gsap.quickTo(cursor, "y", {duration: 0.2, ease: "power3"});

        // Track mouse position globally
        window.addEventListener("mousemove", (e) => {
            xTo(e.clientX - 40); // -40 to center the 80px cursor
            yTo(e.clientY - 40);
        });

        // Show/Hide cursor when entering/leaving the gallery section
        gallerySection.addEventListener("mouseenter", () => {
            gallerySection.classList.add("is-hovering");
        });
        
        gallerySection.addEventListener("mouseleave", () => {
            gallerySection.classList.remove("is-hovering");
        });

        // Make the cursor expand slightly when physically over a card
        // (delegated on the section so cards added later via "Show More" are covered too)
        gallerySection.addEventListener("mouseover", (e) => {
            const card = e.target.closest('.gal-img-card');
            if (card && !card.contains(e.relatedTarget)) {
                gsap.to(cursor, { scale: 1.2, duration: 0.3, backgroundColor: "rgba(6, 182, 212, 0.2)", borderColor: "var(--brand-cyan)" });
            }
        });
        gallerySection.addEventListener("mouseout", (e) => {
            const card = e.target.closest('.gal-img-card');
            if (card && !card.contains(e.relatedTarget)) {
                gsap.to(cursor, { scale: 1, duration: 0.3, backgroundColor: "rgba(255, 255, 255, 0.1)", borderColor: "rgba(255, 255, 255, 0.4)" });
            }
        });
    });

    // --- 4. Cinematic Lightbox Logic ---
    function initLightbox() {
        const lightbox = document.getElementById('gallery-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        const wrapper = document.getElementById('galleryWallWrapper');
        if (!lightbox || !lightboxImg || !closeBtn || !prevBtn || !nextBtn || !wrapper) return;

        // Full, ordered list of gallery cards (matches visual left-to-right, row-by-row order)
        // so Prev/Next can walk through every gallery image, including ones still hidden
        // behind "Show More".
        const cards = Array.from(wrapper.querySelectorAll('.gal-img-card'))
            .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

        cards.forEach((card) => {
            const img = card.querySelector('img');
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View image: ${(img && img.alt) || 'gallery photo'}`);
        });

        let currentIndex = -1;
        let lastFocusedEl = null;

        function renderCurrent() {
            const card = cards[currentIndex];
            const img = card.querySelector('img');
            if (!img) return;
            lightboxImg.src = img.getAttribute('src');
            lightboxImg.alt = img.getAttribute('alt') || '';
        }

        function showNext() {
            if (currentIndex === -1) return;
            currentIndex = (currentIndex + 1) % cards.length;
            renderCurrent();
        }

        function showPrev() {
            if (currentIndex === -1) return;
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            renderCurrent();
        }

        function trapFocus(e) {
            const focusable = [closeBtn, prevBtn, nextBtn];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNext();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            } else if (e.key === 'Tab') {
                trapFocus(e);
            }
        }

        function preventWheel(e) {
            e.preventDefault();
        }

        let touchStartX = 0;
        function handleTouchStart(e) {
            touchStartX = e.changedTouches[0].clientX;
        }
        function handleTouchEnd(e) {
            const delta = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(delta) > 50) {
                if (delta < 0) showNext(); else showPrev();
            }
        }

        function openLightbox(index) {
            currentIndex = index;
            lastFocusedEl = document.activeElement;
            renderCurrent();

            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');

            // Pause Lenis smooth-scroll and native wheel scrolling while lightbox is open
            if (window.lenis) window.lenis.stop();
            document.body.style.overflow = 'hidden';

            document.addEventListener('keydown', handleKeydown);
            lightbox.addEventListener('wheel', preventWheel, { passive: false });
            lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
            lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });

            closeBtn.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');

            // Resume Lenis scrolling
            if (window.lenis) window.lenis.start();
            document.body.style.overflow = '';

            document.removeEventListener('keydown', handleKeydown);
            lightbox.removeEventListener('wheel', preventWheel);
            lightbox.removeEventListener('touchstart', handleTouchStart);
            lightbox.removeEventListener('touchend', handleTouchEnd);

            setTimeout(() => { lightboxImg.src = ""; }, 400); // Clear image after fade out

            if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
                lastFocusedEl.focus();
            }
            currentIndex = -1;
        }

        // Open Lightbox (delegated so cards revealed later via "Show More" still work)
        wrapper.addEventListener('click', (e) => {
            const card = e.target.closest('.gal-img-card');
            if (!card) return;
            const index = cards.indexOf(card);
            if (index === -1) return;
            openLightbox(index);
        });

        // Keyboard activation (Enter / Space) for focused gallery cards
        wrapper.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const card = e.target.closest('.gal-img-card');
            if (!card) return;
            e.preventDefault();
            const index = cards.indexOf(card);
            if (index === -1) return;
            openLightbox(index);
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            // Close if clicking outside the image
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }
    initLightbox();

    function initFooterAnimation() {
        let mmFooter = gsap.matchMedia();
        
        mmFooter.add("(min-width: 1025px)", () => {
            gsap.set(".luxury-footer-inner", { willChange: "transform, opacity" });

            gsap.from(".luxury-footer-inner", {
                scrollTrigger: {
                    trigger: ".luxury-footer-wrapper",
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 1
                },
                yPercent: -20,
                scale: 0.95,
                opacity: 0.5,
                ease: "none",
                force3D: true
            });
        });
    }

    if (document.querySelector('.luxury-footer-wrapper')) {
        initFooterAnimation();
    } else {
        window.addEventListener('footerLoaded', initFooterAnimation);
    }

    // --- 10. Scroll to Top Button ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            // Use Lenis smooth scroll if available, otherwise native
            if (window.lenis) {
                window.lenis.scrollTo(0, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

});
