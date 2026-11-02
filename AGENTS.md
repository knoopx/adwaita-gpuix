# AGENTS.md

Guidance for AI agents working in this repo. Read this before making changes.

## What this is

`adwaita-gpuix` — a libadwaita / GTK4-styled **React component library for
[GPUix](https://github.com/gpuix)**, a GPU-rendered React runtime. It renders
native, GPU-accelerated UI (no DOM, no browser) with light/dark schemes, nine
accent colours, and idiomatic controls. Built on React 19 + `@gpuix/react` +
`@gpuix/native`, with **Material Symbols** icons (`@iconify-json/material-symbols`),
served by an Iconify layer that can register any Iconify set.

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
- **Adopt adwaita design styles, grounded in the real apps.** The visual
  language is libadwaita / GTK4 — light/dark schemes, the nine accent colours,
  idiomatic controls (the theme tokens in `src/theme/`). No custom color
  values. Ground every visual decision in the shipped GNOME apps on
  Apps for GNOME (`apps.gnome.org`, screenshots under
  `https://static.gnome.org/catalog/app-screenshot/<app-id>/`) and the GNOME
  HIG (`developer.gnome.org/hig/`); the binding distillation is
  [`HIG.md`](HIG.md) — read it before writing UI.
- **Ground everything (no fabrication).** Every element, label, value, and
  state is grounded in a user-provided reference or explicit instruction. A
  missing reference is reported as missing, never invented from the app's
  category; an ungroundable identifier is reported, never adopted. An
  unreadable reference = stop and report.
- **Use this library exclusively — no hand-rolling.** Build UI from the
  adwaita-gpuix components (`src/components/`) and theme tokens
  (`src/theme/`). No raw div soup to fake a component, no per-screen token
  files, no `<style>` blocks, no custom style overrides.
- **Icons: Material Symbols, camelCased.** `<Icon name="expandMore" />` /
  `icon="checkCircle"` resolve against the active Iconify set
  (`src/components/icons.tsx`); `registerIconSet` adds another Iconify set and a
  `set:name` prefix picks it per name. Names are Material Symbols ligatures —
  `search`, `gridView`, `accountTree`, style variants `settingsRounded`,
  `settingsSharp` — with no alias tables, and never hand-rolled `<svg>` path
  snippets.
- **App content only — no _faked_ window chrome / shell UI.** Render the app
  itself, edge to edge. No traffic-light dots, min/max/close buttons, drawn
  window frames, mobile status bars (time/battery/signal), home-indicator bars,
  or notches. Real window chrome is the library's job: `src/components/chrome/`
  (`HeaderBar`, `StatusBar`, `Sidebar`, `ViewSwitcher`, `VirtualListPanel`) for a
  **native GNOME window**; a heading in the content area is never a title.
- **1 component = 1 file; data is not a component.** Each shared component is
  its own file named for it (no catch-all module); mock/data lives outside the
  component files.

## Native window anatomy and operability (HIG §6–§9)

- **Chrome slots in fixed order:** header bar (one centred title, flat buttons
  sized to content, one row) → content `windowhandle` (no border, no padding;
  6px gutter in light, 0 in dark) → status bar (**text only** — HIG 3.13
  forbids controls and clickable content in it). Exactly **one pane scrolls**,
  the primary list; the app root never scrolls.
- **One title per window** (HIG 3.24): the window title is the header bar's. A
  heading in the content area is a second title — content uses section
  headings, not a page title.
- **Sizes are tokens, never literals** (`CONTROL` in
  `HIG.md`): `headerBarHeight` 47, `viewSwitcherHeight` 34, `statusBarHeight`
  32, `rowHeight` 40, `sidebarWidth` 220; body 16px / line-height 1.4; radii
  2/6/12; selection fill `alpha(fg, 0.07)`.
- **Operable, not a dashboard** (HIG §6): every view answers a verb; a KPI
  strip + charts + a table is a report, not an app; every repeating row carries
  its action (`ActionRow`/`SwitchRow`/`ComboRow`/`SpinRow`/`ButtonRow`,
  selection, expander); controls are bound and their state drives the view;
  every action is answered (`Toast`, `Banner`, `ProgressBar`, updated figure);
  tables use one column grid with right-aligned tabular numbers, sorted from
  the header.
- **Density** (HIG 3.28 / 3.21 / 3.20): compact by removing padding, margins
  and separators; list views have no borders around elements; content goes
  directly on the view background.

## Native app, not a web page

This is a **native GPU-rendered libadwaita app** (GPUix: `div`/`text`/
`<virtual-list>` painted on the GPU, no DOM, no CSS, no browser). Build native
app grammar, per [`HIG.md`](HIG.md) and the apps.gnome.org reference screens —
never a web page:

- The window is the surface: panes fill it with flex (`flexGrow: 1`,
  `minHeight: 0`); the only scroller is `<virtual-list>`. No document flow, no
  centred max-width column, no page padding, no sticky bar, no hero, no
  anchor/tab navigation, no CSS breakpoints — adapt by collapsing panes.
- Chrome is the native kind, and only where the app needs it: `HeaderBar`
  (title + primary actions), `Sidebar` + content panes, `BoxedList` rows
  (ActionRow / SwitchRow / EntryRow), popovers, menus, dialogs, toasts,
  `StatusBar`. A passive renderer or single-view surface has **no chrome at
  all** — no header bar, no sidebar, no status bar, no debug/diagnostic
  panels: the app shows its content, edge to edge.
- Native metrics: ~40px rows, `t.spacing` gaps, tabular figures in number
  columns, every `<text>` carries a colour, keyboard focus is routed
  (Tab/arrows, `Ctrl+K`-style shortcuts), hover/active are nested style states.
- State lives in the app's own store, not in URLs, routes, scroll position or
  component-local page state.

## Flat surfaces — no card stacks, no borders (mandatory)

Per [`HIG.md`](HIG.md), which is read off the real GNOME apps (Settings,
Resources, Weather, Railway) and the GNOME HIG:

- Content sits on **one flat view surface**. A section is named by a heading +
  space, never by a box. `surface.card` resolves to the view surface and
  `border.default` is transparent — components inherit that; do not undo it.
- **A box never contains a box.** Container depth under the window root is ≤ 1.
- **Data is never boxed**: tables, lists, charts, KPIs, results go flush into
  the flow; repeats are rows in one continuous list, not tiles.
- Boxed groups (`BoxedList`) exist only for controls / short option groups, one
  per section, optionally headed — never around data, never nested.
- **No neutral borders, no separators as chrome, no shadows outside overlays.**
  Strokes are for state only (focus ring, selection, error). Hairlines appear
  only _between_ continuous cells of one structure (Weather's forecast strip).
- Hierarchy comes from headings, spacing, size/weight, dimmed foreground and
  tabular figures — not from paint. A screen that reads as a dashboard of
  boxes is a failure: restructure it, don't retune it.

## Window chrome (`src/components/chrome/`)

Chrome slots stack in this order and **none of them scrolls** (HIG 3.8, 3.9,
3.13, 3.14):

1. `HeaderBar` — 47px, **one centred title** + subtitle, **flat** slot actions
   (`.titlebar .flat`), left slot = view switcher / nav, right slot = window
   actions. A heading in the content area is a second title: forbidden.
2. The content slot (`windowhandle`) — **no border, no padding, no margin**;
   6px side gutter in light, 0 in dark (`_windowbox.css`, `_definitions.css`,
   `.adwaita-dark.css`).
3. `StatusBar` — 32px, **inert**: no controls, no clickable content (HIG 3.13).

- **Exactly one pane scrolls: the primary one** (HIG 3.14). No `overflow: scroll`
  on an app root; chrome never scrolls.
- Toolbar = **flat, content-sized buttons in one row** (HIG 3.9). A wrapped
  toolbar is a layout bug.
- Sidebar is a **distinct surface** (`@sidebar_bg_color` `#ebebed` light /
  `#303030` dark), 220px, rows inset 4px inside a 7px panel; **selection is a
  tint** (`alpha(fg, .07)`), never an accent-filled panel.
- Chrome geometry is `t.control` (`CONTROL` in `theme/tokens.ts`): 47 header /
  34 view switcher / 32 status / 40 row / 10 cell padding / 220 sidebar. No
  numeric size literals in component JSX — every number traces to a libadwaita
  rule, a HIG line, or a measured GNOME Circle screenshot pixel (`HIG.md` §9).

## No debug chrome in a runtime window (mandatory)

A GPUix app is an **app the human uses**, not a debugger, not an agent console,
not a status page for the transport. Anything that only the developer or the
agent reading the wire would use is **banned from the window**:

- endpoints, hosts, ports, URLs, socket paths — `127.0.0.1:8791/mcp`, `http://…`
- tool / protocol names and agent instructions — `openui_prompt`, `openui_render`,
  "ask the app for …, then call …"
- internal counters and diagnostics — `N statements`, `N errors`, `N unresolved`,
  `N programs on the canvas`, session counts, stream flags as numbers
- developer-facing placeholder labels — `no program`, `empty`, `undefined`,
  raw ids, keys, enums shown as text
- the **internal collection name as a UI label** — `Programs`, `Views`, `Items`,
  `Layers`, `Records`. A canvas app's window is titled with the name of the one
  thing that is open, and the list shows those names; a switcher or group label
  that names the app's own data structure is a database browser, not an app.

That information goes where it is read: the MCP tools (`openui_state`,
`openui_list`, `openui_events`), the log file, the terminal. The window shows
what the human reads, in the human's words.

In the chrome slots this means:

- `HeaderBar` — title is the name of what is open (one), subtitle is human
  context, **never** an endpoint, **never** a collection name. Left slot stays
  empty when there is no navigation to do.
- `StatusBar` — inert human text only (HIG 3.13): no endpoint, no counters,
  no controls.
- Sidebar / switcher rows — the real names of the things, and when the list is
  empty it is **empty**: no `empty` placeholder row.
- Empty state — plain human language about the app ("Nothing open yet"), never
  a transport address and never instructions to an agent.

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

- **Target window: 1233 × 2114.** Every app-level story — the whole screen,
  a type collection, anything that fills a window — is rendered at
  `parameters: { width: 1233, height: 2114 }`, the window the app is actually
  used in (portrait). Pane/component stories keep their own tighter sizes, but
  no layout is accepted from a wider story: a screen that only works at
  1400 × 900 is broken. Design and verify for the narrow one — panes collapse,
  columns drop, nothing overlaps or clips.
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
`src/components/Divider.tsx` (relative-drag pattern in `DividerGroup`).

## Layout

- `src/theme/` — `adwaita.ts` (provider, `useAdwaita`, tokens) + `tokens.ts`.
- `src/components/` — one pure component per file. Showcases live in
  co-located `<Name>.stories.tsx` story files (storybook CSF), rendered to
  `src/components/Adwaita/<Name>/<story>.png` (one PNG per story, under a
  per-title `Adwaita/<Name>/` dir). `common.tsx` holds shared `T` /
  `Row` helpers, `icons.tsx` the icon set.
- `.storybook/` — **the only storybook directory in the repo** (root level).
  There is never a `.storybook/` under `src/` or under a component folder.
  It holds `main.tsx` (global decorator wrapping every story in
  `<AdwaitaProvider scheme="light">`) and the story-only helper modules:
  `story-helpers.tsx` (`Stage` / `LabeledStage` / field + panel story
  builders), `window-shell.tsx` (`WindowShell`, `NavSidebar`, settings nav
  groups) and `app-helpers.tsx` (full-window app scenes: Files, Resources,
  Settings, Weather mock data + `WindowFrame`, `PaneColumn`). Stories import
  them by relative path (`../../.storybook/story-helpers` from
  `src/components/`, `../../../.storybook/...` from `src/components/<group>/`);
  the helpers import components from `../src/components/…`.
  `.storybook/**/*.tsx` are in the `tsconfig.json` program, so `typecheck`
  covers them.
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
