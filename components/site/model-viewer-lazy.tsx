'use client'

import dynamic from 'next/dynamic'

/** Loads the viewer (and three.js) only on pages that show a model. */
export const ModelViewerLazy = dynamic(() => import('./model-viewer').then((m) => m.ModelViewer), {
  ssr: false,
  loading: () => <div className="h-[78svh] min-h-[480px] rounded-xl border border-border bg-card/60" aria-hidden />,
})
