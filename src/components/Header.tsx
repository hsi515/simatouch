import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/contexts/I18nContext";
import { ShoppingBag, User, LogOut, LayoutDashboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORE_NAME } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const { t } = useI18n();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
            <span className="text-primary-foreground font-display font-black text-lg">S</span>
          </div>
          <span className="font-display font-black text-xl text-gradient">{STORE_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 mr-4">
          <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors" activeProps={{ className: "text-primary bg-secondary" }} activeOptions={{ exact: true }}>
            {t.home}
          </Link>
          <Link to="/products" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors" activeProps={{ className: "text-primary bg-secondary" }}>
            {t.products}
          </Link>
          <Link to="/featured" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors" activeProps={{ className: "text-primary bg-secondary" }}>
            {t.language === "ar" ? "مميّزة" : "Öne Çıkan"}
          </Link>
          <Link to="/premium" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors text-amber-600" activeProps={{ className: "bg-amber-500/10" }}>
            {t.language === "ar" ? "بريميوم" : "Premium"}
          </Link>
          <Link to="/orders" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors" activeProps={{ className: "text-primary bg-secondary" }}>
            {t.orders}
          </Link>
        </nav>

        <div className="flex-1" />

        <LanguageSwitcher />

        <Link to="/products" className="md:hidden p-2 rounded-lg hover:bg-secondary">
          <Search className="w-5 h-5" />
        </Link>

        <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-soft">
              {count}
            </span>
          )}
        </Link>

        {isAdmin && (
          <Link to="/admin" className="hidden sm:flex">
            <Button variant="outline" size="sm" className="gap-2">
              <LayoutDashboard className="w-4 h-4" /> {t.admin}
            </Button>
          </Link>
        )}

        {user ? (
          <div className="hidden sm:flex items-center gap-1">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" /> {t.profile}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); router.navigate({ to: "/" }); }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Link to="/login" className="hidden sm:block">
            <Button variant="default" size="sm" className="gradient-primary border-0">
              {t.login}
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
