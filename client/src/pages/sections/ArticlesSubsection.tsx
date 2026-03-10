import { ChevronLeftIcon, ChevronRightIcon, MailIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©", active: false },
  { label: "Ù…Ù† Ù†Ø­Ù†", active: false },
  { label: "Ø®Ø¯Ù…Ø§ØªÙ†Ø§", active: false },
  { label: "Ù…Ù‚Ø§Ù„Ø§Øª", active: true },
  { label: "ØªÙˆØ§ØµÙ„ Ù…Ø¹Ù†Ø§", active: false },
];

const filterTags = [
  { label: "Ø§Ù„ÙƒÙ„", active: true },
  { label: "Ø§Ù„Ù‚ÙŠØ§Ø¯Ø©", active: false },
  { label: "Ø§Ù„ØªÙ‚ÙŠÙŠÙ…", active: false },
  { label: "Ø§Ù„Ø´Ø±Ø§ÙƒØ§Øª", active: false },
  { label: "Ø§Ù„ØªØ³ÙˆÙŠÙ‚", active: false },
  { label: "ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª", active: false },
  { label: "Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹", active: false },
  { label: "Ø¯Ø±Ø§Ø³Ø§Øª Ø­Ø§Ù„Ø©", active: false },
  { label: "Ø§Ù„Ù…Ù†Ø¸Ù…Ø§Øª ØºÙŠØ± Ø§Ù„Ø±Ø¨Ø­ÙŠØ©", active: false },
  { label: "Ø±ÙŠØ§Ø¯Ø© Ø§Ù„Ø£Ø¹Ù…Ø§Ù„", active: false },
  { label: "Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§", active: false },
];

const featuredArticle = {
  category: "Ø±ÙŠØ§Ø¯Ø© Ø§Ù„Ø£Ø¹Ù…Ø§Ù„",
  title: "ÙƒÙŠÙ ØªØ·Ù„Ù‚ Ù…Ø´Ø±ÙˆØ¹Ùƒ Ø§Ù„Ù†Ø§Ø¬Ø­ ÙÙŠ Ø§Ù„Ø³ÙˆÙ‚ Ø§Ù„Ø¹Ø±Ø¨ÙŠØŸ",
  description:
    "Ø¯Ù„ÙŠÙ„ Ø´Ø§Ù…Ù„ Ù„Ù„Ù…Ø¨ØªØ¯Ø¦ÙŠÙ† ÙˆØ±ÙˆØ§Ø¯ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ Ù„ØªØ­Ø¯ÙŠØ¯ Ø§Ù„ÙÙƒØ±Ø© ÙˆØ¨Ù†Ø§Ø¡ Ø§Ù„Ø®Ø·Ø© ÙˆØ§Ù„ØªØºÙ„Ø¨ Ø¹Ù„Ù‰ Ø§Ù„ØªØ­Ø¯ÙŠØ§Øª Ø§Ù„Ù…Ø­Ù„ÙŠØ©.",
  date: "2024-10-27",
};

