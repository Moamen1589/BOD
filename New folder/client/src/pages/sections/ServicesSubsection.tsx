import {
  CheckCircle2Icon,
  FileTextIcon,
  MailIcon,
  MessageSquareIcon,
  SendIcon,
  StepForwardIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const navigationItems = [
  { label: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©", active: false },
  { label: "Ù…Ù† Ù†Ø­Ù†", active: false },
  { label: "Ø®Ø¯Ù…Ø§ØªÙ†Ø§", active: true },
  { label: "Ù…Ù‚Ø§Ù„Ø§Øª", active: false },
  { label: "ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§", active: false },
];

const serviceCards = [
  {
    icon: "/figmaAssets/container.svg",
    image: "",
    title: "Ø§Ù„Ø§ØªØµØ§Ù„ Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠ",
    description:
      "Ø¨Ù†Ø§Ø¡ ÙˆØªØ¹Ø²ÙŠØ² ØµÙˆØ±Ø© Ø´Ø±ÙƒØªÙƒØŒ ÙˆØ¥Ø¯Ø§Ø±Ø© Ø³Ù…Ø¹ØªÙ‡Ø§ØŒ ÙˆØªØ­Ù‚ÙŠÙ‚ ØªÙˆØ§ØµÙ„ ÙØ¹Ø§Ù„ Ù…Ø¹ Ø§Ù„Ø¬Ù…Ù‡ÙˆØ± Ø§Ù„Ø¯Ø§Ø®Ù„ÙŠ ÙˆØ§Ù„Ø®Ø§Ø±Ø¬ÙŠ.",
  },
  {
    icon: "/figmaAssets/container-3.svg",
    image: "",
    title: "Ø§Ø¯Ø§Ø±Ø© Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ø±Ù‚Ù…ÙŠØ©",
    description:
      "ØªØ´ÙƒÙŠÙ„ ÙˆØªØ­Ø³ÙŠÙ† Ø­Ø¶ÙˆØ±Ùƒ Ø§Ù„Ø±Ù‚Ù…ÙŠØŒ ÙˆØ¥Ø¯Ø§Ø±Ø© Ø³Ù…Ø¹ØªÙƒ Ø¹Ø¨Ø± Ø§Ù„Ø¥Ù†ØªØ±Ù†ØªØŒ ÙˆØ¶Ù…Ø§Ù† ØªÙ…ÙŠØ²Ùƒ ÙÙŠ Ø§Ù„ÙØ¶Ø§Ø¡ Ø§Ù„Ø±Ù‚Ù…ÙŠ.",
  },
  {
    icon: "/figmaAssets/container-2.svg",
    image: "",
    title: "Ø§Ù„Ø¹Ù„Ø§Ù‚Ø§Øª Ø§Ù„Ø¹Ø§Ù…Ø©",
    description:
      "ØªØ·ÙˆÙŠØ± Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ§Øª Ø¹Ù„Ø§Ù‚Ø§Øª Ø¹Ø§Ù…Ø© Ù‚ÙˆÙŠØ©ØŒ ÙˆØ¨Ù†Ø§Ø¡ Ø¹Ù„Ø§Ù‚Ø§Øª Ø¥ÙŠØ¬Ø§Ø¨ÙŠØ© Ù…Ø¹ ÙˆØ³Ø§Ø¦Ù„ Ø§Ù„Ø¥Ø¹Ù„Ø§Ù… ÙˆØ£ØµØ­Ø§Ø¨ Ø§Ù„Ù…ØµÙ„Ø­Ø©.",
  },
  {
    icon: "/figmaAssets/container-1.svg",
    image: "",
    title: "Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¬ÙˆØ§Ø¦Ø²",
    description:
      "Ø¥Ø¹Ø¯Ø§Ø¯ Ø·Ù„Ø¨Ø§Øª Ø¬ÙˆØ§Ø¦Ø² Ø§Ø­ØªØ±Ø§ÙÙŠØ© ØªØ¨Ø±Ø² Ø¥Ù†Ø¬Ø§Ø²Ø§ØªÙƒ ÙˆØªØ²ÙŠØ¯ Ù…Ù† ÙØ±Øµ ÙÙˆØ²Ùƒ ÙÙŠ Ø§Ù„Ù…Ø³Ø§Ø¨Ù‚Ø§Øª Ø§Ù„Ù…Ø±Ù…ÙˆÙ‚Ø©.",
  },
];

const processSteps = [
  {
    number: "1",
    icon: FileTextIcon,
    title: "ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨",
    description: "Ø§Ù…Ù„Ø£ Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„Ø·Ù„Ø¨ Ø¹Ø¨Ø± Ø§Ù„Ø¥Ù†ØªØ±Ù†Øª Ù…Ø¹ ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø®Ø¯Ù…Ø© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©.",
  },
  {
    number: "2",
    icon: MessageSquareIcon,
    title: "Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© ÙˆØ§Ù„ØªÙˆØ§ØµÙ„",
    description: "Ø³ÙŠÙ‚ÙˆÙ… ÙØ±ÙŠÙ‚Ù†Ø§ Ø¨Ù…Ø±Ø§Ø¬Ø¹Ø© Ø·Ù„Ø¨Ùƒ ÙˆØ§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ù„Ù…Ø²ÙŠØ¯ Ù…Ù† Ø§Ù„ØªÙØ§ØµÙŠÙ„.",
  },
  {
    number: "3",
    icon: StepForwardIcon,
    title: "Ø¨Ø¯Ø¡ Ø§Ù„Ø¹Ù…Ù„",
    description:
      "Ø¨Ø¹Ø¯ Ø§Ù„Ø§ØªÙØ§Ù‚ØŒ Ù†Ø¨Ø¯Ø£ ÙÙŠ ØªÙ†ÙÙŠØ° Ø§Ù„Ø®Ø¯Ù…Ø© ÙˆÙÙ‚Ø§ Ù„Ù„Ø¬Ø¯ÙˆÙ„ Ø§Ù„Ø²Ù…Ù†ÙŠ Ø§Ù„Ù…ØªÙÙ‚ Ø¹Ù„ÙŠÙ‡.",
  },
  {
    number: "4",
    icon: CheckCircle2Icon,
    title: "Ø§Ù„ØªØ³Ù„ÙŠÙ… ÙˆØ§Ù„Ù…ØªØ§Ø¨Ø¹Ø©",
    description: "Ù†Ù‚Ø¯Ù… Ù„Ùƒ Ø§Ù„Ù†ØªØ§Ø¦Ø¬ Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠØ© ÙˆÙ†ØªØ§Ø¨Ø¹ Ù…Ø¹Ùƒ Ù„Ø¶Ù…Ø§Ù† Ø±Ø¶Ø§Ùƒ Ø§Ù„ØªØ§Ù….",
  },
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

export const ServicesSubsection = (): JSX.Element => {
  return (
    <div className="w-full bg-white" dir="rtl">
      <nav className="w-full h-14 bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] flex items-center justify-center px-4">
        <div className="flex flex-wrap items-center gap-3 max-w-[1440px] w-full justify-center">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`text-sm font-medium [font-family:'Inter',Helvetica] whitespace-nowrap ${
                item.active ? "text-[#636ae8]" : "text-[#242524]"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="mr-auto text-lg font-medium [font-family:'Inter',Helvetica] text-[#242524]">
            Ibaaq-Ø¹Ø¨Ø§Ù‚
          </div>
        </div>
      </nav>

      <section className="relative w-full min-h-[220px] sm:h-[280px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[#8c8d8b] opacity-20" />
        <div className="relative z-10 text-center px-4 max-w-[1216px] w-full mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold [font-family:'Cairo',Helvetica] text-[#242524] leading-[48px] mb-[39px]">
            Ø®Ø¯Ù…Ø§ØªÙ†Ø§
          </h1>
          <p className="text-xl [font-family:'Inter',Helvetica] text-[#8c8d8b] leading-7 max-w-[768px] mx-auto">
            Ù†Ù‚Ø¯Ù… Ù…Ø¬Ù…ÙˆØ¹Ø© Ø´Ø§Ù…Ù„Ø© Ù…Ù† Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø§ØªØµØ§Ù„ ÙˆØ§Ù„Ø¹Ù„Ø§Ù‚Ø§Øª Ø§Ù„Ø¹Ø§Ù…Ø© Ø§Ù„Ù…ØµÙ…Ù…Ø© Ù„Ù…Ø³Ø§Ø¹Ø¯ØªÙƒ
            Ø¹Ù„Ù‰ ØªØ­Ù‚ÙŠÙ‚ Ø£Ù‡Ø¯Ø§ÙÙƒ.
          </p>
        </div>
      </section>

      <section className="max-w-[1216px] mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold [font-family:'Cairo',Helvetica] text-[#242524] text-center mb-8 sm:mb-12 md:mb-[102px]">
          Ø§ÙƒØªØ´Ù Ø®Ø¯Ù…Ø§ØªÙ†Ø§ Ø§Ù„Ù…ØªØ®ØµØµØ©
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {serviceCards.map((service, index) => (
            <Card
              key={index}
              className="border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]"
            >
              <CardContent className="p-0 flex flex-col">
                <div className="flex justify-center pt-[25px]">
                  <img
                    src={service.icon}
                    alt="Service icon"
                    className="w-14 h-14"
                  />
                </div>
                <div className="mx-[25px] mt-4 h-24 sm:h-32 bg-[#c4c4c4] rounded-md" />
                <h3 className="text-lg font-semibold [font-family:'Cairo',Helvetica] text-[#242524] text-center mt-[21px] px-4">
                  {service.title}
                </h3>
                <p className="text-sm [font-family:'Inter',Helvetica] text-[#8c8d8b] text-center mt-5 px-[25px] pb-[25px] leading-5">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-16" />

        <div className="py-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold [font-family:'Cairo',Helvetica] text-[#242524] text-center mb-8 sm:mb-12 md:mb-[102px]">
            ÙƒÙŠÙ ÙŠØ¹Ù…Ù„ Ø·Ù„Ø¨ Ø§Ù„Ø®Ø¯Ù…Ø©ØŸ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#636ae8] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base font-bold [font-family:'Inter',Helvetica]">
                        {step.number}
                      </span>
                    </div>
                    <IconComponent className="w-5 h-5 text-[#242524] mt-0.5" />
                  </div>
                  <h3 className="text-base font-semibold [font-family:'Cairo',Helvetica] text-[#242524] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-sm [font-family:'Inter',Helvetica] text-[#8c8d8b] leading-5">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="my-16" />

        <Card className="border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] mt-16">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold [font-family:'Cairo',Helvetica] text-[#242524] text-center mb-[61px]">
              Ù‚Ø¯Ù… Ø·Ù„Ø¨ Ø®Ø¯Ù…Ø©
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium [font-family:'Inter',Helvetica] text-[#242524]">
                    Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„
                  </Label>
                  <Input
                    placeholder="Ø§Ø¯Ø®Ù„ Ø§Ø³Ù…Ùƒ"
                    className="h-[41px] border-[#ebebea] [font-family:'Inter',Helvetica] text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium [font-family:'Inter',Helvetica] text-[#242524]">
                    Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø§Ù„ÙƒØªØ±ÙˆÙ†ÙŠ
                  </Label>
                  <Input
                    placeholder="Ø§Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø§Ù„ÙƒØªØ±ÙˆÙ†ÙŠ"
                    className="h-[41px] border-[#ebebea] [font-family:'Inter',Helvetica] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium [font-family:'Inter',Helvetica] text-[#242524]">
                  Ø§Ù„Ø®Ø¯Ù…Ø© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©
                </Label>
                <Select>
                  <SelectTrigger className="h-10 border-[#ebebea]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service1">Ø§Ù„Ø§ØªØµØ§Ù„ Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠ</SelectItem>
                    <SelectItem value="service2">
                      Ø§Ø¯Ø§Ø±Ø© Ø§Ù„Ù‡ÙˆÙŠØ© Ø§Ù„Ø±Ù‚Ù…ÙŠØ©
                    </SelectItem>
                    <SelectItem value="service3">Ø§Ù„Ø¹Ù„Ø§Ù‚Ø§Øª Ø§Ù„Ø¹Ø§Ù…Ø©</SelectItem>
                    <SelectItem value="service4">Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¬ÙˆØ§Ø¦Ø²</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium [font-family:'Inter',Helvetica] text-[#242524]">
                  Ø±Ø³Ø§Ù„Ø©
                </Label>
                <Textarea
                  placeholder="ØµÙ Ø·Ù„Ø¨Ùƒ Ø¨Ø§Ù„ØªÙØµÙŠÙ„"
                  className="min-h-[81px] border-[#ebebea] [font-family:'Inter',Helvetica] text-sm resize-none"
                />
              </div>

              <Button className="w-full h-10 bg-[#636ae8] hover:bg-[#5159d1] text-white [font-family:'Inter',Helvetica] text-sm">
                Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨
                <SendIcon className="w-4 h-4 mr-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <footer className="w-full bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] py-16">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold [font-family:'Inter',Helvetica] text-[#242524] mb-10 md:mb-[76px]">
              Ibaaq-Ø¹Ø¨Ø§Ù‚
            </h3>
            <p className="text-lg font-semibold [font-family:'Cairo',Helvetica] text-[#242524] mb-6 md:mb-[47px]">
              Ø§Ø´ØªØ±Ùƒ ÙÙŠ Ù†Ø´Ø±ØªÙ†Ø§ Ø§Ù„Ø¥Ø®Ø¨Ø§Ø±ÙŠØ©
            </p>
            <div className="flex justify-center items-center gap-2 max-w-md mx-auto">
              <Button className="h-10 bg-[#636ae8] hover:bg-[#5159d1] text-white text-sm [font-family:'Inter',Helvetica] px-4">
                Ø§Ø´ØªØ±Ùƒ
              </Button>
              <div className="relative flex-1">
                <Input
                  placeholder="Ø§Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø§Ù„ÙƒØªØ±ÙˆÙ†ÙŠ"
                  className="h-[41px] border-[#ebebea] pr-10 [font-family:'Inter',Helvetica] text-sm"
                />
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#242524]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-[1232px] mx-auto">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-semibold [font-family:'Cairo',Helvetica] text-[#242524] mb-[37px]">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-base [font-family:'Inter',Helvetica] text-[#8c8d8b] hover:text-[#242524]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
            <Button
              variant="outline"
              className="h-9 px-4 bg-[#f7f7f7] border-[#ebebea] text-sm [font-family:'Inter',Helvetica] text-[#8c8d8b]"
            >
              English
            </Button>

            <div className="flex items-center gap-2 text-sm [font-family:'Inter',Helvetica] text-[#8c8d8b]">
              <span>Â© 2025 Ibbaaq-Ø¹Ø¨Ø§Ù‚.</span>
              <span>â€¢</span>
              <a href="#" className="hover:text-[#242524]">
                Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©
              </a>
              <span>â€¢</span>
              <a href="#" className="hover:text-[#242524]">
                Ø´Ø±ÙˆØ· Ø§Ù„Ø®Ø¯Ù…Ø©
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="hover:opacity-80">
                <img
                  src="/figmaAssets/twitter-1.svg"
                  alt="Twitter"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="hover:opacity-80">
                <img
                  src="/figmaAssets/facebook.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="hover:opacity-80">
                <img
                  src="/figmaAssets/linkedin.svg"
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

