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


    // --- Gallery Wall: local image data (assets/images/gallary-images/) ---
    const galleryImages = [
    { file: "(1).png", w: 1097, h: 620 },
    { file: "DSC03466.JPG", w: 7008, h: 4672 },
    { file: "DSC03467.JPG", w: 7008, h: 4672 },
    { file: "(2).png", w: 1063, h: 623 },
    { file: "DSC03468.JPG", w: 7008, h: 4672 },
    { file: "DSC03469.JPG", w: 7008, h: 4672 },
    { file: "(3).PNG", w: 1637, h: 928 },
    { file: "DSC03470.JPG", w: 7008, h: 4672 },
    { file: "DSC03471.JPG", w: 7008, h: 4672 },
    { file: "DSC03472.JPG", w: 7008, h: 4672 },
    { file: ".PNG", w: 1589, h: 913 },
    { file: "DSC03473.JPG", w: 7008, h: 4672 },
    { file: "DSC03474.JPG", w: 7008, h: 4672 },
    { file: "1.jpeg", w: 1108, h: 584 },
    { file: "DSC03475.JPG", w: 7008, h: 4672 },
    { file: "DSC03476.JPG", w: 7008, h: 4672 },
    { file: "DSC03477.JPG", w: 7008, h: 4672 },
    { file: "PNG(2).png", w: 1597, h: 921 },
    { file: "DSC03478.JPG", w: 7008, h: 4672 },
    { file: "DSC03479.JPG", w: 7008, h: 4672 },
    { file: "PNG(3).png", w: 1772, h: 921 },
    { file: "DSC03480.JPG", w: 7008, h: 4672 },
    { file: "DSC03481.JPG", w: 7008, h: 4672 },
    { file: "PNG(5).png", w: 1695, h: 942 },
    { file: "DSC03482.JPG", w: 7008, h: 4672 },
    { file: "DSC03483.JPG", w: 7008, h: 4672 },
    { file: "DSC03494.JPG", w: 7008, h: 4672 },
    { file: "PNG(7).png", w: 1762, h: 955 },
    { file: "DSC03495.JPG", w: 7008, h: 4672 },
    { file: "DSC03496.JPG", w: 7008, h: 4672 },
    { file: "WhatsApp Image 2026-07-01 at 15.11.12.jpeg", w: 1104, h: 620 },
    { file: "DSC03497.JPG", w: 7008, h: 4672 },
    { file: "DSC03498.JPG", w: 7008, h: 4672 },
    { file: "DSC03499.JPG", w: 7008, h: 4672 },
    { file: "WhatsApp Image 2026-07-01 at 16.28.20.jpeg", w: 1437, h: 801 },
    { file: "DSC03500.JPG", w: 7008, h: 4672 },
    { file: "DSC03501.JPG", w: 7008, h: 4672 },
    { file: "WhatsApp Image 2026-07-01 at 16.28.21.jpeg", w: 1440, h: 900 },
    { file: "DSC03502.JPG", w: 7008, h: 4672 },
    { file: "DSC03503.JPG", w: 7008, h: 4672 },
    { file: "png(1).png", w: 1102, h: 614 },
    { file: "DSC03504.JPG", w: 7008, h: 4672 },
    { file: "DSC03505.JPG", w: 7008, h: 4672 },
    { file: "DSC03507.JPG", w: 7008, h: 4672 },
    { file: "png(4).png", w: 1103, h: 557 },
    { file: "DSC03509.JPG", w: 7008, h: 4672 },
    { file: "DSC03657.JPG", w: 7008, h: 4672 },
    { file: "png(6).png", w: 1119, h: 553 },
    { file: "DSC03658.JPG", w: 7008, h: 4672 },
    { file: "DSC03662.JPG", w: 7008, h: 4672 },
    { file: "DSC03665.JPG", w: 7008, h: 4672 },
    { file: "png.png", w: 1104, h: 566 },
    { file: "DSC03712.JPG", w: 7008, h: 4672 },
    { file: "DSC03714.JPG", w: 7008, h: 4672 },
    { file: "pp.png", w: 979, h: 523 },
    { file: "DSC03719.JPG", w: 7008, h: 4672 },
    { file: "DSC03723.JPG", w: 7008, h: 4672 },
    { file: "DSC03725.JPG", w: 7008, h: 4672 },
    ];

    function initGalleryWall() {
        const wrapper = document.getElementById('galleryWallWrapper');
        const showMoreBtn = document.getElementById('galleryShowMoreBtn');
        if (!wrapper || !showMoreBtn) return;

        const columns = wrapper.querySelectorAll('.gal-column');
        const basePath = 'assets/images/gallary-images/';
        const BATCH_SIZE = 18;
        let renderedCount = 0;

        function renderBatch() {
            const next = galleryImages.slice(renderedCount, renderedCount + BATCH_SIZE);
            next.forEach((item, i) => {
                const globalIndex = renderedCount + i;
                const card = document.createElement('div');
                card.className = 'gal-img-card';

                const img = document.createElement('img');
                img.src = basePath + encodeURIComponent(item.file);
                img.alt = 'Eduooz campus gallery photo';
                img.width = item.w;
                img.height = item.h;
                img.loading = globalIndex < 6 ? 'eager' : 'lazy';

                card.appendChild(img);
                columns[globalIndex % columns.length].appendChild(card);
            });
            renderedCount += next.length;

            if (renderedCount >= galleryImages.length) {
                showMoreBtn.setAttribute('hidden', '');
            }

            // Recalculate parallax scroll boundaries now that column heights changed
            if (typeof ScrollTrigger !== 'undefined') {
                requestAnimationFrame(() => ScrollTrigger.refresh());
            }
        }

        showMoreBtn.addEventListener('click', renderBatch);

        renderBatch(); // initial batch
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
            yPercent: -40, 
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
            yPercent: -15, 
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
            yPercent: -25, 
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
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const galleryWallWrapper = document.getElementById('galleryWallWrapper');

    // Open Lightbox (delegated so images added later via "Show More" work too)
    if (galleryWallWrapper) {
        galleryWallWrapper.addEventListener('click', (e) => {
            const img = e.target.closest('.gal-img-card img');
            if (!img) return;
            const highResSrc = img.getAttribute('src');
            lightboxImg.src = highResSrc;
            lightbox.classList.add('active');

            // Pause Lenis scrolling while lightbox is open
            if(window.lenis) window.lenis.stop();
        });
    }

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => { lightboxImg.src = ""; }, 400); // Clear image after fade out
        
        // Resume Lenis scrolling
        if(window.lenis) window.lenis.start();
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        // Close if clicking outside the image
        if(e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

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
