import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba, isDarkScheme } from '../theme/adwaita'
import { T } from './common'
import { Icon, type IconName } from './icons'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface TabItem {
  id: string
  label: string
  icon?: IconName
  closable?: boolean
}

export interface TabsProps {
  /** Data-driven tab strip (adwaita native). Omit to use the compound API. */
  items?: TabItem[]
  /** Controlled active tab id. */
  value?: string
  /** Uncontrolled starting tab id (used when `value` is undefined). */
  defaultValue?: string
  /** Called when a tab is selected (data-driven `items` + compound triggers). */
  onSelect?: (id: string) => void
  /** Called when a closable tab's close button is pressed. */
  onClose?: (id: string) => void
  /** `horizontal` (default): row strip, 3px accent underline on the bottom edge.
   * `vertical`: column strip, 3px accent indicator on the right edge. */
  orientation?: 'horizontal' | 'vertical'
  /** Compound children (TabsList / TabsTrigger / TabsContent). */
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/* ── Context ──────────────────────────────────────────────────────────── */

export interface TabsCtxValue {
  /** The active tab id. */
  value: string
  /** Select a tab by id. */
  setValue: (value: string) => void
  orientation: 'horizontal' | 'vertical'
  onClose?: (id: string) => void
}

/**
 * The context shared by `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent`.
 * The `Tabs` root provides it; `TabsTrigger` calls `setValue` on click;
 * `TabsContent` reads `value` to decide what to render.
 */
export const TabsCtx = createContext<TabsCtxValue | null>(null)

/** Read the surrounding Tabs context (null outside a `Tabs` root). */
export function useTabs(): TabsCtxValue | null {
  return useContext(TabsCtx)
}

/* ── Data-driven tab ──────────────────────────────────────────────────── */

/** A single data-driven tab: icon + label, optional close button, and the
 *  3px accent indicator (bottom bar horizontal, right bar vertical). */
function Tab({
  item,
  selected,
  onSelect,
  onClose,
}: {
  item: TabItem
  selected: boolean
  onSelect: (id: string) => void
  onClose?: (id: string) => void
}) {
  const t = useAdwaita()
  const { colors } = t
  const isVertical = useTabs()?.orientation === 'vertical'
  const closable = item.closable && onClose

  return (
    <TabShell vertical={isVertical} selected={selected} onClick={() => onSelect(item.id)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          minHeight: 38,
          paddingLeft: 12,
          paddingRight: closable ? 6 : 12,
        }}
      >
        {item.icon ? <Icon name={item.icon} size={16} color={selected ? colors.accent : colors.dim_fg} /> : null}
        <T size="body" weight={selected ? 600 : 400} color={selected ? colors.fg : colors.dim_fg}>
          {item.label}
        </T>
        {closable ? (
          <div
            onClick={() => onClose?.(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              borderRadius: 9,
              marginLeft: 2,
              cursor: 'pointer',
              hover: { backgroundColor: hexToRgba(colors.fg, 0.12) },
            }}
          >
            <Icon name="close" size={12} color={colors.dim_fg} />
          </div>
        ) : null}
      </div>
    </TabShell>
  )
}

/* ── Compound pieces ──────────────────────────────────────────────────── */

/** The 3px accent indicator bar under a horizontal tab. */
function TabIndicator({ selected }: { selected: boolean }) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        height: 3,
        borderRadius: 2,
        backgroundColor: selected ? colors.accent : 'transparent',
      }}
    />
  )
}

/** The shared tab container: an orientation-aware flex shell with the hover
 *  wash, the vertical right-edge indicator, and the horizontal bottom bar. */
