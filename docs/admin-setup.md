# Studio content manager

Visit /admin to edit songs, Latest Visuals, client videos, journal articles and Google reviews. The Sections tab shows/hides homepage sections and the portfolio/journal content. Add, edit, reorder or remove entries, then click Publish changes. Discard edits restores the last version loaded into the editor. Another admin's newer publication will block an outdated save.

The published content lives in Supabase, not browser storage or GitHub source files. No code edits or redeploys are needed for day-to-day content changes. React renders article/review text as text, not HTML.

## One-time activation

1. In the existing Supabase project's SQL Editor, run supabase/migrations/20260914_studio_admin.sql once. This only adds studio_admins, studio_content, studio_content_history and a publishing function. Existing auth users, bookings and other data are untouched.
2. In Supabase Authentication > Users, create an administrator with email/password and confirm the email. Use a strong unique password. No public admin signup is provided.
3. Copy that user's UUID. Run:
   insert into public.studio_admins(user_id) values ('YOUR_ADMIN_USER_UUID');
   Never grant membership to every authenticated user.
4. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) for the same project in Vercel's environment settings. No service-role key is used.
5. Deploy the PR revision, then sign in at /admin/login. The first edit publishes the full preserved baseline content. Sessions expire after at most one hour.
6. Verify anonymous users and an ordinary signed-in user cannot access /api/admin/content or call publish_studio_content; test a permitted admin, a publish, and a second stale editor tab.

Only the Supabase project owner needs the SQL/dashboard setup. Do not put passwords in GitHub or send them in chat.

## Media and articles

- Upload audio/video to Cloudinary and paste the direct file URL. No file uploads pass through Vercel; no Instagram embeds are used. The initial three Cloudinary testimonial links are preserved.
- Songs accept a final mix plus an optional raw recording.
- Latest Visuals accepts a YouTube video ID, title and artist.
- Testimonials keep an accessibility label without showing numbered labels on the video.
- Blog text uses blank lines for paragraphs. Each article gets /blogs/your-url-name, page metadata, BlogPosting data and sitemap inclusion. Changing its URL name changes the link; keep it stable after sharing.
- Reviews must use real wording, original star ratings and a Google source link. Existing source screenshot/date references remain intact.
- Empty lists remove their content; visibility switches hide it without deleting entries.

## Security and recovery

Every admin API request verifies the Supabase user and their membership. Password authentication uses Supabase Auth. Access tokens are kept in HttpOnly, Secure-in-production, SameSite=Strict cookies. Writes require a matching Origin. Payload validation and size limits run on the server. The database publishing function separately checks admin membership and an expected version under a row lock. Public roles can read only published content and cannot directly write tables. Publishing history is readable only by admins.

Supabase handles authentication rate limits. Keep its authentication settings and email recovery configured. Password resets can be initiated by the project owner in Supabase.

The server uses the current published content with a 60-second cache and invalidates it on publish. Before setup or during a backend failure, the original built-in content is used so the public website stays available. A failure never saves over existing data. Unpublished form edits remain in memory only; sign in in another tab if a session expires.

## Validation

The GitHub workflow runs the production build, TypeScript/ESLint, homepage regression checks and CMS validation tests against the preserved baseline without production secrets. Database permissions and live login/publishing must be verified against the configured Supabase project after activation. The unavailable workspace prevented running this revision locally.
