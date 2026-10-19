# Portfolio structure

This is a single-page portfolio. Its sitemap contains only the canonical homepage URL once `SITE_URL` is configured. Work, about, services, reviews, and contact are sections of that page, not separate URLs for the sitemap.

The build generates `dist/sitemap.xml` and `dist/robots.txt` from the same URL setting used for the canonical and social tags. No artificial modification dates, priorities, or change frequencies are emitted.

Before public deployment, set the final URL in `.env` and run `npm run build`. For subfolder hosting, place `robots.txt` at the domain root as well and reference the subfolder sitemap from it.
