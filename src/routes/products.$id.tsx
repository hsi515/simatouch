import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { PRODUCT_STATUS_LABEL } from "@/lib/constants";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { add } = useCart();
  const { t } = useI18n();
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">{t.language === "ar" ? "جاري التحميل..." : "Yükleniyor..."}</div>;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p>{t.language === "ar" ? "المنتج غير موجود" : "Ürün bulunamadı"}</p>
      <Link to="/products"><Button>{t.language === "ar" ? "العودة للمنتجات" : "Ürünlere Dön"}</Button></Link>
    </div>
  );

  const img = product.images?.[0] ?? "/placeholder.svg";
  const disabled = product.status === "out_of_stock";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> {t.language === "ar" ? "رجوع للمنتجات" : "Ürünlere Dön"}
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square rounded-3xl overflow-hidden bg-secondary shadow-elegant">
            <img src={img} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            {product.status !== "available" && (
              <Badge className="gradient-primary border-0 text-primary-foreground">
                {PRODUCT_STATUS_LABEL[product.status]}
              </Badge>
            )}
            <h1 className="text-3xl md:text-4xl font-black">{product.name}</h1>
            <div className="text-4xl font-black text-gradient">{product.price} ₺</div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 bg-secondary rounded-xl p-1">
                <Button size="icon" variant="ghost" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <Button size="icon" variant="ghost" onClick={() => setQty((q) => q + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="lg"
                disabled={disabled}
                onClick={() => {
                  add({ id: product.id, name: product.name, price: Number(product.price), image: img }, qty);
                  toast.success(t.language === "ar" ? "أُضيف إلى السلة" : "Sepete eklendi");
                }}
                className="gradient-primary border-0 flex-1 gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> {t.language === "ar" ? "أضف إلى السلة" : "Sepete Ekle"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
