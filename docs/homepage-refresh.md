# Homepage refresh — September 2026

## Delivered

- Four generated, optimized WebP hero backgrounds with responsive live text, first-image preload, swipe, previous/next, slide selection, pause, focus/hover pause and reduced-motion support.
- Google reviews section immediately after the hero service strip. Seamless CSS marquee, attributed star ratings, original review links, pause and reduced-motion fallback are implemented, but no unverified reviews are published.
- Client video section immediately above Direct Answers, ready for permission-cleared MP4s, posters, captions and transcripts. No autoplay or initial video download.
- Studio Talk and client portal/auth UI removed. Old URLs redirect to the homepage/contact area. Existing Supabase users, profiles, comments, bookings, purchases and migrations are untouched; historical UI is recoverable from Git history.
- Removed blocking splash and generic Delhi map iframe. Retained the existing exact directions link; footer now displays the location in text.
- Expanded business/service schema, linked homepage/website/business entities, local service copy, updated journal metadata and llms.txt. Sitemap no longer publishes artificial last-modified dates on every build.

## Content needed before activating social proof

The supplied Google short link did not expose review text in this environment. Send screenshots/export containing each review's author, exact text, star rating, date and original Google link. Add only verified entries to `src/content/social-proof.json`:

- `reviews`: author, rating (integer 1–5), text, publishedDate (ISO date), sourceUrl (original Google URL).
- `testimonials`: clientName, title, videoSrc (MP4), poster, captionsSrc (WebVTT), transcript. Obtain client permission before publishing. Store media in public/videos/testimonials or an approved media host; use captions matching the video's spoken language.

Until these arrays are populated, the site links to the real Google Business Profile and clearly says client films are coming soon. These are not live Google API imports. After adding verified content, run `npm run check` and redeploy.

## Search follow-through

Confirm the actual production custom domain matches NEXT_PUBLIC_SITE_URL (currently the repository defaults to https://middleclassmusicians.in). Keep Google Business Profile name, address, telephone and website consistent. Provide exact street address and business hours before adding them to schema. Submit the sitemap in Search Console and assess real Core Web Vitals after traffic accumulates. No implementation guarantees top rankings or AI citations. Self-serving LocalBusiness aggregate review markup is intentionally absent. FAQ content remains useful semantic Q&A; no FAQ rich-result promise is made.

## Image generation record

Mode: built-in image generation, four separate new-image calls, conceptual campaign artwork (not photos of the actual studio or clients). Live HTML supplies the requested wording for readability and accessibility. All four final assets live in `public/images/hero/`; original generated PNGs were preserved outside the repository. WebP conversion only resized/compressed the outputs to 1600 px wide, quality 80.

Final prompt set:

1. `public/images/hero/artist-solution.webp` — Generate a wide 16:9 premium website hero background, ads-marketing for Middle Class Musicians, a music production studio. First of a coordinated black, charcoal and warm gold campaign. Art-directed conceptual still life, not a documentary photo of any real studio: a condenser microphone, piano keys, mixing console and cinema camera arranged as an elegant sculptural composition on the RIGHT half; subtle concentric golden soundwaves, realistic materials, restrained amber rim lighting, grain and deep shadows. LEFT half dark open negative space for live HTML typography. No people, no text, no letters, no watermark. Intended slide message to be overlaid by code: 'One-stop solution for artists' covering recording, music production, mixing/mastering, courses, artist management and video production. Save a downloadable local image file for integration in the website; return its file path.
2. `public/images/hero/creative-atmosphere.webp` — Use case ads-marketing. Second of four coordinated premium music studio website hero backgrounds. Wide 16:9 landscape. Black charcoal warm gold palette. Conceptual poetic editorial image of a studio condenser microphone on the right, its golden sound waves transforming into gentle flowing silk-like ribbons in a dark atmospheric space, subtle amber haze, realistic metal mesh and soft light. Evoke room to breathe and creativity, calm elegant not neon. No people; do not depict this as an actual studio location. Keep LEFT half dark and open for live website overlay heading 'An atmosphere where your creativity breathes'. Do not render any text or watermark, text will be applied responsively in code.
3. `public/images/hero/happy-clients.webp` — Use case ads-marketing. Third of four coordinated premium music studio website hero backgrounds, wide 16:9 landscape. Elegant black charcoal and warm gold. Conceptual editorial still life on the RIGHT: seven subtle luminous concentric vinyl record rings standing in perspective, hundreds of delicate golden points forming a softly glowing sound wave behind them. Confident established music brand, photorealistic materials, sophisticated art direction, deep shadows, restrained amber rim light. Do not show people, awards, logos or a real studio. LEFT half remains near-black open negative space for responsive HTML copy about 500+ happy clients and 7+ years. NO TEXT, no numerals, no letters, no watermark. This is conceptual artwork not a photograph documenting a factual award.
4. `public/images/hero/type-beats.webp` — Use case ads-marketing. Fourth of four coordinated premium music studio website hero backgrounds. Wide 16:9 landscape, near black charcoal and warm gold, premium realistic materials. On RIGHT half a stylish unbranded drum sampler with amber lit pads, cropped piano keyboard and tactile analog audio knobs, arranged in a dynamic diagonal with delicate golden waveform lines. Musical energy and individual style, cinematic side lighting and rich shadows, restrained luxury not neon. LEFT half dark open negative space for responsive HTML heading 'Your sound. Your type beats.' NO rendered text, letters, logos, people or watermark. Conceptual campaign artwork, not documentation of actual studio facilities.
