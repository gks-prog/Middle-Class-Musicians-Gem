# Real studio photos and Google review import

This revision supersedes the fictional/generated-room hero imagery from the earlier revisions.

## Photos

Five source photos supplied by the owner from the Google Business Profile are used. Four were lightly edited using the built-in image-generation tool for exposure and color; the original recording-session photo is used without a generative edit because that edit request was rejected by the image tool. No attempt was made to bypass that rejection. All five files were then resized/compressed to WebP without cropping; actual hero framing is responsive CSS. Portrait photos retain their full frame on desktop, with a separate photo area above the text on mobile. Original attachments are untouched.

- Final asset: public/images/studio/studio-overview.webp; source attachment: a98ecbbc-8691-4b11-875f-3e29a680c4b5.png.
- Final asset: public/images/studio/mic-closeup.webp; source attachment: ebfba35f-192b-4c36-ad94-db77dbb3e942.png.
- Final asset: public/images/studio/recording-session.webp; source attachment: 05f4bd40-4548-4914-b80f-1551bc1d31bf.png.
- Final asset: public/images/studio/production-corner.webp; source attachment: 4c99bfae-2ef2-402f-837e-2ed383f16aea.png.
- Final asset: public/images/studio/keys-closeup.webp; source attachment: bffbc372-0c01-45e1-81f6-8c655b9ade58.png.

## Editing prompts

### studio-overview

Use case: lighting-weather. This is an EDIT of the attached REAL wide control room photo for the studio's website. Perform ONLY a restrained professional photographic exposure/color correction: lift underexposed shadows slightly so the existing equipment is legible, tame LED highlights, gently reduce the heavy color cast without removing the real amber/teal studio mood, modest natural contrast and fine detail. Retain the original image aspect ratio and framing, every wall/foam pattern, all existing furniture, cables, screens, equipment brands and models and their exact positions. If a person is present, preserve their identity, face, body, skin tone, pose, clothing, accessories and expression exactly. Do NOT generate a new room, replace any equipment, add props, remove existing objects, move the subject, outpaint new space, invent screen detail, add text, branding, glowing particles or effects. Cinematic but believable and faithful, a light photo grade, not a reimagining. No watermark. The result must clearly be the same uploaded photograph.

### mic-closeup

Use case: lighting-weather. Light photographic color/exposure correction of this attached REAL music studio photo only. Preserve the original aspect ratio, exact framing, scene geometry, actual equipment models, labels, knobs, screens, foam panels, furniture, cables, objects, positions and all details. Lift very dark midtones subtly, tame LED highlights, gently balance green/blue color cast while retaining the authentic teal lighting, modest cinematic contrast. It must remain unmistakably the same uploaded photograph, not a recreated studio. No new gear, no changed brands, no object removal/addition, no retouching into different materials, no invented screen content, no outpainting, no overlaid text or watermark.

### production-corner

Use case: lighting-weather. Light photographic color/exposure correction of this attached REAL music studio photo only. Preserve the original aspect ratio, exact framing, scene geometry, actual equipment models, labels, knobs, screens, foam panels, furniture, cables, objects, positions and all details. Lift very dark midtones subtly, tame LED highlights, gently balance green/blue color cast while retaining the authentic teal lighting, modest cinematic contrast. It must remain unmistakably the same uploaded photograph, not a recreated studio. No new gear, no changed brands, no object removal/addition, no retouching into different materials, no invented screen content, no outpainting, no overlaid text or watermark.

### keys-closeup

Use case: lighting-weather. Light photographic color/exposure correction of this attached REAL music studio photo only. Preserve the original aspect ratio, exact framing, scene geometry, actual equipment models, labels, knobs, screens, foam panels, furniture, cables, objects, positions and all details. Lift very dark midtones subtly, tame LED highlights, gently balance green/blue color cast while retaining the authentic teal lighting, modest cinematic contrast. It must remain unmistakably the same uploaded photograph, not a recreated studio. No new gear, no changed brands, no object removal/addition, no retouching into different materials, no invented screen content, no outpainting, no overlaid text or watermark.

## Reviews

All 13 supplied screenshots were transcribed into src/content/social-proof.json with names, wording, line breaks, visible relative date labels and star ratings. Twelve entries have five stars and Kartik Singla has four stars. Source screenshot basenames are stored with each entry. Dates are labelled “at time of capture”, since screenshots provide relative ages rather than exact publication dates. No exact dates, overall business rating, total review count or live-sync claim is inferred from this sample. Names are displayed as shown. Minor emoji presentation varies by device.

Reviews render inline in the floating loop with no outbound links or remaining review placeholders. Four blank testimonial video containers are retained. The original Google short link remains as internal provenance and business identity metadata. No aggregate review schema is added.

## Validation

npm run check covers TypeScript, lint, production build, five real-photo references and image budgets, all 13 reviews, four-star preservation, no review placeholders/redirects, and four video slots. Preview UI testing requires the existing Vercel sign-in; this revision does not alter that protection.

