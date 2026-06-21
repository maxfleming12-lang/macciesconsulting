# macciesconsulting.au — Link Hub

Personal link hub for Maxwell Fleming. Built with [11ty](https://www.11ty.dev/) and deployed to Cloudflare Pages via GitHub Actions.

## Quick start

```bash
npm install
npm run dev      # starts dev server at http://localhost:5678
```

Open a browser at **http://localhost:5678** to preview the site.

## Building for production

```bash
npm run build    # outputs to _site/
```

## Deploying

Just push to `main` — GitHub Actions runs `npm run build` and deploys `_site/` to Cloudflare Pages automatically.

## Editing content

All site text lives in **`content/home.json`**. Open that file, change the values, save, and the dev server will hot-reload.

For a full guide (including how to ask Claude to make changes), see [EDITING_GUIDE.md](EDITING_GUIDE.md).

## Project structure

```
content/            ← All editable text (JSON)
  home.json
assets/
  css/main.css      ← Site stylesheet
  js/main.js        ← Site JavaScript
  images/           ← Images (avatar, etc.)
src/
  index.njk         ← Main page template
dashboard/          ← Private dashboard (plain HTML, no build step)
scripts/
  update-content.js ← Helper Claude uses to make content edits
.eleventy.js        ← 11ty configuration
```
