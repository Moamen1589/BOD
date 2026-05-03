import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const contactInfoItems = [
  {
    icon: "map-pin",
    text: "Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©ØŒ Ø§Ù„Ø±ÙŠØ§Ø¶ØŒ Ø´Ø§Ø±Ø¹ Ø§Ù„Ø¹Ù„ÙŠØ§ØŒ Ø¨Ø±Ø¬ Ø§Ù„ÙÙŠØµÙ„ÙŠØ©ØŒ Ø§Ù„Ø¯ÙˆØ± 25",
  },
  {
    icon: "clock",
    text: "Ø§Ù„Ø£Ø­Ø¯ - Ø§Ù„Ø®Ù…ÙŠØ³: 9:00 ØµØ¨Ø§Ø­Ø§ - 5:00 Ù…Ø³Ø§Ø¡",
  },
  {
    icon: "mail",
    text: "info@ibbaaq.com",
  },
  {
    icon: "phone",
    text: "+966 50 123 4567",
  },
];

const faqItems = [
  { question: "Ù…Ø§ Ù‡ÙŠ Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„ØªÙŠ ØªÙ‚Ø¯Ù…Ù‡Ø§ Ø¹Ø¨Ø§Ù‚ØŸ" },
  { question: "ÙƒÙŠÙ ÙŠÙ…ÙƒÙ†Ù†ÙŠ Ø·Ù„Ø¨ Ø®Ø¯Ù…Ø© Ø§Ø³ØªØ´Ø§Ø±ÙŠØ©ØŸ" },
  { question: "Ù‡Ù„ ØªÙ‚Ø¯Ù…ÙˆÙ† Ø¯ÙˆØ±Ø§Øª ØªØ¯Ø±ÙŠØ¨ÙŠØ© Ù„Ù„Ø£ÙØ±Ø§Ø¯ØŸ" },
  { question: "Ø£ÙŠÙ† ÙŠÙ‚Ø¹ Ù…Ù‚Ø± Ø¹Ø¨Ø§Ù‚ØŸ" },
  { question: "ÙƒÙŠÙ ÙŠÙ…ÙƒÙ†Ù†ÙŠ Ø§Ù„Ø§Ù†Ø¶Ù…Ø§Ù… Ø¥Ù„Ù‰ ÙØ±ÙŠÙ‚ Ø¹Ø¨Ø§Ù‚ØŸ" },
  { question: "Ù…Ø§ Ù‡Ùˆ Ø§Ù„ÙˆÙ‚Øª Ø§Ù„Ù…ØªÙˆÙ‚Ø¹ Ù„Ù„Ø±Ø¯ Ø¹Ù„Ù‰ Ø§Ù„Ø§Ø³ØªÙØ³Ø§Ø±Ø§ØªØŸ" },
];

const footerSections = [
  {
    title: "Ø¹Ø¨Ø§Ù‚",
    links: ["Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©", "Ù…Ù† Ù†Ø­Ù†", "ÙØ±ÙŠÙ‚Ù†Ø§"],
  },
  {
    title: "Ø®Ø¯Ù…Ø§Øª",
    links: ["Ø§Ø³ØªØ´Ø§Ø±Ø§Øª", "Ù…Ù‚Ø§Ù„Ø§Øª", "ØªÙˆØ§ØµÙ„"],
  },
  {
    title: "Ø¯Ø¹Ù…",
    links: ["Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©", "Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©", "Ø´Ø±ÙˆØ· Ø§Ù„Ø®Ø¯Ù…Ø©"],
  },
  {
    title: "Ø§Ù„Ù…Ø¬ØªÙ…Ø¹",
    links: ["Ø§Ù„Ù…Ø¯ÙˆÙ†Ø©", "Ø§Ù„Ù†Ø¯ÙˆØ§Øª", "Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª"],
  },
];

