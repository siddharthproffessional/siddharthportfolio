'use client'

import { useState } from 'react'
import { ArrowUpRight, Play } from 'lucide-react'

/**
 * Loads the deployed application in an iframe only when asked, so project pages stay fast.
 * If the app refuses to be framed, the "open in a new tab" link still works.
 */
export function LivePreview({ src, title, poster }: { src: string; title: string; poster?: string }) {
  const [on, setOn] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="font-medium">Interactive preview</p>
        <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
          Open in a new tab
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
      {on ? (
        <iframe
          src={src}
          title={`${title} — live application`}
          className="block h-[70vh] min-h-[420px] w-full bg-background"
          loading="lazy"
          allow="fullscreen"
          referrerPolicy="no-referrer"
        />
      ) : (
        <button
          type="button"
          onClick={() => setOn(true)}
          className="group relative block aspect-[16/9] w-full overflow-hidden bg-background"
          aria-label={`Load the live ${title} application here`}
        >
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover object-left-top opacity-40 transition-opacity group-hover:opacity-55" />
          )}
          <span className="btn btn-primary relative">
            <Play className="h-4 w-4" aria-hidden />
            Run the live app here
          </span>
          <span className="absolute inset-x-0 bottom-3 text-center text-xs text-muted-foreground">Loads the deployed application. Values inside it are simulated.</span>
        </button>
      )}
    </div>
  )
}
