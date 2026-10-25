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
  summary:
    'Digital-twin and simulation practitioner with an MBA focus in AI and Business Analytics and hands-on project experience in 3D scene preparation, BIM/USD interoperability, environmental visualization, and spatial reconstruction. Experienced in exploring workflows across Blender, Revit, Unreal Engine, NVIDIA Omniverse, Isaac Sim, and OpenUSD. Focused on cross-platform asset integration, AI-assisted automation, and simulation workflows for industrial, urban, and built-environment applications.',
  statement:
    'I build browser-based twins, prepare 3D scenes for simulation, and connect tools such as Blender, Revit, Unreal Engine and NVIDIA Omniverse through OpenUSD, using AI-assisted development to get working prototypes in front of people quickly.',
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
