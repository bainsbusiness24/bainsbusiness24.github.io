# Dependable Carriages — Executive Chauffeur Service

A production-ready marketing website for a private chauffeur & limousine service.
Built as **vanilla HTML, CSS, and JavaScript** — no build step, no dependencies,
no framework. Open `index.html` in a browser or upload the folder to any host
(Netlify, Vercel, GitHub Pages, S3, cPanel, etc.) and it just works.

---

## Why plain HTML/CSS/JS?

This is a content-driven marketing site, so the priorities are **fast loading,
accessibility, and ease of editing** for a non-developer. A static stack ships
the least code, has zero build tooling to maintain, and lets you change copy by
editing plain HTML. (Fonts load from Google Fonts; everything else is local.)

---

## File structure

```
dependable-carriages/
├── index.html              ← all page content & copy (edit text here)
├── README.md               ← this file
├── css/
│   └── styles.css          ← all styling; COLORS live at the top (CSS variables)
├── js/
│   └── main.js             ← nav, scroll animations, form validation + handler
└── assets/
    ├── logos/              ← DROP YOUR LOGO FILES HERE
    │   ├── logo-primary.svg   (dark logo — used on light backgrounds)
    │   ├── logo-white.svg     (white logo — used on dark backgrounds/header/footer)
    │   └── logo-mark.svg      (square seal — used as favicon/avatar)
    └── img/                ← hero + fleet images
        ├── hero.svg
        ├── fleet-sedan.svg
        ├── fleet-suv.svg
        ├── fleet-firstclass.svg
        └── fleet-van.svg
```

---

## 1. Dropping in your logos

Put your real logo files in **`assets/logos/`**. The site already references three
filenames — keep these names and it works with zero code changes:

| Filename            | Used where                                  | Background |
|---------------------|---------------------------------------------|------------|
| `logo-primary.svg`  | reserved for light-background headers        | light      |
| `logo-white.svg`    | site header + footer (the visible logo)      | dark       |
| `logo-mark.svg`     | browser tab favicon                          | any        |

- **SVG is preferred** (crisp at every size). PNG works too — if you use PNG,
  update the file extension in `index.html` (search for `logo-white.svg`).
- The header sits over the dark hero, so the **white** logo shows there. The dark
  `logo-primary.svg` is wired up and hidden, ready if you ever switch to a light header.
- The placeholder logos included are brand-accurate stand-ins (the "DC" roundel +
  wordmark in Sovereign Gold). Replace them with your final artwork.

---

## 1b. The brand seal (business-card crest)

The full crest from your business card — the crowned **DC** monogram with the
"Dependable · Carriages · Executive Chauffeur" ring and "EST · MMXXVI" — appears
as a featured emblem band just after the Booking form (before the footer), and is
also used as the browser-tab favicon. It lives at **`assets/logos/logo-mark.svg`**.

To restyle that band, see `.seal-band` in `css/styles.css` (you can change the
tagline text directly in `index.html` — search for `seal-band__tagline`). To use
your own exported seal, drop it in over `assets/logos/logo-mark.svg`.

---

## 2. Changing colors

**All colors are CSS variables at the top of `css/styles.css`** under
`:root` → section **1. DESIGN TOKENS**. Change a value once and it updates
everywhere (buttons, links, headers, accents).

The palette is taken directly from your brand identity:

```css
--color-ink:    #141210;  /* Carriage Black  */
--color-gold:   #C8982F;  /* Sovereign Gold  */
--color-ivory:  #F4F1E8;  /* Ivory           */
```

Supporting gold shades (`--color-gold-bright`, `--color-gold-deep`,
`--color-gold-pale`) come from the metallic gold range in your guidelines and
are used for gradients and hover states. To re-skin the whole site, edit these
variables — nothing else.

---

## 3. Changing copy

All text lives in **`index.html`**, organised top-to-bottom in the same order it
appears on the page, with HTML comments marking each section (Hero, Services,
Fleet, Why Choose Us, How It Works, Testimonials, Booking, Footer). The copy is
written for a premium corporate clientele — edit it freely.

Things you'll likely want to personalise:

- **Phone / email** — search `647-631-2500` and
  `info@dependablecarriages.net` and replace everywhere
  (they appear in the booking section and footer).
