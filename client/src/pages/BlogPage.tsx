import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@shared/schema";
type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

type ApiBlog = {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  content: string | null;
  author: string | null;
  blog_category_id: number | null;
  image_path: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: ApiCategory | null;
};

type ApiResponse = {
  data: ApiBlog[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
};

const categories = [
  { key: "all", label: "الكل" },
  { key: "news", label: "أخبار" },
  { key: "article", label: "مقالات" },
];

const categoryLabels: Record<string, string> = {
  news: "خبر",
  article: "مقال",
  newsletter: "نشرة بريدية",
};

const blogApiBase = "https://gold-weasel-489740.hostingersite.com";

const mapCategory = (categoryName?: string | null): Article["category"] => {
  if (!categoryName) return "article";
  const normalized = categoryName.toLowerCase();
  if (normalized.includes("news")) return "news";
  if (normalized.includes("newsletter")) return "newsletter";
  return "article";
};

const toImageUrl = (imagePath?: string | null): string | null => {
  if (!imagePath) return null;

  const trimmed = imagePath.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (!trimmed.includes("drive.google.com")) return trimmed;
    const driveMatch =
      trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (!driveMatch) return trimmed;
    const fileId = driveMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  if (trimmed.startsWith("drive:")) {
    const fileId = trimmed.replace("drive:", "").trim();
    if (fileId) return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  return `${blogApiBase}/storage/${trimmed}`;
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${blogApiBase}/api/blogs?page=${currentPage}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const payload = (await res.json()) as ApiResponse;
        const items = payload?.data ?? [];
        const mapped = items.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.short_description || item.content || "",
          content: item.content || "",
          category: mapCategory(item.category?.name),
          imageUrl: toImageUrl(item?.image_path),
          publishDate: item.published_at,
          published: item.is_published,
          createdAt: new Date(item.created_at),
        }));
        if (isMounted) {
          setPosts(mapped);
          setTotalPages(
            payload.last_page ??
              Math.max(
                1,
                Math.ceil(
                  (payload.total ?? mapped.length) /
                    (payload.per_page ?? pageSize),
                ),
              ),
          );
        }
      } catch {
        if (isMounted) setPosts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const visiblePosts =
    activeCategory === "all"
      ? posts
      : posts?.filter((post) => post.category === activeCategory);
console.log(posts);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span
              className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md"
              data-testid="badge-blog-page"
            >
              المدونة
            </span>
            <h1
              className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4"
              data-testid="text-blog-page-title"
            >
              الأخبار والمقالات والنشرات
            </h1>
            <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
              آخر الأخبار والمقالات المتخصصة من ولادة حلم
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2 rounded-md font-almarai text-sm font-bold transition-colors ${
                  activeCategory === cat.key
                    ? "bg-brand-gold text-white"
                    : "bg-brand-light-gold text-brand-gold-dark hover:bg-brand-gold/20"
                }`}
                data-testid={`button-filter-${cat.key}`}
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
              {visiblePosts?.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  onClick={() => {
                    try {
                      sessionStorage.setItem(
                        `blog_post_${post.slug}`,
                        JSON.stringify(post),
                      );
                    } catch {
                      // ignore storage errors
                    }
                  }}
                >
                  <div
                    className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                    data-testid={`card-blog-${post.slug}`}
                  >
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-brand-gold/15 via-white to-brand-gold/10">
                        <div className="absolute -inset-10 opacity-70 blur-2xl bg-[radial-gradient(circle,rgba(208,158,54,0.55),transparent_60%)]" />
                        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.2),rgba(255,255,255,0.55),rgba(255,255,255,0.2))] animate-pulse" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge
                          variant="outline"
                          className="text-brand-gold-dark border-brand-gold/30 font-almarai text-xs"
                        >
                          {categoryLabels[post.category] || post.category}
                        </Badge>
                        {post.publishDate && (
                          <span className="font-almarai text-xs text-brand-gray/60">
                            {post.publishDate}
                          </span>
                        )}
                      </div>
                      <h3 className="font-almarai font-bold text-brand-dark mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="font-almarai text-brand-gray text-sm leading-relaxed line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && (!visiblePosts || visiblePosts.length === 0) && (
            <p className="text-center text-muted-foreground py-12 font-almarai text-lg">
              لا توجد منشورات في هذا التصنيف
            </p>
          )}

          {!isLoading &&
            visiblePosts &&
            visiblePosts.length > 0 &&
            totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <span className="text-xs font-almarai text-brand-gray/70 ml-2">
                  إجمالي الصفحات: {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md font-almarai text-sm font-bold border border-brand-gold/30 text-brand-gold-dark disabled:opacity-40"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  const start = Math.max(
                    1,
                    Math.min(currentPage - 1, totalPages - 3),
                  );
                  const end = Math.min(totalPages, start + 3);
                  if (page < start || page > end) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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
