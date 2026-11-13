# Shared Portfolio

One portfolio design, two people. Built by **Jed Manaloto** and **Christine Fauni** with HTML, CSS, JavaScript, and PHP.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Run Locally](#run-locally)
- [Where to Edit](#where-to-edit)
- [Adding Another Person](#adding-another-person)
- [Deployment](#deployment)
- [Setting Up the Contact Form](#setting-up-the-contact-form)
- [Documentation](#documentation)
- [Authors](#authors)

**Full technical details are in**: [DOCUMENTATION.md](DOCUMENTATION.md)

All portfolios share the same layout, styling, and code. Each person's content (text, projects, certificates, images) lives in its own data file, so the site renders a different portfolio depending on the `?user=` parameter in the URL.

## Features

- **Two portfolios, one codebase.** Switch between them with `?user=jed` or `?user=christine`.
- **Driven by content.** Everything on the page comes from a JSON file, so there is no need to touch the HTML to update your info.
- **Five color themes.** Daybreak, Nightfall, Strawberry, Lavender, and Sunset, each with its own animated GIF. The chosen theme is remembered between visits.
- **Sections.** Hero, About (skills and quick facts), Projects, Certificates, and Contact.
- **Resume viewer.** A PDF preview inside the page with a "Request full resume" form for visitors who want the complete version.
- **Contact form.** Messages are sent through [Formspree](https://formspree.io), with a mailto fallback if no form endpoint is set.
- **Animations.** Scroll effects with GSAP and a bit of confetti.

## Tech Stack

| Area            | Tools                                               |
| --------------- | --------------------------------------------------- |
| Backend         | PHP 8.4                                             |
| Frontend        | HTML, CSS, vanilla JavaScript                       |
| Libraries (CDN) | GSAP + ScrollTrigger, canvas-confetti, Font Awesome |
| Fonts           | Nunito, Quicksand (Google Fonts)                    |
| Forms           | Formspree                                           |
| Deployment      | Vercel (`vercel-php`) or Docker (Apache)            |

## Project Structure

```
shared-portfolio/
├── index.php            # Main page: loads user data and includes the sections
├── email.php            # Standalone "Send me a message" page
├── api/                 # Entry points used by Vercel
├── data/
│   ├── jed.json         # Jed's content
│   └── christine.json   # Christine's content
├── sections/            # Page sections shared by all portfolios
│   ├── hero.php
│   ├── about.php
│   ├── projects.php
│   ├── certificates.php
│   ├── contact.php
│   └── resume-modal.php
├── includes/
│   ├── functions.php    # ALLOWED_USERS, current_user(), load_content()
│   ├── header.php
│   └── footer.php
├── assets/
│   ├── css/             # Shared styles and themes
│   ├── js/              # Theme switcher, animations, resume viewer, etc.
│   ├── files/           # Resume PDF
│   └── img/
│       ├── jed/         # Jed's images (profile, projects, certificates, gifs)
│       └── christine/   # Christine's images
├── Dockerfile
└── vercel.json
```

## Run Locally

You need [PHP](https://www.php.net/downloads) installed. From the project folder, run:

```bash
php -S localhost:8000
```

Then open the site and add `?user=` followed by your name. The name matches your data file in the `data/` folder, so `?user=jed` reads `data/jed.json` and `?user=christine` reads `data/christine.json`.

- Jed's portfolio: <http://localhost:8000/?user=jed>
- Christine's portfolio: <http://localhost:8000/?user=christine>

Without `?user=`, the default person is shown. You can change who that is in `includes/functions.php`.

## Where to Edit

| What                                                     | Where                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| Your text, skills, projects, certificates, contact links | `data/<name>.json`                                             |
| Your images                                              | `assets/img/<name>/` (keep the same file names when replacing) |
| Page sections (shared by both)                           | `sections/`                                                    |
| Styling (shared by both)                                 | `assets/css/style.css`                                         |
| Color themes                                             | `assets/css/themes.css` and `assets/js/theme.js`               |

### Data file fields

Each `data/<name>.json` supports these fields:

| Field                                      | Description                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `site_title`, `name`, `title`, `tagline`   | Page title and hero text                                                                |
| `profile_image`, `profile_gifs`, `favicon` | Paths to images and the GIF folder                                                      |
| `resume`                                   | Path to the resume PDF (optional, defaults to `assets/files/resume-public.pdf`)         |
| `about`                                    | Short bio                                                                               |
| `skills`                                   | List of skills                                                                          |
| `facts`                                    | Quick highlights, each with `icon`, `title`, and `text`                                 |
| `projects`                                 | Each with `title`, `description`, `image`, `tech`, `link`, and an optional `demo`       |
| `certificates`                             | Each with `title`, `issuer`, `date`, and `image`                                        |
| `contact`                                  | `email`, `github`, `linkedin`, optional `facebook` and `instagram`, and `form_endpoint` |

## Adding Another Person

1. Add the name to `ALLOWED_USERS` in `includes/functions.php`.
2. Copy `data/jed.json` to `data/<name>.json` and fill in the new details.
3. Create `assets/img/<name>/` with `certificates/`, `projects/`, `img/`, and `gifs/` folders.
4. Visit `/?user=<name>`.

## Deployment

### Clean links without `?user=`

When you deploy, you don't need `?user=jed` or `?user=christine` in the link. Instead, set the default user to the owner of that deployment, and the plain link will show their portfolio.

In `includes/functions.php`, change this line:

```php
const DEFAULT_USER  = 'jed';
```

to the name of the person the site is for, for example:

```php
const DEFAULT_USER  = 'christine';
```

Now `https://your-site.com/` shows Christine's portfolio, and the navigation and contact links stay clean too, with no `?user=` added. Anyone using this project can deploy their own copy this way, with their own name as the default.

Local testing with `?user=` still works whenever you want to preview another person's version.

### Vercel

`vercel.json` is already configured to run the PHP files through `vercel-php`. Import the repo into Vercel and deploy. No build step is needed.

### Docker

```bash
docker build -t shared-portfolio .
docker run -p 10000:10000 shared-portfolio
```

Then open <http://localhost:10000>. The container serves the site with Apache on port 10000.

## Setting Up the Contact Form

The contact form and the "Request full resume" form post to the Formspree URL in `contact.form_endpoint` in each person's data file. To use your own, create a form on Formspree and replace the endpoint. If it is left empty, the site falls back to a plain `mailto:` link.

## Documentation

- [DOCUMENTATION.md](DOCUMENTATION.md): full technical documentation

## Authors

- **Jed Manaloto**: [GitHub](https://github.com/Jedskibidi)
- **Christine Fauni**: [GitHub](https://github.com/christinefauni)
