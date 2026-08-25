import Link from "next/link";
import { siteConfig } from "@/lib/site";

const services = [
  {
    number: "01",
    title: "Vocal Recording",
    description: "A focused recording session for lead vocals, doubles, harmonies, and ad-libs with an engineer handling the technical flow.",
    includes: ["Session setup", "Vocal tracking", "Comping direction", "Clean session files"],
    bestFor: "Rappers, singers, voice artists",
    message: "Hi MCM, I want to book a vocal recording session.",
  },
  {
    number: "02",
    title: "Mixing & Mastering",
    description: "Balance, tone, dynamics, depth, and final loudness shaped around the song—not a one-chain preset applied to every record.",
    includes: ["Vocal editing", "Mix balance", "Creative processing", "Final master"],
    bestFor: "Recorded songs that need a release-ready finish",
    message: "Hi MCM, I want to discuss mixing and mastering my song.",
  },
  {
    number: "03",
    title: "Beat Production",
    description: "Custom production developed around the artist's voice, writing, references, and intended energy rather than a generic catalogue beat.",
    includes: ["Creative direction", "Arrangement", "Sound selection", "Production stems"],
    bestFor: "Artists building an original sonic identity",
    message: "Hi MCM, I want a custom beat for my project.",
  },
  {
    number: "04",
    title: "Songwriting Support",
    description: "Practical help with hooks, verses, flow, structure, and performance choices while keeping the artist's own language and point of view intact.",
    includes: ["Song structure", "Hook development", "Flow refinement", "Performance notes"],
    bestFor: "Ideas that need structure before recording",
    message: "Hi MCM, I want songwriting and arrangement support.",
  },
];

export default function ServicesPage() {
  return (
    <div className="pb-24 pt-32 sm:pb-32 sm:pt-40">
      <section className="container mx-auto px-6">
        <div className="grid items-end gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="eyebrow mb-5">Studio Services</span>
            <h1 className="max-w-5xl font-head text-6xl leading-[0.9] sm:text-8xl lg:text-9xl">
              Build the song. <span className="text-gold text-glow">Finish the record.</span>
            </h1>
          </div>
          <p className="max-w-lg text-sm leading-7 text-gray-400 lg:justify-self-end lg:text-base">
            Choose the stage your project actually needs. If the problem is unclear, send the current demo first; the right service should follow the bottleneck, not the biggest package.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 sm:py-24" aria-labelledby="service-list-title">
        <h2 id="service-list-title" className="sr-only">Available studio services</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#15151c] p-7 transition duration-500 hover:-translate-y-1 hover:border-gold/50 sm:p-10">
              <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-gold/5 blur-3xl transition group-hover:bg-gold/10" />
              <div className="relative">
                <div className="mb-10 flex items-center justify-between">
                  <span className="font-mono text-xs text-gold">{service.number}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-right text-[9px] font-bold uppercase tracking-widest text-gray-500">{service.bestFor}</span>
                </div>
                <h3 className="mb-4 font-head text-4xl text-white transition group-hover:text-gold sm:text-5xl">{service.title}</h3>
                <p className="max-w-xl text-sm leading-7 text-gray-400">{service.description}</p>
                <ul className="my-8 grid grid-cols-2 gap-3 border-y border-white/5 py-6 text-xs text-gray-300">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2"><span className="text-gold" aria-hidden="true">+</span>{item}</li>
                  ))}
                </ul>
                <a
                  href={`${siteConfig.whatsapp}?text=${encodeURIComponent(service.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-3 text-xs font-bold uppercase tracking-widest text-white transition hover:text-gold"
                >
                  Discuss this service <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0c0c10] py-20 sm:py-24">
        <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="eyebrow mb-4">Choose by bottleneck</span>
            <h2 className="font-head text-5xl leading-none sm:text-7xl">What is stopping the song?</h2>
          </div>
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {[
              ["The performance is not captured", "Start with vocal recording."],
              ["The vocal and beat feel disconnected", "Start with mixing."],
              ["The track is mixed but not release-ready", "Start with mastering."],
              ["The idea has no original musical foundation", "Start with beat production."],
              ["The writing has energy but no structure", "Start with songwriting support."],
            ].map(([problem, answer]) => (
              <div key={problem} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:gap-8">
                <dt className="text-sm text-gray-400">{problem}</dt>
                <dd className="text-sm font-bold text-white">{answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container mx-auto px-6 pt-20 text-center sm:pt-24">
        <span className="eyebrow mb-4">Need proof before a decision?</span>
        <h2 className="mx-auto mb-8 max-w-3xl font-head text-5xl leading-none sm:text-7xl">Compare the raw take with the <span className="text-gold">final mix.</span></h2>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/portfolio" className="button-primary">Hear the Portfolio</Link>
          <a href={`${siteConfig.whatsapp}?text=Hi%20MCM%2C%20I%20am%20not%20sure%20which%20service%20my%20song%20needs.`} target="_blank" rel="noopener noreferrer" className="button-secondary">Ask the Studio</a>
        </div>
      </section>
    </div>
  );
}
