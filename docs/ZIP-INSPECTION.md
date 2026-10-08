# ZIP Inspection Report — `AgriCulture-v1.0.0.zip`

**Source file:** `AgriCulture-v1.0.0.zip` (6,516,036 bytes)
**Template:** AgriCulture — `https://bootstrapmade.com/agriculture-bootstrap-website-template/`
**Author:** BootstrapMade.com · **Updated:** Aug 07 2024 with Bootstrap v5.3.3
**Unpacked:** 123 files, 34 directories, 5 HTML pages
**Nature:** Static HTML/CSS/JS template. **Not** a Next.js/React project. No `package.json`, no build tooling, no server runtime.

---

## 1. Full file tree

```
AgriCulture-v1.0.0/
├── .DS_Store
├── Readme.txt
├── index.html                      (70,806 b)
├── about.html                      (57,662 b)
├── services.html                   (57,817 b)
├── blog.html                       (17,592 b)
├── blog-details.html               (25,331 b)
├── contact.html                    (12,681 b)
├── testimonials.html               (12,472 b)
├── forms/
│   ├── Readme.txt
│   ├── contact.php                 (1,341 b)
│   └── newsletter.php              (1,250 b)
└── assets/
    ├── .DS_Store
    ├── css/
    │   └── main.css                (48,236 b — 2,269 lines)
    ├── js/
    │   └── main.js                 (4,996 b)
    ├── scss/
    │   └── Readme.txt              ("only available in the pro version")
    ├── img/
    │   ├── favicon.png             (1,156 b)
    │   ├── logo.png                (5,228 b)
    │   ├── apple-touch-icon.png    (7,489 b)
    │   ├── hero_1.jpg … hero_5.jpg
    │   ├── img_sq_1/3/4/5/6/8.jpg
    │   ├── img_long_5.jpg
    │   ├── page-title-bg.webp
    │   ├── blog/         blog-1…6.jpg, blog-author.jpg, blog-inside-post.jpg,
    │   │                 blog-recent-1…5.jpg, comments-1…6.jpg
    │   ├── team/         team-1…4.jpg
    │   └── testimonials/ testimonials-1…4.jpg
    └── vendor/
        ├── aos/          aos.css, aos.js, aos.cjs.js, aos.esm.js, aos.js.map
        ├── bootstrap/    css/ + js/  (full + min + rtl + maps)
        ├── bootstrap-icons/  woff, woff2, css, scss, json
        ├── glightbox/    css/ + js/
        ├── php-email-form/ validate.js
        └── swiper/       swiper-bundle.min.css + .js + .map
```

### `main.css` section map (2,269 lines)

| Line | Section |
|---|---|
| 10 | Font & Color Variables |
| 62 | General Styling & Shared Classes |
| 223 | Global Header |
| 254 | Navigation Menu |
| 491 | Global Footer |
| 622 | Preloader |
| 657 | Scroll Top Button |
| 690 | Disable aos animation delay on mobile devices |
| 699 | Global Page Titles & Breadcrumbs |
| 748 | Global Sections |
| 768 | Global Section Titles |
| 789 | Hero Section |
| 950 | Services Section |
| 1039 | About Section |
| 1077 | Services 2 Section |
| 1222 | Testimonials Section |
| 1244 | Recent Posts Section |
| 1320 | Call To Action Section |
| 1373 | About 3 Section |
| 1427 | Team Section |
| 1491 | Blog Posts 2 Section |
| 1576 | Blog Pagination Section |
| 1615 | Blog Details Section |
| 1768 | Blog Comments Section |
| 1827 | Comment Form Section |
| 1908 | Contact Section |
| 2016 | Widgets |

---

## 2. All CSS custom properties — VERBATIM

### 2.1 Font variables (`main.css` L14–18)

```css
:root {
  --default-font: "Open Sans",  system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --heading-font: "Marcellus",  sans-serif;
  --nav-font: "Marcellus",  sans-serif;
}
```

> Note the **double space** after each comma-separated family name (`"Open Sans",  system-ui` / `"Marcellus",  sans-serif`). Reproduced verbatim.

### 2.2 Global colours (`main.css` L21–29)

