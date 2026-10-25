import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-page pb-24 pt-40">
      <p className="annotation">404</p>
      <h1 className="mt-4 text-6xl">Page not found</h1>
      <p className="mt-4 text-muted-foreground">This address doesn’t match a page on the portfolio.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn btn-primary">
          Go to the home page
        </Link>
        <Link href="/#projects" className="btn btn-ghost">
          Browse projects
        </Link>
      </div>
    </section>
  )
}
