export const siteConfig = {
  name: "Middle Class Musicians",
  shortName: "MCM Studio",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://middleclassmusicians.in",
  description:
    "Recording studio in Uttam Nagar, New Delhi for vocal recording, mixing, mastering, beat production, songwriting, and music production courses.",
  phoneDisplay: "+91 93157 78147",
  phoneE164: "+919315778147",
  whatsapp: "https://wa.me/919315778147",
  instagram: "https://instagram.com/middleclassmusicians",
  maps: "https://maps.app.goo.gl/47Ez6RdTwQ1ZUizU7",
  address: {
    locality: "Uttam Nagar",
    city: "New Delhi",
    region: "Delhi",
    postalCode: "110059",
    country: "IN",
  },
} as const;

export const absoluteUrl = (path = "/") => new URL(path, siteConfig.url).toString();
