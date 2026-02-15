import { ChevronLeftIcon, ChevronRightIcon, MailIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "الرئيسية", active: false },
  { label: "من نحن", active: false },
  { label: "خدماتنا", active: false },
  { label: "مقالات", active: true },
  { label: "تواصل معنا", active: false },
];

const filterTags = [
  { label: "الكل", active: true },
  { label: "القيادة", active: false },
  { label: "التقييم", active: false },
  { label: "الشراكات", active: false },
  { label: "التسويق", active: false },
  { label: "تحليل البيانات", active: false },
  { label: "إدارة المشاريع", active: false },
  { label: "دراسات حالة", active: false },
  { label: "المنظمات غير الربحية", active: false },
  { label: "ريادة الأعمال", active: false },
  { label: "التكنولوجيا", active: false },
];

const featuredArticle = {
  category: "ريادة الأعمال",
  title: "كيف تطلق مشروعك الناجح في السوق العربي؟",
  description:
    "دليل شامل للمبتدئين ورواد الأعمال لتحديد الفكرة وبناء الخطة والتغلب على التحديات المحلية.",
  date: "2024-10-27",
};

const articles = [
  {
    category: "المنظمات غير الربحية",
    title: "أهمية التخطيط الاستراتيجي للمؤسسات غير الربحية",
    description:
      "تعرف على كيفية صياغة رؤية ورسالة واضحة وتحويلها إلى أهداف قابلة للتحقيق.",
    date: "2024-10-25",
  },
  {
    category: "دراسات حالة",
    title: "دراسة حالة: عباق وتمكين المجتمعات الريفية",
    description:
      "نستعرض في هذه الدراسة كيف ساهمت مبادرات عباق في تحسين سبل عيش الأسر في المناطق الريفية.",
    date: "2024-10-22",
  },
  {
    category: "إدارة المشاريع",
    title: "بناء فريق عمل فعال: نصائح وإرشادات",
    description: "كيف تختار الأعضاء المناسبين وتحفزهم لتحقيق أهداف مشتركة.",
    date: "2024-10-20",
  },
  {
    category: "المنظمات غير الربحية",
    title: "أفضل الممارسات في إدارة المتطوعين",
    description:
      "استراتيجيات لتوظيف المتطوعين وتدريبهم والاحتفاظ بهم بشكل فعال.",
    date: "2024-10-18",
  },
  {
    category: "تحليل البيانات",
    title: "تحليل البيانات لتحسين الأداء المؤسسي",
    description: "كيف تستخدم البيانات لاتخاذ قرارات مستنيرة وتحقيق نتائج أفضل.",
    date: "2024-10-15",
  },
  {
    category: "التسويق",
    title: "التسويق الرقمي للمبادرات الاجتماعية",
    description:
      "استغل قوة الأدوات الرقمية للوصول إلى جمهور أوسع وتعزيز رسالتك.",
    date: "2024-10-13",
  },
];

const footerSections = [
  {
    title: "عباق",
    links: ["الرئيسية", "من نحن", "فريقنا"],
  },
  {
    title: "خدمات",
    links: ["استشارات", "مقالات", "تواصل"],
  },
  {
    title: "دعم",
    links: ["الأسئلة الشائعة", "سياسة الخصوصية", "شروط الخدمة"],
  },
  {
    title: "المجتمع",
    links: ["المدونة", "الندوات", "الفعاليات"],
  },
];

