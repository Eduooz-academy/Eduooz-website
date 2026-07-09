# Eduooz Website

Official static website for **Eduooz International Academy**, a healthcare exam coaching academy based in Trivandrum, Kerala, India, preparing candidates for Nursing, Pharmacy, and Medical Laboratory Technology (MLT) recruitment and licensure exams.

## Live Website

https://www.eduooz.com/

## Project Overview

This repository contains the full public website: marketing/informational pages, a per-category course catalogue (Nursing, Pharmacy, MLT), an in-browser mock-test/practice-question engine, and the SEO/AI-discovery files that describe the site to search engines and AI crawlers.

The site is a static HTML/CSS/JavaScript project — there is no build step, bundler, or package manager. Pages are plain `.html` files that load shared UI fragments (header, footer, forms, chat widget) at runtime via JavaScript from `components/`.

## Main Sections

- **Nursing** — `courses/nursing.html` plus individual exam pages under `courses/nursing/central/`, `courses/nursing/kerala/`, `courses/nursing/gcc/`
- **Pharmacy** — `courses/pharmacy.html` plus individual exam pages under `courses/pharmacy/central/`, `courses/pharmacy/kerala/`, `courses/pharmacy/gcc/`
- **Medical Laboratory Technology (MLT)** — `courses/mlt.html` plus individual exam pages under `courses/mlt/central/`, `courses/mlt/kerala/`
- **Faculty** — `faculties.html`
- **Placements** — `placements.html`
- **Publications** — `publications.html`
- **Testimonials** — `testimonials.html`
- **Gallery** — `gallery.html`
- **Blogs** — `blogs.html`
- **About** — `about.html`
- **Contact** — `contact.html`
- **Legal** — `privacy-policy.html`, `terms-conditions.html`

## Project Structure

```
/
├── assets/
│   ├── css/                 # Per-page stylesheets
│   ├── js/                  # Per-page scripts + shared component loader
│   ├── images/              # Site images, logo, favicon source
│   ├── Eduooz-app/           # Mobile app screenshots used on the homepage
│   ├── Prev.Qn.papers/       # Downloadable previous question paper PDFs
│   └── Syllabus/             # Downloadable syllabus PDFs
├── components/
│   ├── header.html           # Shared header fragment (loaded via JS)
│   ├── footer.html           # Shared footer fragment (loaded via JS)
│   ├── chat.html              # Chat widget fragment
│   ├── enquiry-form.html      # Enquiry form fragment
│   ├── lead-enquiry-form.html # Lead enquiry form fragment
│   ├── question-banks/        # Practice-test question bank data files
│   └── mock-test-questions/   # Mock test question data files
├── courses/
│   ├── nursing.html
│   ├── pharmacy.html
│   ├── mlt.html
│   ├── nursing/{central,kerala,gcc}/   # Individual nursing exam pages
│   ├── pharmacy/{central,kerala,gcc}/  # Individual pharmacy exam pages
│   └── mlt/{central,kerala}/           # Individual MLT exam pages
├── about.html, blogs.html, contact.html, courses.html,
│   faculties.html, gallery.html, placements.html,
│   privacy-policy.html, terms-conditions.html, testimonials.html
├── index.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── humans.txt
├── llms.txt
├── CNAME
└── README.md
```

## Technology

- **HTML5** / **CSS3** / vanilla **JavaScript** (no framework, no bundler)
- **GSAP** + **ScrollTrigger** — scroll and UI animation (loaded from cdnjs)
- **Three.js** — background/visual effects (loaded from unpkg)
- **Lenis** — smooth scrolling (loaded from unpkg)
- **Chart.js** — score/analytics charts on individual course pages (loaded from jsDelivr)
- **Font Awesome** — icon set (loaded from cdnjs)
- **Google Fonts** — Plus Jakarta Sans, Cormorant Garamond

All third-party libraries are loaded via CDN `<script>`/`<link>` tags directly in each HTML page; there are no local `node_modules` or bundled dependencies.

## Local Development

This is a static site — no install or build step is required.

- **Quickest**: open `index.html` directly in a browser.
- **Recommended** (so relative paths and `fetch()`-loaded components in `components/` resolve correctly): serve the folder with any simple static file server, for example:

  ```
  python -m http.server 8000
  ```

  then visit `http://localhost:8000/`.

`clean_css.js` at the repository root is a standalone Node.js helper script used for local CSS maintenance; it is not part of the deployed site and is not required to run or view the site.

## Deployment

A `CNAME` file at the repository root maps the site to the custom domain `eduooz.com`, indicating the site is deployed via **GitHub Pages**. No deployment secrets, tokens, or DNS configuration are stored in this repository.

## SEO and Discovery Files

- **`sitemap.xml`** — Canonical list of indexable public pages for search engines. Excludes redirect stubs, noindex pages, and component/fragment files.
- **`robots.txt`** — Allows crawling of all public content, disallows `/components/` (JS-loaded UI fragments that are not standalone pages), and references `sitemap.xml`.
- **`humans.txt`** — Short, factual credits file describing the site and verified technologies in use.
- **`llms.txt`** — Concise, curated guide for AI systems/LLMs summarizing the site's purpose, main pages, and course categories. It is supplementary to — not a replacement for — `sitemap.xml`, `robots.txt`, and canonical tags.

## Maintenance Notes

- Update `sitemap.xml` whenever public pages are added, removed, or renamed.
- Keep canonical (`<link rel="canonical">`) URLs consistent with the page's own `sitemap.xml` entry.
- Do not add pages under `components/` to `sitemap.xml`, `robots.txt` allow rules, or `llms.txt` — they are partial fragments, not standalone pages.
- `publications.html` is a real, standalone page (publications gallery with lightbox); its `<head>` previously had leftover `placements.html` metadata (title, canonical, OG/Twitter, JSON-LD), which has been corrected. Its 8 publication card images are currently placeholder Unsplash stock photos, not real Eduooz publication covers — replace them with actual assets when available.
- `publiations.html` (misspelled, no "c") is a redirect stub to `publications.html`; it is intentionally excluded from `sitemap.xml`.
- `structure.html` is a `noindex` internal page template and is intentionally excluded from `sitemap.xml`.
- Only update `<lastmod>` values in `sitemap.xml` when a page's content meaningfully changes.
- Verify internal links after moving or renaming any page, especially within `courses/`.
