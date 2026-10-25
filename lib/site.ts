/**
 * Single source of truth for personal details.
 * Contact details must match the current resume — update here, not in components.
 */
export const site = {
  name: 'Siddharth Dialani',
  title: 'Digital Twin & Simulation Engineer | AI-Driven 3D Workflows',
  shortTitle: 'Digital Twin & Simulation Engineer',
  location: 'Dubai, UAE',
  email: 'siddharthdialani18@gmail.com',
  github: 'https://github.com/siddharthproffessional',
  githubHandle: 'siddharthproffessional',
  /** Leave null unless the URL appears on the resume. */
  linkedin: null as string | null,
  /** Phone exactly as listed on the resume. */
  phone: '+971 50 534 0540',
  phoneHref: 'tel:+971505340540',
  /** Professional summary — verbatim from the resume. */
  summary:
    'Digital-twin and simulation practitioner with an MBA focus in AI and Business Analytics and hands-on project experience in 3D scene preparation, BIM/USD interoperability, environmental visualization, and spatial reconstruction. Experienced in exploring workflows across Blender, Revit, Unreal Engine, NVIDIA Omniverse, Isaac Sim, and OpenUSD. Skilled in investigating cross-platform asset integration, AI-assisted automation, and simulation workflows to support interactive 3D environments. Interested in developing practical digital-twin solutions that connect 3D modelling, software integration, and simulation for industrial, urban, and built-environment applications.',
  /** Hero headline and supporting line, drawn from the resume summary and projects. */
  headline: 'Connecting 3D modelling, software integration and simulation.',
  statement:
    'I prepare 3D scenes, move them between Blender, Revit, Unreal Engine, NVIDIA Omniverse and Isaac Sim through OpenUSD, and build browser-based digital-twin prototypes — using AI-assisted automation to test workflows quickly.',
}

/** Canonical public URL. Set NEXT_PUBLIC_SITE_URL once the production domain is final. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}

export type ResumeAvailability = { pdf: string | null; docx: string | null }

export function resumeRequestHref(): string {
  const subject = encodeURIComponent('Resume request — portfolio')
  return `mailto:${site.email}?subject=${subject}`
}
