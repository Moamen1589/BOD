import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Article } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  news: "خبر",
  article: "مقال",
  newsletter: "نشرة بريدية",
};

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<Article>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16 container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-64 w-full max-w-3xl mb-8" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-almarai font-extrabold text-3xl text-brand-dark mb-4">المنشور غير موجود</h1>
          <Link href="/blog">
            <Button className="bg-brand-gold text-white font-almarai gap-2">
              <ArrowRight size={16} />
              العودة للمدونة
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/blog">
              <span className="inline-flex items-center gap-1 text-brand-gold-dark font-almarai text-sm font-bold cursor-pointer" data-testid="link-back-blog">
                <ArrowRight size={14} />
                العودة للمدونة
              </span>
            </Link>
          </div>

          <article className="max-w-3xl">
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="w-full h-64 md:h-80 object-cover rounded-md mb-8" data-testid="img-blog-cover" />
            )}

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai">
                {categoryLabels[post.category] || post.category}
              </Badge>
              {post.publishDate && (
                <span className="font-almarai text-sm text-brand-gray">{post.publishDate}</span>
              )}
            </div>

            <h1 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mb-6" data-testid="text-blog-title">
              {post.title}
            </h1>

            <div className="font-almarai text-brand-dark/80 text-lg leading-relaxed whitespace-pre-line" data-testid="text-blog-content">
              {post.content}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
