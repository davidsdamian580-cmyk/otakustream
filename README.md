# OtakuStream — Visual Redesign

This version closely follows the supplied OtakuStream reference design: dark navy/purple theme, large featured hero, horizontal anime rows, neon cards, mobile layout, trailer modal and region-aware legal viewing links.

## Data and media
Anime posters and banner artwork are loaded from AniList at runtime. AniList provides a public GraphQL API for anime data. Official trailers are embedded only when AniList supplies a YouTube trailer ID; otherwise the site opens a YouTube search for the title's official trailer.

## Legal viewing
The Where to Watch panel sends visitors to JustWatch's country-specific search plus searches on major legitimate services. Availability is controlled by each service and changes by region.

The site does not host or provide full copyrighted anime episodes.

## GitHub Pages
Upload/replace `index.html`, `style.css`, `script.js`, `README.md`, `privacy.html`, and `terms.html` in the root of the `main` branch. GitHub Pages will redeploy automatically.
