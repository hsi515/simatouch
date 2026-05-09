import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      // Virgülleri tırnak dışına aldık ve her domaini ayrı tırnağa koyduk
      allowedHosts: [
        "simatouch-production.up.railway.app", 
        "simatouch.com", 
        "www.simatouch.com"
      ]
    },
    preview: {
      // Canlı ortamda asıl burası çalışıyor
      allowedHosts: [
        "simatouch-production.up.railway.app", 
        "simatouch.com", 
        "www.simatouch.com"
      ]
    }
  }
});