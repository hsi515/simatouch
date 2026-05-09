import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { ProductCard } from "@/components/ProductCard";
import { Crown } from "lucide-react";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "منتجات بريميوم — Sima Touch" },
      { name: "description", content: "تشكيلة لوكس وبريميوم من ورود وهدايا فاخرة استثنائية." },
      { property: "og:title", content: "Premium / Lüks — Sima Touch" },
      { property: "og:description", content: "Olağanüstü lüks çiçek ve hediye koleksiyonu." },
    ],
  }),
  component: PremiumPage,
});

function PremiumPage() {
  const { language } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["premium-page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_premium", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-secondary/30 to-background">
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Crown className="w-4 h-4 text-amber-500" fill="currentColor" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {language === "ar" ? "تشكيلة لوكس حصرية" : "Özel lüks koleksiyon"}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
              {language === "ar" ? "بريميوم · لوكس" : "Premium · Lüks"}
            </span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            {language === "ar"
              ? "هدايا استثنائية لمناسبات استثنائية. تجربة فاخرة من اللحظة الأولى."
              : "Özel anlar için olağanüstü hediyeler. İlk andan itibaren lüks bir deneyim."}
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
          <div className="rounded-3xl border border-amber-500/30 bg-card p-12 text-center text-muted-foreground">
            {language === "ar" ? "قريبًا — تشكيلتنا اللوكس قيد التحضير ✨" : "Yakında — Lüks koleksiyonumuz hazırlanıyor ✨"}
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
