import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { DigitalSolution } from "@shared/schema";

const typeLabels: Record<string, string> = {
  platform: "منصة",
  "case-study": "دراسة حالة",
  publication: "إصدار",
};

export default function SolutionDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: solution, isLoading } = useQuery<DigitalSolution>({
    queryKey: ["/api/solutions", slug],
    queryFn: async () => {
      const res = await fetch(`/api/solutions/${slug}`);
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

  if (!solution) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-almarai font-extrabold text-3xl text-brand-dark mb-4">الحل غير موجود</h1>
          <Link href="/solutions">
            <Button className="bg-brand-gold text-white font-almarai gap-2">
              <ArrowRight size={16} />
              العودة للحلول الرقمية
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
            <Link href="/solutions">
              <span className="inline-flex items-center gap-1 text-brand-gold-dark font-almarai text-sm font-bold cursor-pointer" data-testid="link-back-solutions">
                <ArrowRight size={14} />
                العودة للحلول الرقمية
              </span>
            </Link>
          </div>

          <article className="max-w-3xl">
            {solution.imageUrl && (
              <img src={solution.imageUrl} alt={solution.title} className="w-full h-64 md:h-80 object-cover rounded-md mb-8" data-testid="img-solution-cover" />
            )}

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai">
                {typeLabels[solution.solutionType] || solution.solutionType}
              </Badge>
            </div>

            <h1 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mb-6" data-testid="text-solution-title">
              {solution.title}
            </h1>

            <div className="font-almarai text-brand-dark/80 text-lg leading-relaxed whitespace-pre-line mb-8" data-testid="text-solution-content">
              {solution.content}
            </div>

            {solution.link && (
              <div className="p-6 bg-brand-light-gold/50 rounded-md border border-brand-gold/10">
                <a href={solution.link} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-brand-gold text-white font-almarai gap-2" data-testid="button-visit-link">
                    <ExternalLink size={16} />
                    زيارة المنصة
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
