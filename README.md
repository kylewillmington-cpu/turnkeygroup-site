# TurnKey Group website

Live site: https://turnkeygroup.com.au (Cloudflare, Netalyst account). Moved from Netlify on 18 Nov 2026; the Netlify project "turnkeygroup" is kept as a backup.

- `public/` – the website (HTML, CSS, JS, images). `_headers` holds the security and caching headers.
- `src/worker.js` – serves the site and handles the TurnKey Pro / TurnKey Services launch sign-up forms (`/api/notify`), emailing each sign-up to kyle@turnkeybnbs.com.au.
- `wrangler.jsonc` – Cloudflare settings.

Every push to `main` deploys automatically through Cloudflare Workers Builds.
