import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { Nav } from '@/components/site/nav'
import { Footer, BackToTop } from '@/components/site/footer'
import { Assistant } from '@/components/site/assistant'
import { site, siteUrl } from '@/lib/site'
import { getResume } from '@/lib/resume'

const description =
  'Digital twin and simulation portfolio of Siddharth Dialani, Dubai: browser-based building twins, OpenUSD interoperability, Blender scene preparation and AI-assisted engineering workflows.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${site.name} — Digital Twin & Simulation Engineer`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: ['Digital Twin Engineer', 'Simulation Engineer', 'OpenUSD', 'NVIDIA Omniverse', 'Isaac Sim', 'Blender', 'Three.js', 'Dubai', site.name],
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    siteName: site.name,
    title: `${site.name} — Digital Twin & Simulation Engineer`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Digital Twin & Simulation Engineer`,
    description,
  },
  icons: { icon: '/favicon.svg' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0D141C',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const resume = getResume()
  return (
    <html lang="en" className="dark">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div id="top" tabIndex={-1} className="outline-none" />
        <Nav resume={resume} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <Assistant />
        <Toaster />
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
