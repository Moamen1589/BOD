import { FaTiktok, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
      { label: "أكاديمية حقّق 360", href: "https://www.hqq360.com" },
    ],
  },
  {
    title: "التحميلات",
    links: [
      {
        label: "الملف التعريفي",
        href: "https://drive.google.com/file/d/1zxp5_YorOLzBk0mPqkzPlZgzu0h3rrZW/view?usp=sharing",
      },
      {
        label: "التقرير السنوي",
        href: "https://drive.google.com/file/d/1uumhRJM4GnTlmoLR4B3KhCezHabnEaSN/view?usp=sharing",
      },
    ],
  },
];

const socialLinks = [
  { alt: "TikTok", href: "https://www.tiktok.com/@birthofdream", icon: FaTiktok },
  { alt: "Instagram", href: "https://www.instagram.com/birthofdream/", icon: FaInstagram },
  { alt: "X", href: "https://x.com/birthofdream", icon: FaXTwitter },
  {
    alt: "Facebook",
    href: "https://www.facebook.com/people/%D8%B4%D8%B1%D9%83%D8%A9-%D9%88%D9%84%D8%A7%D8%AF%D8%A9-%D8%AD%D9%84%D9%85-%D9%84%D9%84%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA-%D9%88%D8%A7%D9%84%D8%A3%D8%A8%D8%AD%D8%A7%D8%AB/100035121164830/?modal=admin_todo_tour",
    icon: FaFacebookF,
    isCircle: true,
  },
  {
    alt: "LinkedIn",
    href: "https://www.linkedin.com/company/%D8%B4%D8%B1%D9%83%D8%A9-%D9%88%D9%84%D8%A7%D8%AF%D8%A9-%D8%AD%D9%84%D9%85-%D9%84%D9%84%D8%A5%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA-%D9%88%D8%A7%D9%84%D8%A3%D8%A8%D8%AD%D8%A7%D8%AB/posts/?feedView=all",
    icon: FaLinkedinIn,
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

          <div className="flex items-center gap-4 text-brand-gold">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.alt}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100 transition-opacity"
                  data-testid={`footer-social-${social.alt}`}
                >
                  {social.isCircle ? (
                    <span className="w-8 h-8 rounded-full bg-brand-gold text-brand-dark inline-flex items-center justify-center">
                      <Icon size={18} />
                    </span>
                  ) : (
                    <Icon size={36} />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