const navigationLinks = [
  { text: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©", active: false },
  { text: "Ù…Ù† Ù†Ø­Ù†", active: false },
  { text: "Ø®Ø¯Ù…Ø§ØªÙ†Ø§", active: false },
  { text: "Ù…Ù‚Ø§Ù„Ø§Øª", active: false },
  { text: "ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§", active: true },
];

const heroBannerContacts = [
  {
    icon: "map-pin",
    text: "Ø§Ù„Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©ØŒ Ø§Ù„Ø±ÙŠØ§Ø¶",
  },
  {
    icon: "mail",
    text: "contact@ibbaaq.com",
  },
  {
    icon: "phone",
    text: "+966 50 123 4567",
  },
];

export const ContactUsSubsection = (): JSX.Element => {
  return (
    <div className="w-full relative bg-white overflow-hidden shadow-[0px_3px_6px_#120f281f]">
      <header className="sticky top-0 left-0 w-full h-14 bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] z-50">
        <nav className="flex flex-wrap items-center justify-between gap-3 h-full px-4">
          <div className="flex items-center gap-3">
            <div className="w-[31px] h-[30px] bg-[#d9d9d9] rounded-[15.5px/15px] flex items-center justify-center">
              <span className="text-black text-sm [font-family:'Inter',Helvetica] font-medium">
                AR
              </span>
            </div>
            <div className="w-[31px] h-[30px] bg-[#d9d9d9] rounded-[15.5px/15px]" />
            <Button className="h-auto w-[120px] bg-[#d9d9d9] rounded-[15px] px-4 py-1.5 hover:bg-[#c9c9c9]">
              <span className="text-black [font-family:'Inter',Helvetica] font-medium text-sm [direction:rtl]">
                ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„
              </span>
            </Button>
          </div>

          <div className="flex items-center gap-6">
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className={`${
                  link.active ? "text-[#636ae8]" : "text-[#242524]"
                } [font-family:'Inter',Helvetica] font-medium text-sm [direction:rtl] hover:text-[#636ae8] transition-colors`}
              >
                {link.text}
              </a>
            ))}
          </div>

          <div className="[font-family:'Inter',Helvetica] font-medium text-[#242524] text-lg [direction:rtl]">
            Ibaaq-Ø¹Ø¨Ø§Ù‚
          </div>
        </nav>
      </header>

      <section className="relative w-full min-h-[240px] sm:h-[300px] overflow-hidden bg-[linear-gradient(135deg,rgba(191,191,191,1)_0%,rgba(60,60,60,1)_100%)]">
        <div className="absolute top-[-30px] left-[-93px] w-[335px] h-[258px] bg-[#c4c4c4] opacity-40" />
        <div className="absolute top-4 right-0 w-[394px] h-[317px] bg-[#c4c4c4] opacity-40" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 sm:px-10 md:px-24">
          <h1 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-5xl text-center leading-[48px] [direction:rtl] mb-12">
            ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§
          </h1>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8">
            {heroBannerContacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-2">
                {contact.icon === "map-pin" && (
                  <MapPinIcon className="w-5 h-5 text-[#3c3c3c]" />
                )}
                {contact.icon === "mail" && (
                  <MailIcon className="w-5 h-5 text-[#3c3c3c]" />
                )}
                {contact.icon === "phone" && (
                  <PhoneIcon className="w-5 h-5 text-[#3c3c3c]" />
                )}
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#3c3c3c] text-lg text-center whitespace-nowrap [direction:rtl]">
                  {contact.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-[85px] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="space-y-8">
            <h2 className="[font-family:'Cairo',Helvetica] font-semibold text-[#242524] text-xl [direction:rtl]">
              Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø§ØªØµØ§Ù„
            </h2>

            <div className="space-y-5">
              {contactInfoItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  {item.icon === "map-pin" && (
                    <MapPinIcon className="w-5 h-5 text-[#8c8d8b] flex-shrink-0 mt-0.5" />
                  )}
                  {item.icon === "clock" && (
                    <ClockIcon className="w-5 h-5 text-[#8c8d8b] flex-shrink-0 mt-0.5" />
                  )}
                  {item.icon === "mail" && (
                    <MailIcon className="w-5 h-5 text-[#8c8d8b] flex-shrink-0 mt-0.5" />
                  )}
                  {item.icon === "phone" && (
                    <PhoneIcon className="w-5 h-5 text-[#8c8d8b] flex-shrink-0 mt-0.5" />
                  )}
                  <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-base [direction:rtl]">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
            <div className="w-full h-64 sm:h-80 md:h-[390px] bg-[#c4c4c4]" />
          </div>
        </div>

        <Card className="mb-16 shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
          <CardContent className="p-6 space-y-6">
            <h2 className="[font-family:'Inter',Helvetica] font-bold text-[#242524] text-2xl text-right [direction:rtl]">
              ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§
            </h2>

            <div className="space-y-2">
              <Label className="[font-family:'Inter',Helvetica] font-medium text-[#242524] text-sm text-right block [direction:rtl]">
                Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„
              </Label>
              <Input
                placeholder="Ø£Ø¯Ø®Ù„ Ø§Ø³Ù…Ùƒ Ø¨Ø§Ù„ÙƒØ§Ù…Ù„"
                className="h-10 md:h-[41px] [font-family:'Inter',Helvetica] text-sm text-right [direction:rtl] placeholder:text-[#8c8d8b]"
              />
            </div>

            <div className="space-y-2">
              <Label className="[font-family:'Inter',Helvetica] font-medium text-[#242524] text-sm text-right block [direction:rtl]">
                Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ
              </Label>
              <Input
                placeholder="Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ"
                className="h-10 md:h-[41px] [font-family:'Inter',Helvetica] text-sm text-right [direction:rtl] placeholder:text-[#8c8d8b]"
              />
            </div>

            <div className="space-y-2">
              <Label className="[font-family:'Inter',Helvetica] font-medium text-[#242524] text-sm text-right block [direction:rtl]">
                Ø§Ø³ØªÙØ³Ø§Ø±Ùƒ Ø£Ùˆ Ù…Ù„Ø§Ø­Ø¸ØªÙƒ
              </Label>
              <Textarea
                placeholder="Ø£Ø¯Ø®Ù„ Ø§Ø³ØªÙØ³Ø§Ø±Ùƒ Ø£Ùˆ Ù…Ù„Ø§Ø­Ø¸ØªÙƒ Ù‡Ù†Ø§..."
                className="min-h-[139px] resize-none [font-family:'Inter',Helvetica] text-sm text-right [direction:rtl] placeholder:text-[#8c8d8b]"
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button className="h-auto w-full sm:w-52 bg-[#636ae8] hover:bg-[#5359d9] rounded-md px-6 py-2.5">
                <span className="[font-family:'Inter',Helvetica] font-normal text-white text-sm [direction:rtl]">
                  Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø±Ø³Ø§Ù„Ø©
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="mb-16">
          <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-2xl text-right mb-8 [direction:rtl]">
            Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©
          </h2>

          <Accordion type="single" collapsible className="space-y-0">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-[#ebebea]"
              >
                <AccordionTrigger className="py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                  <span className="[font-family:'Cairo',Helvetica] font-normal text-[#242524] text-lg text-right flex-1 [direction:rtl]">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pb-4 text-right [direction:rtl]"></div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <footer className="w-full bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-[104px] py-16">
          <div className="text-center mb-12">
            <h3 className="[font-family:'Inter',Helvetica] font-bold text-[#242524] text-2xl mb-8 [direction:rtl]">
              Ibaaq-Ø¹Ø¨Ø§Ù‚
            </h3>
            <p className="[font-family:'Cairo',Helvetica] font-semibold text-[#242524] text-lg mb-6 [direction:rtl]">
              Ø§Ø´ØªØ±Ùƒ ÙÙŠ Ù†Ø´Ø±ØªÙ†Ø§ Ø§Ù„Ø¥Ø®Ø¨Ø§Ø±ÙŠØ©
            </p>

            <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
              <Button className="h-auto w-[79px] bg-[#636ae8] hover:bg-[#5359d9] rounded-md px-4 py-2.5">
                <span className="[font-family:'Inter',Helvetica] font-normal text-white text-sm [direction:rtl]">
                  Ø§Ø´ØªØ±Ùƒ
                </span>
              </Button>
              <div className="relative flex-1">
                <Input
                  placeholder="Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ"
                  className="h-10 md:h-[41px] pr-10 [font-family:'Inter',Helvetica] text-sm text-right [direction:rtl] placeholder:text-[#242524]"
                />
                <MailIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8d8b]" />
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-16 mb-12">
            {footerSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h4 className="[font-family:'Cairo',Helvetica] font-semibold text-[#242524] text-sm text-right [direction:rtl]">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-base text-right block hover:text-[#636ae8] transition-colors [direction:rtl]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-[#ebebea]">
            <Button
              variant="outline"
              className="h-auto w-[75px] bg-[#f7f7f7] border-[#ebebea] rounded-md px-3 py-2 hover:bg-[#ebebea]"
            >
              <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm">
                English
              </span>
            </Button>

            <div className="flex items-center gap-2 text-sm [font-family:'Inter',Helvetica] font-normal text-[#8c8d8b]">
              <span className="[direction:rtl]">Â© 2025 Ibbaaq-Ø¹Ø¨Ø§Ù‚.</span>
              <span>â€¢</span>
              <a
                href="#"
                className="hover:text-[#636ae8] transition-colors [direction:rtl]"
              >
                Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©
              </a>
              <span>â€¢</span>
              <a
                href="#"
                className="hover:text-[#636ae8] transition-colors [direction:rtl]"
              >
                Ø´Ø±ÙˆØ· Ø§Ù„Ø®Ø¯Ù…Ø©
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="hover:opacity-70 transition-opacity">
                <img
                  src="/figmaAssets/twitter-1.svg"
                  alt="Twitter"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity">
                <img
                  src="/figmaAssets/facebook.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity">
                <img
                  src="/figmaAssets/linkedin-2.svg"
                  alt="Linkedin"
                  className="w-5 h-5"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

