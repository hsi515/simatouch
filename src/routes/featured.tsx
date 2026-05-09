import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { ProductCard } from "@/components/ProductCard";
import { Star } from "lucide-react";

export const Route = createFileRoute("/featured")({
  head: () => ({
    meta: [
      { title: "منتجات مميّزة — Sima Touch" },
      { name: "description", content: "تشكيلتنا المميّزة من الورود والهدايا الفاخرة." },
      { property: "og:title", content: "منتجات مميّزة — Sima Touch" },
      { property: "og:description", content: "اكتشف أجمل الورود والهدايا المختارة بعناية." },
    ],
  }),
  component: FeaturedPage,
});

function FeaturedPage() {
  const { language } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["featured-page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary mb-4">
            <Star className="w-4 h-4 text-primary" fill="currentColor" />
            <span className="text-sm font-bold">{language === "ar" ? "اختيارنا الأبرز" : "Öne çıkan seçimimiz"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black">
            {language === "ar" ? "منتجات " : ""}
            <span className="text-gradient">{language === "ar" ? "مميّزة" : "Öne Çıkan Ürünler"}</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            {language === "ar"
              ? "تشكيلة منتقاة بعناية من الورود والهدايا التي يحبّها عملاؤنا أكثر."
              : "Müşterilerimizin en çok sevdiği özenle seçilmiş çiçek ve hediye koleksiyonu."}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : data?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data.map((p) => <ProductCard key={p.id} product={p as any} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-border/50 bg-card p-12 text-center text-muted-foreground">
            {language === "ar" ? "لا توجد منتجات مميّزة حاليًا" : "Şu anda öne çıkan ürün yok"}
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
