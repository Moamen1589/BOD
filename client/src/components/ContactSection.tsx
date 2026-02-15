import { Mail, Phone, Globe, Send, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: Mail, label: "البريد الإلكتروني", value: "de@birthofdream.com" },
  { icon: Phone, label: "الهاتف", value: "+966 12 654 4705" },
  { icon: Phone, label: "الجوال", value: "+966 56 777 1966" },
  { icon: Globe, label: "الموقع", value: "bod.com.sa" },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("inquiry");
  const [message, setMessage] = useState("");
  const header = useScrollAnimation();
  const content = useScrollAnimation();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("POST", "/api/contact", { name, phone, email, purpose, message });
      setSubmitted(true);
    } catch {
      toast({ title: "حدث خطأ", description: "يرجى المحاولة مرة أخرى", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div ref={header.ref} className={`text-center mb-16 scroll-hidden ${header.isVisible ? "scroll-visible" : ""}`}>
          <span className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md" data-testid="badge-contact">
            تواصل معنا
          </span>
          <h2 className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4" data-testid="text-contact-title">
            فى انتظار تواصلك معنا
          </h2>
          <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
            نحن هنا للإجابة على جميع استفساراتك وتقديم الدعم في كل خطوة
          </p>
        </div>

        <div ref={content.ref} className={`grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto scroll-hidden ${content.isVisible ? "scroll-visible" : ""}`}>
          <div>
            <div className="space-y-5 mb-10">
              {contactInfo.map((c, i) => (
                <div key={i} className="flex items-center gap-4" data-testid={`contact-info-${c.label}`}>
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-md flex items-center justify-center shrink-0">
                    <c.icon size={20} className="text-brand-gold-dark" />
                  </div>
                  <div>
                    <p className="font-almarai text-sm text-brand-gray">{c.label}</p>
                    <p className="font-almarai font-bold text-brand-dark">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-dark rounded-md p-6">
                <FileDown size={24} className="text-brand-gold mb-3" />
                <h4 className="font-almarai font-bold text-white text-sm mb-2">الملف التعريفي</h4>
                <Button asChild variant="outline" size="sm" className="border-white/20 text-white font-almarai rounded-md w-full">
                  <a href="https://drive.google.com/file/d/1zxp5_YorOLzBk0mPqkzPlZgzu0h3rrZW/view?usp=sharing" target="_blank" rel="noopener noreferrer" data-testid="link-profile-download">
                    تحميل
                  </a>
                </Button>
              </div>
              <div className="bg-brand-dark rounded-md p-6">
                <FileDown size={24} className="text-brand-gold mb-3" />
                <h4 className="font-almarai font-bold text-white text-sm mb-2">التقرير السنوي</h4>
                <Button asChild variant="outline" size="sm" className="border-white/20 text-white font-almarai rounded-md w-full">
                  <a href="https://drive.google.com/file/d/1uumhRJM4GnTlmoLR4B3KhCezHabnEaSN/view?usp=sharing" target="_blank" rel="noopener noreferrer" data-testid="link-report-download">
                    تحميل
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md p-8 border border-gray-100 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-brand-gold/15 rounded-full flex items-center justify-center mb-4">
                  <Send size={28} className="text-brand-gold-dark" />
                </div>
                <h3 className="font-almarai font-bold text-xl text-brand-dark mb-2" data-testid="text-form-success">تم الإرسال بنجاح</h3>
                <p className="font-almarai text-brand-gray">سنتواصل معك في أقرب وقت</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">الاسم / الجهة</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك أو اسم الجهة" className="font-almarai rounded-md" required data-testid="input-name" />
                </div>
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">الجوال</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="أدخل رقم الجوال" className="font-almarai rounded-md" required data-testid="input-phone" />
                </div>
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">البريد الإلكتروني</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="أدخل بريدك الإلكتروني" className="font-almarai rounded-md" required data-testid="input-email" />
                </div>
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">الغرض من الاتصال</label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger className="font-almarai rounded-md" data-testid="select-purpose">
                      <SelectValue placeholder="اختر الغرض" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inquiry">استفسار عام</SelectItem>
                      <SelectItem value="complaint">شكوى</SelectItem>
                      <SelectItem value="callback">طلب تواصل معك</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">محتوى الرسالة</label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="كيف يمكننا مساعدتك؟" rows={4} className="font-almarai rounded-md resize-none" required data-testid="textarea-message" />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-brand-gold text-white font-almarai rounded-lg text-base gap-2 font-bold" data-testid="button-submit-contact">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  إرسال الرسالة
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
