import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const routes = [
  "",
  "/studio",
  "/services",
  "/portfolio",
  "/blogs",
  "/blogs/rappers",
  "/blogs/producers",
  "/courses",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: absoluteUrl(route || "/"),
    lastModified: new Date(),
    changeFrequency: route.startsWith("/blogs") ? "monthly" : "weekly",
    priority: index === 0 ? 1 : route === "/services" || route === "/portfolio" ? 0.9 : 0.7,
  }));
}
