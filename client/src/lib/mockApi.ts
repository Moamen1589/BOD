import type {
  Article,
  ContactMessage,
  DigitalSolution,
  Service,
  SiteSetting,
  WorkItem,
} from "@shared/schema";

type AdminUser = { id: string; username: string; role: string };

type MockDb = {
  services: Service[];
  articles: Article[];
  workItems: WorkItem[];
  solutions: DigitalSolution[];
  messages: ContactMessage[];
  settings: SiteSetting[];
};

const DB_KEY = "bod_frontend_mock_db_v1";
const AUTH_KEY = "bod_frontend_mock_auth_v1";
const INSTALLED_KEY = "__bodMockApiInstalled";

const defaultUser: AdminUser = {
  id: "admin-1",
  username: "admin",
  role: "admin",
};

function nowIso() {
  return new Date().toISOString();
}

function seedDb(): MockDb {
  return {
    services: [
      {
        id: 1,
        title: "الاستشارات المؤسسية",
        slug: "institutional-consulting",
        description: "تصميم نماذج تشغيل وحوكمة للمنظمات غير الربحية.",
        deliverables: ["تحليل فجوات", "خارطة طريق", "نموذج تشغيلي"],
        icon: "FileText",
        sortOrder: 1,
        published: true,
      },
      {
        id: 2,
        title: "بناء القدرات",
        slug: "capacity-building",
        description: "برامج تدريب وتمكين للفرق التنفيذية.",
        deliverables: ["خطة تدريب", "جلسات تطبيقية", "متابعة أثر"],
        icon: "Briefcase",
        sortOrder: 2,
        published: true,
      },
    ],
    articles: [
      {
        id: 1,
        title: "مؤشرات قياس الأثر في المنظمات غير الربحية",
        slug: "impact-metrics",
        excerpt: "دليل عملي لبناء مؤشرات أثر قابلة للقياس.",
        content: "هذا محتوى تجريبي لصفحة المقال.",
        category: "article",
        imageUrl: null,
        publishDate: "2026-01-10",
        published: true,
        createdAt: nowIso(),
      },
      {
        id: 2,
        title: "تحديثات قطاع غير الربحي",
        slug: "sector-updates",
        excerpt: "أهم المستجدات في القطاع خلال هذا الشهر.",
        content: "هذا محتوى تجريبي لصفحة الخبر.",
        category: "news",
        imageUrl: null,
        publishDate: "2026-02-01",
        published: true,
        createdAt: nowIso(),
      },
    ],
    workItems: [
      {
        id: 1,
        title: "خطة استراتيجية لجمعية تعليمية",
        slug: "edu-association-strategy",
        description: "بناء خطة استراتيجية لمدة 3 سنوات.",
        content: "تفاصيل المشروع التجريبية.",
        category: "strategic-planning",
        imageUrl: null,
        fileUrl: null,
        published: true,
        createdAt: nowIso(),
      },
    ],
    solutions: [
      {
        id: 1,
        title: "منصة إدارة المبادرات",
        slug: "initiatives-platform",
        description: "لوحة موحدة لإدارة المشاريع والمبادرات.",
        content: "تفاصيل الحل الرقمي التجريبي.",
        solutionType: "platform",
        imageUrl: null,
        link: null,
        published: true,
        createdAt: nowIso(),
      },
    ],
    messages: [
      {
        id: 1,
        name: "زائر الموقع",
        phone: "0500000000",
        email: "visitor@example.com",
        purpose: "inquiry",
        message: "هذه رسالة تجريبية من نموذج التواصل.",
        isRead: false,
        createdAt: nowIso(),
      },
    ],
    settings: [{ id: 1, key: "site_title", value: "BOD" }],
  };
}

function readDb(): MockDb {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return seedDb();
    const parsed = JSON.parse(raw) as MockDb;
    return parsed;
  } catch {
    return seedDb();
  }
}

