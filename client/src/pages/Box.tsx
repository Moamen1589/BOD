import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ArrowLeft,
  Globe,
  Shield,
  Vote,
  ClipboardCheck,
  Rocket,
  Send,
} from "lucide-react";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { VideoSection } from "@/components/VideoSection";
import { PartnersSection } from "@/components/PartnersSection";
import { ClientsSection } from "@/components/ClientsSection";
import { NewsletterSection } from "@/components/NewsletterSection";

const SAUDI_REGIONS = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "القصيم",
  "المنطقة الشرقية",
  "عسير",
  "تبوك",
  "حائل",
  "الحدود الشمالية",
  "جازان",
  "نجران",
  "الباحة",
  "الجوف",
];

const STAGES = [
  "مرحلة الفكرة",
  "ما قبل البذرة",
  "مرحلة البذرة",
  "السلسلة أ",
  "السلسلة ب",
  "السلسلة ج",
];

const LOOKING_FOR = [
  "مؤسس تقني مشارك",
  "شريك تقني",
  "فريق تطوير",
  "تمويل استثماري",
  "توجيه وإرشاد",
];

const CONTACT_VIA = ["الجوال", "الإيميل", "واتساب", "اجتماع مباشر"];

type EntrepreneurForm = {
  companyName: string;
  companyWebsite: string;
  region: string;
  stage: string;
  fullName: string;
  phone: string;
  email: string;
  lookingFor: string;
  contactVia: string;
  requiredCapital: string;
  annualRevenue: string;
};

const initialForm: EntrepreneurForm = {
  companyName: "",
  companyWebsite: "",
  region: "",
  stage: "",
  fullName: "",
  phone: "",
  email: "",
  lookingFor: "",
  contactVia: "",
  requiredCapital: "",
  annualRevenue: "",
};

