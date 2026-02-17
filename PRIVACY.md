# PRIVACY POLICY

**Effective date:** February 17, 2026

### 1. Who We Are
**TripNest** (“we”, “us”, “our”) is a travel‑itinerary web application operated by **[YOUR LEGAL ENTITY]**. This Privacy Policy explains how we collect, use, share, and protect personal information you provide to us.

### 2. Information We Collect

| Category | Examples | Legal Basis (GDPR) |
|----------|----------|-------------------|
| **Account Information** | Email address, name, profile photo, OAuth provider ID (Google, GitHub, etc.) | Consent (sign‑up) or Legitimate interest (security) |
| **User‑Generated Content** | Itineraries, comments, ratings, photos you upload | Consent (you voluntarily submit) |
| **Device & Usage Data** | IP address, browser type, OS, screen size, click‑stream, referral URL, timestamps | Legitimate interest (service improvement) |
| **Location Data** (optional) | Approximate location derived from IP, or specific GPS coordinates you manually add to an itinerary | Consent (you explicitly provide) |
| **Cookies & Similar Technologies** | Session cookie, analytics cookie, marketing cookie, preference cookie | Consent (for non‑essential cookies) or Legitimate interest (essential cookies) |
| **Third‑Party Data** | Data from Mapbox, OpenWeather, OpenAI, flight/hotel APIs, Stripe (if you ever pay), Google AdSense, affiliate partners | Legitimate interest / contract (service provision) |
| **Payment & Billing Data** (only if/when you purchase a paid feature) | Stripe payment token, billing address (processed by Stripe) | Contract & Consent (through Stripe) |

### 3. How We Use Your Information

We use your data for the following purposes:

1. **Provide & Maintain the Service** – authenticating users, storing itineraries, enabling sharing, providing search results, real‑time updates, and offline sync.  
2. **Improve & Personalize** – analytics (e.g., usage trends), AI‑generated itinerary suggestions, and UI/UX enhancements.  
3. **Communications** – transactional emails (password reset, security alerts) and, with your consent, marketing newsletters.  
4. **Legal & Safety** – enforce our Terms, prevent fraud, comply with legal obligations.  
5. **Monetisation** – serve ads (Google AdSense), display affiliate links, process commissions, and handle paid subscriptions (Stripe).  
6. **Third‑Party Integration** – share necessary data with Mapbox (for map tiles), OpenWeather (for forecasts), OpenAI (for AI suggestions), and travel‑booking partners (to pre‑fill booking forms).  

### 4. Legal Basis (GDPR & Other Data‑Protection Laws)

- **Consent** – when you sign up, upload content, or explicitly agree to cookies/marketing emails.  
- **Contract** – when you request a service (e.g., create an itinerary, use an AI suggestion).  
- **Legitimate Interests** – for security, fraud prevention, analytics, and improving the Service.  
- **Legal Obligation** – if required by law, subpoena, or court order.

**You may withdraw consent at any time** (e.g., delete your account, opt‑out of marketing emails, disable non‑essential cookies). Withdrawal does not affect the lawfulness of processing based on legitimate interest before withdrawal.

### 5. Data Sharing & Recipients

| Recipient | Why We Share | What Data Is Shared |
|----------|-------------|---------------------|
| **Supabase (or your DB provider)** | Data storage & realtime sync | All account & itinerary data (encrypted at rest) |
| **Mapbox** | Map tiles & geocoding | Place name, latitude/longitude, IP (for rate limiting) |
| **OpenWeather** | Weather forecasts displayed on itineraries | Latitude/longitude, IP (for rate limiting) |
| **OpenAI** (if you enable AI suggestions) | Generate itinerary text | Prompt you supply (e.g., “7‑day trip to Tokyo”), user ID (optional) |
| **Flight / Hotel APIs** (Amadeus, Skyscanner, Booking.com) | Show flight/hotel options & affiliate links | Travel dates, departure/arrival airports, user’s location (optional) |
| **Google AdSense** | Serve ads | Non‑personally identifiable data (cookies, IP, page context) |
| **Stripe** (if you sell a paid plan) | Process payments | Payment token (PCI‑compliant, never stored by us), email for receipt |
| **Law‑enforcement / regulatory bodies** | Legal compliance | Any data required by law (e.g., IP address, account details) |
| **Service Providers** (hosting, analytics) | Operate the service | Server logs, usage metrics (Google Analytics if enabled) |

