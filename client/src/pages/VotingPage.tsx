import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  X, Star, Send, ThumbsUp, MessageSquare, Award,
  ChevronDown, ArrowRight, Heart, Share2, Bookmark,
  MoreHorizontal, Filter
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "wouter";

type Comment = {
  id: number;
  author: string;
  role: string;
  city: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
};

type Initiative = {
  id: number;
  name: string;
  association: string;
  city: string;
  description: string;
  category: string;
  rating: number;
  votes: number;
  likes: number;
  color: string;
  comments: Comment[];
};

const seedComments: Record<number, Comment[]> = {
  1: [
    { id: 1, author: "سارة المطيري", role: "مديرة تطوع", city: "الرياض", content: "مبادرة رائعة جداً، استفادت منها عائلتنا كثيراً في رمضان. نتمنى لهم الاستمرار والتوسع.", time: "منذ يومين", likes: 24, liked: false },
    { id: 2, author: "أحمد القحطاني", role: "متطوع", city: "جدة", content: "شاركت في التوزيع مع الفريق وكان التنظيم احترافياً. يستحقون أكثر من 5 نجوم!", time: "منذ 5 أيام", likes: 18, liked: false },
    { id: 3, author: "نورة الشمري", role: "مستفيدة", city: "الرياض", content: "الله يجزاهم خير، ساعدوا كثيراً من الأسر في حينا.", time: "منذ أسبوع", likes: 31, liked: false },
  ],
  2: [
    { id: 4, author: "خالد العتيبي", role: "مستشار تأهيل", city: "جدة", content: "برامج إعادة التأهيل لديهم من الأفضل على مستوى المملكة. رأيت حالات تحول مذهلة.", time: "منذ 3 أيام", likes: 15, liked: false },
    { id: 5, author: "ريم السهلي", role: "أخصائية اجتماعية", city: "جدة", content: "تعاملت معهم مهنياً، الفريق محترف ومتخصص ويتعاملون بإنسانية عالية.", time: "منذ أسبوع", likes: 22, liked: false },
  ],
  3: [
    { id: 6, author: "عبدالله الحربي", role: "طبيب نفسي", city: "الدمام", content: "عمل هذه الجمعية يسد فراغاً كبيراً في منظومة الصحة النفسية. نحتاج المزيد من هذه المبادرات.", time: "منذ يوم", likes: 28, liked: false },
    { id: 7, author: "فاطمة الزهراني", role: "معالجة نفسية", city: "الاحساء", content: "يقومون بدور محوري في تغيير النظرة المجتمعية للصحة النفسية. تجربة مميزة.", time: "منذ 4 أيام", likes: 19, liked: false },
  ],
  4: [
    { id: 8, author: "محمد العسيري", role: "مرشد مهني", city: "مكة", content: "استفاد من البرنامج أكثر من 200 شاب في منطقتنا، ونسبة التوظيف وصلت 70%.", time: "منذ يومين", likes: 35, liked: false },
    { id: 9, author: "هناء الغامدي", role: "خريجة البرنامج", city: "الطائف", content: "انضممت للبرنامج قبل سنة وحصلت على وظيفة في شركة كبرى. أنصح كل شاب بالتسجيل.", time: "منذ 3 أيام", likes: 42, liked: false },
    { id: 10, author: "سعيد البلوي", role: "صاحب عمل", city: "جدة", content: "وظفت 12 خريجاً من برنامج بداية وكانوا من أفضل الموظفين لديّ.", time: "منذ أسبوع", likes: 27, liked: false },
  ],
  5: [
    { id: 11, author: "أم سعد", role: "مستفيدة", city: "المدينة", content: "ساعدوني في تطوير منتجاتي المنزلية وبيعها عبر الإنترنت. دخلي تضاعف.", time: "منذ يوم", likes: 38, liked: false },
    { id: 12, author: "إبراهيم الحازمي", role: "مدرب ريادة أعمال", city: "ينبع", content: "منهج التدريب متكامل ويغطي جميع جوانب بناء المشروع. عمل احترافي.", time: "منذ 6 أيام", likes: 16, liked: false },
  ],
  6: [
    { id: 13, author: "أبو يوسف", role: "كافل يتيم", city: "الرياض", content: "كفلت طفلاً من 3 سنوات ونصف والجمعية تتابع باستمرار. خدمة إنسانية راقية.", time: "منذ يوم", likes: 56, liked: false },
    { id: 14, author: "منى العنزي", role: "متطوعة", city: "الرياض", content: "رأيت الأطفال وهم يكبرون في بيئة محبة وآمنة. أجمل تجارب التطوع.", time: "منذ 3 أيام", likes: 47, liked: false },
    { id: 15, author: "عمر الدوسري", role: "معلم", city: "الرياض", content: "أحد الأيتام كان من طلابي وشاهدت كيف غيّرت الجمعية مسار حياته للأفضل.", time: "منذ أسبوع", likes: 33, liked: false },
  ],
  7: [
    { id: 16, author: "ليلى الحمدان", role: "ربة منزل", city: "الرياض", content: "الجمعية تساعد بصمت وبدون تعقيد. تقدمنا بطلب وتم بسرعة ودون إهانة.", time: "منذ 4 أيام", likes: 29, liked: false },
  ],
  8: [
    { id: 17, author: "طارق المالكي", role: "ذوي إعاقة", city: "جدة", content: "أخيراً خدمة نقل موثوقة لذوي الإعاقة. أستطيع الذهاب للعمل بدون قلق.", time: "منذ يومين", likes: 44, liked: false },
  ],
  9: [
    { id: 18, author: "د. منال السلمي", role: "طبيبة", city: "الطائف", content: "برامج علاج الإدمان لديهم علمية ومبنية على أحدث البروتوكولات الطبية.", time: "منذ 5 أيام", likes: 21, liked: false },
  ],
};

