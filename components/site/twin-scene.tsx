'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Hero animation: an illustrative district twin that loops through the pipeline
 * the portfolio is about — a LiDAR-style scan builds a point cloud (Capture), edges are
 * drawn over it (Model), then solid massing is shaded by a sun-driven heat map (Simulate).
 * All geometry and values are illustrative, not project data.
 */

export type Stage = 0 | 1 | 2

type Building = { x: number; z: number; w: number; d: number; h: number; roof: number }

const BUILDINGS: Building[] = [
  { x: 0, z: 0, w: 6, d: 6, h: 15, roof: 1 },
  { x: 0, z: 0, w: 10, d: 9, h: 3, roof: 0.9 }, // podium
  { x: -10, z: -6, w: 6, d: 5, h: 8, roof: 0.5 }, // reflective roof
  { x: 9, z: -7, w: 5, d: 7, h: 10, roof: 0.95 },
  { x: -9, z: 7, w: 7, d: 5, h: 5, roof: 0.62 }, // green roof
  { x: 9, z: 7, w: 6, d: 5, h: 6.5, roof: 1 },
  { x: -1, z: -14, w: 16, d: 5, h: 4, roof: 0.8 }, // low hall
  { x: 15, z: 1, w: 4, d: 4, h: 4.5, roof: 0.9 },
  { x: -16, z: 1, w: 4, d: 6, h: 3.5, roof: 0.75 },
]

const LOOP = 19 // seconds
const T_MODEL = 5
const T_SIM = 9
const T_FADE = 18

const COLOR = {
  bg: new THREE.Color('#0D141C'),
  teal: new THREE.Color('#5EC4B6'),
  grid: new THREE.Color('#243444'),
  gridMajor: new THREE.Color('#2E4356'),
}

// Heat ramp: cool slate-blue → teal → amber → hot coral
const RAMP = ['#1A3242', '#2C6670', '#C49A4A', '#CF5E3C'].map((c) => new THREE.Color(c))
function heat(t: number, out: THREE.Color) {
  const x = THREE.MathUtils.clamp(t, 0, 1) * (RAMP.length - 1)
  const i = Math.min(Math.floor(x), RAMP.length - 2)
  return out.copy(RAMP[i]).lerp(RAMP[i + 1], x - i)
}

const smooth = (a: number, b: number, t: number) => THREE.MathUtils.smoothstep(t, a, b)