function TabShell({
  vertical,
  selected,
  grow = false,
  onClick,
  style,
  children,
}: {
  vertical: boolean
  selected: boolean
  grow?: boolean
  onClick?: () => void
  style?: Partial<StyleDesc>
  children: ReactNode
}) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: vertical ? 'row' : 'column',
        ...(grow ? { flexGrow: 1 } : {}),
        cursor: 'pointer',
        ...(vertical
          ? { borderRightWidth: selected ? 3 : 0, borderColor: colors.accent }
          : {}),
        hover: { backgroundColor: hexToRgba(colors.fg, isDarkScheme(t.scheme) ? 0.06 : 0.04) },
        ...style,
      }}
    >
      {children}
      {!vertical ? <TabIndicator selected={selected} /> : null}
    </div>
  )
}

export interface TabsListProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * The strip container: a row (horizontal) or column (vertical) of tabs with
 * a 1px edge border (bottom in horizontal, right in vertical) that the 3px
 * accent indicator sits on.
 */
export function TabsList({ children, style }: TabsListProps) {
  const t = useAdwaita()
  const { colors } = t
  const isVertical = useTabs()?.orientation === 'vertical'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap: 4,
        ...(isVertical
          ? { borderRightWidth: 1, borderColor: colors.border }
          : { borderBottomWidth: 1, borderColor: colors.border }),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps {
  /** The tab id this trigger selects. */
  value: string
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A single compound tab: a label that selects its `value` on click. The 3px
 * accent indicator sits on the bottom edge (horizontal) or the right edge
 * (vertical) when selected.
 */
export function TabsTrigger({ value, children, style }: TabsTriggerProps) {
  const t = useAdwaita()
  const { colors } = t
  const ctx = useTabs()
  const isVertical = ctx?.orientation === 'vertical'
  const selected = ctx?.value === value

  return (
    <TabShell vertical={isVertical} selected={selected} grow onClick={() => ctx?.setValue(value)} style={style}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          minHeight: 38,
          padding: 12,
        }}
      >
        <T size="body" weight={selected ? 600 : 400} color={selected ? colors.fg : colors.dim_fg}>
          {children}
        </T>
      </div>
    </TabShell>
  )
}

export interface TabsContentProps {
  /** The tab id this panel belongs to. */
  value: string
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * The content panel for a tab `value`: renders its children only while that
 * tab is the active one (read from the surrounding Tabs context).
 */
export function TabsContent({ value, children, style }: TabsContentProps) {
  const ctx = useTabs()
  const active = ctx?.value === value
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        ...style,
      }}
    >
      {active ? children : null}
    </div>
  )
}

/* ── Root ─────────────────────────────────────────────────────────────── */

/**
 * Adwaita tab strip with a dual API:
 * - **Data-driven**: pass `items` (icon + label + closable tabs) with
 *   `value` / `onSelect` / `onClose` — the adwaita-native strip.
 * - **Compound**: pass `TabsList` / `TabsTrigger` / `TabsContent` children —
 *   the shadcn-style decomposition (context-backed, `orientation` aware).
 *
 * Both can coexist. `orientation='vertical'` turns the strip into a column
 * with the 3px accent indicator on the right edge. `defaultValue` gives an
 * uncontrolled mode when `value` is omitted.
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onSelect,
  onClose,
  orientation = 'horizontal',
  children,
  style,
}: TabsProps) {
  // ── controlled / uncontrolled duality ──────────────────────────────
  const [internal, setInternal] = useState<string>(defaultValue ?? value ?? '')
  const current = value ?? internal
  const setValue = (v: string) => {
    if (value === undefined) setInternal(v)
    onSelect?.(v)
  }

  const ctxValue: TabsCtxValue = { value: current, setValue, orientation, onClose }

  return (
    <TabsCtx.Provider value={ctxValue}>
      <div
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'row' : 'column',
          gap: 4,
          ...style,
        }}
      >
        {items ? (
          <TabsList>
            {items.map((item) => (
              <Tab
                key={item.id}
                item={item}
                selected={item.id === current}
                onSelect={setValue}
                onClose={onClose}
              />
            ))}
          </TabsList>
        ) : null}
        {children}
      </div>
    </TabsCtx.Provider>
  )
}

/** Alias of Tabs (tab strip / tab bar are used interchangeably). */
export const TabBar = Tabs
