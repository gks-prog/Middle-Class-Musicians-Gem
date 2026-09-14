import BlogCategory from "@/components/blog/BlogCategory";
export const revalidate = 60;
export default function CategoryPage() { return <BlogCategory category="producers" />; }
