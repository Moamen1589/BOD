import type { Article, DigitalSolution, Service, WorkItem } from "@shared/schema";

const services: Service[] = [
  {
    id: 1,
    title: "Strategic Planning",
    slug: "strategic-planning",
    description: "End-to-end strategic planning for social impact organizations.",
    deliverables: ["Vision map", "Goals framework", "Execution roadmap"],
    icon: "FileText",
    sortOrder: 1,
    published: true,
  },
  {
    id: 2,
    title: "Operational Design",
    slug: "operational-design",
    description: "Process design and operating model optimization.",
    deliverables: ["Process maps", "RACI matrix", "KPI setup"],
    icon: "Settings",
    sortOrder: 2,
    published: true,
  },
  {
    id: 3,
    title: "Media and Digital Production",
    slug: "media-digital-production",
    description: "Creative digital assets, campaigns, and platform content.",
    deliverables: ["Brand toolkit", "Campaign concepts", "Content calendar"],
    icon: "Palette",
    sortOrder: 3,
    published: true,
  },
];

const articles: Article[] = [
  {
    id: 1,
    title: "Designing Sustainable Impact Programs",
    slug: "sustainable-impact-programs",
    excerpt: "How organizations can structure programs for long-term outcomes.",
    content:
      "A practical framework for building sustainable programs that stay resilient across funding cycles.",
    category: "article",
    imageUrl: null,
    publishDate: "2026-01-12",
    published: true,
    createdAt: new Date("2026-01-12"),
  },
  {
    id: 2,
    title: "Community Initiative Launch Checklist",
    slug: "community-initiative-launch-checklist",
    excerpt: "A concise checklist for planning and launching local initiatives.",
    content:
      "Use this checklist to align stakeholders, define milestones, and measure impact from day one.",
    category: "news",
    imageUrl: null,
    publishDate: "2026-02-03",
    published: true,
    createdAt: new Date("2026-02-03"),
  },
  {
    id: 3,
    title: "Quarterly Insights Newsletter",
    slug: "quarterly-insights-newsletter",
    excerpt: "Highlights of key lessons and field observations.",
    content:
      "A short round-up of operational and strategic insights from recent projects.",
    category: "newsletter",
    imageUrl: null,
    publishDate: "2026-02-20",
    published: true,
    createdAt: new Date("2026-02-20"),
  },
];

const workItems: WorkItem[] = [
  {
    id: 1,
    title: "Three-Year Strategic Plan",
    slug: "three-year-strategic-plan",
    description: "Strategic planning project for a nonprofit transformation program.",
    content: "Scope included baseline analysis, strategic pillars, and annual targets.",
    category: "strategic-planning",
    imageUrl: null,
    fileUrl: null,
    published: true,
    createdAt: new Date("2025-11-14"),
  },
  {
    id: 2,
    title: "Operational Procedures Guide",
    slug: "operational-procedures-guide",
    description: "A full procedural guide to standardize cross-team operations.",
    content: "Deliverables included SOPs, escalation matrix, and service-level workflows.",
    category: "procedural-guides",
    imageUrl: null,
    fileUrl: null,
    published: true,
    createdAt: new Date("2025-12-02"),
  },
];

const solutions: DigitalSolution[] = [
  {
    id: 1,
    title: "Impact Dashboard Platform",
    slug: "impact-dashboard-platform",
    description: "A platform for KPI tracking and reporting.",
    content: "Provides role-based dashboards, trend tracking, and downloadable reports.",
    solutionType: "platform",
    imageUrl: null,
    link: "https://example.com/platform",
    published: true,
    createdAt: new Date("2025-10-10"),
  },
  {
    id: 2,
    title: "Case Study: Volunteer Enablement",
    slug: "case-study-volunteer-enablement",
    description: "Documented program results and implementation lessons.",
    content: "An applied case study covering program setup, outcomes, and key metrics.",
    solutionType: "case-study",
    imageUrl: null,
    link: null,
    published: true,
    createdAt: new Date("2025-11-02"),
  },
];

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function notFound() {
  return jsonResponse({ message: "Not found" }, 404);
}

function matchPath(pathname: string, base: string) {
  if (pathname === base) return "";
  if (!pathname.startsWith(`${base}/`)) return null;
  return pathname.slice(base.length + 1);
}

async function handleApiRequest(requestUrl: URL, method: string, body: string | undefined) {
  const pathname = requestUrl.pathname;
  const category = requestUrl.searchParams.get("category");
  const type = requestUrl.searchParams.get("type");

  if (method === "GET" && pathname === "/api/services") {
    return jsonResponse([...services].sort((a, b) => a.sortOrder - b.sortOrder));
  }

  const serviceSlug = matchPath(pathname, "/api/services");
  if (method === "GET" && serviceSlug) {
    if (serviceSlug.endsWith("/articles")) {
      return jsonResponse(articles.filter((item) => item.published).slice(0, 3));
    }
    const service = services.find((item) => item.slug === serviceSlug);
    return service ? jsonResponse(service) : notFound();
  }

  if (method === "GET" && pathname === "/api/blog") {
    const list = category && category !== "all"
      ? articles.filter((item) => item.category === category)
      : articles;
    return jsonResponse(list);
  }

  if (method === "GET" && pathname === "/api/articles") {
    return jsonResponse(articles.filter((item) => item.category === "article"));
  }

  const blogSlug = matchPath(pathname, "/api/blog");
  if (method === "GET" && blogSlug) {
    const post = articles.find((item) => item.slug === blogSlug);
    return post ? jsonResponse(post) : notFound();
  }

  if (method === "GET" && pathname === "/api/work-library") {
    const list = category && category !== "all"
      ? workItems.filter((item) => item.category === category)
      : workItems;
    return jsonResponse(list);
  }

  const workSlug = matchPath(pathname, "/api/work-library");
  if (method === "GET" && workSlug) {
    const item = workItems.find((entry) => entry.slug === workSlug);
    return item ? jsonResponse(item) : notFound();
  }

  if (method === "GET" && pathname === "/api/solutions") {
    const list = type && type !== "all"
      ? solutions.filter((item) => item.solutionType === type)
      : solutions;
    return jsonResponse(list);
  }

  const solutionSlug = matchPath(pathname, "/api/solutions");
  if (method === "GET" && solutionSlug) {
    const item = solutions.find((entry) => entry.slug === solutionSlug);
    return item ? jsonResponse(item) : notFound();
  }

  if (method === "POST" && pathname === "/api/contact") {
    const parsed = body ? JSON.parse(body) : {};
    return jsonResponse({ ok: true, message: parsed.message ?? "" }, 201);
  }

  return notFound();
}

export function installMockApi() {
  const originalFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const inputUrl =
      typeof input === "string" || input instanceof URL
        ? input.toString()
        : input.url;
    const requestUrl = new URL(inputUrl, window.location.origin);

    if (requestUrl.origin !== window.location.origin || !requestUrl.pathname.startsWith("/api/")) {
      return originalFetch(input, init);
    }

    const requestMethod = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
    const requestBody = typeof init?.body === "string" ? init.body : undefined;

    try {
      return await handleApiRequest(requestUrl, requestMethod, requestBody);
    } catch (error) {
      return jsonResponse(
        { message: error instanceof Error ? error.message : "Unknown error" },
        500,
      );
    }
  };
}
