import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const home = await readFile(".next/server/app/index.html", "utf8");
const blogs = await readFile(".next/server/app/blogs.html", "utf8");
const schemas = [...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => JSON.parse(match[1]));
assert.equal((home.match(/<h1[ >]/g) || []).length, 1, "One descriptive page heading");
for (const id of ["google-reviews", "client-stories", "frequently-asked-questions", "contact"]) assert(home.includes('id="' + id + '"'), id);
assert(home.indexOf('class="service-strip') < home.indexOf('id="google-reviews"'));
assert(home.indexOf('id="client-stories"') < home.indexOf('id="frequently-asked-questions"'));
assert(!/Studio Talk|Client portal|href="\/auth|href="\/dashboard/.test(home + blogs));
assert(schemas.some((schema) => schema["@type"] === "LocalBusiness" && schema.hasOfferCatalog.itemListElement.length === 8));
assert(schemas.some((schema) => Array.isArray(schema["@type"]) && schema["@type"].includes("FAQPage") && schema.mainEntity.length === 5));
assert(!schemas.some((schema) => schema.aggregateRating), "No unsupported self-serving aggregate review markup");
assert(home.includes('name="viewport"'));
assert(home.includes('rel="canonical"'));
assert(home.includes("2ig5EfQ69dRmQu5qb"));
for (const name of ["artist-solution", "creative-atmosphere", "happy-clients", "type-beats"]) {
  const asset = await stat("public/images/hero/" + name + ".webp");
  assert(asset.size < 150000, name + " image budget");
  assert(home.includes(name + ".webp"));
}
const proof = JSON.parse(await readFile("src/content/social-proof.json", "utf8"));
for (const review of proof.reviews) {
  assert(review.author && review.text && review.sourceUrl && review.publishedDate, "Review attribution is required");
  assert(Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5, "Valid rating");
  const host = new URL(review.sourceUrl).hostname;
  assert(host === "share.google" || host === "maps.app.goo.gl" || host === "google.com" || host.endsWith(".google.com"), "Original Google source");
}
for (const video of proof.testimonials) {
  assert(video.clientName && video.title && video.videoSrc && video.poster && video.captionsSrc && video.transcript, "Accessible, attributed video");
}
const config = (await import("../next.config.mjs")).default;
const redirects = await config.redirects();
assert(redirects.some((r) => r.source === "/dashboard/:path*" && r.destination === "/#contact"));
assert(redirects.some((r) => r.source === "/auth/:path*" && r.destination === "/"));
console.log("Homepage content, placement, metadata, assets, social-proof integrity and redirects passed.");
