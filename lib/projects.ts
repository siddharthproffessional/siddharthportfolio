/**
 * Project content — the single source of truth for the gallery, the detail pages,
 * the sitemap and the portfolio assistant.
 *
 * Accuracy rules used when writing this file:
 *  - "Implemented" lists only features confirmed in source code, docs or the running app.
 *  - Owner-reported items are marked as such until source or media can be reviewed.
 *  - Capability levels are never upgraded (a Blender model is not a simulation,
 *    a simulated twin is not a live-data twin).
 */

export type Status = 'completed' | 'in-progress' | 'exploration'

export const STATUS_LABEL: Record<Status, string> = {
  completed: 'Completed',
  'in-progress': 'In progress',
  exploration: 'Workflow exploration',
}

export type Capability =
  | 'tested-simulation'
  | 'interactive-app'
  | 'software'
  | 'blender-model'
  | 'workflow'
  | 'research'

export const CAPABILITY: Record<Capability, { label: string; description: string }> = {
  'tested-simulation': {
    label: 'Interactive app with tested simulation model',
    description:
      'A working application whose calculation engine has automated tests. Still simulated — not connected to live data.',
  },
  'interactive-app': {
    label: 'Interactive 3D application',
    description: 'A working browser application driven by simulated or example inputs.',
  },
  software: {
    label: 'Software application',
    description: 'A working software tool. Capability details are listed on the project page.',
  },
  'blender-model': {
    label: '3D model and scene',
    description: 'A modelled environment prepared in Blender. No simulation is claimed.',
  },
  workflow: {
    label: 'Pipeline between tools',
    description: 'Investigation of a pipeline between tools. Not a validated production workflow.',
  },
  research: {
    label: 'Research study',
    description: 'Academic research with its own method and evidence base.',
  },
}

export type Category =
  | 'Built environment'
  | 'Omniverse & OpenUSD'
  | 'Industrial'
  | 'Robotics simulation'
  | 'Interoperability'

export type Evidence = 'source-and-app' | 'source' | 'owner-reported'

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  'source-and-app': 'Verified against source code and the running application',
  source: 'Verified against source code',
  'owner-reported': 'Owner-reported — source and media not yet reviewed',
}

export type DiagramNode = { id: string; label: string; detail?: string; planned?: boolean }
export type Diagram = {
  title: string
  /** Left-to-right columns of nodes. */
  columns: DiagramNode[][]
  edges: [string, string][]
  note?: string
}

export type Media = { src: string; alt: string; caption: string; width: number; height: number }

export type TechRole = { name: string; role: string; verified: boolean }

