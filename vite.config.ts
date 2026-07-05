import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        id: "/admin/login",
        name: "Harmonia Admin",
        short_name: "Harmonia",
        description: "Panel de administración de Harmonia Aromas",

        lang: "es",
        theme_color: "#66713b",
        background_color: "#fffaf4",

        display: "standalone",
        orientation: "portrait",

        start_url: "/admin/login",
        scope: "/",

        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png"
          }
        ]
      }
    })
  ]
}); 