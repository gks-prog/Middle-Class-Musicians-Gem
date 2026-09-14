import Link from "next/link";
import { getPublicContent } from "@/lib/cms/server";
export const revalidate = 60;
export default async function BlogsPage() {
  const content = await getPublicContent();
  const articles = content.sections.blogs ? content.blogs : [];
  return <div className="min-h-screen pb-32 pt-32">
    <section className="container mx-auto mb-16 max-w-3xl px-6 text-center"><span className="eyebrow mb-4">Insights & Knowledge</span><h1 className="mb-6 font-head text-5xl leading-none md:text-7xl">The MCM <span className="text-gold">Journal.</span></h1><p className="text-lg text-gray-400">Recording advice, production techniques, and practical ideas for your next session.</p></section>
    {content.sections.blogs && <div className="container mx-auto mb-12 flex max-w-5xl flex-wrap justify-center gap-4 px-6"><Link className="button-secondary" href="/blogs/rappers">For rappers</Link><Link className="button-secondary" href="/blogs/producers">For producers</Link></div>}
    <section className="container mx-auto max-w-5xl px-6" aria-label="Articles"><div className="grid gap-6 md:grid-cols-2">{articles.map(article => <Link key={article.id} href={"/blogs/" + article.slug} className="block rounded-3xl border border-white/10 bg-[#15151c] p-8 transition-colors hover:border-gold"><p className="eyebrow mb-4">For {article.category}</p><h2 className="mb-4 font-head text-3xl">{article.title}</h2><p className="mb-6 text-sm leading-7 text-gray-400">{article.excerpt}</p><span className="text-sm text-gold">Read article →</span></Link>)}</div>{!articles.length && <p className="py-16 text-center text-gray-400">New articles will be shared here.</p>}</section>
  </div>;
}
