# Shared Portfolio

One portfolio design for me and my bebe, built with HTML, CSS, JavaScript and PHP.

## Run locally
Requires PHP installed. In this folder run:

    php -S localhost:8000

- Jed's version:       [http://localhost:8000/?user=jed](http://localhost/shared-portfolio/?user=jed)
- Christine's version:[ http://localhost:8000/?user=christine](http://localhost/shared-portfolio/?user=christine)

Kapag walang naka-input sa user, data ko yung lilitaw kasi naka-set as default

## Where to edit
- Your text, projects, certificates: `data/<name>.json`
- Your images: `assets/img/<name>/` (keep the same file names when replacing)
- Page sections: `sections/`  (shared by both)
- Styling: `assets/css/style.css`  (shared by both)

## Adding a third person
1. Add the name to `ALLOWED_USERS` in `includes/functions.php`
2. Copy `data/jed.json` to `data/<name>.json`
3. Create `assets/img/<name>/`
