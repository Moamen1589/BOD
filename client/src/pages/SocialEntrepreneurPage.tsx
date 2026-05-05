import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight,
  Rocket,
  Send,
  CheckCircle,
  Globe,
  ClipboardCheck,
} from "lucide-react";

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

export default function SocialEntrepreneurPage() {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-brand-light-gold" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-12 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-gold/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-brand-gold mb-8 text-sm font-bold transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> الرئيسية
          </Link>
          <div className="flex items-start gap-5">
            <div className="bg-brand-gold w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="bg-brand-gold/20 text-brand-gold px-4 py-1 rounded-full text-xs font-black mb-3 inline-block">
                رائد أعمال اجتماعي
              </span>
              <h1 className="text-3xl md:text-5xl font-black leading-tight">
                انضم كرائد أعمال اجتماعي
              </h1>
              <p className="text-white/60 mt-3 text-base max-w-2xl">
                نبني معك من الفكرة إلى المنتج — سجّل بياناتك وسيتواصل معك فريقنا
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16 flex-1">
        <div className="max-w-5xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-16 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-brand-dark mb-4">تم الإرسال بنجاح!</h2>
              <p className="text-brand-gray text-lg mb-8">
                شكرًا على اهتمامك. سيتواصل معك فريق ولادة حلم في أقرب وقت ممكن.
              </p>
              <Link href="/">
                <Button className="bg-brand-gold text-white px-10 py-5 rounded-2xl font-black text-base">
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Left sidebar - marketing info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-brand-dark mb-4">
                    لماذا تنضم إلينا؟
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Rocket,
                        title: "تأمين رأس المال",
                        desc: "نساعدك في الحصول على التمويل اللازم لتحويل فكرتك إلى واقع",
                      },
                      {
                        icon: ClipboardCheck,
                        title: "من فكرة إلى منتج",
                        desc: "نبني شركتك من الصفر — من التحقق من الفكرة إلى الإطلاق",
                      },
                      {
                        icon: Globe,
                        title: "الشريك التقني",
                        desc: "نغطي نصف التكاليف ونبني المنتج بأعلى معايير الجودة",
                      },
                    ].map(({ icon: Icon, title, desc }) => (
                      <div
                        key={title}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-brand-gold/10 flex gap-4"
                      >
                        <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div>
                          <h4 className="font-black text-brand-dark text-sm mb-1">{title}</h4>
                          <p className="text-brand-gray text-xs leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-dark rounded-2xl p-6 text-white">
                  <p className="text-white/60 text-xs font-bold mb-2">تواصل مباشر</p>
                  <p className="font-black text-lg mb-1">920031323</p>
                  <p className="text-white/50 text-xs">أو تواصل معنا عبر واتساب</p>
                </div>
              </div>

              {/* Right - Form */}
              <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-2xl p-10 border-t-4 border-brand-gold">
                <h3 className="text-2xl mb-5 font-black text-brand-dark mb-2">
                  سجّل بياناتك الآن
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        أسم الشركة *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.companyName}
                        onChange={(e) => setField("companyName", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none text-brand-dark"
                        placeholder="اسم الشركة"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        موقع الشركة
                      </label>
                      <input
                        type="url"
                        value={form.companyWebsite}
                        onChange={(e) => setField("companyWebsite", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none text-brand-dark"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        المنطقة *
                      </label>
                      <select
                        required
                        value={form.region}
                        onChange={(e) => setField("region", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none bg-white text-brand-dark"
                      >
                        <option value="">اختر المنطقة</option>
                        {SAUDI_REGIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        المرحلة *
                      </label>
                      <select
                        required
                        value={form.stage}
                        onChange={(e) => setField("stage", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none bg-white text-brand-dark"
                      >
                        <option value="">اختر المرحلة</option>
                        {STAGES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1.5">
                      الاسم الكامل *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none text-brand-dark"
                      placeholder="الاسم الكامل"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        الهاتف / الجوال *
                      </label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none text-brand-dark"
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        البريد الإلكتروني *
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none text-brand-dark"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        أبحث عن *
                      </label>
                      <select
                        required
                        value={form.lookingFor}
                        onChange={(e) => setField("lookingFor", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none bg-white text-brand-dark"
                      >
                        <option value="">اختر</option>
                        {LOOKING_FOR.map((l) => (
                          <option key={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        أود التواصل عبر *
                      </label>
                      <select
                        required
                        value={form.contactVia}
                        onChange={(e) => setField("contactVia", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none bg-white text-brand-dark"
                      >
                        <option value="">اختر</option>
                        {CONTACT_VIA.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        رأس المال المطلوب *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.requiredCapital}
                        onChange={(e) => setField("requiredCapital", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none text-brand-dark"
                        placeholder="مثال: 500,000 ريال"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1.5">
                        الدخل السنوي *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.annualRevenue}
                        onChange={(e) => setField("annualRevenue", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-brand-gold focus:outline-none text-brand-dark"
                        placeholder="مثال: 1,000,000 ريال"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-gold/30 mt-2 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {submitting ? "جارٍ الإرسال..." : "سجّل الآن"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
