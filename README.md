# Vertex Import & Export — website

A single-page marketing site for Vertex, built as static HTML, CSS and vanilla JS.

```
index.html          English page — markup + SEO metadata + JSON-LD
am/index.html       Amharic page (አማርኛ) — same structure, translated
styles.css          design tokens, themes, layout, components, responsive
script.js           theme toggle, nav, smooth scrolling, reveals, form
robots.txt          crawler directives
sitemap.xml         both language URLs with hreflang alternates
assets/             logo set, favicon, social card
assets/img/         photography (WebP + JPEG pairs)
assets/CREDITS.md   image sources, licences, logo spec
```

Both pages share one `styles.css` and one `script.js`.

No build step, no dependencies. Open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Why static instead of Next.js

The page has no dynamic data, no per-request rendering and no routes. Static HTML
is already fully crawlable and indexable — the SEO advantage Next.js offers over a
client-rendered SPA does not apply here. This way there is no build pipeline, no
hydration JavaScript, and the site deploys to any host (GitHub Pages, Netlify,
Cloudflare Pages, Vercel, plain nginx) by uploading the folder.

## Replace before going live

Search and replace these placeholders:

Apply every change to **both** `index.html` and `am/index.html`.

| Placeholder | Where |
|---|---|
| ~~`https://www.vertex-trade.com`~~ | **Done** — now `https://vertex.pro.et` in both pages, `robots.txt`, `sitemap.xml` |
| `info@vertex-trade.com` | both pages, `script.js` (`FALLBACK_EMAIL`) — still a placeholder |
| `+1 (555) 010-0100` / `+15550100` | `index.html` (contact section, footer, JSON-LD) |
| `1200 Harbor Gateway…` | `index.html` (contact section, JSON-LD `address`) |
| Stats: `120+`, `15k+`, `99%` | `index.html` hero `data-to` attributes |
| `2014`, `60+`, `7 offices` | `index.html` About section + JSON-LD `foundingDate` |
| Accreditations (IATA, FMC, C-TPAT, AEO, ISO) | `index.html` trust strip + About panel — **remove any you do not hold** |
| Testimonial quote | `index.html` "Why Vertex" section |
| LinkedIn / X links | `index.html` footer `social` list + JSON-LD `sameAs` |

The social card (`assets/og-image.jpg`) and the 512px `assets/logo.png` are
already generated from the logo and the hero photograph — no action needed unless
you change the tagline.

**The photographs are generic CC0 stock, not your facilities.** See
`assets/CREDITS.md` for sources and licences. Replace them with real photos of
your own operation when you can; it is the single biggest trust upgrade available
to this page. Keep the same filenames and both formats (`.webp` + `.jpg`) and
nothing else needs to change.

## Making the contact form live

The form validates client-side and currently falls back to opening the visitor's
email client. To receive submissions properly, set `ENDPOINT` at the top of the
form section in `script.js` to a form backend URL:

- **Formspree** — `https://formspree.io/f/YOUR_ID`
- **Web3Forms** — `https://api.web3forms.com/submit` (add an `access_key` field)
- **Netlify Forms** — drop `ENDPOINT`, add `data-netlify="true"` to the `<form>`

A hidden honeypot field (`website`) already blocks basic bots.

## Images

Each photograph ships twice — `.webp` (smaller) and `.jpg` (universal) — served
through `<picture>`, so browsers pick the best one automatically. All `<img>`
tags carry `width`/`height` to prevent layout shift. The hero is preloaded and
marked `fetchpriority="high"` because it is the Largest Contentful Paint element;
everything below the fold is `loading="lazy"`.

A CSS filter desaturates and cools each photo so it sits inside the navy palette
rather than fighting it. If you swap in your own photography and it looks too
muted, adjust the `filter:` lines on `.hero-photo img`, `.mode img` and
`.about-figure img` in `styles.css`.

To regenerate the social card after changing the tagline, re-render
`assets/og-image.jpg` at 1200×630 from the hero image plus the logo lockup.

## Logo

