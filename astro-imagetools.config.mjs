import { defineConfig } from "astro-imagetools/config";

export default defineConfig({
  format: ["avif", "webp"],
  fallbackFormat: "jpg",
});
