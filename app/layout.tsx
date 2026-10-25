import { Space_Grotesk, Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import Script from 'next/script'

export const dynamic = 'force-dynamic'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['300', '400', '500', '600', '700'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['300', '400', '500', '600', '700', '800'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Siddharth Dialani — AI Engineer | Building Intelligent Systems',
  description: 'AI Engineer specializing in autonomous AI systems, LLM applications, and production-ready AI solutions. MBA in Business Analytics & AI. Building the future with Claude Code, Cursor, and cutting-edge AI.',
  keywords: ['AI Engineer', 'Siddharth Dialani', 'AI Automation', 'LLM Engineer', 'Claude Code', 'Full Stack AI Developer', 'Dubai AI Engineer'],
  authors: [{ name: 'Siddharth Dialani' }],
  creator: 'Siddharth Dialani',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Siddharth Dialani — AI Engineer',
    description: 'Building intelligent systems that solve real-world problems. AI-first full stack builder.',
    siteName: 'Siddharth Dialani Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siddharth Dialani — AI Engineer',
    description: 'Building intelligent systems that solve real-world problems.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jakarta.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
