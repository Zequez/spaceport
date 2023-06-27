import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/static";
import AstroPWA from "@vite-pwa/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    AstroPWA({
      registerType: "autoUpdate",
      devOptions: { enabled: false },
      manifest: {
        name: "SpacePort",
        short_name: "SpacePort",
        theme_color: "#777777",
        icons: [
          {
            src: "assets/sites-thumbnails/spaceport.webp",
            sizes: "192x192",
            type: "image/webp",
          },
        ],
      },
    }),
  ],
  adapter: vercel(),
});
