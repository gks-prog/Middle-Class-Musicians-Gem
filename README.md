# Middle Class Musicians

Production website for [middleclassmusicians.in](https://middleclassmusicians.in), built with Next.js, React, Tailwind CSS, GSAP, and Supabase.

## Local setup

```bash
npm install
npm run dev
```

Populate `.env.local` (or the deployment platform's environment settings) with these public client variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Run the complete production check before deploying:

```bash
npm run check
```

## Portfolio audio

The Raw/Final player expects matched files under `public/audio/`:

- `song-01-raw.mp3` and `song-01-final.mp3`
- `song-02-raw.mp3` and `song-02-final.mp3`
- `song-03-raw.mp3` and `song-03-final.mp3`

Both versions of each song should start at the same timestamp and use the same duration so switching preserves the listener's position accurately. Update the titles and paths in `src/app/portfolio/page.tsx` when final assets are ready.

## Supabase setup

Apply the migrations in `supabase/migrations/` to the connected Supabase project. They create Studio Talk, user profiles, bookings, purchases, realtime subscriptions, indexes, triggers, and row-level security policies.

In Supabase Authentication:

- Enable email confirmations.
- Set the confirmation email template to include the six-digit token with `{{ .Token }}`. The login screen verifies this as a `signup` OTP.
- Set the magic-link email template to include `{{ .Token }}`. Returning users receive this OTP only after their password succeeds.
- Add `/auth/update-password` to the allowed redirect URLs for password recovery.

Clients can request an available studio slot and cancel their own pending request. Confirmations, prices, purchases, and fulfilment remain studio-controlled; handle those from a trusted admin/backend process using the authenticated user ID, and never expose a service-role key in the browser.

## Search and answer-engine files

The project generates canonical metadata, JSON-LD, page-specific social cards, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, and `/llms.txt`. Keep `NEXT_PUBLIC_SITE_URL` aligned with the production domain.
