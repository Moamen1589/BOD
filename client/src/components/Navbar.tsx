import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "الرئيسية", href: "#hero" },
  {
    label: "مكتبة الأعمال",
    href: "/work-library",
    dropdown: [
      { label: "إعداد الخطط الاستراتيجية", href: "/work-library?cat=strategic-planning" },
      { label: "الأدلة الإجرائية", href: "/work-library?cat=procedural-guides" },
      { label: "الخطط السنوية", href: "/work-library?cat=annual-plans" },
      { label: "المبادرات المجتمعية", href: "/work-library?cat=community-initiatives" },
      { label: "الموشن جرافيك", href: "/work-library?cat=motion-graphics" },
      { label: "عرض جميع الأعمال", href: "/work-library" },
    ],
  },
  {
    label: "حلولنا الرقمية",
    href: "/solutions",
    dropdown: [
      { label: 'منصة "أداء" لقياس الأداء', href: "/solutions/adaa-platform" },
      { label: "مختبرات حقّق الاجتماعية", href: "/solutions/haqqiq-labs" },
      { label: "مسرعة أثر وريادة", href: "/solutions/athar-accelerator" },
      { label: "أكاديمية حقّق 360", href: "/solutions/haqqiq-academy" },
      { label: "بودكاست حقّق", href: "/solutions/haqqiq-podcast" },
      { label: "دراسات الحالة", href: "/solutions?type=case-study" },
      { label: "إصدارات حقّق", href: "/solutions?type=publication" },
      { label: "عرض الكل", href: "/solutions" },
    ],
  },
  {
    label: "من نحن",
    href: "#about",
    dropdown: [
      { label: "رؤيتنا ورسالتنا", href: "#about" },
      { label: "قيمنا", href: "#about" },
      { label: "لماذا تختارنا", href: "#why-us" },
      { label: "كيف نعمل", href: "#why-us" },
    ],
  },
  { label: "المدونة", href: "/blog" },
  { label: "عملائنا", href: "#testimonials" },
  { label: "تواصل معنا", href: "#contact" },
];

function isInternalLink(href: string) {
  return href.startsWith("/");
}

function NavLink({ href, className, children, onClick, testId }: {
  href: string;
  className: string;
  children: React.ReactNode;
  onClick?: () => void;
  testId?: string;
}) {
  if (isInternalLink(href)) {
    return (
      <Link href={href} onClick={onClick} className={className} data-testid={testId}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} onClick={onClick} className={className} data-testid={testId}>
      {children}
    </a>
  );
}

function DropdownMenu({ items, onClose }: { items: DropdownItem[]; onClose: () => void }) {
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-brand-dark rounded-lg shadow-xl border border-white/10 py-2 z-50 animate-fade-in">
      {items.map((item) => (
        <NavLink
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors font-almarai"
          testId={`dropdown-link-${item.label}`}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-4 left-4 right-4 z-50" ref={navRef}>
      <div className="container mx-auto">
        <div className="bg-brand-dark/95 backdrop-blur-md rounded-2xl px-6 h-16 flex items-center justify-between gap-4 shadow-lg border border-white/5">
          <Link href="/" className="flex items-center gap-3 shrink-0" data-testid="link-logo">
            <img
              src="https://bod.com.sa/wp-content/uploads/2024/07/logo11581.png"
              alt="ولادة حلم"
              className="h-14 w-auto brightness-0 invert"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-almarai text-white/70 hover:text-white transition-colors rounded-md"
                      data-testid={`nav-${item.label}`}
                    >
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === item.label && (
                      <DropdownMenu items={item.dropdown} onClose={() => setOpenDropdown(null)} />
                    )}
                  </>
                ) : (
                  <NavLink
                    href={item.href}
                    className="px-3 py-2 text-sm font-almarai text-white/70 hover:text-white transition-colors rounded-md"
                    testId={`nav-${item.label}`}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button asChild className="bg-brand-gold text-white font-almarai rounded-lg px-6 font-bold">
              <a href="#contact" data-testid="nav-cta">أنا مهتم بالخدمات</a>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden mt-2 mx-auto container">
          <div className="bg-brand-dark/95 backdrop-blur-md rounded-2xl px-4 py-4 max-h-[75vh] overflow-y-auto shadow-lg border border-white/5">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between gap-4 py-3 font-almarai text-sm font-bold text-white/80 border-b border-white/10"
                      data-testid={`mobile-nav-${item.label}`}
                    >
                      {item.label}
                      <ChevronDown size={16} className={`transition-transform text-white/50 ${mobileExpanded === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="pr-4 bg-white/5 rounded-md my-1">
                        {item.dropdown.map((sub) => (
                          <NavLink
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2.5 font-almarai text-sm text-white/60 hover:text-white border-b border-white/5 last:border-0"
                            testId={`mobile-dropdown-${sub.label}`}
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-almarai text-sm font-bold text-white/80 border-b border-white/10"
                    testId={`mobile-nav-${item.label}`}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
            <Button asChild className="w-full mt-4 bg-brand-gold text-white font-almarai rounded-lg font-bold">
              <a href="#contact" onClick={() => setMobileOpen(false)} data-testid="mobile-nav-cta">
                أنا مهتم بالخدمات
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
