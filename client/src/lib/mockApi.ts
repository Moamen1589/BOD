import type {
  Article,
  DigitalSolution,
  Service,
  WorkItem,
} from "@shared/schema";

const services: Service[] = [
  {
    id: 1,
    title: "Strategic Planning",
    slug: "strategic-planning",
    description:
      "End-to-end strategic planning for social impact organizations.",
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
    excerpt:
      "A concise checklist for planning and launching local initiatives.",
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
    description:
      "Strategic planning project for a nonprofit transformation program.",
    content:
      "Scope included baseline analysis, strategic pillars, and annual targets.",
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
    description:
      "A full procedural guide to standardize cross-team operations.",
    content:
      "Deliverables included SOPs, escalation matrix, and service-level workflows.",
    category: "procedural-guides",
    imageUrl: null,
    fileUrl: null,
    published: true,
    createdAt: new Date("2025-12-02"),
  },
];

const strategicPlans = [
  {
    id: 1,
    post_id: 5570,
    title: "جمعية مسكن للاسكان التنموي بفيفاء",
    slug: "gmaay-mskn-llaskan-altnmoy-bfyfaaa",
    excerpt:
      "برعاية ودعم إعداد الخطة الإستراتيجية لجمعية مسكن للإسكان التنموي عدد الأهداف الاستراتيجية 11هدف استراتيجي 11مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية […]",
    content_text:
      "برعاية ودعم\n إعداد الخطة الإستراتيجية ل جمعية مسكن للإسكان التنموي عدد الأهداف الاستراتيجية 11هدف استراتيجي 11مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية وفق مؤشرات قياس محددة و تمثل هذة الخطة أحد المرتكزات لنشر ثقافة التخطيط الاستراتيجي وتشكيل فرق العمل على مستوى الأقسام والإدارات \n للاطلاع على موقع الجمعية",
    status: "publish",
    category_id: 121,
    image_url: "https://bod.com.sa/wp-content/uploads/2025/02/33.jpg",
    content_image_1: "https://bod.com.sa/wp-content/uploads/2025/01/1.png",
    content_image_2:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-3-500x299.png",
    published_at: "2025-02-25T15:22:45.000000Z",
  },
  {
    id: 2,
    post_id: 5566,
    title: "جمعية مأوى",
    slug: "gmaay-mao",
    excerpt:
      "برعاية ودعم إعداد الخطة الإستراتيجية لجمعية مأوى عدد الأهداف الاستراتيجية 13 هدف استراتيجي 15 مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية […]",
    content_text:
      "برعاية ودعم\n إعداد الخطة الإستراتيجية لجمعية مأوى عدد الأهداف الاستراتيجية 13 هدف استراتيجي 15 مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية وفق مؤشرات قياس محددة و تمثل هذة الخطة أحد المرتكزات لنشر ثقافة التخطيط الاستراتيجي وتشكيل فرق العمل على مستوى الأقسام والإدارات \n للاطلاع على موقع الجمعية",
    status: "publish",
    category_id: 121,
    image_url: "https://bod.com.sa/wp-content/uploads/2025/02/11-scaled.jpg",
    content_image_1:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-11.png",
    content_image_2:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-3-500x299.png",
    published_at: "2025-02-25T15:16:25.000000Z",
  },
  {
    id: 3,
    post_id: 5562,
    title: "جمعية منازل",
    slug: "gmaay-mnazl",
    excerpt:
      "برعاية ودعم إعداد الخطة الإستراتيجية جمعية منازل عدد الأهداف الاستراتيجية 9 أهدف استراتيجي 9 مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية […]",
    content_text:
      "برعاية ودعم\n إعداد الخطة الإستراتيجية جمعية منازل عدد الأهداف الاستراتيجية 9 أهدف استراتيجي 9 مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية وفق مؤشرات قياس محددة و تمثل هذة الخطة أحد المرتكزات لنشر ثقافة التخطيط الاستراتيجي وتشكيل فرق العمل على مستوى الأقسام والإدارات \n للاطلاع على موقع الجمعية",
    status: "publish",
    category_id: 121,
    image_url: "https://bod.com.sa/wp-content/uploads/2025/02/44-scaled.jpg",
    content_image_1:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-10-500x139.png",
    content_image_2:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-3-500x299.png",
    published_at: "2025-02-25T15:11:36.000000Z",
  },
  {
    id: 4,
    post_id: 5559,
    title: "جمعية مسكنهم",
    slug: "gmaay-msknhm",
    excerpt:
      "برعاية ودعم إعداد الخطة الإستراتيجية لجمعية مسكنهم عدد الأهداف الاستراتيجية 10 هدف استراتيجي 10مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية […]",
    content_text:
      "برعاية ودعم\n إعداد الخطة الإستراتيجية لجمعية مسكنهم عدد الأهداف الاستراتيجية 10 هدف استراتيجي 10مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية وفق مؤشرات قياس محددة و تمثل هذة الخطة أحد المرتكزات لنشر ثقافة التخطيط الاستراتيجي وتشكيل فرق العمل على مستوى الأقسام والإدارات \n للاطلاع على موقع الجمعية",
    status: "publish",
    category_id: 121,
    image_url: "https://bod.com.sa/wp-content/uploads/2025/02/55-scaled.jpg",
    content_image_1: "https://bod.com.sa/wp-content/uploads/2025/01/4.png",
    content_image_2:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-3-500x299.png",
    published_at: "2025-02-25T15:05:35.000000Z",
  },
  {
    id: 5,
    post_id: 5555,
    title: "جمعية اعمار",
    slug: "gmaay-aaamar",
    excerpt:
      "برعاية ودعم إعداد الخطة الإستراتيجية جمعية إعمار عدد الأهداف الاستراتيجية 10 هدف استراتيجي 10مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية وفق […]",
    content_text:
      "برعاية ودعم\n إعداد الخطة الإستراتيجية جمعية إعمار عدد الأهداف الاستراتيجية 10 هدف استراتيجي 10مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية وفق مؤشرات قياس محددة و تمثل هذة الخطة أحد المرتكزات لنشر ثقافة التخطيط الاستراتيجي وتشكيل فرق العمل على مستوى الأقسام والإدارات \n للاطلاع على موقع الجمعية",
    status: "publish",
    category_id: 121,
    image_url: "https://bod.com.sa/wp-content/uploads/2025/02/66.jpg",
    content_image_1:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-9.png",
    content_image_2:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-3-500x299.png",
    published_at: "2025-02-25T15:01:18.000000Z",
  },
  {
    id: 6,
    post_id: 5551,
    title: "جمعية دار للإسكان بعرعر",
    slug: "gmaay-dar-llaskan-baaraar",
    excerpt:
      "برعاية ودعم إعداد الخطة الإستراتيجية جمعية دار للاسكان بعرعرعدد الأهداف الاستراتيجية 10 هدف استراتيجي 10مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية […]",
    content_text:
      "برعاية ودعم\n إعداد الخطة الإستراتيجية جمعية دار للاسكان بعرعرعدد الأهداف الاستراتيجية 10 هدف استراتيجي 10مبادرات استراتيجية بالإضافة إلى الأهداف التفصيلية وفق مؤشرات قياس محددة و تمثل هذة الخطة أحد المرتكزات لنشر ثقافة التخطيط الاستراتيجي وتشكيل فرق العمل على مستوى الأقسام والإدارات \n للاطلاع على موقع الجمعية",
    status: "publish",
    category_id: 121,
    image_url: "https://bod.com.sa/wp-content/uploads/2025/02/77.jpg",
    content_image_1:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-8.png",
    content_image_2:
      "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-3-500x299.png",
    published_at: "2025-02-25T13:44:00.000000Z",
  },
];

