import HomeContent from "@/components/home/HomeContent";
import { getPublicContent } from "@/lib/cms/server";
export const revalidate = 60;
export default async function HomePage() { return <HomeContent content={await getPublicContent()} />; }
