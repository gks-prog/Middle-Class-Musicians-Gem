import Link from "next/link";
import { videoTestimonials } from "@/lib/social-proof";

export default function VideoTestimonials() {
  return <section id="client-stories" aria-labelledby="testimonials-heading" className="border-t border-white/5 bg-[#101014] py-20 sm:py-28">
    <div className="container mx-auto px-6 sm:px-10">
      <p className="eyebrow mb-4">Client video testimonials</p>
      <h2 id="testimonials-heading" className="max-w-3xl font-head text-5xl leading-none sm:text-7xl">Real voices.<br /><span className="text-[#e4bd79]">In their own words.</span></h2>
      <p className="mb-10 mt-6 max-w-xl text-sm leading-7 text-gray-300">The creative experience, told by the artists who live it.</p>
      {videoTestimonials.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{videoTestimonials.map((video) => <article key={video.videoSrc} className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#15151c]">
        <video className="aspect-video w-full bg-black" controls playsInline preload="none" poster={video.poster} aria-label={`${video.clientName}: ${video.title}`}>
          <source src={video.videoSrc} type="video/mp4" />
          <track default kind="captions" src={video.captionsSrc} srcLang="en" label="English" />
          Your browser does not support inline video. <a href={video.videoSrc}>Watch the testimonial</a>.
        </video>
        <div className="p-6"><h3 className="font-head text-2xl">{video.title}</h3><p className="mt-2 text-sm text-[#e4bd79]">{video.clientName}</p><details className="mt-5 text-sm text-gray-300"><summary className="cursor-pointer py-2">Read transcript</summary><p className="whitespace-pre-line pt-3 leading-7">{video.transcript}</p></details></div>
      </article>)}</div> : <div className="flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-[#15151c] p-7 sm:p-10 md:flex-row md:items-center"><div><p className="font-head text-3xl">Client films are coming soon.</p><p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">Until then, explore music created with the studio in our portfolio.</p></div><Link href="/portfolio" className="button-secondary shrink-0 self-start">Explore the work ↗</Link></div>}
    </div>
  </section>;
}
