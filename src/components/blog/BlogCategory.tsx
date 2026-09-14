import Link from "next/link";
import { getPublicContent } from "@/lib/cms/server";
export default async function BlogCategory({ category }: { category: "rappers" | "producers" }) {
  const content = await getPublicContent();
  const articles = content.sections.blogs ? content.blogs.filter(article => article.category === category) : [];
  return <div className="container mx-auto min-h-screen max-w-4xl px-6 pb-32 pt-32">
    <Link href="/blogs" className="mb-12 inline-block text-sm text-gold">← Back to Journal</Link>
    <h1 className="mb-12 font-head text-5xl sm:text-7xl">The <span className="text-gold">{category === "rappers" ? "Rapper’s" : "Producer’s"}</span> Guide.</h1>
    <div className="space-y-12">{articles.map((article, index) => <article key={article.id} id={"answer-" + (index + 1)} className="border-l-2 border-gold/30 py-2 pl-6 sm:pl-10"><h2 className="mb-4 font-head text-3xl"><Link href={"/blogs/" + article.slug}>{article.title}</Link></h2><p className="whitespace-pre-line leading-7 text-gray-400">{article.content}</p></article>)}</div>
    {!articles.length && <p className="mt-8 text-gray-400">New articles will be shared here.</p>}
  </div>;
}