export type Project = {
  slug: string
  title: string
  tagline: string
  status: Status
  statusNote?: string
  capability: Capability
  categories: Category[]
  tech: TechRole[]
  problem: string
  objective: string
  implemented: { text: string; verified: boolean }[]
  /** Items that are explicitly not built yet (shown separately from implemented work). */
  planned?: string[]
  diagram: Diagram
  media: Media[]
  results: string[]
  challenges: { challenge: string; solution: string }[]
  limitations: string[]
  future: string[]
  links: { label: string; href: string }[]
  /** Deployed app that can be embedded as a live preview. */
  preview?: string
  unavailableLinks?: string[]
  evidence: Evidence
  verification: string[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    slug: 'dubai-environmental-twin',
    title: 'Dubai Urban & Environmental Digital Twin',
    tagline:
      'Browser-based building-environment simulation: time-of-day solar heating, surface-temperature heat maps and six retrofit scenarios.',
    status: 'completed',
    statusNote: 'Deployed prototype',
    capability: 'interactive-app',
    categories: ['Built environment'],
    featured: true,
    tech: [
      { name: 'Three.js 0.165', role: '3D scene, orbit controls, per-surface heat-map materials', verified: true },
      { name: 'JavaScript (ES modules)', role: 'Solar geometry, surface-temperature model, scenario and UI state', verified: true },
      { name: 'HTML / CSS', role: 'Single self-contained page with condition, scenario and metric panels', verified: true },
      { name: 'Vercel', role: 'Static hosting of the deployed prototype', verified: true },
    ],
    problem:
      'Early retrofit conversations for buildings in Dubai rarely start with a calibrated energy model. Owners need a quick, visual way to see where a building absorbs heat during a summer day and how options such as a cool roof, vegetation or PV change that picture — before paying for detailed simulation.',
    objective:
      'Build a browser prototype that shows how a mid-rise building’s roof, façades and glazing heat up through a summer design day in Dubai, and lets the viewer compare intervention scenarios against a baseline without installing anything.',
    implemented: [
      { text: 'Three.js scene of a mid-rise building with roof, façade and glazing surfaces, surrounding massing, roads and trees; orbit, pan and zoom plus preset Overview, Roof, Front (S) and West views.', verified: true },
      { text: 'Solar position computed for 25.20°N 55.27°E, driven by a simulation-time slider with play control.', verified: true },
      { text: 'Deterministic surface-temperature model per surface: ambient temperature plus absorbed irradiance (orientation, solar absorptance, tree shading) and a scenario term.', verified: true },
      { text: 'Heat-map shading of every surface with a ≤30 °C to 55+ °C legend, and click or search to inspect a single surface.', verified: true },
      { text: 'Six scenarios — Existing, Reflective Roof, Green Roof, Solar PV (77 modules, 42 % of roof), Trees (5 → 25) and Combined — each with its own scene geometry.', verified: true },
      { text: 'Panels for ambient temperature, relative humidity, solar radiation and wind, explicitly labelled as example design-day inputs.', verified: true },
      { text: 'Performance metrics (area-weighted surface temperature, cooling-demand index, PV generation per 15 minutes), a before/after comparison and a daily surface-temperature chart.', verified: true },
      { text: 'Locally generated, rule-based analysis text, labelled in the interface as a static demo — no language model is called.', verified: true },
    ],
    diagram: {
      title: 'Data flow inside the prototype',
      columns: [
        [
          { id: 'inputs', label: 'Design-day inputs', detail: 'Ambient, RH, wind, irradiance (example values)' },
          { id: 'site', label: 'Site & time', detail: '25.20°N 55.27°E · time slider' },
          { id: 'scen', label: 'Scenario definition', detail: 'Roof finish, green roof, PV, trees' },
        ],
        [
          { id: 'sun', label: 'Solar position', detail: 'Sun vector, direct + diffuse' },
          { id: 'model', label: 'Surface-temperature model', detail: 'T = Tamb + K·α·G·R + Δ' },
        ],
        [
          { id: 'heat', label: 'Heat-map shading', detail: 'Per-surface material colour' },
          { id: 'metrics', label: 'Metrics & chart', detail: 'Surface temp, cooling index, PV' },
          { id: 'text', label: 'Rule-based analysis', detail: 'Static text, no LLM' },
        ],
      ],
      edges: [
        ['site', 'sun'],
        ['inputs', 'model'],
        ['sun', 'model'],
        ['scen', 'model'],
        ['model', 'heat'],
        ['model', 'metrics'],
        ['model', 'text'],
      ],
    },
    media: [
      {
        src: '/projects/environmental-twin/overview.webp',
        alt: 'Environmental Digital Twin interface showing a yellow-to-red heat map on a mid-rise building at 14:00, with environmental condition, scenario and performance panels.',
        caption: 'Existing scenario at 14:00 — roof and façades shaded by simulated surface temperature.',
        width: 1600,
        height: 1000,
      },
      {
        src: '/projects/environmental-twin/combined-roof.webp',
        alt: 'Roof view of the Combined scenario with PV rows, a vegetated roof and 25 site trees; the before/after panel shows the mean surface temperature falling from 46.2 °C to 37.8 °C.',
        caption: 'Combined scenario, roof view. The 46.2 → 37.8 °C change is a calibrated example value, not a prediction.',
        width: 1600,
        height: 1000,
      },
    ],
    results: [
      'Deployed and publicly reachable on Vercel.',
      'Re-run from the repository source on 25 Oct 2026 in headless Chromium: the page loaded with no JavaScript errors, scenario switching and the Roof view worked, and the screenshots above were captured from that run.',
      'No measured or external-solver validation has been carried out.',
    ],
    challenges: [
      {
        challenge: 'Making scenario comparisons consistent across very different interventions.',
        solution:
          'A single calibration constant anchors the baseline’s area-weighted mean surface temperature at 14:00, and each scenario’s microclimate term is weighted toward the surfaces it actually affects (roof versus façades).',
      },
      {
        challenge: 'Avoiding the impression of live data or real AI analysis.',
        solution:
          'Every panel carries a “simulated / prototype values” label, the conditions panel states the inputs are not live Dubai weather, and the analysis panel states that no language model has analysed the building.',
      },
      {
        challenge: 'Keeping the demo usable when WebGL is unavailable.',
        solution: 'The app catches 3D start-up failures and shows a “3D view unavailable” message instead of a blank page.',
      },
    ],
    limitations: [
      'All environmental values are deterministic example inputs for one summer design day — no live weather, sensors or measurements.',
      'Scenario means at 14:00 are calibrated to example target values written in the source, so differences between scenarios are illustrative rather than predicted.',
      'The building is generic massing, not a surveyed Dubai building.',
      'Cooling demand is an index relative to baseline, not kWh.',
      'The analysis text is rule-based; there is no AI model in the loop.',
    ],
    future: [
      'Drive the model from hourly EPW weather data, as already done in HeatShield.',
      'Compare results against a validated engine such as EnergyPlus before quoting numbers.',
      'Import real building geometry through IFC or OpenUSD instead of procedural massing.',
      'Exchange scenes and results with NVIDIA Omniverse (noted as a future step in the source).',
    ],
    preview: 'https://ai-environmental-digital-twin.vercel.app/',
    links: [
      { label: 'Open application', href: 'https://ai-environmental-digital-twin.vercel.app/' },
      { label: 'View source', href: 'https://github.com/siddharthproffessional/ai-environmental-digital-twin' },
    ],
    evidence: 'source-and-app',
    verification: [
      'Source reviewed at commit c166842 (single index.html, Three.js 0.165 via import map).',
      'Scenario definitions, calibration targets and the surface-temperature formula read directly from the source.',
      'Application run locally from source and screenshotted on 25 Oct 2026; deployed URL confirmed to serve the same title and panels.',
    ],
  },
  {
    slug: 'heatshield',
    title: 'HeatShield: Accommodation Twin',
    tagline:
      'Explorable 3D labour-accommodation site connected to a five-minute thermal zone model, nine intervention scenarios and reproducible exports.',
    status: 'completed',
    statusNote: 'Deployed research prototype',
    capability: 'tested-simulation',
    categories: ['Built environment'],
    featured: true,
    tech: [
      { name: 'Three.js 0.180', role: 'Site geometry, cutaways, hourly shadows, overlays, glTF export and re-import', verified: true },
      { name: 'Vite 7', role: 'Development server and production build', verified: true },
      { name: 'JavaScript (ES modules)', role: 'Thermal solver, occupancy, heat-risk screening, scenarios — no framework layer', verified: true },
      { name: 'Web Worker', role: 'Runs the solver off the main thread so the interface stays responsive', verified: true },
      { name: 'EPW weather (TMYx 2009–2023)', role: 'Bundled Dubai International Airport typical-year weather with validated import', verified: true },
      { name: 'Node test runner', role: '32 model and data tests with analytical reference cases', verified: true },
      { name: 'Playwright', role: 'Automated browser workflow checks, screenshots and glTF round trip', verified: true },
      { name: 'glTF 2.0', role: 'Geometry interchange with zone IDs preserved in extras', verified: true },
    ],
    problem:
      'Heat exposure in shared labour accommodation depends on building fabric, cooling capacity and daily routines at the same time. Planners comparing cool roofs, insulation, shading, HVAC upgrades or covered routes need to see the options under identical conditions — including what happens when cooling or water supply fails.',
    objective:
      'Build a research prototype that connects an explorable conceptual site to a deterministic thermal and exposure-screening model, so interventions can be compared fairly, inspected room by room and exported with their assumptions.',
    implemented: [
      { text: 'Conceptual G+3 accommodation with two wings, 72 shared bedrooms and 88 thermal zones, plus bathrooms, dining, kitchen, recovery, reception, stairs, furniture, roof equipment markers, routes, canopies, trees and water stations.', verified: true },
      { text: 'Orbit and free-camera movement, floor cutaways, selectable zones with a space inspector, hourly shadows and temperature or screening overlays.', verified: true },
      { text: 'Five-minute resistance–capacitance zone solver with envelope, solar and internal gains, ventilation, thermal mass, adjacency, moisture and capacity-limited HVAC, run in a Web Worker.', verified: true },
      { text: 'Bundled Dubai TMYx 2009–2023 EPW weather, three explicitly synthetic profiles and a +3 °C future-stress scenario. Missing weather is rejected rather than silently substituted.', verified: true },
      { text: 'Aggregate occupancy cohorts that conserve the resident population across rooms, dining, recovery and routes (no individual tracking).', verified: true },
      { text: 'Nine scenario presets with editable custom copies; a comparison table of exposure person-hours, modelled cooling electricity, peak demand, water demand and shortfall, and indicative cost allowances.', verified: true },
      { text: 'Project save/load and JSON, CSV and glTF 2.0 exports; glTF is re-imported and checked for all 88 zone IDs and scene bounds.', verified: true },
      { text: 'A separate telemetry validation contract that rejects stale, offline or invalid readings. No sensors are connected.', verified: true },
    ],
    diagram: {
      title: 'System architecture',
      columns: [
        [
          { id: 'wx', label: 'Weather', detail: 'Dubai TMYx EPW · synthetic profiles' },
          { id: 'man', label: 'Building manifest', detail: 'Zone IDs, materials, floors, HVAC' },
          { id: 'sc', label: 'Scenarios', detail: '9 presets + custom copies' },
        ],
        [
          { id: 'solver', label: 'RC zone solver', detail: '5-min steps · Web Worker' },
          { id: 'occ', label: 'Occupancy cohorts', detail: 'Population conserved' },
          { id: 'tel', label: 'Telemetry contract', detail: 'Validation only · not connected', planned: true },
        ],
        [{ id: 'risk', label: 'Exposure screening', detail: 'Heuristic index, not WBGT' }],
        [
          { id: 'scene', label: '3D site & inspector', detail: 'Three.js overlays, cutaways' },
          { id: 'cmp', label: 'Comparison table', detail: 'Same inputs for every scenario' },
          { id: 'exp', label: 'Exports', detail: 'JSON · CSV · glTF (re-imported)' },
        ],
      ],
      edges: [
        ['wx', 'solver'],
        ['man', 'solver'],
        ['sc', 'solver'],
        ['man', 'occ'],
        ['solver', 'risk'],
        ['occ', 'risk'],
        ['risk', 'scene'],
        ['risk', 'cmp'],
        ['risk', 'exp'],
      ],
      note: 'Dashed node: designed and tested as a contract, but no building system is connected.',
    },
    media: [
      {
        src: '/projects/heatshield/overview.webp',
        alt: 'HeatShield interface with a 3D view of two four-storey accommodation wings around a courtyard, scenario and intervention controls on the left and the space inspector on the right.',
        caption: 'Integrated protection scenario on the conceptual site, 14:00 on a July TMY day.',
        width: 1600,
        height: 1000,
      },
      {
        src: '/projects/heatshield/room.webp',
        alt: 'Cutaway of floor 3 showing shared bedrooms with bunk beds and lockers, with the zone air temperature legend.',
        caption: 'Floor cutaway and room selection; the inspector reports zone temperature, RH, occupants and gains.',
        width: 1600,
        height: 1000,
      },
      {
        src: '/projects/heatshield/comparison.webp',
        alt: 'Comparison table of nine scenarios listing exposure person-hours, cooling kWh, peak demand, water demand, shortfall and capital allowance.',
        caption: 'Scenario comparison under identical population, date and period. CO₂ is shown as unavailable by default.',
        width: 1600,
        height: 1000,
      },
      {
        src: '/projects/heatshield/mobile.webp',
        alt: 'HeatShield on a 390-pixel-wide phone screen.',
        caption: 'Mobile layout captured by the automated browser check for horizontal overflow.',
        width: 390,
        height: 844,
      },
    ],
    results: [
      'Model and data suite: 32 tests passed, including analytical reference cases for RC relaxation and adiabatic gain (validation run 15 Oct 2026).',
      'Browser workflow check passed: nine presets, failure warnings, floor and room selection, comparison rows, custom-scenario recompute and no mobile horizontal overflow, with no page errors.',
      'All nine scenarios completed full 8,760-hour annual runs with finite outputs.',
      'glTF round trip retained all 88 zone IDs with scene bounds matching within 1 cm.',
      'Example 24-hour run (500 residents, July TMY day): about 883 elevated person-hours at baseline versus 44 with integrated protection. These are illustrative model outputs, not validated benefit predictions.',
      'Short headless performance sample: about 51 fps with roughly 4,900 draw calls — a local observation, not a benchmark.',
    ],
    challenges: [
      {
        challenge: 'Peak cooling demand was initially reported from a five-minute pull-down request, which overstated it.',
        solution: 'Replaced it with a target-temperature sensible heat-balance load and kept capacity-limited delivered cooling as a separate output.',
      },
      {
        challenge: 'Keeping the interface responsive while evaluating nine scenarios, up to a full year each.',
        solution: 'The solver runs in a dedicated Web Worker; each run cancels the previous worker and evaluates every scenario against the same configuration.',
      },
      {
        challenge: 'Not letting simulation quietly fill gaps in data.',
        solution: 'Missing weather files are rejected, and the telemetry contract keeps missing, stale or offline readings missing instead of replacing them with model values.',
      },
      {
        challenge: 'Proving exported geometry keeps its meaning.',
        solution: 'Exports are re-imported with GLTFLoader and checked for every zone ID and the scene bounds before delivery.',
      },
    ],
    limitations: [
      'The heat screening index is not a validated WBGT, and default thresholds are illustrative, not legal limits.',
      'Not calibrated against measured temperatures, meters or HVAC data, and not compared with EnergyPlus or CFD.',
      'No live sensors or building management systems are connected.',
      'The layout is conceptual: stairs, corridors and exits are not a fire, egress or accessibility design, and the free camera has no collision.',
      'IFC, OpenUSD and Unreal import have not been validated; only the glTF round trip in Three.js has been checked.',
      'About 4,900 draw calls; instancing and merging are needed for larger sites and mobile hardware.',
    ],
    future: [
      'Calibrate against measured temperature, humidity and meter data and compare with EnergyPlus, keeping observed and simulated data separate.',
      'Replace the heuristic screening with a validated wet-bulb globe model reviewed by occupational-health specialists.',
      'Add authenticated sensor ingestion over HTTPS or MQTT/TLS following the existing telemetry contract.',
      'Build and test semantic IFC and OpenUSD export, then verify imports in Unreal Engine and Omniverse.',
      'Add geometry instancing and keyboard navigation of the 3D view.',
    ],
    preview: 'https://heatshield-digital-twin.vercel.app/',
    links: [{ label: 'Open application', href: 'https://heatshield-digital-twin.vercel.app/' }],
    unavailableLinks: ['Source repository is private — available on request.'],
    evidence: 'source',
    verification: [
      'Source reviewed at commit 3997ff1: README, architecture, methodology, assumptions and validation report.',
      'Test, browser-validation and glTF-validation results read from the exported evidence files in the repository.',
      'Screenshots are the repository’s own automated browser-test captures.',
      'Deployed URL confirmed to serve the “HEATSHIELD · Accommodation twin” application.',
    ],
  },
  {
    slug: 'omniverse-intelligence-lab',
    title: 'Omniverse Intelligence Lab',
    tagline:
      'Web application for exploring NVIDIA Omniverse, OpenUSD and Isaac Sim libraries, with an AI assistant that calls a controlled set of Omniverse tools.',
    status: 'completed',
    statusNote: 'Completed, as confirmed by the owner',
    capability: 'software',
    categories: ['Omniverse & OpenUSD'],
    featured: true,
    tech: [
      { name: 'Next.js / React / TypeScript', role: 'Dashboard front end — pending source review', verified: false },
      { name: 'FastAPI / Python', role: 'Backend services — pending source review', verified: false },
      { name: 'NVIDIA Omniverse', role: 'Target platform for the controlled tool calls — pending source review', verified: false },
      { name: 'OpenUSD', role: 'Scene description the tools operate on — pending source review', verified: false },
    ],
    problem:
      'The Omniverse, OpenUSD and Isaac Sim ecosystem is broad: knowing which library, extension or API to use for a task takes a lot of reading before any scene work starts.',
    objective:
      'Provide one place to explore those libraries interactively and to ask an AI assistant to act on an Omniverse scene through a limited, controlled set of tools rather than unrestricted code execution.',
    implemented: [
      { text: 'Interactive explorer for Omniverse, OpenUSD and Isaac Sim libraries (owner-described).', verified: false },
      { text: 'AI assistant integration that calls controlled Omniverse tools (owner-described).', verified: false },
      { text: 'Dashboard and backend services connecting to 3D and simulation tooling (owner-described).', verified: false },
    ],
    planned: [
      'Longer-term workflow the lab is meant to support: LiDAR or camera capture → USD → Omniverse → AI assistant → Isaac Sim → Unreal Engine → digital twin → VR.',
    ],
    diagram: {
      title: 'Architecture as described — to be confirmed against source',
      columns: [
        [{ id: 'ui', label: 'Web dashboard', detail: 'Library explorer + assistant' }],
        [{ id: 'api', label: 'Backend services', detail: 'FastAPI (to verify)' }],
        [{ id: 'llm', label: 'AI assistant', detail: 'Chooses from allowed tools' }],
        [{ id: 'tools', label: 'Controlled tool layer', detail: 'Whitelisted Omniverse actions' }],
        [{ id: 'ov', label: 'Omniverse / OpenUSD stage', detail: 'Scene being edited' }],
      ],
      edges: [
        ['ui', 'api'],
        ['api', 'llm'],
        ['llm', 'tools'],
        ['tools', 'ov'],
      ],
      note: 'Drawn from the owner’s description. It will be updated once the repository has been reviewed.',
    },
    media: [],
    results: ['Validation evidence has not been published yet.'],
    challenges: [],
    limitations: [
      'Features listed here are owner-described and have not yet been checked against the source code or a running instance.',
      'No screenshots or recordings are published yet.',
    ],
    future: ['Publish the repository or a recorded walkthrough so each integration can be verified and documented.'],
    links: [],
    unavailableLinks: ['Source code and application link not yet available for review.'],
    evidence: 'owner-reported',
    verification: ['No source code, deployment or media was available for this review. Content is limited to the owner’s description.'],
  },
  {
    slug: 'bottling-line-twin',
    title: 'Industrial Bottling-Line Digital Twin',
    tagline:
      'Blender-built industrial environment of a bottling line, organised and prepared for interactive visualization and future simulation.',
    status: 'completed',
    statusNote: '3D model and scene stage complete; simulation not yet verified',
    capability: 'blender-model',
    categories: ['Industrial'],
    featured: true,
    tech: [
      { name: 'Blender', role: 'Modelling of the environment, machinery and assets; materials; scene hierarchy', verified: false },
      { name: 'Python (bpy)', role: 'Scene automation where used — to be documented', verified: false },
      { name: 'OpenUSD / Omniverse', role: 'Planned route for physics simulation — not yet verified', verified: false },
    ],
    problem:
      'Manufacturing teams reviewing a production line — layout, machine spacing, operator access — usually work from 2D drawings. A navigable 3D model makes those conversations faster and is the first layer any later simulation needs.',
    objective:
      'Model a bottling-line environment in Blender with an organised scene, distinct machinery and asset groups and consistent materials, so it can be reused for interactive visualization and, later, physics simulation.',
    implemented: [
      { text: 'Blender model of an industrial bottling-line environment, including machinery, assets and materials (owner-reported).', verified: false },
      { text: 'Scene organised for reuse in interactive visualization (owner-reported).', verified: false },
    ],
    planned: [
      'Conveyor and bottle rigid-body physics in NVIDIA Omniverse.',
      'Transfer of the scene through OpenUSD with units, hierarchy and materials checked after import.',
      'Throughput or cycle visualization driven by simulated line states.',
    ],
    diagram: {
      title: 'Current model versus proposed pipeline',
      columns: [
        [{ id: 'model', label: 'Blender scene', detail: 'Machinery, assets, materials' }],
        [{ id: 'usd', label: 'USD export', detail: 'Units, hierarchy, materials', planned: true }],
        [
          { id: 'phys', label: 'Omniverse physics', detail: 'Conveyor + rigid bodies', planned: true },
          { id: 'viz', label: 'Interactive viewer', detail: 'Web or real-time engine', planned: true },
        ],
      ],
      edges: [
        ['model', 'usd'],
        ['usd', 'phys'],
        ['usd', 'viz'],
      ],
      note: 'Solid node: current work. Dashed nodes: proposed stages that are not built yet.',
    },
    media: [],
    results: ['Renders and scene breakdown have not been published yet.'],
    challenges: [],
    limitations: [
      'This is a 3D model and scene; it does not simulate machine behaviour, product flow or physics.',
      'No renders or scene files are published yet, so the model cannot be inspected here.',
    ],
    future: [
      'Publish renders and a scene-hierarchy breakdown.',
      'Export through OpenUSD and set up conveyor and rigid-body physics in Omniverse.',
    ],
    links: [],
    unavailableLinks: ['Renders and scene files not yet published.'],
    evidence: 'owner-reported',
    verification: ['No Blender files or renders were available for this review. Content is limited to the owner’s description.'],
  },
  {
    slug: 'simready-robotics-workflow',
    title: 'AI-Powered SimReady Robotics Workflow',
    tagline:
      'AI-assisted software to discover simulation-ready assets on Hugging Face and bring them into OpenUSD robotics and digital-twin scenes for NVIDIA Isaac Sim.',
    status: 'in-progress',
    capability: 'workflow',
    categories: ['Robotics simulation', 'Omniverse & OpenUSD'],
    featured: true,
    tech: [
      { name: 'Hugging Face', role: 'Source of simulation-ready (SimReady) assets', verified: false },
      { name: 'NVIDIA Isaac Sim', role: 'Target robotics simulation environment', verified: false },
      { name: 'OpenUSD', role: 'Scene format for assembling and checking assets', verified: false },
      { name: 'Python', role: 'Discovery, conversion and scene-assembly scripts', verified: false },
      { name: 'OpenAI Codex', role: 'AI-assisted development of the tooling', verified: false },
    ],
    problem:
      'Assembling a robotics scene means finding assets that are actually simulation-ready — correct scale, collision geometry, physics properties — and many downloadable models are not. Checking that by hand slows every new scene.',
    objective:
      'Develop software that finds suitable SimReady assets, inspects their formats and structure, and prepares compatible OpenUSD scenes for Isaac Sim, while documenting what does not transfer.',
    implemented: [],
    planned: [
      'Discover suitable simulation-ready assets on Hugging Face.',
      'Review asset formats and scene structure.',
      'Prepare compatible OpenUSD scenes.',
      'Explore simulation setup in NVIDIA Isaac Sim.',
      'Investigate collision geometry and physical properties where the assets support them.',
      'Test scene compatibility and document limitations.',
    ],
    diagram: {
      title: 'Intended workflow',
      columns: [
        [{ id: 'hf', label: 'Asset discovery', detail: 'Hugging Face SimReady', planned: true }],
        [{ id: 'inspect', label: 'Format & structure review', detail: 'Scale, hierarchy, materials', planned: true }],
        [{ id: 'usd', label: 'OpenUSD scene prep', detail: 'Assembly + compatibility checks', planned: true }],
        [
          { id: 'isaac', label: 'Isaac Sim setup', detail: 'Collision + physics where supported', planned: true },
          { id: 'log', label: 'Compatibility log', detail: 'What transfers, what does not', planned: true },
        ],
      ],
      edges: [
        ['hf', 'inspect'],
        ['inspect', 'usd'],
        ['usd', 'isaac'],
        ['usd', 'log'],
      ],
      note: 'All stages are shown dashed until each one is implemented and documented.',
    },
    media: [],
    results: ['Work in progress — no results published yet.'],
    challenges: [],
    limitations: ['The software is not finished. None of the stages above is presented as working until it is documented.'],
    future: ['Publish progress notes and test scenes as each stage is completed.'],
    links: [],
    unavailableLinks: ['Source code not yet published.'],
    evidence: 'owner-reported',
    verification: ['No source code was available for this review. The page describes goals and the intended workflow only.'],
  },
  {
    slug: 'blender-usd-unreal-omniverse',
    title: 'Blender → USD → Unreal / Omniverse Interoperability',
    tagline:
      'Investigating how scenes and assets move between Blender, OpenUSD, Unreal Engine and NVIDIA Omniverse, and what each tool expects.',
    status: 'exploration',
    statusNote: 'Workflow exploration and integration testing',
    capability: 'workflow',
    categories: ['Interoperability', 'Omniverse & OpenUSD'],
    featured: true,
    tech: [
      { name: 'Blender + Python (bpy)', role: 'Scene preparation and export automation', verified: false },
      { name: 'OpenUSD', role: 'Interchange format between applications', verified: false },
      { name: 'Unreal Engine', role: 'Real-time target for imported scenes', verified: false },
      { name: 'NVIDIA Omniverse', role: 'USD-native target for review and simulation', verified: false },
    ],
    problem:
      'Each 3D application has its own units, axis conventions, material systems and naming rules. A scene that looks right in Blender can arrive in Unreal or Omniverse at the wrong scale, rotated, with broken materials or flattened hierarchy.',
    objective:
      'Map what has to be prepared or converted at each step so that a Blender scene can be moved through OpenUSD into Unreal Engine and Omniverse with its structure intact, and record what still breaks.',
    implemented: [
      { text: 'Blender Python automation for scene preparation and export (owner-reported).', verified: false },
      { text: 'USD conversion and interchange tests between the four applications (owner-reported).', verified: false },
    ],
    planned: [
      'Publish a test matrix covering units, up-axis, hierarchy, materials and instancing for each application pair.',
      'Document lessons learned from each scene-transfer test.',
    ],
    diagram: {
      title: 'Interchange route and checkpoints',
      columns: [
        [{ id: 'blender', label: 'Blender', detail: 'Metres · Z-up · Principled BSDF' }],
        [{ id: 'usd', label: 'OpenUSD layer', detail: 'metersPerUnit · upAxis · prim paths' }],
        [
          { id: 'ue', label: 'Unreal Engine', detail: 'Centimetres · Z-up · UE materials' },
          { id: 'ov', label: 'Omniverse', detail: 'USD-native · MDL / UsdPreviewSurface' },
        ],
      ],
      edges: [
        ['blender', 'usd'],
        ['usd', 'ue'],
        ['usd', 'ov'],
      ],
      note: 'Checkpoints list the conventions each tool uses; they are reference facts, not test results.',
    },
    media: [],
    results: ['Test results have not been published yet.'],
    challenges: [
      {
        challenge: 'Unit and axis mismatches between tools (Blender metres, Unreal centimetres, USD stage metadata).',
        solution: 'Check stage metersPerUnit and upAxis metadata explicitly at every hop rather than relying on importer defaults.',
      },
      {
        challenge: 'Materials do not translate one-to-one between Blender, Unreal and Omniverse.',
        solution: 'Treat materials as a separate mapping step and record which properties survive each transfer.',
      },
    ],
    limitations: [
      'This is not a validated production pipeline; seamless round trips are not claimed.',
      'Test scenes and a results log are not published yet.',
    ],
    future: [
      'Apply the same re-import discipline used in HeatShield’s glTF export — checking IDs and bounds after every transfer.',
      'Publish sample scenes and the per-tool test matrix.',
    ],
    links: [],
    unavailableLinks: ['Test scenes and results log not yet published.'],
    evidence: 'owner-reported',
    verification: ['No test scenes or logs were available for this review. Tool conventions listed are general reference facts.'],
  },
]

