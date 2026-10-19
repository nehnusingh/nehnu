import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { normalizeSiteUrl, seoTags, sitemapXml, robotsTxt } from '../src/seo.js';

test('canonical, sitemap and sharing URLs use the same configured base, including subfolders', () => {
  const url = normalizeSiteUrl('https://portfolio.test/yash');
  assert.equal(url, 'https://portfolio.test/yash/');
  const tags = seoTags(url);
  assert.equal(tags.find(tag => tag.attrs?.rel === 'canonical').attrs.href, url);
  assert.equal(tags.find(tag => tag.attrs?.property === 'og:url').attrs.content, url);
  assert.equal(tags.find(tag => tag.attrs?.property === 'og:image').attrs.content, `${url}social-preview.png`);
  assert.match(sitemapXml(url), /<loc>https:\/\/portfolio\.test\/yash\/<\/loc>/);
  assert.match(robotsTxt(url), /Sitemap: https:\/\/portfolio\.test\/yash\/sitemap.xml/);
  const graph = JSON.parse(tags.find(tag => tag.attrs?.type === 'application/ld+json').children);
  assert.equal(graph.url, url);
  assert.equal(graph.mainEntity.url, url);
});

test('undecided domain never emits invented canonical or sitemap URLs', () => {
  assert.equal(normalizeSiteUrl(''), '');
  assert.ok(!seoTags('').some(tag => tag.attrs?.rel === 'canonical'));
  assert.ok(!seoTags('').some(tag => tag.attrs?.property === 'og:url'));
  assert.ok(!sitemapXml('').includes('<loc>'));
  assert.ok(!robotsTxt('').includes('Sitemap:'));
  for (const value of ['http://portfolio.test', 'https://portfolio.test/#work', 'https://portfolio.test/?x=1', 'https://name:secret@portfolio.test/']) {
    assert.throws(() => normalizeSiteUrl(value));
  }
});

test('production HTML has crawlable content, one title/description, valid JSON-LD and early charset', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/name="description"/g) || []).length, 1);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.indexOf('charset="UTF-8"') < 1024);
  for (const section of ['top', 'work', 'about', 'services', 'reviews', 'contact']) {
    assert.ok(html.includes(`<section id="${section}"`));
  }
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(graph['@type'], 'ProfilePage');
  assert.equal(graph.mainEntity['@type'], 'Person');
  assert.ok(!('aggregateRating' in graph));
  assert.ok(!html.includes('<div id="root"></div>'));
  const image = await readFile('dist/social-preview.png');
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
  assert.ok((await readFile('dist/favicon.svg', 'utf8')).includes('<svg'));
});
