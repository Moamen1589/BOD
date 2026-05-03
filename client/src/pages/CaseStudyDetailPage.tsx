import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";

const CASE_STUDIES_API_URL =
  "https://gold-weasel-489740.hostingersite.com/api/case-studies";

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
  meta?: {
    current_page?: number;
    last_page?: number;
  };
};

type CaseStudyDetail = {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string | null;
  externalLink: string | null;
  authorName: string | null;
  publishDate: string | null;
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

const mapCaseStudy = (study: ApiCaseStudy): CaseStudyDetail => ({
  id: study.id,
  slug: study.slug,
  title: study.title,
  description: study.excerpt || study.content_text || "",
  content: study.content_text || study.excerpt || "",
  imageUrl: resolveCaseStudyImage(study),
  externalLink: study.link?.trim() || null,
  authorName: study.author_name?.trim() || null,
  publishDate: study.published_at?.trim() || null,
});

const normalizeSlug = (value: string) => {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
};

const slugMatches = (candidate: string, target: string) => {
  const normalizedCandidate = normalizeSlug(candidate);
  const normalizedTarget = normalizeSlug(target);

  return (
    normalizedCandidate === normalizedTarget ||
    normalizeSlug(encodeURIComponent(normalizedCandidate)) === normalizedTarget
  );
};

const getPageBounds = (
  payload: CaseStudiesApiResponse,
  fallbackPage: number,
) => {
  return {
    currentPage:
      payload.meta?.current_page || payload.current_page || fallbackPage,
    lastPage: payload.meta?.last_page || payload.last_page || 1,
  };
};

export default function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [study, setStudy] = useState<CaseStudyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const tryFromStorage = () => {
      if (!slug) return null;
      try {
        const raw = sessionStorage.getItem(`case_study_${slug}`);
        if (!raw) return null;
        return JSON.parse(raw) as CaseStudyDetail;
      } catch {
        return null;
      }
    };

    const load = async () => {
      try {
        setIsLoading(true);

        const cached = tryFromStorage();
        if (cached && isMounted) {
          setStudy(cached);
          setIsLoading(false);
          return;
        }

        if (!slug) {
          if (isMounted) setStudy(null);
          return;
        }

        let currentPage = 1;
        let lastPage = 1;
        let found: CaseStudyDetail | null = null;

        while (currentPage <= lastPage) {
          const res = await fetch(
            `${CASE_STUDIES_API_URL}?page=${currentPage}`,
          );
          if (!res.ok) break;

          const payload = (await res.json()) as CaseStudiesApiResponse;
          const bounds = getPageBounds(payload, currentPage);
          lastPage = bounds.lastPage;

          const match = (payload.data || []).find((entry) =>
            slugMatches(entry.slug, slug),
          );

          if (match) {
            found = mapCaseStudy(match);
            try {
              sessionStorage.setItem(
                `case_study_${slug}`,
                JSON.stringify(found),
              );
            } catch {}
            break;
          }

          currentPage += 1;
        }

        if (isMounted) setStudy(found);
      } catch {
        if (isMounted) setStudy(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

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

  if (!study) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-almarai font-extrabold text-3xl text-brand-dark mb-4">
            دراسة الحالة غير موجودة
          </h1>
          <Link href="/solutions?type=case-study">
            <Button className="bg-brand-gold text-white font-almarai gap-2">
              <ArrowRight size={16} />
              العودة لدراسات الحالة
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
      <main className="flex-1 pt-24 sm:pt-28 pb-20 bg-[#F7F7F9]">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/solutions?type=case-study">
              <span
                className="inline-flex items-center gap-1 text-brand-gold-dark font-almarai text-sm font-bold cursor-pointer"
                data-testid="link-back-case-studies"
              >
                <ArrowRight size={14} />
                العودة لدراسات الحالة
              </span>
            </Link>
          </div>

          <article className="w-full">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-black/5">
              {study.imageUrl ? (
                <div className="relative">
                  <img
                    src={study.imageUrl}
                    alt={study.title}
                    className="w-full h-[220px] sm:h-[300px] lg:h-[420px] object-cover"
                    data-testid="img-case-study-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-8 lg:p-10">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-white border-white/40 font-almarai bg-white/10"
                      >
                        دراسة حالة
                      </Badge>
                      {study.publishDate && (
                        <span className="font-almarai text-xs sm:text-sm text-white/80">
                          {study.publishDate}
                        </span>
                      )}
                      {study.authorName && (
                        <span className="font-almarai text-xs sm:text-sm text-white/80">
                          {study.authorName}
                        </span>
                      )}
                    </div>
                    <h1
                      className="font-almarai font-extrabold text-[clamp(1.6rem,3vw,3rem)] text-white leading-tight"
                      data-testid="text-case-study-title"
                    >
                      {study.title}
                    </h1>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-8 lg:p-10 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <Badge
                      variant="outline"
                      className="text-brand-gold-dark border-brand-gold/30 font-almarai"
                    >
                      دراسة حالة
                    </Badge>
                    {study.publishDate && (
                      <span className="font-almarai text-sm text-brand-gray/80">
                        {study.publishDate}
                      </span>
                    )}
                    {study.authorName && (
                      <span className="font-almarai text-sm text-brand-gray/80">
                        {study.authorName}
                      </span>
                    )}
                  </div>
                  <h1
                    className="font-almarai font-extrabold text-2xl sm:text-4xl text-brand-dark leading-tight"
                    data-testid="text-case-study-title"
                  >
                    {study.title}
                  </h1>
                </div>
              )}

              <div className="p-6 sm:p-10 lg:p-12">
            

                <div
                  className="font-almarai text-brand-dark/80 text-[clamp(1rem,1.1vw,1.2rem)] leading-relaxed whitespace-pre-line"
                  data-testid="text-case-study-content"
                >
                  {study.content}
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
