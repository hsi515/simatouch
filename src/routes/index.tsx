import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Truck, Shield, MessageCircle } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sima Touch — متجر الورود والهدايا الفاخرة" },
      { name: "description", content: "ورود طبيعية، هدايا فاخرة، مرايا بلجيكية وستاندات للمناسبات. اطلب عبر واتساب." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();

  const { data: featured } = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .limit(8);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-28 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
              <Sparkles className="w-4 h-4" /> {t.language === "ar" ? "أرقى الورود والهدايا" : "En kaliteli çiçekler ve hediyeler"}
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              {t.heroTitle.split(" ").map((word, i) => (
                word === "استثنائية" || word === "استثنائية." || word === "özel" || word === "özel." ? (
                  <span key={i} className="text-gradient">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              ))}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="gradient-primary border-0 shadow-soft hover:shadow-glow text-base">
                  {t.shopNow}
                </Button>
              </Link>
              <Link to="/products" search={{ category: "flowers" } as any}>
                <Button size="lg" variant="outline" className="text-base">
                  {t.exploreFlowers}
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 gradient-hero rounded-[3rem] opacity-20 blur-3xl" />
            <img src={hero} alt="باقة ورد فاخرة" className="relative rounded-3xl shadow-elegant animate-float" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              to="/products"
              search={{ category: c.value } as any}
              className="group relative aspect-square rounded-2xl gradient-soft border border-border/50 flex items-center justify-center overflow-hidden hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <span className="font-display font-bold text-lg group-hover:text-primary transition-colors">{t.categories[c.value as keyof typeof t.categories]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black">{t.featuredProducts}</h2>
            <p className="text-muted-foreground mt-2">{t.language === "ar" ? "اختيارات فاخرة من تشكيلتنا" : "Koleksiyonumuzdan lüks seçimler"}</p>
          </div>
          <Link to="/products">
            <Button variant="outline">عرض الكل</Button>
          </Link>
        </div>
        {featured?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border/50 bg-card p-12 text-center text-muted-foreground">
            لا توجد منتجات مميزة في الوقت الحالي
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: t.features.fastDelivery, desc: t.language === "ar" ? "نوصل طلبك بأسرع وقت ممكن" : "Siparişinizi en kısa sürede teslim ederiz" },
            { icon: MessageCircle, title: t.features.whatsappOrders, desc: t.language === "ar" ? "تواصل مباشر وسهولة في الطلب" : "Doğrudan iletişim ve kolay sipariş" },
            { icon: Shield, title: t.features.guaranteedQuality, desc: t.language === "ar" ? "نختار لك الأفضل دائمًا" : "Her zaman sizin için en iyisini seçeriz" },
          ].map((f, i) => (
            <div key={i} className="bg-card p-6 rounded-2xl shadow-soft border border-border/50 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-soft">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
}
