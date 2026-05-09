import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, total } = useCart();
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl md:text-4xl font-black mb-8">{t.cart}</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">{t.language === "ar" ? "سلّتك فارغة" : "Sepetiniz boş"}</p>
            <Link to="/products"><Button className="gradient-primary border-0">{t.shopNow}</Button></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-card p-4 rounded-2xl shadow-soft border border-border/50">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-gradient font-black mt-1">{item.price} ₺</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQty(item.id, item.quantity - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQty(item.id, item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => remove(item.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-elegant border border-border/50 h-fit sticky top-24">
              <h2 className="font-bold text-xl mb-4">{t.language === "ar" ? "ملخّص الطلب" : "Sipariş Özeti"}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>{t.language === "ar" ? "المجموع الفرعي" : "Ara Toplam"}</span><span className="font-bold">{total} ₺</span></div>
                <div className="flex justify-between text-muted-foreground"><span>{t.language === "ar" ? "الشحن" : "Kargo"}</span><span>{t.language === "ar" ? "يحدد لاحقًا" : "Sonra belirlenir"}</span></div>
              </div>
              <div className="border-t my-4" />
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold">{t.language === "ar" ? "الإجمالي" : "Toplam"}</span>
                <span className="text-2xl font-black text-gradient">{total} ₺</span>
              </div>
              <Link to="/checkout">
                <Button size="lg" className="w-full gradient-primary border-0">
                  {t.language === "ar" ? "متابعة الدفع" : "Ödemeye Geç"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
