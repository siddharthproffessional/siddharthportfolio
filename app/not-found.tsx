import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-page py-24">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">This address doesn’t match a page on the portfolio.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-foreground">
          Go to the home page
        </Link>
        <Link href="/#projects" className="rounded-md border border-border px-4 py-2">
          Browse projects
        </Link>
      </div>
    </section>
  )
}
