import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export const Box = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />

      {/* Simplified CTA Section for the Standalone Module */}
      <section className="py-20 bg-brand-light-gold">
        <div className="container mx-auto px-6">
          <div className="bg-brand-dark rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden group border-b-8 border-brand-gold/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold opacity-10 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold opacity-10 rounded-full -ml-32 -mb-32 transition-transform duration-700 group-hover:scale-150"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <span className="bg-brand-gold text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block shadow-lg">إطلاق المنظومة الجديدة</span>
              <h2 className="text-3xl md:text-6xl font-black text-white mb-8 leading-tight">
                هل تريد بناء جمعية تُدار بالاحتراف؟
              </h2>
              <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
                اكتشف "المنظومة الاجتماعية" - الحل المتكامل للتحول المؤسسي المستدام وتوثيق الأثر.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button asChild size="lg" className="bg-brand-gold hover:bg-brand-gold-dark text-white px-12 py-10 rounded-3xl text-xl font-black shadow-2xl shadow-brand-gold/30 hover:scale-105 transition-transform">
                  <Link href="/ecstt" className="flex items-center gap-3">
                    ابدأ استكشاف المنظومة الآن
                    <ArrowLeft className="w-6 h-6" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/20 hover:bg-white/10 px-12 py-10 rounded-3xl text-xl font-bold text-[#ff6900]">
                  <a href="#contact">تحدث مع خبير</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
      <ServicesSection />
      <SolutionsSection />
      <WhyUsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};
