import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Illustrative "district twin" used by the hero and the process story.
 * Every visual layer is driven by a single numeric state so the same scene can be
 * animated by time (hero) or by scroll position (process section).
 * Geometry and values are conceptual — not data from any project.
 */

export type DistrictState = {
  /** Point-cloud opacity 0..1 */
  points: number
  /** Scan sweep progress 0..1 (left → right) */
  sweep: number
  /** Wireframe edge opacity 0..1 */
  wire: number
  /** Vertex highlight opacity 0..1 */
  vertices: number
  /** Dimension guide opacity 0..1 */
  dims: number
  /** Solid surfaces opacity 0..1 */
  solid: number
  /** 0 = clay render, 1 = glass/steel material render */
  material: number
  /** 0 = base colours, 1 = surface heat map */
  heat: number
  /** Time of day 0 (sunrise) .. 1 (sunset) */
  sun: number
  /** Floor separation 0..1 (exploded view) */
  explode: number
  /** Selection highlight on the tower 0..1 */
  select: number
}

export const EMPTY: DistrictState = { points: 0, sweep: 0, wire: 0, vertices: 0, dims: 0, solid: 0, material: 0, heat: 0, sun: 0.45, explode: 0, select: 0 }

type Building = { x: number; z: number; w: number; d: number; h: number; roof: number }

const BUILDINGS: Building[] = [
  { x: 0, z: 0, w: 6, d: 6, h: 16, roof: 1 },
  { x: 0, z: 0, w: 11, d: 9, h: 3.2, roof: 0.9 },
  { x: -10.5, z: -6, w: 6, d: 5, h: 9.6, roof: 0.5 },
  { x: 9.5, z: -7, w: 5, d: 7, h: 12.8, roof: 0.95 },
  { x: -9.5, z: 7.5, w: 7, d: 5, h: 6.4, roof: 0.62 },
  { x: 9.5, z: 7.5, w: 6, d: 5, h: 6.4, roof: 1 },
  { x: -1, z: -14.5, w: 16, d: 5, h: 3.2, roof: 0.8 },
  { x: 16, z: 1, w: 4, d: 4, h: 6.4, roof: 0.9 },
  { x: -16.5, z: 1, w: 4, d: 6, h: 3.2, roof: 0.75 },
]
const FLOOR = 3.2
const SLAB_GAP = 0.18

const RAMP = ['#1C2A44', '#2D5E8C', '#C99A4B', '#D9603C'].map((c) => new THREE.Color(c))
function heatColor(t: number, out: THREE.Color) {
  const x = THREE.MathUtils.clamp(t, 0, 1) * (RAMP.length - 1)
  const i = Math.min(Math.floor(x), RAMP.length - 2)
  return out.copy(RAMP[i]).lerp(RAMP[i + 1], x - i)
}

function textSprite(text: string) {
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')!
  const font = '500 44px "Geist Mono Variable", ui-monospace, monospace'
  ctx.font = font
  const w = Math.ceil(ctx.measureText(text).width) + 36
  c.width = w
  c.height = 72
  ctx.font = font
  ctx.fillStyle = 'rgba(8,9,11,0.72)'
  ctx.strokeStyle = 'rgba(77,141,255,0.6)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(1, 1, w - 2, 70, 14)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#F2EEE7'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 18, 38)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, opacity: 0 }))
  s.scale.set((w / 72) * 1.1, 1.1, 1)
  s.renderOrder = 10
  return s
}

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
      // small sensor noise, like a real scan
      pos.set([p.x + (Math.random() - 0.5) * 0.08, p.y + (Math.random() - 0.5) * 0.08, p.z + (Math.random() - 0.5) * 0.08], k * 3)
    }
  }
  for (; k < count; k++) {
    const r = 7 + Math.random() * 20
    const a = Math.random() * Math.PI * 2
    pos.set([Math.cos(a) * r, 0.02, Math.sin(a) * r], k * 3)
  }
  return pos
}

type Slab = {
  mesh: THREE.Mesh
  edges: THREE.LineSegments
  normals: THREE.BufferAttribute
  positions: THREE.BufferAttribute
  colors: THREE.BufferAttribute
  baseY: number
  level: number
  b: Building
  top: boolean
  tower: boolean
}

export type DistrictOptions = { quality: 'high' | 'low' }

