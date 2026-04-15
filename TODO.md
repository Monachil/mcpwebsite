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

**Repo:** Separate `monachil-forms` repo
**Runtime:** Python v2 programming model (decorator-based `@app.route`)
**Plan:** Consumption (free at ~100 req/month, 1M free executions)
**Framework:** Native Azure Functions HTTP triggers with Pydantic validation (NOT FastAPI — adds cold start overhead, unnecessary for 3 endpoints)

**Project structure:**
```
monachil-forms/
├── function_app.py              # Main app, imports blueprints
├── blueprints/
│   ├── contact.py               # POST /api/contact
│   ├── careers.py               # POST /api/careers (multipart/file upload)
│   └── subscribe.py             # POST /api/subscribe (Mailchimp)
├── shared/
│   ├── graph.py                 # Microsoft Graph client (email + SharePoint)
│   ├── mailchimp.py             # Mailchimp API client
│   ├── jira.py                  # Jira Cloud REST API client
│   ├── validation.py            # Pydantic models for form validation
│   ├── spam.py                  # Honeypot check + reCAPTCHA verification
│   └── config.py                # Environment variable loading
├── host.json
├── local.settings.json          # Local dev secrets (gitignored)
├── requirements.txt
├── tests/
│   ├── test_contact.py
│   ├── test_careers.py
│   └── test_subscribe.py
└── .github/workflows/deploy.yml # GitHub Actions → Azure
```

**Endpoints:**

`POST /api/contact`
- Input: name, email, company, phone, subject, message, honeypot, recaptcha_token
- Validate with Pydantic (EmailStr, required fields)
- Reject if honeypot filled or reCAPTCHA fails
- Send notification email via Graph API (`Mail.Send` permission)
- If subject = "originator": tag differently in email subject
- Response: `{ "success": true, "message": "Message received" }` (201)
- Later: create Jira ticket in appropriate project

`POST /api/careers`
- Input: name, email, linkedin, position, resume (file), message (multipart/form-data)
- Validate fields, check file type (PDF/DOC/DOCX only), size limit (10MB)
- Parse multipart body with `python-multipart` library
- Upload resume to SharePoint/OneDrive via Graph API (`Files.ReadWrite.All`)
- Send notification email to hiring manager via Graph API
- Response: `{ "success": true, "message": "Application received" }` (201)
- Later: create Jira issue in hiring project with resume attachment

`POST /api/subscribe`
- Input: email, source, resource (optional for gated downloads)
- Add to Mailchimp audience via `mailchimp-marketing` SDK
- Set `status: "pending"` for double opt-in
- Apply tags: "website-newsletter" or "pdf-download" based on source
- Set merge fields: RESOURCE, SIGNUP_SOURCE
- Response: `{ "success": true, "message": "Subscribed" }` (201)
- Replaces current client-side Mailchimp hidden iframe approach

**Azure setup required:**
1. Azure AD / Entra ID app registration: `Mail.Send` + `Sites.ReadWrite.All` (application permissions, admin consent)
2. Secrets in Key Vault (referenced in App Settings): `GRAPH_TENANT_ID`, `GRAPH_CLIENT_ID`, `GRAPH_CLIENT_SECRET`, `MAILCHIMP_API_KEY`, `JIRA_API_TOKEN`, `RECAPTCHA_SECRET`
3. CORS in `host.json`: locked to production domain only
4. Application Insights enabled for monitoring/logging
5. Function-level API keys for basic endpoint protection

**Deployment:** GitHub Actions with `Azure/functions-action@v1` using publish profile secret

**Response format (all endpoints):**
```json
{ "success": true|false, "message": "Human-readable message" }
```
Status codes: 201 (created), 400 (validation error), 413 (file too large), 429 (rate limited), 500 (server error)

**Spam protection:**
- Honeypot hidden field (reject if filled)
- reCAPTCHA v3 server-side verification (POST to Google `siteverify` endpoint)
- Basic rate counter per IP (in-memory, resets on cold start — acceptable for low traffic)

**Website changes when Azure Functions is ready:**
- Contact form: POST JSON to `/api/contact` instead of Formspree
- Careers form: POST multipart to `/api/careers` instead of Formspree
- Subscribe form: POST to `/api/subscribe` instead of Mailchimp hidden iframe (optional — current approach works)
- Add reCAPTCHA v3 script to pages with forms
- Update CSP to allow Azure Functions domain + Google reCAPTCHA
- Remove Formspree dependency entirely

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