/** Further workstreams shown in a compact list until each has a full case study. */
export type Workstream = { title: string; status: Status; description: string; evidence: string }

export const workstreams: Workstream[] = [
  {
    title: 'AI-assisted USD scene generation & editing',
    status: 'exploration',
    description:
      'Natural-language editing of OpenUSD scenes with NVIDIA’s Chat USD extension (USD Code interactive mode) inside USD Composer, tested on an H-House prototype scene.',
    evidence: 'Screens and notes not yet published.',
  },
  {
    title: 'Virtual campus digital twin pipeline',
    status: 'in-progress',
    description: 'A walkable, browser-based 3D campus for Middlesex University Dubai built with Three.js.',
    evidence: 'Case study in preparation.',
  },
  {
    title: 'Digital Twin Lab — natural VR object interaction',
    status: 'exploration',
    description: 'VR interaction with objects in a digital-twin scene using OpenXR.',
    evidence: 'Case study in preparation.',
  },
  {
    title: 'Atrium 4676 — 3D scene reconstruction',
    status: 'exploration',
    description: '3D reconstruction of an atrium space. Capture method and outputs will be documented with the case study.',
    evidence: 'Case study in preparation.',
  },
  {
    title: 'BIM-to-3D interoperability workflow',
    status: 'exploration',
    description: 'Moving Revit building models into 3D and real-time tools while keeping their structure usable.',
    evidence: 'Case study in preparation.',
  },
  {
    title: 'Digital Twin Readiness in UAE industrial firms',
    status: 'in-progress',
    description:
      'MBA applied research project developing a multidimensional readiness framework. Ethics approval received; key-informant interviews with digital-twin demonstrations at Middlesex University Dubai’s Digital Twin Futures Lab.',
    evidence: 'Research in progress; submission due December 2026.',
  },
]

