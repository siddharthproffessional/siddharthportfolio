export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center pt-16" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="relative block h-px w-40 overflow-hidden bg-white/10">
          <span className="flow-pulse absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </span>
        <span className="annotation">Loading</span>
      </div>
    </div>
  )
}
