import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/sitemap.xml`,
  }
}
