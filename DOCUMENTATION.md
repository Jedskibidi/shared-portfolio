# Shared Portfolio: Developer Documentation

This guide explains **how the project works** and **how to change it**. For a quick overview and setup steps, see the [README](./README.md).

## Contents

1. [How it works](#1-how-it-works)
2. [Folder reference](#2-folder-reference)
3. [Data files (JSON schema)](#3-data-files-json-schema)
4. [Page sections](#4-page-sections)
5. [JavaScript files](#5-javascript-files)
6. [Page loader and animations](#6-page-loader-and-animations)
7. [Themes](#7-themes)
8. [Resume viewer](#8-resume-viewer)
9. [Contact form](#9-contact-form)
10. [Deployment](#10-deployment)
11. [Common tasks](#11-common-tasks)
12. [Conventions and gotchas](#12-conventions-and-gotchas)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. How it works

The site has **one set of pages** and **one set of content per person**. The user value in the URL decides whose content is shown.

```
Browser requests  /?user=name
        │
        ▼
index.php
  1. current_user()   → reads ?user=, checks it against ALLOWED_USERS,
                        falls back to DEFAULT_USER
  2. load_content()   → reads data/your.json into the $data array
  3. includes header.php, then each section, then footer.php
        │
        ▼
Every file receives the same $data array and prints from it.
```

Key points:

- **PHP builds the HTML on the server.** Each section reads values from \$data and prints them (always through e(), which escapes text so it is safe in HTML).
- **JavaScript adds behavior** after the page loads: the loader, animations, the theme switcher, the carousel, the resume viewer, and form submission.
- **Nothing is stored in a database.** All content comes from data/\<name>.json.
- An unknown or missing ?user= value falls back to the default person, so visitors never see an error page.

### Helper functions (includes/functions.php)

| Name                 | What it does                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ALLOWED_USERS        | List of valid portfolio names. A person must be listed here to be shown.                                         |
| DEFAULT_USER         | Who is shown when ?user= is missing or invalid. Set it to the owner of the site.                                 |
| e(\$value)           | Escapes text with htmlspecialchars. Use it for **every** value printed into HTML.                                |
| current_user()       | Returns the validated, lowercase user name.                                                                      |
| load_content(\$user) | Reads and decodes data/\<user>.json. Stops with a clear message if the file is missing or contains invalid JSON. |

---

## 2. Folder reference

```
shared-portfolio/
├── index.php              Main page. Loads data, then includes header, sections, footer
├── email.php              Standalone "Send me a message" page (used when a form endpoint is set)
├── api/
│   ├── index.php          Vercel entry point → runs ../index.php
│   └── email.php          Vercel entry point → runs ../email.php
├── cache/                 GitHub graph cache (created automatically)
├── data/
│   ├── template.json      Starting point for a new person (the only data file in Git)
│   └── <name>.json        Each person's content (ignored by Git)
├── includes/
│   ├── functions.php      Helpers (see above)
│   ├── header.php         <head>, CSS/JS links, page loader markup, logo and nav
│   └── footer.php         Footer text and the shared scripts
├── sections/              One file per page section (see section 4)
├── assets/
│   ├── css/               style.css (base), themes.css, about.css, scroll-replay.css,
│   │                      loader.css, certificates.css, resume-viewer.css, contact.css
│   ├── js/                See section 5
│   ├── files/             resume-public.pdf
│   └── img/<name>/        certificates/, projects/, img/ (profile, favicon, school images), gifs/
├── Dockerfile             Apache + PHP image (port 10000)
├── vercel.json            Vercel routing and PHP runtime
└── package.json           Project metadata only (no build step)
```

---

## 3. Data files (JSON schema)

Each person has a data/\<name>.json. Copy data/template.json to start; it contains every field below with placeholder values. The file must be **valid JSON** (double quotes, no trailing commas). If it isn't, the page stops and shows the error message.

Data files are ignored by Git, so see [Deployment](#10-deployment) for what that means when you publish the site.

### Top level fields

| Field              | Required | Description                                                                                                     |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------- |
| site_title         | Yes      | Text in the browser tab.                                                                                        |
| name               | Yes      | Full name. The first word is used for the logo and the loader.                                                  |
| title              | Yes      | Job title or role. It is typed out after the name in the hero.                                                  |
| tagline            | No       | Short line shown in the hero. Also shown under the About photo in the standard About layout.                    |
| intro              | No       | Overrides the hero description. The hero uses the first one found: intro, then tagline, then about.             |
| about              | Yes      | Bio text. In the standard About layout the first sentence is shown larger as a "lead", the rest as normal text. |
| about_intro        | No       | Switches the About section to the compact layout (see below).                                                   |
| profile_image      | Yes      | Path to the profile photo.                                                                                      |
| profile_gifs       | No       | Folder with one GIF per theme (see [Themes](#7-themes)).                                                        |
| profile_image_alt  | No       | A single alternate image for the hero, used only if profile_gifs is not set.                                    |
| favicon            | No       | Path to the .ico file for the browser tab.                                                                      |
| resume             | No       | Path to the resume PDF. Defaults to assets/files/resume-public.pdf.                                             |
| skills             | No       | List of skill names (strings).                                                                                  |
| education          | No       | List of schools (see below).                                                                                    |
| facts              | No       | List of highlight tiles (see below).                                                                            |
| projects           | No       | List of projects (see below).                                                                                   |
| certificates       | No       | List of certificates (see below).                                                                               |
| spotify_playlist   | No       | Link to a public Spotify playlist.                                                                              |
| spotify_intro      | No       | Text for the playlist card (see below).                                                                         |
| github_graph_color | No       | Hex color for the GitHub graph, for example 40c463.                                                             |
| contact            | Yes      | Contact links (see below).                                                                                      |

### about_intro and the two About layouts

The About section has two layouts, chosen by whether about_intro.headline is set.

|                                               | Standard (no about_intro.headline)                                         | Compact (about_intro.headline set)         |
| --------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------ |
| Top of the section                            | Name, role, and the bio from about split into a lead sentence and the rest | The headline, then about_intro.description |
| Under the photo                               | tagline                                                                    | Nothing                                    |
| Quick facts (facts)                           | Shown                                                                      | Hidden                                     |
| "View projects" and "View certificates" links | Shown                                                                      | Hidden                                     |
| Availability line                             | Not shown                                                                  | about_intro.availability (optional)        |

```json
"about_intro": {
  "headline": "One sentence that sums up who you are.",
  "description": "One short line about the tools you work with.",
  "availability": "Open to opportunities"
}
```

### education item

```json
{
  "school": "School Name",
  "program": "Program or Degree",
  "years": "2020 - 2024",
  "location": "City, Province",
  "logo": "assets/img/name/img/school-logo.png",
  "image": "assets/img/name/img/diploma.jpg",
  "summary": "A short summary of the program.",
  "highlights": ["First highlight", "Second highlight"]
}
```

Each item becomes a card with a **Show details** button. The button opens a popup with the summary, the highlights, and the image, which can be opened full screen. logo and image only appear if the file exists.

### facts item

```json
{
  "icon": "fa-solid fa-code",
  "title": "Fact title",
  "text": "One short line about this fact"
}
```

icon is any [Font Awesome 6](https://fontawesome.com/icons) class string. It defaults to a star if left out. Facts are only shown in the standard About layout.

### projects item

```json
{
  "title": "Project Name",
  "description": "What the project does.",
  "image": "assets/img/name/projects/project-1.jpg",
  "tech": ["HTML", "CSS", "Node.js"],
  "link": "https://example.com",
  "demo": "https://example.com/demo",
  "github": "https://github.com/you/repo"
}
```

| Field                     | Notes                                                 |
| ------------------------- | ----------------------------------------------------- |
| title, description, image | Shown on the card.                                    |
| tech                      | Shown as small tags.                                  |
| link                      | Used for the "Live Demo" button and the play icon.    |
| demo                      | **Optional.** If present, it is used instead of link. |
| github                    | **Optional.** Adds a GitHub button.                   |

If a project has neither demo/link nor github, the card shows no buttons.

### certificates item

```json
{
  "title": "Certificate Title",
  "issuer": "Issuer Name",
  "date": "Month DD, YYYY",
  "image": [
    "assets/img/name/certificates/certificate-page-1.jpg",
    "assets/img/name/certificates/certificate-page-2.jpg"
  ],
  "link": "https://verify.example.com/abc",
  "linkLabel": "View credential"
}
```

| Field     | Notes                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------- |
| image     | Either **one path (string)** or **a list of paths**. A list adds previous/next buttons on the card.  |
| issuer    | Used for the badge and the filter chips. The filter only appears when there is more than one issuer. |
| link      | Optional. Shows a "Verify" button (or your linkLabel text).                                          |
| linkLabel | Optional custom text for the button.                                                                 |

### spotify_playlist and spotify_intro

spotify_playlist must be a link to a **public** playlist, like https://open.spotify.com/playlist/\<id>. If it is empty or doesn't look like a playlist link, the card is not shown.

```json
"spotify_intro": {
  "headline": "First line of the intro.",
  "accent": "Second line, shown in the accent color.",
  "text": "One or two sentences about the playlist.",
  "button": "Open on Spotify"
}
```

Every part of spotify_intro is optional. The button text defaults to "Open on Spotify".

### contact

| Field               | Notes                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| email               | Used for the mailto fallback and the resume request fallback.                                   |
| github, linkedin    | Always shown as buttons. The GitHub username in github is also used for the contribution graph. |
| facebook, instagram | Optional. The button only appears if the value is not empty.                                    |
| form_endpoint       | Formspree URL. If empty, the Email button becomes a mailto: link.                               |

---

## 4. Page sections

index.php includes the sections in this order. Each file reads from \$data and is shared by every portfolio.

| File                       | Section      | What it does                                                                                                                                                                                    |
| -------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sections/hero.php          | Home         | Typewriter text (name, then title), description, **Choose theme** and **View Resume** buttons, and the profile photo that swaps to a theme GIF on hover or tap. Also includes the resume modal. |
| sections/about.php         | About        | Intro and profile photo, quick facts, skill chips, then the GitHub card, the education cards, and the Spotify card. Layout depends on about_intro (see section 3).                              |
| sections/about-github.php  | About (part) | GitHub contribution graph (see below). Included by about.php.                                                                                                                                   |
| sections/about-spotify.php | About (part) | Playlist card with an intro and the Spotify player. Included by about.php.                                                                                                                      |
| sections/projects.php      | Projects     | An automatically scrolling row of cards that you can drag. The list is repeated to fill the row and doubled for a seamless loop.                                                                |
| sections/certificates.php  | Certificates | A 3D carousel with an issuer filter, a scrolling text strip, autoplay, and a full size image viewer (lightbox).                                                                                 |
| sections/contact.php       | Contact      | Buttons for Email, GitHub, LinkedIn, and optionally Facebook and Instagram.                                                                                                                     |
| sections/resume-modal.php  | (Popup)      | The resume preview and the "Request full resume" form.                                                                                                                                          |

### Skill icons

about.php maps skill names to [Devicon](https://devicon.dev) logos (HTML, CSS, JavaScript, PHP, MySQL, SQLite, React, Node.js, Express.js, Git, Laravel, C++, Java, Python) in the \$devicons array. Matching ignores uppercase and lowercase. A few skills use Font Awesome icons from the \$skillIcons array, and any skill that is not in either list gets a generic code icon. To add one, add an entry to one of those arrays.

### GitHub card

- The username comes from contact.github. If it isn't a valid GitHub link, the card is not shown.
- The contribution data comes from a public API (github-contributions-api.jogruber.de) and is fetched on the server.
- The result is cached for **6 hours** in cache/github-\<username>-last.json. If the API fails, the last saved copy is used. If there is no saved copy either, a plain graph image is shown instead.
- The graph is drawn as an inline SVG in the theme's text color. Set github_graph_color to change the shade of green.
- The cache/ folder is created automatically. On hosts where the folder can't be written, nothing is cached and the data is fetched on every page load.

### Spotify card

- The player is Spotify's own embed in an iframe, loaded lazily, with no autoplay. Its inner colors belong to Spotify and can't be changed.
- On phones the player is shortened to Spotify's compact size.

---

## 5. JavaScript files

All files are plain JavaScript (no build step).

| File               | Loaded in                                               | Purpose                                                                                                                                    |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| theme.js           | header (defer)                                          | Theme list, theme menu, saving the choice, and switching the profile GIFs.                                                                 |
| scroll-replay.js   | header (defer)                                          | Reveal animations that replay each time an element comes back into view.                                                                   |
| loader.js          | header (defer), only when the page sets \$showLoader    | Page loader counter and the reveal that follows (see section 6).                                                                           |
| about-education.js | about.php (defer), only when there is an education list | Tilt effect on the education cards, the details popups, and the full screen image.                                                         |
| certificates.js    | index.php, after the Certificates section               | The 3D carousel, filter, autoplay, lightbox, and confetti.                                                                                 |
| main.js            | footer                                                  | Mobile menu, highlighting the active nav link, the certificate overlay, contact form submission, and the circular transition to email.php. |
| hero.js            | footer                                                  | Typewriter effect with a glow wave across the letters, and the hover swap for the profile photo.                                           |
| resume-viewer.js   | footer                                                  | Resume popup: loads PDF.js, draws pages with a watermark, and handles the request form.                                                    |
| header.js          | footer                                                  | Letter animation for the logo and nav link locking while the page scrolls to a section.                                                    |
| projects.js        | footer                                                  | Automatic scrolling, drag, and hover zoom for the project cards.                                                                           |

assets/js/about.js is an older About reveal script that is no longer loaded. scroll-replay.js has replaced it.

Most scripts check that their elements exist before running, and respect the visitor's **reduced motion** setting by skipping animations.

### Scroll replay

scroll-replay.js and scroll-replay.css handle most of the entrance animations.

- The REPLAY_SECTIONS list at the top of scroll-replay.js says which elements animate. The About section and its parts are listed there. To animate a new About element, add its class to a targets list.
- Outside of About, add a data-replay attribute to any element: no value slides it up, and fade, zoom, left and right pick another effect.
- REPLAY_MODE decides when animations replay: "both" (scrolling down and up), "down", or "up".
- The About parts also use classes in about.css (such as about-enter).

---

## 6. Page loader and animations

### Page loader

When the main page opens, a full screen loader shows the person's first name, a progress bar, and a counter from 0 to 100%. It is built from three pieces:

- index.php sets \$showLoader = true before including header.php. header.php only prints the loader when that is set, so email.php is not affected.
- A small inline script in header.php adds the class is-loading to \<html> right away, so the page never flashes before the loader. It is skipped when the visitor prefers reduced motion, so those visitors never see the loader.
- loader.css styles the loader, and loader.js runs it.

How loader.js behaves:

- The counter is **timed, not real progress**. The STEPS list sets it: fast to 30%, a short pause, then a quick finish.
- While the counter pauses, the loader shows a small spinner and a shimmering bar.
- The counter holds at 99% until the browser's load event, so the loader never closes before the page is ready.
- MAX_WAIT_MS (7 seconds) makes it give up waiting so nobody gets stuck. If JavaScript fails completely, loader.css hides the loader and unlocks scrolling after 8 seconds.
- When it finishes, the loader fades out (FADE_MS), the class is-revealing is added to \<html> for REVEAL_MS, and a page-loader:done event is fired on document.

### Reveal after the loader

While is-revealing is on \<html>, loader.css plays the entrance:

- The logo and the hero text slide in from the left, and the nav and the hero photo slide in from the right.
- On phone widths the hero rises from below instead, and the burger button slides in from the right.

If you make these animations longer, raise REVEAL_MS in loader.js too. The class is removed after that time, and a longer animation would be cut off.

### Mobile menu

On narrow screens the nav becomes a dropdown. main.js toggles the open class on the nav and the is-open class on the burger button, and keeps aria-expanded up to date. The three lines of the burger morph into an X, and the menu slides and fades in. The menu is hidden with max-height, opacity and visibility (not display: none) so it can animate. If the menu ever needs to be taller than 24rem, raise max-height in the .site-header #nav.open rule in style.css.

### Reduced motion

Every animation described here is turned off for visitors who ask their device to reduce motion. The reduced motion rules live at the end of style.css, in the animation CSS files, and in the scripts themselves.

---

## 7. Themes

There are five themes: **Daybreak** (light, default), **Nightfall**, **Strawberry**, **Lavender**, and **Sunset**.

### How switching works

1. The visitor picks a theme from the **Choose theme** menu.
2. theme.js sets data-theme="\<id>" on the \<html> element and saves the id in localStorage under the key theme.
3. themes.css defines a block of CSS variables for each :root\[data-theme="\<id>"\], so every color on the page changes at once.
4. A tiny script at the top of header.php applies the saved theme again **before the page paints**, so there is no flash of the light theme.
5. The profile GIFs change to match the theme (\<profile_gifs>/\<theme-gif>).

The light theme (id light) is the default and has no data-theme attribute. All colors come from CSS variables, so new sections should use them (--color-bg, --color-surface, --color-text, --color-text-muted, --color-accent, --color-primary, --color-border) instead of fixed colors.

### Required GIFs

Each person's gifs/ folder needs one file per theme:

```
daybreak.gif   nightfall.gif   strawberry.gif   lavender.gif   sunset.gif
```

If one is missing, the code logs a warning in the browser console and falls back to daybreak.gif.

### Adding a new theme

1. In assets/js/theme.js, add an entry to the THEMES list:
   ```js
   { id: "ocean", label: "Ocean", gif: "ocean.gif", colors: ["#EAF6FF", "#2A7FBA"] }
   ```
   colors are the small swatches shown in the menu.
2. In assets/css/themes.css, add a block that sets the same variables as the other themes:
   ```css
   :root[data-theme="ocean"] {
     --color-bg: ...;
     --color-surface: ...;
     --color-text: ...;
     /* copy the full variable list from an existing theme */
   }
   ```
3. Add ocean.gif to the gifs/ folder of **every** person.

---

## 8. Resume viewer

The **View Resume** button opens a popup with a view only preview of the PDF.

- The PDF is drawn page by page onto a canvas using **PDF.js**. The library is loaded **only when someone opens the viewer**, which keeps the page fast.
- A watermark with the person's name and the words "Public copy" is painted into the canvas image, so it cannot be removed by deleting an element in the browser's dev tools.
- The popup includes a **Request full resume** form. It sends the visitor's name, email, and reason to the form endpoint with a subject that starts with "Full resume request" followed by the person's name.
- The file shown is resume in the data file, or assets/files/resume-public.pdf by default. This should be a **public copy** with personal details removed.

> **Important:** the viewer only discourages casual saving and printing. A visitor can still download the PDF file directly if they know its path, and screenshots cannot be stopped. Never put private information in the public resume file.

---

## 9. Contact form

Both the contact page (email.php) and the resume request form post to **Formspree**.

- The endpoint comes from contact.form_endpoint in the data file.
- If it is **empty**, the site shows mailto: links instead, so the buttons still work.
- Forms are submitted with fetch() from main.js and resume-viewer.js, and the result is shown in a status message.
- Each form has a hidden \_gotcha field. Real visitors never see or fill it, but spam bots do, so Formspree can discard those messages.
- Each person should have their **own** Formspree form, so messages go to the right inbox.

---

## 10. Deployment

### Your data file and Git

.gitignore contains:

```
data/*.json
!data/template.json
```

So only data/template.json is in the repository, and each person's own data file stays on their computer. This matters when you publish:

- **Vercel (or any host that builds from the Git repository)** will not find data/\<name>.json and the page shows Missing data/\<name>.json. To deploy your own copy, keep it in your own fork or branch and remove the data/\*.json line from .gitignore (or add the file with git add -f data/\<name>.json).
- **Docker** copies the project folder as it is on your computer (COPY . .), so your data file is included as long as it is in the folder when you build.

### Clean links without ?user=

For a real deployment you don't need ?user= in the link. Set the default user to the owner of that site, and the plain address shows their portfolio.

In includes/functions.php, change DEFAULT_USER:

```php
const DEFAULT_USER  = 'user';
```

What happens after this change:

- https://your-site.com/ shows Alex's portfolio.
- The nav links, the Email button, and the "Back to portfolio" link only add ?user= when the person is **not** the default, so they stay clean too.
- ?user=\<name> still works for anyone else listed in ALLOWED_USERS, if their data file is present.
- Anyone who is not in ALLOWED_USERS still falls back to the default.

Each person can deploy their own copy with their own name as the default.

### Vercel

vercel.json sets up the following:

- api/\*.php files run with the vercel-php runtime.
- /assets/... is served as static files.
- /email.php is routed to api/email.php.
- Every other path is routed to api/index.php.

The files in api/ just change into the project root and include the real page, so the code in index.php and email.php works the same locally and on Vercel. There is no build or install step.

### Docker

The Dockerfile uses php:8.4-apache, copies the project into /var/www/html, and changes Apache to listen on **port 10000** (this port works with hosts like Render).

```bash
docker build -t shared-portfolio .
docker run -p 10000:10000 shared-portfolio
```

.dockerignore keeps .git, node_modules, zip files, and .env files out of the image.

### External services the page depends on

The page loads these from the internet, so visitors need a connection for them to work: Google Fonts, Font Awesome, Devicon, GSAP, ScrollTrigger, canvas-confetti, PDF.js (only when the resume viewer is opened), and the Spotify player. The server also needs internet access to fetch the GitHub graph data.

---

## 11. Common tasks

### Add a project

1. Put the screenshot in assets/img/\<name>/projects/.
2. Add an object to projects in data/\<name>.json (see the [schema](#projects-item)).
3. Refresh. The project row updates automatically.

### Add a certificate

1. Put the image(s) in assets/img/\<name>/certificates/.
2. Add an object to certificates in data/\<name>.json.
3. If you use a new issuer name, a new filter chip appears on its own.

### Add a school

1. Put the logo and the diploma or school photo in assets/img/\<name>/img/.
2. Add an object to education in data/\<name>.json (see the [schema](#education-item)).

### Change the playlist

Set spotify_playlist to a public playlist link, and edit spotify_intro for the text. Leave spotify_playlist empty to hide the card.

### Change the resume

Replace assets/files/resume-public.pdf, or set a different resume path in your data file. For separate resumes, put each in assets/files/ and set resume for each person.

### Change a skill's icon

Edit the \$devicons (or \$skillIcons) array at the top of sections/about.php.

### Deploy one person's portfolio on a clean link

Change DEFAULT_USER in includes/functions.php to that person's name (see [section 10](#10-deployment)). The site then works at the plain address with no ?user=.

### Add another person

1. Copy data/template.json to data/\<name>.json and edit it.
2. Create assets/img/\<name>/ with certificates/, projects/, img/ (profile, favicon, and school images), and gifs/ (five theme GIFs). Update the image paths in the JSON file.
3. Add the name to ALLOWED_USERS in includes/functions.php.
4. Create a Formspree form and set its URL in contact.form_endpoint.
5. Visit /?user=\<name>.

---

## 12. Conventions and gotchas

- **Always escape output.** Print values with \<?= e(\$value) ?>, never \<?= \$value ?>.
- **File paths are relative to the site root** (for example assets/img/name/img/profile.jpg), not to the JSON file.
- **Missing images are hidden, not broken.** The About photo, the school logo, and the school image are only shown when the file exists. If the profile photo is missing, the About section shows the person's initials instead.
- **Keep file names when replacing images**, or update the path in the data file.
- **Cache busting.** Some scripts are linked with a version, like header.js?v=3. When you edit one of these files and visitors don't see the change, increase the number.
- **Script order matters.** certificates.js runs after the Certificates section and waits for DOMContentLoaded because the libraries it uses are loaded with defer.
- **Theme code lives in two places.** The small script at the top of header.php and theme.js both read the theme key from localStorage. If you rename the key, change it in both.
- **Shared files affect everyone.** Anything in sections/, includes/, and assets/css/assets/js changes every portfolio. Change data/ and assets/img/\<name>/ for one person only.
- **Optional fields can be left out.** The code uses defaults for optional fields such as resume, facebook, instagram, demo, github, education, and the Spotify fields.
- **File headers.** Every PHP, JS, and CSS file starts with a short header block (@file, @path, @summary). Keep it up to date when you change what a file does.

---

## 13. Troubleshooting

| Problem                                             | Likely cause and fix                                                                                                                                                                                            |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page shows Missing data/\<name>.json                | The JSON file doesn't exist for that name. Copy data/template.json, check the file name, and check ALLOWED_USERS. On a deployment, the data file is probably ignored by Git (see [section 10](#10-deployment)). |
| Page shows ... has invalid JSON: \<message>         | A syntax error in the data file, usually a missing comma or an extra trailing comma. Paste the file into a JSON validator.                                                                                      |
| ?user=someone shows the default portfolio           | someone isn't in ALLOWED_USERS, so the default is used.                                                                                                                                                         |
| The plain link shows the wrong person               | DEFAULT_USER in includes/functions.php is set to a different name. Change it to the owner of the site.                                                                                                          |
| An image doesn't show                               | Check the path and the exact file name and capitalization. Paths are case sensitive on most servers.                                                                                                            |
| The About section shows initials instead of a photo | The file in profile_image doesn't exist at that path.                                                                                                                                                           |
| Console says "Theme gif not found"                  | A GIF for that theme is missing from assets/img/\<name>/gifs/.                                                                                                                                                  |
| The Spotify card is missing                         | spotify_playlist is empty, or isn't a link to a public playlist.                                                                                                                                                |
| The GitHub card is missing or shows a plain image   | The username in contact.github is invalid, or the API couldn't be reached and there is no saved copy in cache/.                                                                                                 |
| The loader never shows                              | The visitor prefers reduced motion, or \$showLoader isn't set on that page.                                                                                                                                     |
| The reveal after the loader looks cut off           | An animation in loader.css is longer than REVEAL_MS in loader.js. Raise REVEAL_MS.                                                                                                                              |
| Resume popup stays on "Loading resume..."           | The PDF path is wrong, or PDF.js could not load (no internet or the CDN is blocked).                                                                                                                            |
| Contact form doesn't send                           | form_endpoint is empty or wrong, or the Formspree form isn't confirmed.                                                                                                                                         |
| Style or script changes don't appear                | The browser cached the old file. Hard refresh, or raise the ?v= number.                                                                                                                                         |
| Works locally but not on Vercel                     | Check that vercel.json and the api/ folder are included in the deployment, and that your data file is part of the deployment.                                                                                   |
