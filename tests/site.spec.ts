import { test, expect } from '@playwright/test';

// ── Page Loading ──────────────────────────────────────────────

const pages = [
  { path: '/', title: 'Monachil Capital Partners' },
  { path: '/about/', title: 'About | Monachil Capital Partners' },
  { path: '/approach/', title: 'Our Approach | Monachil Capital Partners' },
  { path: '/research/', title: 'Research & Insights | Monachil Capital Partners' },
  { path: '/media/', title: 'In the Media | Monachil Capital Partners' },
  { path: '/contact/', title: 'Contact | Monachil Capital Partners' },
  { path: '/legal/terms/', title: 'Terms & Conditions | Monachil Capital Partners' },
  { path: '/legal/privacy/', title: 'Privacy Policy | Monachil Capital Partners' },
  { path: '/legal/email-disclaimer/', title: 'Email Disclaimer | Monachil Capital Partners' },
];

for (const page of pages) {
  test(`Page loads: ${page.path}`, async ({ page: p }) => {
    const response = await p.goto(page.path);
    expect(response?.status()).toBe(200);
    await expect(p).toHaveTitle(page.title);
  });
}

// ── Navigation ────────────────────────────────────────────────

test('Navigation links are present and correct', async ({ page }) => {
  await page.goto('/');
  const navLinks = page.locator('.nav-links .nav-link');
  await expect(navLinks).toHaveCount(5);

  const expectedLinks = [
    { text: 'About', href: '/about/' },
    { text: 'Approach', href: '/approach/' },
    { text: 'Research & Insights', href: '/research/' },
    { text: 'In the Media', href: '/media/' },
    { text: 'Contact', href: '/contact/' },
  ];

  for (let i = 0; i < expectedLinks.length; i++) {
    await expect(navLinks.nth(i)).toHaveText(expectedLinks[i].text);
    await expect(navLinks.nth(i)).toHaveAttribute('href', expectedLinks[i].href);
  }
});

test('Public Funds button links externally', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('.nav-investor-btn');
  await expect(btn).toHaveText('Public Funds');
  await expect(btn).toHaveAttribute('target', '_blank');
  await expect(btn).toHaveAttribute('href', /monachilfunds\.com/);
});

test('Nav gets scrolled class on scroll', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('#nav');
  await expect(nav).not.toHaveClass(/nav--scrolled/);
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(200);
  await expect(nav).toHaveClass(/nav--scrolled/);
});

// ── Mobile Menu ───────────────────────────────────────────────

test('Mobile menu opens and closes', async ({ page, browserName }, testInfo) => {
  if (testInfo.project.name !== 'mobile') return;
  await page.goto('/');

  const overlay = page.locator('#menuOverlay');
  await expect(overlay).not.toHaveClass(/is-open/);

  await page.locator('#navToggle').click();
  await expect(overlay).toHaveClass(/is-open/);

  await page.locator('#menuClose').click();
  await expect(overlay).not.toHaveClass(/is-open/);
});

test('Mobile menu closes on Escape', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'mobile') return;
  await page.goto('/');

  await page.locator('#navToggle').click();
  await expect(page.locator('#menuOverlay')).toHaveClass(/is-open/);

  await page.keyboard.press('Escape');
  await expect(page.locator('#menuOverlay')).not.toHaveClass(/is-open/);
});

// ── Homepage Sections ─────────────────────────────────────────

test('Homepage has hero section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero')).toBeVisible();
  await expect(page.locator('.hero h1')).toContainText('Disciplined Investing');
  await expect(page.locator('.hero-eyebrow')).toContainText('Asset-Backed Lending');
});

test('Homepage has stats section', async ({ page }) => {
  await page.goto('/');
  const stats = page.locator('.stats-grid .stat-number');
  await expect(stats).toHaveCount(4);
  await expect(stats.first()).toContainText('7+');
});

test('Homepage has research cards from content collection', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.cards-grid .card');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(1);
  expect(count).toBeLessThanOrEqual(3);
});

test('Homepage has media section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.media-grid--home')).toBeVisible();
  const mediaCards = page.locator('.media-grid--home .media-card');
  await expect(mediaCards).toHaveCount(3);
});

test('Homepage has logos bar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.logos-bar')).toBeVisible();
  await expect(page.locator('.logos-bar').first()).toContainText('As Seen In');
});