export const ArticlesSubsection = (): JSX.Element => {
  return (
    <div className="w-full bg-white overflow-hidden">
      <nav className="flex items-center justify-center h-14 bg-white border-b shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
        <div className="flex items-center gap-6 [direction:rtl]">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`text-sm font-medium [font-family:'Inter',Helvetica] ${
                item.active ? "text-[#636ae8]" : "text-[#242524]"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="ml-[438px] text-lg font-medium text-[#242524] [font-family:'Inter',Helvetica] [direction:rtl]">
            Ibaaq-عباق
          </div>
        </div>
      </nav>

      <main className="max-w-[1184px] mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-[#242524] text-center mb-6 [font-family:'Cairo',Helvetica] [direction:rtl]">
          مقالات ومدونات عباق
        </h1>

        <p className="text-lg text-[#8c8d8b] text-center mb-12 [font-family:'Inter',Helvetica] [direction:rtl]">
          استكشف أحدث المقالات، دراسات الحالة، والموارد التي تساعدك في رحلتك نحو
          التنمية المستدامة.
        </p>

        <div className="flex flex-wrap gap-2 justify-center mb-12 [direction:rtl]">
          {filterTags.map((tag, index) => (
            <Button
              key={index}
              variant={tag.active ? "default" : "outline"}
              className={`h-auto px-3 py-2 text-sm [font-family:'Inter',Helvetica] ${
                tag.active
                  ? "bg-[#636ae8] text-white hover:bg-[#636ae8]/90"
                  : "bg-white text-[#242524] border-[#ebebea] hover:bg-gray-50"
              }`}
            >
              {tag.label}
            </Button>
          ))}
        </div>

        <Card className="mb-12 overflow-hidden border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-[#c4c4c4] aspect-video md:aspect-auto" />
              <div className="p-6 flex flex-col justify-between [direction:rtl]">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-4 text-xs text-[#8c8d8b] border-[#8c8d8b80] [font-family:'Inter',Helvetica]"
                  >
                    {featuredArticle.category}
                  </Badge>
                  <h2 className="text-2xl font-semibold text-[#242524] mb-4 [font-family:'Cairo',Helvetica]">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-base text-[#8c8d8b] mb-6 [font-family:'Inter',Helvetica]">
                    {featuredArticle.description}
                  </p>
                </div>
                <time className="text-sm text-[#8c8d8b] [font-family:'Inter',Helvetica]">
                  {featuredArticle.date}
                </time>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {articles.map((article, index) => (
            <Card
              key={index}
              className="overflow-hidden border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]"
            >
              <CardContent className="p-0">
                <div
                  className={`${
                    index < 3 ? "bg-[#c4c4c4]" : "bg-[#d9d9d9]"
                  } aspect-video`}
                />
                <div className="p-4 [direction:rtl]">
                  <Badge
                    variant="outline"
                    className="mb-2 text-xs text-[#8c8d8b] border-[#8c8d8b80] [font-family:'Inter',Helvetica]"
                  >
                    {article.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-[#242524] mb-3 [font-family:'Cairo',Helvetica] line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#8c8d8b] mb-4 [font-family:'Inter',Helvetica] line-clamp-2">
                    {article.description}
                  </p>
                  <time className="text-xs text-[#8c8d8b] [font-family:'Inter',Helvetica]">
                    {article.date}
                  </time>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <Button
            variant="ghost"
            className="h-auto gap-2 text-sm font-medium text-[#242524] [font-family:'Inter',Helvetica]"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            className="w-10 h-10 text-sm font-medium text-[#242524] border-[#ebebea] [font-family:'Inter',Helvetica]"
          >
            1
          </Button>
          <Button
            variant="ghost"
            className="h-auto text-sm font-medium text-[#242524] [font-family:'Inter',Helvetica]"
          >
            2
          </Button>
          <Button
            variant="ghost"
            className="h-auto gap-2 text-sm font-medium text-[#242524] [font-family:'Inter',Helvetica]"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>

        <Card className="overflow-hidden border-0 shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] bg-gradient-to-r from-[#2563eb] to-[#22c55e]">
          <CardContent className="p-12 text-center [direction:rtl]">
            <h2 className="text-4xl font-bold text-white mb-4 [font-family:'Cairo',Helvetica]">
              اشترك في نشرتنا الإخبارية
            </h2>
            <p className="text-lg text-white/90 mb-8 [font-family:'Inter',Helvetica]">
              كن أول من يعلم بأحدث مقالاتنا وأخبارنا.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white [font-family:'Inter',Helvetica] h-auto py-2"
              />
              <Button className="bg-white text-[#171a1f] hover:bg-white/90 [font-family:'Inter',Helvetica] h-auto px-6">
                اشترك
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] py-16">
        <div className="max-w-[1232px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#242524] mb-6 [font-family:'Inter',Helvetica] [direction:rtl]">
              Ibaaq-عباق
            </h2>
            <p className="text-lg font-semibold text-[#242524] mb-4 [font-family:'Cairo',Helvetica] [direction:rtl]">
              اشترك في نشرتنا الإخبارية
            </p>
            <div className="flex gap-2 max-w-md mx-auto [direction:rtl]">
              <Button className="bg-[#636ae8] text-white hover:bg-[#636ae8]/90 [font-family:'Inter',Helvetica] h-auto px-6">
                اشترك
              </Button>
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="border-[#ebebea] [font-family:'Inter',Helvetica] h-auto py-2 pr-10"
                />
                <MailIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8d8b]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 [direction:rtl]">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-[#242524] mb-4 [font-family:'Cairo',Helvetica]">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-base text-[#8c8d8b] hover:text-[#242524] [font-family:'Inter',Helvetica]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#ebebea]">
            <Button
              variant="outline"
              className="h-auto px-4 py-2 bg-[#f7f7f7] border-[#ebebea] text-[#8c8d8b] [font-family:'Inter',Helvetica]"
            >
              English
            </Button>

            <div className="flex items-center gap-2 text-sm text-[#8c8d8b] [font-family:'Inter',Helvetica] [direction:rtl]">
              <span>© 2025 Ibbaaq-عباق.</span>
              <span>•</span>
              <a href="#" className="hover:text-[#242524]">
                سياسة الخصوصية
              </a>
              <span>•</span>
              <a href="#" className="hover:text-[#242524]">
                شروط الخدمة
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="text-[#8c8d8b] hover:text-[#242524]">
                <img
                  src="/figmaAssets/twitter.svg"
                  alt="Twitter"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="text-[#8c8d8b] hover:text-[#242524]">
                <img
                  src="/figmaAssets/facebook.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="text-[#8c8d8b] hover:text-[#242524]">
                <img
                  src="/figmaAssets/linkedin.svg"
                  alt="Linkedin"
                  className="w-5 h-5"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
