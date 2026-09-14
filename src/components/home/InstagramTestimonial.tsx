"use client";

import { useEffect, useRef, useState } from "react";
import { InstagramIcon } from "@/components/global/ContactIcons";

// Instagram controls embedded playback. Do not add unsupported mute/autoplay flags.
export default function InstagramTestimonial({ id, url, number }: { id: string; url: string; number: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const label = `Client testimonial ${number}`;
  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    const opener = trigger.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  return <article data-instagram-testimonial={id} className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#15151c] shadow-[0_16px_48px_-24px_#000]">
    <div className="relative h-[390px] bg-[#0b0b0e]">
      <div inert aria-hidden="true" className="h-full overflow-hidden">
        <iframe src={`${url}embed/`} title={`${label} preview`} loading="lazy" tabIndex={-1} className="pointer-events-none h-[490px] w-full border-0" />
      </div>
      <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-label={`Expand ${label.toLowerCase()}`} aria-haspopup="dialog" className="group absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 via-transparent to-transparent p-5">
        <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-black/80 px-5 text-sm font-semibold text-white transition-colors group-hover:border-[#e4bd79] group-hover:text-[#e4bd79]"><span aria-hidden="true">↗</span> Watch testimonial</span>
      </button>
    </div>
    <div className="flex items-center justify-between gap-3 p-4">
      <h3 className="text-sm font-semibold">{label}</h3>
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs text-[#e4bd79]" aria-label={`Open ${label.toLowerCase()} on Instagram`}><InstagramIcon />Instagram</a>
    </div>
    <dialog ref={dialog} aria-labelledby={`testimonial-title-${id}`} className="testimonial-dialog fixed inset-0 m-auto max-h-[92svh] w-[min(440px,calc(100%_-_2rem))] overflow-y-auto rounded-3xl border border-white/15 bg-[#15151c] p-0 text-white shadow-2xl" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false);
    }}>
      {open && <>
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <h3 id={`testimonial-title-${id}`} className="font-semibold">{label}</h3>
          <button type="button" autoFocus onClick={() => setOpen(false)} aria-label="Close testimonial" className="carousel-control shrink-0 text-2xl">×</button>
        </div>
        <iframe src={`${url}embed/`} title={label} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen className="h-[min(620px,68svh)] w-full border-0 bg-white" />
        <a href={url} target="_blank" rel="noopener noreferrer" className="block px-5 py-4 text-center text-sm text-[#e4bd79]">Open on Instagram ↗</a>
      </>}
    </dialog>
  </article>;
}
