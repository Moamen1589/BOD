const footerLinks = [
  {
    title: "الشركة",
    links: [
      { label: "الرئيسية", href: "#hero" },
      { label: "من نحن", href: "#about" },
      { label: "خدماتنا", href: "#services" },
      { label: "تواصل معنا", href: "#contact" },
    ],
  },
  {
    title: "المنصات",
    links: [
      { label: "منصة أداء", href: "https://adaa.pro" },
      { label: "مختبرات حقّق", href: "https://haqqeq-lab.com" },
      { label: "مسرعة أثر وريادة", href: "https://athar-riyada.com" },
      { label: "أكاديمية حقّق 360", href: "#solutions" },
    ],
  },
  {
    title: "التحميلات",
    links: [
      { label: "الملف التعريفي", href: "https://drive.google.com/file/d/1zxp5_YorOLzBk0mPqkzPlZgzu0h3rrZW/view?usp=sharing" },
      { label: "التقرير السنوي", href: "https://drive.google.com/file/d/1uumhRJM4GnTlmoLR4B3KhCezHabnEaSN/view?usp=sharing" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <img
              src="https://bod.com.sa/wp-content/uploads/2024/07/logo11581.png"
              alt="ولادة حلم"
              className="h-12 w-auto mb-4 brightness-0 invert"
              data-testid="img-footer-logo"
            />
            <p className="font-almarai text-white/60 text-sm leading-relaxed">
              شركة استشارية متخصصة في تمكين المنظمات غير الربحية عبر حلول استراتيجية مبتكرة واستشارات مهنية.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-almarai font-bold text-base mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-almarai text-sm text-white/50 hover:text-white transition-colors"
                      data-testid={`footer-link-${link.label}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-almarai text-sm text-white/40" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} ولادة حلم للاستشارات والأبحاث. جميع الحقوق محفوظة.
          </p>
          <a
            href="https://bod.com.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="font-almarai text-sm text-white/40 hover:text-white transition-colors"
            data-testid="link-footer-website"
          >
            bod.com.sa
          </a>
        </div>
      </div>
    </footer>
  );
}