test('Homepage has subscribe form', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('.subscribe-form');
  await expect(form).toBeVisible();
  await expect(form.locator('input[type="email"]')).toBeVisible();
  await expect(form.locator('button[type="submit"]')).toBeVisible();
});

// ── About Page ────────────────────────────────────────────────

test('About page has team members', async ({ page }) => {
  await page.goto('/about/');
  const members = page.locator('.team-member');
  await expect(members).toHaveCount(2);
  await expect(page.locator('.team-name').first()).toContainText('Ali Meli');
  await expect(page.locator('.team-name').nth(1)).toContainText('Joseph McNeila');
});

test('About page has timeline', async ({ page }) => {
  await page.goto('/about/');
  const items = page.locator('.timeline-item');
  const count = await items.count();
  expect(count).toBeGreaterThanOrEqual(5);
});

test('About page has headshot images', async ({ page }) => {
  await page.goto('/about/');
  const photos = page.locator('.team-photo img');
  await expect(photos).toHaveCount(2);
  for (let i = 0; i < 2; i++) {
    const src = await photos.nth(i).getAttribute('src');
    expect(src).toMatch(/headshot0[12]\.jpg/);
  }
});

// ── Approach Page ─────────────────────────────────────────────

test('Approach page has 5 process steps', async ({ page }) => {
  await page.goto('/approach/');
  const steps = page.locator('.step');
  await expect(steps).toHaveCount(5);
  await expect(page.locator('.step-num').first()).toContainText('01');
  await expect(page.locator('.step-num').last()).toContainText('05');
});

test('Approach page has investment verticals', async ({ page }) => {
  await page.goto('/approach/');
  const cards = page.locator('.cards-grid .card');
  await expect(cards).toHaveCount(6);
});

// ── Research Page ─────────────────────────────────────────────

test('Research list shows articles', async ({ page }) => {
  await page.goto('/research/');
  const items = page.locator('.research-item');
  const count = await items.count();
  expect(count).toBe(25);
});

test('Research year filter works', async ({ page }) => {
  await page.goto('/research/');
  const allBtn = page.locator('.year-filter-btn[data-year="all"]');
  await expect(allBtn).toHaveClass(/is-active/);

  // Click a year filter
  const yearBtn = page.locator('.year-filter-btn[data-year="2025"]');
  await yearBtn.click();
  await expect(yearBtn).toHaveClass(/is-active/);
  await expect(allBtn).not.toHaveClass(/is-active/);

  // Verify filtering worked: only 2025 items should be visible
  const visibleItems = page.locator('.research-item:visible');
  const count = await visibleItems.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(25);
});

test('Research article page loads with content', async ({ page }) => {
  await page.goto('/research/');
  const firstLink = page.locator('.research-item').first();
  const href = await firstLink.getAttribute('href');
  expect(href).toBeTruthy();

  await page.goto(href!);
  await expect(page.locator('.article-content')).toBeVisible();
  await expect(page.locator('.article-disclaimer')).toBeVisible();
  await expect(page.locator('.article-disclaimer h4')).toContainText('Disclosures');
});

test('Research article has PDF download if available', async ({ page }) => {
  // Navigate to an article we know has a PDF
  await page.goto('/research/2025-05-credit-income-fund-commentary/');
  const pdfLink = page.locator('.pdf-download-bar a');
  await expect(pdfLink).toBeVisible();
  await expect(pdfLink).toHaveAttribute('href', /\.pdf$/);
});

// ── Media Page ────────────────────────────────────────────────

test('Media page has video cards', async ({ page }) => {
  await page.goto('/media/');
  const cards = page.locator('.media-grid .media-card');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(10);
});

test('Media page has press items', async ({ page }) => {
  await page.goto('/media/');
  const pressItems = page.locator('.press-item');
  const count = await pressItems.count();
  expect(count).toBe(10);
});

test('Media page video modal opens for local videos', async ({ page }) => {
  await page.goto('/media/');
  const modal = page.locator('#videoModal');
  await expect(modal).not.toHaveClass(/is-open/);

  // Click first card with data-video
  const videoCard = page.locator('.media-card[data-video]').first();
  if (await videoCard.count() > 0) {
    await videoCard.click();
    await expect(modal).toHaveClass(/is-open/);

    // Close with button
    await page.locator('#videoModalClose').click();
    await expect(modal).not.toHaveClass(/is-open/);
  }
});

