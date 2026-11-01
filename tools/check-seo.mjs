import assert from "node:assert/strict";

const base = process.argv[2] || "http://127.0.0.1:3000";
const canonical = "https://www.paniar.in";
async function get(path) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  return response.text();
}
const robots = await get("/robots.txt");
assert.match(robots, /User-Agent: \*/i);
assert.match(robots, /Allow: \//);
assert.match(robots, /Disallow: \/admin/);
assert.match(robots, /Disallow: \/api\//);
assert.ok(robots.includes(`${canonical}/sitemap.xml`));
const sitemap = await get("/sitemap.xml");
assert.equal((sitemap.match(/<loc>/g) || []).length, 4);
assert.ok(!sitemap.includes("/admin"));
const titles = new Set();
for (const route of ["/", "/shop", "/about", "/contact"]) {
  const html = await get(route);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${route}: unique title`);
  titles.add(title);
  const canonicalLink = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonicalLink).href, new URL(route, canonical).href, `${route}: canonical`);
  assert.match(html, /name="description" content="[^"]{30,}"/);
  assert.match(html, /name="robots" content="index, follow"/);
  assert.ok(html.includes('property="og:image"'));
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(html.includes('name="google-site-verification"'));
  const data = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.ok(data.some(value => value["@graph"]?.some(item => item["@type"] === "Organization")), `${route}: organization`);
  if (route === "/shop") {
    const collection = data.find(value => value["@type"] === "CollectionPage");
    assert.ok(collection?.mainEntity.numberOfItems > 0);
    assert.equal(collection.mainEntity.itemListElement.length, collection.mainEntity.numberOfItems);
    assert.ok(collection.mainEntity.itemListElement.every(item => html.includes(`id="${new URL(item.item.url).hash.slice(1)}"`)));
  }
  console.log(`${route}: metadata and structured data passed`);
}
const admin = await get("/admin");
assert.match(admin, /name="robots" content="noindex, nofollow"/);
console.log("robots.txt, sitemap, Google verification tag and admin noindex passed");
