import { Link } from "@tanstack/react-router";
import { useI18n } from "@/contexts/I18nContext";
import { Phone, MapPin, Send } from "lucide-react";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-card border-t border-border mt-20 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-black text-lg">S</span>
            </div>
            <span className="font-display font-black text-xl text-gradient">{STORE_NAME}</span>
          </div>
          <p className="text-sm text-muted-foreground">{STORE_TAGLINE}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t.language === "ar"
              ? "نختار لك أرقى الورود والهدايا لتعبّر عن مشاعرك بأبهى صورة."
              : "Duygularınızı en güzel şekilde ifade etmek için size en kaliteli çiçekleri ve hediyeleri seçiyoruz."
            }
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3">{t.links}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">{t.home}</Link></li>
            <li><Link to="/products" className="hover:text-primary">{t.products}</Link></li>
            <li><Link to="/orders" className="hover:text-primary">{t.orders}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">{t.contact}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> 0501 631 6010</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t.language === "ar" ? "أضنة · تركيا" : "Adana · Türkiye"}</li>
            <li className="flex items-center gap-2"><Send className="w-4 h-4" /> <a href="https://t.me/tochflove" target="_blank" rel="noreferrer noopener" className="hover:text-primary">t.me/tochflove</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {STORE_NAME}. {t.allRightsReserved}.
      </div>
    </footer>
  );
}