function writeDb(db: MockDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getNextId(items: Array<{ id: number }>) {
  return items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function parseBody(init?: RequestInit) {
  if (!init?.body || typeof init.body !== "string") return null;
  try {
    return JSON.parse(init.body);
  } catch {
    return null;
  }
}

function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === "1";
}

function setAuthed(value: boolean) {
  localStorage.setItem(AUTH_KEY, value ? "1" : "0");
}

function unauthorized() {
  return json({ message: "Unauthorized" }, 401);
}

export function installMockApi() {
  const win = window as Window & { [INSTALLED_KEY]?: boolean };
  if (win[INSTALLED_KEY]) return;

  let db = readDb();
  writeDb(db);

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const method =
      init?.method?.toUpperCase() ??
      (typeof input === "object" && "method" in input
        ? input.method.toUpperCase()
        : "GET");

    const rawUrl =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const url = new URL(rawUrl, window.location.origin);

    if (!url.pathname.startsWith("/api")) {
      return nativeFetch(input, init);
    }

    db = readDb();

    if (url.pathname === "/api/contact" && method === "POST") {
      const body = parseBody(init) ?? {};
      const created: ContactMessage = {
        id: getNextId(db.messages),
        name: body.name ?? "",
        phone: body.phone ?? "",
        email: body.email ?? "",
        purpose: body.purpose ?? "inquiry",
        message: body.message ?? "",
        isRead: false,
        createdAt: nowIso(),
      };
      db.messages.unshift(created);
      writeDb(db);
      return json(created, 201);
    }

    if (url.pathname === "/api/admin/login" && method === "POST") {
      setAuthed(true);
      return json(defaultUser);
    }

    if (url.pathname === "/api/admin/logout" && method === "POST") {
      setAuthed(false);
      return json({ ok: true });
    }

    if (url.pathname === "/api/admin/me" && method === "GET") {
      return isAuthed() ? json(defaultUser) : unauthorized();
    }

    if (url.pathname.startsWith("/api/admin/") && !isAuthed()) {
      return unauthorized();
    }

    if (url.pathname === "/api/services" && method === "GET") {
      return json(db.services.filter((x) => x.published).sort((a, b) => a.sortOrder - b.sortOrder));
    }
    if (url.pathname.startsWith("/api/services/") && method === "GET") {
      const slug = url.pathname.split("/")[3];
      if (url.pathname.endsWith("/articles")) {
        return json(db.articles.filter((x) => x.published).slice(0, 3));
      }
      const service = db.services.find((x) => x.slug === slug && x.published);
      return service ? json(service) : json({ message: "Not found" }, 404);
    }

    if (url.pathname === "/api/blog" && method === "GET") {
      const category = url.searchParams.get("category");
      const rows = db.articles
        .filter((x) => x.published)
        .filter((x) => (category ? x.category === category : true));
      return json(rows);
    }
    if (url.pathname.startsWith("/api/blog/") && method === "GET") {
      const slug = url.pathname.split("/")[3];
      const row = db.articles.find((x) => x.slug === slug && x.published);
      return row ? json(row) : json({ message: "Not found" }, 404);
    }
    if (url.pathname === "/api/articles" && method === "GET") {
      return json(db.articles.filter((x) => x.published));
    }

    if (url.pathname === "/api/work-library" && method === "GET") {
      const category = url.searchParams.get("category");
      const rows = db.workItems
        .filter((x) => x.published)
        .filter((x) => (category ? x.category === category : true));
      return json(rows);
    }
    if (url.pathname.startsWith("/api/work-library/") && method === "GET") {
      const slug = url.pathname.split("/")[3];
      const row = db.workItems.find((x) => x.slug === slug && x.published);
      return row ? json(row) : json({ message: "Not found" }, 404);
    }

    if (url.pathname === "/api/solutions" && method === "GET") {
      const type = url.searchParams.get("type");
      const rows = db.solutions
        .filter((x) => x.published)
        .filter((x) => (type ? x.solutionType === type : true));
      return json(rows);
    }
    if (url.pathname.startsWith("/api/solutions/") && method === "GET") {
      const slug = url.pathname.split("/")[3];
      const row = db.solutions.find((x) => x.slug === slug && x.published);
      return row ? json(row) : json({ message: "Not found" }, 404);
    }

    if (url.pathname === "/api/admin/messages" && method === "GET") {
      return json(db.messages);
    }
    if (url.pathname === "/api/admin/messages/unread-count" && method === "GET") {
      return json({ count: db.messages.filter((x) => !x.isRead).length });
    }
    if (/^\/api\/admin\/messages\/\d+\/read$/.test(url.pathname) && method === "PATCH") {
      const id = Number(url.pathname.split("/")[4]);
      db.messages = db.messages.map((x) => (x.id === id ? { ...x, isRead: true } : x));
      writeDb(db);
      return json({ ok: true });
    }
    if (/^\/api\/admin\/messages\/\d+$/.test(url.pathname) && method === "DELETE") {
      const id = Number(url.pathname.split("/")[4]);
      db.messages = db.messages.filter((x) => x.id !== id);
      writeDb(db);
      return json({ ok: true });
    }

    if (url.pathname === "/api/admin/settings" && method === "GET") {
      return json(db.settings);
    }
    if (url.pathname === "/api/admin/settings" && method === "PUT") {
      const body = parseBody(init) ?? {};
      const idx = db.settings.findIndex((x) => x.key === body.key);
      if (idx >= 0) {
        db.settings[idx] = { ...db.settings[idx], value: String(body.value ?? "") };
      } else {
        db.settings.push({
          id: getNextId(db.settings),
          key: String(body.key ?? ""),
          value: String(body.value ?? ""),
        });
      }
      writeDb(db);
      return json({ ok: true });
    }

    if (url.pathname === "/api/admin/dashboard" && method === "GET") {
      return json({
        totalMessages: db.messages.length,
        unreadMessages: db.messages.filter((x) => !x.isRead).length,
        totalBlogPosts: db.articles.length,
        totalWorkItems: db.workItems.length,
        totalSolutions: db.solutions.length,
        totalServices: db.services.length,
      });
    }

    const crudRoutes = [
      { base: "/api/admin/blog", key: "articles" as const },
      { base: "/api/admin/services", key: "services" as const },
      { base: "/api/admin/work-library", key: "workItems" as const },
      { base: "/api/admin/solutions", key: "solutions" as const },
    ];

    for (const route of crudRoutes) {
      if (url.pathname === route.base && method === "GET") {
        return json(db[route.key]);
      }

      if (url.pathname === route.base && method === "POST") {
        const body = parseBody(init) ?? {};
        const list = db[route.key] as Array<Record<string, unknown>>;
        const created = {
          ...body,
          id: getNextId(list as Array<{ id: number }>),
          createdAt: nowIso(),
        };
        list.unshift(created);
        writeDb(db);
        return json(created, 201);
      }

      if (url.pathname.startsWith(`${route.base}/`) && method === "PUT") {
        const id = Number(url.pathname.split("/").pop());
        const body = parseBody(init) ?? {};
        const list = db[route.key] as Array<Record<string, unknown>>;
        const idx = list.findIndex((x) => x.id === id);
        if (idx < 0) return json({ message: "Not found" }, 404);
        list[idx] = { ...list[idx], ...body };
        writeDb(db);
        return json(list[idx]);
      }

      if (url.pathname.startsWith(`${route.base}/`) && method === "DELETE") {
        const id = Number(url.pathname.split("/").pop());
        const list = db[route.key] as Array<Record<string, unknown>>;
        db[route.key] = list.filter((x) => x.id !== id) as MockDb[typeof route.key];
        writeDb(db);
        return json({ ok: true });
      }
    }

    return json({ message: "Not found" }, 404);
  };

  win[INSTALLED_KEY] = true;
}
