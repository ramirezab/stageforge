# StageForge website

Static site for **StageForge** (Forge Tools), served by GitHub Pages at <https://ramirezab.github.io/stageforge/>.

- English by default; Spanish and Portuguese via the EN / ES / PT switch (or `?lang=es`, `?lang=pt`).
  English text lives in `index.html`; translations in `assets/js/i18n.js` (same keys as the `data-i18n` attributes).
- Store links: set `buyUrl`, `downloadUrl` and `supportEmail` in `assets/js/config.js` when the license server and the
  commercial build are live. Until then the buttons scroll to the pricing section and show "opening soon".
- Assets (screenshots, promo videos, logo) are generated from the app repo: `marketing/make_site_assets.py`.
- No build step, no trackers, no external requests.
