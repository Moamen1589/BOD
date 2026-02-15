import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download } from "lucide-react";
import type { WorkItem } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  "strategic-planning": "خطة استراتيجية",
  "procedural-guides": "دليل إجرائي",
  "annual-plans": "خطة سنوية",
  "community-initiatives": "مبادرة مجتمعية",
  "motion-graphics": "موشن جرافيك",
};

export default function WorkItemDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: item, isLoading } = useQuery<WorkItem>({
    queryKey: ["/api/work-library", slug],
    queryFn: async () => {
      const res = await fetch(`/api/work-library/${slug}`);
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

  if (!item) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-almarai font-extrabold text-3xl text-brand-dark mb-4">العمل غير موجود</h1>
          <Link href="/work-library">
            <Button className="bg-brand-gold text-white font-almarai gap-2">
              <ArrowRight size={16} />
              العودة لمكتبة الأعمال
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
            <Link href="/work-library">
              <span className="inline-flex items-center gap-1 text-brand-gold-dark font-almarai text-sm font-bold cursor-pointer" data-testid="link-back-work-library">
                <ArrowRight size={14} />
                العودة لمكتبة الأعمال
              </span>
            </Link>
          </div>

          <article className="max-w-3xl">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} className="w-full h-64 md:h-80 object-cover rounded-md mb-8" data-testid="img-work-cover" />
            )}

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai">
                {categoryLabels[item.category] || item.category}
              </Badge>
            </div>

            <h1 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mb-6" data-testid="text-work-title">
              {item.title}
            </h1>

            <div className="font-almarai text-brand-dark/80 text-lg leading-relaxed whitespace-pre-line mb-8" data-testid="text-work-content">
              {item.content}
            </div>

            {item.fileUrl && (
              <div className="p-6 bg-brand-light-gold/50 rounded-md border border-brand-gold/10">
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-brand-gold text-white font-almarai gap-2" data-testid="button-download-file">
                    <Download size={16} />
                    تحميل الملف
                  </Button>
                </a>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
