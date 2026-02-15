import {
  CheckCircle2Icon,
  FileTextIcon,
  MailIcon,
  MessageSquareIcon,
  SendIcon,
  StepForwardIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const navigationItems = [
  { label: "الرئيسية", active: false },
  { label: "من نحن", active: false },
  { label: "خدماتنا", active: true },
  { label: "مقالات", active: false },
  { label: "تواصل معنا", active: false },
];

const serviceCards = [
  {
    icon: "/figmaAssets/container.svg",
    image: "",
    title: "الاتصال المؤسسي",
    description:
      "بناء وتعزيز صورة شركتك، وإدارة سمعتها، وتحقيق تواصل فعال مع الجمهور الداخلي والخارجي.",
  },
  {
    icon: "/figmaAssets/container-3.svg",
    image: "",
    title: "ادارة الهوية الرقمية",
    description:
      "تشكيل وتحسين حضورك الرقمي، وإدارة سمعتك عبر الإنترنت، وضمان تميزك في الفضاء الرقمي.",
  },
  {
    icon: "/figmaAssets/container-2.svg",
    image: "",
    title: "العلاقات العامة",
    description:
      "تطوير استراتيجيات علاقات عامة قوية، وبناء علاقات إيجابية مع وسائل الإعلام وأصحاب المصلحة.",
  },
  {
    icon: "/figmaAssets/container-1.svg",
    image: "",
    title: "طلبات الجوائز",
    description:
      "إعداد طلبات جوائز احترافية تبرز إنجازاتك وتزيد من فرص فوزك في المسابقات المرموقة.",
  },
];

const processSteps = [
  {
    number: "1",
    icon: FileTextIcon,
    title: "تقديم الطلب",
    description: "املأ نموذج الطلب عبر الإنترنت مع تحديد الخدمة المطلوبة.",
  },
  {
    number: "2",
    icon: MessageSquareIcon,
    title: "المراجعة والتواصل",
    description: "سيقوم فريقنا بمراجعة طلبك والتواصل معك لمزيد من التفاصيل.",
  },
  {
    number: "3",
    icon: StepForwardIcon,
    title: "بدء العمل",
    description:
      "بعد الاتفاق، نبدأ في تنفيذ الخدمة وفقا للجدول الزمني المتفق عليه.",
  },
  {
    number: "4",
    icon: CheckCircle2Icon,
    title: "التسليم والمتابعة",
    description: "نقدم لك النتائج النهائية ونتابع معك لضمان رضاك التام.",
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

export const ServicesSubsection = (): JSX.Element => {
  return (
    <div className="w-full bg-white" dir="rtl">
      <nav className="w-full h-14 bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] flex items-center justify-center px-4">
        <div className="flex items-center gap-6 max-w-[1440px] w-full justify-center">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`text-sm font-medium [font-family:'Inter',Helvetica] whitespace-nowrap ${
                item.active ? "text-[#636ae8]" : "text-[#242524]"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="mr-auto text-lg font-medium [font-family:'Inter',Helvetica] text-[#242524]">
            Ibaaq-عباق
          </div>
        </div>
      </nav>

      <section className="relative w-full h-[280px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[#8c8d8b] opacity-20" />
        <div className="relative z-10 text-center px-4 max-w-[1216px] w-full mx-auto">
          <h1 className="text-5xl font-bold [font-family:'Cairo',Helvetica] text-[#242524] leading-[48px] mb-[39px]">
            خدماتنا
          </h1>
          <p className="text-xl [font-family:'Inter',Helvetica] text-[#8c8d8b] leading-7 max-w-[768px] mx-auto">
            نقدم مجموعة شاملة من خدمات الاتصال والعلاقات العامة المصممة لمساعدتك
            على تحقيق أهدافك.
          </p>
        </div>
      </section>

      <section className="max-w-[1216px] mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold [font-family:'Cairo',Helvetica] text-[#242524] text-center mb-[102px]">
          اكتشف خدماتنا المتخصصة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {serviceCards.map((service, index) => (
            <Card
              key={index}
              className="border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]"
            >
              <CardContent className="p-0 flex flex-col">
                <div className="flex justify-center pt-[25px]">
                  <img
                    src={service.icon}
                    alt="Service icon"
                    className="w-14 h-14"
                  />
                </div>
                <div className="mx-[25px] mt-4 h-32 bg-[#c4c4c4] rounded-md" />
                <h3 className="text-lg font-semibold [font-family:'Cairo',Helvetica] text-[#242524] text-center mt-[21px] px-4">
                  {service.title}
                </h3>
                <p className="text-sm [font-family:'Inter',Helvetica] text-[#8c8d8b] text-center mt-5 px-[25px] pb-[25px] leading-5">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-16" />

        <div className="py-16">
          <h2 className="text-4xl font-bold [font-family:'Cairo',Helvetica] text-[#242524] text-center mb-[102px]">
            كيف يعمل طلب الخدمة؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#636ae8] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base font-bold [font-family:'Inter',Helvetica]">
                        {step.number}
                      </span>
                    </div>
                    <IconComponent className="w-5 h-5 text-[#242524] mt-0.5" />
                  </div>
                  <h3 className="text-base font-semibold [font-family:'Cairo',Helvetica] text-[#242524] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-sm [font-family:'Inter',Helvetica] text-[#8c8d8b] leading-5">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="my-16" />

        <Card className="border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] mt-16">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold [font-family:'Cairo',Helvetica] text-[#242524] text-center mb-[61px]">
              قدم طلب خدمة
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium [font-family:'Inter',Helvetica] text-[#242524]">
                    الاسم الكامل
                  </Label>
                  <Input
                    placeholder="ادخل اسمك"
                    className="h-[41px] border-[#ebebea] [font-family:'Inter',Helvetica] text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium [font-family:'Inter',Helvetica] text-[#242524]">
                    البريد الالكتروني
                  </Label>
                  <Input
                    placeholder="ادخل بريدك الالكتروني"
                    className="h-[41px] border-[#ebebea] [font-family:'Inter',Helvetica] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium [font-family:'Inter',Helvetica] text-[#242524]">
                  الخدمة المطلوبة
                </Label>
                <Select>
                  <SelectTrigger className="h-10 border-[#ebebea]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service1">الاتصال المؤسسي</SelectItem>
                    <SelectItem value="service2">
                      ادارة الهوية الرقمية
                    </SelectItem>
                    <SelectItem value="service3">العلاقات العامة</SelectItem>
                    <SelectItem value="service4">طلبات الجوائز</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium [font-family:'Inter',Helvetica] text-[#242524]">
                  رسالة
                </Label>
                <Textarea
                  placeholder="صف طلبك بالتفصيل"
                  className="min-h-[81px] border-[#ebebea] [font-family:'Inter',Helvetica] text-sm resize-none"
                />
              </div>

              <Button className="w-full h-10 bg-[#636ae8] hover:bg-[#5159d1] text-white [font-family:'Inter',Helvetica] text-sm">
                إرسال الطلب
                <SendIcon className="w-4 h-4 mr-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <footer className="w-full bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] py-16">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold [font-family:'Inter',Helvetica] text-[#242524] mb-[76px]">
              Ibaaq-عباق
            </h3>
            <p className="text-lg font-semibold [font-family:'Cairo',Helvetica] text-[#242524] mb-[47px]">
              اشترك في نشرتنا الإخبارية
            </p>
            <div className="flex justify-center items-center gap-2 max-w-md mx-auto">
              <Button className="h-10 bg-[#636ae8] hover:bg-[#5159d1] text-white text-sm [font-family:'Inter',Helvetica] px-4">
                اشترك
              </Button>
              <div className="relative flex-1">
                <Input
                  placeholder="ادخل بريدك الالكتروني"
                  className="h-[41px] border-[#ebebea] pr-10 [font-family:'Inter',Helvetica] text-sm"
                />
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#242524]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-[1232px] mx-auto">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-semibold [font-family:'Cairo',Helvetica] text-[#242524] mb-[37px]">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-base [font-family:'Inter',Helvetica] text-[#8c8d8b] hover:text-[#242524]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
            <Button
              variant="outline"
              className="h-9 px-4 bg-[#f7f7f7] border-[#ebebea] text-sm [font-family:'Inter',Helvetica] text-[#8c8d8b]"
            >
              English
            </Button>

            <div className="flex items-center gap-2 text-sm [font-family:'Inter',Helvetica] text-[#8c8d8b]">
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
              <a href="#" className="hover:opacity-80">
                <img
                  src="/figmaAssets/twitter-1.svg"
                  alt="Twitter"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="hover:opacity-80">
                <img
                  src="/figmaAssets/facebook.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="hover:opacity-80">
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
