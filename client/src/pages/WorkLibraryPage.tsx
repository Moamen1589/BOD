import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import type { WorkItem } from "@shared/schema";

const PROCEDURAL_EVIDENCES_API_URL =
  "https://gold-weasel-489740.hostingersite.com/api/procedural-evidences";
const STRATEGIC_PLANS_API_URL =
  "https://gold-weasel-489740.hostingersite.com/api/strategic-plans";
const ANNUAL_PLANS_API_URL =
  "https://gold-weasel-489740.hostingersite.com/api/annual-plans";
const SOCIAL_INITIATIVES_API_URL =
  "https://gold-weasel-489740.hostingersite.com/api/social-initiatives";

const categories = [
  { key: "all", label: "جميع الأعمال" },
  { key: "strategic-planning", label: "الخطط الاستراتيجية" },
  { key: "procedural-guides", label: "الأدلة الإجرائية" },
  { key: "annual-plans", label: "الخطط السنوية" },
  { key: "community-initiatives", label: "المبادرات المجتمعية" },
  { key: "motion-graphics", label: "الموشن جرافيك" },
];

const categoryLabels: Record<string, string> = {
  "strategic-planning": "خطة استراتيجية",
  "procedural-guides": "دليل إجرائي",
  "annual-plans": "خطة سنوية",
  "community-initiatives": "مبادرة مجتمعية",
  "motion-graphics": "موشن جرافيك",
};

type WorkCategory = WorkItem["category"];

interface ProceduralEvidenceApiItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content_text: string | null;
  link: string | null;
  image_url: string | null;
  date: string | null;
  modified: string | null;
  published_at: string | null;
}

interface AnnualPlanApiItem {
  id: number;
  post_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_text: string | null;
  link: string | null;
  featured_image: {
    url: string;
  };
  content_image_1: {
    url: string;
  };
  published_at: string | null;
}

interface StrategicPlanApiItem {
  id: number;
  post_id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content_text: string | null;
  image_url: string | null;
  content_image_1: string | null;
  content_image_2: string | null;
  published_at: string | null;
}

interface SocialInitiativeApiItem {
  id: number;
  post_id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content_text: string | null;
  image_url: string | null;
  content_image_1: string | null;
  link: string | null;
  post_date: string | null;
  post_modified: string | null;
  created_at: string | null;
}

interface ProceduralEvidencesPageResponse {
  current_page: number;
  data: ProceduralEvidenceApiItem[];
  last_page: number;
}

interface AnnualPlansPageResponse {
  data: AnnualPlanApiItem[];
  meta: {
    current_page: number;
    last_page: number;
  };
}

interface StrategicPlansPageResponse {
  data: StrategicPlanApiItem[];
  meta: {
    current_page: number;
    last_page: number;
  };
}

interface SocialInitiativesPageResponse {
  data: SocialInitiativeApiItem[];
  meta?: {
    current_page: number;
    last_page: number;
  };
  current_page?: number;
  last_page?: number;
}

interface WorkLibraryCardItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: WorkCategory;
  imageUrl: string | null;
  externalLink: string | null;
  createdAt: string;
}

interface WorkLibraryQueryResult {
  items: WorkLibraryCardItem[];
  currentPage: number;
  lastPage: number;
}

function toWorkCardItem(item: ProceduralEvidenceApiItem): WorkLibraryCardItem {
  return {
    id: item.id,
    slug: item.slug || `case-study-${item.id}`,
    title: item.title,
    description: item.excerpt || item.content_text || "",
    // This endpoint is dedicated to procedural guides only.
    category: "procedural-guides",
    imageUrl: item.image_url || null,
    externalLink: item.link || null,
    createdAt: item.published_at || item.date || item.modified || "",
  };
}

function toAnnualPlanCardItem(item: AnnualPlanApiItem): WorkLibraryCardItem {
  return {
    id: item.id,
    slug: item.slug || `annual-plan-${item.id}`,
    title: item.title,
    description: item.excerpt || item.content_text || "",
    category: "annual-plans",
    imageUrl: item.featured_image?.url || item.content_image_1?.url || null,
    externalLink: item.link || null,
    createdAt: item.published_at || "",
  };
}

function toStrategicPlanCardItem(
  item: StrategicPlanApiItem,
): WorkLibraryCardItem {
  return {
    id: item.id,
    slug: item.slug || `strategic-plan-${item.id}`,
    title: item.title,
    description: item.excerpt || item.content_text || "",
    category: "strategic-planning",
    imageUrl:
      item.image_url || item.content_image_1 || item.content_image_2 || null,
    externalLink: null,
    createdAt: item.published_at || "",
  };
}

