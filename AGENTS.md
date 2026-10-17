# AGENTS.md

Guidance for AI agents working in this repo. Read this before making changes.

## What this is

`adwaita-gpuix` — a libadwaita / GTK4-styled **React component library for
[GPUix](https://github.com/gpuix)**, a GPU-rendered React runtime. It renders
native, GPU-accelerated UI (no DOM, no browser) with light/dark schemes, nine
accent colours, and idiomatic controls. Built on React 19 + `@gpuix/react` +
`@gpuix/native`, with `lucide-static` icons.

It is consumed as a local `file:` workspace dependency by GPUix apps (see
`flake.nix`), so the package must stay a plain directory of `package.json` +
`src/`.

## Clean-room design (follow the mockups best practices)

When implementing GPUix components and apps with this library, follow the
clean-room design / re-implementation best practices from the mockups project
(`~/Projects/knoopx/mockups`): re-imagine familiar app UIs for clean user
experience — strip the marketing layer, never fabricate, never brand.

- **Re-imagine, don't replicate (strip the black patterns).** Keep the app's
  real function and information architecture; remove the original's
  antipatterns — marketing / promotional push, dark patterns, engagement-bait,
  upsells, ad slots, notification nags.
- **No branding, no invented brands.** Never use a real product's name, logo,
  brand colors, accent palette, or identity — and never invent a brand name in
  its place. Use plain CATEGORY names ("Railway", not "DB Navigator"; no
  "Yarnboard"/"Lumina"). Data content (names, headlines, values) is fine;
  branding is not.
- **Adopt adwaita design styles.** The visual language is libadwaita / GTK4 —
  light/dark schemes, the nine accent colours, idiomatic controls (the theme
  tokens in `src/theme/`). No custom color values.
- **Ground everything (no fabrication).** Every element, label, value, and
  state is grounded in a user-provided reference or explicit instruction. A
  missing reference is reported as missing, never invented from the app's
  category; an ungroundable identifier is reported, never adopted. An
  unreadable reference = stop and report.
- **Use this library exclusively — no hand-rolling.** Build UI from the
  adwaita-gpuix components (`src/components/`) and theme tokens
  (`src/theme/`). No raw div soup to fake a component, no per-screen token
  files, no `<style>` blocks, no custom style overrides.
- **Icons: `lucide-static`.** Named imports from the installed icon set;
  never hand-roll `<svg>` path snippets.
- **App content only — no window chrome / shell UI.** Render the app itself,
  edge to edge. No title bars, traffic-light dots, min/max/close controls,
  window frames, mobile status bars (time/battery/signal), home-indicator
  bars, or notches.
- **1 component = 1 file; data is not a component.** Each shared component is
  its own file named for it (no catch-all module); mock/data lives outside the
  component files.

## Commands

```sh
bun install              # install deps
bun run typecheck        # tsc --noEmit  (CPU-only, no GPU needed)
bun storybook . --only <Name>     # render one component's stories to PNGs (agent-run)
```

`bun storybook . --only <Name>` renders each matching story
offscreen via the native `TestRenderer` — no window is opened — and writes one
PNG per story to `<story dir>/<meta.title>/<storyName>.png`. For a
`src/components/**` story titled `Adwaita/<Name>` that is
`src/components/Adwaita/<Name>/<storyName>.png` (e.g.
`src/components/Adwaita/Avatar/sizes.png`). **Agents must run the render
for the affected stories and visually verify the produced PNGs** — the
rendered PNGs are the verification gate.

There is no unit-test runner and no build step. `typecheck` is the only
static gate.

## Visual verification — use the storybook, not runtime probes

- **Verify UI changes through the storybook stories.** Showcases live in
  co-located `src/components/**/*.stories.tsx` files (CSF-style: `export
default defineMeta({ title: "Adwaita/<Name>", component, parameters: { width,
height } })` plus named story exports), rendered by the storybook
framework (the `storybook` workspace devDependency at `../storybook/`).
`bun storybook . --only <Name>` renders each story offscreen via the native
`TestRenderer` (no window is opened) and writes one PNG per story to
`<story dir>/<meta.title>/<storyName>.png` — i.e.
`src/components/Adwaita/<Name>/<storyName>.png` for a `src/components` story
titled `Adwaita/<Name>` (e.g.
`src/components/Adwaita/Avatar/sizes.png`). Rendered PNGs are committed to
the repo (there is no `.gitignore` exception for them). A full render needs
the native GPU renderer and works on this box (Linux included) — agents run
`bun storybook . --only <Name>` and visually verify the produced PNGs.
- **Do NOT write or run runtime/interaction probe code.** Visual
verification is the rendered story PNG itself (offscreen via the native
`TestRenderer`); any probe is dead weight here. If a behaviour
can't be seen in a rendered story PNG, say so; don't fabricate a probe.
- No probe files, test fixtures, scratch dirs, or generated artifacts land
in the working directory.

## GPUix JSX conventions (differ from the web)

`tsconfig.json` targets GPUix's JSX runtime (`"jsx": "react-jsx"`,
`"jsxImportSource": "@gpuix/react"`). Rules that break if you assume a browser:

