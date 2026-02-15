import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from "@shared/schema";

export default function ArticlesPage() {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md" data-testid="badge-articles-page">
              أعمالنا
            </span>
            <h1 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-articles-page-title">
              دراسات حالة ومشاريع
            </h1>
            <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
              نماذج من مشاريعنا المنجزة مع شركائنا في القطاع غير الربحي
            </p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 rounded-md" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles?.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <div
                    className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full"
                    data-testid={`card-article-${article.slug}`}
                  >
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-5">
                      <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">{article.title}</h3>
                      <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                      {article.publishDate && (
                        <p className="font-almarai text-xs text-brand-gray/60 mt-3">{article.publishDate}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
