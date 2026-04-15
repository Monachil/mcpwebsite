# Future Implementation TODOs

## Content & Pages

### "What Is Specialty Finance?" Educational Page
Create `/specialty-finance/` with: plain-language definition, comparison chart (Specialty Finance vs Corporate Direct Lending vs Syndicated Loans), "Why Specialty Finance?" pillar cards, brief approach summary with link to full approach page. Target SEO for "what is specialty finance" searches.

### Technology Platform Showcase
Dedicated section on approach page or standalone `/technology/` page. Explain data ingestion, loan-level reconciliation, daily reporting. Add stylized SVG dashboard mockup (not real screenshot). Stats: "Daily asset-level reporting" / "Near real-time collateral reconciliation". Prominent monachiltech.com link. Ties to CTO role.

### Quantified Track Record
Expand stats bar with stronger metrics (confirm which are disclosable): total transactions closed, cumulative capital deployed, zero realized credit losses (if true), data points monitored daily, originator relationships. Replace weaker stats with more compelling proof points.

### Deal Activity / Case Studies
Add "Investment Activity" section with 3-4 anonymized deal cards: sector, size range, structure type, monitoring approach. No counterparty names needed. Could also be a timeline of milestones showing deal progression.

### Stronger Hero Text
Replace "Differentiated Alpha through Disciplined Investing" with something that actually differentiates. Options: "Real-Time Insight. Senior-Secured Returns." / "Proven Capital Preservation in Specialty Finance" / "Precision Lending. Disciplined Returns." Sharpen subtitle to include monitoring differentiator.

### Strengthen "Capital Preservation" Language
Pair aspiration with evidence: "backed by [zero realized losses / X% loss rate / X% recovery rate] since inception." Or add structural evidence: "self-amortizing collateral, first-lien seniority, material borrower first-loss, and daily surveillance."

### Add Originator-Facing Language
Add callout section on homepage or approach page: "For Originators: flexible senior-secured warehouse facilities, certainty of execution, competitive terms, partnership approach." Contact form dropdown already updated with "Originator / Capital Solutions Inquiry" option.

### Investor Portal / Login
Add "Investor Login" link in nav. Could be password-protected document library (quarterly letters, fund docs) or link to third-party portal. Even a "Request Access" page with contact form.

### Deal Structure Diagram
SVG diagram on approach page: Investors → Monachil Fund → Senior Secured Facility → Originator → Consumer/SME Loans. Show first-loss retention and daily monitoring layers. Navy boxes, gold arrows, responsive.

### Audience Segmentation
Future consideration. Add originator callout and investor portal first. Full nav segmentation ("For Sponsors" / "For Investors") when firm has more content and distinct audience needs.

### Recurring Data Content
Monthly "Chart of the Month" — single chart image with 2-3 paragraphs commentary. Topics: consumer delinquency rates, ABS spreads, specialty finance deal volume. Publish as research article with "Market Data" tag. Requires team to produce charts.

## Infrastructure

### Azure Functions Form Backend
Create separate `monachil-forms` repo (Python). Azure Functions Consumption plan with:
- `/api/contact` — validate, send email via Graph API, (later: Jira ticket)
- `/api/careers` — parse resume upload, save to SharePoint/OneDrive via Graph API, send notification, (later: Jira ticket)
- Azure AD app registration with `Mail.Send` + `Files.ReadWrite.All` permissions
- Shared utilities: Graph auth, input validation, config
- CORS locked to production domain
- Honeypot + rate limiting for spam protection
- Replace Formspree on contact and careers forms
- GitHub Actions deploy to Azure

### Moe & Jack Team Bios
Add compact bio cards (no headshots) below Ali and Joe on Leadership tab:
- Mohsen Ramezani — CTO: technology strategy, scalable platforms, 20+ years engineering
- Jack Habeeb — VP, Strategy & Business Operations: investor relations, marketing, Hamilton College economics

## Completed (removed from active TODOs)
- ~~Gated PDF downloads~~ — implemented with Mailchimp email capture modal + localStorage bypass
- ~~Regulatory registrations~~ — SEC CRD No. 311376, IAPD link, Form ADV reference added to footer
- ~~ESG / Responsible investing language~~ — added to about page
- ~~Inline disclaimers~~ — added to homepage stats + approach page
- ~~Fix repetitive copy~~ — deduplicated across pages
- ~~Elevate "V in LTV"~~ — promoted to pull quote on approach page
