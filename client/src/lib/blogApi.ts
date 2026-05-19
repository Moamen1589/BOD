import type { Article } from "@shared/schema";

export const blogApiBase = "https://api.bod.com.sa";

export type BlogApiCategory = {
  id?: number;
  name?: string | { ar?: string | null; en?: string | null } | null;
  slug?: string | null;
};

export type BlogApiItem = {
  id: number;
  title: string;
  slug: string;
  short_description?: string | null;
  excerpt?: string | null;
  content?: string | null;
  content_text?: string | null;
  content_html?: string | null;
  summary?: string | null;
  author?: string | null;
  author_name?: string | null;
  blog_category_id?: number | string | null;
  category_name?: string | null;
  categories?: (BlogApiCategory | string | number)[] | string | null;
  image_path?: string | null;
  image_url?: string | null;
  image?: string | null;
  image_drive_link?: string | null;
  image_drive_file_id?: string | null;
  featured_image?: { url?: string | null } | null;
  published_at?: string | null;
  date?: string | null;
  modified?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_published?: boolean;
  meta_description?: string | null;
  reading_time?: string | null;
};

const toTrimmedString = (value?: string | null) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toGoogleDriveImageUrl = (value?: string | null): string | null => {
  const trimmed = toTrimmedString(value);
  if (!trimmed) return null;

  const match =
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (match) {
    return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
  }

  // If the value looks like a Google Drive file id, construct a direct preview URL
  const driveIdLike = trimmed.match(/^[a-zA-Z0-9_-]{10,}$/);
  if (driveIdLike) {
    return `https://lh3.googleusercontent.com/d/${trimmed}=w1000`;
  }

  return null;
};

const toAbsoluteImageUrl = (value?: string | null): string | null => {
  const trimmed = toTrimmedString(value);
  if (!trimmed) return null;

  const driveImageUrl = toGoogleDriveImageUrl(trimmed);
  if (driveImageUrl) return driveImageUrl;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // If path starts with a slash, assume it's an absolute path on the blog host
  if (trimmed.startsWith("/")) {
    return `${blogApiBase}${trimmed}`;
  }

  // If it looks like a WordPress uploads path, prefix with blog host
  if (trimmed.includes("wp-content") || trimmed.includes("uploads")) {
    return `${blogApiBase}/${trimmed.replace(/^\//, "")}`;
  }

  // Fallback: attempt to serve from storage endpoint (legacy)
  return `${blogApiBase}/storage/${trimmed.replace(/^\//, "")}`;
};

const pickFirstString = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    const trimmed = toTrimmedString(value);
    if (trimmed) return trimmed;
  }
  return null;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const getCategoryText = (category: BlogApiCategory | string | number) => {
  if (typeof category === "string") return category;
  if (typeof category === "number") return String(category);

  if (typeof category.name === "string") return category.name;

  if (category.name && typeof category.name === "object") {
    return category.name.ar || category.name.en || null;
  }

  return category.slug || null;
};

export const resolveBlogCategory = (
  item: Pick<BlogApiItem, "categories" | "category_name" | "blog_category_id">,
): Article["category"] => {
  const categoryCandidates: Array<string | null | undefined> = [];

  if (Array.isArray(item.categories)) {
    categoryCandidates.push(...item.categories.map(getCategoryText));
  } else if (typeof item.categories === "string") {
    categoryCandidates.push(item.categories);
  }

  categoryCandidates.push(item.category_name);

  const normalizedCandidates = categoryCandidates
    .map((candidate) => (candidate ? normalizeText(candidate) : null))
    .filter((candidate): candidate is string => Boolean(candidate));

  if (
    normalizedCandidates.some(
      (candidate) => candidate.includes("news") || candidate.includes("خبر"),
    )
  ) {
    return "news";
  }

  if (
    normalizedCandidates.some(
      (candidate) =>
        candidate.includes("newsletter") || candidate.includes("نشرة"),
    )
  ) {
    return "newsletter";
  }

  if (
    normalizedCandidates.some(
      (candidate) =>
        candidate.includes("article") ||
        candidate.includes("مقال") ||
        candidate.includes("blog"),
    )
  ) {
    return "article";
  }

  if (item.blog_category_id === 0) {
    return "news";
  }

  return "article";
};

export const resolveBlogExcerpt = (item: BlogApiItem) => {
  return (
    pickFirstString(
      item.short_description,
      item.excerpt,
      item.meta_description,
      item.content_text,
      item.content,
      item.summary,
    ) || ""
  );
};

export const resolveBlogContent = (item: BlogApiItem) => {
  return (
    pickFirstString(
      item.content_text,
      item.content,
      item.short_description,
      item.excerpt,
      item.summary,
    ) || ""
  );
};

export const resolveBlogImage = (item: BlogApiItem) => {
  const category = resolveBlogCategory(item);
  const candidates =
    category === "news"
      ? [
          // News images arrive as direct URLs under `image`.
          item.image ?? null,
          item.featured_image?.url ?? null,
          item.image_url ?? null,
          item.image_path ?? null,
          item.image_drive_link ?? null,
          item.image_drive_file_id ?? null,
        ]
      : [
          // Committee/article images arrive as Google Drive links.
          item.image_drive_link ?? null,
          item.image_drive_file_id ?? null,
          item.featured_image?.url ?? null,
          item.image_url ?? null,
          item.image_path ?? null,
          item.image ?? null,
        ];

  for (const c of candidates) {
    const resolved = toAbsoluteImageUrl(c ?? null);
    if (resolved) return resolved;
  }

  return null;
};

// Lightweight helper that returns a Google Drive direct image URL when
// the provided value contains a Drive file id or `/d/{id}`/`?id=` pattern.
export const toImageUrl = (imagePath?: string | null): string | null => {
  return toGoogleDriveImageUrl(imagePath);
};

export const resolveBlogPublishDate = (item: BlogApiItem) => {
  return pickFirstString(
    item.published_at,
    item.date,
    item.modified,
    item.created_at,
  );
};

export const mapBlogItem = (item: BlogApiItem): Article => {
  const publishDate = resolveBlogPublishDate(item);

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: resolveBlogExcerpt(item),
    content: resolveBlogContent(item),
    category: resolveBlogCategory(item),
    imageUrl: resolveBlogImage(item),
    publishDate,
    published: item.is_published ?? Boolean(publishDate),
    createdAt: publishDate ? new Date(publishDate) : new Date(),
  };
};
