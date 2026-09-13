"use client";

import { useState } from "react";
import { googleReviews, type GoogleReview } from "@/lib/social-proof";
import { siteConfig } from "@/lib/site";

function ReviewCard({ review }: { review: GoogleReview }) {
  return <figure className="review-card flex w-[min(84vw,380px)] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#15151c] p-6 sm:p-8">
    <div className="mb-5 flex items-center justify-between gap-4"><span aria-label={`${review.rating} out of 5 stars`} className="tracking-widest text-[#e4bd79]"><span aria-hidden="true">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span></span><span className="text-xs text-gray-400">Google</span></div>
    <blockquote className="mb-7 whitespace-pre-line text-sm leading-7 text-gray-200">{review.text}</blockquote>
    <figcaption className="mt-auto border-t border-white/10 pt-5"><p className="font-semibold">{review.author}</p><time dateTime={review.publishedDate} className="mt-1 block text-xs text-gray-400">{review.publishedDate}</time><a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-xs text-[#e4bd79]">Read original on Google ↗</a></figcaption>
  </figure>;
}

export default function GoogleReviews() {
  const [paused, setPaused] = useState(false);
  // Repeated visual copies fill the constrained track; assistive tech reads each review once.
  const loop = googleReviews.length ? Array.from({ length: Math.max(1, Math.ceil(5 / googleReviews.length)) }, () => googleReviews).flat() : [];
  return <section id="google-reviews" aria-labelledby="reviews-heading" className="border-b border-white/5 bg-[#0c0c10] py-16 sm:py-24">
    <div className="container mx-auto mb-10 flex flex-col justify-between gap-6 px-6 sm:px-10 lg:flex-row lg:items-end">
      <div><p className="eyebrow mb-4">The people behind the music</p><h2 id="reviews-heading" className="max-w-2xl font-head text-4xl leading-none sm:text-6xl">What our clients <span className="text-[#e4bd79]">says about us.</span></h2></div>
      <a href={siteConfig.googleReviews} target="_blank" rel="noopener noreferrer" className="button-secondary shrink-0 self-start">Read our Google reviews ↗</a>
    </div>
    {googleReviews.length ? <div className={`review-marquee ${paused ? "is-paused" : ""}`}>
      <div className="container mx-auto mb-5 px-6 sm:px-10"><button className="min-h-11 text-xs text-gray-300" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Resume reviews" : "Pause reviews"}</button></div>
      <div className="review-window overflow-x-auto"><div className="review-track flex w-max" style={{ animationDuration: `${Math.max(36, loop.length * 14)}s` }}>
        {[0, 1].map((copy) => <div key={copy} className="review-group flex shrink-0 gap-5 pr-5" aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined}>{loop.map((review, index) => <div key={`${index}-${review.author}`} aria-hidden={index >= googleReviews.length ? true : undefined} inert={index >= googleReviews.length ? true : undefined}><ReviewCard review={review} /></div>)}</div>)}
      </div></div>
    </div> : <div className="container mx-auto px-6 sm:px-10"><div className="rounded-2xl border border-white/10 bg-[#15151c] p-7 sm:p-9"><p className="max-w-2xl text-sm leading-7 text-gray-300">Get to know the studio through the people who have recorded with us. Read their original feedback and star ratings on our Google Business Profile.</p></div></div>}
  </section>;
}
