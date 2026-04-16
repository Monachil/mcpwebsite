# Careers — how to add, edit, or close a role

This folder controls the **Open Positions** section of the Careers tab on `/contact/`. Each job is a single markdown file in this folder. Adding a file publishes a role; deleting it (or setting `draft: true`) takes it down.

All edits can be made directly in the GitHub web UI — no local setup required. A commit to `main` automatically rebuilds and deploys the site via GitHub Actions within a few minutes.

---

## Adding a new role

1. Open this folder in GitHub: `src/content/careers/`
2. Click **Add file → Create new file**
3. Name the file after the role using lowercase with hyphens, ending in `.md`
   e.g. `senior-credit-analyst.md`
4. Paste the template below and fill it in
5. Scroll down, add a short commit message (e.g. `Post Senior Credit Analyst role`), and click **Commit changes**

### Template

```markdown
---
title: "Senior Credit Analyst"
tag: "Investments"
summary: "One-sentence hook shown on the job card. Keep it under ~25 words."
location: "Greenwich, CT"
employmentType: "Full-time"
postedDate: 2026-04-16
order: 1
---

## About the role

One to two paragraphs on what the role is and why it matters at Monachil.

## Key responsibilities

- Bullet list of responsibilities.
- Keep bullets short and concrete.

## Qualifications

- Required skills and experience.

## Nice to have

- Optional skills and experience.

## How to apply

Submit the form on this page with your resume and a short note on what draws you to this role. We read every application.
```

---

## Front-matter fields explained

| Field | Required | What it does |
|---|---|---|
| `title` | yes | Job title shown on the card and panel. |
| `tag` | yes | Short category label (e.g. `Engineering`, `Investments`, `Operations`). |
| `summary` | yes | One-sentence description shown on the card. |
| `location` | no | Defaults to `Greenwich, CT`. |
| `employmentType` | no | Defaults to `Full-time`. Use `Contract` or `Part-time` if needed. |
| `postedDate` | yes | `YYYY-MM-DD`. Newer posts sort ahead of older ones when `order` is not set. |
| `order` | no | Number that forces sort position. Lower = earlier on the page. Use for pinning a priority role to the top. |
| `draft` | no | Set to `true` to hide the role without deleting the file. Useful for preparing a role before publishing. |

---

## Editing a live role

1. Open the markdown file in GitHub
2. Click the **pencil icon** (top right) to edit in the browser
3. Save with a commit message like `Update Python Data Engineer qualifications`

---

## Closing / removing a role

Two options:

- **Soft close (recommended if you might re-open it):** edit the file, add `draft: true` to the front matter, commit.
- **Hard delete:** open the file, click the **trash-can icon**, commit.

---

## What the body section supports

The body below the front matter is standard markdown:

- `## Heading` for section titles
- `- item` for bullet lists
- `**bold**` and `*italic*`
- `[link text](https://example.com)` for links
- Blank line between paragraphs

The site styles the markdown output automatically. Don't worry about HTML or classes.

---

## Something not working?

If a role doesn't appear on the site after a few minutes:

1. Check the commit went to `main` (not a branch or PR)
2. Check the GitHub **Actions** tab for a failed build — front-matter typos (e.g. missing quote, bad date) cause the build to fail loudly. The error message will point to the file.
3. Confirm `draft` is not accidentally set to `true`.

Ask engineering for help if stuck — the fix is almost always a missing quote or colon in the front matter.
