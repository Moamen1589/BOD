import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  { label: "الرئيسية", active: false },
  { label: "من نحن", active: true },
  { label: "خدماتنا", active: false },
  { label: "مقالات", active: false },
  { label: "تواصل معنا", active: false },
];

const teamMembers = [
  {
    name: "محمد العلي",
    role: "المدير التنفيذي",
    description: "يقود الرؤية والإستراتيجية العامة لعباق.",
  },
  {
    name: "فاطمة الزهراء",
    role: "مدير العمليات",
    description: "تضمن سلاسة سير العمليات اليومية وكفاءتها.",
  },
  {
    name: "أحمد خالد",
    role: "رئيس قسم التكنولوجيا",
    description: "يشرف على تطوير وتنفيذ الحلول التقنية.",
  },
  {
    name: "نورا سعيد",
    role: "مسؤول التواصل المجتمعي",
    description: "تبني وتدير العلاقات مع شركاء المجتمع.",
  },
  {
    name: "علي حسن",
    role: "محلل بيانات أول",
    description: "يحلل البيانات لدعم القرارات الاستراتيجية.",
  },
  {
    name: "ليلى عبدالله",
    role: "مصممة منتجات",
    description: "تصمم تجارب مستخدم مبتكرة وفعالة.",
  },
  {
    name: "يوسف إبراهيم",
    role: "أخصائي استشارات",
    description: "يقدم الاستشارات للمستفيدين والشركات.",
  },
  {
    name: "سارة جمال",
    role: "مسؤول الموارد البشرية",
    description: "تهتم بتطوير وتنمية فريق عباق.",
  },
];

