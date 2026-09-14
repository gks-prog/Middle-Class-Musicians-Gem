import PortfolioContent from "@/components/portfolio/PortfolioContent";
import { getPublicContent } from "@/lib/cms/server";
export const revalidate = 60;
export default async function PortfolioPage() {
  const content = await getPublicContent();
  if (!content.sections.portfolio) return <div className="container mx-auto min-h-screen px-6 py-36"><h1 className="font-head text-5xl">Portfolio</h1><p className="mt-6 text-gray-400">New work will be shared here.</p></div>;
  return <PortfolioContent songs={content.songs} />;
}
