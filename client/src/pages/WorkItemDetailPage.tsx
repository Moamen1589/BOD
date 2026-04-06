import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, ExternalLink, FileText } from "lucide-react";
import type { WorkItem } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  "strategic-planning": "خطة استراتيجية",
  "procedural-guides": "دليل إجرائي",
  "annual-plans": "خطة سنوية",
  "community-initiatives": "مبادرة مجتمعية",
  "motion-graphics": "موشن جرافيك",
};

const REMOTE_SOURCE_URLS: Record<string, string> = {
  "strategic-planning":
    "https://gold-weasel-489740.hostingersite.com/api/strategic-plans",
  "procedural-guides":
    "https://gold-weasel-489740.hostingersite.com/api/procedural-evidences",
  "annual-plans":
    "https://gold-weasel-489740.hostingersite.com/api/annual-plans",
};

interface RemoteWorkItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content_text: string | null;
  link: string | null;
  date?: string | null;
  modified?: string | null;
  published_at: string | null;
  image_url?: string | null;
  featured_image?: { url: string } | null;
  content_image_1?: { url: string } | null;
}

interface RemotePageResponse {
  data: RemoteWorkItem[];
  current_page?: number;
  last_page?: number;
  meta?: {
    current_page?: number;
    last_page?: number;
  };
}

interface DetailWorkItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: WorkItem["category"];
  imageUrl: string | null;
  sourceLink: string | null;
  publishDate: string | null;
}

function getPageBounds(page: RemotePageResponse, fallbackPage: number) {
  return {
    currentPage: page.meta?.current_page || page.current_page || fallbackPage,
    lastPage: page.meta?.last_page || page.last_page || 1,
  };
}

function mapRemoteItem(
  item: RemoteWorkItem,
  category: WorkItem["category"],
): DetailWorkItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.excerpt || item.content_text || "",
    content: item.content_text || item.excerpt || "",
    category,
    imageUrl:
      item.featured_image?.url ||
      item.content_image_1?.url ||
      item.image_url ||
      null,
    sourceLink: item.link || null,
    publishDate: item.published_at || item.date || item.modified || null,
  };
}

function mapLocalItem(item: WorkItem): DetailWorkItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    content: item.content,
    category: item.category,
    imageUrl: item.imageUrl,
    sourceLink: item.fileUrl,
    publishDate: item.createdAt ? String(item.createdAt) : null,
  };
}

function formatArabicDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeSlug(value: string) {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function slugMatches(candidate: string, target: string) {
  const normalizedCandidate = normalizeSlug(candidate);
  const normalizedTarget = normalizeSlug(target);

  return (
    normalizedCandidate === normalizedTarget ||
    normalizeSlug(encodeURIComponent(normalizedCandidate)) ===
      normalizedTarget ||
    normalizedCandidate === normalizeSlug(encodeURIComponent(normalizedTarget))
  );
}

async function findRemoteItemBySlug(
  baseUrl: string,
  slug: string,
  category: WorkItem["category"],
) {
  let currentPage = 1;
  let lastPage = 1;

  while (currentPage <= lastPage) {
    const res = await fetch(`${baseUrl}?page=${currentPage}`);
    if (!res.ok) {
      throw new Error("Not found");
    }

    const page = (await res.json()) as RemotePageResponse;
    const bounds = getPageBounds(page, currentPage);
    lastPage = bounds.lastPage;

    const found = (page.data || []).find((entry) =>
      slugMatches(entry.slug, slug),
    );
    if (found) {
      return mapRemoteItem(found, category);
    }

    currentPage += 1;
  }

  return null;
}

export default function WorkItemDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = new URLSearchParams(window.location.search).get("category");
  const isApiBackedCategory =
    category === "annual-plans" ||
    category === "procedural-guides" ||
    category === "strategic-planning";

  const { data: item, isLoading } = useQuery<DetailWorkItem>({
    queryKey: ["work-library-detail", slug, category],
    queryFn: async () => {
      if (!slug) throw new Error("Not found");

      const searchOrder: WorkItem["category"][] =
        category === "annual-plans" ||
        category === "procedural-guides" ||
        category === "strategic-planning"
          ? [category]
          : ["strategic-planning", "annual-plans", "procedural-guides"];

      for (const searchCategory of searchOrder) {
        const remoteUrl = REMOTE_SOURCE_URLS[searchCategory];
        if (!remoteUrl) continue;

        const remoteItem = await findRemoteItemBySlug(
          remoteUrl,
          slug,
          searchCategory,
        );

        if (remoteItem) {
          return remoteItem;
        }
      }

      if (!isApiBackedCategory) {
        const localRes = await fetch(`/api/work-library/${slug}`);
        if (localRes.ok) {
          const localItem = (await localRes.json()) as WorkItem;
          return mapLocalItem(localItem);
        }
      }

      throw new Error("Not found");
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
          <h1 className="font-almarai font-extrabold text-3xl text-brand-dark mb-4">
            العمل غير موجود
          </h1>
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
              <span
                className="inline-flex items-center gap-1 text-brand-gold-dark font-almarai text-sm font-bold cursor-pointer"
                data-testid="link-back-work-library"
              >
                <ArrowRight size={14} />
                العودة لمكتبة الأعمال
              </span>
            </Link>
          </div>

          <article className="max-w-7xl mx-auto">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start xl:gap-12">
              <section className="order-2 lg:order-1 w-full">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-brand-gold-dark border-brand-gold/30 font-almarai"
                  >
                    {categoryLabels[item.category] || item.category}
                  </Badge>
                  {item.publishDate && (
                    <span className="font-almarai text-sm text-brand-gray">
                      {formatArabicDate(item.publishDate)}
                    </span>
                  )}
                </div>

                <h1
                  className="font-almarai font-extrabold text-2xl md:text-4xl text-brand-dark mb-5 leading-tight"
                  data-testid="text-work-title"
                >
                  {item.title}
                </h1>

                <div className="p-6 md:p-8 bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
                  <h2
                    className="font-almarai font-extrabold text-xl text-brand-dark mb-4"
                    data-testid="text-work-content-title"
                  >
                    المحتوى
                  </h2>
                  <div
                    className="font-almarai text-brand-dark/80 text-lg leading-8 whitespace-pre-line"
                    data-testid="text-work-content"
                  >
                    {item.content}
                  </div>
                </div>

                <div className="p-6 bg-brand-light-gold/50 rounded-2xl border border-brand-gold/10">
                  <h2
                    className="font-almarai font-extrabold text-xl text-brand-dark mb-4"
                    data-testid="text-work-files-title"
                  >
                    الملفات والروابط
                  </h2>
                  {item.sourceLink ? (
                    <a
                      href={item.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        className="bg-brand-gold text-white font-almarai gap-2"
                        data-testid="button-download-file"
                      >
                        {item.category === "annual-plans" ? (
                          <ExternalLink size={16} />
                        ) : (
                          <Download size={16} />
                        )}
                        {item.category === "annual-plans"
                          ? "فتح المصدر الأصلي"
                          : "تحميل الملف"}
                      </Button>
                    </a>
                  ) : (
                    <p
                      className="font-almarai text-brand-gray"
                      data-testid="text-work-no-files"
                    >
                      لا توجد ملفات أو روابط مرتبطة بهذا العمل حالياً.
                    </p>
                  )}
                </div>
              </section>

              <aside className="order-1 lg:order-2 w-full">
                <div className="space-y-4">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-[280px] sm:h-[340px] md:h-[420px] lg:h-[520px] object-cover rounded-2xl shadow-sm"
                      data-testid="img-work-cover"
                    />
                  ) : (
                    <div className="w-full h-[280px] sm:h-[340px] md:h-[420px] lg:h-[520px] rounded-2xl bg-gradient-to-br from-brand-gold/15 via-brand-light-gold to-white border border-brand-gold/10 flex flex-col items-center justify-center text-center px-6">
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-brand-gold-dark">
                        <FileText size={32} />
                      </div>
                      <p className="font-almarai text-lg font-bold text-brand-gold-dark">
                        لا توجد صورة متاحة
                      </p>
                      <p className="font-almarai text-sm text-brand-gray mt-2">
                        سيتم عرض المحتوى النصي فقط إلى حين توفر صورة.
                      </p>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
