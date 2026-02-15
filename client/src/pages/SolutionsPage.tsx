import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { DigitalSolution } from "@shared/schema";

const types = [
  { key: "all", label: "الكل" },
  { key: "platform", label: "المنصات" },
  { key: "case-study", label: "دراسات الحالة" },
  { key: "publication", label: "الإصدارات" },
];

const typeLabels: Record<string, string> = {
  platform: "منصة",
  "case-study": "دراسة حالة",
  publication: "إصدار",
};

export default function SolutionsPage() {
  const [activeType, setActiveType] = useState("all");

  const { data: solutions, isLoading } = useQuery<DigitalSolution[]>({
    queryKey: ["/api/solutions", activeType],
    queryFn: async () => {
      const url = activeType === "all" ? "/api/solutions" : `/api/solutions?type=${activeType}`;
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
            <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md" data-testid="badge-solutions-page">
              حلولنا الرقمية
            </span>
            <h1 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-solutions-title">
              المنصات والحلول الرقمية
            </h1>
            <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
              منصات وحلول رقمية مبتكرة لتمكين القطاع غير الربحي
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {types.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveType(t.key)}
                className={`px-5 py-2 rounded-md font-almarai text-sm font-bold transition-colors ${
                  activeType === t.key
                    ? "bg-brand-gold text-white"
                    : "bg-brand-light-gold text-brand-gold-dark hover:bg-brand-gold/20"
                }`}
                data-testid={`button-filter-solution-${t.key}`}
              >
                {t.label}
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
              {solutions?.map((sol) => (
                <Link key={sol.id} href={`/solutions/${sol.slug}`}>
                  <div
                    className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                    data-testid={`card-solution-${sol.slug}`}
                  >
                    {sol.imageUrl && (
                      <img src={sol.imageUrl} alt={sol.title} className="w-full h-48 object-cover" loading="lazy" />
                    )}
                    {!sol.imageUrl && (
                      <div className="w-full h-48 bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 flex items-center justify-center">
                        <span className="font-almarai text-4xl text-brand-gold/30 font-bold">
                          {typeLabels[sol.solutionType] || sol.solutionType}
                        </span>
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs">
                          {typeLabels[sol.solutionType] || sol.solutionType}
                        </Badge>
                        {sol.link && <ExternalLink size={14} className="text-brand-gray/50" />}
                      </div>
                      <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">{sol.title}</h3>
                      <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-2 flex-1">{sol.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && solutions?.length === 0 && (
            <p className="text-center text-muted-foreground py-12 font-almarai text-lg">لا توجد حلول في هذا التصنيف</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
