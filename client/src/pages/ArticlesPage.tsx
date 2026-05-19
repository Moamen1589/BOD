import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { mapBlogItem, toImageUrl, type BlogApiItem } from "@/lib/blogApi";
import type { Article } from "@shared/schema";

const fallbackCardImage = "/figmaAssets/homepage.png";

const pageSize = 6;

type ArticlesApiResponse =
  | Article[]
  | {
      data?: Article[];
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
      meta?: {
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
      };
    };

type ArticlesPageData = {
  items: Article[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
};

const normalizePageValue = (value: number, totalPages: number) =>
  Math.min(Math.max(value, 1), Math.max(totalPages, 1));

const fetchArticles = async (page: number): Promise<ArticlesPageData> => {
  const res = await fetch(`/api/articles?page=${page}`);

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  const payload = (await res.json()) as ArticlesApiResponse;

  if (Array.isArray(payload)) {
    const raw = payload as unknown as BlogApiItem[];
    const mappedAll = raw.map((item) => {
      const mapped = mapBlogItem(item);
      const drive = toImageUrl(
        item.image_drive_link ??
          item.image_drive_file_id ??
          item.image ??
          item.image_url,
      );
      if (drive) mapped.imageUrl = drive;
      return mapped;
    });
    const totalItems = mappedAll.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = normalizePageValue(page, totalPages);
    const start = (currentPage - 1) * pageSize;

    return {
      items: mappedAll.slice(start, start + pageSize),
      totalPages,
      totalItems,
      currentPage,
    };
  }

  const raw = (payload.data ?? []) as BlogApiItem[];
  const items = raw.map((item) => {
    const mapped = mapBlogItem(item);
    const drive = toImageUrl(
      item.image_drive_link ??
        item.image_drive_file_id ??
        item.image ??
        item.image_url,
    );
    if (drive) mapped.imageUrl = drive;
    return mapped;
  });
  const totalItems = payload.total ?? payload.meta?.total ?? items.length;
  const totalPages = Math.max(
    1,
    payload.last_page ??
      payload.meta?.last_page ??
      Math.ceil(
        totalItems / (payload.per_page ?? payload.meta?.per_page ?? pageSize),
      ),
  );
  const currentPage = normalizePageValue(
    payload.current_page ?? payload.meta?.current_page ?? page,
    totalPages,
  );

  return {
    items,
    totalPages,
    totalItems,
    currentPage,
  };
};

export default function ArticlesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery<ArticlesPageData>({
    queryKey: ["/api/articles", currentPage],
    queryFn: () => fetchArticles(currentPage),
  });

  useEffect(() => {
    if (data && data.currentPage !== currentPage) {
      setCurrentPage(data.currentPage);
    }
  }, [data, currentPage]);

  const totalPages = data?.totalPages ?? 1;
  const articles = data?.items ?? [];

  const visiblePageNumbers = useMemo(() => {
    const windowSize = 5;
    if (totalPages <= windowSize) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const halfWindow = Math.floor(windowSize / 2);
    let start = Math.max(1, currentPage - halfWindow);
    let end = start + windowSize - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - windowSize + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span
              className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md"
              data-testid="badge-articles-page"
            >
              أعمالنا
            </span>
            <h1
              className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4"
              data-testid="text-articles-page-title"
            >
              دراسات حالة ومشاريع
            </h1>
            <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
              نماذج من مشاريعنا المنجزة مع شركائنا في القطاع غير الربحي
            </p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 rounded-md" />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`}>
                    <div
                      className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full"
                      data-testid={`card-article-${article.slug}`}
                    >
                      <img
                        src={article.imageUrl || fallbackCardImage}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <div className="p-5">
                        <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                        {article.publishDate && (
                          <p className="font-almarai text-xs text-brand-gray/60 mt-3">
                            {article.publishDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                  <span className="text-xs font-almarai text-brand-gray/70 ml-2">
                    إجمالي الصفحات: {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md font-almarai text-sm font-bold border border-brand-gold/30 text-brand-gold-dark disabled:opacity-40"
                  >
                    Next
                  </button>
                  {visiblePageNumbers
                    .slice()
                    .reverse()
                    .map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => {
                          setCurrentPage(pageNumber);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-10 h-10 rounded-md font-almarai text-sm font-bold ${
                          currentPage === pageNumber
                            ? "bg-brand-gold text-white"
                            : "bg-brand-light-gold text-brand-gold-dark hover:bg-brand-gold/20"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md font-almarai text-sm font-bold border border-brand-gold/30 text-brand-gold-dark disabled:opacity-40"
                  >
                    Prev
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="font-almarai text-brand-gray text-lg">
                لا توجد مقالات متاحة الآن
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