export const Box = (): JSX.Element => {
  const [form, setForm] = useState<EntrepreneurForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (field: keyof EntrepreneurForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />

      {/* Simplified CTA Section for the Standalone Module */}
      <section className="py-14 md:py-20 bg-brand-light-gold">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-brand-dark rounded-[2.5rem] p-8 md:p-20 text-center relative overflow-hidden group border-b-8 border-brand-gold/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold opacity-10 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold opacity-10 rounded-full -ml-32 -mb-32 transition-transform duration-700 group-hover:scale-150"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <span className="bg-brand-gold text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block shadow-lg">
                إطلاق المنظومة الجديدة
              </span>
              <h2 className="text-3xl md:text-6xl font-black text-white mb-8 leading-tight">
                هل تريد بناء جمعية تُدار بالاحتراف؟
              </h2>
              <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
                اكتشف "المنظومة المجتمعية" - الحل المتكامل للتحول المؤسسي
                المستدام وتوثيق الأثر.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-gold hover:bg-brand-gold-dark text-white px-12 py-10 rounded-3xl text-xl font-black shadow-2xl shadow-brand-gold/30 hover:scale-105 transition-transform"
                >
                  <Link href="/ecstt" className="flex items-center gap-3">
                    ابدأ استكشاف المنظومة الآن
                    <ArrowLeft className="w-6 h-6" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 hover:bg-white/10 px-12 py-10 rounded-3xl text-xl font-bold text-[#ff6900]"
                >
                  <a
                    href="https://wa.me/966920031323"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                  >
                    تحدث مع مستشاري المنظومة
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoSection />
      <AboutSection />
      <ServicesSection />
      <SolutionsSection />

      {/* Community Platform Section */}
      <section className="py-20 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] -mr-60 -mt-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-center text-white text-3xl md:text-5xl font-black mb-4 leading-tight">
            المنظومة المجتمعية
          </h2>
          <p className="text-center text-white/50 mb-14 text-base max-w-2xl mx-auto">
            منصة تفاعلية تمكّن الجمعيات من التصويت على المبادرات، تقييم البرامج،
            ومشاركة التوصيات مع المجتمع غير الربحي
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-14">
            {[
              {
                icon: Vote,
                title: "المبادرات",
                desc: "صوّت وأثّر في قرارات المجتمع غير الربحي بشكل جماعي وشفاف",
                color: "bg-brand-gold",
                link: "/voting",
              },
              {
                icon: Globe,
                title: "قياس الأثر",
                desc: "تحليل ذكاء اصطناعي لقياس الأثر الاجتماعي الحقيقي لبرامجك",
                color: "bg-purple-500",
                link: "/impact",
              },
              {
                icon: Shield,
                title: "الحوكمة",
                desc: "أدوات الشفافية المالية والمساءلة لبرامجك ومشاريعك المجتمعية",
                color: "bg-blue-500",
                link: "/governance",
              },
              {
                icon: ClipboardCheck,
                title: "نموذج تقييم النضج",
                desc: "قيّم مستوى نضج جمعيتك المؤسسي واكتشف خارطة التحول الصحيحة",
                color: "bg-amber-500",
                link: "/ecstt",
              },
            ].map(({ icon: Icon, title, desc, color, link }) => (
              <Link
                key={link}
                href={link}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-gold/30 rounded-2xl p-6 transition-all duration-300 cursor-pointer block"
              >
                <div
                  className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-black text-lg mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                <div className="mt-5 flex items-center gap-2 text-brand-gold text-xs font-black group-hover:gap-3 transition-all">
                  ابدأ الآن <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/voting">
              <Button className="bg-brand-gold hover:bg-brand-gold-dark text-white px-10 py-5 rounded-2xl font-black text-base shadow-xl shadow-brand-gold/30 flex items-center gap-2">
                <Vote className="w-5 h-5" /> انضم للمنصة الاجتماعية
              </Button>
            </Link>
            <Link href="/ecstt">
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/10 px-10 py-5 rounded-2xl font-black text-base flex items-center gap-2"
              >
                استكشف المنظومة <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Entrepreneur Section */}
      <section className="py-20 bg-brand-light-gold relative overflow-hidden" dir="rtl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-gold/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left - Content */}
              <div>
                <span className="bg-brand-gold text-white px-5 py-2 rounded-full text-xs font-black tracking-wider inline-block mb-6">
                  رائد أعمال اجتماعي
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6 leading-tight">
                  روّاد الأعمال يصنعون التغيير
                </h2>
                <div className="space-y-5 text-brand-gray text-base leading-relaxed">
                  <p>
                    إذا كنت تبحث عن مؤسس تقني مشارك أو شريك تقني أو فريق تطوير تقني لشركتك الناشئة فلا حاجة للبحث أكثر من ذلك! ستصبح ولادة حلم شريكك التقني وسيتكفّل فريقنا ببناء منتجك التقني من الألف إلى الياء. نحن لا نكتفي بالاستثمار في الشركة الناشئة وإرشادها ودعمها ولكن نتكفّل أيضًا بعملية التطوير التقني كاملة.
                  </p>
                  <p>
                    إذا كانت لديك فكرة وتريد بناء منتج أو شركة ناشئة فيمكنك الانضمام إلى برنامج <strong>فكرة إلى منتج</strong>. تقوم ولادة حلم من خلال هذا البرنامج بدعم روّاد الأعمال في مراحل مبكّرة من خلال التحقق من الفكرة، أبحاث السوق، التطوير التقني للفكرة، والاستثمار.
                  </p>
                  <p>
                    إذا كانت لديك شركة ناشئة وتريد تحسين المبيعات أو دخول أسواق جديدة، فيمكنك الانضمام إلى برنامج <strong>حسّن مبيعاتك</strong>.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Rocket, label: "تأمين رأس المال", desc: "نساعدك في الحصول على التمويل اللازم" },
                    { icon: ClipboardCheck, label: "من فكرة إلى منتج", desc: "بناء شركتك من الصفر" },
                    { icon: Globe, label: "الشريك التقني", desc: "نغطي نصف التكاليف ونبني المنتج" },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-brand-gold/10">
                      <Icon className="w-8 h-8 text-brand-gold mb-3" />
                      <h4 className="font-black text-brand-dark text-sm mb-1">{label}</h4>
                      <p className="text-brand-gray text-xs">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Form */}
              <div className="bg-white rounded-[2rem] shadow-2xl p-8 border-t-4 border-brand-gold">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-dark mb-3">تم الإرسال بنجاح!</h3>
                    <p className="text-brand-gray">سيتواصل معك فريقنا قريبًا</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-black text-brand-dark mb-5">
                      انضم الآن معنا لتكون رائد أعمال اجتماعي
                    </h3>
                    <p className="text-xs text-brand-gray mb-4">الحقول المشار بـ * مطلوبة</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">أسم الشركة *</label>
                        <input
                          required
                          type="text"
                          value={form.companyName}
                          onChange={(e) => setField("companyName", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none"
                          placeholder="اسم الشركة"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">موقع الشركة</label>
                        <input
                          type="url"
                          value={form.companyWebsite}
                          onChange={(e) => setField("companyWebsite", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">المنطقة *</label>
                        <select
                          required
                          value={form.region}
                          onChange={(e) => setField("region", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none bg-white"
                        >
                          <option value="">اختر المنطقة</option>
                          {SAUDI_REGIONS.map((r) => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">المرحلة *</label>
                        <select
                          required
                          value={form.stage}
                          onChange={(e) => setField("stage", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none bg-white"
                        >
                          <option value="">اختر المرحلة</option>
                          {STAGES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">الأسم الكامل *</label>
                      <input
                        required
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none"
                        placeholder="الاسم الكامل"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">الهاتف / الجوال *</label>
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none"
                          placeholder="05xxxxxxxx"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">الإيميل *</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setField("email", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">أبحث عن *</label>
                        <select
                          required
                          value={form.lookingFor}
                          onChange={(e) => setField("lookingFor", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none bg-white"
                        >
                          <option value="">اختر</option>
                          {LOOKING_FOR.map((l) => <option key={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">أود التواصل عبر *</label>
                        <select
                          required
                          value={form.contactVia}
                          onChange={(e) => setField("contactVia", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none bg-white"
                        >
                          <option value="">اختر</option>
                          {CONTACT_VIA.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">رأس المال المطلوب *</label>
                        <input
                          required
                          type="text"
                          value={form.requiredCapital}
                          onChange={(e) => setField("requiredCapital", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none"
                          placeholder="مثال: 500,000 ريال"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">الدخل السنوي *</label>
                        <input
                          required
                          type="text"
                          value={form.annualRevenue}
                          onChange={(e) => setField("annualRevenue", e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-brand-gold focus:outline-none"
                          placeholder="مثال: 1,000,000 ريال"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white py-4 rounded-2xl font-black text-base shadow-lg mt-2"
                    >
                      {submitting ? "جارٍ الإرسال..." : "سجّل الآن"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyUsSection />
      <ClientsSection />
      <PartnersSection />
      <TestimonialsSection />
      <NewsletterSection />
      <ContactSection />
      <Footer />
    </div>
  );
};