const initialInitiatives: Initiative[] = [
  { id: 1, name: "مبادرة إطعام", association: "جمعية إطعام للأمن الغذائي", city: "الرياض", description: "توفير وجبات غذائية للأسر المحتاجة وتقليل الهدر الغذائي في المملكة العربية السعودية", category: "الأمن الغذائي", rating: 4.7, votes: 312, likes: 184, color: "bg-orange-500", comments: seedComments[1] },
  { id: 2, name: "مبادرة قادر", association: "جمعية قادر للإعاقة", city: "جدة", description: "تمكين ذوي الإعاقة من خلال برامج التدريب المهني وتهيئة بيئة عمل شاملة", category: "التمكين", rating: 4.5, votes: 198, likes: 112, color: "bg-blue-500", comments: seedComments[2] },
  { id: 3, name: "مبادرة أملي", association: "جمعية أملي الاجتماعية", city: "الدمام", description: "دعم المرضى النفسيين وتقديم خدمات إعادة التأهيل والدمج المجتمعي", category: "الصحة النفسية", rating: 4.3, votes: 156, likes: 97, color: "bg-purple-500", comments: seedComments[3] },
  { id: 4, name: "برنامج بداية", association: "جمعية بداية للتنمية", city: "مكة المكرمة", description: "تأهيل الشباب لسوق العمل من خلال التدريب والإرشاد المهني", category: "التوظيف", rating: 4.6, votes: 241, likes: 158, color: "bg-green-500", comments: seedComments[4] },
  { id: 5, name: "مبادرة نماء", association: "جمعية نماء التنموية", city: "المدينة المنورة", description: "دعم المشاريع الصغيرة والمتوسطة للأسر المنتجة وتعزيز الاستدامة الاقتصادية", category: "التنمية الاقتصادية", rating: 4.4, votes: 175, likes: 103, color: "bg-amber-500", comments: seedComments[5] },
  { id: 6, name: "مبادرة رعاية", association: "جمعية رعاية الأيتام", city: "الرياض", description: "كفالة الأيتام وتوفير الرعاية الكاملة والتعليم والبيئة الأسرية الآمنة", category: "رعاية الأسرة", rating: 4.8, votes: 389, likes: 271, color: "bg-rose-500", comments: seedComments[6] },
  { id: 7, name: "مبادرة سند", association: "جمعية سند للدعم الأسري", city: "الرياض", description: "دعم الأسر المتعففة من خلال تقديم المساعدات العينية والمالية ورفع مستوى معيشتها", category: "دعم الأسرة", rating: 4.5, votes: 203, likes: 121, color: "bg-teal-500", comments: seedComments[7] },
  { id: 8, name: "مبادرة وصول", association: "جمعية وصول لخدمة ذوي الإعاقة", city: "جدة", description: "توفير وسائل التنقل والمرافقة للأشخاص ذوي الإعاقة لتعزيز استقلاليتهم", category: "الإعاقة", rating: 4.6, votes: 167, likes: 94, color: "bg-cyan-500", comments: seedComments[8] },
  { id: 9, name: "برنامج الأمل", association: "جمعية الأمل لمكافحة الإدمان", city: "الطائف", description: "برامج علاج وإعادة تأهيل لمتعاطي المخدرات ودعم أسرهم", category: "الصحة", rating: 4.2, votes: 134, likes: 78, color: "bg-indigo-500", comments: seedComments[9] },
];

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`transition-all ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}>
          <Star className={`w-5 h-5 transition-colors ${star <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
        </button>
      ))}
    </div>
  );
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2);
  const colors = ["bg-orange-400", "bg-blue-400", "bg-purple-400", "bg-green-400", "bg-rose-400", "bg-amber-400", "bg-teal-400"];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return <div className={`${color} ${sz} rounded-full flex items-center justify-center text-white font-black shrink-0`}>{initials}</div>;
}

