/**
 * Skills, experience, certifications, education and languages — transcribed from the
 * supplied resume (public/resume/Siddharth-Dialani-Resume.docx). Do not add items that
 * are not on the resume. Evidence links only point to projects where a tool is used.
 */

export type Skill = { name: string; evidence?: { label: string; href: string }[] }
export type SkillGroup = { id: string; group: string; summary: string; skills: Skill[] }

const p = (slug: string, label: string) => ({ label, href: `/projects/${slug}` })

export const skillGroups: SkillGroup[] = [
  {
    id: 'twin',
    group: 'Digital Twin & 3D',
    summary: 'Authoring, preparing and reviewing scenes in DCC, BIM, real-time and simulation tools.',
    skills: [
      { name: 'Blender 5.2', evidence: [p('bottling-line-twin', 'Bottling line'), p('blender-usd-unreal-omniverse', 'Interop')] },
      { name: 'Unreal Engine', evidence: [p('blender-usd-unreal-omniverse', 'Interop')] },
      { name: 'NVIDIA Omniverse', evidence: [p('blender-usd-unreal-omniverse', 'Interop')] },
      { name: 'Isaac Sim', evidence: [p('simready-robotics-workflow', 'SimReady')] },
      { name: 'Revit' },
      { name: 'OpenUSD/USD Bridge', evidence: [p('simready-robotics-workflow', 'SimReady'), p('blender-usd-unreal-omniverse', 'Interop')] },
    ],
  },
  {
    id: 'recon',
    group: 'Reconstruction & Visualization',
    summary: 'Capturing real spaces and turning them into navigable 3D.',
    skills: [
      { name: 'COLMAP' },
      { name: 'Gaussian Splatting' },
      { name: 'SuperSplat' },
      { name: 'iPhone LiDAR/RoomPlan' },
      { name: '360° capture' },
      { name: 'PlayCanvas' },
    ],
  },
  {
    id: 'integration',
    group: 'Integration & Simulation',
    summary: 'Connecting tools, exchanging scenes and testing interaction and physics.',
    skills: [
      { name: 'MCP' },
      { name: 'Revit MCP' },
      { name: 'USD exchange workflows', evidence: [p('blender-usd-unreal-omniverse', 'Interop')] },
      { name: 'OpenXR' },
      { name: 'Meta Quest 3 PC Link' },
      { name: 'Locomotion' },
      { name: 'Collision/physics testing' },
    ],
  },
  {
    id: 'code',
    group: 'Programming & Tools',
    summary: 'Building and shipping the software around the 3D work.',
    skills: [
      { name: 'Python', evidence: [p('simready-robotics-workflow', 'SimReady'), p('blender-usd-unreal-omniverse', 'Interop')] },
      { name: 'JavaScript', evidence: [p('heatshield', 'HeatShield'), p('dubai-environmental-twin', 'Env. twin')] },
      { name: 'TypeScript' },
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'FastAPI' },
      { name: 'Node.js' },
      { name: 'Codex', evidence: [p('simready-robotics-workflow', 'SimReady')] },
      { name: 'Claude Code' },
      { name: 'Cursor' },
      { name: 'n8n' },
      { name: 'GitHub' },
      { name: 'Docker' },
      { name: 'Vercel', evidence: [p('heatshield', 'HeatShield'), p('dubai-environmental-twin', 'Env. twin')] },
      { name: 'PostgreSQL' },
    ],
  },
]

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Hindi', level: 'Native' },
  { name: 'Marathi', level: 'Conversational' },
]

export type Role = {
  title: string
  org: string
  location: string
  period: string
  points: string[]
}

export const experience: Role[] = [
  {
    title: 'Student Research Assistant (SRA)',
    org: 'Middlesex University Dubai',
    location: 'Dubai, UAE',
    period: 'Sep 2026 – Present',
    points: [
      'Research generative-AI and computer-vision workflows for digital twins, 3D scene reconstruction, and spatial computing.',
      'Build and test Blender, iPhone LiDAR/RoomPlan, 360° capture, COLMAP, Gaussian Splatting, SuperSplat, PlayCanvas, and OpenUSD workflows.',
      'Explore scene-preparation automation and MCP integrations across Revit, Omniverse, and Isaac Sim; document interoperability and validation issues.',
    ],
  },
]

export const certifications = [
  { title: 'ML Practitioner Certificate', issuer: 'Dataiku', date: 'July 2026' },
  { title: 'Core Designer Certificate', issuer: 'Dataiku', date: 'July 2026' },
]

export const education = [
  {
    title: 'MBA, Business Analytics & Artificial Intelligence',
    org: 'Middlesex University Dubai',
    period: 'Expected Feb 2027',
  },
  {
    title: 'BCA',
    org: 'BYK College of Commerce, Nashik, India',
    period: '',
  },
]
