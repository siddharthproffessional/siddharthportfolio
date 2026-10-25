# Siddharth Dialani — Digital Twin & Simulation Portfolio

Next.js 14 (App Router) portfolio for junior Digital Twin, Simulation, 3D Integration and Physical AI / robotics simulation roles. All project content is structured data, every project page follows the same 12-part case-study format, and each page records how its claims were verified.

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

Browser acceptance checks (118 checks across desktop, tablet and mobile — links, images, overflow, filters, dialogs, contact form, APIs):

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
| Skills, experience, education, certifications | `lib/profile.ts` |
| Project screenshots | `public/projects/<project>/` (WebP, referenced from `lib/projects.ts`) |
| Resume | `public/resume/Siddharth-Dialani-Resume.pdf` and `.docx` |

**Resume:** drop the files into `public/resume/` with exactly those names. The navigation and hero switch from "Request resume" to "Download resume" automatically — the site never links to a file that does not exist.

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

- Rebranded from "AI Engineer" to Digital Twin & Simulation Engineer, with a navy/teal design system (Archivo + IBM Plex, self-hosted).
- Removed invented content: placeholder GitHub and LinkedIn profiles, animated counters, a services list and unverified "production" claims.
- Replaced the four AI project cards with six digital-twin case studies plus workstreams and a secondary AI/software section.
- Replaced Prisma with `pg` (the same table, no engine binaries to download at build time) and removed the Abacus platform script.
- Removed unused dependencies (AWS/Azure SDKs, Plotly, MapLibre, next-auth, GSAP and others) and upgraded Next.js to 14.2.35 for the December 2025 security fix.
- Hardened the API routes: input validation, rate limiting, honeypot, no client-supplied system prompts.