export default function VotingPage() {
  const heroRef = useScrollAnimation();
  const listRef = useScrollAnimation();

  const [initiatives, setInitiatives] = useState<Initiative[]>(initialInitiatives);
  const [ratingModal, setRatingModal] = useState<Initiative | null>(null);
  const [recModal, setRecModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [recForm, setRecForm] = useState({ name: "", association: "", city: "", description: "", category: "" });
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [recSubmitted, setRecSubmitted] = useState(false);
  const [ratedIds, setRatedIds] = useState<Set<number>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newComments, setNewComments] = useState<Record<number, { author: string; content: string }>>({});
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortBy, setSortBy] = useState<"votes" | "rating" | "likes" | "comments">("votes");
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = ["الكل", ...Array.from(new Set(initiatives.map(i => i.category)))];

  const filtered = initiatives
    .filter(i => selectedCategory === "الكل" || i.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "comments") return b.comments.length - a.comments.length;
      return 0;
    });

  const handleLikeInitiative = (id: number) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setInitiatives(ini => ini.map(i => i.id === id ? { ...i, likes: i.likes - 1 } : i)); }
      else { next.add(id); setInitiatives(ini => ini.map(i => i.id === id ? { ...i, likes: i.likes + 1 } : i)); }
      return next;
    });
  };

  const handleLikeComment = (initiativeId: number, commentId: number) => {
    setInitiatives(prev => prev.map(ini => {
      if (ini.id !== initiativeId) return ini;
      return {
        ...ini,
        comments: ini.comments.map(c => c.id === commentId
          ? { ...c, likes: c.liked ? c.likes - 1 : c.likes + 1, liked: !c.liked }
          : c
        )
      };
    }));
  };

  const handleAddComment = (initiativeId: number, e: React.FormEvent) => {
    e.preventDefault();
    const form = newComments[initiativeId];
    if (!form?.author?.trim() || !form?.content?.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: form.author,
      role: "زائر",
      city: "",
      content: form.content,
      time: "الآن",
      likes: 0,
      liked: false,
    };
    setInitiatives(prev => prev.map(i => i.id === initiativeId
      ? { ...i, comments: [...i.comments, newComment] }
      : i
    ));
    setNewComments(prev => ({ ...prev, [initiativeId]: { author: prev[initiativeId]?.author || "", content: "" } }));
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModal || userRating === 0) return;
    setRatedIds(prev => new Set([...prev, ratingModal.id]));
    setInitiatives(prev => prev.map(i => i.id === ratingModal.id
      ? { ...i, votes: i.votes + 1 }
      : i
    ));
    setRatingSubmitted(true);
    setTimeout(() => { setRatingModal(null); setRatingSubmitted(false); setUserRating(0); setRatingComment(""); }, 2000);
  };

  const handleRecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecSubmitted(true);
    setTimeout(() => { setRecModal(false); setRecSubmitted(false); setRecForm({ name: "", association: "", city: "", description: "", category: "" }); }, 2000);
  };

  const totalVotes = initiatives.reduce((s, i) => s + i.votes, 0);
  const totalComments = initiatives.reduce((s, i) => s + i.comments.length, 0);

  return (
    <div className="w-full min-h-screen flex flex-col font-almarai bg-white" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef.ref} className={`pt-28 sm:pt-36 lg:pt-40 pb-10 sm:pb-16 bg-brand-dark text-white relative overflow-hidden transition-all duration-1000 ${heroRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[120px] -ml-64 -mt-64 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link href="/ecstt" className="inline-flex items-center gap-2 text-white/40 hover:text-brand-gold mb-6 sm:mb-10 transition-colors text-xs sm:text-sm font-bold">
            <ArrowRight className="w-4 h-4" /> العودة إلى المنظومة المجتمعية
          </Link>
          <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-10 lg:gap-12">
            <div className="lg:w-1/2">
              <span className="bg-brand-gold/20 text-brand-gold px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">مجتمع مفتوح</span>
              <h1 className="text-[clamp(1.8rem,3.2vw,3.75rem)] font-black mb-4 sm:mb-6 leading-tight">نظام التصويت على المبادرات</h1>
              <p className="text-white/60 text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed mb-6 sm:mb-8">قيّم، علّق، وشارك — منصة مجتمعية مفتوحة لكل جمعية وكل مهتم بالقطاع غير الربحي</p>
              <Button onClick={() => setRecModal(true)} className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-brand-gold/30 text-sm sm:text-base w-full sm:w-auto justify-center">
                <MessageSquare className="w-5 h-5" /> اقترح مبادرة
              </Button>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-3 sm:gap-4 justify-items-center w-full max-w-[520px] mx-auto lg:max-w-none auto-rows-fr">
              {[
                { n: initiatives.length, label: "مبادرة منشورة", icon: "🏆" },
                { n: totalVotes.toLocaleString(), label: "تصويت مسجّل", icon: "⭐" },
                { n: totalComments, label: "تعليق عام", icon: "💬" },
                { n: categories.length - 1, label: "مجال خدمي", icon: "🎯" },
              ].map(({ n, label, icon }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-5 text-center w-full h-full flex flex-col items-center justify-center min-h-[110px] sm:min-h-[130px]">
                  <div className="text-xl sm:text-3xl mb-1.5 sm:mb-2">{icon}</div>
                  <div className="text-xl sm:text-3xl font-black text-brand-gold">{n}</div>
                  <div className="text-white/40 text-[10px] sm:text-xs mt-1 font-bold">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section ref={listRef.ref} className={`py-12 sm:py-16 bg-[#F5F5F7] min-h-screen transition-all duration-1000 ${listRef.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="container mx-auto px-4 sm:px-6">

          {/* Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between  top-2 sm:top-4 z-20">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => { setSelectedCategory(cat); setVisibleCount(6); }}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${selectedCategory === cat ? "bg-brand-gold text-white shadow" : "bg-gray-100 text-brand-dark hover:bg-brand-light-gold"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-brand-gray" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="bg-gray-100 text-brand-dark text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold">
                <option value="votes">الأكثر تصويتاً</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="likes">الأكثر إعجاباً</option>
                <option value="comments">الأكثر تعليقاً</option>
              </select>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-6">
            {filtered.slice(0, visibleCount).map(initiative => (
              <div key={initiative.id} className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">

                {/* Card Header */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0">
                  <div className={`${initiative.color} w-full h-2 sm:w-2 sm:h-auto sm:self-stretch shrink-0 rounded-t-[1.5rem] sm:rounded-none`} />
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className={`${initiative.color} w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shrink-0 flex items-center justify-center`}>
                        <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="bg-gray-100 text-brand-gray px-3 py-0.5 rounded-full text-xs font-bold">{initiative.category}</span>
                            <h3 className="text-[clamp(1rem,1.5vw,1.25rem)] font-black text-brand-dark mt-1">{initiative.name}</h3>
                            <p className="text-brand-gold text-xs sm:text-sm font-bold">{initiative.association} · {initiative.city}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl shrink-0">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-black text-amber-600 text-sm">{initiative.rating}</span>
                          </div>
                        </div>
                        <p className="text-brand-gray text-sm mt-2 leading-relaxed">{initiative.description}</p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-5 pt-4 border-t border-gray-50 flex-wrap">
                      <button
                        onClick={() => handleLikeInitiative(initiative.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all w-full sm:w-auto ${likedIds.has(initiative.id) ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-brand-gray hover:bg-rose-50 hover:text-rose-500"}`}>
                        <Heart className={`w-4 h-4 ${likedIds.has(initiative.id) ? "fill-rose-500" : ""}`} />
                        {initiative.likes.toLocaleString()}
                      </button>

                      <button
                        onClick={() => setExpandedId(expandedId === initiative.id ? null : initiative.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 text-brand-gray hover:bg-blue-50 hover:text-blue-600 font-bold text-sm transition-all w-full sm:w-auto">
                        <MessageSquare className="w-4 h-4" />
                        {initiative.comments.length} تعليق
                      </button>

                      <button
                        onClick={() => { if (!ratedIds.has(initiative.id)) setRatingModal(initiative); }}
                        disabled={ratedIds.has(initiative.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all w-full sm:w-auto ${ratedIds.has(initiative.id) ? "bg-green-100 text-green-600 cursor-default" : "bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-white"}`}>
                        <Star className="w-4 h-4" />
                        {ratedIds.has(initiative.id) ? "صوّتت" : `${initiative.votes.toLocaleString()} تصويت`}
                      </button>

                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-brand-gray hover:bg-gray-200 font-bold text-sm transition-all w-full sm:w-auto sm:mr-auto">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Thread */}
                {expandedId === initiative.id && (
                  <div className="border-t border-gray-100 bg-[#FAFAFA] px-4 sm:px-6 py-4 sm:py-5">
                    <h4 className="font-black text-brand-dark text-sm mb-4">التعليقات ({initiative.comments.length})</h4>

                    <div className="space-y-4 mb-6">
                      {initiative.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 items-start">
                          <Avatar name={comment.author} size="sm" />
                          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <span className="font-black text-brand-dark text-sm">{comment.author}</span>
                                {comment.role && <span className="text-brand-gray text-xs mr-2">· {comment.role}{comment.city ? ` · ${comment.city}` : ""}</span>}
                              </div>
                              <span className="text-brand-gray text-xs">{comment.time}</span>
                            </div>
                            <p className="text-brand-dark text-sm leading-relaxed mb-3">{comment.content}</p>
                            <button
                              onClick={() => handleLikeComment(initiative.id, comment.id)}
                              className={`flex items-center gap-1 text-xs font-bold transition-colors ${comment.liked ? "text-rose-500" : "text-brand-gray hover:text-rose-400"}`}>
                              <Heart className={`w-3.5 h-3.5 ${comment.liked ? "fill-rose-500" : ""}`} />
                              {comment.likes}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <form onSubmit={(e) => handleAddComment(initiative.id, e)} className="flex flex-col sm:flex-row gap-3 items-start">
                      <Avatar name={newComments[initiative.id]?.author || "أنت"} size="sm" />
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="اسمك"
                          value={newComments[initiative.id]?.author || ""}
                          onChange={e => setNewComments(prev => ({ ...prev, [initiative.id]: { ...prev[initiative.id], author: e.target.value, content: prev[initiative.id]?.content || "" } }))}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-gold text-brand-dark"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="اكتب تعليقك..."
                            value={newComments[initiative.id]?.content || ""}
                            onChange={e => setNewComments(prev => ({ ...prev, [initiative.id]: { ...prev[initiative.id], content: e.target.value, author: prev[initiative.id]?.author || "" } }))}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-gold text-brand-dark"
                          />
                          <button type="submit" className="bg-brand-gold text-white px-4 py-2.5 rounded-xl hover:bg-brand-gold-dark transition-colors w-full sm:w-auto shrink-0">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="text-center mt-8">
              <Button onClick={() => setVisibleCount(filtered.length)} variant="outline"
                className="border-2 border-brand-dark text-brand-dark px-10 py-5 rounded-2xl font-black hover:bg-brand-dark hover:text-white transition-all flex items-center gap-2 mx-auto">
                عرض المزيد <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className={`${ratingModal.color} p-5 sm:p-7 text-white relative`}>
              <button onClick={() => { setRatingModal(null); setUserRating(0); setRatingComment(""); setRatingSubmitted(false); }} className="absolute left-5 top-5 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
              <p className="text-white/70 text-xs font-bold mb-1">{ratingModal.association}</p>
              <h3 className="text-2xl font-black">{ratingModal.name}</h3>
            </div>
            {ratingSubmitted ? (
              <div className="p-6 sm:p-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-black text-brand-dark mb-2">شكراً على تصويتك!</h4>
                <p className="text-brand-gray text-sm">رأيك يصنع فرقاً حقيقياً</p>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="p-5 sm:p-7 space-y-5">
                <div>
                  <label className="block font-black text-brand-dark mb-3">تقييمك</label>
                  <div className="flex justify-center my-3 scale-125">
                    <StarRating value={userRating} onChange={setUserRating} />
                  </div>
                  <p className="text-center text-sm text-brand-gray mt-3 h-4">
                    {["", "ضعيف", "مقبول", "جيد", "جيد جداً", "ممتاز"][userRating]}
                  </p>
                </div>
                <div>
                  <label className="block font-black text-brand-dark mb-2">تعليق (اختياري)</label>
                  <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} placeholder="شاركنا رأيك..." rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none resize-none text-sm text-brand-dark" />
                </div>
                <Button type="submit" disabled={userRating === 0} className="w-full bg-brand-gold text-white py-4 rounded-xl font-black disabled:opacity-40 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> إرسال التصويت
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Recommend Modal */}
      {recModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-white w-full max-w-lg rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-brand-dark p-5 sm:p-7 text-white relative sticky top-0 z-10">
              <button onClick={() => { setRecModal(false); setRecSubmitted(false); }} className="absolute left-5 top-5 bg-white/10 hover:bg-white/20 p-2 rounded-full">
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-2xl font-black">اقترح مبادرة</h3>
              <p className="text-white/50 text-sm mt-1">شارك مبادرة فعّالة لتضمينها في المنصة</p>
            </div>
            {recSubmitted ? (
              <div className="p-6 sm:p-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-black text-brand-dark mb-2">تم استلام مقترحك!</h4>
                <p className="text-brand-gray text-sm">سنراجعه وننشره قريباً</p>
              </div>
            ) : (
              <form onSubmit={handleRecSubmit} className="p-5 sm:p-7 space-y-4">
                {[
                  { label: "اسم المبادرة", key: "name", placeholder: "مثال: مبادرة إطعام" },
                  { label: "اسم الجمعية", key: "association", placeholder: "الاسم الرسمي للجمعية" },
                  { label: "المدينة", key: "city", placeholder: "مثال: الرياض" },
                  { label: "مجال المبادرة", key: "category", placeholder: "مثال: التعليم، الصحة..." },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block font-black text-brand-dark mb-2 text-sm">{label}</label>
                    <input type="text" required placeholder={placeholder} value={(recForm as any)[key]}
                      onChange={e => setRecForm(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none text-sm text-brand-dark" />
                  </div>
                ))}
                <div>
                  <label className="block font-black text-brand-dark mb-2 text-sm">وصف المبادرة</label>
                  <textarea required rows={3} placeholder="ماذا تقدم هذه المبادرة للمجتمع؟" value={recForm.description}
                    onChange={e => setRecForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-brand-gold focus:outline-none resize-none text-sm text-brand-dark" />
                </div>
                <Button type="submit" className="w-full bg-brand-gold text-white py-4 rounded-xl font-black flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> إرسال المقترح
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