function samplePoints(count: number) {
  const faces: { o: THREE.Vector3; u: THREE.Vector3; v: THREE.Vector3; area: number }[] = []
  for (const b of BUILDINGS) {
    const x0 = b.x - b.w / 2, z0 = b.z - b.d / 2
    faces.push({ o: new THREE.Vector3(x0, b.h, z0), u: new THREE.Vector3(b.w, 0, 0), v: new THREE.Vector3(0, 0, b.d), area: b.w * b.d })
    faces.push({ o: new THREE.Vector3(x0, 0, z0 + b.d), u: new THREE.Vector3(b.w, 0, 0), v: new THREE.Vector3(0, b.h, 0), area: b.w * b.h })
    faces.push({ o: new THREE.Vector3(x0, 0, z0), u: new THREE.Vector3(b.w, 0, 0), v: new THREE.Vector3(0, b.h, 0), area: b.w * b.h })
    faces.push({ o: new THREE.Vector3(x0, 0, z0), u: new THREE.Vector3(0, 0, b.d), v: new THREE.Vector3(0, b.h, 0), area: b.d * b.h })
    faces.push({ o: new THREE.Vector3(x0 + b.w, 0, z0), u: new THREE.Vector3(0, 0, b.d), v: new THREE.Vector3(0, b.h, 0), area: b.d * b.h })
  }
  const total = faces.reduce((s, f) => s + f.area, 0)
  const buildingPts = Math.floor(count * 0.86)
  const pos = new Float32Array(count * 3)
  let k = 0
  for (const f of faces) {
    const n = Math.round((f.area / total) * buildingPts)
    for (let i = 0; i < n && k < buildingPts; i++, k++) {
      const p = f.o.clone().addScaledVector(f.u, Math.random()).addScaledVector(f.v, Math.random())
      pos.set([p.x, p.y, p.z], k * 3)
    }
  }
  // Ground returns, like a terrestrial scan
  for (; k < count; k++) {
    const r = 6 + Math.random() * 20
    const a = Math.random() * Math.PI * 2
    pos.set([Math.cos(a) * r, 0.02, Math.sin(a) * r], k * 3)
  }
  return pos
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,214,150,0.9)')
  grd.addColorStop(0.35, 'rgba(255,190,110,0.25)')
  grd.addColorStop(1, 'rgba(255,190,110,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

export default function TwinScene({ onStage, className }: { onStage?: (s: Stage, progress: number) => void; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const stageCb = useRef(onStage)
  stageCb.current = onStage

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      host.dataset.webgl = 'unavailable'
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.style.touchAction = coarse ? 'pan-y' : 'none'

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(COLOR.bg, 60, 125)

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400)
    camera.position.set(44, 30, 42)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 4, 0)
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.autoRotate = !reduce
    controls.autoRotateSpeed = 0.55
    controls.minPolarAngle = 0.55
    controls.maxPolarAngle = 1.35
    controls.enabled = !coarse

    // Ground grid
    const grid = new THREE.GridHelper(80, 40, COLOR.gridMajor, COLOR.grid)
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.55
    scene.add(grid)
    const fine = new THREE.GridHelper(80, 160, COLOR.grid, COLOR.grid)
    ;(fine.material as THREE.Material).transparent = true
    ;(fine.material as THREE.Material).opacity = 0.18
    fine.position.y = 0.01
    scene.add(fine)

    // Solids (per-face vertex colours driven by sun exposure)
    const solidMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0 })
    const edgeMat = new THREE.LineBasicMaterial({ color: COLOR.teal, transparent: true, opacity: 0 })
    const floorMat = new THREE.LineBasicMaterial({ color: '#0D141C', transparent: true, opacity: 0 })
    const solids: { mesh: THREE.Mesh; normals: THREE.BufferAttribute; positions: THREE.BufferAttribute; colors: THREE.BufferAttribute; h: number; roofK: number }[] = []
    for (const b of BUILDINGS) {
      const seg = (v: number) => Math.max(1, Math.ceil(v / 1.2))
      const g = new THREE.BoxGeometry(b.w, b.h, b.d, seg(b.w), seg(b.h), seg(b.d)).toNonIndexed()
      g.translate(b.x, b.h / 2, b.z)
      const colors = new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3)
      g.setAttribute('color', colors)
      const mesh = new THREE.Mesh(g, solidMat)
      scene.add(mesh)
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(b.w, b.h, b.d)), edgeMat)
      edges.position.set(b.x, b.h / 2, b.z)
      scene.add(edges)
      solids.push({ mesh, normals: g.attributes.normal as THREE.BufferAttribute, positions: g.attributes.position as THREE.BufferAttribute, colors, h: b.h, roofK: b.roof })
      // Floor lines every 3.2 m give the massing a sense of scale
      const fl: THREE.Vector3[] = []
      const x0 = b.x - b.w / 2 - 0.02, x1 = b.x + b.w / 2 + 0.02, z0 = b.z - b.d / 2 - 0.02, z1 = b.z + b.d / 2 + 0.02
      for (let y = 3.2; y < b.h - 0.5; y += 3.2) {
        fl.push(new THREE.Vector3(x0, y, z0), new THREE.Vector3(x1, y, z0), new THREE.Vector3(x1, y, z0), new THREE.Vector3(x1, y, z1))
        fl.push(new THREE.Vector3(x1, y, z1), new THREE.Vector3(x0, y, z1), new THREE.Vector3(x0, y, z1), new THREE.Vector3(x0, y, z0))
      }
      if (fl.length) scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(fl), floorMat))
    }

    // Point cloud with scan sweep
    const COUNT = coarse ? 3600 : 6500
    const pts = samplePoints(COUNT)
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSweep: { value: -40 },
        uOpacity: { value: 1 },
        uColor: { value: COLOR.teal },
        uScale: { value: renderer.getPixelRatio() },
      },
      vertexShader: /* glsl */ `
        uniform float uSweep; uniform float uScale;
        varying float vVis; varying float vEdge;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float d = uSweep - position.x;
          vVis = step(0.0, d);
          vEdge = 1.0 - smoothstep(0.0, 2.5, d);
          gl_PointSize = (1.5 + vEdge * 2.2) * uScale * (150.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity; uniform vec3 uColor;
        varying float vVis; varying float vEdge;
        void main() {
          if (vVis < 0.5) discard;
          vec2 c = gl_PointCoord - 0.5;
          float a = smoothstep(0.5, 0.15, length(c));
          vec3 col = mix(uColor, vec3(0.92, 1.0, 0.97), vEdge * 0.7);
          gl_FragColor = vec4(col, a * uOpacity * (0.55 + vEdge * 0.45));
        }`,
    })
    const cloud = new THREE.Points(pGeo, pMat)
    scene.add(cloud)

    // Scan plane
    // Scan sheet: a thin outlined frame with a very faint fill, sweeping along x
    const scan = new THREE.Group()
    const frameGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -9, -23), new THREE.Vector3(0, 9, -23), new THREE.Vector3(0, 9, 23), new THREE.Vector3(0, -9, 23), new THREE.Vector3(0, -9, -23),
    ])
    const scanEdge = new THREE.Line(frameGeo, new THREE.LineBasicMaterial({ color: '#BFF3EA', transparent: true, opacity: 0, depthWrite: false }))
    const scanSheet = new THREE.Mesh(
      new THREE.PlaneGeometry(46, 18),
      new THREE.MeshBasicMaterial({ color: COLOR.teal, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
    )
    scanSheet.rotation.y = Math.PI / 2
    scan.add(scanEdge, scanSheet)
    scan.position.y = 9
    scene.add(scan)

    // Sun
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, opacity: 0, depthWrite: false }))
    sun.scale.set(9, 9, 1)
    scene.add(sun)
    const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 20), new THREE.MeshBasicMaterial({ color: '#FFD9A0', transparent: true, opacity: 0 }))
    scene.add(sunCore)

    const sunDir = new THREE.Vector3()
    const n = new THREE.Vector3()
    const p = new THREE.Vector3()
    const tmp = new THREE.Color()
    const base = new THREE.Color('#101B25')

    function shade(dayT: number) {
      // Sun arc east → west
      const az = THREE.MathUtils.lerp(-1.25, 1.25, dayT)
      const el = Math.sin(dayT * Math.PI) * 1.05 + 0.08
      sunDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el) * 0.6).normalize()
      sun.position.copy(sunDir).multiplyScalar(48)
      sunCore.position.copy(sun.position)
      const intensity = Math.sin(dayT * Math.PI)
      for (const s of solids) {
        const arr = s.colors.array as Float32Array
        for (let i = 0; i < s.normals.count; i++) {
          n.fromBufferAttribute(s.normals, i)
          p.fromBufferAttribute(s.positions, i)
          const roof = n.y > 0.5
          // Upper floors see more sky; lower floors are shaded by neighbours. Roofs vary by finish.
          const heightF = roof ? s.roofK : 0.5 + 0.45 * Math.min(1, p.y / Math.max(s.h, 1))
          const texture = 0.11 * Math.sin(p.x * 0.55 + p.z * 0.35) * Math.cos(p.z * 0.6 - p.x * 0.2)
          const exposure = Math.max(0, n.dot(sunDir)) * (0.35 + 0.65 * intensity) * heightF
          heat(exposure * 0.82 + (roof ? 0.06 * intensity : 0) + texture * intensity, tmp)
          const lambert = 0.38 + 0.62 * Math.max(0, n.dot(sunDir) * 0.85 + 0.15)
          tmp.lerp(base, roof ? 0.05 : 0.4).multiplyScalar(lambert)
          arr[i * 3] = tmp.r
          arr[i * 3 + 1] = tmp.g
          arr[i * 3 + 2] = tmp.b
        }
        s.colors.needsUpdate = true
      }
    }

    let lastStage = -1
    function update(t: number) {
      const tt = t % LOOP
      const stage: Stage = tt < T_MODEL ? 0 : tt < T_SIM ? 1 : 2
      const progress = stage === 0 ? tt / T_MODEL : stage === 1 ? (tt - T_MODEL) / (T_SIM - T_MODEL) : (tt - T_SIM) / (LOOP - T_SIM)
      const fadeOut = 1 - smooth(T_FADE, LOOP, tt)

      // Capture
      const sweep = THREE.MathUtils.lerp(-24, 26, smooth(0.2, 4.4, tt))
      pMat.uniforms.uSweep.value = tt < T_FADE ? sweep : 40
      scan.position.x = sweep
      const scanVis = (1 - smooth(4.0, 4.8, tt)) * smooth(0, 0.4, tt)
      ;(scanEdge.material as THREE.LineBasicMaterial).opacity = 0.6 * scanVis
      ;(scanSheet.material as THREE.MeshBasicMaterial).opacity = 0.035 * scanVis
      const pointOpacity = tt < T_MODEL ? 1 : tt < T_SIM ? THREE.MathUtils.lerp(1, 0.35, smooth(T_MODEL, T_MODEL + 2, tt)) : THREE.MathUtils.lerp(0.35, 0, smooth(T_SIM, T_SIM + 1.2, tt))
      pMat.uniforms.uOpacity.value = pointOpacity * fadeOut

      // Model
      edgeMat.opacity = smooth(T_MODEL, T_MODEL + 1.6, tt) * (tt > T_SIM ? THREE.MathUtils.lerp(1, 0.4, smooth(T_SIM, T_SIM + 1.2, tt)) : 1) * fadeOut

      // Simulate
      const solidIn = smooth(T_SIM, T_SIM + 1.2, tt) * fadeOut
      solidMat.opacity = solidIn
      floorMat.opacity = solidIn * 0.55
      const dayT = THREE.MathUtils.clamp((tt - T_SIM - 0.4) / (T_FADE - T_SIM - 0.6), 0, 1)
      if (tt >= T_SIM) shade(dayT)
      ;(sun.material as THREE.SpriteMaterial).opacity = solidIn * 0.9
      ;(sunCore.material as THREE.MeshBasicMaterial).opacity = solidIn

      if (stage !== lastStage || Math.random() < 0.08) {
        lastStage = stage
        stageCb.current?.(stage, progress)
      }
    }

    function resize() {
      const w = host!.clientWidth
      const h = host!.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = `${w}px`
      renderer.domElement.style.height = `${h}px`
      camera.aspect = w / h
      // On wide layouts shift the model right so the headline keeps clear space.
      const shift = w >= 1024 ? w * 0.25 : 0
      if (shift) camera.setViewOffset(w, h, -shift, 0, w, h)
      else camera.clearViewOffset()
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 })
    io.observe(host)

    const clock = new THREE.Clock()
    let elapsed = 0
    let raf = 0

    // Deterministic frame for documentation captures: /?twin-t=<seconds>
    const fixedT = Number(new URLSearchParams(window.location.search).get('twin-t'))
    if (Number.isFinite(fixedT) && new URLSearchParams(window.location.search).has('twin-t')) {
      update(fixedT)
      const angle = (fixedT / 109) * Math.PI * 2
      const offset = camera.position.clone().sub(controls.target).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
      camera.position.copy(controls.target).add(offset)
      camera.lookAt(controls.target)
      renderer.render(scene, camera)
      host.dataset.webgl = 'frame'
      return () => {
        ro.disconnect()
        io.disconnect()
        controls.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    if (reduce) {
      // Static frame: finished model with a midday heat map.
      update(T_SIM + 4.6)
      controls.addEventListener('change', () => renderer.render(scene, camera))
      renderer.render(scene, camera)
      const tick = () => {
        controls.update()
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop)
        const dt = Math.min(clock.getDelta(), 0.05)
        if (!visible || document.hidden) return
        elapsed += dt
        update(elapsed)
        controls.update()
        renderer.render(scene, camera)
      }
      raf = requestAnimationFrame(loop)
    }
    host.dataset.webgl = 'ready'

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      controls.dispose()
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose?.()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose?.()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className={className} />
}
