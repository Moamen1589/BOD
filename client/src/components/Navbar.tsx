import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
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
  { label: "الرئيسية", href: "/" },
  { label: "المنظومة المجتمعية", href: "/ecstt" },
  {
    label: "مكتبة الأعمال",
    href: "/work-library"
  },
  {
    label: "حلولنا الرقمية",
    href: "#solutions",
    dropdown: [
      { label: 'منصة "أداء" لقياس الأداء', href: "https://adaa.pro/" },
      { label: "مختبرات حقّق الاجتماعية", href: "https://haqqeq-lab.com/home" },
      { label: "مسرعة أثر وريادة", href: "https://athar-riyada.com/" },
      { label: "أكاديمية حقّق 360", href: "https://www.hqq360.com/" },
      { label: "بودكاست حقّق", href: "https://podcast.bod.com.sa/" },
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
  { label: "عملاؤنا", href: "#testimonials" },
  { label: "تواصل معنا", href: "/#contact" },
];

function isInternalLink(href: string) {
  return href.startsWith("/");
}

function isActiveHref(href: string, location: string) {
  if (href.startsWith("#")) {
    return location.includes(href);
  }
  if (!isInternalLink(href)) {
    return false;
  }
  if (href === "/") {
    return location === "/" || location.startsWith("/#");
  }
  return (
    location === href ||
    location.startsWith(`${href}/`) ||
    location.startsWith(`${href}?`) ||
    location.startsWith(`${href}#`)
  );
}

function isNavItemActive(item: NavItem, location: string) {
  if (isActiveHref(item.href, location)) return true;
  if (!item.dropdown) return false;
  return item.dropdown.some((subItem) => isActiveHref(subItem.href, location));
}

function NavLink({
  href,
  className,
  children,
  onClick,
  testId,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  onClick?: () => void;
  testId?: string;
}) {
  if (isInternalLink(href)) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={className}
        data-testid={testId}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
      data-testid={testId}
    >
      {children}
    </a>
  );
}

function DropdownMenu({
  items,
  onClose,
}: {
  items: DropdownItem[];
  onClose: () => void;
}) {
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
  const [location] = useLocation();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!location.includes("#contact")) return;
    let attempts = 0;
    const maxAttempts = 60;
    const interval = setInterval(() => {
      const section = document.getElementById("contact");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        clearInterval(interval);
        return;
      }
      attempts += 1;
      if (attempts >= maxAttempts) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [location]);

  const handleContactClick = (e: React.MouseEvent) => {
    setMobileOpen(false);
    const section = document.getElementById("contact");
    if (section) {
      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50" ref={navRef}>
      <div className="container mx-auto">
        <div className="bg-brand-dark/95 backdrop-blur-md rounded-2xl px-6 h-16 flex items-center justify-between gap-4 shadow-lg border border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            data-testid="link-logo"
          >
            <img
              src="https://bod.com.sa/wp-content/uploads/2024/07/logo11581.png"
              alt="ولادة حلم"
              className="h-14 w-auto brightness-0 invert"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item, location);
              const baseClasses =
                "px-3 py-2 text-sm font-almarai transition-colors rounded-md";
              const activeClasses = "text-white font-bold";
              const inactiveClasses = "text-white/70 hover:text-white font-normal";
              const itemClasses = `${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`;

              return (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.label ? null : item.label,
                        )
                      }
                      className={`flex items-center gap-1 ${itemClasses}`}
                      data-testid={`nav-${item.label}`}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <DropdownMenu
                        items={item.dropdown}
                        onClose={() => setOpenDropdown(null)}
                      />
                    )}
                  </>
                ) : (
                  <NavLink
                    href={item.href}
                    className={itemClasses}
                    testId={`nav-${item.label}`}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              
              className="bg-brand-gold text-white font-almarai rounded-lg px-6 font-bold"
            >
              <Link
                to="/#contact"
                onClick={handleContactClick}
                data-testid="nav-cta"
              >
                تواصل معنا
              </Link>
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
            {navItems.map((item) => {
              const isActive = isNavItemActive(item, location);
              const baseClasses =
                "font-almarai text-sm border-b border-white/10 transition-colors";
              const activeClasses = "text-white font-bold";
              const inactiveClasses = "text-white/70 hover:text-white font-normal";
              const itemClasses = `${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`;

              return (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() =>
                        setMobileExpanded(
                          mobileExpanded === item.label ? null : item.label,
                        )
                      }
                      className={`w-full flex items-center justify-between gap-4 py-3 ${itemClasses}`}
                      data-testid={`mobile-nav-${item.label}`}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform text-white/50 ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                      />
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
                    className={`block py-3 ${itemClasses}`}
                    testId={`mobile-nav-${item.label}`}
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
              );
            })}
            <Button
              asChild
              className="w-full mt-4 bg-brand-gold text-white font-almarai rounded-lg font-bold"
            >
              <Link
                to="/#contact"
                onClick={handleContactClick}
                data-testid="mobile-nav-cta"
              >
                تواصل معنا
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
