import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { StyleDesc, EventPayload } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T, MenuRow } from './common'
import { Icon, type IconName } from './icons'
import { Sheet, SheetContent } from './Sheet'

interface SidebarContextValue {

  open: boolean

  collapsed: boolean

  focused: string | null
  onFocusRow: (id: string) => void
  register: (id: string) => void
  unregister: (id: string) => void

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

function useSidebarCtx(): SidebarContextValue {
  return useContext(SidebarCtx) ?? FALLBACK_CTX
}

const EXPANDED_WIDTH = 220

const COLLAPSED_WIDTH = 56

export interface SidebarProps {

  width?: number

  open?: boolean

  onOpenChange?: (open: boolean) => void

  mobile?: boolean

  contained?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

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



  const [internalOpen, setInternalOpen] = useState(mobile ? (open ?? false) : (open ?? true))
  const effectiveOpen = open ?? internalOpen
  const collapsed = !effectiveOpen


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

export function SidebarGroup({ children, style }: SidebarGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {children}
    </div>
  )
}

export interface SidebarGroupLabelProps {
  children?: ReactNode

  icon?: IconName
  style?: Partial<StyleDesc>
}

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

export interface SidebarMenuItemProps {

  icon?: IconName

  label?: string

  selected?: boolean
  onClick?: () => void
  style?: Partial<StyleDesc>
}

let nextSidebarItemId = 0

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

import type { ComponentShot } from '../../scripts/shot'
import { Row, FloatingStage, Shot, ShotItem } from './common'

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