/** Secondary AI and software projects. */
export type SupportingProject = { title: string; description: string; tech: string[]; links: { label: string; href: string }[] }

export const supportingProjects: SupportingProject[] = [
  {
    title: 'ATLAS AI — financial intelligence platform',
    description: 'Full-stack financial intelligence platform with 3D visualizations and an LLM-backed analysis layer.',
    tech: ['React', 'Three.js', 'Anthropic API'],
    links: [],
  },
  {
    title: 'Jarvis Business OS — AI agent system',
    description:
      'Multi-agent business automation that handles WhatsApp conversations and routes decisions to a person for approval on Telegram before acting.',
    tech: ['n8n', 'WhatsApp Business API', 'Telegram', 'Anthropic API'],
    links: [],
  },
  {
    title: 'NewsEarth — interactive 3D news globe',
    description:
      'Headlines mapped onto a rotating Earth with category filters, a news-activity heat map, a seven-day replay and natural-language search. Falls back to labelled demo data when API keys or quotas are unavailable.',
    tech: ['Next.js', 'TypeScript', 'React Three Fiber', 'NewsAPI', 'OpenAI'],
    links: [{ label: 'View source', href: 'https://github.com/siddharthproffessional/NewsEarth' }],
  },
  {
    title: 'AI-assisted website development & deployment',
    description:
      'Next.js websites built with AI coding tools and shipped on Vercel — including this portfolio, rebuilt from an earlier generated version.',
    tech: ['Next.js', 'Claude Code', 'Cursor', 'Vercel'],
    links: [],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export const ALL_CATEGORIES: Category[] = Array.from(new Set(projects.flatMap((p) => p.categories)))

export const ALL_TECH: string[] = Array.from(
  new Set(projects.flatMap((p) => p.tech.map((t) => t.name.replace(/\s[\d.]+$/, '')))),
).sort((a, b) => a.localeCompare(b))
