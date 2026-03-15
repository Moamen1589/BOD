import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-center gap-3">
      <a
        href="tel:920031323"
        aria-label="Call Company"
        className="group relative w-14 h-14 rounded-full bg-brand-gold text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        data-testid="floating-phone"
      >
        <FaPhoneAlt size={24} />
        <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-brand-dark px-3 py-1 text-sm font-almarai text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          920031323
        </span>
      </a>

      <a
        href="https://wa.me/966567771966"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform animate-float"
        data-testid="floating-whatsapp"
      >
        <FaWhatsapp size={30} />
      </a>
    </div>
  );
}
