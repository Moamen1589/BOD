import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, HeadphonesIcon, Users, Send, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function NewsletterSection() {
  const ref = useScrollAnimation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    setError("");
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section
      id="newsletter"
      ref={ref.ref}
      className={`py-16 bg-brand-light transition-all duration-1000 ${ref.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="container mx-auto px-6">
        <div className="relative bg-brand-gold rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-gold/30 px-8 py-14 md:px-20 md:py-16">

          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-36 -mt-36 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-black/10 rounded-full -mr-28 -mb-28 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-white/5 blur-[60px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                اشترك في نشرتنا الإخبارية
              </h2>
              <p className="text-white/80 text-base md:text-lg font-medium max-w-xl mx-auto">
                احصل على أحدث الأبحاث والمقالات ونصائح تطوير الجمعيات مباشرةً إلى بريدك الإلكتروني
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {[
                { icon: HeadphonesIcon, label: "الدعم عبر الإنترنت" },
                { icon: Users, label: "مجتمع المنظومة" },
                { icon: Mail, label: "نشرة مجانية" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/90">
                  <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">{label}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-white" />
                </div>
                <p className="text-white font-black text-xl">تم الاشتراك بنجاح! 🎉</p>
                <p className="text-white/80 text-sm">سنرسل لك أفضل المحتوى قريباً</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="أدخل بريدك الإلكتروني"
                    dir="ltr"
                    className={`w-full bg-white text-brand-dark placeholder:text-right placeholder:py-5 placeholder:text-gray-400 px-6 py-4 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-white/40 shadow-lg font-almarai ${error ? "ring-4 ring-red-300" : ""}`}
                  />
                  {error && <p className="text-white text-xs font-bold mt-2 text-center">{error}</p>}
                </div>
                <Button
                  type="submit"
                  className="bg-brand-dark hover:bg-brand-dark/90 text-white font-black px-10 py-4 rounded-2xl text-base shadow-xl whitespace-nowrap flex items-center gap-2 h-auto"
                >
                  <Send className="w-4 h-4" />
                  إرسال
                </Button>
              </form>
            )}

            {/* Privacy note */}
            <p className="text-center text-white/60 text-xs mt-5 font-medium">
              نحترم خصوصيتك — لا مشاركة للبيانات، ويمكنك إلغاء الاشتراك في أي وقت.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
