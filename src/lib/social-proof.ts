import content from "@/content/social-proof.json";

export type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  dateLabel: string;
  sourceScreenshot: string;
  sourceUrl: string;
};

export type VideoTestimonial = {
  clientName: string;
  title: string;
  videoSrc: string;
  poster: string;
  captionsSrc: string;
  transcript: string;
};

// Only add verified Google review text and permission-cleared client videos.
// No sample reviews, made-up ratings or portfolio videos used as testimonials.
export const googleReviews: GoogleReview[] = content.reviews;
export const videoTestimonials: VideoTestimonial[] = content.testimonials;
