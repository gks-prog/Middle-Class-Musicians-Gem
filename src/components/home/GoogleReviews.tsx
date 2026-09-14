"use client";

import { useInteractionPlayback } from "./useInteractionPlayback";
import { type GoogleReview } from "@/lib/social-proof";

function ReviewCard({ review }: { review: GoogleReview }) {
  const initials = review.author.trim().split(/\s+/).map((part) => Array.from(part)[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  return <figure className="review-card flex w-[min(84vw,380px)] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#15151c] p-6 sm:p-8">
    <div className="mb-5 flex items-center justify-between gap-4"><span aria-label={`${review.rating} out of 5 stars`} className="tracking-widest text-[#e4bd79]"><span aria-hidden="true">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span></span><span className="text-xs text-gray-400">Google</span></div>
    <blockquote className="mb-7 whitespace-pre-line text-sm leading-7 text-gray-200">{review.text}</blockquote>
    <figcaption className="mt-auto flex items-center gap-4 border-t border-white/10 pt-5"><span className="review-avatar" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="M10 18C8 4 53 0 57 18S65 52 48 58 5 59 6 40 8 26 10 18Z" stroke="currentColor" strokeWidth="1.4" /><path d="M16 52c3-8 29-8 32 0M5 14l-3-3m56 39 4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg><span>{initials}</span></span><p className="font-semibold">{review.author}</p></figcaption>
  </figure>;
}

function EmptyReviewCard() {
  return <div data-review-placeholder="true" className="review-card flex min-h-64 w-[min(84vw,380px)] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#15151c] p-6 sm:p-8" aria-label="Empty Google review slot — verified review not yet added">
    <span className="text-xs tracking-wider text-gray-400">Google review</span>
    <div className="my-7 space-y-3" aria-hidden="true"><div className="h-2 w-full rounded bg-white/5" /><div className="h-2 w-5/6 rounded bg-white/5" /><div className="h-2 w-3/5 rounded bg-white/5" /></div>
    <span className="mt-auto border-t border-white/10 pt-5 text-xs text-gray-500">Review not added yet</span>
  </div>;
}

export default function GoogleReviews({ reviews }: { reviews: GoogleReview[] }) {
  const googleReviews = reviews;
  const playback = useInteractionPlayback();
  if (!googleReviews.length) return null;
  // Repeated visual copies fill the constrained track; assistive tech reads each review once.
  const loop: (GoogleReview | null)[] = googleReviews.length ? Array.from({ length: Math.max(1, Math.ceil(5 / googleReviews.length)) }, () => googleReviews).flat() : Array.from({ length: 5 }, () => null);
  return <section id="google-reviews" aria-labelledby="reviews-heading" className="border-b border-white/5 bg-[#0c0c10] py-16 sm:py-24">
    <div className="container mx-auto mb-10 flex flex-col justify-between gap-6 px-6 sm:px-10 lg:flex-row lg:items-end">
      <div><p className="eyebrow mb-4">The people behind the music</p><h2 id="reviews-heading" className="max-w-2xl font-head text-4xl leading-none sm:text-6xl">What our clients <span className="text-[#e4bd79]">say about us.</span></h2></div>
    </div>
    <div {...playback.interactionProps} className={`review-marquee ${playback.paused ? "is-paused" : ""}`}>
      <div className="review-window overflow-x-auto py-6" tabIndex={0} role="region" aria-label="Floating Google review slideshow; scroll to browse, focus to pause"><div className="review-track flex w-max" style={{ animationDuration: `${Math.max(36, loop.length * 10)}s` }}>
        {[0, 1].map((copy) => <div key={copy} className="review-group flex shrink-0 gap-5 pr-5" aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined}>{loop.map((review, index) => <div key={`${index}-${review?.author ?? "empty"}`} className="review-float" style={{ animationDelay: `${index * -1.3}s` }} aria-hidden={index >= (googleReviews.length || 5) ? true : undefined} inert={index >= (googleReviews.length || 5) ? true : undefined}>{review ? <ReviewCard review={review} /> : <EmptyReviewCard />}</div>)}</div>)}
      </div></div>
    </div>
  </section>;
}
