"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StructuredData from "@/components/global/StructuredData";
import HeroCarousel from "@/components/home/HeroCarousel";
import GoogleReviews from "@/components/home/GoogleReviews";
import VideoTestimonials from "@/components/home/VideoTestimonials";
import { absoluteUrl, siteConfig } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const portfolioVideos = [
  { id: "Lh67UKKh8FU", title: "4AM", artist: "DBRAVE" },
  { id: "07D7VGtHLOc", title: "Controversy", artist: "Vakta" },
  { id: "FEgOKqd_7W8", title: "MATTHA KHARAB", artist: "MC DAITYA" },
  { id: "3kgBkBZhZMQ", title: "PYAASI KALAM", artist: "MC DAITYA" },
];

const faqs = [
  {
    question: "What services does Middle Class Musicians offer?",
    answer: "MCM Studio in Uttam Nagar, New Delhi offers recording, music production, mixing and mastering, custom type beats, music production courses, artist management, and video production.",
  },
  {
    question: "Where is MCM Studio located?",
    answer: "The studio is in Uttam Nagar, New Delhi, Delhi 110059. Use the map link on this website for directions before your session.",
  },
  {
    question: "How do I book a recording session?",
    answer: "Send your preferred service, project details, and timing on WhatsApp. The team can then confirm the session and preparation requirements.",
  },
  {
    question: "Can I hear the difference between a raw and final mix?",
    answer: "Yes. The audio portfolio is designed for matched Raw and Final playback so you can compare an untreated recording with the mixed and mastered result.",
  },
  {
    question: "Does MCM teach music production?",
    answer: "Yes. MCM Academy lists integrated production, AI music production, and advanced mixing and mastering courses with their duration, modules, and current listed fee.",
  },
];

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".section-reveal").forEach((elem) => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: "top 88%", once: true },
          opacity: 0, y: 42, duration: 0.85, ease: "power3.out",
        });
      });
    });
    return () => media.revert();
  }, { scope: container });

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 424 : 304;
      sliderRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div ref={container} className="w-full overflow-hidden">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": ["WebPage", "FAQPage"],
          "@id": absoluteUrl("/#webpage"),
          url: siteConfig.url,
          name: "Middle Class Musicians — recording studio in Uttam Nagar, New Delhi",
          description: siteConfig.description,
          isPartOf: { "@id": absoluteUrl("/#website") },
          about: { "@id": absoluteUrl("/#studio") },
          inLanguage: "en-IN",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      
      <HeroCarousel />
      <GoogleReviews />

      {/* ECOSYSTEM FUNNEL */}
      <section className="py-32 relative bg-[#07070a]">
        <div className="container mx-auto px-6">
          <div className="section-reveal mb-20 text-center md:text-left">
            <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">01 / The Ecosystem</span>
            <h2 className="text-5xl md:text-7xl font-head leading-none">Everything you <em className="text-[#d4a857] not-italic text-glow">need.</em></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Services", desc: "Recording, Mixing, Mastering, and Custom Beat Production.", path: "/services" },
              { title: "Portfolio", desc: "Visuals, full tracks, and before/after mix comparisons.", path: "/portfolio" },
              { title: "Academy", desc: "Integrated Music Production & AI generation courses.", path: "/courses" }
            ].map((card, i) => (
              <Link href={card.path} key={i} data-sound="hover" className="section-reveal group p-10 rounded-3xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 box-glow-hover transition-all duration-500 ease-out hover:-translate-y-2 block relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4a857]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-4xl font-head mb-4 text-white group-hover:text-[#d4a857] transition-colors relative z-10">{card.title}</h3>
                <p className="text-gray-400 mb-10 text-sm leading-relaxed relative z-10">{card.desc}</p>
                <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-[#d4a857] transition-colors relative z-10">
                  Explore <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE PORTFOLIO SLIDER */}
      <section className="py-32 bg-[#0c0c10] border-y border-white/5">
        <div className="container mx-auto px-6 mb-12">
          <div className="section-reveal flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
            <div className="text-center md:text-left">
              <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">02 / Portfolio</span>
              <h2 className="text-5xl md:text-7xl font-head leading-none">Latest <em className="text-[#d4a857] not-italic text-glow">Visuals.</em></h2>
            </div>
            

          </div>
        </div>

        <div className="relative w-full">
          <button type="button" aria-label="Previous portfolio videos" onClick={() => scrollSlider("left")} className="carousel-control side-arrow left-2 sm:left-4">←</button>
          <button type="button" aria-label="Next portfolio videos" onClick={() => scrollSlider("right")} className="carousel-control side-arrow right-2 sm:right-4">→</button>
          <div className="absolute top-0 left-0 w-8 md:w-24 h-full bg-gradient-to-r from-[#0c0c10] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 md:w-24 h-full bg-gradient-to-l from-[#0c0c10] to-transparent z-10 pointer-events-none" />

          <div ref={sliderRef} className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-6 md:px-24 pb-12 pt-4 scrollbar-hide">
            {portfolioVideos.map((video, idx) => (
              <a key={idx} href={`https://youtu.be/${video.id}`} target="_blank" rel="noopener noreferrer" data-sound="click" className="snap-center group block relative w-[min(300px,82vw)] md:w-[450px] shrink-0 rounded-3xl overflow-hidden border border-white/5 bg-[#15151c] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out">
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }} alt={`${video.title} by ${video.artist} — music video`} fill sizes="(max-width: 767px) 300px, 450px" className="object-cover filter brightness-[0.7] saturate-50 group-hover:brightness-100 group-hover:saturate-100 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#d4a857] rounded-full flex items-center justify-center text-black scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out box-glow">▶</div>
                  </div>
                </div>
                <div className="p-6 border-t border-white/5">
                  <h4 className="font-head text-3xl text-white truncate group-hover:text-[#d4a857] transition-colors">{video.title}</h4>
                  <p className="font-body text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{video.artist}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32">
        <div className="container mx-auto px-6">
          <div className="section-reveal mb-14 max-w-2xl">
            <span className="eyebrow mb-4">03 / The Process</span>
            <h2 className="font-head text-5xl leading-none sm:text-7xl">From first message to <span className="text-gold text-glow">final master.</span></h2>
          </div>
          <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Define", "Share the song, reference, service, and result you need."],
              ["02", "Prepare", "Confirm the session plan so creative time is not lost on setup."],
              ["03", "Create", "Record or produce with focused feedback while decisions are fresh."],
              ["04", "Refine", "Move through mix and master decisions toward the approved final."],
            ].map(([number, title, copy]) => (
              <li key={number} className="section-reveal bg-[#15151c] p-7 sm:p-8">
                <span className="mb-12 block font-mono text-xs text-gold">{number}</span>
                <h3 className="mb-3 font-head text-3xl">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <VideoTestimonials />

      <section className="border-y border-white/5 bg-[#0c0c10] py-24 sm:py-32" id="frequently-asked-questions">
        <div className="container mx-auto grid gap-14 px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div className="section-reveal lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow mb-4">04 / Direct Answers</span>
            <h2 className="font-head text-5xl leading-none sm:text-7xl">Before you <span className="text-gold text-glow">book.</span></h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-400">
              Clear answers for artists comparing recording studios in Delhi. If your question is specific to a project, send the brief directly.
            </p>
          </div>
          <div className="section-reveal divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group py-6" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-head text-2xl text-white marker:content-none sm:text-3xl">
                  <span>{faq.question}</span>
                  <span className="mt-1 text-gold transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pr-10 pt-4 text-sm leading-7 text-gray-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
