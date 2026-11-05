# Shared Portfolio: Developer Documentation

This guide explains **how the project works** and **how to change it**. For a quick overview and setup steps, see the [README](./README.md).

## Contents

1. [How it works](#1-how-it-works)
2. [Folder reference](#2-folder-reference)
3. [Data files (JSON schema)](#3-data-files-json-schema)
4. [Page sections](#4-page-sections)
5. [JavaScript files](#5-javascript-files)
6. [Themes](#6-themes)
7. [Resume viewer](#7-resume-viewer)
8. [Contact form](#8-contact-form)
9. [Deployment](#9-deployment)
10. [Common tasks](#10-common-tasks)
11. [Conventions and gotchas](#11-conventions-and-gotchas)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. How it works

The site has **one set of pages** and **two sets of content**. The `user` value in the URL decides whose content is shown.

```
Browser requests  /?user=christine
        │
        ▼
index.php
  1. current_user()   → reads ?user=, checks it against ALLOWED_USERS,
                        falls back to DEFAULT_USER ("jed")
  2. load_content()   → reads data/christine.json into the $data array
  3. includes header.php, then each section, then footer.php
        │
        ▼
Every file receives the same $data array and prints from it.
```

Key points:

- **PHP builds the HTML on the server.** Each section reads values from `$data` and prints them (always through `e()`, which escapes text so it is safe in HTML).
- **JavaScript adds behavior** after the page loads: animations, the theme switcher, the carousel, the resume viewer, and form submission.
- **Nothing is stored in a database.** All content comes from `data/<name>.json`.
- An unknown or missing `?user=` value falls back to Jed, so visitors never see an error page.

### Helper functions (`includes/functions.php`)

| Name                  | What it does                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `ALLOWED_USERS`       | List of valid portfolio names. A person must be listed here to be shown.                                          |
| `DEFAULT_USER`        | Who is shown when `?user=` is missing or invalid (currently `jed`).                                               |
| `e($value)`           | Escapes text with `htmlspecialchars`. Use it for **every** value printed into HTML.                               |
| `current_user()`      | Returns the validated, lowercase user name.                                                                       |
| `load_content($user)` | Reads and decodes `data/<user>.json`. Stops with a clear message if the file is missing or contains invalid JSON. |

---

## 2. Folder reference

```
shared-portfolio/
├── index.php              Main page. Loads data, then includes header, sections, footer
├── email.php              Standalone "Send me a message" page (used when a form endpoint is set)
├── api/
│   ├── index.php          Vercel entry point → runs ../index.php
│   └── email.php          Vercel entry point → runs ../email.php
├── data/                  Each person's content (JSON)
├── includes/
│   ├── functions.php      Helpers (see above)
│   ├── header.php         <head>, CSS/JS links, logo and nav
│   └── footer.php         Footer text and the shared scripts
├── sections/              One file per page section
├── assets/
│   ├── css/               style.css (base), themes.css, about.css, certificates.css, resume-viewer.css, contact.css
│   ├── js/                See section 5
│   ├── files/             resume-public.pdf
│   └── img/<name>/        certificates/, projects/, img/ (profile + favicon), gifs/
├── Dockerfile             Apache + PHP image (port 10000)
├── vercel.json            Vercel routing and PHP runtime
└── package.json           Project metadata only (no build step)
```

---

## 3. Data files (JSON schema)

Each person has a `data/<name>.json`. The file must be **valid JSON** (double quotes, no trailing commas). If it isn't, the page stops and shows the error message.

### Top level fields

| Field               | Required | Description                                                                                               |
| ------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `site_title`        | Yes      | Text in the browser tab.                                                                                  |
| `name`              | Yes      | Full name. The first word is used for the logo and the "Hello, I'm" text.                                 |
| `title`             | Yes      | Job title or role. It is typed out under the name in the hero.                                            |
| `tagline`           | No       | Short line shown in the hero and under the About photo.                                                   |
| `intro`             | No       | Overrides the hero description. The hero uses the first one found: `intro`, then `tagline`, then `about`. |
| `about`             | Yes      | Bio text. The first sentence is shown larger as a "lead", the rest as normal text.                        |
| `profile_image`     | Yes      | Path to the profile photo.                                                                                |
| `profile_gifs`      | No       | Folder with one GIF per theme (see [Themes](#6-themes)).                                                  |
| `profile_image_alt` | No       | A single alternate image, used only if `profile_gifs` is not set.                                         |
| `favicon`           | No       | Path to the `.ico` file for the browser tab.                                                              |
| `resume`            | No       | Path to the resume PDF. Defaults to `assets/files/resume-public.pdf`.                                     |
| `skills`            | Yes      | List of skill names (strings).                                                                            |
| `facts`             | No       | List of highlight tiles (see below).                                                                      |
| `projects`          | No       | List of projects (see below).                                                                             |
| `certificates`      | No       | List of certificates (see below).                                                                         |
| `contact`           | Yes      | Contact links (see below).                                                                                |

### `facts` item

```json
{
  "icon": "fa-solid fa-code",
  "title": "C++ and Java",
  "text": "Solid programming foundation"
}
```

`icon` is any [Font Awesome 6](https://fontawesome.com/icons) class string. The first fact sits beside the number tiles; the rest are shown as wide tiles.

### `projects` item

```json
{
  "title": "Moodoro",
  "description": "What the project does.",
  "image": "assets/img/jed/projects/Moodoro.png",
  "tech": ["HTML", "CSS", "Node.js"],
  "link": "https://example.com",
  "demo": "https://example.com/demo",
  "github": "https://github.com/you/repo"
}
```

| Field                           | Notes                                                   |
| ------------------------------- | ------------------------------------------------------- |
| `title`, `description`, `image` | Shown on the card.                                      |
| `tech`                          | Shown as small tags.                                    |
| `link`                          | Used for the "Live Demo" button and the play icon.      |
| `demo`                          | **Optional.** If present, it is used instead of `link`. |
| `github`                        | **Optional.** Adds a GitHub button.                     |

If a project has neither `demo`/`link` nor `github`, the card shows no buttons.

### `certificates` item

```json
{
  "title": "AI Class ASEAN",
  "issuer": "ASEAN Foundation",
  "date": "April 24, 2026",
  "image": [
    "assets/img/jed/certificates/AseanAI1.jpg",
    "assets/img/jed/certificates/AseanAI2.jpg"
  ],
  "link": "https://verify.example.com/abc",
  "linkLabel": "View credential"
}
```

| Field       | Notes                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `image`     | Either **one path (string)** or **a list of paths**. A list adds previous/next buttons on the card.  |
| `issuer`    | Used for the badge and the filter chips. The filter only appears when there is more than one issuer. |
| `link`      | Optional. Shows a "Verify" button (or your `linkLabel` text).                                        |
| `linkLabel` | Optional custom text for the button.                                                                 |

### `contact`

| Field                   | Notes                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| `email`                 | Used for the mailto fallback and the resume request fallback.       |
| `github`, `linkedin`    | Always shown as buttons.                                            |
| `facebook`, `instagram` | Optional. The button only appears if the value is not empty.        |
| `form_endpoint`         | Formspree URL. If empty, the Email button becomes a `mailto:` link. |

---

## 4. Page sections

`index.php` includes the sections in this order. Each file reads from `$data` and is shared by both people.

| File                        | Section      | What it does                                                                                                                                                                         |
| --------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sections/hero.php`         | Home         | Typewriter text (name, then title), tagline, **Choose theme** and **View Resume** buttons, and the profile photo that swaps to a GIF on interaction. Also includes the resume modal. |
| `sections/about.php`        | About        | A "bento" grid: photo, bio, skills with logos, numbers that count up (skills, projects, certificates), and fact tiles. The counts update automatically from the JSON.                |
| `sections/projects.php`     | Projects     | A Netflix style automatically scrolling row of cards that you can drag. The list is repeated to fill the row and doubled for a seamless loop.                                        |
| `sections/certificates.php` | Certificates | A 3D carousel with an issuer filter, a scrolling text ticker, autoplay, and a full size image viewer (lightbox).                                                                     |
| `sections/contact.php`      | Contact      | Buttons for Email, GitHub, LinkedIn, and optionally Facebook and Instagram.                                                                                                          |
| `sections/resume-modal.php` | (Popup)      | The resume preview and the "Request full resume" form.                                                                                                                               |

### Skill icons

`about.php` maps skill names to [Devicon](https://devicon.dev) logos (HTML, CSS, JavaScript, PHP, MySQL, SQLite, React, Node.js, Express.js, Git, Laravel, C++, Java, Python). Matching ignores uppercase and lowercase. Any skill that is not in the list gets a generic code icon. To add one, add an entry to the `$devicon` array in `about.php`.

---

## 5. JavaScript files

All files are plain JavaScript (no build step). They are loaded in `header.php` or `footer.php`.

| File               | Loaded in                      | Purpose                                                                                 |
| ------------------ | ------------------------------ | --------------------------------------------------------------------------------------- |
| `theme.js`         | header (defer)                 | Theme list, theme menu, saving the choice, and switching the profile GIFs.              |
| `about.js`         | header (defer)                 | About section effects: reveal on scroll and numbers that count up (uses GSAP).          |
| `main.js`          | footer                         | Mobile menu, highlighting the active nav link, and submitting the contact form.         |
| `hero.js`          | footer                         | Typewriter effect with a glow wave across the letters.                                  |
| `resume-viewer.js` | footer                         | Resume popup: loads PDF.js, draws pages with a watermark, and handles the request form. |
| `header.js`        | footer                         | Letter animation for the logo.                                                          |
| `projects.js`      | footer                         | Automatic scrolling, drag, and hover zoom for the project cards.                        |
| `certificates.js`  | after the Certificates section | The 3D carousel, filter, autoplay, lightbox, and confetti.                              |

Most scripts check that their elements exist before running, and respect the visitor's **reduced motion** setting by skipping animations.

---

## 6. Themes

There are five themes: **Daybreak** (light, default), **Nightfall**, **Strawberry**, **Lavender**, and **Sunset**.

### How switching works

1. The visitor picks a theme from the **Choose theme** menu.
2. `theme.js` sets `data-theme="<id>"` on the `<html>` element and saves the id in `localStorage` under the key `theme`.
3. `themes.css` defines a block of CSS variables for each `:root[data-theme="<id>"]`, so every color on the page changes at once.
4. A tiny script at the top of `header.php` applies the saved theme again **before the page paints**, so there is no flash of the light theme.
5. The profile GIFs change to match the theme (`<profile_gifs>/<theme-gif>`).

The light theme is the default and has no `data-theme` attribute.

### Required GIFs

Each person's `gifs/` folder needs one file per theme:

```
daybreak.gif   nightfall.gif   strawberry.gif   lavender.gif   sunset.gif
```

If one is missing, the code logs a warning in the browser console and falls back to `daybreak.gif`.

### Adding a new theme

1. In `assets/js/theme.js`, add an entry to the `THEMES` list:
   ```js
   { id: "ocean", label: "Ocean", gif: "ocean.gif", colors: ["#EAF6FF", "#2A7FBA"] }
   ```
   `colors` are the small swatches shown in the menu.
2. In `assets/css/themes.css`, add a block that sets the same variables as the other themes:
   ```css
   :root[data-theme="ocean"] {
     --color-bg: ...;
     --color-surface: ...;
     --color-text: ...;
     /* copy the full variable list from an existing theme */
   }
   ```
3. Add `ocean.gif` to **both** `assets/img/jed/gifs/` and `assets/img/christine/gifs/`.

---

## 7. Resume viewer

The **View Resume** button opens a popup with a view only preview of the PDF.

- The PDF is drawn page by page onto a canvas using **PDF.js**. The library is loaded **only when someone opens the viewer**, which keeps the page fast.
- A watermark with the person's name and the words "Public copy" is painted into the canvas image, so it cannot be removed by deleting an element in the browser's dev tools.
- The popup includes a **Request full resume** form. It sends the visitor's name, email, and reason to the form endpoint with a subject that starts with "Full resume request" followed by the person's name.
- The file shown is `resume` in the data file, or `assets/files/resume-public.pdf` by default. This should be a **public copy** with personal details removed.

> **Important:** the viewer only discourages casual saving and printing. A visitor can still download the PDF file directly if they know its path, and screenshots cannot be stopped. Never put private information in the public resume file.

---

## 8. Contact form

Both the contact page (`email.php`) and the resume request form post to **Formspree**.

- The endpoint comes from `contact.form_endpoint` in the data file.
- If it is **empty**, the site shows `mailto:` links instead, so the buttons still work.
- Forms are submitted with `fetch()` from `main.js` and `resume-viewer.js`, and the result is shown in a status message.
- Each form has a hidden `_gotcha` field. Real visitors never see or fill it, but spam bots do, so Formspree can discard those messages.
- Each person has their **own** Formspree form, so messages go to the right inbox.

---

## 9. Deployment

### Clean links without `?user=`

For a real deployment you don't need `?user=` in the link. Set the default user to the owner of that site, and the plain address shows their portfolio.

In `includes/functions.php`, change `DEFAULT_USER`:

```php
const DEFAULT_USER  = 'christine';   // was 'jed'
```

What happens after this change:

- `https://your-site.com/` shows Christine's portfolio.
- The nav links, the Email button, and the "Back to portfolio" link only add `?user=` when the person is **not** the default, so they stay clean too.
- `?user=jed` still works if you want to preview the other portfolio, because Jed is still in `ALLOWED_USERS`.
- Anyone who is not in `ALLOWED_USERS` still falls back to the default.

Each of you can deploy your own copy with your own name as the default. Keep both names in `ALLOWED_USERS` if you want to be able to preview either one.

### Vercel

`vercel.json` sets up the following:

- `api/*.php` files run with the `vercel-php` runtime.
- `/assets/...` is served as static files.
- `/email.php` is routed to `api/email.php`.
- Every other path is routed to `api/index.php`.

The files in `api/` just change into the project root and include the real page, so the code in `index.php` and `email.php` works the same locally and on Vercel. There is no build or install step.

### Docker

The `Dockerfile` uses `php:8.4-apache`, copies the project into `/var/www/html`, and changes Apache to listen on **port 10000** (this port works with hosts like Render).

```bash
docker build -t shared-portfolio .
docker run -p 10000:10000 shared-portfolio
```

`.dockerignore` keeps `.git`, `node_modules`, zip files, and `.env` files out of the image.

### External services the page depends on

The page loads these from the internet, so visitors need a connection for them to work: Google Fonts, Font Awesome, Devicon, GSAP, ScrollTrigger, canvas-confetti, and PDF.js (only when the resume viewer is opened).

---

## 10. Common tasks

### Add a project

1. Put the screenshot in `assets/img/<name>/projects/`.
2. Add an object to `projects` in `data/<name>.json` (see the [schema](#projects-item)).
3. Refresh. The About counter and project row update automatically.

### Add a certificate

1. Put the image(s) in `assets/img/<name>/certificates/`.
2. Add an object to `certificates` in `data/<name>.json`.
3. If you use a new `issuer` name, a new filter chip appears on its own.

### Change the resume

Replace `assets/files/resume-public.pdf`, or set a different `resume` path in your data file. For separate resumes, put each in `assets/files/` and set `resume` for each person.

### Change a skill's icon

Edit the `$devicon` (or `$faIcons`) array at the top of `sections/about.php`.

### Deploy one person's portfolio on a clean link

Change `DEFAULT_USER` in `includes/functions.php` to that person's name (see [section 9](#9-deployment)). The site then works at the plain address with no `?user=`.

### Add a third person

1. Add the name to `ALLOWED_USERS` in `includes/functions.php`.
2. Copy `data/jed.json` to `data/<name>.json` and edit it.
3. Create `assets/img/<name>/` with `certificates/`, `projects/`, `img/` (profile and favicon), and `gifs/` (five theme GIFs).
4. Create a Formspree form and set its URL in `contact.form_endpoint`.

---

## 11. Conventions and gotchas

- **Always escape output.** Print values with `<?= e($value) ?>`, never `<?= $value ?>`.
- **File paths are relative to the site root** (for example `assets/img/jed/img/profile.jpg`), not to the JSON file.
- **Keep file names when replacing images**, or update the path in the data file.
- **Cache busting.** Some scripts are linked with a version, like `header.js?v=3`. When you edit one of these files and visitors don't see the change, increase the number.
- **Script order matters.** `certificates.js` runs after the Certificates section and waits for `DOMContentLoaded` because the libraries it uses are loaded with `defer`.
- **Theme code lives in two places.** The small script at the top of `header.php` and `theme.js` both read the `theme` key from `localStorage`. If you rename the key, change it in both.
- **Shared files affect both people.** Anything in `sections/`, `includes/`, and `assets/css`/`assets/js` changes both portfolios. Change `data/` and `assets/img/<name>/` for one person only.
- **Optional fields can be left out.** The code uses defaults for optional fields such as `resume`, `facebook`, `instagram`, `demo`, and `github`.

---

## 12. Troubleshooting

| Problem                                      | Likely cause and fix                                                                                                       |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Page shows `Missing data/<name>.json`        | The JSON file doesn't exist for that name. Check the file name and `ALLOWED_USERS`.                                        |
| Page shows `... has invalid JSON: <message>` | A syntax error in the data file, usually a missing comma or an extra trailing comma. Paste the file into a JSON validator. |
| `?user=someone` shows Jed's portfolio        | `someone` isn't in `ALLOWED_USERS`, so the default is used.                                                                |
| The plain link shows the wrong person        | `DEFAULT_USER` in `includes/functions.php` is set to the other name. Change it to the owner of the site.                   |
| An image doesn't show                        | Check the path and the exact file name and capitalization. Paths are case sensitive on most servers.                       |
| Console says "Theme gif not found"           | A GIF for that theme is missing from `assets/img/<name>/gifs/`.                                                            |
| Resume popup stays on "Loading resume..."    | The PDF path is wrong, or PDF.js could not load (no internet or the CDN is blocked).                                       |
| Contact form doesn't send                    | `form_endpoint` is empty or wrong, or the Formspree form isn't confirmed.                                                  |
| Style or script changes don't appear         | The browser cached the old file. Hard refresh, or raise the `?v=` number.                                                  |
| Works locally but not on Vercel              | Check that `vercel.json` and the `api/` folder are included in the deployment.                                             |
