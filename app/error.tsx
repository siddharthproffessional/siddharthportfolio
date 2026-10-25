'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-page pb-24 pt-40">
      <p className="annotation">Error</p>
      <h1 className="mt-4 text-6xl">This page didn’t load.</h1>
      <p className="mt-4 max-w-lg text-muted-foreground">Something went wrong while rendering it. Try again, or go back to the home page.</p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Go to the home page
        </Link>
      </div>
    </section>
  )
}
