'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { Media } from '@/lib/projects'

export function MediaGallery({ media, title }: { media: Media[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const open = index !== null
  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + media.length) % media.length)), [media.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  if (!media.length) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
        <ImageOff className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p>Screenshots, renders or recordings for this project are not published yet. Nothing is shown rather than placeholder imagery.</p>
      </div>
    )
  }

  const current = index !== null ? media[index] : null

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {media.map((m, i) => (
          <li key={m.src} className={m.height > m.width ? 'sm:max-w-[14rem]' : ''}>
            <figure>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="block w-full overflow-hidden rounded-md border border-border hover:border-accent/60"
                aria-label={`Enlarge image ${i + 1} of ${media.length}: ${m.caption}`}
              >
                <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="(min-width: 768px) 520px, 100vw" className="h-auto w-full" />
              </button>
              <figcaption className="mt-2 text-sm text-muted-foreground">{m.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent className="max-h-[94vh] max-w-[min(96vw,1400px)] overflow-auto border-border bg-background p-4 sm:p-6">
          {current && (
            <>
              <DialogTitle className="pr-8 text-base font-medium">
                {title} — image {index! + 1} of {media.length}
              </DialogTitle>
              <DialogDescription>{current.caption}</DialogDescription>
              <Image src={current.src} alt={current.alt} width={current.width} height={current.height} className="mx-auto h-auto max-h-[72vh] w-auto rounded-md border border-border" />
              {media.length > 1 && (
                <div className="flex justify-between">
                  <button type="button" onClick={() => go(-1)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:text-accent">
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                    Previous
                  </button>
                  <button type="button" onClick={() => go(1)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:text-accent">
                    Next
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
