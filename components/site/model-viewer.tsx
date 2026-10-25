'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { Box, Expand, Layers, Loader2, RotateCcw, Rotate3d, Shrink, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'shaded' | 'clay' | 'wireframe' | 'xray'
type Info = { width: number; depth: number; height: number; zones: number; nodes: number; meshes: number; floors: number[]; kinds: string[]; units: string }
type Hover = { x: number; y: number; zone?: string; kind?: string; floor?: number; name: string } | null

const MODES: { id: Mode; label: string }[] = [
  { id: 'shaded', label: 'Shaded' },
  { id: 'clay', label: 'Clay' },
  { id: 'wireframe', label: 'Wireframe' },
  { id: 'xray', label: 'X-ray' },
]

const floorLabel = (f: number) => (f === 0 ? 'Ground' : `Floor ${f}`)

/**
 * Inspects the real HeatShield glTF export: render modes, floor isolation, exploded floors,
 * zone-type highlighting and hover labels read from the model's own extras (zoneId, kind, floor).
 */
export function ModelViewer({ src, label }: { src: string; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const api = useRef<{
    setMode: (m: Mode) => void
    setFloor: (f: number | 'all') => void
    setExplode: (on: boolean) => void
    setKind: (k: string | null) => void
    setTurntable: (on: boolean) => void
    reset: () => void
  } | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [started, setStarted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [info, setInfo] = useState<Info | null>(null)
  const [mode, setMode] = useState<Mode>('shaded')
  const [floor, setFloor] = useState<number | 'all'>('all')
  const [explode, setExplode] = useState(false)
  const [kind, setKind] = useState<string | null>(null)
  const [turntable, setTurntable] = useState(true)
  const [hover, setHover] = useState<Hover>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [panel, setPanel] = useState(true)

  useEffect(() => {
    if (window.innerWidth < 768) setPanel(false)
  }, [])

  // Load once the viewer approaches the viewport
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState('loading')
          setStarted(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const host = hostRef.current!
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setState('error')
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.setClearColor(0x000000, 0)
    host.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-label', `Interactive 3D view of ${label}`)
    renderer.domElement.setAttribute('role', 'img')

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.add(new THREE.HemisphereLight('#dfe6ff', '#15171c', 0.9))
    const sun = new THREE.DirectionalLight('#fff3e0', 1.6)
    sun.position.set(60, 90, 40)
    scene.add(sun)
    const grid = new THREE.GridHelper(240, 48, '#2A2E38', '#1A1D24')
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.6
    grid.position.y = -0.55
    scene.add(grid)

    const camera = new THREE.PerspectiveCamera(35, 1, 0.5, 2000)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.maxPolarAngle = Math.PI * 0.49
    controls.autoRotate = !reduce
    controls.autoRotateSpeed = 0.6
    controls.listenToKeyEvents(wrapRef.current!)
    controls.keyPanSpeed = 14

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    const clay = new THREE.MeshStandardMaterial({ color: '#C9C5BE', roughness: 0.9 })
    const wire = new THREE.MeshBasicMaterial({ color: '#7FA8FF', wireframe: true, transparent: true, opacity: 0.55 })
    const xray = new THREE.MeshBasicMaterial({ color: '#8FB2FF', transparent: true, opacity: 0.08, depthWrite: false, side: THREE.DoubleSide })
    const highlight = new THREE.MeshStandardMaterial({ color: '#4D8DFF', emissive: '#2B5BD8', emissiveIntensity: 0.6, roughness: 0.5 })
    const dimmed = new THREE.MeshBasicMaterial({ color: '#3A3F4A', transparent: true, opacity: 0.18, depthWrite: false })

    const meshes: { mesh: THREE.Mesh; original: THREE.Material | THREE.Material[]; kind?: string }[] = []
    const floorGroups: { obj: THREE.Object3D; floor: number; y: number }[] = []
    let root: THREE.Object3D | null = null
    let home = { pos: new THREE.Vector3(), target: new THREE.Vector3() }
    const view = { mode: 'shaded' as Mode, floor: 'all' as number | 'all', explode: 0, explodeTarget: 0, kind: null as string | null }

    const zoneOf = (o: THREE.Object3D | null) => {
      let cur: THREE.Object3D | null = o
      let floorN: number | undefined
      while (cur) {
        if (floorN === undefined && typeof cur.userData.floor === 'number') floorN = cur.userData.floor
        if (cur.userData.zoneId) return { zone: cur.userData.zoneId as string, kind: cur.userData.kind as string | undefined, floor: floorN ?? cur.userData.floor }
        cur = cur.parent
      }
      return { floor: floorN }
    }

    const applyMaterials = () => {
      for (const m of meshes) {
        if (view.kind) m.mesh.material = m.kind === view.kind ? highlight : dimmed
        else if (view.mode === 'shaded') m.mesh.material = m.original
        else if (view.mode === 'clay') m.mesh.material = clay
        else if (view.mode === 'wireframe') m.mesh.material = wire
        else m.mesh.material = xray
      }
    }
    const applyFloors = () => {
      for (const g of floorGroups) g.obj.visible = view.floor === 'all' || g.floor === view.floor
    }

    const loader = new GLTFLoader()
    loader.load(
      src,
      (gltf) => {
        root = gltf.scene
        scene.add(root)
        let nodes = 0
        const zones = new Set<string>()
        const kinds = new Set<string>()
        root.traverse((o) => {
          nodes++
          if (o.userData.zoneId) zones.add(o.userData.zoneId)
          if (typeof o.userData.floor === 'number' && !(o.parent && zoneOf(o.parent).floor !== undefined)) {
            floorGroups.push({ obj: o, floor: o.userData.floor, y: o.position.y })
          }
          const mesh = o as THREE.Mesh
          if (mesh.isMesh) {
            const z = zoneOf(mesh)
            if (z.kind) kinds.add(z.kind)
            meshes.push({ mesh, original: mesh.material, kind: z.kind })
          }
        })
        const box = new THREE.Box3().setFromObject(root)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const radius = size.length() * 0.5
        controls.target.copy(center)
        camera.position.copy(center).add(new THREE.Vector3(radius * 0.95, radius * 0.75, radius * 1.05))
        controls.minDistance = radius * 0.25
        controls.maxDistance = radius * 3
        home = { pos: camera.position.clone(), target: controls.target.clone() }
        const floors = Array.from(new Set(floorGroups.map((g) => g.floor))).sort((a, b) => a - b)
        setInfo({
          width: size.x,
          depth: size.z,
          height: size.y,
          zones: zones.size,
          nodes,
          meshes: meshes.length,
          floors,
          kinds: Array.from(kinds).sort(),
          units: (root.children[0]?.userData?.units as string) || (root.userData?.units as string) || 'metres',
        })
        setState('ready')
        wrapRef.current!.dataset.model = 'ready'
      },
      (e) => e.total && setProgress(Math.round((e.loaded / e.total) * 100)),
      () => setState('error'),
    )

    // Hover labels (mouse), throttled
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    let lastRay = 0
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !root) return
      const now = performance.now()
      if (now - lastRay < 60) return
      lastRay = now
      const r = renderer.domElement.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const hit = raycaster.intersectObject(root, true).find((h) => h.object.visible && (h.object as THREE.Mesh).isMesh)
      if (!hit) return setHover(null)
      const z = zoneOf(hit.object)
      setHover({ x: e.clientX - r.left, y: e.clientY - r.top, zone: z.zone, kind: z.kind, floor: z.floor, name: hit.object.name || hit.object.parent?.name || 'Element' })
    }
    const onLeave = () => setHover(null)
    renderer.domElement.addEventListener('pointermove', onMove)
    renderer.domElement.addEventListener('pointerleave', onLeave)

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(host)
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      view.explode += (view.explodeTarget - view.explode) * (reduce ? 1 : 0.08)
      for (const g of floorGroups) g.obj.position.y = g.y + g.floor * 4.5 * view.explode
      controls.update()
      renderer.render(scene, camera)
    }
    loop()

    api.current = {
      setMode: (m) => {
        view.mode = m
        applyMaterials()
      },
      setFloor: (f) => {
        view.floor = f
        applyFloors()
      },
      setExplode: (on) => (view.explodeTarget = on ? 1 : 0),
      setKind: (k) => {
        view.kind = k
        applyMaterials()
      },
      setTurntable: (on) => (controls.autoRotate = on && !reduce),
      reset: () => {
        camera.position.copy(home.pos)
        controls.target.copy(home.target)
        controls.update()
      },
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      renderer.domElement.removeEventListener('pointermove', onMove)
      renderer.domElement.removeEventListener('pointerleave', onLeave)
      controls.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose?.()
      })
      ;[clay, wire, xray, highlight, dimmed].forEach((m) => m.dispose())
      meshes.forEach((m) => (Array.isArray(m.original) ? m.original.forEach((x) => x.dispose()) : m.original.dispose()))
      scene.environment?.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      api.current = null
    }
  }, [started, src, label])

  useEffect(() => {
    const onFs = () => setFullscreen(document.fullscreenElement === wrapRef.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await wrapRef.current?.requestFullscreen()
    } catch {
      /* fullscreen not supported */
    }
  }, [])

  const btn = (on: boolean) =>
    cn('rounded-full px-3 py-1.5 text-sm transition-colors', on ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-white/[0.06] hover:text-foreground')

  return (
    <div
      ref={wrapRef}
      tabIndex={-1}
      className={cn('relative overflow-hidden rounded-xl border border-border bg-card/60', fullscreen ? 'h-screen rounded-none' : 'h-[78svh] min-h-[480px]')}
    >
      <div aria-hidden className="grid-paper absolute inset-0 opacity-40" />
      <div ref={hostRef} className="absolute inset-0" />

      {state !== 'ready' && (
        <div className="absolute inset-0 grid place-items-center">
          {state === 'error' ? (
            <p className="max-w-sm text-center text-sm text-muted-foreground">The 3D model couldn’t be loaded in this browser. The screenshots below show the same model.</p>
          ) : (
            <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden />
              Loading model{progress ? ` · ${progress}%` : '…'}
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="absolute inset-x-3 top-3 z-10 flex flex-wrap items-start justify-between gap-2">
        <div role="group" aria-label="Render mode" className="glass flex flex-wrap rounded-full p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id && !kind}
              disabled={state !== 'ready'}
              onClick={() => {
                setMode(m.id)
                setKind(null)
                api.current?.setKind(null)
                api.current?.setMode(m.id)
              }}
              className={btn(mode === m.id && !kind)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="glass flex rounded-full p-1">
          <button type="button" disabled={state !== 'ready'} onClick={() => api.current?.reset()} className={btn(false)} aria-label="Reset camera" title="Reset camera">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-pressed={turntable}
            disabled={state !== 'ready'}
            onClick={() => {
              setTurntable((v) => {
                api.current?.setTurntable(!v)
                return !v
              })
            }}
            className={btn(turntable)}
            aria-label="Turntable rotation"
            title="Turntable rotation"
          >
            <Rotate3d className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-pressed={panel}
            aria-controls="model-panel"
            disabled={state !== 'ready'}
            onClick={() => setPanel((v) => !v)}
            className={btn(panel)}
            aria-label={panel ? 'Hide inspection panel' : 'Show inspection panel'}
            title={panel ? 'Hide inspection panel' : 'Show inspection panel'}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <button type="button" onClick={toggleFullscreen} className={btn(false)} aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {fullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Inspection panel */}
      {info && panel && (
        <aside id="model-panel" className="glass absolute bottom-3 left-3 z-10 max-h-[calc(100%-5rem)] w-[min(19rem,calc(100%-1.5rem))] overflow-y-auto rounded-xl !bg-background/85 p-4 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <Box className="h-4 w-4 text-accent" aria-hidden />
            Model inspection
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            <dt className="text-muted-foreground">Footprint</dt>
            <dd className="annotation !text-foreground">
              {info.width.toFixed(0)} × {info.depth.toFixed(0)} m
            </dd>
            <dt className="text-muted-foreground">Height</dt>
            <dd className="annotation !text-foreground">{info.height.toFixed(1)} m</dd>
            <dt className="text-muted-foreground">Thermal zones</dt>
            <dd className="annotation !text-foreground">{info.zones}</dd>
            <dt className="text-muted-foreground">Meshes / nodes</dt>
            <dd className="annotation !text-foreground">
              {info.meshes.toLocaleString()} / {info.nodes.toLocaleString()}
            </dd>
          </dl>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-muted-foreground">Isolate floor</span>
              <select
                className="mt-1 h-9 w-full rounded-md border border-border bg-background/80 px-2"
                value={String(floor)}
                onChange={(e) => {
                  const v = e.target.value === 'all' ? 'all' : Number(e.target.value)
                  setFloor(v)
                  api.current?.setFloor(v)
                }}
              >
                <option value="all">All floors</option>
                {info.floors.map((f) => (
                  <option key={f} value={f}>
                    {floorLabel(f)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-muted-foreground">Highlight zone type</span>
              <select
                className="mt-1 h-9 w-full rounded-md border border-border bg-background/80 px-2 capitalize"
                value={kind ?? ''}
                onChange={(e) => {
                  const v = e.target.value || null
                  setKind(v)
                  api.current?.setKind(v)
                }}
              >
                <option value="">None</option>
                {info.kinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              aria-pressed={explode}
              onClick={() => {
                setExplode((v) => {
                  api.current?.setExplode(!v)
                  return !v
                })
              }}
              className={cn('btn w-full !py-2 text-sm', explode ? 'btn-primary' : 'btn-ghost')}
            >
              <Layers className="h-4 w-4" aria-hidden />
              {explode ? 'Collapse floors' : 'Explode floors'}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Drag to orbit · scroll or pinch to zoom · right-drag or arrow keys to pan.</p>
        </aside>
      )}

      {hover && (
        <div className="pointer-events-none absolute z-20 rounded-md border border-border bg-background/90 px-2.5 py-1.5 text-xs shadow-lg" style={{ left: hover.x + 14, top: hover.y + 14 }}>
          <p className="font-medium text-foreground">{hover.name}</p>
          {(hover.zone || hover.floor !== undefined) && (
            <p className="annotation mt-0.5">
              {hover.zone ? `${hover.zone} · ` : ''}
              {hover.kind ? `${hover.kind} · ` : ''}
              {hover.floor !== undefined ? floorLabel(hover.floor) : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