Concept **"Apex"** — a V whose inbound arm descends and whose outbound arm rises
past it (goods in, goods out higher). Full spec, colour values, file list and the
one caveat about the wordmark being live text rather than outlined paths are in
`assets/CREDITS.md`.

The header and footer marks are inline SVG using two CSS classes, `.bm-outer` and
`.bm-inner`, so they recolour with the theme and animate on hover. Change the
brand colour once in `:root { --accent }` and the logo, buttons and accents all
follow.

## Languages

English lives at `/`, Amharic at `/am/`. They are two real pages at two real
URLs, not a JavaScript text swap, which is what makes the Amharic content
indexable — Google can rank it for Amharic searches, and `/am/` is a link you can
share directly.

Each page declares `<html lang>` correctly and both carry the same three
`hreflang` tags (`en`, `am`, `x-default`), pointing at each other and at
themselves. That reciprocity is what tells Google the two pages are the same
content in different languages rather than duplicates. `sitemap.xml` repeats the
annotation. The switcher sits in the header (`EN` / `አማ`) and again in the footer.

Amharic sets Noto Sans Ethiopic ahead of Inter, with its own typography rules in
section 17b of `styles.css`: Ethiopic glyphs are taller and denser than Latin, so
the tight heading tracking is zeroed out and the line height is opened up.
Numerals and the `VERTEX` wordmark stay in Inter.

### Why the links say `index.html`

The language links point at `index.html` and `am/index.html` rather than `/` and
`/am/`. Directory-style links need a web server to resolve `/am/` to
`/am/index.html`; opened straight from disk over `file://` there is no server, so
the browser shows its own directory listing instead of the site. Explicit
filenames work both ways — double-clicked from the folder *and* deployed.

`<link rel="canonical">`, the `hreflang` tags and `sitemap.xml` all still declare
the clean production URLs (`/` and `/am/`), so that is what Google indexes. If you
deploy and would rather the visible links be clean too, change the six `href`
values back to `./`, `am/` and `../` — but then the pages only work when served,
not when opened from the folder.

Switching language keeps your place: both pages use identical section ids, so the
current `#section` is carried across. Read Process in English, click አማ, and you
land on የአሠራር ሂደት rather than back at the top.

**When you edit one page, edit the other.** This is the one real cost of separate
URLs. Changing a price, a phone number or a service on `index.html` and forgetting
`am/index.html` leaves your Amharic visitors reading stale copy. The two files
have identical structure, class names and section ids, so changes map one to one.

The Amharic text is a full translation of the English, including the structured
data and the FAQ. Have a native speaker read it once before launch — business
terminology, especially around customs and Incoterms, is worth a second pair of
eyes.

## Themes

Light is the default. A sun/moon button in the header switches to dark and the
choice is saved to `localStorage` (`vertex-theme`), so it survives reloads and
carries across the language switch, since both pages share an origin.

An inline script in each `<head>` applies the saved theme *before first paint* —
without it the page would flash light before switching to dark. That script must
stay inline and stay in the head; moving it to `script.js` reintroduces the flash.

Both themes are driven entirely by custom properties: `:root` holds the light
values, `:root[data-theme="dark"]` overrides them. Nothing else in the stylesheet
hardcodes a colour, so to retheme the whole site you edit those two blocks. The
toggle also updates `<meta name="theme-color">` and `color-scheme` so the browser
UI and form controls follow.

Two things are deliberately exempt: the photo captions in the mode band keep light
text on a dark scrim in both themes, because they sit on photographs.

**First-time visitors always get light**, even on a device set to dark mode. If
you would rather respect the OS setting, add this to the inline boot script in
both pages:

```js
else if (matchMedia('(prefers-color-scheme: dark)').matches)
  d.setAttribute('data-theme', 'dark');
```

## Notes

- Smooth scrolling is CSS (`scroll-behavior` + `scroll-padding-top` so sections
  clear the sticky header); `script.js` adds focus management and a fallback.
- Everything respects `prefers-reduced-motion`.
- Content is visible without JavaScript — reveal animations only apply once the
  `js` class is set on `<html>`.
