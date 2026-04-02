import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import type { Service } from "@shared/schema";

export default function ServicesPage() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md" data-testid="badge-services-page">
              خدماتنا
            </span>
            <h1 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-services-page-title">
              خدمات ولادة حلم للاستشارات
            </h1>
            <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
              حلول شاملة ومتكاملة تلبي احتياجات مؤسستك التشغيلية والإبداعية
            </p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 rounded-md" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <div
                    className="bg-white rounded-md p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer h-full"
                    data-testid={`card-service-${service.slug}`}
                  >
                    <div className="w-12 h-12 bg-brand-gold/15 rounded-md flex items-center justify-center mb-4">
                      <span className="text-brand-gold-dark font-bold text-lg">{service.sortOrder}</span>
                    </div>
                    <h3 className="font-almarai font-bold text-lg text-brand-dark mb-3">{service.title}</h3>
                    <p className="font-almarai text-brand-gray text-sm leading-relaxed mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-1 text-brand-gold-dark font-almarai text-sm font-bold">
                      <span>عرض التفاصيل</span>
                      <ArrowLeft size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
