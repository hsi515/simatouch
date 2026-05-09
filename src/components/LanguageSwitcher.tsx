import { useI18n, Language } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "tr" : "ar");
  };

  return ( 
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Globe className="w-4 h-4" />
      {language === "ar" ? "العربية" : "Türkçe"}
    </Button>
  );
}