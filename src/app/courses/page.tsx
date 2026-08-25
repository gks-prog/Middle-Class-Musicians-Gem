"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import StructuredData from "@/components/global/StructuredData";
import { siteConfig } from "@/lib/site";

export default function CoursesPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".gsap-reveal", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
    );

    gsap.fromTo(".course-card", 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", delay: 0.4 }
    );
  }, { scope: container });

  const courses = [
    {
      title: "Integrated Production",
      duration: "3 Months",
      price: "₹25,000",
      desc: "The complete pipeline. Go from zero to creating industry-standard tracks ready for Spotify.",
      features: ["Music Theory Basics", "DAW Mastery (FL/Ableton)", "Arrangement & Structuring", "Vocal Recording Techniques"],
      popular: true
    },
    {
      title: "AI Music Production",
      duration: "1 Month",
      price: "₹10,000",
      desc: "Leverage the future. Learn to use generative AI for vocal transformation, sampling, and stems.",
      features: ["Prompt Engineering for Audio", "Voice-Swap.ai Workflows", "Suno Generative Loops", "Cleanvoice Editing"],
      popular: false
    },
    {
      title: "Advanced Mix & Master",
      duration: "2 Months",
      price: "₹18,000",
      desc: "For existing producers. Achieve commercial loudness and width on par with industry hits.",
      features: ["Advanced EQ & Compression", "Spatial Processing", "Analog Emulation", "Mastering Chains"],
      popular: false
    }
  ];

  return (
    <div ref={container} className="pt-32 pb-20 container mx-auto px-6">
      <StructuredData data={courses.map((course) => ({
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.desc,
        provider: {
          "@type": "Organization",
          name: "MCM Academy",
          sameAs: siteConfig.url,
        },
        timeRequired: `P${course.duration.split(" ")[0]}M`,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: course.price.replace(/[^0-9]/g, ""),
          availability: "https://schema.org/InStock",
          url: `${siteConfig.url}/courses`,
        },
      }))} />
      
      <div className="text-center mb-24 max-w-3xl mx-auto">
        <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4 gsap-reveal">MCM Academy</span>
        <h1 className="text-5xl md:text-7xl font-head leading-none mb-6 gsap-reveal">Master Your <span className="text-[#d4a857]">Craft.</span></h1>
        <p className="text-gray-400 text-lg gsap-reveal">Build a structured production workflow with guided practice, direct feedback, and modules organised around complete records—not disconnected tutorials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {courses.map((course, idx) => (
          <div key={idx} className={`course-card relative p-8 rounded-3xl bg-[#15151c] flex flex-col h-full border ${course.popular ? "border-[#d4a857]" : "border-white/10"}`}>
            {course.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#d4a857] text-black text-xs font-bold uppercase tracking-widest rounded-full">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <p className="text-gray-400 font-semibold uppercase tracking-widest text-xs mb-2">{course.duration}</p>
              <h3 className="text-3xl font-head mb-4">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-6">{course.desc}</p>
              <div className="text-4xl font-head text-[#d4a857]">{course.price}</div>
            </div>

            <div className="flex-grow">
              <ul className="space-y-4 mb-8">
                {course.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="text-[#d4a857] shrink-0">✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <a href="https://wa.me/919315778147?text=Hi! I am interested in the MCM Academy courses." target="_blank" rel="noopener noreferrer" className={`w-full py-4 text-center rounded-xl font-bold uppercase tracking-widest text-sm transition-colors ${course.popular ? "bg-[#d4a857] text-black hover:bg-white" : "bg-white/5 text-white hover:bg-[#d4a857] hover:text-black"}`}>
              Enroll Now
            </a>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-6 text-gray-500">
        Course fees and modules shown here are the current website listing. Confirm the next batch, schedule, seat availability, and payment terms with MCM Academy before enrolling.
      </p>
    </div>
  );
}
