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
for (const name of ["studio-overview", "mic-closeup", "recording-session", "production-corner", "keys-closeup"]) {
  const asset = await stat("public/images/studio/" + name + ".webp");
  assert(asset.size < 250000, name + " image budget");
  assert(home.includes(name + ".webp"));
}
assert(!home.includes("-realistic.webp"), "Generated concept photos replaced");
const proof = JSON.parse(await readFile("src/content/social-proof.json", "utf8"));
const reviewSection = home.match(/<section id="google-reviews"[\s\S]*?<\/section>/)?.[0];
assert(reviewSection, "Inline Google reviews section exists");
assert(!reviewSection.includes("<a "), "Reviews do not redirect visitors off-site");
assert(reviewSection.includes("review-track"), "Reviews have an inline sliding track, even before import");
assert(reviewSection.includes("review-float"), "Review cards float");
assert(!home.includes("Client films are coming soon."));
const testimonialSection = home.match(/<section id="client-stories"[\s\S]*?<\/section>/)?.[0];
assert(testimonialSection);
assert(!testimonialSection.includes("<iframe"), "Native video replaces embeds");
assert(!testimonialSection.includes("instagram.com"), "No Instagram testimonial redirects");
assert(!testimonialSection.includes("data-testimonial-placeholder"), "No blank card");
assert.equal((testimonialSection.match(/data-native-testimonial=/g) || []).length, 3);
assert.equal(proof.testimonials.length, 3);
if (proof.reviews.length === 0) {
  assert(reviewSection.includes("Verified Google review content is awaiting import."));
  assert(!reviewSection.includes("out of 5 stars"), "Empty slots must not invent star ratings");
}
for (const review of proof.reviews) {
  assert(review.author && review.text && review.sourceUrl && review.dateLabel && review.sourceScreenshot, "Review attribution is required");
  assert(Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5, "Valid rating");
  const host = new URL(review.sourceUrl).hostname;
  assert(host === "share.google" || host === "maps.app.goo.gl" || host === "google.com" || host.endsWith(".google.com"), "Original Google source");
}
assert.equal(proof.reviews.length, 13, "All supplied review screenshots included");
assert.equal(proof.reviews.find((r) => r.author === "Kartik Singla")?.rating, 4, "Preserve the supplied four-star review");
assert(!reviewSection.includes("data-review-placeholder"), "Real reviews replace empty cards");
assert(reviewSection.includes("4 out of 5 stars"));
assert(!reviewSection.includes("at time of capture"), "Review dates are hidden");
assert(!reviewSection.includes("Reviews from our Google Business Profile"), "Screenshot explanation removed");
assert(reviewSection.includes("review-avatar"), "Initials avatars appear beside reviewers");
assert(!/Pause slideshow|Play slideshow|Pause reviews|Resume reviews/.test(home), "Manual playback buttons removed");
for (const video of proof.testimonials) {
  assert(video.id && video.title && video.videoSrc, "Named native video");
  assert.equal(new URL(video.videoSrc).hostname, "res.cloudinary.com");
  assert(testimonialSection.includes(video.videoSrc));
}
const config = (await import("../next.config.mjs")).default;
const redirects = await config.redirects();
assert(redirects.some((r) => r.source === "/dashboard/:path*" && r.destination === "/#contact"));
assert(redirects.some((r) => r.source === "/auth/:path*" && r.destination === "/"));
console.log("Homepage content, placement, metadata, assets, social-proof integrity and redirects passed.");
