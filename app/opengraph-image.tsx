import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const alt = `${site.name} — Digital Twin & Simulation Engineer`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Social preview generated at build time from the site config (no external fonts or services). */
export default function OpengraphImage() {
  const stages = ['Capture', 'Model', 'Interchange', 'Simulate', 'Deliver']
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0D141C',
          borderLeft: '12px solid #5EC4B6',
          padding: '72px 80px',
          color: '#E4EAF0',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#9AABBB', fontSize: 26 }}>
          <svg width="44" height="44" viewBox="0 0 32 32">
            <path d="M16 3 28 10v12l-12 7-12-7V10l12-7Z" fill="none" stroke="#5EC4B6" strokeWidth="1.8" />
            <path d="M4 10l12 7 12-7M16 17v12" fill="none" stroke="#5EC4B6" strokeWidth="1.8" opacity="0.55" />
          </svg>
          {site.location}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{site.name}</div>
          <div style={{ fontSize: 38, color: '#C9D3DC', marginTop: 18 }}>Digital Twin & Simulation Engineer</div>
          <div style={{ fontSize: 30, color: '#9AABBB', marginTop: 8 }}>AI-driven 3D workflows</div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {stages.map((s) => (
            <div
              key={s}
              style={{ display: 'flex', border: '2px solid #2D4052', borderRadius: 8, padding: '10px 18px', fontSize: 24, color: '#5EC4B6' }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
