import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  { label: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©", active: false },
  { label: "Ù…Ù† Ù†Ø­Ù†", active: true },
  { label: "Ø®Ø¯Ù…Ø§ØªÙ†Ø§", active: false },
  { label: "Ù…Ù‚Ø§Ù„Ø§Øª", active: false },
  { label: "ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§", active: false },
];

const teamMembers = [
  {
    name: "Ù…Ø­Ù…Ø¯ Ø§Ù„Ø¹Ù„ÙŠ",
    role: "Ø§Ù„Ù…Ø¯ÙŠØ± Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠ",
    description: "ÙŠÙ‚ÙˆØ¯ Ø§Ù„Ø±Ø¤ÙŠØ© ÙˆØ§Ù„Ø¥Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ© Ø§Ù„Ø¹Ø§Ù…Ø© Ù„Ø¹Ø¨Ø§Ù‚.",
  },
  {
    name: "ÙØ§Ø·Ù…Ø© Ø§Ù„Ø²Ù‡Ø±Ø§Ø¡",
    role: "Ù…Ø¯ÙŠØ± Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª",
    description: "ØªØ¶Ù…Ù† Ø³Ù„Ø§Ø³Ø© Ø³ÙŠØ± Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„ÙŠÙˆÙ…ÙŠØ© ÙˆÙƒÙØ§Ø¡ØªÙ‡Ø§.",
  },
  {
    name: "Ø£Ø­Ù…Ø¯ Ø®Ø§Ù„Ø¯",
    role: "Ø±Ø¦ÙŠØ³ Ù‚Ø³Ù… Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§",
    description: "ÙŠØ´Ø±Ù Ø¹Ù„Ù‰ ØªØ·ÙˆÙŠØ± ÙˆØªÙ†ÙÙŠØ° Ø§Ù„Ø­Ù„ÙˆÙ„ Ø§Ù„ØªÙ‚Ù†ÙŠØ©.",
  },
  {
    name: "Ù†ÙˆØ±Ø§ Ø³Ø¹ÙŠØ¯",
    role: "Ù…Ø³Ø¤ÙˆÙ„ Ø§Ù„ØªÙˆØ§ØµÙ„ Ø§Ù„Ù…Ø¬ØªÙ…Ø¹ÙŠ",
    description: "ØªØ¨Ù†ÙŠ ÙˆØªØ¯ÙŠØ± Ø§Ù„Ø¹Ù„Ø§Ù‚Ø§Øª Ù…Ø¹ Ø´Ø±ÙƒØ§Ø¡ Ø§Ù„Ù…Ø¬ØªÙ…Ø¹.",
  },
  {
    name: "Ø¹Ù„ÙŠ Ø­Ø³Ù†",
    role: "Ù…Ø­Ù„Ù„ Ø¨ÙŠØ§Ù†Ø§Øª Ø£ÙˆÙ„",
    description: "ÙŠØ­Ù„Ù„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ù„Ø¯Ø¹Ù… Ø§Ù„Ù‚Ø±Ø§Ø±Ø§Øª Ø§Ù„Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ©.",
  },
  {
    name: "Ù„ÙŠÙ„Ù‰ Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡",
    role: "Ù…ØµÙ…Ù…Ø© Ù…Ù†ØªØ¬Ø§Øª",
    description: "ØªØµÙ…Ù… ØªØ¬Ø§Ø±Ø¨ Ù…Ø³ØªØ®Ø¯Ù… Ù…Ø¨ØªÙƒØ±Ø© ÙˆÙØ¹Ø§Ù„Ø©.",
  },
  {
    name: "ÙŠÙˆØ³Ù Ø¥Ø¨Ø±Ø§Ù‡ÙŠÙ…",
    role: "Ø£Ø®ØµØ§Ø¦ÙŠ Ø§Ø³ØªØ´Ø§Ø±Ø§Øª",
    description: "ÙŠÙ‚Ø¯Ù… Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø§Øª Ù„Ù„Ù…Ø³ØªÙÙŠØ¯ÙŠÙ† ÙˆØ§Ù„Ø´Ø±ÙƒØ§Øª.",
  },
  {
    name: "Ø³Ø§Ø±Ø© Ø¬Ù…Ø§Ù„",
    role: "Ù…Ø³Ø¤ÙˆÙ„ Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„Ø¨Ø´Ø±ÙŠØ©",
    description: "ØªÙ‡ØªÙ… Ø¨ØªØ·ÙˆÙŠØ± ÙˆØªÙ†Ù…ÙŠØ© ÙØ±ÙŠÙ‚ Ø¹Ø¨Ø§Ù‚.",
  },
];

