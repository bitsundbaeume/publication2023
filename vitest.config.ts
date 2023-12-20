/// <reference types="vitest" />

import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [Vue(), tsconfigPaths()],
  test: {
    include: ["tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@lib/": `${path.resolve(__dirname, "src/lib/")}/`,
      "@components/": `${path.resolve(__dirname, "src/components/")}/`,
      "@images/*": `${path.resolve(__dirname, "src/images/")}/`,
    },
  },
});
