import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { StyleDesc, EventPayload } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, MenuRow } from './common'
import { Icon, type IconName } from './icons'
import { Sheet, SheetContent } from './Sheet'

/* ── Context ─────────────────────────────────────────────────────────── */

interface SidebarContextValue {
  /** The controlled open state (default true). */
  open: boolean
  /** True while the sidebar is in icon-only rail mode. */
  collapsed: boolean
  /** The keyboard-focused row id (accent border). */
  focused: string | null
  onFocusRow: (id: string) => void
  register: (id: string) => void
  unregister: (id: string) => void
  /** Registered row ids in registration order (for ArrowUp/Down nav). */
  ordered: () => string[]
}

const SidebarCtx = createContext<SidebarContextValue | null>(null)

const FALLBACK_CTX: SidebarContextValue = {
  open: true,
  collapsed: false,
  focused: null,
  onFocusRow: () => {},
  register: () => {},
  unregister: () => {},
  ordered: () => [],
}

/** The sidebar context; falls back to an expanded, no-op context outside `<Sidebar>`. */
function useSidebarCtx(): SidebarContextValue {
  return useContext(SidebarCtx) ?? FALLBACK_CTX
}

/* ── Sidebar: navigation panel (expandable / collapsed / mobile) ────── */

/** Width (px) of the expanded sidebar (the reference `14rem` ≈ 220). */
const EXPANDED_WIDTH = 220
/** Width (px) of the collapsed icon-only rail (the reference `3.5rem` ≈ 56). */
const COLLAPSED_WIDTH = 56

export interface SidebarProps {
  /** Width in px when expanded (default 220). */
  width?: number
  /**
   * Controlled open state. Inline mode defaults to `true` (expanded);
   * `mobile` mode defaults to `false` (off-canvas sheet closed). When
   * `false` (inline), the sidebar collapses to a 56px icon-only rail.
   */
  open?: boolean
  /** Called when the open state changes (scrim dismiss / close button). */
  onOpenChange?: (open: boolean) => void
  /** Render as an off-canvas `Sheet` (side="left") instead of an inline panel. */
  mobile?: boolean
  /** Contain the mobile sheet to a positioned ancestor (static renders). */
  contained?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * An Adwaita navigation panel: a `sidebar_bg` column with header,
 * scrollable content, and footer sections.
 *
 * `open` (default true) toggles the expanded (220px) / collapsed (56px
 * icon-only rail) modes; sub-components read the mode from `SidebarCtx`
 * and hide text labels when collapsed. With `mobile`, the sidebar is
 * composed as an off-canvas `Sheet` (side="left") — the GPUix-idiomatic
 * small-screen variant.
 */
export function Sidebar({
  width = EXPANDED_WIDTH,
  open,
  onOpenChange,
  mobile = false,
  contained = false,
  children,
  style,
}: SidebarProps) {
  const t = useAdwaita()
  const { colors, radii } = t

  // controlled / uncontrolled: inline defaults to expanded,
  // mobile (off-canvas) defaults to closed.
  const [internalOpen, setInternalOpen] = useState(mobile ? (open ?? false) : (open ?? true))
  const effectiveOpen = open ?? internalOpen
  const collapsed = !effectiveOpen

  // keyboard row ordering (ListBox pattern)
  const [focused, setFocused] = useState<string | null>(null)
  const orderedRef = useRef<string[]>([])
  const register = (id: string) => {
    if (!orderedRef.current.includes(id)) orderedRef.current.push(id)
  }
  const unregister = (id: string) => {
    orderedRef.current = orderedRef.current.filter((x) => x !== id)
  }

  const ctxValue: SidebarContextValue = {
    open: effectiveOpen,
    collapsed,
    focused,
    onFocusRow: setFocused,
    register,
    unregister,
    ordered: () => orderedRef.current,
  }

  const handleOpenChange = (next: boolean) => {
    setInternalOpen(next)
    onOpenChange?.(next)
  }

  const panel = (
    <div
      style={{
        width: mobile ? '100%' : collapsed ? COLLAPSED_WIDTH : width,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.sidebar_bg,
        borderRadius: mobile ? 0 : radii.card,
        borderWidth: mobile ? 0 : 1,
        borderColor: colors.border,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )

  if (mobile) {
    // Off-canvas: a left-side Sheet carrying the (always-expanded) sidebar
    // content — the GPUix-idiomatic mobile variant of the reference's
    // `useIsMobile` sheet composition.
    return (
      <Sheet open={effectiveOpen} onOpenChange={handleOpenChange} side="left" contained={contained}>
        <SheetContent style={{ padding: 0, gap: 0 }}>
          <SidebarCtx.Provider value={ctxValue}>{panel}</SidebarCtx.Provider>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <SidebarCtx.Provider value={ctxValue}>
      {panel}
    </SidebarCtx.Provider>
  )
}

export interface SidebarHeaderProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** The top of the sidebar (brand, search, etc.). */
export function SidebarHeader({ children, style }: SidebarHeaderProps) {
  return (
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {children}
    </div>
  )
}

export interface SidebarContentProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** The scrollable middle of the sidebar (flex-grows to fill). */
export function SidebarContent({ children, style }: SidebarContentProps) {
  return (
    <div
      style={{
        flexGrow: 1,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface SidebarGroupProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** A labelled group of sidebar items. */
export function SidebarGroup({ children, style }: SidebarGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {children}
    </div>
  )
}

export interface SidebarGroupLabelProps {
  children?: ReactNode
  /** Rendered (centered) in place of the text label when the sidebar is collapsed. */
  icon?: IconName
  style?: Partial<StyleDesc>
}

/** A caption-dim label above a group's items; icon-only when collapsed. */
export function SidebarGroupLabel({ children, icon, style }: SidebarGroupLabelProps) {
  const t = useAdwaita()
  const { colors } = t
  const { collapsed } = useSidebarCtx()

  if (collapsed && icon) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, ...style }}>
        <Icon name={icon} size={16} color={colors.dim_fg} />
      </div>
    )
  }

  return (
    <div style={{ paddingLeft: 8, paddingRight: 8, ...style }}>
      <T size="caption" color={colors.dim_fg}>
        {children}
      </T>
    </div>
  )
}

export interface SidebarGroupContentProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** The items of a sidebar group. */
export function SidebarGroupContent({ children, style }: SidebarGroupContentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, ...style }}>
      {children}
    </div>
  )
}