- **Host elements** are `div`, `text`, `input`, `img`, `svg`, `canvas`,
  `textarea`, `<virtual-list>`. There is **no `<button>`** — a button is a
  `<div onClick>` with `cursor: 'pointer'`.
- **`div` is block by default.** Set `display: 'flex'` (plus `flexDirection`)
  before using `gap` / `alignItems` / `justifyContent`.
- **Every `<text>` needs an explicit colour** (GPUI doesn't inherit colour).
  Use the `T` helper (defaults to theme foreground) or set `color`.
- **`hover` / `active`** are nested one-level style objects; **`boxShadow`**
  is an object; **`padding` / `margin` / `border` / `radius` are numbers** (px).
- **`<virtual-list>`** is the only scroller. Wrap each row in a `<div>`:
  `<virtual-list estimatedItemHeight={140} style={{ flexGrow: 1, minHeight: 0 }}>…`.
- `render` and `motion` come from `@gpuix/react`.

## Pointer / hit-testing gotcha (caused a real drag bug)

GPUix delivers mouse events to the **topmost hit element**, and an element
that **paints a fill or is positioned blocks hits behind it** unless
`pointerEvents: 'none'` is set. Consequence: a child that sits on top of an
interactive parent (e.g. a slider **thumb** over its **track**) swallows
`mousedown` / `mousemove` / `mouseup`, so the parent's drag handlers never
fire — the drag only works when the pointer is over the parent's bare area.

Fix pattern: keep all gesture handlers on the **container**, and mark purely
visual children (thumbs, fills, overlays) `pointerEvents: 'none'` so events
fall through to the container. `EventPayload.x` / `.y` are **window
coordinates**, so relative-drag math (`delta = coord - startCoord`) is layout
independent; do not derive a value from an absolute coordinate.

See `src/components/Slider.tsx` (track line, fill, and thumbs are all
`pointerEvents: 'none'` so the container owns the gesture) and
`src/components/Resizable.tsx` (relative-drag pattern).

## Layout

- `src/theme/` — `adwaita.ts` (provider, `useAdwaita`, tokens) + `tokens.ts`.
- `src/components/` — one pure component per file. Showcases live in
  co-located `<Name>.stories.tsx` story files (storybook CSF), rendered to
  `src/components/Adwaita/<Name>/<story>.png` (one PNG per story, under a
  per-title `Adwaita/<Name>/` dir). `common.tsx` holds shared `T` /
  `Row` helpers, `icons.tsx` the icon set.
- `.storybook/main.tsx` — global decorator wrapping every story in
  `<AdwaitaProvider scheme="light">`.
- `src/index.ts` — public entry; re-exports the theme system and every
  component. New exports go here.
- Rendered story PNGs (written by the storybook framework under
  `src/components/**/Adwaita/<Name>/`) are committed to the repo — there is
  no `.gitignore` exception for them.

## Definition of done

A component change is complete when:
1. `bun run typecheck` passes.
2. The component's stories render to clean PNGs: the agent runs
   `bun storybook . --only <Name>`, which produces a clean PNG per story
   under `src/components/Adwaita/<Name>/`, and visually verifies the PNGs.
3. Any new public API is re-exported from `src/index.ts`.
4. No probe / scratch / generated files are left in the working directory.