export class District {
  readonly renderer: THREE.WebGLRenderer
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400)
  /** Orbit angle (radians) around the target, plus pointer parallax and scroll dolly. */
  orbit = 0.78
  parallax = new THREE.Vector2()
  dolly = 0
  /** Camera distance multiplier (1 = hero framing). */
  distance = 1
  /** Horizontal framing shift in pixels (keeps text clear on wide layouts). */
  shift = 0

  private target = new THREE.Vector3(0, 5, 0)
  private slabs: Slab[] = []
  private solidMat: THREE.MeshStandardMaterial
  private edgeMat = new THREE.LineBasicMaterial({ color: '#7FA8FF', transparent: true, opacity: 0, depthWrite: false })
  private mullionMat = new THREE.LineBasicMaterial({ color: '#141922', transparent: true, opacity: 0 })
  private vertexMat: THREE.PointsMaterial
  private pointsMat: THREE.ShaderMaterial
  private scanEdge: THREE.Line
  private scanSheet: THREE.Mesh
  private dimsGroup = new THREE.Group()
  private dimsMat = new THREE.LineBasicMaterial({ color: '#4D8DFF', transparent: true, opacity: 0, depthTest: false })
  private dimLabels: THREE.Sprite[] = []
  private sunLight = new THREE.DirectionalLight('#ffffff', 2)
  private hemi = new THREE.HemisphereLight('#C7D3FF', '#0B0C10', 0.55)
  private shadowMat = new THREE.ShadowMaterial({ opacity: 0.4, transparent: true })
  private selectMat = new THREE.LineBasicMaterial({ color: '#4D8DFF', transparent: true, opacity: 0, depthTest: false })
  private selectLabel: THREE.Sprite
  private pmrem: THREE.PMREMGenerator
  private tmp = new THREE.Color()
  private tmp2 = new THREE.Color()
  private sky = new THREE.Color('#8C9CB8')
  private hc = new THREE.Color()
  private lastKey = ''
  private n = new THREE.Vector3()
  private p = new THREE.Vector3()
  private sunDir = new THREE.Vector3()
  private clay = new THREE.Color('#BEB9B1')
  private steel = new THREE.Color('#3B4556')
  private roofSteel = new THREE.Color('#6B6760')
  private mullionLines!: THREE.LineSegments
  private vertexPoints!: THREE.Points
  private cloud!: THREE.Points

  constructor(canvasHost: HTMLElement, opts: DistrictOptions) {
    const high = opts.quality === 'high'
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, high ? 1.75 : 1.25))
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.shadowMap.enabled = high
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    canvasHost.appendChild(this.renderer.domElement)
    this.renderer.domElement.setAttribute('aria-hidden', 'true')

    const scene = this.scene
    scene.fog = new THREE.Fog('#08090B', 62, 130)
    this.pmrem = new THREE.PMREMGenerator(this.renderer)
    scene.environment = this.pmrem.fromScene(new RoomEnvironment(), 0.04).texture

    // Lights
    scene.add(this.hemi)
    this.sunLight.castShadow = high
    this.sunLight.shadow.mapSize.set(1024, 1024)
    const sc = this.sunLight.shadow.camera
    sc.left = -30
    sc.right = 30
    sc.top = 30
    sc.bottom = -30
    sc.near = 1
    sc.far = 140
    this.sunLight.shadow.bias = -0.0006
    this.sunLight.shadow.normalBias = 0.04
    scene.add(this.sunLight, this.sunLight.target)

    // Ground: shadow catcher + two grids
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), this.shadowMat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)
    const grid = new THREE.GridHelper(90, 30, '#2A2E38', '#1B1E25')
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.7
    grid.position.y = 0.01
    scene.add(grid)
    const fine = new THREE.GridHelper(90, 180, '#16181E', '#16181E')
    ;(fine.material as THREE.Material).transparent = true
    ;(fine.material as THREE.Material).opacity = 0.5
    fine.position.y = 0.005
    scene.add(fine)

    // Solids as floor slabs (enables the exploded view)
    this.solidMat = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0, roughness: 0.85, metalness: 0, envMapIntensity: 1.15 })
    const vertexPositions: number[] = []
    const mullions: THREE.Vector3[] = []
    BUILDINGS.forEach((b, bi) => {
      const levels = Math.max(1, Math.round(b.h / FLOOR))
      const lh = b.h / levels
      for (let l = 0; l < levels; l++) {
        const h = lh - SLAB_GAP
        const seg = (v: number) => Math.max(1, Math.ceil(v / 1.4))
        const g = new THREE.BoxGeometry(b.w, h, b.d, seg(b.w), 2, seg(b.d)).toNonIndexed()
        const baseY = l * lh + h / 2
        g.translate(0, 0, 0)
        const colors = new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3)
        g.setAttribute('color', colors)
        const mesh = new THREE.Mesh(g, this.solidMat)
        mesh.position.set(b.x, baseY, b.z)
        mesh.castShadow = high
        mesh.receiveShadow = high
        scene.add(mesh)
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(b.w, h, b.d)), this.edgeMat)
        edges.position.copy(mesh.position)
        scene.add(edges)
        this.slabs.push({
          mesh,
          edges,
          normals: g.attributes.normal as THREE.BufferAttribute,
          positions: g.attributes.position as THREE.BufferAttribute,
          colors,
          baseY,
          level: l,
          b,
          top: l === levels - 1,
          tower: bi === 0,
        })
      }
      // vertex highlights at the building corners
      for (const y of [0, b.h]) for (const sx of [-1, 1]) for (const sz of [-1, 1]) vertexPositions.push(b.x + (sx * b.w) / 2, y, b.z + (sz * b.d) / 2)
      // façade mullions for the material render
      for (let x = -b.w / 2 + 1.2; x < b.w / 2 - 0.4; x += 1.2) {
        for (const sz of [-1, 1]) mullions.push(new THREE.Vector3(b.x + x, 0, b.z + (sz * (b.d / 2 + 0.02))), new THREE.Vector3(b.x + x, b.h, b.z + (sz * (b.d / 2 + 0.02))))
      }
      for (let z = -b.d / 2 + 1.2; z < b.d / 2 - 0.4; z += 1.2) {
        for (const sx of [-1, 1]) mullions.push(new THREE.Vector3(b.x + (sx * (b.w / 2 + 0.02)), 0, b.z + z), new THREE.Vector3(b.x + (sx * (b.w / 2 + 0.02)), b.h, b.z + z))
      }
    })
    this.mullionLines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(mullions), this.mullionMat)
    scene.add(this.mullionLines)

    // Vertex highlights
    const dot = document.createElement('canvas')
    dot.width = dot.height = 32
    const dctx = dot.getContext('2d')!
    dctx.fillStyle = '#ffffff'
    dctx.beginPath()
    dctx.arc(16, 16, 9, 0, Math.PI * 2)
    dctx.fill()
    const vGeo = new THREE.BufferGeometry()
    vGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertexPositions, 3))
    this.vertexMat = new THREE.PointsMaterial({ color: '#BFD4FF', size: 7, sizeAttenuation: false, map: new THREE.CanvasTexture(dot), transparent: true, opacity: 0, depthWrite: false, alphaTest: 0.1 })
    this.vertexPoints = new THREE.Points(vGeo, this.vertexMat)
    scene.add(this.vertexPoints)

    // Point cloud with scan sweep
    const count = high ? 7000 : 3800
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(samplePoints(count), 3))
    this.pointsMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSweep: { value: -40 },
        uOpacity: { value: 0 },
        uColor: { value: new THREE.Color('#6E9DFF') },
        uScale: { value: this.renderer.getPixelRatio() },
      },
      vertexShader: /* glsl */ `
        uniform float uSweep; uniform float uScale;
        varying float vVis; varying float vEdge; varying float vH;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float d = uSweep - position.x;
          vVis = step(0.0, d);
          vEdge = 1.0 - smoothstep(0.0, 2.5, d);
          vH = clamp(position.y / 16.0, 0.0, 1.0);
          gl_PointSize = (1.9 + vEdge * 2.6) * uScale * (150.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity; uniform vec3 uColor;
        varying float vVis; varying float vEdge; varying float vH;
        void main() {
          if (vVis < 0.5) discard;
          float a = smoothstep(0.5, 0.12, length(gl_PointCoord - 0.5));
          vec3 col = mix(uColor, vec3(0.62, 0.52, 1.0), vH * 0.6);
          col = mix(col, vec3(0.95, 0.97, 1.0), vEdge * 0.75);
          gl_FragColor = vec4(col, a * uOpacity * (0.7 + vEdge * 0.3));
        }`,
    })
    this.cloud = new THREE.Points(pGeo, this.pointsMat)
    scene.add(this.cloud)

    // Scan frame
    const frame = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -9.5, -24), new THREE.Vector3(0, 9.5, -24), new THREE.Vector3(0, 9.5, 24), new THREE.Vector3(0, -9.5, 24), new THREE.Vector3(0, -9.5, -24),
    ])
    this.scanEdge = new THREE.Line(frame, new THREE.LineBasicMaterial({ color: '#BFD4FF', transparent: true, opacity: 0, depthWrite: false }))
    this.scanSheet = new THREE.Mesh(
      new THREE.PlaneGeometry(48, 19),
      new THREE.MeshBasicMaterial({ color: '#4D8DFF', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
    )
    this.scanSheet.rotation.y = Math.PI / 2
    const scan = new THREE.Group()
    scan.add(this.scanEdge, this.scanSheet)
    scan.position.y = 9.5
    scan.name = 'scan'
    scene.add(scan)

    // Dimension guides on the tower (illustrative scene dimensions)
    const t = BUILDINGS[0]
    const gx = t.x + t.w / 2 + 1.6
    const gz = t.z + t.d / 2
    const dimPts = [
      new THREE.Vector3(gx, 0, gz), new THREE.Vector3(gx, t.h, gz),
      new THREE.Vector3(gx - 0.5, 0, gz), new THREE.Vector3(gx + 0.5, 0, gz),
      new THREE.Vector3(gx - 0.5, t.h, gz), new THREE.Vector3(gx + 0.5, t.h, gz),
      new THREE.Vector3(t.x - t.w / 2, t.h + 1.4, gz), new THREE.Vector3(t.x + t.w / 2, t.h + 1.4, gz),
      new THREE.Vector3(t.x - t.w / 2, t.h + 0.9, gz), new THREE.Vector3(t.x - t.w / 2, t.h + 1.9, gz),
      new THREE.Vector3(t.x + t.w / 2, t.h + 0.9, gz), new THREE.Vector3(t.x + t.w / 2, t.h + 1.9, gz),
    ]
    this.dimsGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(dimPts), this.dimsMat))
    const hLabel = textSprite(`${t.h.toFixed(1)} m`)
    hLabel.position.set(gx + 1.9, t.h / 2, gz)
    const wLabel = textSprite(`${t.w.toFixed(1)} m`)
    wLabel.position.set(t.x, t.h + 2.8, gz)
    this.dimLabels.push(hLabel, wLabel)
    this.dimsGroup.add(hLabel, wLabel)
    this.dimsGroup.renderOrder = 9
    scene.add(this.dimsGroup)

    // Selection outline on the tower
    const sel = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(t.w + 0.5, t.h + 0.5, t.d + 0.5)), this.selectMat)
    sel.position.set(t.x, t.h / 2, t.z)
    sel.renderOrder = 8
    scene.add(sel)
    this.selectLabel = textSprite('Tower · 16.0 m · 6 × 6 m')
    this.selectLabel.position.set(t.x, t.h + 2.8, t.z)
    scene.add(this.selectLabel)

    this.camera.position.set(44, 30, 42)
  }

  resize(w: number, h: number) {
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.renderer.domElement.style.width = `${w}px`
    this.renderer.domElement.style.height = `${h}px`
    this.camera.aspect = w / h
    if (this.shift) this.camera.setViewOffset(w, h, -this.shift, 0, w, h)
    else this.camera.clearViewOffset()
    this.camera.updateProjectionMatrix()
  }

  apply(s: DistrictState) {
    // Camera: orbit + parallax + scroll dolly (rises toward a plan view)
    const radius = (76 - this.dolly * 10) * this.distance
    const elev = 0.47 + this.dolly * 0.55 + this.parallax.y * 0.05
    const ang = this.orbit + this.parallax.x * 0.12
    this.camera.position.set(Math.sin(ang) * Math.cos(elev) * radius, Math.sin(elev) * radius + 4, Math.cos(ang) * Math.cos(elev) * radius)
    this.target.set(0, 5 - this.dolly * 3, 0)
    this.camera.lookAt(this.target)

    // Scan
    const sweepX = THREE.MathUtils.lerp(-25, 27, s.sweep)
    this.pointsMat.uniforms.uSweep.value = s.sweep >= 1 ? 60 : sweepX
    this.pointsMat.uniforms.uOpacity.value = s.points
    const scanVis = s.sweep > 0 && s.sweep < 1 ? Math.min(1, Math.sin(s.sweep * Math.PI) * 3) * Math.min(1, s.points * 2) : 0
    const scanGroup = this.scanEdge.parent!
    scanGroup.position.x = sweepX
    ;(this.scanEdge.material as THREE.LineBasicMaterial).opacity = 0.35 * scanVis
    ;(this.scanSheet.material as THREE.MeshBasicMaterial).opacity = 0.025 * scanVis

    // Layers
    this.edgeMat.opacity = s.wire
    this.vertexMat.opacity = s.vertices
    this.dimsMat.opacity = s.dims * 0.9
    for (const l of this.dimLabels) (l.material as THREE.SpriteMaterial).opacity = s.dims
    this.selectMat.opacity = s.select
    ;(this.selectLabel.material as THREE.SpriteMaterial).opacity = s.select
    this.solidMat.opacity = s.solid
    this.solidMat.transparent = s.solid < 0.995
    this.solidMat.depthWrite = s.solid > 0.5
    this.solidMat.metalness = THREE.MathUtils.lerp(0, 0.75, s.material * (1 - s.heat))
    this.solidMat.roughness = THREE.MathUtils.lerp(0.85, 0.24, s.material * (1 - s.heat))
    this.mullionMat.opacity = s.material * s.solid * (1 - s.heat) * 0.55
    // Hide layers that are fully transparent (avoids sorting artefacts and saves draw calls)
    this.mullionLines.visible = this.mullionMat.opacity > 0.01
    this.vertexPoints.visible = s.vertices > 0.01
    this.cloud.visible = s.points > 0.01
    this.dimsGroup.visible = s.dims > 0.01
    this.selectLabel.visible = s.select > 0.01
    for (const slab of this.slabs) {
      slab.mesh.visible = s.solid > 0.01
      slab.edges.visible = s.wire > 0.01
    }
    this.shadowMat.opacity = 0.42 * s.solid

    // Sun and lighting
    const az = THREE.MathUtils.lerp(-1.2, 1.2, s.sun)
    const el = Math.sin(s.sun * Math.PI) * 1.0 + 0.12
    this.sunDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el) * 0.7).normalize()
    this.sunLight.position.copy(this.sunDir).multiplyScalar(60)
    const day = Math.sin(s.sun * Math.PI)
    this.sunLight.intensity = 0.8 + 2.6 * day
    this.sunLight.color.setHSL(0.09, 0.55, 0.62 + 0.3 * day)
    this.hemi.intensity = 0.35 + 0.35 * day

    // Explode + colours (skip the per-vertex pass when nothing that affects colour has changed)
    const key = `${s.material.toFixed(3)}|${s.heat.toFixed(3)}|${s.sun.toFixed(3)}|${s.explode.toFixed(3)}`
    if (key === this.lastKey) return
    this.lastKey = key
    for (const slab of this.slabs) {
      const y = slab.baseY + slab.level * s.explode * 1.6
      slab.mesh.position.y = y
      slab.edges.position.y = y
      const arr = slab.colors.array as Float32Array
      for (let i = 0; i < slab.normals.count; i++) {
        this.n.fromBufferAttribute(slab.normals, i)
        this.p.fromBufferAttribute(slab.positions, i)
        const roof = this.n.y > 0.5
        // base: clay → steel/glass
        const wy = y + this.p.y
        // Material render: façades read as glass/steel picking up sky toward the top, roofs as concrete
        const facade = roof ? this.roofSteel : this.tmp2.copy(this.steel).lerp(this.sky, Math.min(1, wy / 18) * 0.55)
        const base = this.tmp.copy(this.clay).lerp(facade, s.material)
        if (s.heat > 0.001) {
          const heightF = roof ? (slab.top ? slab.b.roof : 0.35) : 0.5 + 0.45 * Math.min(1, wy / 16)
          const grain = 0.11 * Math.sin((slab.b.x + this.p.x) * 0.55 + (slab.b.z + this.p.z) * 0.35) * Math.cos((slab.b.z + this.p.z) * 0.6 - this.p.x * 0.2)
          const exposure = Math.max(0, this.n.dot(this.sunDir)) * (0.35 + 0.65 * day) * heightF
          heatColor(exposure * 0.85 + (roof ? 0.06 * day : 0) + grain * day, this.hc)
          base.lerp(this.hc, s.heat)
        }
        arr[i * 3] = base.r
        arr[i * 3 + 1] = base.g
        arr[i * 3 + 2] = base.b
      }
      slab.colors.needsUpdate = true
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose?.()
      const mat = m.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
      else if (mat) {
        ;(mat as THREE.SpriteMaterial).map?.dispose()
        mat.dispose()
      }
    })
    this.scene.environment?.dispose()
    this.pmrem.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}

export const smooth = (a: number, b: number, t: number) => THREE.MathUtils.smoothstep(t, a, b)
export const lerp = THREE.MathUtils.lerp
