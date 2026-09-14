import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getPublicContent } from "@/lib/cms/server";
export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getPublicContent();
  const routes = ["/", "/studio", "/services", "/courses", ...(content.sections.portfolio ? ["/portfolio"] : []), ...(content.sections.blogs ? ["/blogs", "/blogs/rappers", "/blogs/producers"] : [])];
  return [
    ...routes.map(route => ({ url: absoluteUrl(route), changeFrequency: "weekly" as const, priority: route === "/" ? 1 : 0.7 })),
    ...(content.sections.blogs ? content.blogs.map(article => ({ url: absoluteUrl("/blogs/" + article.slug), changeFrequency: "monthly" as const, priority: 0.6 })) : []),
  ];
}