All third parties are required (by contract) to process data **only as instructed** and to protect it with appropriate safeguards.

### 6. International Transfers

Your data may be stored on servers located in the **United States** (Supabase, Vercel, Google Cloud). If you are in the European Economic Area (EEA) or United Kingdom, we rely on the **EU‑U.S. Data Privacy Framework** (or Standard Contractual Clauses) to ensure an adequate level of protection.

### 7. Data Retention

| Data Type | Retention Period |
|-----------|------------------|
| Account information & authentication credentials | Until you delete your account (or request deletion). |
| User‑generated itineraries, comments, photos | Until you delete them or delete your account. |
| Analytics & log data (IP, device details) | 12 months (unless needed longer for security/fraud investigation). |
| Cookies (persistent) | Up to 2 years (or as set by the cookie’s expiry). |
| AI‑prompt & response logs (if enabled) | 30 days, then automatically deleted. |

### 8. Your Rights (GDPR & Similar Laws)

If you are located in the EEA, UK, Switzerland, or other jurisdictions with similar rights, you may:

- **Access** – request a copy of the personal data we hold about you.  
- **Rectify** – ask us to correct inaccurate or incomplete data.  
- **Erase** – request deletion of your personal data (subject to legal obligations).  
- **Restrict** – limit processing of your data (e.g., for dispute resolution).  
- **Port** – receive your data in a commonly used, machine‑readable format.  
- **Object** – object to processing for direct marketing or profiling.  

To exercise any of these rights, email **[YOUR SUPPORT EMAIL]** with a clear description of the request. We will respond within **30 days** (unless a longer period is required by law).

### 9. Cookies & Tracking Technologies

| Cookie Type | Purpose | Duration |
|-------------|----------|----------|
| **Essential / Strictly necessary** | Session management, security, authentication | Session / 30 days |
| **Analytics** (Google Analytics, Plausible, etc.) | Performance and usage statistics | 2 years (or as configured) |
| **Advertising / Marketing** (Google AdSense) | Serve personalised ads, track conversions | 1‑2 years |
| **Preference** | Remember UI preferences (dark mode, language) | 1 year |
| **Third‑party** | Set by Mapbox, OpenAI, flight/hotel APIs when you interact with them | Varies per provider |

**Cookie Consent:** By using the Site for the first time, you will see a banner asking for consent to non‑essential cookies (analytics, advertising). You may **accept all, reject all, or manage preferences**. You can change your preferences at any time via a link in the footer.

### 10. Security

- **Transport security:** All connections use **HTTPS/TLS** (enforced by Vercel).  
- **Data at rest:** Supabase encrypts the underlying PostgreSQL storage; Cloud Storage encrypts files at rest.  
- **Access controls:** Role‑based access control (RBAC) limits who can view or modify data.  
- **Incident response:** In the unlikely event of a breach, we will notify affected users within **72 hours** as required by law.

### 11. Children’s Privacy

Our Service is **not directed to children under 13** (or the age of digital consent in your jurisdiction). If we discover that we have unintentionally collected personal data from a child, we will delete it promptly. If you are a parent or guardian and believe your child has provided us personal data, please contact us at **[YOUR SUPPORT EMAIL]**.

### 12. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. When we do, we will:
- Post the revised policy on the Site with a new **Effective Date**.  
- Provide a notice banner for significant changes.  

Your continued use of the Service after such updates constitutes acceptance of the revised policy.

### 13. Contact Information

**Data‑Protection Officer (or Contact for privacy matters):**  
**Email:** **[YOUR SUPPORT EMAIL]**  
**Mailing address:** **[YOUR PHYSICAL OR POSTAL ADDRESS]**  

If you have any questions about our privacy practices, feel free to reach out.
