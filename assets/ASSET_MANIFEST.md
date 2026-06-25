# ISMPC 2027 Website Asset Manifest

This folder contains named PNG assets for the static ISMPC 2027 GitHub Pages website. Keep the filenames unchanged so Codex can reference them reliably.

## Core brand assets

- `assets/logo/ismpc2027-logo.png`  
  Official full ISMPC 2027 logo. Use in header and footer when a full logo block is needed.

- `assets/logo/ismpc2027-logo-mark.png`  
  Square decorative mark/emblem. Use when a compact logo mark is needed.

## Hero assets

- `assets/hero/hero-bg-no-text.png`  
  Homepage hero background without text/buttons. Use as `.hero` CSS background and overlay live HTML text/buttons.

- `assets/hero/hero-bg-with-text.png`  
  Full hero graphic with baked-in title text. Keep as visual reference; the website should normally use `hero-bg-no-text.png`.

- `assets/hero/singapore-skyline.png`  
  Standalone Singapore skyline illustration.

- `assets/hero/orchid-hero.png`  
  Orchid line-art hero ornament.

- `assets/hero/gold-cluster-subtle.png`  
  Gold cluster ornament; use at reduced opacity when overlaid.

- `assets/hero/molecular-network.png`  
  Molecular network ornament.

## Footer asset

- `assets/footer/footer-bg-no-text.png`  
  Dark navy ornamental footer background without text/logos. Use as `.site-footer` CSS background and overlay footer content as live HTML.

## Ornaments

- `assets/ornaments/gold-leaf-square-motif.png`  
  Gold leaf + navy square motif. Use as section heading accent. Suggested class: `.section-kicker-icon`. Decorative image, `alt=""`.

- `assets/ornaments/floral-divider.png`  
  Navy/gold floral divider ornament. Use sparingly as decorative divider.

- `assets/ornaments/gold-divider-line.png`  
  Thin gold divider line with round dots. Use under hero subtitle or section titles.

- `assets/ornaments/orchid-line-art.png`  
  Orchid line-art. Use in venue/social/page-hero sections as an absolute-positioned low-opacity ornament.

- `assets/ornaments/blue-floral-side-pattern.png`  
  Vertical blue floral side pattern. Use for page borders or footer side accents.

- `assets/ornaments/gold-cluster.png`  
  Gold cluster ornament. Use as a scientific decorative motif; keep secondary.

- `assets/ornaments/molecular-network-blue-gold.png`  
  Pale molecular network ornament. Suggested opacity: 0.2–0.35.

- `assets/ornaments/corner-gold-navy.png`  
  Corner frame motif. Use in cards/page heroes.

- `assets/ornaments/orchid-cluster-emblem.png`  
  Ornamental cluster emblem; optional decorative use.

## Icons

- `assets/icons/calendar.png`
- `assets/icons/location.png`
- `assets/icons/email.png`
- `assets/icons/phone.png`
- `assets/icons/arrow-right.png`
- `assets/icons/community.png`
- `assets/icons/globe.png`
- `assets/icons/cluster-science.png`
- `assets/icons/floral-section-icon.png`

Use icon PNGs in cards, contact blocks, and section features. Use empty alt text if purely decorative.

## Placeholders

- `assets/placeholders/speaker-placeholder.png`  
  Generic speaker portrait/card placeholder. Replace with real accepted plenary/keynote speaker portraits later.

- `assets/placeholders/venue-placeholder.png`  
  Generic venue/UTown placeholder. Replace with a real NUS UTown photo later.

- `assets/placeholders/singapore-placeholder.png`  
  Generic Singapore/social-program placeholder. Use for travel cards and Singapore River Cruise until real photos are provided.

## Notes for Codex

- Use only these local asset paths. Do not use external image URLs.
- Use `hero-bg-no-text.png` and `footer-bg-no-text.png` as CSS background images.
- Overlay all text as live HTML for accessibility and editability.
- Decorative images should use `alt=""`.
- Informative images such as real speaker portraits and venue photos should use meaningful alt text.
- Some assets are generated/design assets, not official photos. Replace placeholders with official images before public launch.
- These PNGs mostly have white or full-canvas backgrounds; place them over white/pale sections or use CSS opacity/blending carefully.