```css
:root {
  --background-color: #ffffff; /* Background color for the entire website, including individual sections */
  --default-color: #212529;    /* Default color used for the majority of the text content across the entire website */
  --heading-color: #2d465e;    /* Color for headings, subheadings and title throughout the website */
  --accent-color: #116530;     /* Accent color that represents your brand on the website. It's used for buttons, links, and other elements that need to stand out */
  --surface-color: #ffffff;    /* The surface color is used as a background of boxed elements within sections, such as cards, icon boxes, or other elements that require a visual separation from the global background. */
  --contrast-color: #ffffff;   /* Contrast color for text, ensuring readability against backgrounds of accent, heading, or default colors. */
}
```

### 2.3 Nav menu colours (`main.css` L31–39)

```css
:root {
  --nav-color: #212529;                     /* The default color of the main navmenu links */
  --nav-hover-color: #116530;               /* Applied to main navmenu links when they are hovered over or active */
  --nav-mobile-background-color: #ffffff;   /* Used as the background color for mobile navigation menu */
  --nav-dropdown-background-color: #ffffff; /* Used as the background color for dropdown items that appear when hovering over primary navigation items */
  --nav-dropdown-color: #212529;            /* Used for navigation links of the dropdown items in the navigation menu. */
  --nav-dropdown-hover-color: #116530;      /* Similar to --nav-hover-color, this color is applied to dropdown navigation links when they are hovered over. */
}
```

### 2.4 Colour presets (`main.css` L41–55)

```css
.light-background {
  --background-color: #f9f9f9;
  --surface-color: #ffffff;
}

.dark-background {
  --background-color: #060606;
  --default-color: #ffffff;
  --heading-color: #ffffff;
  --accent-color: #2ea359;
  --surface-color: #252525;
  --contrast-color: #ffffff;
}
```

### 2.5 Root-level `scroll-behavior` (`main.css` L57–59)

```css
:root {
  scroll-behavior: smooth;
}
```

### Complete property inventory

| Property | Value | Scope |
|---|---|---|
| `--default-font` | Open Sans stack (above) | `:root` |
| `--heading-font` | `"Marcellus",  sans-serif` | `:root` |
| `--nav-font` | `"Marcellus",  sans-serif` | `:root` |
| `--background-color` | `#ffffff` | `:root` → `#f9f9f9` (.light) → `#060606` (.dark) |
| `--default-color` | `#212529` | `:root` → `#ffffff` (.dark) |
| `--heading-color` | `#2d465e` | `:root` → `#ffffff` (.dark) |
| `--accent-color` | `#116530` | `:root` → `#2ea359` (.dark) |
| `--surface-color` | `#ffffff` | `:root` → `#252525` (.dark) |
| `--contrast-color` | `#ffffff` | `:root` → `#ffffff` (.dark) |
| `--nav-color` | `#212529` | `:root` |
| `--nav-hover-color` | `#116530` | `:root` |
| `--nav-mobile-background-color` | `#ffffff` | `:root` |
| `--nav-dropdown-background-color` | `#ffffff` | `:root` |
| `--nav-dropdown-color` | `#212529` | `:root` |
| `--nav-dropdown-hover-color` | `#116530` | `:root` |

**Total: 15 custom properties.** No custom properties are declared on any element in the HTML files — all 15 originate in `main.css`.

**Colour derivation technique:** the template uses CSS `color-mix(in srgb, var(--x), transparent N%)` extensively rather than pre-computed alpha channels. Derived tones in use: `transparent 20/25/30/50/60/75/85/90/92%`.

---

## 3. Fonts — files, formats, weights, `@font-face`

### 3.1 `@font-face` rules: **NONE for the brand fonts**

```
grep -r "@font-face" --include="*.css" .
→ assets/vendor/bootstrap-icons/bootstrap-icons.css
→ assets/vendor/bootstrap-icons/bootstrap-icons.min.css
→ assets/vendor/swiper/swiper-bundle.min.css
```

All three are third-party vendor files. **There is no `@font-face` for Open Sans or Marcellus anywhere in the zip.**

### 3.2 Local font files: **NONE for the brand fonts**

```
find . -type f \( -iname "*.woff*" -o -iname "*.ttf" -o -iname "*.otf" -o -iname "*.eot" \)
→ (none, excluding the two bootstrap-icons vendor files)
```

