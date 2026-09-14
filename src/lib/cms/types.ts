export type Song = { id: string; title: string; raw: string; final: string };
export type Visual = { id: string; title: string; artist: string };
export type Review = { id: string; author: string; rating: number; text: string; sourceUrl: string; dateLabel: string; sourceScreenshot: string };
export type Testimonial = { id: string; title: string; videoSrc: string };
export type Blog = { id: string; slug: string; title: string; excerpt: string; content: string; category: "rappers" | "producers"; date: string };
export type StudioContent = {
  sections: { hero: boolean; reviews: boolean; ecosystem: boolean; visuals: boolean; process: boolean; testimonials: boolean; faq: boolean; portfolio: boolean; blogs: boolean };
  songs: Song[]; visuals: Visual[]; reviews: Review[]; testimonials: Testimonial[]; blogs: Blog[];
};
export type Snapshot = { data: StudioContent; version: number };
