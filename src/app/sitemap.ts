import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return ["", "/studio", "/services", "/portfolio", "/courses", "/blogs", "/blogs/rappers", "/blogs/producers", "/recording-studio-delhi"].map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : path === "/recording-studio-delhi" ? 0.9 : 0.7,
  }));
}