const articles = [
  {
    category: "Ø§Ù„Ù…Ù†Ø¸Ù…Ø§Øª ØºÙŠØ± Ø§Ù„Ø±Ø¨Ø­ÙŠØ©",
    title: "Ø£Ù‡Ù…ÙŠØ© Ø§Ù„ØªØ®Ø·ÙŠØ· Ø§Ù„Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠ Ù„Ù„Ù…Ø¤Ø³Ø³Ø§Øª ØºÙŠØ± Ø§Ù„Ø±Ø¨Ø­ÙŠØ©",
    description:
      "ØªØ¹Ø±Ù Ø¹Ù„Ù‰ ÙƒÙŠÙÙŠØ© ØµÙŠØ§ØºØ© Ø±Ø¤ÙŠØ© ÙˆØ±Ø³Ø§Ù„Ø© ÙˆØ§Ø¶Ø­Ø© ÙˆØªØ­ÙˆÙŠÙ„Ù‡Ø§ Ø¥Ù„Ù‰ Ø£Ù‡Ø¯Ø§Ù Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„ØªØ­Ù‚ÙŠÙ‚.",
    date: "2024-10-25",
  },
  {
    category: "Ø¯Ø±Ø§Ø³Ø§Øª Ø­Ø§Ù„Ø©",
    title: "Ø¯Ø±Ø§Ø³Ø© Ø­Ø§Ù„Ø©: Ø¹Ø¨Ø§Ù‚ ÙˆØªÙ…ÙƒÙŠÙ† Ø§Ù„Ù…Ø¬ØªÙ…Ø¹Ø§Øª Ø§Ù„Ø±ÙŠÙÙŠØ©",
    description:
      "Ù†Ø³ØªØ¹Ø±Ø¶ ÙÙŠ Ù‡Ø°Ù‡ Ø§Ù„Ø¯Ø±Ø§Ø³Ø© ÙƒÙŠÙ Ø³Ø§Ù‡Ù…Øª Ù…Ø¨Ø§Ø¯Ø±Ø§Øª Ø¹Ø¨Ø§Ù‚ ÙÙŠ ØªØ­Ø³ÙŠÙ† Ø³Ø¨Ù„ Ø¹ÙŠØ´ Ø§Ù„Ø£Ø³Ø± ÙÙŠ Ø§Ù„Ù…Ù†Ø§Ø·Ù‚ Ø§Ù„Ø±ÙŠÙÙŠØ©.",
    date: "2024-10-22",
  },
  {
    category: "Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹",
    title: "Ø¨Ù†Ø§Ø¡ ÙØ±ÙŠÙ‚ Ø¹Ù…Ù„ ÙØ¹Ø§Ù„: Ù†ØµØ§Ø¦Ø­ ÙˆØ¥Ø±Ø´Ø§Ø¯Ø§Øª",
    description: "ÙƒÙŠÙ ØªØ®ØªØ§Ø± Ø§Ù„Ø£Ø¹Ø¶Ø§Ø¡ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨ÙŠÙ† ÙˆØªØ­ÙØ²Ù‡Ù… Ù„ØªØ­Ù‚ÙŠÙ‚ Ø£Ù‡Ø¯Ø§Ù Ù…Ø´ØªØ±ÙƒØ©.",
    date: "2024-10-20",
  },
  {
    category: "Ø§Ù„Ù…Ù†Ø¸Ù…Ø§Øª ØºÙŠØ± Ø§Ù„Ø±Ø¨Ø­ÙŠØ©",
    title: "Ø£ÙØ¶Ù„ Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø§Øª ÙÙŠ Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ØªØ·ÙˆØ¹ÙŠÙ†",
    description:
      "Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ§Øª Ù„ØªÙˆØ¸ÙŠÙ Ø§Ù„Ù…ØªØ·ÙˆØ¹ÙŠÙ† ÙˆØªØ¯Ø±ÙŠØ¨Ù‡Ù… ÙˆØ§Ù„Ø§Ø­ØªÙØ§Ø¸ Ø¨Ù‡Ù… Ø¨Ø´ÙƒÙ„ ÙØ¹Ø§Ù„.",
    date: "2024-10-18",
  },
  {
    category: "ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª",
    title: "ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ù„ØªØ­Ø³ÙŠÙ† Ø§Ù„Ø£Ø¯Ø§Ø¡ Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠ",
    description: "ÙƒÙŠÙ ØªØ³ØªØ®Ø¯Ù… Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ù„Ø§ØªØ®Ø§Ø° Ù‚Ø±Ø§Ø±Ø§Øª Ù…Ø³ØªÙ†ÙŠØ±Ø© ÙˆØªØ­Ù‚ÙŠÙ‚ Ù†ØªØ§Ø¦Ø¬ Ø£ÙØ¶Ù„.",
    date: "2024-10-15",
  },
  {
    category: "Ø§Ù„ØªØ³ÙˆÙŠÙ‚",
    title: "Ø§Ù„ØªØ³ÙˆÙŠÙ‚ Ø§Ù„Ø±Ù‚Ù…ÙŠ Ù„Ù„Ù…Ø¨Ø§Ø¯Ø±Ø§Øª Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠØ©",
    description:
      "Ø§Ø³ØªØºÙ„ Ù‚ÙˆØ© Ø§Ù„Ø£Ø¯ÙˆØ§Øª Ø§Ù„Ø±Ù‚Ù…ÙŠØ© Ù„Ù„ÙˆØµÙˆÙ„ Ø¥Ù„Ù‰ Ø¬Ù…Ù‡ÙˆØ± Ø£ÙˆØ³Ø¹ ÙˆØªØ¹Ø²ÙŠØ² Ø±Ø³Ø§Ù„ØªÙƒ.",
    date: "2024-10-13",
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

export const ArticlesSubsection = (): JSX.Element => {
  return (
    <div className="w-full bg-white overflow-hidden">
      <nav className="flex items-center justify-center h-14 bg-white border-b shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
        <div className="flex flex-wrap items-center gap-3 px-4 [direction:rtl]">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`text-sm font-medium [font-family:'Inter',Helvetica] ${
                item.active ? "text-[#636ae8]" : "text-[#242524]"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="ml-auto w-full sm:w-auto text-center sm:text-right text-lg font-medium text-[#242524] [font-family:'Inter',Helvetica] [direction:rtl]">
            Ibaaq-Ø¹Ø¨Ø§Ù‚
          </div>
        </div>
      </nav>

      <main className="max-w-[1184px] mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#242524] text-center mb-6 [font-family:'Cairo',Helvetica] [direction:rtl]">
          Ù…Ù‚Ø§Ù„Ø§Øª ÙˆÙ…Ø¯ÙˆÙ†Ø§Øª Ø¹Ø¨Ø§Ù‚
        </h1>

        <p className="text-lg text-[#8c8d8b] text-center mb-12 [font-family:'Inter',Helvetica] [direction:rtl]">
          Ø§Ø³ØªÙƒØ´Ù Ø£Ø­Ø¯Ø« Ø§Ù„Ù…Ù‚Ø§Ù„Ø§ØªØŒ Ø¯Ø±Ø§Ø³Ø§Øª Ø§Ù„Ø­Ø§Ù„Ø©ØŒ ÙˆØ§Ù„Ù…ÙˆØ§Ø±Ø¯ Ø§Ù„ØªÙŠ ØªØ³Ø§Ø¹Ø¯Ùƒ ÙÙŠ Ø±Ø­Ù„ØªÙƒ Ù†Ø­Ùˆ
          Ø§Ù„ØªÙ†Ù…ÙŠØ© Ø§Ù„Ù…Ø³ØªØ¯Ø§Ù…Ø©.
        </p>

        <div className="flex flex-wrap gap-2 justify-center mb-12 [direction:rtl]">
          {filterTags.map((tag, index) => (
            <Button
              key={index}
              variant={tag.active ? "default" : "outline"}
              className={`h-auto px-3 py-2 text-sm [font-family:'Inter',Helvetica] ${
                tag.active
                  ? "bg-[#636ae8] text-white hover:bg-[#636ae8]/90"
                  : "bg-white text-[#242524] border-[#ebebea] hover:bg-gray-50"
              }`}
            >
              {tag.label}
            </Button>
          ))}
        </div>

        <Card className="mb-12 overflow-hidden border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-[#c4c4c4] aspect-video md:aspect-auto" />
              <div className="p-6 flex flex-col justify-between [direction:rtl]">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-4 text-xs text-[#8c8d8b] border-[#8c8d8b80] [font-family:'Inter',Helvetica]"
                  >
                    {featuredArticle.category}
                  </Badge>
                  <h2 className="text-2xl font-semibold text-[#242524] mb-4 [font-family:'Cairo',Helvetica]">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-base text-[#8c8d8b] mb-6 [font-family:'Inter',Helvetica]">
                    {featuredArticle.description}
                  </p>
                </div>
                <time className="text-sm text-[#8c8d8b] [font-family:'Inter',Helvetica]">
                  {featuredArticle.date}
                </time>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {articles.map((article, index) => (
            <Card
              key={index}
              className="overflow-hidden border-[#ebebea] shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f]"
            >
              <CardContent className="p-0">
                <div
                  className={`${
                    index < 3 ? "bg-[#c4c4c4]" : "bg-[#d9d9d9]"
                  } aspect-video`}
                />
                <div className="p-4 [direction:rtl]">
                  <Badge
                    variant="outline"
                    className="mb-2 text-xs text-[#8c8d8b] border-[#8c8d8b80] [font-family:'Inter',Helvetica]"
                  >
                    {article.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-[#242524] mb-3 [font-family:'Cairo',Helvetica] line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#8c8d8b] mb-4 [font-family:'Inter',Helvetica] line-clamp-2">
                    {article.description}
                  </p>
                  <time className="text-xs text-[#8c8d8b] [font-family:'Inter',Helvetica]">
                    {article.date}
                  </time>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <Button
            variant="ghost"
            className="h-auto gap-2 text-sm font-medium text-[#242524] [font-family:'Inter',Helvetica]"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            className="w-10 h-10 text-sm font-medium text-[#242524] border-[#ebebea] [font-family:'Inter',Helvetica]"
          >
            1
          </Button>
          <Button
            variant="ghost"
            className="h-auto text-sm font-medium text-[#242524] [font-family:'Inter',Helvetica]"
          >
            2
          </Button>
          <Button
            variant="ghost"
            className="h-auto gap-2 text-sm font-medium text-[#242524] [font-family:'Inter',Helvetica]"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>

        <Card className="overflow-hidden border-0 shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] bg-gradient-to-r from-[#2563eb] to-[#22c55e]">
          <CardContent className="p-6 sm:p-8 md:p-12 text-center [direction:rtl]">
            <h2 className="text-4xl font-bold text-white mb-4 [font-family:'Cairo',Helvetica]">
              Ø§Ø´ØªØ±Ùƒ ÙÙŠ Ù†Ø´Ø±ØªÙ†Ø§ Ø§Ù„Ø¥Ø®Ø¨Ø§Ø±ÙŠØ©
            </h2>
            <p className="text-lg text-white/90 mb-8 [font-family:'Inter',Helvetica]">
              ÙƒÙ† Ø£ÙˆÙ„ Ù…Ù† ÙŠØ¹Ù„Ù… Ø¨Ø£Ø­Ø¯Ø« Ù…Ù‚Ø§Ù„Ø§ØªÙ†Ø§ ÙˆØ£Ø®Ø¨Ø§Ø±Ù†Ø§.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ"
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white [font-family:'Inter',Helvetica] h-auto py-2"
              />
              <Button className="bg-white text-[#171a1f] hover:bg-white/90 [font-family:'Inter',Helvetica] h-auto px-6">
                Ø§Ø´ØªØ±Ùƒ
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1f] py-12 md:py-16">
        <div className="max-w-[1232px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#242524] mb-6 [font-family:'Inter',Helvetica] [direction:rtl]">
              Ibaaq-Ø¹Ø¨Ø§Ù‚
            </h2>
            <p className="text-lg font-semibold text-[#242524] mb-4 [font-family:'Cairo',Helvetica] [direction:rtl]">
              Ø§Ø´ØªØ±Ùƒ ÙÙŠ Ù†Ø´Ø±ØªÙ†Ø§ Ø§Ù„Ø¥Ø®Ø¨Ø§Ø±ÙŠØ©
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto [direction:rtl]">
              <Button className="bg-[#636ae8] text-white hover:bg-[#636ae8]/90 [font-family:'Inter',Helvetica] h-auto px-6">
                Ø§Ø´ØªØ±Ùƒ
              </Button>
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ"
                  className="border-[#ebebea] [font-family:'Inter',Helvetica] h-auto py-2 pr-10"
                />
                <MailIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8d8b]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 [direction:rtl]">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-[#242524] mb-4 [font-family:'Cairo',Helvetica]">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-base text-[#8c8d8b] hover:text-[#242524] [font-family:'Inter',Helvetica]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#ebebea]">
            <Button
              variant="outline"
              className="h-auto px-4 py-2 bg-[#f7f7f7] border-[#ebebea] text-[#8c8d8b] [font-family:'Inter',Helvetica]"
            >
              English
            </Button>

            <div className="flex items-center gap-2 text-sm text-[#8c8d8b] [font-family:'Inter',Helvetica] [direction:rtl]">
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
              <a href="#" className="text-[#8c8d8b] hover:text-[#242524]">
                <img
                  src="/figmaAssets/twitter.svg"
                  alt="Twitter"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="text-[#8c8d8b] hover:text-[#242524]">
                <img
                  src="/figmaAssets/facebook.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </a>
              <a href="#" className="text-[#8c8d8b] hover:text-[#242524]">
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

