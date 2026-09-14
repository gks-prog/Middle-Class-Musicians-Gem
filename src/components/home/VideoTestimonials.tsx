"use client";

import { useEffect, useRef, useState } from "react";
import { videoTestimonials, type VideoTestimonial } from "@/lib/social-proof";

function Preview({ video, paused, onOpen }: { video: VideoTestimonial; paused: boolean; onOpen: (time: number, button: HTMLButtonElement) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    let visible = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      player.muted = true;
      if (visible && !player.getAttribute("src")) player.src = video.videoSrc;
      if (visible && !paused && !document.hidden && !motion.matches) {
        void player.play().catch(() => { /* The card still opens through a user gesture. */ });
      } else player.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.15 });
    observer.observe(player);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => { observer.disconnect(); player.pause(); document.removeEventListener("visibilitychange", sync); motion.removeEventListener("change", sync); };
  }, [paused, video.videoSrc]);
  return <article data-native-testimonial={video.id} className="w-full max-w-sm min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#15151c] shadow-[0_16px_48px_-24px_#000]">
    <button type="button" aria-haspopup="dialog" aria-label={`Watch ${video.title.toLowerCase()} with sound`} onClick={(event) => onOpen(ref.current?.currentTime ?? 0, event.currentTarget)} className="group relative block aspect-[9/16] w-full overflow-hidden text-left">
      <video ref={ref} data-source={video.videoSrc} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} className="pointer-events-none h-full w-full object-cover" />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-3 bg-gradient-to-t from-black/90 to-transparent px-5 pb-6 pt-16">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white transition-colors group-hover:bg-[#d4a857] group-hover:text-black" aria-hidden="true">▶</span>
      </span>
    </button>
  </article>;
}

export default function VideoTestimonials() {
  const [active, setActive] = useState<VideoTestimonial | null>(null);
  const [playError, setPlayError] = useState(false);
  const modal = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const pendingTime = useRef(0);
  const playbackRequest = useRef(0);
  const close = () => {
    playbackRequest.current += 1;
    modal.current?.close();
    if (player.current) { player.current.muted = true; player.current.pause(); player.current.removeAttribute("src"); player.current.load(); }
    setActive(null);
    opener.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    const element = player.current;
    const visibility = () => { if (document.hidden) element?.pause(); };
    document.addEventListener("visibilitychange", visibility);
    return () => { element?.pause(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [active]);
  const open = (video: VideoTestimonial, time: number, button: HTMLButtonElement) => {
    const element = player.current;
    if (!element || !modal.current) return;
    const request = ++playbackRequest.current;
    opener.current = button;
    pendingTime.current = time;
    setActive(video); setPlayError(false);
    modal.current.showModal();
    element.src = video.videoSrc;
    element.muted = false; element.volume = 1;
    // Preserve the click gesture for sound-on playback on mobile browsers.
    void element.play().catch(() => { if (modal.current?.open && playbackRequest.current === request) setPlayError(true); });
  };
  return <section id="client-stories" aria-labelledby="testimonials-heading" className="border-t border-white/5 bg-[#101014] py-20 sm:py-28">
    <div className="container mx-auto px-6 sm:px-10">
      <p className="eyebrow mb-4">Client video testimonials</p>
      <h2 id="testimonials-heading" className="max-w-3xl font-head text-5xl leading-none sm:text-7xl">Real voices.<br /><span className="text-[#e4bd79]">In their own words.</span></h2>
      <p className="mb-10 mt-6 max-w-xl text-sm leading-7 text-gray-300">The creative experience, told by the artists who live it. Tap a video to listen.</p>
      <div className="mx-auto grid max-w-5xl grid-cols-1 justify-items-center gap-5 md:grid-cols-3">{videoTestimonials.map((video) => <Preview key={video.id} video={video} paused={active !== null} onOpen={(time, button) => open(video, time, button)} />)}</div>
    </div>
    <dialog ref={modal} aria-labelledby="testimonial-modal-title" className="testimonial-dialog fixed inset-0 m-auto max-h-[94svh] w-[min(440px,calc(100%_-_2rem))] overflow-y-auto rounded-3xl border border-white/15 bg-[#15151c] p-0 text-white shadow-2xl" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    }}>
      <div className="flex items-center justify-end gap-4 px-5 py-3">
        <h3 id="testimonial-modal-title" className="sr-only">{active?.title ?? "Client testimonial"}</h3>
        <button type="button" autoFocus onClick={close} aria-label="Close testimonial" className="carousel-control shrink-0 text-2xl">×</button>
      </div>
      <video ref={player} controls playsInline preload="none" className="mx-auto aspect-[9/16] max-h-[76svh] w-full bg-black object-contain" aria-label={active?.title ?? "Client testimonial"} onLoadedMetadata={() => {
        const element = player.current;
        if (element && Number.isFinite(element.duration)) element.currentTime = Math.min(pendingTime.current, Math.max(0, element.duration - 0.1));
      }} onPlaying={() => setPlayError(false)} onError={() => { if (modal.current?.open) setPlayError(true); }} />
      {playError && <p role="status" className="px-5 py-3 text-sm text-gray-200">Playback did not start. Use the video’s play control to try again.</p>}
    </dialog>
  </section>;
}
