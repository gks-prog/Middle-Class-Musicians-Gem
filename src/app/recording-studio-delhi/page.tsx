import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recording Studio in Nawada, Delhi",
  description: "Middle Class Musicians is a recording and music production studio in Nawada, Delhi offering recording, mixing, mastering, beat production and music courses.",
  alternates: { canonical: "/recording-studio-delhi" },
};

const faqs = [
  { question: "Where is Middle Class Musicians located?", answer: "The studio is based in Nawada, Delhi. Use the verified map link below for directions before travelling." },
  { question: "Which studio services are available?", answer: "The studio offers recording, mixing, mastering, beat production, video production and music courses. Confirm the exact scope and availability before booking." },
  { question: "How do I request a session?", answer: "Create an account and request a preferred date and time through the client portal. A request becomes final only after the studio confirms availability." },
  { question: "What equipment is available?", answer: "The current setup includes a Rode NT1-A microphone, Steinberg UR22mk2 interface and Yamaha HS8 monitors." },
];

export default function RecordingStudioDelhiPage() {
  return <div className="pt-32 pb-28 min-h-screen">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }) }} />
    <section className="container mx-auto px-6 max-w-5xl">
      <p className="text-xs uppercase tracking-[.25em] text-[#d4a857] mb-4">Nawada · Delhi</p>
      <h1 className="font-head text-6xl md:text-8xl leading-[.9] max-w-4xl">Recording studio for artists who need clarity, not confusion.</h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-400">Middle Class Musicians provides recording, mixing, mastering and production services from Nawada, Delhi. Review the available services, then request a slot through the portal without assuming the time is confirmed.</p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4"><Link href="/dashboard" className="rounded-full bg-[#d4a857] px-7 py-4 text-center font-bold text-black hover:bg-white">Request a booking</Link><a href="https://maps.app.goo.gl/47Ez6RdTwQ1ZUizU7" target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-7 py-4 text-center font-bold text-white hover:border-[#d4a857]">Open verified map ↗</a></div>

      <div className="grid md:grid-cols-3 gap-5 mt-24">
        {[['Recording & Mixing', 'Capture vocals and develop the record through the mixing stage.'], ['Production', 'Custom beat production and song-development support.'], ['Learning', 'Music production and AI-assisted music courses.']].map(([title, text]) => <div key={title} className="rounded-2xl border border-white/5 bg-[#15151c] p-6"><h2 className="font-head text-3xl text-[#d4a857]">{title}</h2><p className="mt-3 text-sm leading-relaxed text-gray-500">{text}</p></div>)}
      </div>

      <section className="mt-24"><p className="text-xs uppercase tracking-[.25em] text-[#d4a857] mb-3">Before you visit</p><h2 className="font-head text-5xl">Local studio information</h2><div className="mt-8 grid md:grid-cols-2 gap-4 text-sm text-gray-400"><div className="rounded-2xl border border-white/5 p-5"><strong className="block text-white mb-2">Location</strong>Nawada, Delhi. Open the verified map link for the precise route.</div><div className="rounded-2xl border border-white/5 p-5"><strong className="block text-white mb-2">Session status</strong>Portal submissions are requests. Travel only after receiving confirmation.</div></div></section>

      <section className="mt-24"><p className="text-xs uppercase tracking-[.25em] text-[#d4a857] mb-3">Questions</p><h2 className="font-head text-5xl mb-8">Studio FAQ</h2><div className="space-y-3">{faqs.map((faq) => <details key={faq.question} className="rounded-2xl border border-white/5 bg-[#15151c] p-5"><summary className="cursor-pointer font-bold text-white">{faq.question}</summary><p className="mt-3 text-sm leading-relaxed text-gray-400">{faq.answer}</p></details>)}</div></section>
    </section>
  </div>;
}