const impactStats = [
  { value: "10,000+", label: "مستفيد" },
  { value: "500+", label: "مشروع" },
  { value: "50+", label: "شريك" },
  { value: "1,000+", label: "متطوع" },
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

export const AboutUsSubsection = (): JSX.Element => {
  return (
    <div className="w-full bg-white overflow-hidden">
      <div className="relative bg-white">
        <header className="w-full h-14 flex items-center justify-center bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
          <nav className="flex items-center gap-6 [direction:rtl]">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className={`[font-family:'Inter',Helvetica] font-medium text-sm tracking-[0] leading-5 whitespace-nowrap ${
                  item.active ? "text-[#636ae8]" : "text-[#242524]"
                }`}
              >
                {item.label}
              </div>
            ))}
            <div className="ml-auto [font-family:'Inter',Helvetica] font-medium text-lg leading-7 text-[#242524] tracking-[0] whitespace-nowrap [direction:rtl]">
              Ibaaq-عباق
            </div>
          </nav>
        </header>

        <section className="w-full flex justify-center py-0 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <div className="w-full h-[400px] flex flex-col items-center justify-center bg-[#d9d9d9]">
              <h1 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-5xl text-center tracking-[0] leading-[48px] whitespace-nowrap [direction:rtl] mb-9">
                من نحن
              </h1>
              <p className="max-w-[768px] [font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-2xl text-center tracking-[0] leading-8 [direction:rtl]">
                نحن عباق، منصة مكرسة لتمكين المنظمات غير الربحية في الشرق الأوسط
                من خلال الابتكار وريادة الأعمال.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center py-24 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-end [direction:rtl]">
                <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl tracking-[0] leading-9 whitespace-nowrap mb-6">
                  رؤيتنا
                </h2>
                <p className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-lg tracking-[0] leading-7">
                  بناء منظومة بيئية مزدهرة للابتكار وريادة الأعمال في منطقة
                  الشرق الأوسط وشمال إفريقيا، حيث يمتلك الشباب الأدوات والمعرفة
                  اللازمة لقيادة التغيير الإيجابي في مجتمعاتهم.
                </p>
              </div>
              <div className="flex flex-col items-end [direction:rtl]">
                <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl tracking-[0] leading-9 whitespace-nowrap mb-6">
                  مهمتنا
                </h2>
                <p className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-lg tracking-[0] leading-7">
                  توفير برامج تدريبية شاملة، وفرص توجيه، ودعم مالي، وشبكات قوية
                  للشباب الطموحين، مع التركيز على بناء القدرات وتسهيل الوصول إلى
                  الموارد اللازمة لتحويل أفكارهم المبتكرة إلى مشاريع مستدامة
                  ومؤثرة.
                </p>
              </div>
            </div>
            <Separator className="mt-24" />
          </div>
        </section>

        <section className="w-full flex justify-center py-24 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl text-center tracking-[0] leading-9 whitespace-nowrap [direction:rtl] mb-12">
              فريقنا المخلص
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="border border-solid border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]"
                >
                  <CardContent className="flex flex-col items-center pt-6 pb-6">
                    <Avatar className="w-24 h-24 bg-[#ced0f8] mb-4">
                      <AvatarFallback className="bg-[#c4c4c4]" />
                    </Avatar>
                    <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#242524] text-xl text-center tracking-[0] leading-7 whitespace-nowrap [direction:rtl] mb-3">
                      {member.name}
                    </h3>
                    <p className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm text-center tracking-[0] leading-5 whitespace-nowrap [direction:rtl] mb-3">
                      {member.role}
                    </p>
                    <p className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm text-center tracking-[0] leading-5 [direction:rtl]">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Separator className="mt-24" />
          </div>
        </section>

        <section className="w-full flex justify-center py-24 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl text-center tracking-[0] leading-9 whitespace-nowrap [direction:rtl] mb-12">
              أثرنا الاجتماعي
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <Card
                  key={index}
                  className="border border-solid border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]"
                >
                  <CardContent className="flex flex-col items-center gap-3 pt-6 pb-6">
                    <div className="[font-family:'Inter',Helvetica] font-bold text-[#636ae8] text-4xl text-center tracking-[0] leading-10 whitespace-nowrap">
                      {stat.value}
                    </div>
                    <div className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-lg text-center tracking-[0] leading-7 whitespace-nowrap [direction:rtl]">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Separator className="mt-24" />
          </div>
        </section>

        <section className="w-full flex justify-center py-24 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl text-center tracking-[0] leading-9 whitespace-nowrap [direction:rtl] mb-8">
              انضم إلينا في رحلة التغيير
            </h2>
            <p className="max-w-[672px] mx-auto [font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-lg text-center tracking-[0] leading-7 [direction:rtl] mb-8">
              سواء كنت شابا طموحا، مرشدا خبيرا، أو شريكا محتملا، هناك مكان لك في
              عائلة عباق. تواصل معنا لمعرفة المزيد.
            </p>
            <div className="flex justify-center">
              <Button className="h-auto bg-[#636ae8] rounded-md px-6 py-3">
                <span className="[font-family:'Inter',Helvetica] font-normal text-white text-lg tracking-[0] leading-7 whitespace-nowrap [direction:rtl]">
                  تواصل معنا
                </span>
              </Button>
            </div>
          </div>
        </section>

        <footer className="w-full bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
          <div className="w-full max-w-[1440px] mx-auto px-4 py-16">
            <div className="flex flex-col items-center mb-16">
              <h3 className="font-bold text-2xl leading-8 [font-family:'Inter',Helvetica] text-[#242524] tracking-[0] whitespace-nowrap [direction:rtl] mb-8">
                Ibaaq-عباق
              </h3>
              <p className="[font-family:'Cairo',Helvetica] font-semibold text-[#242524] text-lg text-center tracking-[0] leading-7 whitespace-nowrap [direction:rtl] mb-6">
                اشترك في نشرتنا الإخبارية
              </p>
              <div className="flex items-center gap-2 [direction:rtl]">
                <Button className="h-auto bg-[#636ae8] rounded-md px-4 py-2">
                  <span className="[font-family:'Inter',Helvetica] font-normal text-white text-sm tracking-[0] leading-[22px] whitespace-nowrap [direction:rtl]">
                    اشترك
                  </span>
                </Button>
                <div className="relative">
                  <Input
                    defaultValue="أدخل بريدك الإلكتروني"
                    className="w-[362px] h-[41px] bg-white border-[#ebebea] rounded-md [font-family:'Inter',Helvetica] font-normal text-[#242524] text-sm tracking-[0] leading-[22px] [direction:rtl] pr-10"
                  />
                  <img
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    alt="Mail"
                    src="/figmaAssets/mail.svg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {footerSections.map((section, index) => (
                <div key={index} className="flex flex-col [direction:rtl]">
                  <h4 className="[font-family:'Cairo',Helvetica] font-semibold text-[#242524] text-sm tracking-[0] leading-5 whitespace-nowrap mb-4">
                    {section.title}
                  </h4>
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href="#"
                      className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-base tracking-[0] leading-6 whitespace-nowrap mb-4 hover:text-[#636ae8] transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#ebebea]">
              <Button
                variant="outline"
                className="h-auto bg-[#f7f7f7] rounded-md border border-solid border-[#ebebea] px-4 py-2"
              >
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-[22px] whitespace-nowrap">
                  English
                </span>
              </Button>

              <div className="flex items-center gap-2 [direction:rtl]">
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  © 2025 Ibbaaq-عباق.
                </span>
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  •
                </span>
                <a
                  href="#"
                  className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap hover:text-[#636ae8] transition-colors"
                >
                  سياسة الخصوصية
                </a>
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  •
                </span>
                <a
                  href="#"
                  className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap hover:text-[#636ae8] transition-colors"
                >
                  شروط الخدمة
                </a>
              </div>

              <div className="flex items-center gap-4">
                <img
                  className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
                  alt="Twitter"
                  src="/figmaAssets/twitter.svg"
                />
                <img
                  className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
                  alt="Facebook"
                  src="/figmaAssets/facebook.svg"
                />
                <img
                  className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
                  alt="Linkedin"
                  src="/figmaAssets/linkedin.svg"
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
