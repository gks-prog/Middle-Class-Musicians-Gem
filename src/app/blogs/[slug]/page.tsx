import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicContent } from "@/lib/cms/server";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";
import StructuredData from "@/components/global/StructuredData";
export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const content = await getPublicContent();
  const article = content.sections.blogs ? content.blogs.find(row => row.slug === slug) : undefined;
  if (!article) return { title: "Article not found", robots: { index: false, follow: false } };
  return createPageMetadata({ title: article.title, description: article.excerpt, path: "/blogs/" + article.slug });
}
export default async function BlogArticle({ params }: Props) {
  const { slug } = await params;
  const content = await getPublicContent();
  const article = content.sections.blogs ? content.blogs.find(row => row.slug === slug) : undefined;
  if (!article) notFound();
  return <article className="container mx-auto min-h-screen max-w-3xl px-6 pb-28 pt-32">
    <StructuredData data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description: article.excerpt, url: absoluteUrl("/blogs/" + article.slug), mainEntityOfPage: absoluteUrl("/blogs/" + article.slug), author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url }, publisher: { "@id": absoluteUrl("/#studio") }, ...(article.date ? { datePublished: article.date } : {}) }} />
    <Link href="/blogs" className="mb-10 inline-block text-sm text-gold">← Back to Journal</Link>
    <p className="eyebrow mb-4">For {article.category}</p>
    <h1 className="font-head text-4xl leading-tight sm:text-6xl">{article.title}</h1>
    {article.date && <time dateTime={article.date} className="mt-5 block text-sm text-gray-500">{article.date}</time>}
    <div className="mt-10 space-y-6 text-base leading-8 text-gray-300">{article.content.split(/\n\s*\n/).map((paragraph, index) => <p key={index} className="whitespace-pre-line">{paragraph}</p>)}</div>
  </article>;
}
