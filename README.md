# Monachil Capital Partners Website

Corporate website for Monachil Capital Partners LP, built with [Hugo](https://gohugo.io/).

## Local Development

```bash
hugo server -D
```

Site runs at `http://localhost:1313`.

## Deployment

Pushes to `main` trigger GitHub Actions which builds and deploys to GitHub Pages automatically.

## Editing Content

### Research Articles

Add a Markdown file to `content/research/`:

```yaml
---
title: "Article Title"
date: 2025-01-15
description: "Short summary for cards"
type: "research"
years: ["2025"]
categories: ["Market Commentary"]
thumbnail: "/images/charts/2025-01-fig1.png"
pdf: "/pdfs/Commentary-20250115.pdf"
---

Article body in Markdown...
```

Place the PDF in `static/pdfs/` and any chart images in `static/images/charts/`.

### Pages

Page templates live in `layouts/page/` — edit these directly:

| Page | Template | Content |
|------|----------|---------|
| Home | `layouts/index.html` | — |
| About | `layouts/page/about.html` | `content/about.md` |
| Approach | `layouts/page/approach.html` | `content/approach.md` |
| Contact | `layouts/page/contact.html` | `content/contact.md` |
| Media | `layouts/media/list.html` | — |
| Legal | `layouts/page/legal.html` | `content/legal.md` |

### Media Appearances

Edit `layouts/media/list.html` to add video cards or press mentions.

### Styles & Scripts

- `static/css/main.css` — all styles
- `static/js/main.js` — navigation, menu, animations

## Project Structure

```
content/        # Markdown content (research articles, page front matter)
layouts/        # Hugo templates
static/         # CSS, JS, images, PDFs (served as-is)
hugo.toml       # Site configuration
```
