import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowRight, Plus, Trash2, BarChart3, TrendingUp, Users,
  DollarSign, Calendar, CheckCircle2, AlertCircle, Clock,
  FileText, Download, ChevronDown, ChevronUp, Shield
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

type Quarter = {
  programCost: string;
  programBudget: string;
  beneficiaries: string;
};

type FormData = {
  programName: string;
  actualCost: string;
  resourceEfficiency: string;
  costPerBeneficiary: string;
  startDate: string;
  endDate: string;
  status: string;
  duration: string;
  quarters: { Q1: Quarter; Q2: Quarter; Q3: Quarter; Q4: Quarter };
};

const emptyQuarter: Quarter = { programCost: "", programBudget: "", beneficiaries: "" };

const initialForm: FormData = {
  programName: "",
  actualCost: "",
  resourceEfficiency: "",
  costPerBeneficiary: "",
  startDate: "",
  endDate: "",
  status: "جارٍ التنفيذ",
  duration: "",
  quarters: { Q1: { ...emptyQuarter }, Q2: { ...emptyQuarter }, Q3: { ...emptyQuarter }, Q4: { ...emptyQuarter } },
};

const COLORS = ["#FF6900", "#242423", "#73748C", "#FFF3E8"];

function KPICard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: any; color: string }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border-r-4 ${color} flex items-start gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color.replace("border-", "bg-").replace("-500", "-100").replace("-gold", "-light-gold")}`}>
        <Icon className={`w-6 h-6 ${color.replace("border-", "text-")}`} />
      </div>
      <div>
        <p className="text-brand-gray text-xs font-bold mb-1">{label}</p>
        <p className="text-brand-dark text-2xl font-black">{value}</p>
        {sub && <p className="text-brand-gray text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function GovernancePage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "results">("form");

  const setField = (field: keyof Omit<FormData, "quarters">, val: string) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const setQuarterField = (q: keyof FormData["quarters"], field: keyof Quarter, val: string) =>
    setForm(prev => ({ ...prev, quarters: { ...prev.quarters, [q]: { ...prev.quarters[q], [field]: val } } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setActiveTab("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quarterKeys = ["Q1", "Q2", "Q3", "Q4"] as const;
  const quarterLabels: Record<string, string> = { Q1: "الربع الأول", Q2: "الربع الثاني", Q3: "الربع الثالث", Q4: "الربع الرابع" };

  // Computed values for results
  const totalActual = parseFloat(form.actualCost) || 0;
  const totalBudget = quarterKeys.reduce((s, q) => s + (parseFloat(form.quarters[q].programBudget) || 0), 0);
  const totalBeneficiaries = quarterKeys.reduce((s, q) => s + (parseFloat(form.quarters[q].beneficiaries) || 0), 0);
  const budgetVariance = totalBudget ? (((totalBudget - totalActual) / totalBudget) * 100).toFixed(1) : "0";
  const efficiency = parseFloat(form.resourceEfficiency) || 0;
  const costPerBene = parseFloat(form.costPerBeneficiary) || (totalBeneficiaries ? (totalActual / totalBeneficiaries) : 0);

  const chartData = quarterKeys.map(q => ({
    name: quarterLabels[q],
    "التكلفة الفعلية": parseFloat(form.quarters[q].programCost) || 0,
    "الميزانية": parseFloat(form.quarters[q].programBudget) || 0,
    "المستفيدون": parseFloat(form.quarters[q].beneficiaries) || 0,
  }));

  const pieData = [
    { name: "مُنفَّق", value: totalActual },
    { name: "متبقي", value: Math.max(0, totalBudget - totalActual) },
  ];

  const statusColor = form.status === "مكتمل" ? "text-green-600 bg-green-100" :
    form.status === "جارٍ التنفيذ" ? "text-blue-600 bg-blue-100" :
    form.status === "متوقف" ? "text-red-600 bg-red-100" : "text-amber-600 bg-amber-100";

  return (
    <div className="w-full min-h-screen flex flex-col font-almarai bg-[#F5F5F7]" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-10 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/ecstt" className="inline-flex items-center gap-2 text-white/40 hover:text-brand-gold mb-8 text-sm font-bold transition-colors">
            <ArrowRight className="w-4 h-4" /> المنظومة الاجتماعية
          </Link>
          <div className="flex items-start gap-5 mb-6">
            <div className="bg-brand-gold w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="bg-brand-gold/20 text-brand-gold px-4 py-1 rounded-full text-xs font-black mb-3 inline-block">حوكمة مجتمعية</span>
              <h1 className="text-3xl md:text-5xl font-black leading-tight">نظام حوكمة المشاريع والبرامج</h1>
              <p className="text-white/60 mt-3 text-base max-w-2xl">أدوات مساءلة وشفافية مالية تفاعلية — أدخل بيانات برنامجك واحصل على تقرير حوكمة كامل فوراً</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mt-8">
            {[{ id: "form", label: "📝 إدخال البيانات" }, { id: "results", label: "📊 النتائج والتقرير" }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-black text-sm transition-all ${activeTab === tab.id ? "bg-brand-gold text-white shadow-lg" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-10 flex-1">
        {activeTab === "form" && (
          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">

            {/* Basic Info */}
            <div className="bg-white rounded-3xl shadow-md p-8">
              <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-gold" /> معلومات البرنامج / المشروع
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-brand-dark mb-2">اسم البرنامج / المشروع *</label>
                  <input required value={form.programName} onChange={e => setField("programName", e.target.value)}
                    placeholder="مثال: برنامج تدريب الشباب 2025"
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm" />
                </div>

                {[
                  { label: "تكلفة البرنامج الفعلية (ريال)", field: "actualCost", placeholder: "0.00", type: "number" },
                  { label: "كفاءة استخدام الموارد (%)", field: "resourceEfficiency", placeholder: "0 - 100", type: "number" },
                  { label: "تكلفة المستفيد الفعلية (ريال)", field: "costPerBeneficiary", placeholder: "0.00", type: "number" },
                  { label: "مدة التنفيذ (بالأيام)", field: "duration", placeholder: "0", type: "number" },
                ].map(({ label, field, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-xs font-black text-brand-dark mb-2">{label}</label>
                    <input type={type} value={(form as any)[field]} onChange={e => setField(field as any, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm" />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-black text-brand-dark mb-2">تاريخ البدء</label>
                  <input type="date" value={form.startDate} onChange={e => setField("startDate", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-black text-brand-dark mb-2">تاريخ الانتهاء</label>
                  <input type="date" value={form.endDate} onChange={e => setField("endDate", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-black text-brand-dark mb-2">حالة المشروع</label>
                  <select value={form.status} onChange={e => setField("status", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm bg-white">
                    {["مكتمل", "جارٍ التنفيذ", "في المرحلة التخطيطية", "متوقف"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Quarters */}
            <div className="bg-white rounded-3xl shadow-md p-8">
              <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-gold" /> البيانات الربعية
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quarterKeys.map(q => (
                  <div key={q} className="bg-brand-light rounded-2xl p-5 border-2 border-brand-gold/10">
                    <h3 className="font-black text-brand-dark text-sm mb-4 flex items-center gap-2">
                      <span className="bg-brand-gold text-white w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black">{q}</span>
                      {quarterLabels[q]}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "تكلفة البرنامج (ريال)", field: "programCost" },
                        { label: "ميزانية البرنامج (ريال)", field: "programBudget" },
                        { label: "عدد المستفيدين", field: "beneficiaries" },
                      ].map(({ label, field }) => (
                        <div key={field}>
                          <label className="block text-xs font-bold text-brand-gray mb-1">{label}</label>
                          <input type="number" placeholder="0"
                            value={(form.quarters[q] as any)[field]}
                            onChange={e => setQuarterField(q, field as any, e.target.value)}
                            className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-brand-dark text-sm bg-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-gold/30 flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" /> إنشاء تقرير الحوكمة
            </Button>
          </form>
        )}

        {activeTab === "results" && !submitted && (
          <div className="max-w-xl mx-auto text-center py-24">
            <div className="w-20 h-20 bg-brand-light-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-brand-gold" />
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-3">لا توجد بيانات بعد</h3>
            <p className="text-brand-gray mb-6">أدخل بيانات البرنامج في تبويب "إدخال البيانات" لعرض التقرير</p>
            <Button onClick={() => setActiveTab("form")} className="bg-brand-gold text-white px-8 py-4 rounded-2xl font-black">ابدأ الإدخال</Button>
          </div>
        )}

        {activeTab === "results" && submitted && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-brand-dark rounded-3xl p-8 text-white flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-white/50 text-sm font-bold mb-1">تقرير حوكمة المشروع</p>
                <h2 className="text-3xl font-black">{form.programName || "البرنامج"}</h2>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black ${statusColor}`}>{form.status}</span>
                  {form.startDate && <span className="text-white/40 text-xs">{form.startDate} — {form.endDate}</span>}
                  {form.duration && <span className="text-white/40 text-xs">مدة التنفيذ: {form.duration} يوم</span>}
                </div>
              </div>
              <Button onClick={() => { setActiveTab("form"); }} variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl font-bold text-sm">
                تعديل البيانات
              </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard label="التكلفة الفعلية الإجمالية" value={`${totalActual.toLocaleString()} ر.س`} icon={DollarSign} color="border-brand-gold text-brand-gold" />
              <KPICard label="إجمالي الميزانية المخططة" value={`${totalBudget.toLocaleString()} ر.س`} sub={`فرق: ${budgetVariance}%`} icon={TrendingUp} color="border-blue-500 text-blue-500" />
              <KPICard label="إجمالي المستفيدين" value={totalBeneficiaries.toLocaleString()} icon={Users} color="border-green-500 text-green-500" />
              <KPICard label="كفاءة استخدام الموارد" value={`${efficiency}%`} sub={efficiency >= 80 ? "✅ أداء ممتاز" : efficiency >= 60 ? "⚠️ يحتاج تحسين" : "❌ أداء ضعيف"} icon={CheckCircle2} color={efficiency >= 80 ? "border-green-500 text-green-500" : efficiency >= 60 ? "border-amber-500 text-amber-500" : "border-red-500 text-red-500"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KPICard label="تكلفة المستفيد الفعلية" value={`${costPerBene.toFixed(0)} ر.س`} sub="لكل مستفيد" icon={DollarSign} color="border-purple-500 text-purple-500" />
              <KPICard label="نسبة الإنفاق من الميزانية"
                value={totalBudget ? `${((totalActual / totalBudget) * 100).toFixed(1)}%` : "—"}
                sub={Number(budgetVariance) > 0 ? `وفورات: ${Math.abs(Number(budgetVariance))}%` : `تجاوز: ${Math.abs(Number(budgetVariance))}%`}
                icon={BarChart3} color="border-orange-500 text-orange-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bar Chart - Quarterly */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-7">
                <h3 className="font-black text-brand-dark mb-5">التكاليف والميزانية ربعياً</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Almarai" }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => v.toLocaleString()} />
                    <Tooltip formatter={(v: any) => `${Number(v).toLocaleString()} ر.س`} />
                    <Legend />
                    <Bar dataKey="التكلفة الفعلية" fill="#FF6900" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="الميزانية" fill="#242423" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie - Budget */}
              <div className="bg-white rounded-3xl shadow-md p-7">
                <h3 className="font-black text-brand-dark mb-5">توزيع الميزانية</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => `${Number(v).toLocaleString()} ر.س`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-xs text-brand-gray font-bold">إجمالي الميزانية</p>
                  <p className="text-xl font-black text-brand-dark">{totalBudget.toLocaleString()} ر.س</p>
                </div>
              </div>
            </div>

            {/* Beneficiaries Line Chart */}
            <div className="bg-white rounded-3xl shadow-md p-7">
              <h3 className="font-black text-brand-dark mb-5">نمو المستفيدين ربعياً</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Almarai" }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="المستفيدون" stroke="#FF6900" strokeWidth={3} dot={{ fill: "#FF6900", strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Governance Score */}
            <div className="bg-brand-dark rounded-3xl p-8 text-white">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-brand-gold" /> مؤشر الحوكمة</h3>
              {[
                { label: "كفاءة الإنفاق المالي", val: totalBudget ? Math.min(100, (totalActual / totalBudget) * 100) : 0, good: (v: number) => v <= 100 && v >= 80 },
                { label: "كفاءة استخدام الموارد", val: efficiency, good: (v: number) => v >= 75 },
                { label: "تكلفة المستفيد", val: costPerBene > 0 ? Math.min(100, 100 - (costPerBene / 1000) * 10) : 0, good: (v: number) => v >= 60 },
              ].map(({ label, val, good }) => (
                <div key={label} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm font-bold">{label}</span>
                    <span className={`font-black text-sm ${good(val) ? "text-green-400" : "text-amber-400"}`}>{val.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all duration-700 ${good(val) ? "bg-green-400" : "bg-amber-400"}`} style={{ width: `${Math.min(100, val)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => window.print()} variant="outline" className="w-full border-2 border-brand-dark text-brand-dark py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-dark hover:text-white transition-all">
              <Download className="w-4 h-4" /> تصدير التقرير
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
