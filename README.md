# HEIC to JPG Converter

Free HEIC to JPG converter. 100% client-side — your photos never leave your browser. Batch convert with quality control. No signup.

Built by **The App Factory** as App #1 of 365.

## Live URL
TBD — Domain pending

## Tech Stack
- Next.js 14+ (App Router)
- Tailwind CSS
- libheif-js / heic2any (client-side WASM)
- JSZip (batch ZIP download)
- Plausible Analytics

## Features (MVP)
- Drag & drop or click-to-upload HEIC files
- Batch conversion (up to 20 files)
- Quality selector (Low/Medium/High → 60/80/95%)
- Download individual JPGs or ZIP
- Privacy-first: zero uploads, all processing in browser
- SEO-optimized landing page

## Getting Started
```bash
npm install
npm run dev
```

## Deploy
```bash
npm run build
# Static export to `dist/` — ready for Cloudflare Pages / Vercel / Railway Static
```

## App Factory Notes
- **App #**: 1
- **Issue**: THE-1
- **Search target**: "heic to jpg", "convert heic online"
- **Kill criteria (60-90 days)**:
  - < 50 sessions → Kill
  - 50-200 sessions → Optimize SEO / add ads
  - > 200 sessions → Scale (HEIC→PNG, video→GIF)