| File | Format | Purpose |
|---|---|---|
| `assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2` | WOFF2 (130,396 b) | Icon glyphs only |
| `assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff` | WOFF (176,032 b) | Icon glyphs only |

The only other embedded font is a subset inside `swiper-bundle.min.css` (Swiper's built-in nav arrows) — not brand typography.

### 3.3 How the brand fonts actually load — Google Fonts CDN

In `<head>` of **all 7 HTML pages**, identical:

```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect">
<link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Marcellus:wght@400&display=swap" rel="stylesheet">
```

**Resolved families and weights:**

| Family | Weights loaded | Italics loaded | Used for |
|---|---|---|---|
| **Open Sans** | 300, 400, 500, 600, 700, 800 | 300i, 400i, 500i, 600i, 700i, 800i | `--default-font` — all body copy |
| **Marcellus** | **400 only** | none | `--heading-font` + `--nav-font` — headings & navigation |

**This is the single most important fidelity constraint:** Marcellus has exactly **one** weight (400). Any bold applied to Marcellus text is browser-synthesised faux-bold, not a real font file. Heading `font-weight` values in the template are 700 (hero h2, page-title h1) — those render as synthesised bold over Marcellus 400.

`display=swap` is set on the request.

### 3.4 Font-weight values declared in `main.css`

600 (L100, 110, 530, 1298), 700 (L245, 519, 721, 844, 1066, 1275, 1547, 1635), 400 (L280, 733, 969, 1003, 1554), 500 (L400, 778, 1234, 1265, 1664, 1513†), 300 (L1061, 1070, 1327), `normal !important` (L1407), `bold` (L1647, 1775).

† L1513 = 600.

### 3.5 Font-size scale in `main.css` (complete)

| px | Where |
|---|---|
| 48 | `.hero h2` (→ 30px ≤768px) |
| 42 | `.page-title h1` |
| 32 | `.section-title p`, hero carousel-control icons |
| 30 | `.header .logo span`, `.hero h2` ≤768px |
| 28 | `.section-title h2`, `.navmenu .mobile-nav-toggle`, `.blog-details .post-title` |
| 26 | `.footer .footer-about .logo span` |
| 24 | `.scroll-top i`, `.team .team-member .member-info h4`, `.contact .info-item i`, widget h4 |
| 22 | blog detail h2/h3, comment form h3 |
| 20 | service h3, `.services-2` h3, testimonial text, recent-post h3, team h3, blog post h3/h4 |
| 18 | footer social icons, contact info h4, widget h4 |
| 17 | `.navmenu a` @≤1199px (mobile nav) |
| 16 | `.navmenu a` @≥1200px, `.section-title h4`, `.footer h4`, breadcrumbs, blog meta, contact form labels |
| 15 | `.hero .btn-get-started`, services-2 copy, recent-post copy, contact section |
| 14 | `.footer` root, footer-about p, about-3 eyebrow, blog meta/category/comments, widgets, footer credits 13px |
| 13 | `.footer .credits`, recent-post meta, testimonial meta |
| 12 | nav icon `i`, footer link `i` |

> **The zip's body copy has no explicit `font-size`** — `body` inherits the browser default of **16px**.

---

## 4. Loading screen component — exact timing

### 4.1 Markup (last element before scripts, all pages)

```html
<!-- Preloader -->
<div id="preloader"></div>
```

An empty `div`. No text, no SVG, no progress bar, no skip control.

### 4.2 CSS (`main.css` L621–654, verbatim)

```css
#preloader {
  position: fixed;
  inset: 0;
  z-index: 999999;
  overflow: hidden;
  background: var(--background-color);
  transition: all 0.6s ease-out;
}

#preloader:before {
  content: "";
  position: fixed;
  top: calc(50% - 30px);
  left: calc(50% - 30px);
  border: 6px solid #ffffff;
  border-color: var(--accent-color) transparent var(--accent-color) transparent;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: animate-preloader 1.5s linear infinite;
}

@keyframes animate-preloader {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 4.3 JavaScript (`assets/js/main.js`, verbatim)

```js
const preloader = document.querySelector('#preloader');
if (preloader) {
  window.addEventListener('load', () => {
    preloader.remove();
  });
}
```

### 4.4 Exact timing summary

| Aspect | Value |
|---|---|
| Container | `fixed`, `inset: 0`, `z-index: 999999` |
| Backdrop | `var(--background-color)` = `#ffffff` |
| Spinner size | 60 × 60 px, `border: 6px solid` |
| Spinner colours | `--accent-color` `#116530` (top+bottom) / `transparent` (left+right) |
| Spin period | **1.5 s** `linear` `infinite` |
| Fade-out transition | **`all 0.6s ease-out`** defined but **never triggered** — `.remove()` is instantaneous, so the 0.6 s transition is dead code in practice |
| Dismissal trigger | window `load` event (i.e. every image, font and vendor script) |
| Minimum display | none |
| Maximum display | none — bounded only by page load |
| Progress indication | none |
| Skip control | none |
| `role` / ARIA | none |
| Reduced-motion handling | **none** |

> **Key finding:** the zip's preloader is a bare CSS spinner with **no wordmark, no progress bar, no skip control, no ARIA, and no reduced-motion fallback**, and it is dismissed on `window.load` rather than on any fixed time budget. It therefore **does not satisfy** EFFECT-08 or EFFECT-25, and the brief's own conditional applies: *"Copy from zip. **If absent** → EFFECT-25 / EFFECT-08."*

---

## 5. Cookie consent banner — **ABSENT**

```
grep -ril "cookie" .        → no matches
grep -ril "consent" .       → no matches
```

There is **no cookie banner, no consent modal, no localStorage consent logic, and no cookie policy page** anywhere in the zip. The brief's fallback specification applies in full.

Related: no `document.cookie` usage anywhere; `localStorage` is never referenced.

---

## 6. CAPTCHA — **ABSENT**

```
grep -ril "captcha" .   → no matches
grep -ril "recaptcha" . → no matches
```

No CAPTCHA provider, no site key, no verification call, no fallback, no honeypot. The two PHP form handlers do zero validation beyond the (included-but-missing) email library. The brief's fallback (reCAPTCHA v3 with v2 fallback under 0.5) applies in full.

---

## 7. Privacy policy & terms page layouts — **ABSENT**

No `privacy*`, `terms*`, `legal/` directory or page exists. The only trace is a **footer placeholder link** in `index.html` L773–775:

```html
<h4>Useful Links</h4>
<ul>
  <li><a href="#">Home</a></li>
  <li><a href="#">About us</a></li>
  <li><a href="#">Services</a></li>
  <li><a href="#">Terms of service</a></li>
  <li><a href="#">Privacy policy</a></li>
</ul>
```

Both links are `href="#"`. There is no legal-page layout to copy. The nearest reusable layout primitive is the **`.page-title`** banner (`main.css` L699–746):

```css
.page-title {
  color: var(--default-color);
  background-color: var(--background-color);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 80px 0;
  text-align: center;
  position: relative;
}
.page-title:before {
  content: "";
  background-color: color-mix(in srgb, var(--background-color), transparent 50%);
  position: absolute;
  inset: 0;
}
.page-title h1 { font-size: 42px; font-weight: 700; margin-bottom: 10px; }
.page-title .breadcrumbs ol { display: flex; flex-wrap: wrap; list-style: none; justify-content: center; padding: 0; margin: 0; font-size: 16px; font-weight: 400; }
.page-title .breadcrumbs ol li+li { padding-left: 10px; }
.page-title .breadcrumbs ol li+li::before { content: "/"; display: inline-block; padding-right: 10px; color: color-mix(in srgb, var(--default-color), transparent 50%); }
```

…plus the `.section` rhythm (`padding: 60px 0`) and `.section-title` pattern. These will be reused as the shell for `/legal/*`.

---

## 8. 404 & 500 page designs — **ABSENT**

No `404.html`, `500.html`, `error/` directory, or error-page CSS. `grep -n "500" main.css` returns only `font-weight: 500` / hex / `px` matches — no error-page rules. The brief's EFFECT-17 404 and branded 500 specs apply in full.

---

## 9. API route structures

**The zip contains no API routes, no server runtime, and no routing layer.** It is 7 static HTML files with hash/anchor links (`index.html`, `about.html`, …).

The only server-side code is two PHP endpoints in `forms/`:

### 9.1 `forms/contact.php` (verbatim, 1,341 b)

```php
<?php
  $receiving_email_address = 'contact@example.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;

  $contact->to = $receiving_email_address;
  $contact->from_name = $_POST['name'];
  $contact->from_email = $_POST['email'];
  $contact->subject = $_POST['subject'];

  $contact->add_message( $_POST['name'], 'From');
  $contact->add_message( $_POST['email'], 'Email');
  $contact->add_message( $_POST['message'], 'Message', 10);

  echo $contact->send();
?>
```

### 9.2 `forms/newsletter.php` (verbatim, 1,250 b)

```php
<?php
  $receiving_email_address = 'contact@example.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;

  $contact->to = $receiving_email_address;
  $contact->from_name = $_POST['email'];
  $contact->from_email = $_POST['email'];
  $contact->subject ="New Subscription: " . $_POST['email'];

  $contact->add_message( $_POST['email'], 'Email');

  echo $contact->send();
?>
```

**Both are non-functional in this zip.** They `die()` because `assets/vendor/php-email-form/php-email-form.php` is **not shipped** — only `validate.js` is. `forms/Readme.txt` confirms:

> *"Fully working PHP/AJAX contact form script is available in the pro version of the template."*

The client-side counterpart, `assets/vendor/php-email-form/validate.js`, is BootstrapMade's generic AJAX submitter that reads `.error-message`, `.loading` and `.sent-message` siblings and POSTs to the form's `action`. The matching CSS hooks (`main.css` L94–141) are `.php-email-form .error-message` (`#df1529` bg), `.php-email-form .sent-message` (`#059652` bg), `.php-email-form .loading` (spinner via `--accent-color` / `--surface-color`, 1 s linear infinite).

**Conclusion:** all 8 API routes named in the brief are greenfield. The only thing to carry over is the **three-state form feedback pattern** (error / loading / sent) and its colour pair `#df1529` / `#059652`.

---

## 10. All package versions

**There is no `package.json`, no lockfile, no `.nvmrc`, no `.env`, no bundler config and no Node dependency of any kind in the zip.**

Bundled third-party libraries (vendored as static files, version-stamped in-file):

| Library | Version | Evidence |
|---|---|---|
| **Bootstrap** | **5.3.3** | `main.css` L4 header: *"Updated: Aug 07 2024 with Bootstrap v5.3.3"* |
| **Bootstrap Icons** | **1.11.3** | `bootstrap-icons.css` banner: *"Bootstrap Icons v1.11.3 … Copyright 2019-2024 The Bootstrap Authors"* |
| **Swiper** | **11.1.9** | `swiper-bundle.min.css` banner: *"Swiper 11.1.9 … Copyright 2014-2024 Vladimir Kharlampidi"* |
| **GLightbox** | **3.3.0** | `glightbox.js` — `version: "3.3.0"` |
| **AOS** | **2.x (2.3.4)**, unstamped | `aos.js`/`aos.esm.js` carry no version string; `.esm.js` imports `lodash.throttle` + `lodash.debounce`, characteristic of AOS 2.3.4 (`aos@2.3.4` package ships `aos.esm.js` with those imports) |
| **PHP Email Form** | *paid library, not shipped* | `forms/Readme.txt` |
| jQuery | **not present** | Bootstrap 5 is jQuery-free |
| lodash | **not present** (only imported, unresolved, in the unused `.esm.js`) | — |

> Because `aos.esm.js`/`aos.cjs.js` reference `lodash.throttle` and `lodash.debounce` without either being present or a `package.json` existing, **those two files are inert** in this template. Only the global `aos.js` build is loaded by the HTML.

`.DS_Store` files (`./` and `./assets/`) are macOS Finder artefacts, not assets.

---

## 11. All environment variable names

**None.** There are zero environment variables, zero `.env` files, and no config layer of any kind.

The two PHP handlers hardcode their recipient:

```php
$receiving_email_address = 'contact@example.com';
```

and carry commented-out SMTP credentials as literal placeholders:

```php
/*
$contact->smtp = array(
  'host' => 'example.com',
  'username' => 'example',
  'password' => 'pass',
  'port' => '587'
);
*/
```

All environment variable names in the new build therefore come from the brief, not the zip (see §13).

---

## 12. Design tokens to reproduce (beyond colours & fonts)

### Header / nav

| Property | Value |
|---|---|
| `.header` padding | `20px 0`, `transition: all 0.5s`, `z-index: 997` |
| `.header .logo img` | `max-height: 40px` (footer logo: `max-height: 40px; margin-right: 6px`) |
| `.header .logo span` | `font-size: 30px; font-weight: 700` (`.sitename`) |
| Nav desktop (`≥1200px`) | `font-size: 16px`, `font-family: var(--nav-font)`, `font-weight: 400`, `padding: 18px 15px`, `transition: 0.3s` |
| Nav icon `i` | `font-size: 12px; margin-left: 5px; transition: 0.3s` |
| Nav mobile (`≤1199px`) | `font-size: 17px; font-weight: 500; padding: 10px 20px` |
| Mobile toggle | `font-size: 28px; margin-right: 10px; transition: color 0.3s` |
| Mobile panel | `inset: 60px 20px 20px 20px; border-radius: 6px; box-shadow: 0 0 30px <default 90% transparent>` |
| Active/hover pill | `background-color: var(--accent-color); color: var(--contrast-color)` |
| Sub-nav radius | `4px` icon buttons (`color-mix(--accent, transparent 90%)` bg) |
| Nav dropdown border | `1px solid color-mix(in srgb, var(--default-color), transparent 90%)` |

### Sections & layout

| Property | Value |
|---|---|
| `section, .section` | `padding: 60px 0; scroll-margin-top: 100px; overflow: clip` |
| ≤1199px `scroll-margin-top` | `66px` |
| `.section-title` | `text-align: center; padding-bottom: 60px` |
| `.page-title` | `padding: 80px 0; text-align: center` |
| Hero container | `inset: 90px 64px 64px 64px` |
| Hero carousel min-height | `calc(100vh - 100px)` |
| Hero scrim | `color-mix(in srgb, var(--background-color), transparent 60%)` |
| Container | Bootstrap `container-xl` |

### Buttons

| Selector | Value |
|---|---|
| `.hero .btn-get-started` | `font-family: var(--heading-font); font-weight: 500; font-size: 15px; letter-spacing: 1px; padding: 8px 32px; border-radius: 50px; transition: 0.5s; margin: 10px` |
| hover | `background: color-mix(in srgb, var(--accent-color), transparent 20%)` |
| `.scroll-top` | `40px × 40px; border-radius: 4px; right/bottom: 15px; z-index: 99999; background-color: var(--accent-color); transition: all 0.4s` |
| `.scroll-top i` | `font-size: 24px; color: var(--contrast-color)` |
| `.footer .social-links a` | `36px × 36px; border-radius: 4px; font-size: 18px; transition: 0.3s` |
| `.footer h4::after` | `width: 20px; height: 2px; background: var(--accent-color)` |

### Hero entrance keyframes (verbatim)

```css
.hero h2       { animation: fadeInDown 1s both; }
.hero p        { animation: fadeInDown 1s both 0.2s; }
.hero .btn-get-started { animation: fadeInUp 1s both 0.4s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translate3d(0, 100%, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translate3d(0, -100%, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
}
```

> This is the zip's **existing sequenced entrance**: headline → sub-copy (+0.2 s) → CTA (+0.4 s), 1 s each. It is the native basis for EFFECT-23 (which requires the full sequence under 1.6 s).

### JS behaviours ported from `main.js`

| Behaviour | Detail |
|---|---|
| `.scrolled` class | applied to `<body>` when `window.scrollY > 100` — only for `.scroll-up-sticky` / `.sticky-top` / `.fixed-top` headers |
| Mobile nav toggle | toggles `body.mobile-nav-active` + swaps `bi-list` ⇄ `bi-x`; closes on any nav link click |
| Dropdown toggle | `.toggle-dropdown` toggles parent `.active` + sibling `.dropdown-active` |
| Scroll-top | active at `scrollY > 100`, smooth scroll to top |
| AOS | `{ duration: 600, easing: 'ease-in-out', once: true, mirror: false }` on `load` |
| Swiper | auto-init from embedded `.swiper-config` JSON |
| GLightbox | `GLightbox({ selector: '.glightbox' })` |
| Carousel indicators | auto-generated `<li>` from `.carousel-item` count |

> **Threshold note:** the zip uses **100px** for its scroll state; the brief's EFFECT-28 specifies glassmorphism from **80px**. Both will be honoured — 80px drives glass, the zip's 100px value is preserved for the legacy `.scrolled` marker.

---

## 13. Gap analysis — what the zip does **not** contain

Every item below falls to the brief's explicit fallback ("*if absent*") rather than to zip values:

| Brief item | In zip? | Resolution |
|---|---|---|
| EFFECT-25 sprouting-seedling preloader | ✗ | Build to brief |
| EFFECT-08 self-drawing wordmark | ✗ | Build to brief |
| Cookie consent banner + modal | ✗ | Build to brief |
| reCAPTCHA v3 + v2 fallback | ✗ | Build to brief |
| Privacy policy page | ✗ | Build to brief (shell = `.page-title` + `.section`) |
| Terms page | ✗ | Build to brief (shell above) |
| 404 (EFFECT-17) | ✗ | Build to brief |
| 500 | ✗ | Build to brief |
| EFFECT-01 WebGL hero | ✗ | Build to brief |
| EFFECT-02 scrollytelling | ✗ | Build to brief |
| EFFECT-03 AR farm tour | ✗ | Build to brief |
| EFFECT-05 presence board | ✗ | Build to brief |
| EFFECT-27 neumorphic widget | ✗ | Build to brief |
| Skeleton loaders (EFFECT-24) | ✗ | Build to brief |
| Scroll-snap rail (EFFECT-15) | ✗ | Build to brief |
| MDX blog | ✗ | Build to brief (`blog.html` is static markup) |
| Product / FoodEstablishment JSON-LD | ✗ | Build to brief |
| `vercel.json`, sitemap, robots | ✗ | Build to brief |
| Prose sections/split utility in `.scss` | ✗ | Paid tier only |

### Asset licensing notes

- All photographs ship inside the template under the BootstrapMade licence; they are generic **European/Western** stock imagery (a white farmer with a hat, wellington boots, a garden centre) — see `docs/PHOTO-SHOT-LIST.md` for how this conflicts with the brief's **"East African farmers and produce settings"** requirement.
- Testimonial and team headshots are likewise non-African and are replaced with the brief's East African chef/procurement persona set.
- The logo (`assets/img/logo.png`, 5,228 b) is a generic BootstrapMade leaf/seal mark and is replaced by the Canaan Harvest wordmark.

---

## 14. Fidelity contract — what will be reproduced verbatim

1. **All 15 CSS custom properties**, byte-identical, at `:root` in that order and grouping, including the double-space in the font stacks.
2. **Font families, weights and sizes exactly as the zip**: Open Sans (300/400/500/600/700/800 + italics) as `--default-font`; Marcellus 400 as `--heading-font` and `--nav-font`. Self-hosted to guarantee fidelity (see note below), declared with real `@font-face` rules that the zip lacked.
3. **The full `main.css` typographic scale** — 48/42/32/30/28/26/24/22/20/18/17/16/15/14/13/12 px at their exact selectors.
4. **The zip's hero entrance keyframes** (`fadeInUp` / `fadeInDown`, 1 s `both`, 0.2 s / 0.4 s stagger) as the base of EFFECT-23.
5. **The zip's preloader geometry and timing** — 60×60 px, 6 px border, `#116530` / `transparent` quadrant colours, `1.5s linear infinite`, `0.6s ease-out` container fade — carried into the EFFECT-25 seedling preloader.
6. **The `color-mix(in srgb, …, transparent N%)` derivation technique** rather than substituting pre-baked rgba values.
7. **Vendor versions**: Bootstrap 5.3.3 (via grid/utility tokens, not a full port), Bootstrap Icons 1.11.3 → replaced by **Lucide 0.468.0** per the brief's icon mandate, Swiper 11.1.9 → native scroll-snap per EFFECT-15.

> **Font-hosting decision.** The zip loads Open Sans and Marcellus from the Google Fonts CDN and ships no font files and no `@font-face`. To make the "fonts are sacred" constraint *verifiable and offline-safe*, the same two families at the same 14 weight/italic combinations are self-hosted from `@fontsource/open-sans@5.3.0` and `@fontsource/marcellus@5.3.0` (WOFF2 + WOFF), with explicit `@font-face` rules — identical family names, identical weights, identical rendering, zero third-party runtime request. `--default-font`, `--heading-font` and `--nav-font` keep the zip's verbatim stacks as fallbacks behind the real families.
