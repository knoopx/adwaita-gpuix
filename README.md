# adwaita-gpuix

An [Adwaita](https://en.wikipedia.org/wiki/Adwaita) / libadwaita-styled React
component library for **GPUix** — a GPU-rendered React runtime. It renders
native, GPU-accelerated UI (no DOM, no browser) with a GTK4/libadwaita look:
light/dark colour schemes, nine accent colours, and a full set of idiomatic
controls.

Built on React 19 + [GPUix](https://github.com/gpuix) (`@gpuix/react` +
`@gpuix/native`), with `lucide-static` icons.

## Install

```sh
bun install
```

## GPUix JSX requirements

GPUix renders to the GPU, not the DOM, so the toolchain must target GPUix's
JSX runtime. Your `tsconfig.json` **must** include:

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@gpuix/react",
  },
}
```

Conventions that differ from the web:

- **Host elements** are `div`, `text`, `input`, `img`, `svg`, `canvas`,
  `textarea`, and `<virtual-list>` — there is **no `<button>`**. Interaction
  is a `<div onClick>` with `style={{ cursor: 'pointer' }}`.
- **`div` is block by default.** To use `flexDirection`, `gap`,
  `alignItems`, or `justifyContent` you must set `display: 'flex'`
  (plus `flexDirection`).
- **Every `<text>` needs an explicit colour.** GPUI does not inherit colour —
  use the `T` helper (defaults to the theme foreground) or set `color`
  yourself.
- **`hover` / `active`** are nested one-level style objects; **`boxShadow`** is
  an object; **`padding` / `margin` / `border` / `radius` are numbers** (px).
- **`<virtual-list>`** is the only supported scroller. Wrap each row in a
  `<div>`: `<virtual-list estimatedItemHeight={140} style={{ flexGrow: 1,
minHeight: 0 }}>…rows…</virtual-list>`.
- `render` and `motion` are imported from `@gpuix/react`.

## Components

- **Theme** — `AdwaitaProvider`, `useAdwaita`, `AdwaitaContext`, `buildTheme`,
  `ACCENTS`, `SCHEMES`, `Radii`, `Typography`, `Spacing`, `hexToRgba`,
  `shade`, `accentForeground` (types: `ColorScheme`, `AccentKey`,
  `AdwaitaTheme`, `AdwaitaColors`, …)
- **Text & icons** — `T`, `SectionTitle`, `Icon`, `ICONS` (`IconName`)
- **Controls** — `Button`, `Switch`, `Entry`, `Spinner`, `ProgressBar`,
  `ToggleGroup`, `Avatar`
- **Surfaces** — `Card`, `Frame`, `Banner`, `Toast`, `StatusPage`
- **Boxed list** — `BoxedList` + `ActionRow`, `EntryRow`, `SwitchRow`,
  `SpinRow`, `ComboRow`, `ExpanderRow`, `ButtonRow`
- **Navigation** — `Tabs` / `TabBar`, `ViewSwitcher`
- **Dialogs** — `AlertDialog`, `MessageDialog`
- **Layout** — `HeaderBar`, `PreferencesPage`, `PreferencesGroup`

## Usage

```tsx
import { render } from "@gpuix/react";
import { AdwaitaProvider, HeaderBar, Button, Card, T } from "adwaita-gpuix";

function App() {
  return (
    <AdwaitaProvider scheme="light" accent="blue">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <HeaderBar
          title="Adwaita GPUix"
          left={<Button variant="icon" icon="panel" />}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 16,
          }}
        >
          <Card title="Hello">
            <T>GPU-rendered Adwaita components.</T>
          </Card>
          <Button variant="suggested" label="Get started" />
        </div>
      </div>
    </AdwaitaProvider>
  );
}

render(<App />, { title: "Adwaita GPUix", width: 900, height: 720 });
```

## Running

- **Type-check (CPU-only, no GPU needed):**

  ```sh
  bun run typecheck   # tsc --noEmit
  ```
