import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { DigitalSolution } from "@shared/schema";

const releasesApiBase = "https://gold-weasel-489740.hostingersite.com";

const types = [
  { key: "all", label: "الكل" },
  { key: "platform", label: "المنصات" },
  { key: "case-study", label: "دراسات الحالة" },
  { key: "publication", label: "الإصدارات" },
] as const;

type SolutionFilterType = (typeof types)[number]["key"];

const typeLabels: Record<string, string> = {
  platform: "منصة",
  "case-study": "دراسة حالة",
  publication: "إصدار",
};

type ApiRelease = {
  id: number;
  edition_number?: number | null;
  title_guess?: string | null;
  card_text?: string | null;
  button_text?: string | null;
  file_url?: string | null;
  direct_download_url?: string | null;
  image_url?: string | null;
};

type ReleasesApiResponse = {
  data: ApiRelease[];
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
};

type DisplayCard =
  | {
      kind: "solution";
      id: number;
      slug: string;
      title: string;
      description: string;
      imageUrl: string | null;
      solutionType: DigitalSolution["solutionType"];
      link: string | null;
    }
  | {
      kind: "release";
      id: number;
      title: string;
      description: string;
      imageUrl: string | null;
      downloadUrl: string | null;
      buttonText: string;
      editionNumber: number | null;
    };

type SolutionsPageData = {
  cards: DisplayCard[];
  totalPages: number;
};

