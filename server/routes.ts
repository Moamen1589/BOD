import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertSiteSettingSchema, insertServiceSchema, insertArticleSchema, insertWorkItemSchema, insertDigitalSolutionSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";

const PgStore = connectPg(session);

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).userId) {
    return res.status(401).json({ message: "غير مصرح" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  app.use(
    session({
      store: new PgStore({ pool, createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET || "bod-admin-secret-" + (process.env.DATABASE_URL || "").slice(-12),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  await seedAdmin();
  await seedServices();
  await seedWorkItems();
  await seedBlogPosts();
  await seedDigitalSolutions();

  app.post("/api/contact", async (req, res) => {
    const parsed = insertContactMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "بيانات غير صحيحة", errors: parsed.error.errors });
    }
    const message = await storage.createContactMessage(parsed.data);
    res.status(201).json(message);
  });

  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "يرجى إدخال اسم المستخدم وكلمة المرور" });
    }
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }
    (req.session as any).userId = user.id;
    res.json({ id: user.id, username: user.username, role: user.role });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "تم تسجيل الخروج" });
    });
  });

  app.get("/api/admin/me", async (req, res) => {
    const userId = (req.session as any).userId;
    if (!userId) return res.status(401).json({ message: "غير مصرح" });
    const user = await storage.getUser(userId);
    if (!user) return res.status(401).json({ message: "غير مصرح" });
    res.json({ id: user.id, username: user.username, role: user.role });
  });

  // Messages
  app.get("/api/admin/messages", requireAuth, async (_req, res) => {
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  app.get("/api/admin/messages/unread-count", requireAuth, async (_req, res) => {
    const count = await storage.getUnreadCount();
    res.json({ count });
  });

  app.patch("/api/admin/messages/:id/read", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.markMessageRead(id);
    res.json({ success: true });
  });

  app.delete("/api/admin/messages/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteMessage(id);
    res.json({ success: true });
  });

  // Settings
  app.get("/api/admin/settings", requireAuth, async (_req, res) => {
    const settings = await storage.getSiteSettings();
    res.json(settings);
  });

  app.put("/api/admin/settings", requireAuth, async (req, res) => {
    const parsed = insertSiteSettingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "بيانات غير صحيحة" });
    const setting = await storage.upsertSiteSetting(parsed.data);
    res.json(setting);
  });

  // Services (for landing page section - stays as is)
  app.get("/api/services", async (_req, res) => {
    const svcs = await storage.getPublishedServices();
    res.json(svcs);
  });

  app.get("/api/services/:slug", async (req, res) => {
    const service = await storage.getServiceBySlug(req.params.slug);
    if (!service) return res.status(404).json({ message: "الخدمة غير موجودة" });
    res.json(service);
  });

  app.get("/api/admin/services", requireAuth, async (_req, res) => {
    const svcs = await storage.getServices();
    res.json(svcs);
  });

  app.post("/api/admin/services", requireAuth, async (req, res) => {
    const parsed = insertServiceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "بيانات غير صحيحة", errors: parsed.error.errors });
    const service = await storage.createService(parsed.data);
    res.status(201).json(service);
  });

  app.put("/api/admin/services/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const service = await storage.updateService(id, req.body);
    res.json(service);
  });

  app.delete("/api/admin/services/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteService(id);
    res.json({ success: true });
  });

  // Blog (articles with category: news/article/newsletter)
  app.get("/api/blog", async (req, res) => {
    const category = req.query.category as string | undefined;
    if (category) {
      const arts = await storage.getArticlesByCategory(category);
      return res.json(arts);
    }
    const arts = await storage.getPublishedArticles();
    res.json(arts);
  });

  app.get("/api/blog/:slug", async (req, res) => {
    const article = await storage.getArticleBySlug(req.params.slug);
    if (!article || !article.published) return res.status(404).json({ message: "المقال غير موجود" });
    res.json(article);
  });

  app.get("/api/admin/blog", requireAuth, async (_req, res) => {
    const arts = await storage.getArticles();
    res.json(arts);
  });

  app.post("/api/admin/blog", requireAuth, async (req, res) => {
    const parsed = insertArticleSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "بيانات غير صحيحة", errors: parsed.error.errors });
    const article = await storage.createArticle(parsed.data);
    res.status(201).json(article);
  });

  app.put("/api/admin/blog/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const article = await storage.updateArticle(id, req.body);
    res.json(article);
  });

  app.delete("/api/admin/blog/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteArticle(id);
    res.json({ success: true });
  });

  // Work Library
  app.get("/api/work-library", async (req, res) => {
    const category = req.query.category as string | undefined;
    if (category) {
      const items = await storage.getWorkItemsByCategory(category);
      return res.json(items);
    }
    const items = await storage.getPublishedWorkItems();
    res.json(items);
  });

  app.get("/api/work-library/:slug", async (req, res) => {
    const item = await storage.getWorkItemBySlug(req.params.slug);
    if (!item || !item.published) return res.status(404).json({ message: "العمل غير موجود" });
    res.json(item);
  });

  app.get("/api/admin/work-library", requireAuth, async (_req, res) => {
    const items = await storage.getWorkItems();
    res.json(items);
  });

  app.post("/api/admin/work-library", requireAuth, async (req, res) => {
    const parsed = insertWorkItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "بيانات غير صحيحة", errors: parsed.error.errors });
    const item = await storage.createWorkItem(parsed.data);
    res.status(201).json(item);
  });

  app.put("/api/admin/work-library/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateWorkItem(id, req.body);
    res.json(item);
  });

  app.delete("/api/admin/work-library/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteWorkItem(id);
    res.json({ success: true });
  });

  // Digital Solutions
  app.get("/api/solutions", async (req, res) => {
    const type = req.query.type as string | undefined;
    if (type) {
      const items = await storage.getDigitalSolutionsByType(type);
      return res.json(items);
    }
    const items = await storage.getPublishedDigitalSolutions();
    res.json(items);
  });

  app.get("/api/solutions/:slug", async (req, res) => {
    const item = await storage.getDigitalSolutionBySlug(req.params.slug);
    if (!item || !item.published) return res.status(404).json({ message: "الحل غير موجود" });
    res.json(item);
  });

  app.get("/api/admin/solutions", requireAuth, async (_req, res) => {
    const items = await storage.getDigitalSolutions();
    res.json(items);
  });

  app.post("/api/admin/solutions", requireAuth, async (req, res) => {
    const parsed = insertDigitalSolutionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "بيانات غير صحيحة", errors: parsed.error.errors });
    const item = await storage.createDigitalSolution(parsed.data);
    res.status(201).json(item);
  });

  app.put("/api/admin/solutions/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await storage.updateDigitalSolution(id, req.body);
    res.json(item);
  });

  app.delete("/api/admin/solutions/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteDigitalSolution(id);
    res.json({ success: true });
  });

  // Dashboard
  app.get("/api/admin/dashboard", requireAuth, async (_req, res) => {
    const [messages, unread, settings, svcs, arts, workLibrary, solutions] = await Promise.all([
      storage.getContactMessages(),
      storage.getUnreadCount(),
      storage.getSiteSettings(),
      storage.getServices(),
      storage.getArticles(),
      storage.getWorkItems(),
      storage.getDigitalSolutions(),
    ]);
    res.json({
      totalMessages: messages.length,
      unreadMessages: unread,
      totalSettings: settings.length,
      totalServices: svcs.length,
      totalBlogPosts: arts.length,
      totalWorkItems: workLibrary.length,
      totalSolutions: solutions.length,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function seedAdmin() {
  const existing = await storage.getUserByUsername("admin");
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);
    await storage.createUser({ username: "admin", password: hashed });
    console.log("Admin user created: admin / admin123");
  }
}

async function seedServices() {
  const existing = await storage.getServices();
  if (existing.length > 0) return;

  const serviceData = [
    {
      title: "إعداد وتصميم الخطة الاستراتيجية",
      slug: "strategic-planning",
      description: "نعمل على إعداد وتصميم الخطة الاستراتيجية والتي تهدف إلى رسم مسار المنظمة للسنوات القادمة، من خلال تحديد الرؤية والرسالة والقيم والأهداف الاستراتيجية، وتحليل البيئة الداخلية والخارجية، وتصميم المبادرات والبرامج المحققة للأهداف مع مؤشرات قياس الأداء.",
      deliverables: ["تحليل البيئة الداخلية والخارجية (SWOT)", "صياغة الرؤية والرسالة والقيم", "تحديد الأهداف الاستراتيجية", "تصميم المبادرات والبرامج", "مؤشرات قياس الأداء KPIs", "خارطة طريق التنفيذ"],
      icon: "Target",
      sortOrder: 1,
      published: true,
    },
    {
      title: "إعداد وتصميم الخطط السنوية",
      slug: "annual-plans",
      description: "إعداد وتصميم الخطة السنوية والتي توضح خارطة العمل حيث أنها مجموعة من البرامج والأنشطة المراد تنفيذها خلال العام لتحقيق الأهداف التنفيذية المنبثقة من الأهداف الاستراتيجية.",
      deliverables: ["ترجمة الأهداف الاستراتيجية إلى أهداف تنفيذية", "إعداد استمارة تخطيط البرامج والأنشطة", "إعداد مؤشرات قياس الأداء التشغيلية KPIs", "تركيز الجهود نحو هدف مشترك", "تحديد الإجراءات اللازم اتخاذها"],
      icon: "FileText",
      sortOrder: 2,
      published: true,
    },
    {
      title: "إعداد وتصميم التقارير السنوية ودليل البرامج",
      slug: "reports-guides",
      description: "العمل على إعداد تقارير سنوية للمشاريع يتم تحديد عدد المستهدفين للعام السابق، ودليل برامج يحدد المشاريع الخاصة بالجهة والتكلفة المطلوبة.",
      deliverables: ["التقرير السنوي الشامل", "دليل البرامج والمشاريع", "دليل اللجان والمهام", "تصميم احترافي", "إحصائيات وبيانات المستهدفين"],
      icon: "BookOpen",
      sortOrder: 3,
      published: true,
    },
    {
      title: "إعداد فيديوهات الموشن جرافيك",
      slug: "motion-graphics",
      description: "تصميم وإنتاج فيديوهات موشن جرافيك احترافية تعكس رسالة المؤسسة وتجذب الجمهور المستهدف.",
      deliverables: ["كتابة السيناريو والنص", "تصميم الرسوم المتحركة", "التعليق الصوتي الاحترافي", "المونتاج والإخراج النهائي", "تسليم بصيغ متعددة"],
      icon: "Video",
      sortOrder: 4,
      published: true,
    },
    {
      title: "تصميم الخطة التسويقية",
      slug: "marketing-plan",
      description: "إعداد وتصميم خطط تسويقية متكاملة تساعد المنظمات على الوصول لجمهورها المستهدف.",
      deliverables: ["تحليل السوق والمنافسين", "تحديد الجمهور المستهدف", "استراتيجية المحتوى", "خطة القنوات التسويقية", "مؤشرات قياس الأداء التسويقي"],
      icon: "TrendingUp",
      sortOrder: 5,
      published: true,
    },
    {
      title: "إعداد وتصميم المبادرات المجتمعية",
      slug: "community-initiatives",
      description: "تصميم وتطوير مبادرات مجتمعية مبتكرة تخدم المجتمع وتعزز دور المؤسسة في تحقيق التنمية المستدامة.",
      deliverables: ["تصميم المبادرة وأهدافها", "خطة التنفيذ والجدول الزمني", "تحديد الشركاء والداعمين", "أدوات المتابعة والتقييم", "تقارير الأثر المجتمعي"],
      icon: "Heart",
      sortOrder: 6,
      published: true,
    },
    {
      title: "إعداد وتصميم الأدلة الإجرائية",
      slug: "procedural-guides",
      description: "إعداد وتصميم الأدلة الإجرائية التي تنظم العمليات المؤسسية وتوثقها في أدلة شاملة.",
      deliverables: ["دليل السياسات والإجراءات", "الهيكل التنظيمي", "الأوصاف الوظيفية", "نماذج العمل المعتمدة", "مصفوفة الصلاحيات"],
      icon: "ClipboardList",
      sortOrder: 7,
      published: true,
    },
    {
      title: "تصميم الهوية البصرية والإعلام الرقمي",
      slug: "visual-identity",
      description: "إنشاء هوية بصرية مميزة تعكس قيم المؤسسة وأهدافها مع تصميم محتوى رقمي احترافي.",
      deliverables: ["تصميم الشعار والهوية", "دليل الهوية البصرية", "تصميم المطبوعات", "بوستات السوشيال ميديا", "إنفوجرافيك احترافي"],
      icon: "Palette",
      sortOrder: 8,
      published: true,
    },
    {
      title: "تصميم المواقع الإلكترونية والمتاجر",
      slug: "websites-stores",
      description: "تطوير مواقع إلكترونية ومتاجر رقمية متكاملة تعكس احترافية المؤسسة.",
      deliverables: ["تصميم واجهة المستخدم UI/UX", "تطوير الموقع بأحدث التقنيات", "نظام إدارة المحتوى", "تحسين محركات البحث SEO", "الدعم الفني المستمر"],
      icon: "Monitor",
      sortOrder: 9,
      published: true,
    },
  ];

  for (const svc of serviceData) {
    await storage.createService(svc);
  }
  console.log("Seeded 9 services");
}

async function seedWorkItems() {
  const existing = await storage.getWorkItems();
  if (existing.length > 0) return;

  const workData = [
    {
      title: "إعداد الخطة الاستراتيجية لجمعية البر بخيبر",
      slug: "strategic-plan-khaibar",
      description: "إعداد الخطة الاستراتيجية لجمعية البر بخيبر لرسم مسار المنظمة للسنوات القادمة",
      content: "تم إعداد الخطة الاستراتيجية لجمعية البر بخيبر والتي تهدف إلى رسم مسار المنظمة للسنوات القادمة، من خلال تحديد الرؤية والرسالة والقيم والأهداف الاستراتيجية، وتحليل البيئة الداخلية والخارجية.",
      category: "strategic-planning" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/05/1-960x750.jpg",
      published: true,
    },
    {
      title: "الخطة الاستراتيجية لجمعية نماء للخدمات الوقفية",
      slug: "strategic-plan-namaa",
      description: "إعداد الخطة الاستراتيجية لجمعية نماء للخدمات الوقفية بعرعر",
      content: "تم إعداد الخطة الاستراتيجية لجمعية نماء للخدمات الوقفية بعرعر والتي تسعى لتحقيق أهدافها وترجمة الرؤية الاستراتيجية إلى واقع عمل ملموس.",
      category: "strategic-planning" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/05/3-960x750.jpg",
      published: true,
    },
    {
      title: "إعداد الخطة السنوية لجمعية البر بخليص",
      slug: "annual-plan-khulais",
      description: "إعداد الخطة السنوية لجمعية البر بخليص لترجمة الأهداف الاستراتيجية",
      content: "إعداد الخطة السنوية لجمعية البر بخليص والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل من خلال برامج ومشاريع متنوعة.",
      category: "annual-plans" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/05/11-960x750.jpg",
      published: true,
    },
    {
      title: "الخطة السنوية لجمعية أصدقاء مرضى السكر",
      slug: "annual-plan-diabetes-friends",
      description: "إعداد الخطة السنوية لجمعية أصدقاء مرضى السكر الخيرية",
      content: "إعداد الخطة السنوية لجمعية أصدقاء مرضى السكر الخيرية والتي تسعى لتحقيق أهدافها وترجمة هذه الأهداف لواقع العمل.",
      category: "annual-plans" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/06/8-960x750.jpg",
      published: true,
    },
    {
      title: "دليل الهيكل التنظيمي لجمعية الدعوة والإرشاد بجدة",
      slug: "procedural-guide-dawah-jeddah",
      description: "إعداد دليل الهيكل التنظيمي لجمعية الدعوة والإرشاد وتوعية الجاليات",
      content: "إعداد دليل الهيكل التنظيمي للجمعية والتي تسعى من خلاله إلى تنظيم عمل الجمعية وتحديد الوظائف الرئيسة للجمعية ووصف كل وظيفة.",
      category: "procedural-guides" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/06/45-min-1-960x750.jpg",
      published: true,
    },
    {
      title: "دليل الهيكل التنظيمي لجمعية رعاية الطفولة",
      slug: "procedural-guide-childhood",
      description: "إعداد دليل الهيكل التنظيمي لجمعية رعاية الطفولة",
      content: "إعداد دليل الهيكل التنظيمي لجمعية رعاية الطفولة والتي تسعى من خلاله إلى تنظيم عمل الجمعية وتحديد الوظائف الرئيسة.",
      category: "procedural-guides" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/06/46-min-1-960x750.jpg",
      published: true,
    },
    {
      title: "مبادرة التوعية المجتمعية لجمعية كفى",
      slug: "community-initiative-kafa",
      description: "تصميم مبادرة مجتمعية للتوعية بأضرار التدخين والمخدرات",
      content: "تصميم وتنفيذ مبادرة مجتمعية شاملة لجمعية كفى للتوعية بأضرار التدخين والمخدرات بمنطقة مكة المكرمة تستهدف شرائح متعددة من المجتمع.",
      category: "community-initiatives" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/06/39-min-1-960x750.jpg",
      published: true,
    },
    {
      title: "موشن جرافيك تعريفي لجمعية الثريا للمكفوفين",
      slug: "motion-graphic-thuraya",
      description: "إنتاج فيديو موشن جرافيك تعريفي لجمعية الثريا للمكفوفين بجازان",
      content: "تصميم وإنتاج فيديو موشن جرافيك احترافي يعرض رسالة وأهداف وإنجازات جمعية الثريا للمكفوفين بجازان بأسلوب بصري جذاب.",
      category: "motion-graphics" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/06/27-min-1-960x750.jpg",
      published: true,
    },
    {
      title: "موشن جرافيك لجمعية إصلاح ذات البين بخليص",
      slug: "motion-graphic-islah",
      description: "إنتاج فيديو موشن جرافيك لجمعية إصلاح ذات البين بخليص",
      content: "تصميم وإنتاج فيديو موشن جرافيك يعرض إنجازات وبرامج جمعية إصلاح ذات البين بخليص بأسلوب بصري احترافي.",
      category: "motion-graphics" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/06/23-2-960x750.jpg",
      published: true,
    },
    {
      title: "دليل البرامج لجمعية تكنولوجيا الهندسة الطبية",
      slug: "programs-guide-medical-engineering",
      description: "إعداد دليل البرامج لجمعية تكنولوجيا الهندسة الطبية",
      content: "إعداد دليل البرامج لجمعية تكنولوجيا الهندسة الطبية والتي تسعى من خلاله إلى إظهار مسار العمل والبرامج والأهداف.",
      category: "procedural-guides" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/06/40-min-1-960x750.jpg",
      published: true,
    },
  ];

  for (const item of workData) {
    await storage.createWorkItem(item);
  }
  console.log("Seeded work library items");
}

async function seedBlogPosts() {
  const existing = await storage.getArticles();
  if (existing.length > 0) return;

  const blogData = [
    {
      title: "ولادة حلم تطلق منصة أداء لقياس الأداء المؤسسي",
      slug: "launch-adaa-platform",
      excerpt: "أطلقت ولادة حلم للاستشارات والأبحاث منصة أداء الرقمية المتكاملة لقياس ومتابعة الأداء المؤسسي للمنظمات غير الربحية",
      content: "أطلقت ولادة حلم للاستشارات والأبحاث منصة أداء الرقمية المتكاملة لقياس ومتابعة الأداء المؤسسي للمنظمات غير الربحية. تتيح المنصة للمنظمات متابعة مؤشرات الأداء الرئيسية وتقييم مدى تحقيق الأهداف الاستراتيجية والتشغيلية بشكل دوري ومنهجي.",
      category: "news" as const,
      publishDate: "2025-01-15",
      published: true,
    },
    {
      title: "شراكة استراتيجية مع وزارة الموارد البشرية والتنمية الاجتماعية",
      slug: "partnership-hrsd",
      excerpt: "توقيع مذكرة تفاهم مع وزارة الموارد البشرية لتعزيز قدرات القطاع غير الربحي",
      content: "وقعت ولادة حلم للاستشارات والأبحاث مذكرة تفاهم مع وزارة الموارد البشرية والتنمية الاجتماعية بهدف تعزيز قدرات المنظمات غير الربحية وتطوير أدائها المؤسسي وفق أفضل الممارسات العالمية.",
      category: "news" as const,
      publishDate: "2025-02-01",
      published: true,
    },
    {
      title: "أهمية التخطيط الاستراتيجي للمنظمات غير الربحية",
      slug: "importance-strategic-planning",
      excerpt: "كيف يساهم التخطيط الاستراتيجي في تعزيز كفاءة وفاعلية المنظمات غير الربحية",
      content: "يعد التخطيط الاستراتيجي أحد أهم الأدوات الإدارية التي تساعد المنظمات غير الربحية على تحديد مسارها المستقبلي وتحقيق أهدافها بكفاءة وفاعلية. يتضمن التخطيط الاستراتيجي تحليل البيئة الداخلية والخارجية وتحديد نقاط القوة والضعف والفرص والتهديدات.",
      category: "article" as const,
      publishDate: "2025-01-20",
      published: true,
    },
    {
      title: "دليلك الشامل لقياس الأثر المجتمعي",
      slug: "guide-community-impact",
      excerpt: "دليل شامل حول كيفية قياس الأثر المجتمعي للمبادرات والبرامج في القطاع غير الربحي",
      content: "قياس الأثر المجتمعي هو عملية منهجية لتقييم التغييرات الإيجابية التي تحدثها المبادرات والبرامج في المجتمع. يساعد قياس الأثر المنظمات على فهم مدى نجاح برامجها وتحسين أدائها المستقبلي.",
      category: "article" as const,
      publishDate: "2025-01-25",
      published: true,
    },
    {
      title: "نشرة حقّق - العدد الأول: مستقبل القطاع غير الربحي",
      slug: "newsletter-issue-1",
      excerpt: "العدد الأول من نشرة حقّق البريدية يتناول مستقبل القطاع غير الربحي في المملكة",
      content: "نسعد بتقديم العدد الأول من نشرة حقّق البريدية والتي تهدف إلى إثراء المحتوى المعرفي في القطاع غير الربحي. في هذا العدد نتناول مستقبل القطاع غير الربحي في المملكة العربية السعودية في ظل رؤية 2030.",
      category: "newsletter" as const,
      publishDate: "2025-02-05",
      published: true,
    },
    {
      title: "نشرة حقّق - العدد الثاني: أفضل ممارسات الحوكمة",
      slug: "newsletter-issue-2",
      excerpt: "العدد الثاني من نشرة حقّق يتناول أفضل ممارسات الحوكمة في المنظمات غير الربحية",
      content: "في العدد الثاني من نشرة حقّق نستعرض أفضل ممارسات الحوكمة في المنظمات غير الربحية وكيفية تطبيقها لتحقيق الشفافية والمساءلة وتعزيز الثقة مع الجهات المانحة والمستفيدين.",
      category: "newsletter" as const,
      publishDate: "2025-02-10",
      published: true,
    },
  ];

  for (const post of blogData) {
    await storage.createArticle(post);
  }
  console.log("Seeded blog posts");
}

async function seedDigitalSolutions() {
  const existing = await storage.getDigitalSolutions();
  if (existing.length > 0) return;

  const solutionData = [
    {
      title: 'منصة "أداء" لقياس الأداء المؤسسي',
      slug: "adaa-platform",
      description: "منصة رقمية متكاملة لقياس ومتابعة الأداء المؤسسي للمنظمات غير الربحية",
      content: 'منصة "أداء" هي منصة رقمية متكاملة تم تطويرها خصيصاً للمنظمات غير الربحية لقياس ومتابعة الأداء المؤسسي. تتيح المنصة للمنظمات إدخال مؤشرات الأداء الرئيسية ومتابعة تحقيق الأهداف الاستراتيجية والتشغيلية بشكل دوري.',
      solutionType: "platform" as const,
      published: true,
    },
    {
      title: "مختبرات حقّق الاجتماعية",
      slug: "haqqiq-labs",
      description: "مختبرات ابتكار اجتماعي لتطوير حلول إبداعية للتحديات المجتمعية",
      content: "مختبرات حقّق الاجتماعية هي مساحات ابتكار تجمع بين المتخصصين والممارسين لتطوير حلول إبداعية ومبتكرة للتحديات التي تواجه القطاع غير الربحي والمجتمع.",
      solutionType: "platform" as const,
      published: true,
    },
    {
      title: "مسرعة أثر وريادة",
      slug: "athar-accelerator",
      description: "برنامج تسريع لدعم المنظمات غير الربحية الناشئة وتعزيز أثرها المجتمعي",
      content: "مسرعة أثر وريادة هي برنامج متكامل لتسريع نمو المنظمات غير الربحية الناشئة من خلال التدريب والإرشاد والدعم التقني لتعزيز أثرها المجتمعي وتحقيق الاستدامة.",
      solutionType: "platform" as const,
      published: true,
    },
    {
      title: "أكاديمية حقّق 360",
      slug: "haqqiq-academy",
      description: "منصة تعليمية متخصصة في بناء قدرات العاملين في القطاع غير الربحي",
      content: "أكاديمية حقّق 360 هي منصة تعليمية متخصصة تقدم دورات تدريبية وبرامج تأهيلية لبناء قدرات العاملين في القطاع غير الربحي في مجالات التخطيط والحوكمة والقيادة والإدارة.",
      solutionType: "platform" as const,
      published: true,
    },
    {
      title: "بودكاست حقّق",
      slug: "haqqiq-podcast",
      description: "بودكاست متخصص في القطاع غير الربحي يناقش أبرز التحديات والفرص",
      content: "بودكاست حقّق هو بودكاست متخصص يهدف إلى إثراء المحتوى المعرفي في القطاع غير الربحي من خلال استضافة قادة ومتخصصين ومناقشة أبرز التحديات والفرص والتجارب الناجحة.",
      solutionType: "platform" as const,
      link: "https://open.spotify.com",
      published: true,
    },
    {
      title: "دراسة حالة: تحول رقمي لجمعية البر بخيبر",
      slug: "case-study-khaibar-digital",
      description: "كيف ساهمت ولادة حلم في التحول الرقمي لجمعية البر بخيبر",
      content: "دراسة حالة تفصيلية توضح كيف ساهمت ولادة حلم في مساعدة جمعية البر بخيبر على التحول الرقمي من خلال تطوير نظام إدارة متكامل وتدريب الفريق.",
      solutionType: "case-study" as const,
      imageUrl: "https://bod.com.sa/wp-content/uploads/2024/05/1-960x750.jpg",
      published: true,
    },
    {
      title: "إصدار: دليل التخطيط الاستراتيجي للمنظمات غير الربحية",
      slug: "publication-strategic-guide",
      description: "دليل شامل يوضح خطوات إعداد الخطة الاستراتيجية للمنظمات غير الربحية",
      content: "إصدار متخصص يقدم منهجية متكاملة لإعداد الخطة الاستراتيجية للمنظمات غير الربحية، يشمل الأدوات والنماذج والأمثلة التطبيقية.",
      solutionType: "publication" as const,
      published: true,
    },
    {
      title: "إصدار: دليل الحوكمة المؤسسية",
      slug: "publication-governance-guide",
      description: "دليل متكامل لتطبيق معايير الحوكمة في المنظمات غير الربحية",
      content: "إصدار متخصص في الحوكمة المؤسسية يوضح المعايير والممارسات المثلى لتطبيق الحوكمة في المنظمات غير الربحية بما يتوافق مع الأنظمة السعودية.",
      solutionType: "publication" as const,
      published: true,
    },
  ];

  for (const sol of solutionData) {
    await storage.createDigitalSolution(sol);
  }
  console.log("Seeded digital solutions");
}
