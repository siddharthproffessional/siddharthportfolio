import type { Film } from '@/lib/projects'

/**
 * Plays a project film from /public. Nothing is downloaded until the visitor presses play
 * (preload="none"), so the page stays light; the poster is a frame from the film.
 */
export function ProjectFilm({ film }: { film: Film }) {
  const minutes = Math.floor(film.durationSeconds / 60)
  const seconds = String(film.durationSeconds % 60).padStart(2, '0')
  return (
    <figure className="overflow-hidden rounded-xl border border-border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="font-medium">{film.title}</p>
        <span className="annotation">
          Film · {minutes}:{seconds}
        </span>
      </div>
      <video
        className="block h-auto w-full bg-background"
        src={film.src}
        poster={film.poster}
        width={film.width}
        height={film.height}
        controls
        playsInline
        preload="none"
        aria-label={film.title}
      >
        <a href={film.src}>Download the film</a>
      </video>
      <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{film.caption}</figcaption>
    </figure>
  )
}
