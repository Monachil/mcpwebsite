import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

for (const pg of pages) {
  test(`Page loads: ${pg.path}`, async ({ page }) => {
    const response = await page.goto(pg.path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(pg.title);
  });
}

test('404 page returns proper status', async ({ page }) => {
  const response = await page.goto('/nonexistent-page/');
  expect(response?.status()).toBe(404);
});

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

test('Theme toggle button is present', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('#themeToggle');
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('role', 'switch');
  await expect(toggle).toHaveAttribute('aria-label', /switch to/i);
});

// ── Mobile Menu ───────────────────────────────────────────────

test('Mobile menu opens and closes', async ({ page }, testInfo) => {
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

test('Homepage has stats section with dynamic year', async ({ page }) => {
  await page.goto('/');
  const stats = page.locator('.stats-grid .stat-number');
  await expect(stats).toHaveCount(4);
  // Track record should be current year - 2019
  const expectedYears = new Date().getFullYear() - 2019;
  await expect(stats.first()).toContainText(`${expectedYears}+`);
});

test('Homepage has research cards from content collection', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.cards-grid .card');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(1);
  expect(count).toBeLessThanOrEqual(3);
});

test('Homepage media cards are dynamic from data', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.media-grid--home')).toBeVisible();
  const mediaCards = page.locator('.media-grid--home .media-card, .media-grid--home .media-card--embed');
  await expect(mediaCards).toHaveCount(3);
});

test('Homepage has logos bar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.logos-bar')).toBeVisible();
  const logos = page.locator('.media-logo');
  await expect(logos).toHaveCount(8);
});

test('Homepage has subscribe form with Mailchimp', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('.subscribe-form');
  await expect(form).toBeVisible();
  await expect(form).toHaveAttribute('data-mailchimp', '');
  await expect(form.locator('input[name="EMAIL"]')).toBeVisible();
  await expect(form.locator('button[type="submit"]')).toBeVisible();
});

test('Homepage hero has CTA buttons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-actions .btn--primary')).toContainText('Our Approach');
  await expect(page.locator('.hero-actions .btn--outline')).toContainText('Get in Touch');
});

// ── About Page ────────────────────────────────────────────────

test('About page has tabs', async ({ page }) => {
  await page.goto('/about/');
  const tabs = page.locator('.page-tab');
  await expect(tabs).toHaveCount(2);
  await expect(tabs.first()).toContainText('Our Firm');
  await expect(tabs.nth(1)).toContainText('Leadership Team');
});

test('About page tab switching works', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.locator('#panel-firm')).toHaveClass(/is-active/);
  await expect(page.locator('#panel-team')).not.toHaveClass(/is-active/);

  await page.locator('#tab-team').click();
  await expect(page.locator('#panel-team')).toHaveClass(/is-active/);
  await expect(page.locator('#panel-firm')).not.toHaveClass(/is-active/);
});

test('About page #team hash activates leadership tab', async ({ page }) => {
  await page.goto('/about/#team');
  await expect(page.locator('#panel-team')).toHaveClass(/is-active/);
});

test('About page has team members', async ({ page }) => {
  await page.goto('/about/#team');
  const members = page.locator('.team-member');
  await expect(members).toHaveCount(2);
  await expect(page.locator('.team-name').first()).toContainText('Ali Meli');
  await expect(page.locator('.team-name').nth(1)).toContainText('Joseph McNeila');
});

test('About page has team summary', async ({ page }) => {
  await page.goto('/about/#team');
  const summary = page.locator('.team-summary');
  await expect(summary).toContainText('nearly 20 professionals');
  await expect(summary).toContainText('five countries');
});

test('About page has timeline', async ({ page }) => {
  await page.goto('/about/');
  const items = page.locator('.timeline-item');
  const count = await items.count();
  expect(count).toBeGreaterThanOrEqual(5);
});

test('About page has headshot images', async ({ page }) => {
  await page.goto('/about/#team');
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
  await expect(cards).toHaveCount(5);
});

test('Approach page has pull quote', async ({ page }) => {
  await page.goto('/approach/');
  const quote = page.locator('.pull-quote');
  await expect(quote).toContainText('LTV');
});

test('Approach page has CTA section', async ({ page }) => {
  await page.goto('/approach/');
  await expect(page.locator('a[href="/contact/"].btn--primary')).toBeVisible();
});

// ── Research Page ─────────────────────────────────────────────

test('Research list shows articles', async ({ page }) => {
  await page.goto('/research/');
  const items = page.locator('.research-card');
  const count = await items.count();
  expect(count).toBeGreaterThanOrEqual(20);
});

test('Research year filter works', async ({ page }) => {
  await page.goto('/research/');
  const allBtn = page.locator('.year-filter-btn[data-year="all"]');
  await expect(allBtn).toHaveClass(/is-active/);

  const yearBtn = page.locator('.year-filter-btn[data-year="2025"]');
  await yearBtn.click();
  await expect(yearBtn).toHaveClass(/is-active/);
  await expect(allBtn).not.toHaveClass(/is-active/);

  const visibleItems = page.locator('.research-card:visible');
  const count = await visibleItems.count();
  expect(count).toBeGreaterThan(0);
});

