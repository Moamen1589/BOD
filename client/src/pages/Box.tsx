import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Shield, Vote } from "lucide-react";
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

export const Box = (): JSX.Element => {
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
      <section className="py-20 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] -mr-60 -mt-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-4">
            <span className="bg-brand-gold/20 text-brand-gold px-5 py-2 rounded-full text-xs font-black tracking-wider">
              المنظومة الاجتماعية
            </span>
          </div>
          <h2 className="text-center text-white text-3xl md:text-5xl font-black mb-4 leading-tight">
            منصة التقييم والتوصيات المجتمعية
          </h2>
          <p className="text-center text-white/50 mb-14 text-base max-w-2xl mx-auto">
            منصة تفاعلية تمكّن الجمعيات من التصويت على المبادرات، تقييم البرامج،
            ومشاركة التوصيات مع المجتمع غير الربحي
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
            {[
              {
                icon: Vote,
                title: "التصويت على المبادرات",
                desc: "صوّت وأثّر في قرارات المجتمع غير الربحي بشكل جماعي وشفاف",
                color: "bg-brand-gold",
                link: "/voting",
              },
              {
                icon: Shield,
                title: "حوكمة المشاريع",
                desc: "أدوات الشفافية المالية والمساءلة لبرامجك ومشاريعك المجتمعية",
                color: "bg-blue-500",
                link: "/governance",
              },
              {
                icon: Globe,
                title: "قياس الأثر",
                desc: "تحليل ذكاء اصطناعي لقياس الأثر الاجتماعي الحقيقي لبرامجك",
                color: "bg-purple-500",
                link: "/impact",
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
