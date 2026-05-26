"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ServicesPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".service-card", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: container });

  const services = [
    { title: "Recording", desc: "Pristine vocal chains and acoustically treated isolation." },
    { title: "Mixing & Mastering", desc: "Industry-standard dynamics, width, and volume." },
    { title: "Beat Production", desc: "Custom Drill, Phonk, and Rap instrumentals." },
    { title: "Songwriting", desc: "Lyrical structuring and flow design." }
  ];

  return (
    <div ref={container} className="pt-32 pb-20 container mx-auto px-6">
      <h1 className="text-6xl font-head text-center mb-16">Studio <span className="text-gold">Services</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-5xl mx-auto">
        {services.map((srv, i) => (
          <div key={i} className="service-card p-8 rounded-2xl bg-surface border border-white/10 hover:border-gold/50 transition-colors cursor-pointer group">
            <h3 className="text-2xl font-head mb-3 group-hover:text-gold transition-colors">{srv.title}</h3>
            <p className="text-gray-400 mb-6">{srv.desc}</p>
            <span className="text-sm font-semibold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Explore →</span>
          </div>
        ))}
      </div>

      <section className="max-w-4xl mx-auto text-center border-t border-white/10 pt-16">
        <h2 className="text-3xl font-head mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Fast Delivery", "Industry Quality", "Affordable Pricing", "Human Support"].map((item, i) => (
            <div key={i} className="p-4 bg-black rounded-lg border border-white/5 text-sm font-semibold text-gray-300">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