test('Media page year filter works', async ({ page }) => {
  await page.goto('/media/');
  const allBtn = page.locator('.year-filter-btn[data-year="all"]');
  await expect(allBtn).toHaveClass(/is-active/);

  await page.locator('.year-filter-btn[data-year="2024"]').click();
  // Some cards should be hidden
  const hidden = page.locator('.media-card[data-year="2025"]');
  for (let i = 0; i < await hidden.count(); i++) {
    await expect(hidden.nth(i)).toBeHidden();
  }
});

// ── Contact Page ──────────────────────────────────────────────

test('Contact page has tabbed interface', async ({ page }) => {
  await page.goto('/contact/');
  const tabs = page.locator('.contact-tab');
  await expect(tabs).toHaveCount(2);
  await expect(tabs.first()).toContainText('Contact Us');
  await expect(tabs.nth(1)).toContainText('Careers');
});

test('Contact tab switching works', async ({ page }) => {
  await page.goto('/contact/');

  // Contact pane should be active
  await expect(page.locator('#pane-contact')).toHaveClass(/contact-pane--active/);
  await expect(page.locator('#pane-careers')).not.toHaveClass(/contact-pane--active/);

  // Switch to careers
  await page.locator('.contact-tab[data-tab="careers"]').click();
  await expect(page.locator('#pane-careers')).toHaveClass(/contact-pane--active/);
  await expect(page.locator('#pane-contact')).not.toHaveClass(/contact-pane--active/);
});

test('Contact form has required fields', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('#first-name')).toBeVisible();
  await expect(page.locator('#last-name')).toBeVisible();
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#message')).toBeVisible();
  await expect(page.locator('#subject')).toBeVisible();
});

test('Careers tab shows position cards', async ({ page }) => {
  await page.goto('/contact/');
  await page.locator('.contact-tab[data-tab="careers"]').click();
  const cards = page.locator('.position-card');
  await expect(cards).toHaveCount(2);
  await expect(cards.first()).toContainText('Python Software Engineer');
  await expect(cards.nth(1)).toContainText('DevOps Platform Engineer');
});

test('Position card selection syncs radio', async ({ page }) => {
  await page.goto('/contact/');
  await page.locator('.contact-tab[data-tab="careers"]').click();

  const devOpsCard = page.locator('.position-card[data-position="DevOps Platform Engineer"]');
  await devOpsCard.click();
  await expect(devOpsCard).toHaveClass(/position-card--active/);

  const radio = page.locator('input[name="position"][value="DevOps Platform Engineer"]');
  await expect(radio).toBeChecked();
});

test('Contact page #careers hash switches tab', async ({ page }) => {
  await page.goto('/contact/#careers');
  await expect(page.locator('#pane-careers')).toHaveClass(/contact-pane--active/);
});

// ── SEO & Meta ────────────────────────────────────────────────

test('Homepage has correct meta tags', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Greenwich, CT/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Monachil Capital Partners');
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /monachil-og\.jpg/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /monachill\.com/);
});

test('Research article has article meta tags', async ({ page }) => {
  await page.goto('/research/2025-05-credit-income-fund-commentary/');
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('meta[property="article:author"]')).toHaveAttribute('content', 'Monachil Capital Partners');
});

test('Structured data is present on homepage', async ({ page }) => {
  await page.goto('/');
  const scripts = page.locator('script[type="application/ld+json"]');
  const count = await scripts.count();
  expect(count).toBeGreaterThanOrEqual(1);

  const json = await scripts.first().textContent();
  const data = JSON.parse(json!);
  expect(data['@type']).toBe('Organization');
  expect(data.name).toBe('Monachil Capital Partners');
});

test('Research article has Article structured data', async ({ page }) => {
  await page.goto('/research/2025-05-credit-income-fund-commentary/');
  const scripts = page.locator('script[type="application/ld+json"]');
  const count = await scripts.count();
  expect(count).toBe(2); // Organization + Article

  const articleJson = await scripts.nth(1).textContent();
  const data = JSON.parse(articleJson!);
  expect(data['@type']).toBe('Article');
  expect(data.headline).toBeTruthy();
});

test('CSP header is present', async ({ page }) => {
  await page.goto('/');
  const csp = page.locator('meta[http-equiv="Content-Security-Policy"]');
  await expect(csp).toHaveAttribute('content', /default-src 'self'/);
});

