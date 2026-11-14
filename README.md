# Shared Portfolio

A themeable portfolio website built with HTML, CSS, JavaScript, and PHP. One design, any number of people: each person's content lives in its own JSON file, so the site renders a different portfolio depending on the `?user=` parameter in the URL.

> **Status: alpha.** The layout, sections, and animations are in place, but details may still change.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Run Locally](#run-locally)
- [Where to Edit](#where-to-edit)
- [Your Data File and Git](#your-data-file-and-git)
- [Adding Another Person](#adding-another-person)
- [Deployment](#deployment)
- [Setting Up the Contact Form](#setting-up-the-contact-form)
- [Documentation](#documentation)

All portfolios share the same layout, styling, and code. Each person's content (text, projects, certificates, images) lives in its own data file in the `data/` folder, and `data/template.json` is the starting point for a new one.

## Features

- **Many portfolios, one codebase.** Switch between them with `?user=<name>`.
- **Driven by content.** Everything on the page comes from a JSON file, so there is no need to touch the HTML to update your info.
- **Five color themes.** Daybreak, Nightfall, Strawberry, Lavender, and Sunset, each with its own animated GIF. The chosen theme is remembered between visits.
- **Page loader.** A short loading screen with a progress counter, followed by the header and hero sliding in from the left and right.
- **Hero.** Typewriter greeting and a profile photo that swaps to a theme GIF on hover.
- **About.** Intro and availability, skills, quick facts, education cards with details popups, a GitHub contribution graph, and a Spotify playlist card.
- **Projects.** A draggable film strip of project cards with live demo and GitHub links.
- **Certificates.** A 3D carousel with an issuer filter, multi-page certificates, a lightbox, and optional verify links.
- **Contact.** Email, GitHub, LinkedIn, and optional Facebook and Instagram buttons.
- **Resume viewer.** A view-only PDF preview inside the page with a "Request full resume" form for visitors who want the complete version.
- **Contact form.** Messages are sent through [Formspree](https://formspree.io), with a mailto fallback if no form endpoint is set.
- **Animations.** Scroll effects that replay when a section comes back into view, an animated burger menu on mobile, and a bit of confetti. All motion is turned off for visitors who prefer reduced motion.

## Tech Stack

| Area            | Tools                                                                       |
| --------------- | --------------------------------------------------------------------------- |
| Backend         | PHP 8.4                                                                     |
| Frontend        | HTML, CSS, vanilla JavaScript                                               |
| Libraries (CDN) | GSAP + ScrollTrigger, canvas-confetti, PDF.js, Font Awesome, Devicon        |
| Fonts           | Nunito, Quicksand (Google Fonts)                                            |
| Integrations    | Formspree (forms), Spotify embed, GitHub contributions API (public, cached) |
| Deployment      | Vercel (`vercel-php`) or Docker (Apache)                                    |

## Project Structure

```
shared-portfolio/
├── index.php            # Main page: loads user data and includes the sections
├── email.php            # Standalone "Send me a message" page
├── api/                 # Entry points used by Vercel
├── cache/               # GitHub graph cache, created automatically
├── data/
│   ├── template.json    # Starting point for a new person
│   └── <name>.json      # Your content (not committed to Git)
├── sections/            # Page sections shared by all portfolios
│   ├── hero.php
│   ├── about.php
│   ├── about-github.php
│   ├── about-spotify.php
│   ├── projects.php
│   ├── certificates.php
│   ├── contact.php
│   └── resume-modal.php
├── includes/
│   ├── functions.php    # ALLOWED_USERS, DEFAULT_USER, current_user(), load_content()
│   ├── header.php
│   └── footer.php
├── assets/
│   ├── css/             # Shared styles, themes, loader, and animations
│   ├── js/              # Theme switcher, loader, animations, resume viewer, etc.
│   ├── files/           # Resume PDF
│   └── img/
│       └── <name>/      # Your images (profile, education, projects, certificates, gifs)
├── Dockerfile
└── vercel.json
```

## Run Locally

You need [PHP](https://www.php.net/downloads) installed.

1. Copy `data/template.json` to `data/<name>.json` (for example `data/your.json`) and fill in your details.
2. Create `assets/img/<name>/` with `certificates/`, `projects/`, `img/`, and `gifs/` folders and add your images. The paths in your JSON file must point to them.
3. In `includes/functions.php`, add your name to `ALLOWED_USERS` and set `DEFAULT_USER`:

   ```php
   const ALLOWED_USERS = ['example'];
   const DEFAULT_USER  = 'example';
   ```

4. From the project folder, start the server:

   ```bash
   php -S localhost:8000
   ```

5. Open <http://localhost:8000/?user=yourname>. The name after `?user=` matches your data file, so `?user=youruser` reads `data/your.json`.

Without `?user=`, the default person is shown.

## Where to Edit

| What                                                     | Where                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| Your text, skills, projects, certificates, contact links | `data/<name>.json`                                             |
| Your images                                              | `assets/img/<name>/` (keep the same file names when replacing) |
| Page sections (shared by everyone)                       | `sections/`                                                    |
| Styling (shared by everyone)                             | `assets/css/`, mainly `style.css`                              |
| Color themes                                             | `assets/css/themes.css` and `assets/js/theme.js`               |

### Data file fields

Each `data/<name>.json` supports these fields. `data/template.json` shows all of them.

| Field                                      | Description                                                                                                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `site_title`, `name`, `title`, `tagline`   | Page title and hero text                                                                                                            |
| `intro`                                    | Optional hero description. Defaults to `tagline`, then `about`                                                                      |
| `profile_image`, `profile_gifs`, `favicon` | Paths to the profile photo, the GIF folder, and the favicon                                                                         |
| `profile_image_alt`                        | Optional hover image, used when there is no `profile_gifs` folder                                                                   |
| `resume`                                   | Path to the resume PDF (optional, defaults to `assets/files/resume-public.pdf`)                                                     |
| `about`                                    | Short bio                                                                                                                           |
| `about_intro`                              | Optional `headline`, `description`, and `availability`. When `headline` is set, it replaces `about` at the top of the About section |
| `skills`                                   | List of skills                                                                                                                      |
| `education`                                | Each with `school`, `program`, `years`, `location`, `logo`, `image`, `summary`, and a `highlights` list                             |
| `facts`                                    | Quick highlights, each with `icon`, `title`, and `text`                                                                             |
| `projects`                                 | Each with `title`, `description`, `image`, `tech`, `link`, and optional `demo` and `github`                                         |
| `certificates`                             | Each with `title`, `issuer`, `date`, and `image` (one path, or a list for multi-page certificates). Optional `link` and `linkLabel` |
| `spotify_playlist`                         | Link to a public Spotify playlist. Leave it empty to hide the playlist card                                                         |
| `spotify_intro`                            | Optional `headline`, `accent`, `text`, and `button` for the playlist card                                                           |
| `github_graph_color`                       | Optional hex color for the GitHub graph, for example `40c463`                                                                       |
| `contact`                                  | `email`, `github`, `linkedin`, optional `facebook` and `instagram`, and `form_endpoint`                                             |

The GitHub contribution graph uses the username from `contact.github`. The data comes from a public API and is cached in `cache/` for 6 hours.

## Your Data File and Git

Personal data files are not committed. `.gitignore` contains:

```
data/*.json
!data/template.json
```

So the repository only contains `data/template.json`, and your own `data/<name>.json` stays on your computer. This means:

- After cloning, copy `data/template.json` to `data/<name>.json` and fill it in.
- A deployment that builds from the Git repository (such as Vercel) will not find your data file and shows `Missing data/<name>.json`. To deploy your own copy, keep it in your own fork or branch and remove the `data/*.json` line from `.gitignore` (or add the file with `git add -f data/<name>.json`).
- A Docker build copies the project folder as it is on your computer, so your data file is included.

## Adding Another Person

1. Copy `data/template.json` to `data/<name>.json` and fill in the new details.
2. Create `assets/img/<name>/` with `certificates/`, `projects/`, `img/`, and `gifs/` folders and update the image paths in the JSON file.
3. Add the name to `ALLOWED_USERS` in `includes/functions.php`.
4. Visit `/?user=<name>`.

## Deployment

### Clean links without `?user=`

When you deploy, you don't need `?user=<name>` in the link. Instead, set the default user to the owner of that deployment, and the plain link will show their portfolio.

In `includes/functions.php`, change this line:

```php
const DEFAULT_USER  = 'name';
```

to the name of the person the site is for. Now `https://your-site.com/` shows that person's portfolio, and the navigation and contact links stay clean too, with no `?user=` added. Anyone using this project can deploy their own copy this way, with their own name as the default.

Local testing with `?user=` still works whenever you want to preview another person's version.

Remember that your data file has to be part of what you deploy. See [Your Data File and Git](#your-data-file-and-git).

### Vercel

`vercel.json` is already configured to run the PHP files through `vercel-php`. Import the repo into Vercel and deploy. No build step is needed.

### Docker

```bash
docker build -t shared-portfolio .
docker run -p 10000:10000 shared-portfolio
```

Then open <http://localhost:10000>. The container serves the site with Apache on port 10000.

## Setting Up the Contact Form

The contact form and the "Request full resume" form post to the Formspree URL in `contact.form_endpoint` in your data file. To use your own, create a form on Formspree and replace the endpoint. If it is left empty, the site falls back to a plain `mailto:` link.

## Documentation

- [DOCUMENTATION.md](DOCUMENTATION.md): full technical documentation
