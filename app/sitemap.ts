import type { MetadataRoute } from 'next'
import { projects } from '@/lib/projects'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ]
}
