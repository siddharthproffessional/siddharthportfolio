import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('./components/navbar'), { ssr: false })
const ScrollProgress = dynamic(() => import('./components/scroll-progress'), { ssr: false })
const Hero = dynamic(() => import('./components/hero'), { ssr: false })
const About = dynamic(() => import('./components/about'), { ssr: false })
const AnimatedCounter = dynamic(() => import('./components/animated-counter'), { ssr: false })
const Skills = dynamic(() => import('./components/skills'), { ssr: false })
const Projects = dynamic(() => import('./components/projects'), { ssr: false })
const BuildingTimeline = dynamic(() => import('./components/building-timeline'), { ssr: false })
const Education = dynamic(() => import('./components/education'), { ssr: false })
const Certifications = dynamic(() => import('./components/certifications'), { ssr: false })
const Services = dynamic(() => import('./components/services'), { ssr: false })
const TechStack = dynamic(() => import('./components/tech-stack'), { ssr: false })
const Contact = dynamic(() => import('./components/contact'), { ssr: false })
const Footer = dynamic(() => import('./components/footer'), { ssr: false })
const AIAssistant = dynamic(() => import('./components/ai-assistant'), { ssr: false })

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <AnimatedCounter />
      <Skills />
      <Projects />
      <BuildingTimeline />
      <Education />
      <Certifications />
      <Services />
      <TechStack />
      <Contact />
      <Footer />
      <AIAssistant />
    </main>
  )
}
