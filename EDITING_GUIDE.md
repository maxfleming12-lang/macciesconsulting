# Editing Guide

This site is designed so you can request any change in plain English — no code knowledge needed. Here's everything you need to know.

---

## The short version

Open a Claude Code session in this project folder and just describe what you want:

> "Change my subtitle to: Peer Support Worker & occasional chaos manager"

> "Add a new link — TikTok, icon 🎵, url https://tiktok.com/@me"

> "Remove the Facebook link"

> "Add this mood: Professionally caffeinated and vaguely dangerous."

Claude will edit `content/home.json` (or `scripts/update-content.js` for structural changes) and you're done.

---

## Where content lives

| What | File |
|------|------|
| Your name, subtitle, tagline, bio | `content/home.json` → `name`, `subtitle`, `tagline`, `proBio` |
| Link buttons (Call me, Email me, Instagram, etc.) | `content/home.json` → `links` array |
| Random mood strings | `content/home.json` → `moods` array |
| Gracie modal text | `content/home.json` → `gracieModal.lines` |
| Section headings | `content/home.json` → `sections.links.title` / `sections.extras.title` |
| Footer text | `content/home.json` → `footer` |
| Contact details (phone, email) | `content/home.json` → `contact` |
| Your photo | `assets/images/avatar.jpg` — replace this file (keep same filename) |
| Stylesheet / colours / fonts | `assets/css/main.css` |

---

## Previewing changes locally

1. Make sure you've run `npm install` once.
2. Run `npm run dev` — opens at **http://localhost:5678**.
3. Edit `content/home.json` — the page reloads automatically.
4. When happy, commit and push. The live site updates in ~1 minute.

---

## Replacing your photo

1. Rename your new photo to `avatar.jpg`.
2. Drop it into `assets/images/`, overwriting the existing file.
3. Commit and push — done.

---

## Adding a new link

Each link in `content/home.json` → `links` looks like this:

```json
{
  "icon": "📸",
  "label": "Instagram",
  "description": "Bits of life, chaos, and vibes",
  "href": "https://www.instagram.com/cootaboi/",
  "arrow": "↗",
  "external": true
}
```

- Set `"external": false` for phone/email links so they don't open a new tab.
- Use `"→"` as the arrow for internal links, `"↗"` for external.

---

## Updating the dashboard

The private dashboard (`dashboard/login.html` and `dashboard/index.html`) is separate from the main site and not processed by 11ty. To change anything in the dashboard, open those files directly or ask Claude to edit them.

---

## Committing and deploying

```bash
git add content/home.json          # or whichever files changed
git commit -m "Update site copy"
git push
```

GitHub Actions picks this up, runs `npm run build`, and deploys to Cloudflare Pages. The live site is usually updated within 60 seconds.

---

## Things you can ask Claude to do

- "Change my tagline to …"
- "Add a LinkedIn link"
- "Remove the Facebook link"
- "Update my bio to …"
- "Add these three moods: …"
- "Change the section heading 'Pick your adventure' to …"
- "Update my phone number to …"
- "Make the footer say …"
- "Replace my photo" (then drop the file in assets/images/)
- "Add a link to my new TikTok: …"
