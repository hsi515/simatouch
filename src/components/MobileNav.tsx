import { Link } from "@tanstack/react-router";
import { Home, ShoppingBag, Package, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function MobileNav() {
  const { count } = useCart();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-border/60">
      <div className="grid grid-cols-4 h-16">
        <Link to="/" className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
          <Home className="w-5 h-5" /> الرئيسية
        </Link>
        <Link to="/products" className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground" activeProps={{ className: "text-primary" }}>
          <Package className="w-5 h-5" /> المنتجات
        </Link>
        <Link to="/cart" className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground relative" activeProps={{ className: "text-primary" }}>
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          السلة
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground" activeProps={{ className: "text-primary" }}>
          <User className="w-5 h-5" /> حسابي
        </Link>
      </div>
    </nav>
  );
}
