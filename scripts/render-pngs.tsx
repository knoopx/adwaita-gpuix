/**
 * render-pngs.tsx
 *
 * Headless per-component PNGs for the Adwaita/GPUix library, rendered with
 * takumi-js (JSX/CSS → PNG, no browser, native on Linux).
 *
 * Pipeline: serialize each montage with `renderToStaticMarkup` (standard React
 * server render), sanitize the GPUix-only style artifacts out of the HTML, then
 * rasterize the HTML with takumi. GPUix state maps (`hover`/`active`/
 * `boxShadow`) serialize to `[object Object]` and takumi's CSS parser rejects a
 * few values, so they are normalized before the render.
 *
 * Usage:  bun scripts/render-pngs.tsx                # all 64
 *         ONLY=Button bun scripts/render-pngs.tsx    # just one
 */
import { render } from 'takumi-js'
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AdwaitaProvider, buildTheme } from '../src/index'
import { AVATAR_IMG } from './montage-shared'
import { CORE_SHOTS } from './montages/core'
import { FEEDBACK_SHOTS } from './montages/feedback'
import { INPUTS_SHOTS } from './montages/inputs'
import { OVERLAY_SHOTS } from './montages/overlays'
import { OVERLAY_EXTRA_SHOTS } from './montages/overlays-extra'

// ── Paths / theme ─────────────────────────────────────────────────────────
const componentsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'components')
// Use window_bg (the darkest Adwaita surface) as the montage backdrop so
// view_bg / button_bg element surfaces (inputs, cards, rows, triggers) stay
// visible — matching real libadwaita surface layering (window < view < card).
const bg = buildTheme('dark', 'blue').colors.window_bg
const only = process.env.ONLY

// Valid 1×1 red PNG (the AVATAR_IMG data-uri in the Avatar montage is
// truncated → bad CRC, which takumi's PNG decoder rejects).
const VALID_1X1_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAADUExURTWE5H1SYY8AAAAHdElNRQfqCg8NJhnGtSIEAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI2LTEwLTE1VDEzOjM4OjI1KzAwOjAwXBiS9gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNi0xMC0xNVQxMzozODoyNSswMDowMC1FKkoAAAAodEVYdGRhdGU6dGltZXN0YW1wIDIwMjYtMTAtMTVUMTM6Mzg6MjUrMDA6MDB6UAuVAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=='

/** Normalize GPUix-only style artifacts so takumi's CSS parser accepts them. */
function sanitizeHtml(html: string): string {
  let s = html
  // Drop any inline style property whose value serialized to `[object Object]`
  // (GPUix state/style maps: `hover`, `active`, map `boxShadow`, …). A static
  // PNG only needs the base state, so these are safe to drop.
  s = s.replace(/;?\s*[a-z-]+\s*:\s*\[object Object\]/gi, '')
  // takumi's overflow only accepts visible/clip/hidden.
  s = s.replace(/(overflow(?:-x|-y)?\s*:\s*)(scroll|auto)/gi, '$1hidden')
  // Replace the truncated avatar data-uri with a valid 1×1 png (exact match).
  s = s.split(AVATAR_IMG).join(`data:image/png;base64,${VALID_1X1_B64}`)
  return s
}

// ── The 64 component montages ─────────────────────────────────────────────
const COMPONENTS = [
  ...CORE_SHOTS,
  ...FEEDBACK_SHOTS,
  ...INPUTS_SHOTS,
  ...OVERLAY_SHOTS,
  ...OVERLAY_EXTRA_SHOTS,
]

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  let ok = 0
  let fail = 0
  for (const shot of COMPONENTS) {
    if (only && shot.name !== only) continue
    const el = (
      <AdwaitaProvider scheme="dark" accent="blue">
        <div
          style={{
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            backgroundColor: bg,
          }}
        >
          {shot.el}
        </div>
      </AdwaitaProvider>
    )
    const html = sanitizeHtml(renderToStaticMarkup(el))
    try {
      const png = await render(html, { format: 'png' })
      writeFileSync(join(componentsDir, `${shot.name}.png`), png)
      console.log(`  ✓ ${shot.name}.png (${png.length} bytes)`)
      ok++
    } catch (e) {
      console.error(`  ✗ ${shot.name}: ${(e as Error).message}`)
      fail++
    }
  }
  console.log(`\n${ok} ok, ${fail} failed → ${componentsDir}`)
}

main()