const annualPlans = [
  {
    id: 1,
    post_id: "5718",
    title: "إعداد الخطة السنوية لجمعية ماوى",
    slug: "%d8%a5%d8%b9%d8%af%d8%a7%d8%af-%d8%a7%d9%84%d8%ae%d8%b7%d8%a9-%d8%a7%d9%84%d8%b3%d9%86%d9%88%d9%8a%d8%a9-%d9%84%d8%ac%d9%85%d8%b9%d9%8a%d8%a9-%d9%85%d8%a7%d9%88%d9%89",
    excerpt:
      "إعداد الخطة السنوية لجمعية ماوى والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل",
    content_text:
      "إعداد الخطة السنوية لجمعية ماوى والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل",
    link: "https://bod.com.sa/blog/2025/04/22/%d8%a5%d8%b9%d8%af%d8%a7%d8%af-%d8%a7%d9%84%d8%ae%d8%b7%d8%a9-%d8%a7%d9%84%d8%b3%d9%86%d9%88%d9%8a%d8%a9-%d9%84%d8%ac%d9%85%d8%b9%d9%8a%d8%a9-%d9%85%d8%a7%d9%88%d9%89/",
    status: "publish",
    category_id: 122,
    featured_image: {
      url: "https://bod.com.sa/wp-content/uploads/2025/04/24.jpg",
    },
    content_image_1: {
      url: "https://bod.com.sa/wp-content/uploads/2025/01/6.png",
    },
    published_at: "2025-04-22T21:39:03.000000Z",
  },
  {
    id: 2,
    post_id: "5715",
    title: "إعداد الخطة السنوية لجمعية منازل",
    slug: "%d8%a5%d8%b9%d8%af%d8%a7%d8%af-%d8%a7%d9%84%d8%ae%d8%b7%d8%a9-%d8%a7%d9%84%d8%b3%d9%86%d9%88%d9%8a%d8%a9-%d9%84%d8%ac%d9%85%d8%b9%d9%8a%d8%a9-%d9%85%d9%86%d8%a7%d8%b2%d9%84",
    excerpt:
      "إعداد الخطة السنوية لجمعية منازل والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل",
    content_text:
      "إعداد الخطة السنوية لجمعية منازل والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل",
    link: "https://bod.com.sa/blog/2025/04/22/%d8%a5%d8%b9%d8%af%d8%a7%d8%af-%d8%a7%d9%84%d8%ae%d8%b7%d8%a9-%d8%a7%d9%84%d8%b3%d9%86%d9%88%d9%8a%d8%a9-%d9%84%d8%ac%d9%85%d8%b9%d9%8a%d8%a9-%d9%85%d9%86%d8%a7%d8%b2%d9%84/",
    status: "publish",
    category_id: 122,
    featured_image: {
      url: "https://bod.com.sa/wp-content/uploads/2025/04/23.jpg",
    },
    content_image_1: {
      url: "https://bod.com.sa/wp-content/uploads/2025/02/unnamed-10-500x139.png",
    },
    published_at: "2025-04-22T21:36:13.000000Z",
  },
  {
    id: 3,
    post_id: "5702",
    title: "إعداد الخطة السنوية لجمعية مسكن للإسكان التنموي",
    slug: "%d8%a5%d8%b9%d8%af%d8%a7%d8%af-%d8%a7%d9%84%d8%ae%d8%b7%d8%a9-%d8%a7%d9%84%d8%b3%d9%86%d9%88%d9%8a%d8%a9-%d9%84%d8%ac%d9%85%d8%b9%d9%8a%d8%a9-%d9%85%d8%b3%d9%83%d9%86-%d9%84%d9%84%d8%a5%d8%b3%d9%83",
    excerpt:
      "إعداد الخطة السنوية لجمعية مسكن للإسكان التنموي والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل",
    content_text:
      "إعداد الخطة السنوية لجمعية مسكن للإسكان التنموي والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل",
    link: "https://bod.com.sa/blog/2025/04/22/%d8%a5%d8%b9%d8%af%d8%a7%d8%af-%d8%a7%d9%84%d8%ae%d8%b7%d8%a9-%d8%a7%d9%84%d8%b3%d9%86%d9%88%d9%8a%d8%a9-%d9%84%d8%ac%d9%85%d8%b9%d9%8a%d8%a9-%d9%85%d8%b3%d9%83%d9%86-%d9%84%d9%84%d8%a5%d8%b3%d9%83/",
    status: "publish",
    category_id: 122,
    featured_image: {
      url: "https://bod.com.sa/wp-content/uploads/2025/04/18.jpg",
    },
    content_image_1: {
      url: "https://bod.com.sa/wp-content/uploads/2025/01/1.png",
    },
    published_at: "2025-04-22T21:06:39.000000Z",
  },
  {
    id: 4,
    post_id: "5695",
    title: "إعداد الخطة السنوية لجمعية طويق للاسكان والتنمية",
    slug: "%d8%a5%d8%b9%d8%af%d8%a7%d8%af-%d8%a7%d9%84%d8%ae%d8%b7%d8%a9-%d8%a7%d9%84%d8%b3%d9%86%d9%88%d9%8a%d8%a9-%d9%84%d8%ac%d9%85%d8%b9%d9%8a%d8%a9-%d8%b7%d9%88%d9%8a%d9%82-%d9%84%d9%84%d8%a7%d8%b3%d9%83",
    excerpt:
      "إعداد الخطة السنوية لجمعية طويق للاسكان والتنمية والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل",
    content_text:
      "إعداد الخطة السنوية لجمعية طويق للاسكان والتنمية والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل",
    link: "https://bod.com.sa/blog/2025/04/22/%d8%a5%d8%b9%d8%af%d8%a7%d8%af-%d8%a7%d9%84%d8%ae%d8%b7%d8%a9-%d8%a7%d9%84%d8%b3%d9%86%d9%88%d9%8a%d8%a9-%d9%84%d8%ac%d9%85%d8%b9%d9%8a%d8%a9-%d8%b7%d9%88%d9%8a%d9%82-%d9%84%d9%84%d8%a7%d8%b3%d9%83/",
    status: "publish",
    category_id: 122,
    featured_image: {
      url: "https://bod.com.sa/wp-content/uploads/2025/04/16.jpg",
    },
    content_image_1: { url: "" },
    published_at: "2025-04-22T20:51:11.000000Z",
  },
];

