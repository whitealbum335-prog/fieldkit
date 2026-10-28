# Fieldkit

Fieldkit is a static, browser-based defensive security toolbox. It has no build step, package dependencies, or server-side code.

## Interface

Use **Find a tool** in the navigation to filter tools locally; press Enter to open the first match. The theme button switches between dark and light mode for the current page view.

The interface is optimized for desktop screens and adapts its navigation and cards to narrower windows so content remains readable.
The dark theme uses a restrained neon/cyberpunk palette with an illustrated night skyline, futuristic roadway traffic, and flying vehicles. Animations honor the operating system's `prefers-reduced-motion` setting.

## Run locally

Open `index.html` in a modern browser. For clipboard and Web Crypto features, use a secure context such as `https://` or `http://localhost`. To serve it locally with Python, run `python -m http.server 8000` in the project folder and visit `http://localhost:8000`.

## Tools

- Local password strength estimate and cryptographically random password generator
- Local SHA-256 hashing and Base64, URL-component, and hex conversions
- IPv4 CIDR subnet calculator
- Public domain-registration lookup for registrar, registration/expiry dates, nameservers, DNSSEC, and status
- Opt-in connection snapshot with public IP, provider, ASN, broad region, and time zone
- Local browser privacy snapshot for secure-context status, cookies, privacy preference, language, time zone, and screen size
- Public IPv4 allocation lookup through the public RDAP service at `rdap.org`
- Offline reference for common service ports
- Local Gmail address format check, official Google account security links, and a direct, user-initiated Have I Been Pwned account-search handoff with manual result guidance
- Compromised-password check through Have I Been Pwned's free Pwned Passwords range API
- Local-only username reuse audit with presets for popular services; it compares only accounts the user adds
- Locally searchable directory of curated account-safety, domain/network, privacy, and defensive-learning resources

Password generation, strength estimation, hashing, encoding, subnet, browser-detail, Gmail address-format, and username-reuse features run locally. Username audit entries are temporary in-memory data, not saved or sent; the app compares only accounts the user adds and does not search platforms. The compromised-password check hashes the password locally with SHA-1, sends only the first five hash characters to the free [Have I Been Pwned Pwned Passwords range API](https://haveibeenpwned.com/Passwords) over HTTPS, and matches the returned suffixes locally. The password itself and full hash are not sent; the field is cleared after the check. The hash prefix is still sent to HIBP, which may log requests. A match reports only an occurrence count, not the password's breach sources; a non-match does not guarantee safety. The check is not an email-breach lookup.

The Resources directory is a curated list inspired by [OSINT Catalog](https://osint-catalog.org/). Its search and category filters run locally. It links to selected account-safety, public technical metadata, privacy, and defensive-learning resources; outbound sites have their own terms and privacy practices. Fieldkit does not reproduce the catalog's people-search or account-enumeration workflows.

The Gmail self-audit creates a direct link to the official [Have I Been Pwned](https://haveibeenpwned.com/) account page for an address entered by the user. Clicking that link sends the address to HIBP and can expose it in browser history or service logs; Fieldkit does not receive results, and the user manually records a broad result category for local next-step guidance. HIBP's email search API requires an API key, so Fieldkit does not call it or claim automated results. The connection snapshot sends a request to [ipwho.is](https://ipwho.is/), which can see the visitor's public IP and may log requests; it runs only after the visitor clicks its button. The manual IP allocation and domain registration lookups send the entered value to [rdap.org](https://rdap.org/), which routes requests to public registration data services. Those services may log requests and apply terms or rate limits. No API keys are used.

IP region results are approximate, domain registration data can be incomplete, and browser checks are informational. Fieldkit does not retrieve personal registrant contact information or leaked records, access email inboxes, enumerate accounts, test VPN, proxy, DNS, or WebRTC leaks; identify people; scan hosts; or create credential-guessing wordlists. It does not claim that a privacy score can guarantee safety or anonymity.

## Publish with GitHub Pages

1. Create a GitHub repository and add the project files at the repository root: `index.html`, `styles.css`, `app.js`, and `README.md`.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/(root)`, then save.
5. Wait for the Pages deployment and open the URL shown in the Pages settings.

The site uses relative asset paths and works from a GitHub Pages project URL. There is no build command or secret configuration. Never commit API keys, passwords, or other secrets. Choose and add a license before allowing others to reuse the code.