export interface SidebarFooterProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** The bottom of the sidebar (user, settings), separated from content. */
export function SidebarFooter({ children, style }: SidebarFooterProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ height: 1, backgroundColor: colors.border }} />
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  )
}

/* ── SidebarMenuItem: structured nav row ─────────────────────────────── */

export interface SidebarMenuItemProps {
  /** The row's leading icon (the only thing shown when collapsed). */
  icon?: IconName
  /** The row's label (hidden when collapsed). */
  label?: string
  /** Selected: accentTint background + accent icon/label. */
  selected?: boolean
  onClick?: () => void
  style?: Partial<StyleDesc>
}

let nextSidebarItemId = 0

/**
 * A structured navigation row (a `MenuRow`-based row): hover = accentTint,
 * selected = accentTint background + accent icon/label. In collapsed mode
 * only the centered icon is shown (the label is hidden).
 *
 * Keyboard (ListBox pattern): `tabIndex={0}` + ArrowUp/Down move the
 * focused row (accent border) among the sidebar's registered items, and
 * Enter/Space activates the focused row.
 */
export function SidebarMenuItem({ icon, label, selected, onClick, style }: SidebarMenuItemProps) {
  const t = useAdwaita()
  const { colors } = t
  const ctx = useSidebarCtx()
  const collapsed = ctx.collapsed

  const idRef = useRef<string | null>(null)
  if (idRef.current === null) idRef.current = `sidebar-item-${nextSidebarItemId++}`
  const id = idRef.current

  useEffect(() => {
    ctx.register(id)
    return () => ctx.unregister(id)
    // register once per row; the ctx functions are ref-backed and stable
  }, [id])

  const isFocused = ctx.focused === id

  const handleKeyDown = (event: EventPayload) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const ordered = ctx.ordered()
      if (ordered.length === 0) return
      const idx = ordered.indexOf(id)
      const next = event.key === 'ArrowDown' ? Math.min(idx + 1, ordered.length - 1) : Math.max(idx - 1, 0)
      ctx.onFocusRow(ordered[next])
    } else if (event.key === 'Enter' || event.key === ' ') {
      onClick?.()
    }
  }

  return (
    <div
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{
        borderRadius: 6,
        borderWidth: isFocused ? 1 : 0,
        borderColor: colors.accent,
        ...style,
      }}
    >
      <MenuRow
        label={collapsed ? '' : (label ?? '')}
        icon={icon}
        iconColor={selected ? colors.accent : undefined}
        labelColor={selected ? colors.accent : undefined}
        style={{
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 4 : 8,
          backgroundColor: selected ? colors.accentTint : 'transparent',
        }}
      />
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, FloatingStage, Shot, ShotItem } from './common'

/** The shared sidebar body: header + two labelled groups + a footer user row. */
function ShotSideContent({ collapsed }: { collapsed: boolean }) {
  return (
    <>
      <SidebarHeader>
        <T size="title3" weight={600}>Adwaita</T>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel icon={collapsed ? 'list' : undefined}>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem icon="home" label="Home" selected />
            <SidebarMenuItem icon="settings" label="Settings" />
            <SidebarMenuItem icon="user" label="Profile" />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel icon={collapsed ? 'settings' : undefined}>Preferences</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuItem icon="sunMoon" label="Appearance" />
            <SidebarMenuItem icon="list" label="Shortcuts" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem icon="user" label="Ada Lovelace" />
      </SidebarFooter>
    </>
  )
}

export const SidebarShot: ComponentShot = {
  name: 'Sidebar',
  el: (
    <Shot>
      <Row label="Expanded + collapsed (open prop)">
        <ShotItem label="expanded (default, 220px)">
          <Sidebar>
            <ShotSideContent collapsed={false} />
          </Sidebar>
        </ShotItem>
        <ShotItem label="collapsed (open=false, 56px rail)">
          <Sidebar open={false}>
            <ShotSideContent collapsed />
          </Sidebar>
        </ShotItem>
      </Row>
      <Row label="Mobile sheet · open (contained)" col>
        <FloatingStage width={340} height={240}>
          <Sidebar mobile contained open>
            <ShotSideContent collapsed={false} />
          </Sidebar>
        </FloatingStage>
      </Row>
      <Row label="Mobile sheet · closed" col>
        <FloatingStage width={340} height={120}>
          <Sidebar mobile contained open={false}>
            <ShotSideContent collapsed={false} />
          </Sidebar>
        </FloatingStage>
      </Row>
    </Shot>
  ),
}