function toSocialInitiativeCardItem(
  item: SocialInitiativeApiItem,
): WorkLibraryCardItem {
  return {
    id: item.id,
    slug: item.slug || `community-initiative-${item.id}`,
    title: item.title,
    description: item.excerpt || item.content_text || "",
    category: "community-initiatives",
    imageUrl: item.image_url || item.content_image_1 || null,
    externalLink: item.link || null,
    createdAt: item.created_at || item.post_date || item.post_modified || "",
  };
}

export default function WorkLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const isDetailCategory = (category: WorkCategory) =>
    category === "procedural-guides" ||
    category === "annual-plans" ||
    category === "strategic-planning" ||
    category === "community-initiatives";

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const { data, isLoading } = useQuery<WorkLibraryQueryResult>({
    queryKey: ["work-library", activeCategory, currentPage],
    queryFn: async () => {
      try {
        if (
          activeCategory === "all" ||
          activeCategory === "procedural-guides"
        ) {
          const res = await fetch(
            `${PROCEDURAL_EVIDENCES_API_URL}?page=${currentPage}`,
          );
          if (!res.ok) throw new Error("Failed to fetch procedural evidences");

          const page = (await res.json()) as ProceduralEvidencesPageResponse;
          const mapped = (page.data || [])
            .map(toWorkCardItem)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

          return {
            items: mapped,
            currentPage: page.current_page || currentPage,
            lastPage: page.last_page || 1,
          };
        }

        if (activeCategory === "annual-plans") {
          const res = await fetch(
            `${ANNUAL_PLANS_API_URL}?page=${currentPage}`,
          );
          if (!res.ok) throw new Error("Failed to fetch annual plans");

          const page = (await res.json()) as AnnualPlansPageResponse;
          const mapped = (page.data || [])
            .map(toAnnualPlanCardItem)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

          return {
            items: mapped,
            currentPage: page.meta?.current_page || currentPage,
            lastPage: page.meta?.last_page || 1,
          };
        }

        if (activeCategory === "strategic-planning") {
          const res = await fetch(
            `${STRATEGIC_PLANS_API_URL}?page=${currentPage}`,
          );
          if (!res.ok) throw new Error("Failed to fetch strategic plans");

          const page = (await res.json()) as StrategicPlansPageResponse;
          const mapped = (page.data || [])
            .map(toStrategicPlanCardItem)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

          return {
            items: mapped,
            currentPage: page.meta?.current_page || currentPage,
            lastPage: page.meta?.last_page || 1,
          };
        }

        if (activeCategory === "community-initiatives") {
          const res = await fetch(
            `${SOCIAL_INITIATIVES_API_URL}?page=${currentPage}`,
          );
          if (!res.ok) throw new Error("Failed to fetch social initiatives");

          const page = (await res.json()) as SocialInitiativesPageResponse;
          const mapped = (page.data || [])
            .map(toSocialInitiativeCardItem)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

          return {
            items: mapped,
            currentPage:
              page.meta?.current_page || page.current_page || currentPage,
            lastPage: page.meta?.last_page || page.last_page || 1,
          };
        }

        const localRes = await fetch(
          `/api/work-library?category=${activeCategory}`,
        );
        if (!localRes.ok) throw new Error("Failed to fetch");

        const localItems = (await localRes.json()) as WorkItem[];
        return {
          items: localItems.map((entry) => ({
            id: entry.id,
            slug: entry.slug,
            title: entry.title,
            description: entry.description,
            category: entry.category,
            imageUrl: entry.imageUrl,
            externalLink: null,
            createdAt: entry.createdAt ? String(entry.createdAt) : "",
          })),
          currentPage: 1,
          lastPage: 1,
        };
      } catch {
        const url =
          activeCategory === "all" || activeCategory === "procedural-guides"
            ? `${PROCEDURAL_EVIDENCES_API_URL}?page=${currentPage}`
            : activeCategory === "strategic-planning"
              ? `${STRATEGIC_PLANS_API_URL}?page=${currentPage}`
              : activeCategory === "community-initiatives"
                ? `${SOCIAL_INITIATIVES_API_URL}?page=${currentPage}`
                : activeCategory === "annual-plans"
                  ? `${ANNUAL_PLANS_API_URL}?page=${currentPage}`
                  : `/api/work-library?category=${activeCategory}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");

        if (
          activeCategory === "all" ||
          activeCategory === "procedural-guides"
        ) {
          const page = (await res.json()) as ProceduralEvidencesPageResponse;
          return {
            items: (page.data || []).map(toWorkCardItem),
            currentPage: page.current_page || currentPage,
            lastPage: page.last_page || 1,
          };
        }

        if (activeCategory === "annual-plans") {
          const page = (await res.json()) as AnnualPlansPageResponse;
          return {
            items: (page.data || []).map(toAnnualPlanCardItem),
            currentPage: page.meta?.current_page || currentPage,
            lastPage: page.meta?.last_page || 1,
          };
        }

        if (activeCategory === "strategic-planning") {
          const page = (await res.json()) as StrategicPlansPageResponse;
          return {
            items: (page.data || []).map(toStrategicPlanCardItem),
            currentPage: page.meta?.current_page || currentPage,
            lastPage: page.meta?.last_page || 1,
          };
        }

        if (activeCategory === "community-initiatives") {
          const page = (await res.json()) as SocialInitiativesPageResponse;
          return {
            items: (page.data || []).map(toSocialInitiativeCardItem),
            currentPage:
              page.meta?.current_page || page.current_page || currentPage,
            lastPage: page.meta?.last_page || page.last_page || 1,
          };
        }

        const localItems = (await res.json()) as WorkItem[];
        return {
          items: localItems.map((entry) => ({
            id: entry.id,
            slug: entry.slug,
            title: entry.title,
            description: entry.description,
            category: entry.category,
            imageUrl: entry.imageUrl,
            externalLink: null,
            createdAt: entry.createdAt ? String(entry.createdAt) : "",
          })),
          currentPage: 1,
          lastPage: 1,
        };
      }
    },
  });

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span
              className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md"
              data-testid="badge-work-library-page"
            >
              مكتبة الأعمال
            </span>
            <h1
              className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4"
              data-testid="text-work-library-title"
            >
              أعمالنا ومشاريعنا المنجزة
            </h1>
            <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
              نماذج من مشاريعنا المنجزة مع شركائنا في القطاع غير الربحي
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-md font-almarai text-sm font-bold transition-colors ${
                  activeCategory === cat.key
                    ? "bg-brand-gold text-white"
                    : "bg-brand-light-gold text-brand-gold-dark hover:bg-brand-gold/20"
                }`}
                data-testid={`button-filter-work-${cat.key}`}
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
              {data?.items.map((item) =>
                item.externalLink && !isDetailCategory(item.category) ? (
                  <a
                    key={item.id}
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                      data-testid={`card-work-${item.slug}`}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-brand-gold/15 via-brand-light-gold to-white flex flex-col items-center justify-center text-center px-4">
                          <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 text-brand-gold-dark">
                            <FileText size={28} />
                          </div>
                          <p className="font-almarai text-sm font-bold text-brand-gold-dark">
                            لا توجد صورة متاحة
                          </p>
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <Badge
                          variant="outline"
                          className="w-fit text-brand-gold-dark border-brand-gold/30 font-almarai text-xs mb-3"
                        >
                          {categoryLabels[item.category] || item.category}
                        </Badge>
                        <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-2 flex-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={`/work-library/${item.slug}?category=${item.category}`}
                  >
                    <div
                      className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                      data-testid={`card-work-${item.slug}`}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-brand-gold/15 via-brand-light-gold to-white flex flex-col items-center justify-center text-center px-4">
                          <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 text-brand-gold-dark">
                            <FileText size={28} />
                          </div>
                          <p className="font-almarai text-sm font-bold text-brand-gold-dark">
                            لا توجد صورة متاحة
                          </p>
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col">
                        <Badge
                          variant="outline"
                          className="w-fit text-brand-gold-dark border-brand-gold/30 font-almarai text-xs mb-3"
                        >
                          {categoryLabels[item.category] || item.category}
                        </Badge>
                        <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-2 flex-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}

          {!isLoading &&
            (activeCategory === "all" ||
              activeCategory === "procedural-guides" ||
              activeCategory === "annual-plans" ||
              activeCategory === "community-initiatives") &&
            (data?.lastPage || 1) > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={(data?.currentPage || 1) === 1}
                  className="px-4 py-2 rounded-md font-almarai text-sm font-bold bg-brand-light-gold text-brand-gold-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  السابق
                </button>

                {Array.from(
                  { length: data?.lastPage || 1 },
                  (_, idx) => idx + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md font-almarai text-sm font-bold transition-colors ${
                      page === (data?.currentPage || 1)
                        ? "bg-brand-gold text-white"
                        : "bg-brand-light-gold text-brand-gold-dark hover:bg-brand-gold/20"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, data?.lastPage || prev + 1),
                    )
                  }
                  disabled={(data?.currentPage || 1) === (data?.lastPage || 1)}
                  className="px-4 py-2 rounded-md font-almarai text-sm font-bold bg-brand-light-gold text-brand-gold-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
                </button>
              </div>
            )}

          {!isLoading && (data?.items.length || 0) === 0 && (
            <p className="text-center text-muted-foreground py-12 font-almarai text-lg">
              لا توجد أعمال في هذا التصنيف
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