test('Security headers are present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[http-equiv="X-Content-Type-Options"]')).toHaveAttribute('content', 'nosniff');
  await expect(page.locator('meta[http-equiv="Referrer-Policy"]')).toHaveAttribute('content', 'strict-origin-when-cross-origin');
});

// ── Accessibility ─────────────────────────────────────────────

test('Skip link is present', async ({ page }) => {
  await page.goto('/');
  const skipLink = page.locator('.skip-link');
  await expect(skipLink).toHaveAttribute('href', '#main-content');
});

test('Main content landmark exists', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main#main-content')).toBeVisible();
});

test('All images have alt attributes', async ({ page }) => {
  await page.goto('/');
  const images = page.locator('img');
  const count = await images.count();
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).not.toBeNull();
  }
});

test('Navigation buttons have aria-labels', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#navToggle')).toHaveAttribute('aria-label', /navigation/i);
  await expect(page.locator('#menuClose')).toHaveAttribute('aria-label', /navigation/i);
});

// ── Footer ────────────────────────────────────────────────────

test('Footer has all sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.footer-logo')).toBeVisible();
  await expect(page.locator('.footer-disclaimer')).toBeVisible();
  await expect(page.locator('.footer-copyright')).toContainText(new Date().getFullYear().toString());

  const headings = page.locator('.footer-heading');
  await expect(headings).toHaveCount(3);
  await expect(headings.nth(0)).toContainText('Firm');
  await expect(headings.nth(1)).toContainText('Insights');
  await expect(headings.nth(2)).toContainText('Legal');
});

test('Footer legal links point to correct pages', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.footer a[href="/legal/terms/"]')).toBeVisible();
  await expect(page.locator('.footer a[href="/legal/privacy/"]')).toBeVisible();
  await expect(page.locator('.footer a[href="/legal/email-disclaimer/"]')).toBeVisible();
});

// ── RSS & Sitemap ─────────────────────────────────────────────

test('RSS feed is valid XML', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('<rss');
  expect(body).toContain('<channel>');
  expect(body).toContain('Monachil Capital Partners');
  expect(body).toContain('<item>');
});

test('Sitemap index exists', async ({ request }) => {
  const response = await request.get('/sitemap-index.xml');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('<sitemapindex');
});

test('Sitemap contains key pages', async ({ request }) => {
  const indexResponse = await request.get('/sitemap-index.xml');
  const indexBody = await indexResponse.text();
  // Extract sitemap URL
  const match = indexBody.match(/<loc>(.*?sitemap-0\.xml)<\/loc>/);
  expect(match).toBeTruthy();

  const sitemapResponse = await request.get('/sitemap-0.xml');
  const sitemapBody = await sitemapResponse.text();
  expect(sitemapBody).toContain('/about/');
  expect(sitemapBody).toContain('/approach/');
  expect(sitemapBody).toContain('/research/');
  expect(sitemapBody).toContain('/media/');
  expect(sitemapBody).toContain('/contact/');
});

// ── Static Assets ─────────────────────────────────────────────

test('Favicon is accessible', async ({ request }) => {
  const response = await request.get('/favicon.ico');
  expect(response.status()).toBe(200);
});

test('Logo images load', async ({ request }) => {
  const logoResponse = await request.get('/images/monachil-logo.png');
  expect(logoResponse.status()).toBe(200);

  const navLogoResponse = await request.get('/images/mcp-logo-transparent.png');
  expect(navLogoResponse.status()).toBe(200);
});

test('CNAME file exists in build output', async () => {
  const fs = await import('fs');
  const path = await import('path');
  const cnamePath = path.join(process.cwd(), 'dist', 'CNAME');
  const exists = fs.existsSync(cnamePath);
  expect(exists).toBe(true);
  const content = fs.readFileSync(cnamePath, 'utf-8').trim();
  expect(content).toBe('monachill.com');
});

// ── Broken Internal Links ─────────────────────────────────────

test('No broken internal links on homepage', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('a[href^="/"]');
  const count = await links.count();
  const hrefs = new Set<string>();

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href');
    if (href) hrefs.add(href);
  }

  for (const href of hrefs) {
    const response = await page.request.get(href);
    expect(response.status(), `Broken link: ${href}`).toBe(200);
  }
});
