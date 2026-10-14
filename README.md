# StageForge website

Static site for **StageForge** (Forge Tools), served by GitHub Pages at <https://forgestage.app/> (custom domain: `CNAME`, DNS at Cloudflare;
the old <https://ramirezab.github.io/stageforge/> redirects there).

- English by default; Spanish and Portuguese via the EN / ES / PT switch (or `?lang=es`, `?lang=pt`).
  English text lives in `index.html`; translations in `assets/js/i18n.js` (same keys as the `data-i18n` attributes).
- Store links: set `buyUrl` and `downloadUrl` in `assets/js/config.js` when the license server and the
  commercial build are live. Until then the buttons scroll to the pricing section and show "opening soon".
- Assets (screenshots, promo videos, logo) are generated from the app repo: `marketing/make_site_assets.py`.
- Contact form (`#contact`): posts to `contactUrl` (the license server, `POST /contact`), which e-mails the message from
  support@forgestage.app to the Forge Tools inbox. Honeypot field + timing + per-IP limits against spam.
- No build step, no trackers; the contact form is the only request to another host.
