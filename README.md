# ISMPC2027 website

Static GitHub Pages website for the 9th International Symposium on Monolayer-Protected Clusters, Singapore, 1–4 August 2027.

## Current confirmed event information

- Main venue: Shaw Foundation Alumni House (SFAH), 11 Kent Ridge Drive, Singapore 119244.
- Recommended accommodation: The Ridge, NUS, 17 Computing Drive, Singapore 119881.
- Welcome reception: The Ridge; date, time, and room details are to be confirmed.
- Detailed SFAH room assignments are to be confirmed.
- Local organizer: Xie Group @ NUS, Department of Chemical and Biomolecular Engineering, National University of Singapore.
- Conference Chair: Prof. Jianping Xie; Conference Secretary: Dr. Zhucheng Yang.
- Primary conference email: `ismpc2027@gmail.com`; secondary contact: `zc_yang@nus.edu.sg`.

Do not add a room number, floor, shuttle route, fee, submission date, or booking promise until it has been confirmed by the organizing team.

## Site structure

- `index.html`: focused homepage with event identity, essential facts, and the complete invited-speaker roster.
- `venue.html`: venue and reception information.
- `travel.html`: entry, transport, accommodation, and visitor guidance.
- `attendee.html`: accessibility, dietary, visa-support, conduct, and privacy guidance.
- `speakers.html` and `speakers-data.json`: confirmed speaker directory and its single public source of truth.
- `ismpc2027.ics`: downloadable all-day calendar entry for the confirmed conference dates.
- `css/style.css`: shared design system and responsive layouts.
- `js/main.js`: responsive navigation and current-page state.
- `js/speakers.js`: shared homepage/speaker-page renderer; update speaker names, affiliations, roles, proposed talk titles, and portrait paths only in `speakers-data.json`.
- `assets/ASSET_MANIFEST.md`: image workflow and asset ownership notes.

The site intentionally uses plain HTML, CSS, and JavaScript. Repeated header and footer markup should remain identical across pages until a build system or template layer is introduced.

## Design system and maintenance

- Global colour, radius, spacing, section, and card values live in `:root` at the top of `css/style.css`. Adjust those tokens before adding page-specific values.
- Use `.grid` with `.grid-2`, `.grid-3`, or `.grid-4` for standard card layouts, and `.content-stack` for vertically separated page modules. Avoid one-off margin classes.
- `.eyebrow` owns the spacing below its label. Do not add local label-to-heading margins unless the component is intentionally different.
- Keep portrait-specific crop corrections in the existing speaker override block; do not add inline styles to generated speaker cards.
- Keep the site dependency-free unless a template/build step is deliberately adopted and documented. The current static files remain directly deployable to GitHub Pages.

Run the maintenance check after shared navigation/footer edits, asset replacements, or cache-version changes:

```sh
python3 tools/check-site.py
```

The primary navigation groups venue, accommodation, transport, and visitor guidance under **Attend**. `venue.html` remains a focused detail page linked from the Attend page and footer.

## Local preview

From the repository root:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Updating speakers

1. Start the local preview server, then open `http://localhost:8000/tools/speaker-editor.html`.
2. Search for a speaker, update the form (including an optional proposed talk title), and choose **Apply changes**.
3. Choose **Save speakers-data.json** and save over the repository-root `speakers-data.json` file. Browsers without direct file-save support download a replacement file instead.
4. Keep the best original in `assets/speakers/` using a lowercase, hyphenated name. Move the superseded original into a dated folder under `assets/speakers/archive/`, then put the optimized plenary or keynote JPEG in `assets/speakers-plenary/` or `assets/speakers-keynote/`.
5. Refresh `speakers.html` and verify the portrait crop at desktop and mobile widths before committing.

## Before publishing an update

1. Search all HTML files for outdated venue or date wording.
2. Check internal links and referenced local assets.
3. Preview the homepage, the edited page, and the mobile navigation at desktop, tablet, and phone widths.
4. Run `git diff --check` and confirm there are no accidental unrelated changes.
5. Update `assets/ASSET_MANIFEST.md` when adding a web-delivery image.

## Content conventions

- Use en dashes in date ranges: `1–4 August 2027`.
- Use `Shaw Foundation Alumni House (SFAH)` on first mention and `SFAH` thereafter.
- Describe The Ridge as the recommended option for eligible conference delegates. Requests are collected during registration for a coordinated group booking; reservation links are issued only after arrangements are confirmed, and rooms remain subject to NUS eligibility and availability.
- Label tentative dates and activities clearly. Do not present inactive buttons as live registration or submission actions.
- Keep private or operational contact details out of `speakers-data.json`; it is a publicly downloadable website asset.
- When replacing an existing speaker portrait without changing its filename, update that speaker's `photoVersion` value to prevent stale browser caches.
- Per-speaker crop and zoom corrections are keyed by `data-speaker` in the Speakers section of `css/style.css`; review those values when a portrait is replaced.
