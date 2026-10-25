/**
 * Skills, experience and education. Experience and education follow the resume;
 * skills list tools with the project evidence where each one has been used.
 * No proficiency levels are claimed.
 */

export type Skill = { name: string; evidence?: { label: string; href: string }[] }
export type SkillGroup = { group: string; summary: string; skills: Skill[] }

const p = (slug: string, label: string) => ({ label, href: `/projects/${slug}` })

export const skillGroups: SkillGroup[] = [
  {
    group: 'Digital twin & 3D',
    summary: 'Authoring and preparing scenes in the main DCC, BIM and real-time tools.',
    skills: [
      { name: 'Blender', evidence: [p('bottling-line-twin', 'Bottling line'), p('blender-usd-unreal-omniverse', 'Interop')] },
      { name: 'Revit' },
      { name: 'Unreal Engine', evidence: [p('blender-usd-unreal-omniverse', 'Interop')] },
      { name: 'NVIDIA Omniverse', evidence: [p('omniverse-intelligence-lab', 'Intelligence Lab')] },
      { name: 'NVIDIA Isaac Sim', evidence: [p('simready-robotics-workflow', 'SimReady')] },
      { name: 'OpenUSD / USD Bridge', evidence: [p('blender-usd-unreal-omniverse', 'Interop')] },
    ],
  },
  {
    group: '3D reconstruction',
    summary: 'Turning real spaces into usable 3D data.',
    skills: [
      { name: 'COLMAP' },
      { name: 'Gaussian Splatting' },
      { name: 'SuperSplat' },
      { name: 'iPhone LiDAR / RoomPlan' },
      { name: '360° capture' },
      { name: 'Point clouds' },
      { name: 'PlayCanvas' },
    ],
  },
  {
    group: 'Interoperability & simulation',
    summary: 'Moving data between tools and setting up interaction and physics.',
    skills: [
      { name: 'BIM-to-3D workflows' },
      { name: 'USD import / export', evidence: [p('blender-usd-unreal-omniverse', 'Interop')] },
      { name: 'glTF export with ID checks', evidence: [p('heatshield', 'HeatShield')] },
      { name: 'MCP integrations' },
      { name: 'OpenXR / VR interaction' },
      { name: 'Collision & physics workflows', evidence: [p('simready-robotics-workflow', 'SimReady')] },
      { name: 'Thermal zone & solar models', evidence: [p('heatshield', 'HeatShield'), p('dubai-environmental-twin', 'Env. twin')] },
    ],
  },
  {
    group: 'Programming & development',
    summary: 'Building the applications around the 3D work.',
    skills: [
      { name: 'Python' },
      { name: 'JavaScript', evidence: [p('heatshield', 'HeatShield'), p('dubai-environmental-twin', 'Env. twin')] },
      { name: 'TypeScript' },
      { name: 'Three.js / WebGL', evidence: [p('heatshield', 'HeatShield'), p('dubai-environmental-twin', 'Env. twin')] },
      { name: 'React / Next.js' },
      { name: 'FastAPI' },
      { name: 'Node.js' },
      { name: 'Git' },
      { name: 'REST APIs' },
    ],
  },
  {
    group: 'AI & automation',
    summary: 'AI-assisted development and agent workflows.',
    skills: [
      { name: 'OpenAI Codex', evidence: [p('simready-robotics-workflow', 'SimReady')] },
      { name: 'Claude Code' },
      { name: 'Cursor' },
      { name: 'AI-agent workflows' },
      { name: 'n8n' },
    ],
  },
]

export type Role = {
  title: string
  org: string
  location: string
  period: string
  summary: string
  points: string[]
}

export const experience: Role[] = [
  {
    title: 'Student Research Assistant',
    org: 'Middlesex University Dubai',
    location: 'Dubai, UAE',
    period: 'Sep 2026 – present',
    summary: 'Research assistant on “Cognitive Twins”, a project on AI and digital twins.',
    points: [
      'Generative AI applied to digital-twin content and workflows.',
      '3D reconstruction and spatial computing for capturing real spaces.',
      'Blender workflows for preparing and organising 3D scenes.',
      'Digital-twin pipeline development connecting capture, modelling and visualization tools.',
    ],
  },
  {
    title: 'Digital Marketing Manager',
    org: 'Umang Furnishings',
    location: 'Dubai, UAE',
    period: '',
    summary: 'Digital marketing for a Dubai furnishings company.',
    points: ['Developed Maison Lune, a luxury sub-brand under Umang Furnishings.'],
  },
]

export const education = [
  {
    title: 'MBA, Business Analytics and Artificial Intelligence',
    org: 'Middlesex University Dubai',
    period: 'Jan 2026 – present',
    note: 'Applied research project: Digital Twin Readiness in UAE Industrial Firms.',
  },
  {
    title: 'Bachelor of Computer Applications (BCA)',
    org: 'BYK College of Commerce, Savitribai Phule Pune University',
    period: '',
    note: '',
  },
]

export const certifications = [
  { title: 'Python (Basic)', issuer: 'HackerRank' },
  { title: 'SQL (Basic)', issuer: 'HackerRank' },
]
