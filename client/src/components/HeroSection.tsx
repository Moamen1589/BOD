import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Award, Briefcase, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
const getVideoMimeType = (assetPath: string) => {
  const cleanPath = assetPath.split(/[?#]/)[0].toLowerCase();

  if (cleanPath.endsWith(".webm")) return "video/webm";
  if (cleanPath.endsWith(".ogg") || cleanPath.endsWith(".ogv"))
    return "video/ogg";

  return "video/mp4";
};

const getYouTubeEmbedUrl = (videoUrl: string) => {
  const trimmedUrl = videoUrl.trim();

  try {
    const parsedUrl = new URL(trimmedUrl);
    let videoId = "";

    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (parsedUrl.hostname.includes("youtube.com")) {
      videoId = parsedUrl.searchParams.get("v") ?? "";
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`;
  } catch {
    return null;
  }
};

const stats = [
  {
    icon: Users,
    value: "+645",
    label: "جمعية ومنظمة",
    color: "bg-brand-gold/20 text-brand-gold-dark",
  },
  {
    icon: Award,
    value: "+13",
    label: "سنة خبرة",
    color: "bg-brand-gold/20 text-brand-gold-dark",
  },
  {
    icon: Briefcase,
    value: "+500",
    label: "مشروع منجز",
    color: "bg-brand-gold/20 text-brand-gold-dark",
  },
];

const fallbackHeroBackgrounds = [
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
];

const HERO_API_BASE = "https://gold-weasel-489740.hostingersite.com";
const HERO_API_ENDPOINT = `${HERO_API_BASE}/api/homepage/hero`;

type HeroApiData = {
  title?: string | null;
  description?: string | null;
  background_image?: Array<string | null> | null;
  background_video_url?: string | null;
  bckground_video_url?: string | null;
  text?: string | null;
  subtext?: string | null;
};

type HeroApiResponse = {
  success?: boolean;
  data?: HeroApiData | null;
};

const resolveHeroAssetUrl = (assetPath?: string | null) => {
  if (!assetPath) return null;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;

  if (assetPath.startsWith("/storage/")) {
    return `${HERO_API_BASE}${assetPath}`;
  }

  const normalizedPath = assetPath.replace(/^\/+/, "");
  if (normalizedPath.startsWith("storage/")) {
    return `${HERO_API_BASE}/${normalizedPath}`;
  }

  return `${HERO_API_BASE}/storage/${normalizedPath}`;
};

export function HeroSection() {
  const [heroData, setHeroData] = useState<HeroApiData | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadHeroData = async () => {
      try {
        const response = await fetch(HERO_API_ENDPOINT);
        if (!response.ok) return;

        const payload = (await response.json()) as HeroApiResponse;
        if (isMounted) {
          setHeroData(payload?.data ?? null);
          setVideoFailed(false);
        }
      } catch {
        if (isMounted) {
          setHeroData(null);
          setVideoFailed(false);
        }
      } finally {
        if (isMounted) {
          setHeroLoaded(true);
        }
      }
    };

    loadHeroData();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroBackgrounds = useMemo(() => {
    const apiBackgrounds = (heroData?.background_image ?? [])
      .map((imagePath) => resolveHeroAssetUrl(imagePath))
      .filter((imagePath): imagePath is string => Boolean(imagePath));

    return apiBackgrounds.length > 0 ? apiBackgrounds : fallbackHeroBackgrounds;
  }, [heroData]);

  const backgroundVideoValue =
    heroData?.background_video_url?.trim() ||
    heroData?.bckground_video_url?.trim() ||
    null;
  const backgroundVideoUrl =
    backgroundVideoValue && !backgroundVideoValue.includes("youtu")
      ? resolveHeroAssetUrl(backgroundVideoValue)
      : backgroundVideoValue;
  const backgroundVideoEmbedUrl = backgroundVideoValue
    ? getYouTubeEmbedUrl(backgroundVideoValue)
    : null;
  const shouldShowVideo = Boolean(backgroundVideoValue) && !videoFailed;
  const shouldShowBackgroundImages = heroLoaded && !shouldShowVideo;
  const shouldAnimateBackgrounds =
    shouldShowBackgroundImages && heroBackgrounds.length > 1;
  const heroTitle = heroData?.title?.trim() || "";
  const heroSubtitle =
    heroData?.subtext?.trim() ||
    heroData?.description?.trim() ||
    "نوفر الأدوات الداعمة لتحقيق الأهداف لنكون الحاضن الأول للقطاع غير الربحي في المملكة العربية السعودية";

  useEffect(() => {
    setVideoReady(false);
  }, [backgroundVideoValue, backgroundVideoEmbedUrl]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-20 md:pt-24"
    >
      <div className="absolute inset-0">
        {shouldShowVideo ? (
          backgroundVideoEmbedUrl ? (
            <div className="absolute inset-0 overflow-hidden bg-brand-dark">
              <iframe
                key={backgroundVideoEmbedUrl}
                className={`absolute border-0 transition-opacity duration-500 pointer-events-none ${
                  videoReady ? "opacity-100" : "opacity-0"
                }`}
                src={backgroundVideoEmbedUrl}
                title="Hero background video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen={false}
                style={{
                  top: "50%",
                  left: "50%",
                  width: "100vw",
                  height: "56.25vw",
                  minWidth: "177.78vh",
                  minHeight: "100vh",
                  transform: "translate(-50%, -50%)",
                }}
                onLoad={() => setVideoReady(true)}
              />
            </div>
          ) : (
            <video
              key={backgroundVideoUrl}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
            >
              <source
                src={backgroundVideoUrl ?? undefined}
                type={
                  backgroundVideoUrl
                    ? getVideoMimeType(backgroundVideoUrl)
                    : undefined
                }
              />
            </video>
          )
        ) : !heroLoaded ? (
          <div className="absolute inset-0 bg-brand-dark" />
        ) : shouldAnimateBackgrounds ? (
          heroBackgrounds.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="absolute inset-0 bg-cover bg-center opacity-0 animate-hero-cycle"
              style={{
                backgroundImage: `url(${image})`,
                animationDelay: `${index * 6}s`,
                animationDuration: `${Math.max(heroBackgrounds.length, 1) * 6}s`,
              }}
            />
          ))
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBackgrounds[0]})` }}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-brand-dark/70" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white px-5 py-2.5 rounded-md text-sm font-almarai font-bold mb-8 animate-fade-up backdrop-blur-sm border border-white/20">
            <Star size={16} className="text-brand-gold" />
            الحاضن الأول للقطاع غير الربحي
          </div>

          <h1
            className="font-almarai font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
            data-testid="text-hero-title"
          >
            {heroTitle || (
              <>
                نبتكر حلولًا وخدمات فريدة
                <br />
                <span className="text-brand-gold">
                  تتناسب مع احتياجات شركائنا
                </span>
              </>
            )}
          </h1>

          <p
            className="font-almarai text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
            data-testid="text-hero-subtitle"
          >
            {heroSubtitle}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-brand-gold text-white font-almarai rounded-lg px-8 text-base gap-2 font-bold hover:bg-brand-gold-dark"
            >
              <a href="#contact" data-testid="button-hero-cta">
                تواصل معنا
                <ArrowLeft size={18} />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-md px-8 text-base font-almarai border-white/40 text-white bg-white/5 hover:bg-white/10 hover:text-white"
            >
              <a href="#about" data-testid="button-hero-about">
                تعرف علينا
              </a>
            </Button>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center"
                data-testid={`stat-${s.label}`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 ${s.color} rounded-md mx-auto mb-2`}
                >
                  <s.icon size={22} />
                </div>
                <p className="font-almarai font-extrabold text-2xl text-white">
                  {s.value}
                </p>
                <p className="font-almarai text-xs text-white/80 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