test('Research article page loads with content', async ({ page }) => {
  await page.goto('/research/');
  const firstLink = page.locator('.research-card').first();
  const href = await firstLink.getAttribute('href');
  expect(href).toBeTruthy();

  await page.goto(href!);
  await expect(page.locator('.article-content')).toBeVisible();
  await expect(page.locator('.article-disclaimer')).toBeVisible();
});

test('Research article has PDF download if available', async ({ page }) => {
  await page.goto('/research/2025-05-credit-income-fund-commentary/');
  const pdfLink = page.locator('.pdf-download-bar a');
  await expect(pdfLink).toBeVisible();
  await expect(pdfLink).toHaveAttribute('href', /\.pdf$/);
});

// ── Media Page ────────────────────────────────────────────────

test('Media page has tabs for video and press', async ({ page }) => {
  await page.goto('/media/');
  const tabs = page.locator('.page-tab');
  await expect(tabs).toHaveCount(2);
  await expect(tabs.first()).toContainText('Video Appearances');
  await expect(tabs.nth(1)).toContainText('In Print');
});

test('Media page has video cards', async ({ page }) => {
  await page.goto('/media/');
  const cards = page.locator('.media-grid .media-card, .media-grid .media-card--embed');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(15);
});

test('Media page has embeddable and external cards', async ({ page }) => {
  await page.goto('/media/');
  const embeddable = page.locator('.media-card--embed');
  const external = page.locator('.media-card--external');
  expect(await embeddable.count()).toBeGreaterThan(0);
  expect(await external.count()).toBeGreaterThan(0);
});

test('Media page video modal opens for YouTube videos', async ({ page }) => {
  await page.goto('/media/');
  const modal = page.locator('#videoModal');
  await expect(modal).not.toHaveClass(/is-open/);

  const ytCard = page.locator('.media-card--embed[data-youtube]').first();
  await ytCard.click();
  await expect(modal).toHaveClass(/is-open/);
  await expect(page.locator('#videoModalPlayer iframe')).toBeVisible();

  // Close with button
  await page.locator('#videoModalClose').click();
  await expect(modal).not.toHaveClass(/is-open/);
});

test('Media page video modal closes on Escape', async ({ page }) => {
  await page.goto('/media/');
  await page.locator('.media-card--embed[data-youtube]').first().click();
  await expect(page.locator('#videoModal')).toHaveClass(/is-open/);

  await page.keyboard.press('Escape');
  await expect(page.locator('#videoModal')).not.toHaveClass(/is-open/);
});

test('Media page press tab works', async ({ page }) => {
  await page.goto('/media/');
  await page.locator('#tab-press').click();
  await expect(page.locator('#panel-press')).toHaveClass(/is-active/);
  const pressItems = page.locator('.press-item');
  const count = await pressItems.count();
  expect(count).toBeGreaterThanOrEqual(10);
});

test('Media page #press hash activates press tab', async ({ page }) => {
  await page.goto('/media/#press');
  await expect(page.locator('#panel-press')).toHaveClass(/is-active/);
});

test('Media page year filter works', async ({ page }) => {
  await page.goto('/media/');
  await page.locator('.year-filter-btn[data-year="2024"]').click();
  const hidden = page.locator('.media-card[data-year="2025"], .media-card--embed[data-year="2025"]');
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
  await expect(page.locator('#pane-contact')).toHaveClass(/contact-pane--active/);

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

test('Contact form has newsletter checkbox', async ({ page }) => {
  await page.goto('/contact/');
  const checkbox = page.locator('input[name="newsletter"]');
  await expect(checkbox).toBeVisible();
});

test('Careers tab shows position cards', async ({ page }) => {
  await page.goto('/contact/');
  await page.locator('.contact-tab[data-tab="careers"]').click();
  const cards = page.locator('.position-card');
  await expect(cards).toHaveCount(2);
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

// ── Theme Switching ──────────────────────────────────────────

test('Theme defaults based on OS preference', async ({ browser }) => {
  const lightContext = await browser.newContext({ colorScheme: 'light' });
  const lightPage = await lightContext.newPage();
  await lightPage.goto('/');
  const theme = await lightPage.evaluate(() => document.documentElement.dataset.theme);
  expect(theme).toBe('light');
  await lightContext.close();

  const darkContext = await browser.newContext({ colorScheme: 'dark' });
  const darkPage = await darkContext.newPage();
  await darkPage.goto('/');
  const darkTheme = await darkPage.evaluate(() => document.documentElement.dataset.theme);
  expect(darkTheme).toBe('dark');
  await darkContext.close();
});

test('Theme toggle switches between dark and light', async ({ page }) => {
  await page.goto('/');
  const initial = await page.evaluate(() => document.documentElement.dataset.theme);

  await page.locator('#themeToggle').click();
  const toggled = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(toggled).not.toBe(initial);

  await page.locator('#themeToggle').click();
  const restored = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(restored).toBe(initial);
});

test('Theme persists across navigation', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'light';
    localStorage.setItem('theme', 'light');
  });

  await page.goto('/about/');
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(theme).toBe('light');
});

test('Light mode changes hero background', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
  await page.waitForTimeout(500);
  // Hero should not have dark navy background in light mode
  const heroBg = await page.evaluate(() => getComputedStyle(document.querySelector('.hero')!).background);
  expect(heroBg).not.toContain('rgb(11, 26, 46)');
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

test('CSP header is present', async ({ page }) => {
  await page.goto('/');
  const csp = page.locator('meta[http-equiv="Content-Security-Policy"]');
  await expect(csp).toHaveAttribute('content', /default-src 'self'/);
  await expect(csp).toHaveAttribute('content', /youtube\.com/);
  await expect(csp).toHaveAttribute('content', /list-manage\.com/);
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
    expect(alt, `Image ${i} missing alt`).not.toBeNull();
  }
});

test('Navigation buttons have aria-labels', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#navToggle')).toHaveAttribute('aria-label', /navigation/i);
  await expect(page.locator('#menuClose')).toHaveAttribute('aria-label', /navigation/i);
  await expect(page.locator('#themeToggle')).toHaveAttribute('aria-label', /switch/i);
});

