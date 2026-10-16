/**
 * render-pngs.tsx
 *
 * Headless per-component PNGs for the Adwaita/GPUix library, rendered with
 * takumi-js (JSX/CSS → PNG, no browser, native on Linux).
 *
 * Each component file owns its own showcase shot (the
 * `// ── Showcase shot ──` section at the end of `src/components/<File>.tsx`
 * exporting `<Name>Shot: ComponentShot`); this script imports those shots
 * directly. `AVATAR_IMG` comes from `./shot` (scripts/shot.ts), which also
 * carries the `ComponentShot` shape and the shared `LEVELS`.
 *
 * Pipeline: serialize each shot with `renderToStaticMarkup` (standard React
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
import { AVATAR_IMG } from './shot'

// ── core ─────────────────────────────────────────────────────────────────
import { ButtonShot } from '../src/components/Button'
import { HeaderBarShot } from '../src/components/HeaderBar'
import { BannerShot } from '../src/components/Banner'
import { ToastShot } from '../src/components/Toast'
import { SpinnerShot } from '../src/components/Spinner'
import { StatusPageShot } from '../src/components/StatusPage'
import { SwitchShot } from '../src/components/Switch'
import { EntryShot } from '../src/components/Entry'
import { InputShot } from '../src/components/Input'
import { CardShot } from '../src/components/Card'
import { BoxedListShot } from '../src/components/BoxedList'
import { AlertDialogShot } from '../src/components/AlertDialog'
import { TabsShot } from '../src/components/Tabs'
import { ToggleGroupShot } from '../src/components/ToggleGroup'
import { AvatarShot } from '../src/components/Avatar'
import { ProgressBarShot } from '../src/components/ProgressBar'

// ── feedback ─────────────────────────────────────────────────────────────
import { ViewSwitcherShot } from '../src/components/ViewSwitcher'
import { PreferencesPageShot } from '../src/components/PreferencesPage'
import { BadgeShot } from '../src/components/Badge'
import { LabelShot } from '../src/components/Label'
import { SeparatorShot } from '../src/components/Separator'
import { SkeletonShot } from '../src/components/Skeleton'
import { KbdShot } from '../src/components/Kbd'
import { AlertShot } from '../src/components/Alert'
import { AspectRatioShot } from '../src/components/AspectRatio'
import { EmptyShot } from '../src/components/Empty'
import { TypographyShot } from '../src/components/Typography'
import { InputGroupShot } from '../src/components/InputGroup'
import { InputOTPShot } from '../src/components/InputOTP'
import { TextareaShot } from '../src/components/Textarea'
import { CheckboxShot } from '../src/components/Checkbox'
import { RadioGroupShot } from '../src/components/RadioGroup'

// ── inputs ───────────────────────────────────────────────────────────────
import { SliderShot } from '../src/components/Slider'
import { ToggleShot } from '../src/components/Toggle'
import { NativeSelectShot } from '../src/components/NativeSelect'
import { FieldShot } from '../src/components/Field'
import { SelectShot } from '../src/components/Select'
import { AccordionShot } from '../src/components/Accordion'
import { CollapsibleShot } from '../src/components/Collapsible'
import { TableShot } from '../src/components/Table'
import { BreadcrumbShot } from '../src/components/Breadcrumb'
import { PaginationShot } from '../src/components/Pagination'
import { CarouselShot } from '../src/components/Carousel'
import { ResizableShot } from '../src/components/Resizable'
import { DialogShot } from '../src/components/Dialog'
import { DrawerShot } from '../src/components/Drawer'

// ── overlays ─────────────────────────────────────────────────────────────
import { SheetShot } from '../src/components/Sheet'
import { PopoverShot } from '../src/components/Popover'
import { TooltipShot } from '../src/components/Tooltip'
import { HoverCardShot } from '../src/components/HoverCard'
import { DropdownMenuShot } from '../src/components/DropdownMenu'
import { ContextMenuShot } from '../src/components/ContextMenu'
import { MenubarShot } from '../src/components/Menubar'
import { NavigationMenuShot } from '../src/components/NavigationMenu'
import { CommandShot } from '../src/components/Command'

// ── overlays-extra ───────────────────────────────────────────────────────
import { CalendarShot, DatePickerShot } from '../src/components/Calendar'
import { ChartShot } from '../src/components/Chart'
import { ComboboxShot } from '../src/components/Combobox'
import { NumberFieldShot } from '../src/components/NumberField'
import { SidebarShot } from '../src/components/Sidebar'
import { ListBoxShot } from '../src/components/ListBox'
import { DescriptionShot } from '../src/components/Description'
import { ToasterShot } from '../src/components/Toaster'

// ── Paths / theme ─────────────────────────────────────────────────────────
const componentsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'components')
// Use window_bg (the darkest Adwaita surface) as the shot backdrop so
// view_bg / button_bg element surfaces (inputs, cards, rows, triggers) stay
// visible — matching real libadwaita surface layering (window < view < card).
const bg = buildTheme('dark', 'blue').colors.window_bg
const only = process.env.ONLY

// Valid 1×1 red PNG (the AVATAR_IMG data-uri in the Avatar shot is
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

// ── The 64 component shots (per-component file order) ────────────────────
const COMPONENTS = [
  // core
  ButtonShot,
  HeaderBarShot,
  BannerShot,
  ToastShot,
  SpinnerShot,
  StatusPageShot,
  SwitchShot,
  EntryShot,
  InputShot,
  CardShot,
  BoxedListShot,
  AlertDialogShot,
  TabsShot,
  ToggleGroupShot,
  AvatarShot,
  ProgressBarShot,
  // feedback
  ViewSwitcherShot,
  PreferencesPageShot,
  BadgeShot,
  LabelShot,
  SeparatorShot,
  SkeletonShot,
  KbdShot,
  AlertShot,
  AspectRatioShot,
  EmptyShot,
  TypographyShot,
  InputGroupShot,
  InputOTPShot,
  TextareaShot,
  CheckboxShot,
  RadioGroupShot,
  // inputs
  SliderShot,
  ToggleShot,
  NativeSelectShot,
  FieldShot,
  SelectShot,
  AccordionShot,
  CollapsibleShot,
  TableShot,
  BreadcrumbShot,
  PaginationShot,
  CarouselShot,
  ResizableShot,
  DialogShot,
  DrawerShot,
  // overlays
  SheetShot,
  PopoverShot,
  TooltipShot,
  HoverCardShot,
  DropdownMenuShot,
  ContextMenuShot,
  MenubarShot,
  NavigationMenuShot,
  CommandShot,
  // overlays-extra
  CalendarShot,
  DatePickerShot,
  ChartShot,
  ComboboxShot,
  NumberFieldShot,
  SidebarShot,
  ListBoxShot,
  DescriptionShot,
  ToasterShot,
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
