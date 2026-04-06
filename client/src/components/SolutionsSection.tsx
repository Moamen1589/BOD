import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

const DIGITAL_SOLUTION_LINKS_API_URL =
  "https://gold-weasel-489740.hostingersite.com/api/digital-solution-links";

type ApiDigitalSolutionLink = {
  id: number;
  label: string;
  label_en: string | null;
  url: string;
  open_in_new_tab: boolean;
  sort_order: number;
  is_active: boolean;
};

type ApiDigitalSolutionLinksResponse = {
  success: boolean;
  data: ApiDigitalSolutionLink[];
};

export function SolutionsSection() {
  const header = useScrollAnimation();
  const grid = useScrollAnimation();
  const [items, setItems] = useState<ApiDigitalSolutionLink[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadLinks = async () => {
      try {
        const res = await fetch(DIGITAL_SOLUTION_LINKS_API_URL);
        if (!res.ok) return;

        const payload = (await res.json()) as ApiDigitalSolutionLinksResponse;
        const sorted = (payload.data || [])
          .filter((item) => item.is_active)
          .sort((a, b) => a.sort_order - b.sort_order);

        if (isMounted) {
          setItems(sorted);
        }
      } catch {
        if (isMounted) {
          setItems([]);
        }
      }
    };

    loadLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="solutions" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div
          ref={header.ref}
          className={`text-center mb-16 scroll-hidden ${header.isVisible ? "scroll-visible" : ""}`}
        >
          <span
            className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md"
            data-testid="badge-solutions"
          >
            الحلول الرقمية
          </span>
          <h2
            className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4"
            data-testid="text-solutions-title"
          >
            الحلول الرقمية المتكاملة
          </h2>
          <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
            منصات وأدوات رقمية مبتكرة لدعم المنظمات غير الربحية
          </p>
        </div>

        <div
          ref={grid.ref}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`relative rounded-md p-6 bg-brand-gold/10 border border-gray-100 hover:shadow-md transition-shadow scroll-hidden stagger-${i + 1} ${grid.isVisible ? "scroll-visible" : ""}`}
              data-testid={`solution-card-${item.id}`}
            >
              <div className="w-12 h-12 rounded-md flex items-center justify-center mb-4 bg-brand-gold/20">
                <span className="font-almarai font-extrabold text-xs text-brand-gold-dark">
                  رابط
                </span>
              </div>
              <h4 className="font-almarai font-bold text-lg text-brand-dark mb-2">
                {item.label}
              </h4>
              <p className="font-almarai text-brand-gray text-sm leading-relaxed mb-4">
                {item.label_en || item.url}
              </p>
              {item.url && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="font-almarai text-brand-gold-dark p-0 h-auto gap-1"
                >
                  <a
                    href={item.url}
                    target={item.open_in_new_tab ? "_blank" : "_self"}
                    rel={
                      item.open_in_new_tab ? "noopener noreferrer" : undefined
                    }
                    data-testid={`link-solution-${item.id}`}
                  >
                    زيارة المنصة
                    <ExternalLink size={14} />
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center mt-8 font-almarai text-brand-gray">
            لا توجد روابط حلول رقمية متاحة حاليا
          </p>
        )}
      </div>
    </section>
  );
}
