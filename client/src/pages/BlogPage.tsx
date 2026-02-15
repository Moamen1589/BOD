import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@shared/schema";

const categories = [
  { key: "all", label: "الكل" },
  { key: "news", label: "أخبار" },
  { key: "article", label: "مقالات" },
  { key: "newsletter", label: "نشرات بريدية" },
];

const categoryLabels: Record<string, string> = {
  news: "خبر",
  article: "مقال",
  newsletter: "نشرة بريدية",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: posts, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/blog", activeCategory],
    queryFn: async () => {
      const url = activeCategory === "all" ? "/api/blog" : `/api/blog?category=${activeCategory}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md" data-testid="badge-blog-page">
              المدونة
            </span>
            <h1 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-blog-page-title">
              الأخبار والمقالات والنشرات
            </h1>
            <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
              آخر الأخبار والمقالات المتخصصة والنشرات البريدية من ولادة حلم
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-md font-almarai text-sm font-bold transition-colors ${
                  activeCategory === cat.key
                    ? "bg-brand-gold text-white"
                    : "bg-brand-light-gold text-brand-gold-dark hover:bg-brand-gold/20"
                }`}
                data-testid={`button-filter-${cat.key}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 rounded-md" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts?.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div
                    className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                    data-testid={`card-blog-${post.slug}`}
                  >
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs">
                          {categoryLabels[post.category] || post.category}
                        </Badge>
                        {post.publishDate && (
                          <span className="font-almarai text-xs text-brand-gray/60">{post.publishDate}</span>
                        )}
                      </div>
                      <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">{post.title}</h3>
                      <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && posts?.length === 0 && (
            <p className="text-center text-muted-foreground py-12 font-almarai text-lg">لا توجد منشورات في هذا التصنيف</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
