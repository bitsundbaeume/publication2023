# Publication 2023

<img src="/public/images/logos/bits-und-baeume-logo_CCBY-schauschau.cc.svg" alt="Logo Bits &amp; Bäume">

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

## 📖 How to create new flipbook content

### Delete the old content

```bash
rm -rf src/pdfs/jpg && rm -rf src/pdfs/high-res-jps
```

### Create the new content

1. Visit [PDF24 Tools](https://tools.pdf24.org/de/von-pdf-umwandeln)
2. Upload the PDF
3. Choose "JPG" as the output format
   1. For the preview DPI 144 and image quality 85
   2. For the high-res DPI 300 and image quality 100
4. Download the zip file
5. Unzip the file in to both directories `src/pdfs/jpg` and `src/pdfs/high-res-jps`
6. Ready to go!
