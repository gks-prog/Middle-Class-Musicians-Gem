export const siteConfig = {
  name: "Middle Class Musicians",
  shortName: "MCM Studio",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://middleclassmusicians.in",
  description:
    "Middle Class Musicians in Uttam Nagar, New Delhi: recording, music production, mixing and mastering, custom beats, courses, artist management and video production.",
  phoneDisplay: "+91 93157 78147",
  phoneE164: "+919315778147",
  whatsapp: "https://wa.me/919315778147",
  instagram: "https://instagram.com/middleclassmusicians",
  maps: "https://maps.app.goo.gl/47Ez6RdTwQ1ZUizU7",
  googleReviews: "https://share.google/2ig5EfQ69dRmQu5qb",
  address: {
    locality: "Uttam Nagar",
    city: "New Delhi",
    region: "Delhi",
    postalCode: "110059",
    country: "IN",
  },
} as const;

export const absoluteUrl = (path = "/") => new URL(path, siteConfig.url).toString();