const impactStats = [
  { value: "10,000+", label: "Ù…Ø³ØªÙÙŠØ¯" },
  { value: "500+", label: "Ù…Ø´Ø±ÙˆØ¹" },
  { value: "50+", label: "Ø´Ø±ÙŠÙƒ" },
  { value: "1,000+", label: "Ù…ØªØ·ÙˆØ¹" },
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

export const AboutUsSubsection = (): JSX.Element => {
  return (
    <div className="w-full bg-white overflow-hidden">
      <div className="relative bg-white">
        <header className="w-full h-14 flex items-center justify-center bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
          <nav className="flex flex-wrap items-center gap-3 px-4 [direction:rtl]">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className={`[font-family:'Inter',Helvetica] font-medium text-sm tracking-[0] leading-5 whitespace-nowrap ${
                  item.active ? "text-[#636ae8]" : "text-[#242524]"
                }`}
              >
                {item.label}
              </div>
            ))}
            <div className="ml-auto w-full sm:w-auto text-center sm:text-right [font-family:'Inter',Helvetica] font-medium text-lg leading-7 text-[#242524] tracking-[0] [direction:rtl]">
              Ibaaq-Ø¹Ø¨Ø§Ù‚
            </div>
          </nav>
        </header>

        <section className="w-full flex justify-center py-0 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <div className="w-full min-h-[260px] sm:h-[360px] flex flex-col items-center justify-center bg-[#d9d9d9] py-10">
              <h1 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-5xl text-center tracking-[0] leading-[48px] whitespace-nowrap [direction:rtl] mb-9">
                Ù…Ù† Ù†Ø­Ù†
              </h1>
              <p className="max-w-[768px] [font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-2xl text-center tracking-[0] leading-8 [direction:rtl]">
                Ù†Ø­Ù† Ø¹Ø¨Ø§Ù‚ØŒ Ù…Ù†ØµØ© Ù…ÙƒØ±Ø³Ø© Ù„ØªÙ…ÙƒÙŠÙ† Ø§Ù„Ù…Ù†Ø¸Ù…Ø§Øª ØºÙŠØ± Ø§Ù„Ø±Ø¨Ø­ÙŠØ© ÙÙŠ Ø§Ù„Ø´Ø±Ù‚ Ø§Ù„Ø£ÙˆØ³Ø·
                Ù…Ù† Ø®Ù„Ø§Ù„ Ø§Ù„Ø§Ø¨ØªÙƒØ§Ø± ÙˆØ±ÙŠØ§Ø¯Ø© Ø§Ù„Ø£Ø¹Ù…Ø§Ù„.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center py-12 md:py-24 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-end [direction:rtl]">
                <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl tracking-[0] leading-9 whitespace-nowrap mb-6">
                  Ø±Ø¤ÙŠØªÙ†Ø§
                </h2>
                <p className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-lg tracking-[0] leading-7">
                  Ø¨Ù†Ø§Ø¡ Ù…Ù†Ø¸ÙˆÙ…Ø© Ø¨ÙŠØ¦ÙŠØ© Ù…Ø²Ø¯Ù‡Ø±Ø© Ù„Ù„Ø§Ø¨ØªÙƒØ§Ø± ÙˆØ±ÙŠØ§Ø¯Ø© Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ ÙÙŠ Ù…Ù†Ø·Ù‚Ø©
                  Ø§Ù„Ø´Ø±Ù‚ Ø§Ù„Ø£ÙˆØ³Ø· ÙˆØ´Ù…Ø§Ù„ Ø¥ÙØ±ÙŠÙ‚ÙŠØ§ØŒ Ø­ÙŠØ« ÙŠÙ…ØªÙ„Ùƒ Ø§Ù„Ø´Ø¨Ø§Ø¨ Ø§Ù„Ø£Ø¯ÙˆØ§Øª ÙˆØ§Ù„Ù…Ø¹Ø±ÙØ©
                  Ø§Ù„Ù„Ø§Ø²Ù…Ø© Ù„Ù‚ÙŠØ§Ø¯Ø© Ø§Ù„ØªØºÙŠÙŠØ± Ø§Ù„Ø¥ÙŠØ¬Ø§Ø¨ÙŠ ÙÙŠ Ù…Ø¬ØªÙ…Ø¹Ø§ØªÙ‡Ù….
                </p>
              </div>
              <div className="flex flex-col items-end [direction:rtl]">
                <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl tracking-[0] leading-9 whitespace-nowrap mb-6">
                  Ù…Ù‡Ù…ØªÙ†Ø§
                </h2>
                <p className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-lg tracking-[0] leading-7">
                  ØªÙˆÙÙŠØ± Ø¨Ø±Ø§Ù…Ø¬ ØªØ¯Ø±ÙŠØ¨ÙŠØ© Ø´Ø§Ù…Ù„Ø©ØŒ ÙˆÙØ±Øµ ØªÙˆØ¬ÙŠÙ‡ØŒ ÙˆØ¯Ø¹Ù… Ù…Ø§Ù„ÙŠØŒ ÙˆØ´Ø¨ÙƒØ§Øª Ù‚ÙˆÙŠØ©
                  Ù„Ù„Ø´Ø¨Ø§Ø¨ Ø§Ù„Ø·Ù…ÙˆØ­ÙŠÙ†ØŒ Ù…Ø¹ Ø§Ù„ØªØ±ÙƒÙŠØ² Ø¹Ù„Ù‰ Ø¨Ù†Ø§Ø¡ Ø§Ù„Ù‚Ø¯Ø±Ø§Øª ÙˆØªØ³Ù‡ÙŠÙ„ Ø§Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰
                  Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„Ù„Ø§Ø²Ù…Ø© Ù„ØªØ­ÙˆÙŠÙ„ Ø£ÙÙƒØ§Ø±Ù‡Ù… Ø§Ù„Ù…Ø¨ØªÙƒØ±Ø© Ø¥Ù„Ù‰ Ù…Ø´Ø§Ø±ÙŠØ¹ Ù…Ø³ØªØ¯Ø§Ù…Ø©
                  ÙˆÙ…Ø¤Ø«Ø±Ø©.
                </p>
              </div>
            </div>
            <Separator className="mt-24" />
          </div>
        </section>

        <section className="w-full flex justify-center py-12 md:py-24 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl text-center tracking-[0] leading-9 whitespace-nowrap [direction:rtl] mb-12">
              ÙØ±ÙŠÙ‚Ù†Ø§ Ø§Ù„Ù…Ø®Ù„Øµ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="border border-solid border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]"
                >
                  <CardContent className="flex flex-col items-center pt-6 pb-6">
                    <Avatar className="w-24 h-24 bg-[#ced0f8] mb-4">
                      <AvatarFallback className="bg-[#c4c4c4]" />
                    </Avatar>
                    <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#242524] text-xl text-center tracking-[0] leading-7 whitespace-nowrap [direction:rtl] mb-3">
                      {member.name}
                    </h3>
                    <p className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm text-center tracking-[0] leading-5 whitespace-nowrap [direction:rtl] mb-3">
                      {member.role}
                    </p>
                    <p className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm text-center tracking-[0] leading-5 [direction:rtl]">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Separator className="mt-24" />
          </div>
        </section>

        <section className="w-full flex justify-center py-12 md:py-24 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl text-center tracking-[0] leading-9 whitespace-nowrap [direction:rtl] mb-12">
              Ø£Ø«Ø±Ù†Ø§ Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <Card
                  key={index}
                  className="border border-solid border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]"
                >
                  <CardContent className="flex flex-col items-center gap-3 pt-6 pb-6">
                    <div className="[font-family:'Inter',Helvetica] font-bold text-[#636ae8] text-4xl text-center tracking-[0] leading-10 whitespace-nowrap">
                      {stat.value}
                    </div>
                    <div className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-lg text-center tracking-[0] leading-7 whitespace-nowrap [direction:rtl]">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Separator className="mt-24" />
          </div>
        </section>

        <section className="w-full flex justify-center py-12 md:py-24 bg-white">
          <div className="w-full max-w-[1216px] px-4">
            <h2 className="[font-family:'Cairo',Helvetica] font-bold text-[#242524] text-3xl text-center tracking-[0] leading-9 whitespace-nowrap [direction:rtl] mb-8">
              Ø§Ù†Ø¶Ù… Ø¥Ù„ÙŠÙ†Ø§ ÙÙŠ Ø±Ø­Ù„Ø© Ø§Ù„ØªØºÙŠÙŠØ±
            </h2>
            <p className="max-w-[672px] mx-auto [font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-lg text-center tracking-[0] leading-7 [direction:rtl] mb-8">
              Ø³ÙˆØ§Ø¡ ÙƒÙ†Øª Ø´Ø§Ø¨Ø§ Ø·Ù…ÙˆØ­Ø§ØŒ Ù…Ø±Ø´Ø¯Ø§ Ø®Ø¨ÙŠØ±Ø§ØŒ Ø£Ùˆ Ø´Ø±ÙŠÙƒØ§ Ù…Ø­ØªÙ…Ù„Ø§ØŒ Ù‡Ù†Ø§Ùƒ Ù…ÙƒØ§Ù† Ù„Ùƒ ÙÙŠ
              Ø¹Ø§Ø¦Ù„Ø© Ø¹Ø¨Ø§Ù‚. ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§ Ù„Ù…Ø¹Ø±ÙØ© Ø§Ù„Ù…Ø²ÙŠØ¯.
            </p>
            <div className="flex justify-center">
              <Button className="h-auto bg-[#636ae8] rounded-md px-6 py-3">
                <span className="[font-family:'Inter',Helvetica] font-normal text-white text-lg tracking-[0] leading-7 whitespace-nowrap [direction:rtl]">
                  ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§
                </span>
              </Button>
            </div>
          </div>
        </section>

        <footer className="w-full bg-white shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
          <div className="w-full max-w-[1440px] mx-auto px-4 py-16">
            <div className="flex flex-col items-center mb-16">
              <h3 className="font-bold text-2xl leading-8 [font-family:'Inter',Helvetica] text-[#242524] tracking-[0] whitespace-nowrap [direction:rtl] mb-8">
                Ibaaq-Ø¹Ø¨Ø§Ù‚
              </h3>
              <p className="[font-family:'Cairo',Helvetica] font-semibold text-[#242524] text-lg text-center tracking-[0] leading-7 whitespace-nowrap [direction:rtl] mb-6">
                Ø§Ø´ØªØ±Ùƒ ÙÙŠ Ù†Ø´Ø±ØªÙ†Ø§ Ø§Ù„Ø¥Ø®Ø¨Ø§Ø±ÙŠØ©
              </p>
              <div className="flex items-center gap-2 [direction:rtl]">
                <Button className="h-auto bg-[#636ae8] rounded-md px-4 py-2">
                  <span className="[font-family:'Inter',Helvetica] font-normal text-white text-sm tracking-[0] leading-[22px] whitespace-nowrap [direction:rtl]">
                    Ø§Ø´ØªØ±Ùƒ
                  </span>
                </Button>
                <div className="relative">
                  <Input
                    defaultValue="Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ"
                    className="w-full sm:w-[362px] h-10 sm:h-[41px] bg-white border-[#ebebea] rounded-md [font-family:'Inter',Helvetica] font-normal text-[#242524] text-sm tracking-[0] leading-[22px] [direction:rtl] pr-10"
                  />
                  <img
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    alt="Mail"
                    src="/figmaAssets/mail.svg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {footerSections.map((section, index) => (
                <div key={index} className="flex flex-col [direction:rtl]">
                  <h4 className="[font-family:'Cairo',Helvetica] font-semibold text-[#242524] text-sm tracking-[0] leading-5 whitespace-nowrap mb-4">
                    {section.title}
                  </h4>
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href="#"
                      className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-base tracking-[0] leading-6 whitespace-nowrap mb-4 hover:text-[#636ae8] transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#ebebea]">
              <Button
                variant="outline"
                className="h-auto bg-[#f7f7f7] rounded-md border border-solid border-[#ebebea] px-4 py-2"
              >
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-[22px] whitespace-nowrap">
                  English
                </span>
              </Button>

              <div className="flex items-center gap-2 [direction:rtl]">
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  Â© 2025 Ibbaaq-Ø¹Ø¨Ø§Ù‚.
                </span>
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  â€¢
                </span>
                <a
                  href="#"
                  className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap hover:text-[#636ae8] transition-colors"
                >
                  Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©
                </a>
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  â€¢
                </span>
                <a
                  href="#"
                  className="[font-family:'Inter',Helvetica] font-normal text-[#8c8d8b] text-sm tracking-[0] leading-5 whitespace-nowrap hover:text-[#636ae8] transition-colors"
                >
                  Ø´Ø±ÙˆØ· Ø§Ù„Ø®Ø¯Ù…Ø©
                </a>
              </div>

              <div className="flex items-center gap-4">
                <img
                  className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
                  alt="Twitter"
                  src="/figmaAssets/twitter.svg"
                />
                <img
                  className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
                  alt="Facebook"
                  src="/figmaAssets/facebook.svg"
                />
                <img
                  className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity"
                  alt="Linkedin"
                  src="/figmaAssets/linkedin.svg"
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};




