/**
 * shot.ts
 *
 * Shared type + constants for the per-component showcase shots. Each
 * component file owns its own `<Name>Shot` export (see the
 * `// ── Showcase shot ──` section at the end of each file in
 * `src/components/`); this file only carries the shot shape and the
 * cross-shot constants, so it stays component-file-free.
 */
import type { ReactNode } from 'react'

/** One per-component showcase shot: the shot name + the JSX to render. */
export interface ComponentShot {
  name: string
  el: ReactNode
}

/**
 * The truncated 1×1 data-uri used by the Avatar shot. render-pngs.tsx
 * swaps it for a valid 1×1 PNG at sanitize time (the truncated uri has a
 * bad CRC, which takumi's PNG decoder rejects).
 */
export const AVATAR_IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC'

/** Level options shared by the NativeSelect and Select shots. */
export const LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]
