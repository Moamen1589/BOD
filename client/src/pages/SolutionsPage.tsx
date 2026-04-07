import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { DigitalSolution } from "@shared/schema";

const releasesApiBase = "https://gold-weasel-489740.hostingersite.com";
const CASE_STUDIES_API_URL =
  "https://gold-weasel-489740.hostingersite.com/api/case-studies";
const DIGITAL_SOLUTION_LINKS_API_URL =
  "https://gold-weasel-489740.hostingersite.com/api/digital-solution-links";

const types = [
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

type ApiCaseStudy = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  content_text?: string | null;
  link?: string | null;
  image_url?: string | null;
  image_drive_link?: string | null;
  image_drive_file_id?: string | null;
  author_name?: string | null;
  published_at?: string | null;
};

type CaseStudiesApiResponse = {
  current_page?: number;
  data: ApiCaseStudy[];
  last_page?: number;
};

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
    }
  | {
      kind: "case-study";
      id: number;
      slug: string;
      title: string;
      description: string;
      content: string;
      imageUrl: string | null;
      externalLink: string | null;
      publishDate: string | null;
      authorName: string | null;
    }
  | {
      kind: "platform-link";
      id: number;
      title: string;
      subtitle: string;
      url: string;
      openInNewTab: boolean;
    };

type SolutionsPageData = {
  cards: DisplayCard[];
  totalPages: number;
};

const cleanReleaseText = (value?: string | null): string => {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>(\s*)/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<(p|div|li|h[1-6])[^>]*>/gi, "")
    .replace(/elementor-widget-container\">?/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\r/g, "")
    .replace(/\s*(\d+\s*-\s*)/g, "\n$1")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
};

const toImageUrl = (imagePath?: string | null): string | null => {
  if (!imagePath) return null;
  const trimmed = imagePath.trim();
  if (!trimmed) return null;
  const match =
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!match) return trimmed;
  return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
};

const toDriveImageById = (driveFileId?: string | null): string | null => {
  if (!driveFileId) return null;
  const trimmed = driveFileId.trim();
  if (!trimmed) return null;
  return `https://lh3.googleusercontent.com/d/${trimmed}=w1000`;
};

const resolveCaseStudyImage = (study: ApiCaseStudy): string | null => {
  return (
    toDriveImageById(study.image_drive_file_id) ||
    toImageUrl(study.image_drive_link) ||
    study.image_url?.trim() ||
    null
  );
};

const isValidType = (type: string | null): type is SolutionFilterType => {
  return !!type && types.some((t) => t.key === type);
};

