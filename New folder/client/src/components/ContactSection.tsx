import {
  Mail,
  Phone,
  Send,
  FileDown,
  Loader2,
  LocateIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: Mail, label: "البريد الإلكتروني", value: "de@birthofdream.com" },
  { icon: Phone, label: "الهاتف", value: "966126544705+" },
  {
    icon: LocateIcon,
    label: "مقر الشركة",
    value:
      "السعودية - جدة - شارع فؤاد شاكر حى النزهة مركز ريفا للأعمال الدور الثالث مكتب -302",
  },
];

const contactSchema = z.object({
  name: z.string().min(1, { message: "برجاء إدخال الاسم" }),
  phone: z
    .string()
    .min(1, { message: "برجاء إدخال رقم الجوال" })
    .refine((value) => value.replace(/\D/g, "").length >= 7, {
      message: "رقم الجوال غير صحيح",
    }),
  email: z
    .string()
    .min(1, { message: "برجاء إدخال البريد الإلكتروني" })
    .email({ message: "البريد الإلكتروني غير صحيح" }),
  subject: z.string().min(1, { message: "برجاء اختيار الغرض" }),
  message: z.string().min(1, { message: "برجاء كتابة الرسالة" }),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const header = useScrollAnimation();
  const content = useScrollAnimation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    },
    mode: "onBlur",
  });

  const shouldShowError = (field: keyof ContactForm) =>
    (touchedFields[field] || isSubmitted) && Boolean(errors[field]);

  const getError = (field: keyof ContactForm) =>
    errors[field]?.message as string | undefined;

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    try {
      await apiRequest(
        "POST",
        "https://gold-weasel-489740.hostingersite.com/api/contact-us",
        data
      );
      setSubmitted(true);
    } catch {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div
          ref={header.ref}
          className={`text-center mb-16 scroll-hidden ${header.isVisible ? "scroll-visible" : ""}`}
        >
          <span
            className="font-almarai text-sm font-bold text-brand-gold-dark bg-brand-gold/10 px-4 py-1.5 rounded-md"
            data-testid="badge-contact"
          >
            تواصل معنا
          </span>
          <h2
            className="font-almarai font-extrabold text-3xl md:text-4xl text-brand-dark mt-6 mb-4"
            data-testid="text-contact-title"
          >
            في انتظار تواصلك معنا
          </h2>
          <p className="font-almarai text-brand-gray max-w-2xl mx-auto text-lg">
            نحن هنا للإجابة على جميع استفساراتك وتقديم الدعم في كل خطوة
          </p>
        </div>

        <div
          ref={content.ref}
          className={`grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto scroll-hidden ${content.isVisible ? "scroll-visible" : ""}`}
        >
          <div>
            <div className="space-y-5 mb-10">
              {contactInfo.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4"
                  data-testid={`contact-info-${c.label}`}
                >
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-md flex items-center justify-center shrink-0">
                    <c.icon size={20} className="text-brand-gold-dark" />
                  </div>
                  <div>
                    <p className="font-almarai text-sm text-brand-gray">
                      {c.label}
                    </p>
                    <p className="font-almarai font-bold text-brand-dark">
                      {c.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-brand-dark rounded-md p-6">
                <FileDown size={24} className="text-brand-gold mb-3" />
                <h4 className="font-almarai font-bold text-white text-sm mb-2">
                  الملف التعريفي
                </h4>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-brand-gold font-almarai rounded-md w-full hover:bg-brand-gold hover:text-white"
                >
                  <a
                    href="https://drive.google.com/file/d/1zxp5_YorOLzBk0mPqkzPlZgzu0h3rrZW/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-profile-download"
                  >
                    تحميل
                  </a>
                </Button>
              </div>
              <div className="bg-brand-dark rounded-md p-6">
                <FileDown size={24} className="text-brand-gold mb-3" />
                <h4 className="font-almarai font-bold text-white text-sm mb-2">
                  التقرير السنوي
                </h4>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-brand-gold font-almarai rounded-md w-full hover:bg-brand-gold hover:text-white"
                >
                  <a
                    href="https://drive.google.com/file/d/1uumhRJM4GnTlmoLR4B3KhCezHabnEaSN/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-report-download"
                  >
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
                <h3
                  className="font-almarai font-bold text-xl text-brand-dark mb-2"
                  data-testid="text-form-success"
                >
                  تم الإرسال بنجاح
                </h3>
                <p className="font-almarai text-brand-gray">
                  سنتواصل معك في أقرب وقت
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">
                    الاسم / الجهة
                  </label>
                  <Input
                    {...register("name")}
                    placeholder="أدخل اسمك أو اسم الجهة"
                    className="font-almarai rounded-md"
                    required
                    data-testid="input-name"
                  />
                  {shouldShowError("name") && (
                    <p className="font-almarai text-xs text-red-600 mt-1">
                      {getError("name")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">
                    الجوال
                  </label>
                  <Input
                    dir="rtl"
                    {...register("phone")}
                    type="tel"
                    placeholder="أدخل رقم الجوال"
                    className="font-almarai rounded-md"
                    required
                    data-testid="input-phone"
                  />
                  {shouldShowError("phone") && (
                    <p className="font-almarai text-xs text-red-600 mt-1">
                      {getError("phone")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">
                    البريد الإلكتروني
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    className="font-almarai rounded-md"
                    required
                    data-testid="input-email"
                  />
                  {shouldShowError("email") && (
                    <p className="font-almarai text-xs text-red-600 mt-1">
                      {getError("email")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">
                    الغرض من الاتصال
                  </label>
                  <Controller
                    control={control}
                    name="subject"
                    render={({ field }) => (
                      <Select
                        dir="rtl"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="font-almarai rounded-md"
                          data-testid="select-purpose"
                        >
                          <SelectValue placeholder="اختر الغرض" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Inquiry">
                            استفسار عام
                          </SelectItem>
                          <SelectItem value="Feedback">شكوى</SelectItem>
                          <SelectItem value="Support">طلب تواصل معك</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {shouldShowError("subject") && (
                    <p className="font-almarai text-xs text-red-600 mt-1">
                      {getError("subject")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-almarai text-sm font-bold text-brand-dark mb-1.5 block">
                    محتوى الرسالة
                  </label>
                  <Textarea
                    {...register("message")}
                    placeholder="كيف يمكننا مساعدتك؟"
                    rows={4}
                    className="font-almarai rounded-md resize-none"
                    required
                    data-testid="textarea-message"
                  />
                  {shouldShowError("message") && (
                    <p className="font-almarai text-xs text-red-600 mt-1">
                      {getError("message")}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-gold text-white font-almarai rounded-lg text-base gap-2 font-bold"
                  data-testid="button-submit-contact"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
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
