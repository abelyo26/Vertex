# Image & asset credits

## Photography

All photographs are **CC0 / Public Domain Mark** — free for commercial use with
no attribution required. They were sourced via [Openverse](https://openverse.org),
which aggregates openly licensed media.

| File | Subject | Source | Licence |
|---|---|---|---|
| `img/hero-port.*`, `img/hero-port-1200.*` | Aerial view of a container terminal | Wikimedia Commons | CC0 |
| `img/mode-ocean.*` | Container ship approaching port | Rawpixel | CC0 |
| `img/mode-air.*` | Aircraft being loaded on the apron | Rawpixel | CC0 |
| `img/mode-road.*` | Haulage truck with container trailer | Rawpixel | CC0 |
| `img/mode-warehouse.*` | Forklift moving palletised goods | Rawpixel | CC0 |
| `img/about-djibouti.*` | Container terminal at the Port of Djibouti | Wikimedia Commons, by Skilla1st | **CC BY-SA 4.0** |

Most of these are CC0 and need no attribution. **The Djibouti port photograph is
the exception**: it is CC BY-SA 4.0, so it carries a visible credit in the caption
under the About image, and the cropped version shares that licence. If you replace
it with your own photograph, delete that credit line from both pages.

Source page: https://commons.wikimedia.org/wiki/File:The_container_terminal_at_the_Port_of_Djibouti.jpg

**Every photo is a generic stock image, not a Vertex facility.** Swap them for
real photographs of your own operation as soon as you have them — nothing else
on the page builds trust as fast.

Each image ships as both `.webp` and `.jpg`; the markup serves WebP first via
`<picture>` and falls back to JPEG automatically.

## Logo

Designed for this project — original work, no licence restrictions.

**Concept "Apex".** A V whose inbound arm descends and whose outbound arm rises
past it: goods come in, goods go out higher. It reads as a V, as a vertex (the
point where two lines meet), and as an upward trade curve. The inner chevron
repeats the form at smaller scale for depth.

| File | Use |
|---|---|
| `logo-mark.svg` | Mark alone, transparent background |
| `logo-mark-badge.svg` | Mark on a navy rounded square (app-icon style) |
| `logo.svg` | Horizontal lockup: mark + "VERTEX / IMPORT & EXPORT" |
| `favicon.svg` | Browser tab icon (same as the badge) |
| `apple-touch-icon.png` | 180×180 iOS home-screen icon |
| `logo.png` | 512×512 raster, referenced by the JSON-LD `Organization.logo` |
| `og-image.jpg` | 1200×630 social sharing card |

Brand colours: `#3b82f6` (outer stroke), `#93c5fd` (inner stroke), `#0b1220`
(badge background). On light backgrounds use `#1d4ed8` / `#60a5fa` instead —
the header already does this via CSS custom properties.

**Note:** the wordmark in `logo.svg` is live `<text>` set in Inter, not outlined
paths. It renders correctly on the web, where Inter is loaded. Before sending the
file to a printer or a partner, convert the text to outlines (Illustrator,
Inkscape: Path → Object to Path, or Figma: Outline stroke) so it does not fall
back to a substitute font.

A second concept, "Gateway" — a V with a detached chevron below the apex
suggesting a point of entry — was also drawn. Ask if you would rather use it.