const readInitialState = () => {
  if (typeof window === "undefined") {
    return { type: "platform" as SolutionFilterType, page: 1 };
  }

  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get("type");
  const safeType = isValidType(typeParam) ? typeParam : "platform";
  const requestedPage = Number(params.get("page") ?? "1");
  const safePage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  return {
    type: safeType,
    page:
      safeType === "publication" || safeType === "case-study" ? safePage : 1,
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
      const nextPage =
        nextState.type === "publication" || nextState.type === "case-study"
          ? nextState.page
          : 1;
      return prev === nextPage ? prev : nextPage;
    });
  }, [location]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    params.set("type", activeType);

    if (activeType === "publication" || activeType === "case-study") {
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

        const releasesPayload =
          (await releasesRes.json()) as ReleasesApiResponse;

        const cards: DisplayCard[] = (releasesPayload?.data ?? []).map(
          (release) => {
            const cleanTitle = cleanReleaseText(release.title_guess);
            const cleanDescription = cleanReleaseText(release.card_text);
            const fallbackTitle = release.edition_number
              ? `الإصدار ${release.edition_number}`
              : `الإصدار ${release.id}`;

            return {
              kind: "release",
              id: release.id,
              title: cleanTitle || fallbackTitle,
              description: cleanDescription || cleanTitle || fallbackTitle,
              imageUrl: toImageUrl(release.image_url),
              downloadUrl:
                release.file_url?.trim() ||
                release.direct_download_url?.trim() ||
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

      if (activeType === "case-study") {
        const caseStudiesRes = await fetch(
          `${CASE_STUDIES_API_URL}?page=${currentPage}`,
        );
        if (!caseStudiesRes.ok) throw new Error("Failed to fetch case studies");

        const caseStudiesPayload =
          (await caseStudiesRes.json()) as CaseStudiesApiResponse;

        const cards: DisplayCard[] = (caseStudiesPayload?.data ?? []).map(
          (study) => ({
            kind: "case-study",
            id: study.id,
            slug: study.slug,
            title: study.title,
            description: study.excerpt || study.content_text || "",
            content: study.content_text || study.excerpt || "",
            imageUrl: resolveCaseStudyImage(study),
            externalLink: study.link?.trim() || null,
            publishDate: study.published_at?.trim() || null,
            authorName: study.author_name?.trim() || null,
          }),
        );

        return {
          cards,
          totalPages: Math.max(1, caseStudiesPayload.last_page ?? 1),
        };
      }

      if (activeType === "platform") {
        const linksRes = await fetch(DIGITAL_SOLUTION_LINKS_API_URL);
        if (!linksRes.ok) throw new Error("Failed to fetch platform links");

        const linksPayload =
          (await linksRes.json()) as ApiDigitalSolutionLinksResponse;

        const cards: DisplayCard[] = (linksPayload.data || [])
          .filter((item) => item.is_active)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => ({
            kind: "platform-link",
            id: item.id,
            title: item.label,
            subtitle: item.label_en || item.url,
            url: item.url,
            openInNewTab: item.open_in_new_tab,
          }));

        return {
          cards,
          totalPages: 1,
        };
      }

      const url = `/api/solutions?type=${activeType}`;
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
            <span
              className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md"
              data-testid="badge-solutions-page"
            >
              حلولنا الرقمية
            </span>
            <h1
              className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4"
              data-testid="text-solutions-title"
            >
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
                if (card.kind === "platform-link") {
                  return (
                    <div
                      key={`platform-link-${card.id}`}
                      className="relative rounded-md p-6 bg-brand-gold/10 border border-gray-100 hover:shadow-md transition-shadow h-full"
                      data-testid={`solution-card-${card.id}`}
                    >
                      <div className="w-12 h-12 rounded-md flex items-center justify-center mb-4 bg-brand-gold/20">
                        <span className="font-almarai font-extrabold text-xs text-brand-gold-dark">
                          رابط
                        </span>
                      </div>
                      <h4 className="font-almarai font-bold text-lg text-brand-dark mb-2">
                        {card.title}
                      </h4>
                      <p className="font-almarai text-brand-gray text-sm leading-relaxed mb-4">
                        {card.subtitle}
                      </p>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="font-almarai text-brand-gold-dark p-0 h-auto gap-1"
                      >
                        <a
                          href={card.url}
                          target={card.openInNewTab ? "_blank" : "_self"}
                          rel={
                            card.openInNewTab
                              ? "noopener noreferrer"
                              : undefined
                          }
                          data-testid={`link-solution-${card.id}`}
                        >
                          زيارة المنصة
                          <ExternalLink size={14} />
                        </a>
                      </Button>
                    </div>
                  );
                }

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
                              {typeLabels[card.solutionType] ||
                                card.solutionType}
                            </span>
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge
                              variant="outline"
                              className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs"
                            >
                              {typeLabels[card.solutionType] ||
                                card.solutionType}
                            </Badge>
                            {card.link && (
                              <ExternalLink
                                size={14}
                                className="text-brand-gray/50"
                              />
                            )}
                          </div>
                          <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">
                            {card.title}
                          </h3>
                          <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-2 flex-1">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                }

                if (card.kind === "case-study") {
                  return (
                    <Link
                      key={`case-study-${card.id}`}
                      href={`/solutions/case-study/${card.slug}`}
                      onClick={() => {
                        try {
                          sessionStorage.setItem(
                            `case_study_${card.slug}`,
                            JSON.stringify(card),
                          );
                        } catch {}
                      }}
                    >
                      <div
                        className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                        data-testid={`card-case-study-${card.id}`}
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
                              دراسة
                            </span>
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge
                              variant="outline"
                              className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs"
                            >
                              دراسة حالة
                            </Badge>
                            {card.externalLink && (
                              <ExternalLink
                                size={14}
                                className="text-brand-gray/50"
                              />
                            )}
                            {card.publishDate && (
                              <span className="font-almarai text-xs text-brand-gray/60">
                                {card.publishDate}
                              </span>
                            )}
                          </div>
                          <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">
                            {card.title}
                          </h3>
                          <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-3 flex-1">
                            {card.description}
                          </p>
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
                        className="w-full h-[320px] object-contain bg-white"
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
                        <Badge
                          variant="outline"
                          className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs"
                        >
                          {card.editionNumber
                            ? `إصدار ${card.editionNumber}`
                            : "إصدار"}
                        </Badge>
                        <ExternalLink
                          size={14}
                          className="text-brand-gray/50"
                        />
                      </div>
                      <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">
                        {card.title}
                      </h3>
                      <p className="font-almarai text-brand-gray text-sm leading-relaxed whitespace-pre-line text-right flex-1">
                        {card.description}
                      </p>
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
                : activeType === "case-study"
                  ? "لا توجد دراسات حالة في هذه الصفحة"
                  : "لا توجد حلول في هذا التصنيف"}
            </p>
          )}

          {!isLoading &&
            (activeType === "publication" || activeType === "case-study") &&
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
                    Math.min(currentPage - 1, totalPages - 2),
                  );
                  const end = Math.min(totalPages, start + 2);
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