const cleanReleaseText = (value?: string | null): string => {
  if (!value) return "";
  return value
    .replace(/elementor-widget-container\">?/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const isValidType = (type: string | null): type is SolutionFilterType => {
  return !!type && types.some((t) => t.key === type);
};

const readInitialState = () => {
  if (typeof window === "undefined") {
    return { type: "all" as SolutionFilterType, page: 1 };
  }

  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get("type");
  const safeType = isValidType(typeParam) ? typeParam : "all";
  const requestedPage = Number(params.get("page") ?? "1");
  const safePage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  return {
    type: safeType,
    page: safeType === "publication" ? safePage : 1,
  };
};

export default function SolutionsPage() {
  const initialState = readInitialState();
  const [location] = useLocation();
  const [activeType, setActiveType] = useState<SolutionFilterType>(
    initialState.type,
  );
  const [currentPage, setCurrentPage] = useState<number>(initialState.page);

  useEffect(() => {
    const nextState = readInitialState();
    setActiveType((prev) => (prev === nextState.type ? prev : nextState.type));
    setCurrentPage((prev) => {
      const nextPage = nextState.type === "publication" ? nextState.page : 1;
      return prev === nextPage ? prev : nextPage;
    });
  }, [location]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    if (activeType === "all") {
      params.delete("type");
    } else {
      params.set("type", activeType);
    }

    if (activeType === "publication") {
      params.set("page", String(currentPage));
    } else {
      params.delete("page");
    }

    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState({}, "", nextUrl);
  }, [activeType, currentPage]);

  const { data: pageData, isLoading } = useQuery<SolutionsPageData>({
    queryKey: ["/api/solutions", activeType, currentPage],
    queryFn: async () => {
      if (activeType === "publication") {
        const releasesRes = await fetch(
          `${releasesApiBase}/api/releases?page=${currentPage}`,
        );
        if (!releasesRes.ok) throw new Error("Failed to fetch releases");

        const releasesPayload = (await releasesRes.json()) as ReleasesApiResponse;

        const cards: DisplayCard[] = (releasesPayload?.data ?? []).map(
          (release) => {
            const cleanTitle = cleanReleaseText(release.title_guess);
            const fallbackTitle = release.edition_number
              ? `الإصدار ${release.edition_number}`
              : `الإصدار ${release.id}`;

            return {
              kind: "release",
              id: release.id,
              title: cleanTitle || fallbackTitle,
              description:
                cleanReleaseText(release.card_text) || cleanTitle || fallbackTitle,
              imageUrl: release.image_url?.trim() || null,
              downloadUrl:
                release.direct_download_url?.trim() ||
                release.file_url?.trim() ||
                null,
              buttonText: release.button_text?.trim() || "للإطلاع والتحميل",
              editionNumber: release.edition_number ?? null,
            };
          },
        );

        return {
          cards,
          totalPages: Math.max(1, releasesPayload.meta?.last_page ?? 1),
        };
      }

      const url =
        activeType === "all"
          ? "/api/solutions"
          : `/api/solutions?type=${activeType}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch solutions");
      const solutions = (await res.json()) as DigitalSolution[];

      const cards: DisplayCard[] = solutions.map((sol) => ({
        kind: "solution",
        id: sol.id,
        slug: sol.slug,
        title: sol.title,
        description: sol.description,
        imageUrl: sol.imageUrl,
        solutionType: sol.solutionType,
        link: sol.link,
      }));

      return {
        cards,
        totalPages: 1,
      };
    },
  });

  const cards = pageData?.cards ?? [];
  const totalPages = pageData?.totalPages ?? 1;

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
                onClick={() => {
                  setActiveType(t.key);
                  setCurrentPage(1);
                }}
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
              {cards.map((card) => {
                if (card.kind === "solution") {
                  return (
                    <Link key={card.id} href={`/solutions/${card.slug}`}>
                      <div
                        className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                        data-testid={`card-solution-${card.slug}`}
                      >
                        {card.imageUrl && (
                          <img
                            src={card.imageUrl}
                            alt={card.title}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                          />
                        )}
                        {!card.imageUrl && (
                          <div className="w-full h-48 bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 flex items-center justify-center">
                            <span className="font-almarai text-4xl text-brand-gold/30 font-bold">
                              {typeLabels[card.solutionType] || card.solutionType}
                            </span>
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs">
                              {typeLabels[card.solutionType] || card.solutionType}
                            </Badge>
                            {card.link && (
                              <ExternalLink size={14} className="text-brand-gray/50" />
                            )}
                          </div>
                          <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">{card.title}</h3>
                          <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-2 flex-1">{card.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                }

                return (
                  <div
                    key={`release-${card.id}`}
                    className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col"
                    data-testid={`card-release-${card.id}`}
                  >
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 flex items-center justify-center">
                        <span className="font-almarai text-4xl text-brand-gold/30 font-bold">
                          إصدار
                        </span>
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs">
                          {card.editionNumber ? `إصدار ${card.editionNumber}` : "إصدار"}
                        </Badge>
                        <ExternalLink size={14} className="text-brand-gray/50" />
                      </div>
                      <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">{card.title}</h3>
                      <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-3 flex-1">{card.description}</p>
                      {card.downloadUrl && (
                        <a
                          href={card.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-brand-gold text-white font-almarai text-sm font-bold hover:bg-brand-gold-dark transition-colors"
                          data-testid={`button-release-download-${card.id}`}
                        >
                          {card.buttonText}
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && cards.length === 0 && (
            <p className="text-center text-muted-foreground py-12 font-almarai text-lg">
              {activeType === "publication"
                ? "لا توجد إصدارات في هذه الصفحة"
                : "لا توجد حلول في هذا التصنيف"}
            </p>
          )}

          {!isLoading &&
            activeType === "publication" &&
            cards.length > 0 &&
            totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <span className="text-xs font-almarai text-brand-gray/70 ml-2">
                  إجمالي الصفحات: {totalPages}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md font-almarai text-sm font-bold border border-brand-gold/30 text-brand-gold-dark disabled:opacity-40"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const start = Math.max(
                    1,
                    Math.min(currentPage - 1, totalPages - 3),
                  );
                  const end = Math.min(totalPages, start + 3);
                  if (page < start || page > end) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-10 h-10 rounded-md font-almarai text-sm font-bold ${
                        currentPage === page
                          ? "bg-brand-gold text-white"
                          : "bg-brand-light-gold text-brand-gold-dark hover:bg-brand-gold/20"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md font-almarai text-sm font-bold border border-brand-gold/30 text-brand-gold-dark disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