const solutions: DigitalSolution[] = [
  {
    id: 1,
    title: "Impact Dashboard Platform",
    slug: "impact-dashboard-platform",
    description: "A platform for KPI tracking and reporting.",
    content:
      "Provides role-based dashboards, trend tracking, and downloadable reports.",
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
    content:
      "An applied case study covering program setup, outcomes, and key metrics.",
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

async function handleApiRequest(
  requestUrl: URL,
  method: string,
  body: string | undefined,
) {
  const pathname = requestUrl.pathname;
  const category = requestUrl.searchParams.get("category");
  const type = requestUrl.searchParams.get("type");

  if (method === "GET" && pathname === "/api/services") {
    return jsonResponse(
      [...services].sort((a, b) => a.sortOrder - b.sortOrder),
    );
  }

  const serviceSlug = matchPath(pathname, "/api/services");
  if (method === "GET" && serviceSlug) {
    if (serviceSlug.endsWith("/articles")) {
      return jsonResponse(
        articles.filter((item) => item.published).slice(0, 3),
      );
    }
    const service = services.find((item) => item.slug === serviceSlug);
    return service ? jsonResponse(service) : notFound();
  }

  if (method === "GET" && pathname === "/api/blog") {
    const list =
      category && category !== "all"
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
    const list =
      category && category !== "all"
        ? workItems.filter((item) => item.category === category)
        : workItems;
    return jsonResponse(list);
  }

  if (method === "GET" && pathname === "/api/strategic-plans") {
    const page = Number(requestUrl.searchParams.get("page") || "1");
    const perPage = 2;
    const total = strategicPlans.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(Math.max(page, 1), lastPage);
    const start = (currentPage - 1) * perPage;
    const data = strategicPlans.slice(start, start + perPage);

    return jsonResponse({
      data,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        total,
      },
    });
  }

  if (method === "GET" && pathname === "/api/annual-plans") {
    const page = Number(requestUrl.searchParams.get("page") || "1");
    const perPage = 2;
    const total = annualPlans.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(Math.max(page, 1), lastPage);
    const start = (currentPage - 1) * perPage;
    const data = annualPlans.slice(start, start + perPage);

    return jsonResponse({
      data,
      links: {
        first: "/api/annual-plans?page=1",
        last: `/api/annual-plans?page=${lastPage}`,
        prev:
          currentPage > 1 ? `/api/annual-plans?page=${currentPage - 1}` : null,
        next:
          currentPage < lastPage
            ? `/api/annual-plans?page=${currentPage + 1}`
            : null,
      },
      meta: {
        current_page: currentPage,
        from: total === 0 ? null : start + 1,
        last_page: lastPage,
        links: [],
        path: "/api/annual-plans",
        per_page: perPage,
        to: Math.min(start + perPage, total),
        total,
      },
    });
  }

  const workSlug = matchPath(pathname, "/api/work-library");
  if (method === "GET" && workSlug) {
    const item = workItems.find((entry) => entry.slug === workSlug);
    return item ? jsonResponse(item) : notFound();
  }

  if (method === "GET" && pathname === "/api/solutions") {
    const list =
      type && type !== "all"
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

  globalThis.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const inputUrl =
      typeof input === "string" || input instanceof URL
        ? input.toString()
        : input.url;
    const requestUrl = new URL(inputUrl, window.location.origin);

    if (
      requestUrl.origin !== window.location.origin ||
      !requestUrl.pathname.startsWith("/api/")
    ) {
      return originalFetch(input, init);
    }

    const requestMethod = (
      init?.method ?? (input instanceof Request ? input.method : "GET")
    ).toUpperCase();
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
