import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateContent } from "../src/lib/cms/validation.ts";
const original = JSON.parse(await readFile(new URL("../src/content/studio-defaults.json", import.meta.url), "utf8"));
const copy = () => structuredClone(original);
test("existing website data survives validation unchanged", () => {
  assert.deepEqual(validateContent(original), original);
  assert.equal(original.reviews.length, 13);
  assert.equal(original.reviews.find(row => row.author === "Kartik Singla").rating, 4);
  assert.equal(original.testimonials.length, 3);
});
test("empty sections support removing all items", () => {
  const value = copy();
  for (const key of ["songs", "visuals", "reviews", "testimonials", "blogs"]) value[key] = [];
  assert.equal(validateContent(value).songs.length, 0);
});
test("unsafe media URLs cannot be published", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,test", "//evil.example/a", "http://example.com/file.mp4"]) {
    const value = copy(); value.testimonials[0].videoSrc = url;
    assert.throws(() => validateContent(value));
  }
});
test("ratings, sources, duplicate slugs and malformed visibility are rejected", () => {
  const rating = copy(); rating.reviews[0].rating = 6; assert.throws(() => validateContent(rating));
  const source = copy(); source.reviews[0].sourceUrl = "https://fake.example/review"; assert.throws(() => validateContent(source));
  const slug = copy(); slug.blogs[1].slug = slug.blogs[0].slug; assert.throws(() => validateContent(slug));
  const visibility = copy(); visibility.sections.hero = "false"; assert.throws(() => validateContent(visibility));
});
test("final-only songs and valid external media are supported", () => {
  const value = copy(); value.songs[0].raw = ""; value.songs[0].final = "https://res.cloudinary.com/example/video/upload/song.mp3";
  assert.equal(validateContent(value).songs[0].raw, "");
});
test("missing fields and excess items are rejected", () => {
  const missing = copy(); delete missing.songs; assert.throws(() => validateContent(missing));
  const excessive = copy(); excessive.songs = Array.from({length:101},(_,i)=>({...original.songs[0],id:String(i)})); assert.throws(() => validateContent(excessive));
});
