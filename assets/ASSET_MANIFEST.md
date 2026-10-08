# ISMPC2027 asset guide

This document records which assets are source files, which files are web-delivery derivatives, and how new media should be added. The public pages should use lightweight derivatives while the high-resolution sources remain available for future redesigns and print work.

## Web-delivery assets

Files in `assets/optimized/` are the versions currently delivered by the website.

| File | Dimensions | Intended use | Source |
| --- | ---: | --- | --- |
| `optimized/hero-bg.jpg` | 1920 × 640 | Homepage hero background | `hero/hero-bg-no-text.png` |
| `optimized/logo-header.png` | 900 × 437 | Header wordmark | `logo/logo4.png` |
| `optimized/logo-footer.png` | 1200 × 442 | Homepage hero and footer lockup | `logo/logo1.png` |
| `optimized/favicon.png` | 512 × 512 | Browser tab and bookmark icon | `logo/logo3.png` |
| `optimized/the-ridge.jpg` | 1600 × 867 | The Ridge feature image with building signage | `travel/the-ridge-frontage-source.png` |
| `optimized/sfah-venue.webp` | 1360 × 1020 | Shaw Foundation Alumni House venue feature | `venue/shaw-foundation-alumni-house.webp` |
| `optimized/section-mark.png` | 96 × 96 | Section-heading accent | `ornaments/gold-leaf-square-motif.png` |
| `optimized/molecular-network.jpg` | 520 × 520 | Low-opacity section ornament | `ornaments/molecular-network-blue-gold.png` |
| `optimized/icon-cluster.png` | 128 × 128 | Homepage cluster-science icon | `icons/cluster-science.png` |
| `optimized/icon-globe.png` | 128 × 128 | Homepage global-community icon | `icons/globe.png` |
| `optimized/icon-community.png` | 128 × 128 | Homepage applications icon | `icons/community.png` |
| `optimized/river-bumboat.jpg` | 1400 × 1050 | River-cruise feature | `travel/photo-bumboat.jpg` |
| `optimized/night-safari.avif` | 1905 × 1270 | Night Safari social-event option | `travel/night-safari-source.avif` |
| `optimized/gardens-by-the-bay.jpg` | 1400 × 838 | Singapore experience card | `travel/photo-gardens-by-the-bay.jpg` |
| `optimized/botanic-gardens.jpg` | 1400 × 977 | Singapore experience card | `travel/photo-botanic-gardens.jpg` |
| `optimized/marina-bay.jpg` | 1280 × 853 | Marina Bay travel imagery | `travel/photo-marina-bay.jpg` |

The October 2026 optimization reduced the four primary hero/logo/hotel files from roughly 13 MB to less than 1 MB. It also replaced several multi-megabyte travel photos and oversized 1024–3600 px UI graphics with appropriately sized derivatives. Source files remain unchanged.

Keynote cards use source-preserving JPEG delivery derivatives in `assets/speakers-keynote/`. Keep each original in `assets/speakers/`, avoid destructive tight crops and unnecessary upscaling, and use a lowercase, hyphenated filename that matches the speaker's name. The circular crop and individual face alignment are primarily controlled in CSS; a background-matched canvas may be added when a portrait source leaves no safe headroom.

Plenary cards use source-preserving JPEG derivatives in `assets/speakers-plenary/`. The public circular crop and individual face alignment are controlled in CSS, so retain enough space around the face and shoulders in each delivery image.

For portraits whose source places the head close to the image edge, the delivery derivative may add a neutral or background-matched canvas before compression. The 5 October 2026 replacement pass refreshed Jun Li, Tatsuya Tsukuda, Sarah S. Park, Amitava Patra, Di Sun, Yong Pei, Yu Han, Saptarshi Mukherjee, Quan-Ming Wang, Biswarup Pathak, and Shuang-Quan Zang from conference-team supplied files. Promotional artwork was cropped to a clean portrait area; portrait sources were padded or relaxed where needed so that hair and shoulders survive the circular mask. No generative alteration is used for these portraits.

The corresponding pre-replacement originals are retained in `assets/speakers/archive/2026-10-05-pre-refresh/`. `assets/speakers/di-sun-alternate.png` is an unused alternate supplied in the same batch. Do not point public pages at either the archive or alternate source; update the delivery JPEG and increment that speaker's `photoVersion` in `speakers-data.json` instead.

`assets/speakers/rongchao-jin-original.png` is the retained high-resolution source supplied in October 2026. The website serves the aspect-ratio-preserving derivative at `assets/speakers-plenary/rongchao-jin.jpg`; update `photoVersion` in `speakers-data.json` whenever that derivative is replaced so returning visitors do not see a cached portrait.

## Source assets

- `assets/hero/` contains high-resolution homepage artwork. The homepage uses `hero-bg-no-text.png` only as a source; all event text and buttons must remain live HTML.
- `assets/logo/` contains the high-resolution logo sources.
- `assets/speakers/` contains original or provenance-tracked speaker images; public pages should use the appropriate web-delivery derivative folder.
- `assets/speakers/archive/` contains dated, superseded originals retained for rollback and should never be referenced by public pages.
- `assets/speakers-keynote/` contains web-delivery keynote JPEGs prepared for the circular card treatment.
- `assets/speakers-plenary/` contains web-delivery plenary portraits prepared for the larger circular cards.
- `assets/travel/` contains travel, accommodation, and social-event source images. `the-ridge-frontage-source.png` is the active high-resolution source for the recommended-hotel feature, and `night-safari-source.avif` is the supplied source for the Night Safari option.
- `assets/travel/archive/` retains superseded or alternate Ridge imagery for rollback. Public pages use the compressed derivative in `assets/optimized/`.
- `assets/venue/` contains the supplied Shaw Foundation Alumni House source image as well as legacy NUS University Town images. Only `shaw-foundation-alumni-house.webp` should be identified as the conference venue.
- `assets/ornaments/` and `assets/icons/` contain decorative artwork. Decorative images should use `alt=""`.

## Adding or replacing an image

1. Keep the best available original in the appropriate source folder.
   When replacing an existing portrait, move the superseded original into a dated folder under `assets/speakers/archive/` before adding the new source.
2. Create a web derivative in `assets/optimized/` when the original is larger than needed or uses an inefficient format.
3. Use lowercase, hyphenated filenames with no spaces, dates, or version words such as `final`.
4. Size photographs for their largest rendered width. In most cases, 1600 px is sufficient for a full-width card and 900 px is sufficient for a portrait.
5. Prefer JPEG for photographs without transparency and PNG only for graphics that require transparency. Use SVG for future code-native vector artwork when available.
6. Add intrinsic `width` and `height` attributes in HTML to reduce layout shift. Use `loading="lazy"` for images below the first viewport.
7. Record the derivative, dimensions, use, and source in the table above.
8. Check visual quality at desktop and mobile sizes before replacing an existing derivative.
9. Increment the portrait's `photoVersion` in `speakers-data.json` so returning visitors receive the new image instead of a cached copy.

## Content and licensing

- Use meaningful alternative text for informative images and empty alternative text for purely decorative images.
- Record the source, permission, and credit requirements for third-party photos before public launch.
- Do not hotlink images from external websites.
- Keep venue photography honest: a campus-context image must not be captioned as the conference building unless it actually shows that building.
