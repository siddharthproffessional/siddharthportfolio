'use client'

import { useEffect, useRef } from 'react'
import { District, EMPTY, lerp, smooth, type DistrictState } from '@/lib/three/district'

import type { HeroStage } from '@/lib/three/stages'

/** Hero timeline: wireframe draws, surfaces form as clay, then resolve into a material render with moving light. */
function heroState(t: number): DistrictState {
  return {
    ...EMPTY,
    wire: smooth(0.2, 1.6, t) * (1 - 0.8 * smooth(2.8, 3.8, t)),
    vertices: smooth(0.4, 1.3, t) * (1 - smooth(2.6, 3.4, t)),
    dims: smooth(1.0, 2.0, t) * (1 - smooth(5.6, 6.6, t)),
    solid: smooth(2.5, 3.3, t),
    material: smooth(4.2, 6.0, t),
    sun: 0.3 + 0.38 * (0.5 - 0.5 * Math.cos((Math.max(0, t - 5) / 38) * Math.PI * 2)),
  }
}
function heroStage(t: number): HeroStage {
  return t < 2.8 ? 'Wireframe' : t < 4.6 ? 'Clay' : 'Material'
}

/** Scroll story: five equal bands of progress, one per pipeline stage. */
function storyState(p: number): DistrictState {
  const st = THREE_clamp(p, 0, 1) * 5
  const points = smooth(0, 0.15, st) * (1 - 0.7 * smooth(1.0, 1.6, st)) * (1 - smooth(1.9, 2.3, st))
  return {
    ...EMPTY,
    points,
    sweep: smooth(0.05, 0.92, st),
    wire: smooth(1.0, 1.4, st) * (1 - 0.65 * smooth(2.1, 2.5, st)),
    vertices: smooth(1.05, 1.4, st) * (1 - smooth(1.85, 2.15, st)),
    dims: smooth(1.2, 1.5, st) * (1 - smooth(1.9, 2.2, st)),
    solid: smooth(2.0, 2.35, st),
    explode: smooth(2.3, 2.65, st) * (1 - smooth(2.85, 3.1, st)),
    heat: smooth(3.0, 3.3, st) * (1 - smooth(4.0, 4.3, st)),
    sun: st < 4 ? lerp(0.12, 0.88, smooth(3.1, 3.95, st)) : lerp(0.88, 0.4, smooth(4.0, 4.4, st)),
    material: smooth(4.05, 4.45, st),
    select: smooth(4.35, 4.65, st),
  }
}
function THREE_clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v))
}

type Props =
  | { mode: 'hero'; onStage?: (s: HeroStage) => void; className?: string; progress?: never }
  | { mode: 'story'; progress: { current: number }; onStage?: (i: number) => void; className?: string }

export default function DistrictCanvas(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const propsRef = useRef(props)
  propsRef.current = props

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const mode = propsRef.current.mode
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    // ?quality=low forces the lightweight path (used for documentation captures)
    const forcedLow = new URLSearchParams(window.location.search).get('quality') === 'low'
    const lowPower = forcedLow || coarse || (navigator.hardwareConcurrency ?? 8) <= 4

    let district: District
    try {
      district = new District(host, { quality: lowPower ? 'low' : 'high' })
    } catch {
      host.dataset.webgl = 'unavailable'
      return
    }
    const canvas = district.renderer.domElement
    canvas.style.touchAction = 'pan-y'
    canvas.style.opacity = '0'
    canvas.style.transition = 'opacity 900ms cubic-bezier(0.22,1,0.36,1)'

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      district.shift = mode === 'hero' && w >= 1024 ? w * 0.24 : 0
      district.resize(w, h)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
    io.observe(host)

    // Pointer parallax (mouse) and drag-to-rotate (mouse + horizontal touch)
    const parallaxTarget = { x: 0, y: 0 }
    let userOrbit = 0
    let velocity = 0
    let dragging = false
    let lastX = 0
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        parallaxTarget.x = (e.clientX / window.innerWidth - 0.5) * 2
        parallaxTarget.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
      if (dragging) {
        const dx = e.clientX - lastX
        lastX = e.clientX
        velocity = dx * 0.006
        userOrbit += velocity
      }
    }
    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      canvas.style.cursor = 'grabbing'
    }
    const onUp = () => {
      dragging = false
      canvas.style.cursor = 'grab'
    }
    canvas.style.cursor = 'grab'
    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    let raf = 0
    let t = 0
    let last = performance.now()
    let lastStage: string | number | null = null
    let shown = false
    let lastKey = ''
    // Documentation captures can pin the hero timeline: /?scene-t=<seconds>
    const pinned = new URLSearchParams(window.location.search).get('scene-t')
    const pinnedT = pinned !== null && Number.isFinite(Number(pinned)) ? Number(pinned) : null

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!visible || document.hidden) return
      t += dt
      if (!dragging) {
        velocity *= 0.94
        userOrbit += velocity
      }
      district.parallax.x += (parallaxTarget.x - district.parallax.x) * 0.05
      district.parallax.y += (parallaxTarget.y - district.parallax.y) * 0.05

      const p = propsRef.current
      if (p.mode === 'hero') {
        const tt = pinnedT ?? (reduce ? 8 : t)
        // Scroll dolly: camera rises toward a plan view as the hero leaves the screen
        const rect = host.getBoundingClientRect()
        district.dolly = THREE_clamp(-rect.top / Math.max(rect.height, 1), 0, 1)
        district.distance = host.clientWidth < 700 ? 1.22 : 1
        district.orbit = 0.78 + (reduce && pinnedT === null ? 0 : tt * 0.035) + userOrbit
        district.apply(heroState(tt))
        const stage = heroStage(tt)
        if (stage !== lastStage) {
          lastStage = stage
          p.onStage?.(stage)
        }
      } else {
        const prog = p.progress.current
        district.orbit = 0.55 + prog * 1.3 + userOrbit
        district.dolly = 0
        district.distance = host.clientWidth < 700 ? 1.18 : 1.12
        district.apply(storyState(prog))
        const idx = Math.min(4, Math.floor(THREE_clamp(prog, 0, 0.9999) * 5))
        if (idx !== lastStage) {
          lastStage = idx
          p.onStage?.(idx)
        }
      }
      // Skip identical frames (idle story, reduced motion) to save power
      const key = `${district.orbit.toFixed(4)}|${district.dolly.toFixed(4)}|${district.parallax.x.toFixed(3)}|${district.parallax.y.toFixed(3)}|${p.mode === 'story' ? p.progress.current.toFixed(4) : (pinnedT ?? (reduce ? 8 : t)).toFixed(2)}`
      if (key === lastKey && shown) return
      lastKey = key
      district.render()
      if (!shown) {
        shown = true
        canvas.style.opacity = '1'
        host.dataset.webgl = 'ready'
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      district.dispose()
    }
  }, [])

  return <div ref={hostRef} className={props.className} />
}
