import { videoTestimonials } from "@/lib/social-proof";

export default function VideoTestimonials() {
  return <section id="client-stories" aria-labelledby="testimonials-heading" className="border-t border-white/5 bg-[#101014] py-20 sm:py-28">
    <div className="container mx-auto px-6 sm:px-10">
      <p className="eyebrow mb-4">Client video testimonials</p>
      <h2 id="testimonials-heading" className="max-w-3xl font-head text-5xl leading-none sm:text-7xl">Real voices.<br /><span className="text-[#e4bd79]">In their own words.</span></h2>
      <p className="mb-10 mt-6 max-w-xl text-sm leading-7 text-gray-300">The creative experience, told by the artists who live it.</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{videoTestimonials.map((video) => <article key={video.videoSrc} className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#15151c]">
        <video className="aspect-video w-full bg-black" controls playsInline preload="none" poster={video.poster} aria-label={`${video.clientName}: ${video.title}`}>
          <source src={video.videoSrc} type="video/mp4" />
          <track default kind="captions" src={video.captionsSrc} srcLang="en" label="English" />
          Your browser does not support inline video. <a href={video.videoSrc}>Watch the testimonial</a>.
        </video>
        <div className="p-6"><h3 className="font-head text-2xl">{video.title}</h3><p className="mt-2 text-sm text-[#e4bd79]">{video.clientName}</p><details className="mt-5 text-sm text-gray-300"><summary className="cursor-pointer py-2">Read transcript</summary><p className="whitespace-pre-line pt-3 leading-7">{video.transcript}</p></details></div>
      </article>)}
      {Array.from({ length: Math.max(0, 4 - videoTestimonials.length) }, (_, index) => <div key={`empty-${index}`} data-testimonial-placeholder="true" role="img" aria-label={`Empty client testimonial video container ${videoTestimonials.length + index + 1}`} className="relative aspect-[4/5] min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#19191f,#0b0b0e)] shadow-[0_16px_48px_-24px_rgba(0,0,0,0.7)]"><span aria-hidden="true" className="absolute inset-4 rounded-xl border border-white/[0.035]" /></div>)}
      </div>
    </div>
  </section>;
}
