# Monachil Capital Partners Website

Corporate website for Monachil Capital Partners LP, built with [Astro](https://astro.build/).

## Local Development

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:4321
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run test         # Run Playwright tests
```

## Deployment

Pushes to `main` trigger GitHub Actions (`.github/workflows/deploy.yml`) which builds and deploys to GitHub Pages automatically.

## Editing Content

### Research Articles

Add a Markdown file to `src/content/research/`:

```yaml
---
title: "Article Title"
date: 2025-01-15
category: "Market Commentary"
description: "Short summary for cards and SEO"
pdf: "/pdfs/Commentary-20250115.pdf"
---

Article body in Markdown...
```

Place the PDF in `public/pdfs/` and any chart images in `public/images/charts/`.

Content is validated against the Zod schema in `src/content.config.ts` — the build will fail if required fields are missing.

### Pages

Page templates are Astro components in `src/pages/`:

| Page | Template |
|------|----------|
| Home | `src/pages/index.astro` |
| About | `src/pages/about.astro` |
| Approach | `src/pages/approach.astro` |
| Contact | `src/pages/contact.astro` |
| Media | `src/pages/media.astro` |
| Research List | `src/pages/research/index.astro` |
| Research Article | `src/pages/research/[...slug].astro` |
| Legal | `src/pages/legal/[...slug].astro` |

### Media Appearances

Video appearances and press items are data-driven from TypeScript files:

- `src/data/media-videos.ts` — video card objects
- `src/data/media-press.ts` — press coverage objects

Add new entries to these arrays — no template editing needed.

### Site Configuration

- `src/data/site.ts` — address, phone, email, external URLs, Formspree IDs
- `src/data/navigation.ts` — main menu items
- `astro.config.mjs` — Astro config, sitemap, build settings

## Project Structure

```
src/
├── assets/css/global.css    # Design system (CSS custom properties)
├── components/              # Shared Astro components (Nav, Footer, etc.)
├── content/
│   ├── research/            # Markdown articles (content collection)
│   └── legal/               # Legal pages (content collection)
├── content.config.ts        # Zod schemas for content validation
├── data/                    # Site config, navigation, media data
├── layouts/
│   └── BaseLayout.astro     # Base HTML shell
└── pages/                   # File-based routing
public/                      # Static assets (images, PDFs, favicons, CNAME)
tests/                       # Playwright test suite
```

## Testing

The test suite covers 116 checks across desktop and mobile viewports:

- All pages load with correct titles
- Navigation, mobile menu, scroll effects
- Homepage sections (hero, stats, cards, logos, subscribe)
- Research content collection, year filtering, PDF downloads
- Media video cards, modal, press items, year filter
- Contact form, careers tabs, position card selection
- SEO meta tags, Open Graph, structured data (JSON-LD)
- Accessibility (skip link, alt text, ARIA labels)
- RSS feed, sitemap, static assets, internal links

```bash
npm run test              # Headless
npm run test:headed       # With browser UI
```

## Tech Stack

- **Framework:** [Astro 6](https://astro.build/)
- **Content:** Markdown with Zod-validated schemas
- **Styling:** Global CSS with custom properties
- **Hosting:** GitHub Pages via GitHub Actions
- **Forms:** [Formspree](https://formspree.io/)
- **Fonts:** Inter + Playfair Display (Google Fonts, async loaded)
- **Testing:** [Playwright](https://playwright.dev/)
