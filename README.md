# Siddharth Dialani — Digital Twin & Simulation Portfolio

Next.js 14 (App Router) portfolio for junior Digital Twin, Simulation, 3D Integration and Physical AI / robotics simulation roles. Professional content follows the supplied resume (`public/resume/`). All project content is structured data, every project page follows the same case-study format, and each page records how its claims were verified.

## What's inside

- **Real-time 3D hero** (Three.js): an illustrative district resolves from wireframe (with vertex highlights and dimension guides) to clay to a glass/steel material render with PBR shading, environment reflections and soft shadows. Drag to rotate, cursor parallax, scroll-driven camera rise, slow time-of-day lighting.
- **Scroll-driven 3D story** (`#process`): scroll moves the same scene through Capture (LiDAR-style point-cloud sweep) → Model (wireframe + dimensions) → Prepare (exploded floor slabs) → Simulate (sun-driven surface heat map) → Deliver (material render + selection).
- **Interactive model viewer** on the HeatShield page, using the real glTF 2.0 export from that repository: orbit/pan/zoom, reset, turntable, fullscreen, Shaded / Clay / Wireframe / X-ray modes, floor isolation, exploded floors, zone-type highlighting and hover labels read from the model's own `zoneId` / `kind` / `floor` metadata.
- **Editorial project showcase** with status/type/technology/search filters; each project has its own visual treatment (parallax + hover-reveal screenshots, layered depth, or clearly labelled concept animations where no media is published).
- **Motion system** (`components/site/motion.tsx`): one easing family; rise, mask, focus and scale reveals; split-word headline reveals; parallax; pointer-responsive glass; active-section navigation; scroll progress; route transitions; scroll-linked timeline. Everything respects `prefers-reduced-motion` and is hydration-safe.

All 3D scenes are lazy-loaded (three.js is not in the initial bundle), pause when off-screen, drop quality on touch/low-core devices, skip identical frames, and fall back gracefully when WebGL is unavailable.

## Run locally

Requirements: Node.js 18.18+ (tested on 22), npm.

```bash
npm install
cp .env.example .env.local   # optional — every variable is optional
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

Browser acceptance checks (141 checks across desktop, tablet and mobile — links, images, overflow, filters, dialogs, resume files, resume facts, 3D scene start-up, model viewer, reduced motion, contact form, APIs):

```bash
npm i -D playwright && npx playwright install chromium
npm run build && npm start &          # serve the production build
node scripts/acceptance-test.mjs http://localhost:3000
```

## Deploy to Vercel

1. Push this folder to a GitHub repository (the `.gitignore` already excludes `.env*`, `.next` and `node_modules`).
2. In Vercel: **Add New → Project → Import** the repository. Framework preset: **Next.js**. No build settings need changing.
3. Optionally add the environment variables below under **Settings → Environment Variables**, then redeploy.
4. Once the production domain is final, set `NEXT_PUBLIC_SITE_URL` to it so canonical URLs, the sitemap and social previews use the right address.

The site works with **no** environment variables: the contact form validates input and offers to send the message by email, and the AI assistant stays hidden.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical public URL. Falls back to Vercel's production URL. |
| `DATABASE_URL` | No | Postgres connection string. Enables storing contact-form messages in the `ContactSubmission` table (`db/schema.sql`; compatible with the table the original Prisma schema created). |
| `ABACUSAI_API_KEY` | No | Enables the floating portfolio assistant (`/api/chat`). Server-side only. |
| `ABACUSAI_MODEL` | No | Overrides the assistant model (default `gpt-5.4-mini`). |

Secrets are only read in API routes; nothing is exposed to browser code.

## Editing content

| What | Where |
| --- | --- |
| Name, title, summary, email, GitHub, LinkedIn | `lib/site.ts` |
| Projects, workstreams, supporting projects | `lib/projects.ts` |
| Skills, experience, education, certifications, languages (from the resume) | `lib/profile.ts` |
| 3D scene (district, stages, timelines) | `lib/three/district.ts`, `components/site/district-canvas.tsx` |
| Real 3D model for the viewer | `public/models/heatshield.gltf` |
| Project screenshots | `public/projects/<project>/` (WebP, referenced from `lib/projects.ts`) |
| Resume | `public/resume/Siddharth-Dialani-Resume.pdf` and `.docx` |

**Resume:** `public/resume/Siddharth-Dialani-Resume.docx` is the supplied file; the PDF beside it is a direct LibreOffice conversion of that file (`soffice --headless --convert-to pdf`). Replace both when the resume changes, then update `lib/site.ts` and `lib/profile.ts` to match. If the files are removed, the site falls back to a "Request resume" email link.

**Documentation captures:** `/?scene-t=<seconds>` pins the hero animation at a moment in its timeline (used to render the preview video).

**Diagrams** are generated from the `diagram` field of each project (columns of nodes plus edges). Each project page also shows the equivalent Mermaid source so the diagram can be edited or reused elsewhere. Set `planned: true` on a node to draw it dashed.

**Accuracy rules for project content:** an item in `implemented` is `verified: true` only if it was confirmed in source code, project documentation or the running application. Owner-reported items stay `verified: false` and are shown with a dashed icon. Work not built yet belongs in `planned`.

## Structure

```
app/
  page.tsx                 Home: hero, pipeline map, project gallery, about, skills, experience, contact
  projects/[slug]/page.tsx Case-study pages (statically generated)
  api/contact/route.ts     Validated, rate-limited contact endpoint (optional Postgres)
  api/chat/route.ts        Portfolio assistant; system prompt generated from lib data
  opengraph-image.tsx      Social preview image
components/site/           Portfolio components
components/ui/             shadcn/ui primitives retained from the original project
lib/                       Content and server helpers
db/schema.sql              Contact table definition
scripts/acceptance-test.mjs
```

## Changes from the original Abacus AI export

- Rebranded from "AI Engineer" to Digital Twin & Simulation Engineer, with a near-black / graphite / warm-white design system, electric-blue and violet accents, selective glass, and Instrument Serif + Geist (self-hosted).
- Removed invented content: placeholder GitHub and LinkedIn profiles, animated counters, a services list and unverified "production" claims.
- Replaced the four AI project cards with six digital-twin case studies plus workstreams and a secondary AI/software section.
- Replaced Prisma with `pg` (the same table, no engine binaries to download at build time) and removed the Abacus platform script.
- Removed unused dependencies (AWS/Azure SDKs, Plotly, MapLibre, next-auth, GSAP and others) and upgraded Next.js to 14.2.35 for the December 2025 security fix.
- Hardened the API routes: input validation, rate limiting, honeypot, no client-supplied system prompts.
