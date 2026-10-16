import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { MenuBarShell, FloatingPanel, MenuRow } from './common'
import { Icon } from './icons'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface NavigationMenuProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface NavigationMenuListProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface NavigationMenuIndicatorProps {
  style?: Partial<StyleDesc>
}

export interface NavigationMenuItemProps {
  children?: ReactNode
  item?: string
  style?: Partial<StyleDesc>
}

export interface NavigationMenuTriggerProps {
  children: ReactNode
  item?: string
  style?: Partial<StyleDesc>
}

export interface NavigationMenuContentProps {
  children?: ReactNode
  item?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  style?: Partial<StyleDesc>
}

export interface NavigationMenuLinkProps {
  label: string
  onClick?: () => void
  active?: boolean
  style?: Partial<StyleDesc>
}

/* ── Context ──────────────────────────────────────────────────────────── */

interface NavigationMenuContextValue {
  open: string | null
  setOpen: (item: string | null) => void
}

const NavMenuCtx = createContext<NavigationMenuContextValue | null>(null)

/** Read the NavigationMenu open-state context (null outside a NavigationMenu). */
function useNavigationMenu(): NavigationMenuContextValue | null {
  return useContext(NavMenuCtx)
}

/* ── Components ───────────────────────────────────────────────────────── */

/**
 * A NavigationMenu bar: provides the open-item context. The open item id
 * lives in the context; a Trigger toggles it and a Content gates on it.
 */
export function NavigationMenu({ children, style }: NavigationMenuProps) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <NavMenuCtx.Provider value={{ open, setOpen }}>
      <MenuBarShell style={style}>{children}</MenuBarShell>
    </NavMenuCtx.Provider>
  )
}

/** A horizontal row of menu items (the bar's content). */
export function NavigationMenuList({ children, style }: NavigationMenuListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, ...style }}>
      {children}
    </div>
  )
}

/** A 12px-wide 3px accent underline shown beneath the open item. */
export function NavigationMenuIndicator({ style }: NavigationMenuIndicatorProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        width: 12,
        height: 3,
        borderRadius: 2,
        backgroundColor: t.colors.accent,
        ...style,
      }}
    />
  )
}

/** A menu item slot: an optional `item` id gates the open underline. */
export function NavigationMenuItem({ children, item, style }: NavigationMenuItemProps) {
  const ctx = useNavigationMenu()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        ...style,
      }}
    >
      {children}
      {item !== undefined && ctx?.open === item ? <NavigationMenuIndicator /> : null}
    </div>
  )
}

/** A hoverable pill trigger (+ chevron) that toggles its `item`'s open state. */
export function NavigationMenuTrigger({ children, item, style }: NavigationMenuTriggerProps) {
  const t = useAdwaita()
  const { colors } = t
  const ctx = useNavigationMenu()
  return (
    <div
      onClick={() => {
        if (item !== undefined && ctx) ctx.setOpen(ctx.open === item ? null : item)
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 6,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 6,
        cursor: 'pointer',
        hover: { backgroundColor: colors.accentTint },
        backgroundColor: item !== undefined && ctx?.open === item ? colors.accentTint : 'transparent',
        ...style,
      }}
    >
      {children}
      <Icon name="chevronDown" size={12} color={colors.dim_fg} />
    </div>
  )
}

/** An anchored popdown, gated: renders only when its `item` is the open one. */
export function NavigationMenuContent({ children, item, side = 'bottom', sideOffset = 4, style }: NavigationMenuContentProps) {
  const ctx = useNavigationMenu()
  if (item !== undefined && ctx?.open !== item) return null
  return (
    <FloatingPanel side={side} sideOffset={sideOffset} minWidth={180} padding={8} style={style}>
      {children}
    </FloatingPanel>
  )
}

/** A flat menu link; `active` tints the row + label with the accent. */
export function NavigationMenuLink({ label, onClick, active, style }: NavigationMenuLinkProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <MenuRow
      label={label}
      onClick={onClick}
      labelColor={active ? colors.accent : undefined}
      style={{
        gap: 0,
        backgroundColor: active ? colors.accentTint : 'transparent',
        ...style,
      }}
    />
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { T, Row, FloatingStage, Shot, ShotItem } from './common'

export const NavigationMenuShot: ComponentShot = {
  name: 'NavigationMenu',
  el: (
    <Shot>
      <Row label="Bar (open state is internal — popdowns closed)">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem item="products">
              <NavigationMenuTrigger item="products">
                <T>Products</T>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink label="Docs" active />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink label="About" />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Row>
      <Row label="Popdown (ungated content, item prop omitted) + indicator" col>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
          <ShotItem label="NavigationMenuContent (links: active + inactive)">
            <FloatingStage width={240} height={150}>
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
                <NavigationMenuContent>
                  <NavigationMenuLink label="Laptops" />
                  <NavigationMenuLink label="Phones" active />
                  <NavigationMenuLink label="Tablets" />
                </NavigationMenuContent>
              </div>
            </FloatingStage>
          </ShotItem>
          <ShotItem label="NavigationMenuIndicator (open underline)">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <T size="body">Products</T>
              <NavigationMenuIndicator />
            </div>
          </ShotItem>
        </div>
      </Row>
    </Shot>
  ),
}
