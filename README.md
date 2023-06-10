# Publication 2023

<img src="/public/images/logos/bits-und-baeume-logo_CCBY-schauschau.cc.svg" alt="Logo Bits &amp; Bäume">

![Lines of code](https://img.shields.io/tokei/lines/github/bitsundbaeume/publication2023?style=flat-square)
![GitHub package.json version](https://img.shields.io/github/package-json/v/bitsundbaeume/publication2023?label=github&logo=github&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/bitsundbaeume/publication2023/release.yml?label=release&logo=semantic-release&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/bitsundbaeume/publication2023/unit-test.yml?label=unit-tests&logo=vitest&style=flat-square)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```txt
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Build search index in dev mode

```bash
npm run build
npm run dev
```

## 📖 How to create new flipbook content

### Delete the old content

```bash
rm -rf public/pdfs/jpg && rm -rf public/pdfs/high-res-jps
```

### Create the new content

1. Visit [PDF24 Tools](https://tools.pdf24.org/de/von-pdf-umwandeln)
2. Upload the PDF
3. Choose "JPG" as the output format
   1. For the preview DPI 72 and image quality 85
   2. For the high-res DPI 144 and image quality 100
4. Download the zip file
5. Convert all the files to .avif via <https://avif.io/>
6. Unzip the files in to both directories `public/pdfs/images` and `public/pdfs/high-res-images`
7. Ready to go!

## 📖 How page content creation works

Within the `src` directory, you'll find a `content` directory. This is where you'll find all "content collections" for your site. A content collection is a directory of Markdown files that are transformed into pages on your site. The file name is used as the page slug.

The `dev` or `build` step parses the contents of each file for existing headings and passes them to the table of contents component. This way the table of contents always remains up-to-date.

At the beginning of each page file there is a `yaml` config block which must be filled in according to the content.

The following parameters are present:

- `title`: The title of the page
- `isDraft`: If the page is a draft, if false the page is not displayed
- `order`: The order of the page in the table of contents
- seo:
  - `title`: The title of the page for SEO
  - `metaTitle`: The meta title of the page for SEO
  - `metaDescription`: The meta description of the page for SEO
  - `image`: The image of the page for SEO
