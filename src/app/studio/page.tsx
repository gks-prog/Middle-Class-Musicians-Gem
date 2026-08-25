import { siteConfig } from "@/lib/site";

const gear = [
  { label: "Microphone", value: "RØDE NT1-A", detail: "Detailed vocal capture" },
  { label: "Interface", value: "Steinberg MkII", detail: "Clean recording workflow" },
  { label: "Monitoring", value: "Yamaha HS8", detail: "Full-range mix decisions" },
  { label: "Environment", value: "Treated Room", detail: "Controlled recording and monitoring" },
];

function Waveform({ reverse = false }: { reverse?: boolean }) {
  const bars = [18, 36, 62, 88, 48, 74, 100, 66, 42, 82, 58, 30, 52, 92, 70, 40, 64, 28];
  return (
    <div className={`flex h-36 items-center gap-1.5 opacity-60 ${reverse ? "flex-row-reverse" : ""}`} aria-hidden="true">
      {bars.map((height, index) => (
        <span key={index} className="w-full max-w-3 rounded-full bg-gradient-to-t from-gold/20 to-gold" style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

export default function StudioPage() {
  return (
    <div className="pb-24 pt-32 sm:pb-32 sm:pt-40">
      <section className="container mx-auto px-6 text-center">
        <span className="eyebrow mb-6">The Room · The Signal · The People</span>
        <h1 className="mx-auto max-w-6xl font-head text-6xl uppercase leading-[0.9] sm:text-8xl lg:text-9xl">
          Where creativity meets <span className="text-gold text-glow">industry sound.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
          A recording, production, and mixing environment in Uttam Nagar designed to keep the artist focused while the technical decisions stay controlled.
        </p>
      </section>

      <section className="container mx-auto px-6 py-20 sm:py-28" aria-label="Studio environment">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#15151c] p-8 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,168,87,0.16),transparent_52%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="eyebrow mb-3">01 / Record</span>
                <h2 className="font-head text-4xl sm:text-5xl">The vocal space</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-gray-400">A treated capture environment for lead vocals, doubles, ad-libs, harmonies, and voice work.</p>
              </div>
              <Waveform />
            </div>
          </article>
          <article className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0c10] p-8 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,168,87,0.12),transparent_52%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="eyebrow mb-3">02 / Decide</span>
                <h2 className="font-head text-4xl sm:text-5xl">The control position</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-gray-400">Monitoring and production decisions made with a consistent signal path and translation in mind.</p>
              </div>
              <Waveform reverse />
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0c0c10] py-20 sm:py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow mb-4">Core Signal Chain</span>
              <h2 className="font-head text-5xl leading-none sm:text-7xl">Tools with a job.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-gray-400">Equipment matters only when the room, gain staging, performance, and engineer decisions work together.</p>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {gear.map((item) => (
              <div key={item.label} className="bg-[#15151c] p-7 sm:p-8">
                <dt className="mb-8 text-[10px] font-bold uppercase tracking-[0.22em] text-gold">{item.label}</dt>
                <dd className="font-head text-3xl text-white">{item.value}</dd>
                <dd className="mt-2 text-xs leading-5 text-gray-500">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 text-center sm:py-28">
        <span className="eyebrow mb-4">The Architects</span>
        <h2 className="mb-12 font-head text-5xl sm:text-7xl">Creative direction meets execution.</h2>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-[#15151c] p-8 text-left sm:p-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-black font-head text-xl text-gold">WB</div>
            <h3 className="font-head text-3xl">Wenon Bont</h3>
            <p className="mb-5 mt-1 text-[10px] font-bold uppercase tracking-widest text-gold">Lead Producer / Composer</p>
            <p className="text-sm leading-7 text-gray-400">Hip-hop, phonk, and drill production with a focus on arrangement, impact, and a recognisable sonic identity.</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-[#15151c] p-8 text-left sm:p-10">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-black font-head text-xl text-gold">BN</div>
            <h3 className="font-head text-3xl">Bunny</h3>
            <p className="mb-5 mt-1 text-[10px] font-bold uppercase tracking-widest text-gold">Founder / Brand Strategist</p>
            <p className="text-sm leading-7 text-gray-400">Creative and commercial direction across the studio, artist presentation, and the wider Middle Class Musicians identity.</p>
          </article>
        </div>
      </section>

      <section className="container mx-auto px-6 text-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-[#15151c] px-6 py-14 sm:px-12 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(212,168,87,0.15),transparent_55%)]" />
          <div className="relative">
            <span className="eyebrow mb-4">Uttam Nagar · New Delhi</span>
            <h2 className="mx-auto mb-8 max-w-3xl font-head text-5xl leading-none sm:text-7xl">Bring the demo. Leave with a direction.</h2>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a href={`${siteConfig.whatsapp}?text=Hi%20MCM%2C%20I%20want%20to%20book%20a%20studio%20session.`} target="_blank" rel="noopener noreferrer" className="button-primary">Book Your Session</a>
              <a href={siteConfig.maps} target="_blank" rel="noopener noreferrer" className="button-secondary">Open Directions</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
