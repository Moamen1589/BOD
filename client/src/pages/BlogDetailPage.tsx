import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
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
  last_page?: number;
};

type ApiNewsItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string | null;
  image: string | null;
  published_at: string | null;
};

type NewsApiResponse = {
  data: ApiNewsItem[];
  meta?: {
    last_page?: number;
  };
};

const categoryLabels: Record<string, string> = {
  news: "خبر",
  article: "مقال",
  newsletter: "نشرة بريدية",
};

const fallbackCardImage = "/figmaAssets/homepage.png";

const blogApiBase = "https://gold-weasel-489740.hostingersite.com";

const mapCategory = (categoryName?: string | null): Article["category"] => {
  if (!categoryName) return "article";
  const normalized = categoryName.toLowerCase();
  if (normalized.includes("news")) return "news";
  if (normalized.includes("newsletter")) return "newsletter";
  return "article";
};

const toImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  const trimmed = imagePath.trim();
  if (!trimmed) return null;
  const match =
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!match) return `${blogApiBase}/storage/${trimmed}`;
  return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
};

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const mapItem = (item: ApiBlog): Article => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.short_description || item.content || "",
      content: item.content || "",
      category: mapCategory(item.category?.name),
      imageUrl: toImageUrl(item.image_path),
      publishDate: item.published_at,
      published: item.is_published,
      createdAt: new Date(item.created_at),
    });

    const mapNewsItem = (item: ApiNewsItem): Article => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      content: item.content || item.excerpt || "",
      category: "news",
      imageUrl: toImageUrl(item.image),
      publishDate: item.published_at,
      published: true,
      createdAt: item.published_at ? new Date(item.published_at) : new Date(),
    });

    const tryFromStorage = () => {
      if (!slug) return null;
      try {
        const raw = sessionStorage.getItem(`blog_post_${slug}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Article;
        return parsed;
      } catch {
        return null;
      }
    };

    const load = async () => {
      try {
        setIsLoading(true);
        let foundInBlogs = false;

        const cached = tryFromStorage();
        if (cached && isMounted) {
          setPost(cached);
          setIsLoading(false);
          return;
        }

        const firstRes = await fetch(`${blogApiBase}/api/blogs?page=1`);
        if (!firstRes.ok) throw new Error("Failed to fetch");
        const firstPayload = (await firstRes.json()) as ApiResponse;
        const firstItems = firstPayload?.data ?? [];
        const firstFound = firstItems.find((item) => item.slug === slug);
        if (firstFound && isMounted) {
          foundInBlogs = true;
          setPost(mapItem(firstFound));
          setIsLoading(false);
          return;
        }

        const lastPage = firstPayload?.last_page ?? 1;
        for (let page = 2; page <= lastPage; page += 1) {
          if (!isMounted) return;
          const res = await fetch(`${blogApiBase}/api/blogs?page=${page}`);
          if (!res.ok) continue;
          const payload = (await res.json()) as ApiResponse;
          const items = payload?.data ?? [];
          const found = items.find((item) => item.slug === slug);
          if (found) {
            foundInBlogs = true;
            if (isMounted) setPost(mapItem(found));
            break;
          }
        }

        if (!isMounted || foundInBlogs) return;

        const firstNewsRes = await fetch(`${blogApiBase}/api/news?page=1`);
        if (!firstNewsRes.ok) throw new Error("Failed to fetch news");
        const firstNewsPayload = (await firstNewsRes.json()) as NewsApiResponse;
        const firstNewsItems = firstNewsPayload?.data ?? [];
        const firstNewsFound = firstNewsItems.find(
          (item) => item.slug === slug,
        );
        if (firstNewsFound && isMounted) {
          setPost(mapNewsItem(firstNewsFound));
          setIsLoading(false);
          return;
        }

        const lastNewsPage = firstNewsPayload?.meta?.last_page ?? 1;
        for (let page = 2; page <= lastNewsPage; page += 1) {
          if (!isMounted) return;
          const newsRes = await fetch(`${blogApiBase}/api/news?page=${page}`);
          if (!newsRes.ok) continue;
          const newsPayload = (await newsRes.json()) as NewsApiResponse;
          const newsItems = newsPayload?.data ?? [];
          const foundNews = newsItems.find((item) => item.slug === slug);
          if (foundNews) {
            if (isMounted) setPost(mapNewsItem(foundNews));
            break;
          }
        }
      } catch {
        if (isMounted) setPost(null);
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

  if (!post) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-almarai font-extrabold text-3xl text-brand-dark mb-4">
            المنشور غير موجود
          </h1>
          <Link href="/blog">
            <Button className="bg-brand-gold text-white font-almarai gap-2">
              <ArrowRight size={16} />
              العودة للمدونة
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
            <Link href="/blog">
              <span
                className="inline-flex items-center gap-1 text-brand-gold-dark font-almarai text-sm font-bold cursor-pointer"
                data-testid="link-back-blog"
              >
                <ArrowRight size={14} />
                العودة للمدونة
              </span>
            </Link>
          </div>

          <article className="w-full">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-black/5">
              <div className="relative">
                <img
                  src={post.imageUrl || fallbackCardImage}
                  alt={post.title}
                  className="w-full h-[220px] sm:h-[300px] lg:h-[420px] object-cover"
                  data-testid="img-blog-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <Badge
                      variant="outline"
                      className="text-white border-white/40 font-almarai bg-white/10"
                    >
                      {categoryLabels[post.category] || post.category}
                    </Badge>
                    {post.publishDate && (
                      <span className="font-almarai text-xs sm:text-sm text-white/80">
                        {post.publishDate}
                      </span>
                    )}
                  </div>
                  <h1
                    className="font-almarai font-extrabold text-[clamp(1.6rem,3vw,3rem)] text-white leading-tight"
                    data-testid="text-blog-title"
                  >
                    {post.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 sm:p-10 lg:p-12">
                <div
                  className="font-almarai text-brand-dark/80 text-[clamp(1rem,1.1vw,1.2rem)] leading-relaxed whitespace-pre-line"
                  data-testid="text-blog-content"
                >
                  {post.content}
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