- **Service area** — footer "Service Area" column.
- **Testimonials** — names, titles, and quotes in the Testimonials section.
- **Fleet specs** — passenger/luggage counts and feature tags per vehicle.
- **Social links** — footer `<a href="#">` placeholders.

---

## 4. The hero banner & other images

**Hero banner (the first screen, behind the headline and buttons):**
Export your brand banner and save it as **`assets/img/hero.jpg`** (or `hero.png`).
The site already points at `hero.jpg` and will use it the moment it exists — no
code change needed. Until then, a placeholder (`hero.svg`) shows automatically.

> The hero keeps a dark gradient overlay on top of the banner so the white
> headline and buttons always stay readable (WCAG-AA). If your banner is dark and
> you want it to show more, you can soften the overlay in `css/styles.css` — look
> for `.hero__media::after` and reduce the opacity values.

**Hero video (optional):** the hero supports video instead of an image. In
`index.html`, find the commented `<video>` block inside `.hero__media`, uncomment
it, and add `assets/img/hero.mp4` (the `hero.jpg` stays as the poster fallback).

**Fleet photos:** add real photos to `assets/img/` (e.g. `fleet-sedan.jpg`) and
update the matching `src` in `index.html`. Keep the **alt text** (already written).

Recommended sizes: hero ~1600×900, fleet cards ~800×500. Compress before
uploading (e.g. squoosh.app) for fast loading.

---

## 4b. The Fleet section is currently hidden

The Fleet navigation link and the whole Fleet section are **hidden for now** (so
you can add real vehicles later as the business grows) — but **all the code is
still in place**. To bring it back, do these three small edits in `index.html`:

1. **Section:** find `<section class="section section--ink is-hidden" id="fleet" … hidden>`
   and remove both `is-hidden` (from the class) and the `hidden` attribute.
2. **Nav link:** near the top, un-comment the line
   `<!-- <li><a href="#fleet">Fleet</a></li> -->`.

That's it — the section, its four vehicle cards, and the menu link reappear
exactly as before. (Both the `hidden` attribute and the `.is-hidden` CSS class
are used together so it stays hidden reliably.)

---

## 5. Wiring up the booking form (Formspree)

The form is already wired to send quote requests to **info@dependablecarriages.net**
via [Formspree](https://formspree.io). You just need to connect your own Formspree
form and paste in its endpoint URL. **One line to change.**

### Steps

1. Sign up (free) at **https://formspree.io**.
2. Create a new form and set its notification email to
   **info@dependablecarriages.net**.
3. Formspree gives you an endpoint URL that looks like:
   `https://formspree.io/f/abcdwxyz`
4. Open **`js/main.js`**, and near the top find the **CONFIG** block:

   ```js
   var FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
   ```

   Replace `YOUR_FORM_ID` (or the whole URL) with your real endpoint. Save. Done.

5. Submit a test from the live site. Formspree will email you to confirm the form
   the first time, then deliver every request to your inbox. Replies you send go
   straight back to the customer (their email is set as the reply-to address).

### What the visitor experiences

The form posts quietly in the background — the visitor never leaves the page and
sees a "thank you, we'll be in touch" confirmation. The submission arrives in your
inbox with clean labels (Pickup, Drop-off, Date, Time, Passengers, Vehicle, Name,
Phone, Email, Notes).

### Safety net

Until you paste in your real endpoint — **or** if Formspree is ever unreachable —
the form automatically falls back to opening the visitor's own email app with the
request pre-filled and addressed to info@dependablecarriages.net. A request is
never silently lost.

> Free Formspree plans include a monthly submission limit (currently 50). If you
> expect more, check their current pricing, or swap in another service (Getform,
> Basin, your own API) — the `fetch()` call in `submitBooking()` works the same way.

---

## Accessibility & performance notes

- Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `footer`), a skip
  link, labelled form fields, `aria-live` status messages, and visible focus rings.
- Color combinations meet **WCAG AA** contrast (gold-on-ink, ink-on-ivory).
- Animations respect **`prefers-reduced-motion`** and are disabled for users who
  ask for less motion.
- No external JS libraries — only Google Fonts is loaded remotely. For a fully
  self-hosted site, download the Inter and Cormorant Garamond fonts and replace
  the `<link>` in `index.html`.

---

## Quick start

```bash
# from inside the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Or simply double-click `index.html`.
