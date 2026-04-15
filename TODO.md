# Future Implementation TODOs

## Content & Pages

### 1. "What Is Specialty Finance?" Educational Page
Create `/specialty-finance/` with: plain-language definition, comparison chart (Specialty Finance vs Corporate Direct Lending vs Syndicated Loans), "Why Specialty Finance?" pillar cards, brief approach summary with link to full approach page. Target SEO for "what is specialty finance" searches.

### 2. Technology Platform Showcase
Dedicated section on approach page or standalone `/technology/` page. Explain data ingestion, loan-level reconciliation, daily reporting. Add stylized SVG dashboard mockup (not real screenshot). Stats: "Daily asset-level reporting" / "Near real-time collateral reconciliation". Prominent monachiltech.com link. Ties to CTO role.

### 3. Quantified Track Record
Expand stats bar with stronger metrics (confirm which are disclosable): total transactions closed, cumulative capital deployed, zero realized credit losses (if true), data points monitored daily, originator relationships. Replace weaker stats with more compelling proof points.

### 4. Deal Activity / Case Studies
Add "Investment Activity" section with 3-4 anonymized deal cards: sector, size range, structure type, monitoring approach. No counterparty names needed. Could also be a timeline of milestones showing deal progression.

### 5. Downloadable / Gated Content
Gate Monachil Playbook PDFs behind email capture modal. Add to Mailchimp with "resource-download" tag. Consider gating quarterly letters. Add "Resources" nav link or enhance research page.

### 7. Stronger Hero Text
Replace "Differentiated Alpha through Disciplined Investing" with something that actually differentiates. Options: "Real-Time Insight. Senior-Secured Returns." / "Proven Capital Preservation in Specialty Finance" / "Precision Lending. Disciplined Returns." Sharpen subtitle to include monitoring differentiator.

### 8. Strengthen "Capital Preservation" Language
Pair aspiration with evidence: "backed by [zero realized losses / X% loss rate / X% recovery rate] since inception." Or add structural evidence: "self-amortizing collateral, first-lien seniority, material borrower first-loss, and daily surveillance."

### 9. Add Originator-Facing Language
Add callout section: "For Originators: flexible senior-secured warehouse facilities, certainty of execution, competitive terms, partnership approach." Add "Originator Inquiry" to contact form subject dropdown.

### 11. Investor Portal / Login
Add "Investor Login" link in nav. Could be password-protected document library (quarterly letters, fund docs) or link to third-party portal. Even a "Request Access" page with contact form.

### 12. Deal Structure Diagram
SVG diagram on approach page: Investors → Monachil Fund → Senior Secured Facility → Originator → Consumer/SME Loans. Show first-loss retention and daily monitoring layers. Navy boxes, gold arrows, responsive.

### 13. Audience Segmentation
Future consideration. Add originator callout (#9) and investor portal (#11) first. Full nav segmentation ("For Sponsors" / "For Investors") when firm has more content and distinct audience needs.

### 14. Recurring Data Content
Monthly "Chart of the Month" — single chart image with 2-3 paragraphs commentary. Topics: consumer delinquency rates, ABS spreads, specialty finance deal volume. Publish as research article with "Market Data" tag. Requires team to produce charts.

### 16. Regulatory Registrations
Add to footer: "Monachil Capital Partners LP is registered as [investment adviser with SEC/state]. [CRD# XXXXXX]" or note exemption basis. Standard for alternative investment firm websites.

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
