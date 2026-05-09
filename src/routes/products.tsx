import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { Search } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: `Products — Sima Touch` },
      { name: "description", content: "تصفّح كامل تشكيلة الورود والهدايا والمرايا في متجر Sima Touch." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useI18n();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const cat = search.category ?? "all";

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [products, cat, q]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black">{t.allProducts}</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} {t.productCount}</p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                navigate({ search: (s: any) => ({ ...s, q: e.target.value || undefined }) });
              }}
              className="pr-10 h-12 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={cat === "all" ? "default" : "outline"}
              onClick={() => navigate({ search: (s: any) => ({ ...s, category: undefined }) })}
              className={cat === "all" ? "gradient-primary border-0" : ""}
              size="sm"
            >
              {t.language === "ar" ? "الكل" : "Tümü"}
            </Button>
            {CATEGORIES.map((c) => (
              <Button
                key={c.value}
                variant={cat === c.value ? "default" : "outline"}
                onClick={() => navigate({ search: (s: any) => ({ ...s, category: c.value }) })}
                className={cat === c.value ? "gradient-primary border-0" : ""}
                size="sm"
              >
                {t.categories[c.value as keyof typeof t.categories]}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">{t.noProducts}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
