import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import type { Service, Article } from "@shared/schema";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: [`/api/services/${slug}`],
  });

  const { data: articles } = useQuery<Article[]>({
    queryKey: [`/api/services/${slug}/articles`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16 container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-full max-w-xl mb-8" />
          <Skeleton className="h-40 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-almarai font-extrabold text-3xl text-brand-dark mb-4">الخدمة غير موجودة</h1>
          <Link href="/services">
            <Button className="bg-brand-gold text-white font-almarai gap-2">
              <ArrowRight size={16} />
              العودة للخدمات
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const deliverables = (service.deliverables as string[]) || [];

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/services">
              <span className="inline-flex items-center gap-1 text-brand-gold-dark font-almarai text-sm font-bold cursor-pointer" data-testid="link-back-services">
                <ArrowRight size={14} />
                العودة للخدمات
              </span>
            </Link>
          </div>

          <div className="max-w-4xl">
            <h1 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mb-6" data-testid="text-service-title">
              {service.title}
            </h1>
            <p className="font-almarai text-brand-gray text-lg leading-relaxed mb-10" data-testid="text-service-description">
              {service.description}
            </p>

            {deliverables.length > 0 && (
              <div className="bg-brand-light-gold/50 rounded-md p-8 mb-10 border border-brand-gold/10">
                <h2 className="font-almarai font-bold text-xl text-brand-dark mb-6" data-testid="text-deliverables-title">
                  مخرجات الخدمة
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-3" data-testid={`deliverable-${i}`}>
                      <CheckCircle2 size={18} className="text-brand-gold-dark mt-0.5 shrink-0" />
                      <span className="font-almarai text-brand-dark/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center mb-10">
              <Button asChild size="lg" className="bg-brand-gold text-white font-almarai rounded-lg px-8 font-bold gap-2">
                <a href="/#contact" data-testid="button-service-cta">
                  اطلب هذه الخدمة
                  <ArrowLeft size={18} />
                </a>
              </Button>
            </div>
          </div>

          {articles && articles.length > 0 && (
            <div className="mt-16">
              <h2 className="font-almarai font-extrabold text-2xl text-brand-dark mb-8" data-testid="text-related-articles">
                دراسات حالة مرتبطة
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`}>
                    <div
                      className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
