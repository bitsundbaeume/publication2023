import { defineConfig } from "astro/config";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import serviceWorker from "astrojs-service-worker";
import { astroImageTools } from "astro-imagetools";
import vue from "@astrojs/vue";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import mdx from "@astrojs/mdx";
import tsconfigPaths from "vite-tsconfig-paths";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.DEV
    ? "http://localhost:4321"
    : "https://publication2023.bits-und-baeume.org",
  output: "static",
  integrations: [
    sitemap({
      lastmod: new Date(),
    }),
    prefetch(),
    serviceWorker(),
    astroImageTools,
    vue(),
    mdx({
      rehypePlugins: [
        [
          rehypeSlug,
          {
            prefix: "h-",
          },
        ],
        // We need this to prevent IDs starting with a number
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
          },
        ],
      ],
    }),
  ],
  vite: {
    plugins: [tsconfigPaths()],
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        "@sass-butler/": `${path.resolve(
          __dirname,
          "node_modules/@felix_berlin/sass-butler/",
        )}/`,
        "@styles/": `${path.resolve(__dirname, "src/styles/")}/`,
      },
    },
  },
});
