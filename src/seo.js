export const seo = {
  name: 'Yash Singh',
  title: 'Yash Singh | Creative Video Editor & Motion Designer',
  description: 'Explore Yash Singh’s video editing portfolio: brand films, documentaries, commercials, and music videos. Get in touch to discuss your next project.',
};

export function normalizeSiteUrl(value = '') {
  if (!value.trim()) return '';
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('SITE_URL must be a public HTTPS URL without credentials, query parameters, or a fragment.');
  }
  if (['localhost', '127.0.0.1', 'example.com'].includes(url.hostname)) {
    throw new Error('SITE_URL must use your real public domain.');
  }
  return `${url.href.replace(/\/+$/, '')}/`;
}

export const escapeMarkup = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);

export function seoTags(siteUrl) {
  const meta = (name, content, property = false) => ({ tag: 'meta', attrs: { [property ? 'property' : 'name']: name, content } });
  const tags = [
    meta('description', seo.description), meta('author', seo.name),
    meta('robots', 'index, follow, max-image-preview:large'),
    meta('og:type', 'website', true), meta('og:site_name', 'Yash Singh Portfolio', true),
    meta('og:title', seo.title, true), meta('og:description', seo.description, true),
    meta('og:locale', 'en_IN', true), meta('twitter:card', 'summary_large_image'),
    meta('twitter:title', seo.title), meta('twitter:description', seo.description),
    { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: './favicon.svg' } },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
  ];
  const person = { '@type': 'Person', name: seo.name, jobTitle: 'Video Editor and Motion Designer' };
  if (siteUrl) {
    const image = new URL('social-preview.png', siteUrl).href;
    tags.push(
      { tag: 'link', attrs: { rel: 'canonical', href: siteUrl } },
      meta('og:url', siteUrl, true), meta('og:image', image, true),
      meta('og:image:type', 'image/png', true), meta('og:image:width', '1200', true), meta('og:image:height', '630', true),
      meta('og:image:alt', 'Yash Singh — Creative video editor and motion designer', true),
      meta('twitter:image', image), meta('twitter:image:alt', 'Yash Singh — Creative video editor and motion designer'),
    );
    person['@id'] = `${siteUrl}#person`;
    person.url = siteUrl;
  }
  const page = {
    '@context': 'https://schema.org', '@type': 'ProfilePage',
    name: seo.title, description: seo.description, inLanguage: 'en', mainEntity: person,
    ...(siteUrl ? { '@id': `${siteUrl}#profile`, url: siteUrl } : {}),
  };
  tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(page).replace(/</g, '\\u003c') });
  return tags;
}

export function sitemapXml(siteUrl) {
  const entry = siteUrl ? `  <url><loc>${escapeMarkup(siteUrl)}</loc></url>` : '  <!-- Set SITE_URL in .env and rebuild to add the public homepage URL. -->';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entry}\n</urlset>\n`;
}

export function robotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${new URL('sitemap.xml', siteUrl).href}\n` : '\n# Set SITE_URL and rebuild to include the sitemap location.\n'}`;
}
