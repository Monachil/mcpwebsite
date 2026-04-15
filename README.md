# Monachil Capital Partners Website

Astro static site deployed to GitHub Pages via Bun.

## Development

```bash
bun install
bun run dev        # localhost:4321
bun run build      # production build
bun run test       # Playwright tests (169 tests, 3 browsers)
```

## Adding Content

**Research articles:** Add `.md` to `src/content/research/` with frontmatter (`title`, `date`, `category`, `description`). Place PDFs in `public/pdfs/`.

**Media videos:** Add entries to `src/data/media-videos.json`. Homepage automatically shows the latest 3. YouTube videos play inline; others link out.

**Press items:** Add entries to `src/data/media-press.json`.

## Configuration

- `src/data/site.ts` — address, phone, URLs, Mailchimp IDs, founded year
- `src/data/navigation.ts` — menu items
- `astro.config.mjs` — build settings, sitemap

## Deployment

Push to `main` triggers GitHub Actions deploy to GitHub Pages.