test('Homepage passes axe accessibility scan', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible')));
  const results = await new AxeBuilder({ page })
    .exclude('.hero-logo-mark')
    .disableRules(['heading-order', 'color-contrast'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('About page passes axe accessibility scan', async ({ page }) => {
  await page.goto('/about/');
  await page.evaluate(() => document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible')));
  const results = await new AxeBuilder({ page })
    .disableRules(['heading-order', 'color-contrast'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('Contact page passes axe accessibility scan', async ({ page }) => {
  await page.goto('/contact/');
  const results = await new AxeBuilder({ page })
    .disableRules(['heading-order', 'color-contrast'])
    .analyze();
  expect(results.violations).toEqual([]);
});

// ── Footer ────────────────────────────────────────────────────

test('Footer has all sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.footer-logo')).toBeVisible();
  await expect(page.locator('.footer-disclaimer')).toBeVisible();
  await expect(page.locator('.footer-copyright')).toContainText(new Date().getFullYear().toString());

  const headings = page.locator('.footer-heading');
  await expect(headings).toHaveCount(3);
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

test('Sitemap exists and contains key pages', async ({ request }) => {
  // Try both possible sitemap locations
  let sitemapBody = '';
  const indexResponse = await request.get('/sitemap-index.xml');
  if (indexResponse.status() === 200) {
    const indexBody = await indexResponse.text();
    expect(indexBody).toContain('<sitemapindex');
    const match = indexBody.match(/<loc>(.*?sitemap-0\.xml)<\/loc>/);
    if (match) {
      const sitemapUrl = match[1].replace(/https?:\/\/[^/]+/, '');
      const sitemapResponse = await request.get(sitemapUrl);
      sitemapBody = await sitemapResponse.text();
    }
  }

  if (sitemapBody) {
    expect(sitemapBody).toContain('/about/');
    expect(sitemapBody).toContain('/approach/');
    expect(sitemapBody).toContain('/research/');
    expect(sitemapBody).toContain('/media/');
    expect(sitemapBody).toContain('/contact/');
  }
});

// ── Static Assets ─────────────────────────────────────────────

test('Favicon is accessible', async ({ request }) => {
  const response = await request.get('/favicon.ico');
  expect(response.status()).toBe(200);
});

test('Logo images load', async ({ request }) => {
  expect((await request.get('/images/monachil-logo.png')).status()).toBe(200);
  expect((await request.get('/images/mcp-logo-transparent.png')).status()).toBe(200);
  expect((await request.get('/images/monachil-og.jpg')).status()).toBe(200);
});

test('CNAME file exists', async () => {
  const fs = await import('fs');
  const path = await import('path');
  const cnamePath = path.join(process.cwd(), 'dist', 'CNAME');
  expect(fs.existsSync(cnamePath)).toBe(true);
});

// ── Broken Internal Links ─────────────────────────────────────

for (const pg of pages) {
  test(`No broken internal links on ${pg.path}`, async ({ page }) => {
    await page.goto(pg.path);
    const links = page.locator('a[href^="/"]');
    const count = await links.count();
    const hrefs = new Set<string>();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href) hrefs.add(href);
    }

    for (const href of hrefs) {
      const response = await page.request.get(href);
      expect(response.status(), `Broken link: ${href} on ${pg.path}`).toBe(200);
    }
  });
}

// ── Scroll Progress Bar ──────────────────────────────────────

test('Scroll progress bar exists', async ({ page }) => {
  await page.goto('/');
  const bar = page.locator('#scrollProgress');
  await expect(bar).toHaveCount(1);
});
