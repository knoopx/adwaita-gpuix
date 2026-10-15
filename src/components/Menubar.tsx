import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { MenuBarShell, FloatingPanel, MenuRow, MenuLabel, MenuSeparator, MenuIndicator, MenuShortcut, MenuRadioGroupShell, useMenuRadioGroup, MenuRadioRow, MenuSub, MenuSubTrigger, MenuSubContent, destructiveRowProps } from './common'
import { Icon, type IconName } from './icons'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface MenubarProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface MenubarMenuProps {
  label: string
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface MenubarItemProps {
  label: string
  icon?: IconName
  onClick?: () => void
  /** Indented row (32px left padding) for nested / grouped items. */
  inset?: boolean
  /** 'destructive' renders the row in the destructive color. */
  variant?: 'default' | 'destructive'
  /** Trailing keyboard-shortcut hint. */
  shortcut?: string
  style?: Partial<StyleDesc>
}

export interface MenubarTriggerProps {
  label: string
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface MenubarContentProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface MenubarLabelProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface MenubarSeparatorProps {
  style?: Partial<StyleDesc>
}

export interface MenubarCheckboxItemProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  style?: Partial<StyleDesc>
}

export interface MenubarRadioItemProps {
  label: string
  value?: string
  selected?: boolean
  onSelect?: () => void
  style?: Partial<StyleDesc>
}

export interface MenubarRadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface MenubarSubProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface MenubarSubTriggerProps {
  label: string
  icon?: IconName
  style?: Partial<StyleDesc>
}

export interface MenubarSubContentProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface MenubarShortcutProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/* ── Components ───────────────────────────────────────────────────────── */

export function Menubar({ children, style }: MenubarProps) {
  return (
    <MenuBarShell style={style}>
      {children}
    </MenuBarShell>
  )
}

/** Shared body of MenubarMenu / MenubarTrigger: a self-contained openable top-bar item with an anchored panel. */
function MenubarDropdown({ label, children, style }: MenubarMenuProps) {
  const t = useAdwaita()
  const { colors } = t
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', position: 'relative', ...style }}>
      <MenuRow
        label={label}
        onClick={() => setOpen(!open)}
        trailing={<Icon name="chevronDown" size={12} color={colors.dim_fg} style={{ flexShrink: 0 }} />}
        style={{ gap: 6, padding: 6, paddingLeft: 10, paddingRight: 10, backgroundColor: open ? colors.accentTint : 'transparent' }}
      />
      {open ? (
        <FloatingPanel minWidth={160} style={{ borderRadius: 10 }}>
          {children}
        </FloatingPanel>
      ) : null}
    </div>
  )
}

/** A self-contained trigger+content pairing: an openable top-bar item whose anchored panel holds the menu content. */
export function MenubarMenu(props: MenubarMenuProps) {
  return <MenubarDropdown {...props} />
}

export function MenubarItem({ label, icon, onClick, inset, variant, shortcut, style }: MenubarItemProps) {
  const t = useAdwaita()
  const destructive = variant === 'destructive'
  return (
    <MenuRow
      label={label}
      icon={icon}
      onClick={onClick}
      {...(destructive ? destructiveRowProps(t) : {})}
      trailing={shortcut ? <MenuShortcut>{shortcut}</MenuShortcut> : undefined}
      style={{ gap: 6, padding: 6, paddingLeft: inset ? 32 : 10, paddingRight: 10, ...style }}
    />
  )
}

export function MenubarTrigger({ label, children, style }: MenubarTriggerProps) {
  return <MenubarDropdown label={label} children={children} style={style} />
}

export function MenubarContent({ children, style }: MenubarContentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 4, minWidth: 160, ...style }}>
      {children}
    </div>
  )
}

export function MenubarLabel({ children, style }: MenubarLabelProps) {
  return <MenuLabel style={style}>{children}</MenuLabel>
}

export function MenubarSeparator({ style }: MenubarSeparatorProps) {
  return <MenuSeparator style={style} />
}

/** A toggleable menubar row with a 16×16 checkbox indicator. */
export function MenubarCheckboxItem({ label, checked, onCheckedChange, style }: MenubarCheckboxItemProps) {
  return (
    <MenuRow
      label={label}
      leading={<MenuIndicator kind="checkbox" active={checked} />}
      onClick={() => onCheckedChange(!checked)}
      style={{ gap: 6, padding: 6, paddingLeft: 10, paddingRight: 10, ...style }}
    />
  )
}

/* ── Radio group ──────────────────────────────────────────────────────── */

/**
 * A group of radio items sharing one selection. Controlled via `value` +
 * `onValueChange`, uncontrolled via `defaultValue`; items without an
 * explicit `selected` derive it from the group's current value.
 */
export function MenubarRadioGroup({ value, defaultValue, onValueChange, children, style }: MenubarRadioGroupProps) {
  return <MenuRadioGroupShell value={value} defaultValue={defaultValue} onValueChange={onValueChange} children={children} style={style} />
}

/** A radio menubar row; selection comes from its MenubarRadioGroup when no explicit `selected` is given. */
export function MenubarRadioItem({ label, value, selected, onSelect, style }: MenubarRadioItemProps) {
  const group = useMenuRadioGroup()
  return (
    <MenuRadioRow
      label={label}
      value={value}
      selected={selected}
      group={group}
      onSelect={onSelect}
      style={{ gap: 6, padding: 6, paddingLeft: 10, paddingRight: 10, ...style }}
    />
  )
}

/* ── Sub-menu ─────────────────────────────────────────────────────────── */

/**
 * A nested sub-menu: a positioned column wrapper that owns the open/close
 * state of its trigger + content (GPUix has no DOM sub-menu portal; the
 * anchored panel is the idiom).
 */
export function MenubarSub({ children, style }: MenubarSubProps) {
  return <MenuSub style={style}>{children}</MenuSub>
}

/** The row that toggles a sub-menu open/closed, with a chevron trailing. */
export function MenubarSubTrigger({ label, icon, style }: MenubarSubTriggerProps) {
  return <MenuSubTrigger label={label} icon={icon} rowStyle={{ gap: 6, padding: 6, paddingLeft: 10, paddingRight: 10 }} style={style} />
}

/** The anchored panel of a sub-menu, shown only while the sub is open. */
export function MenubarSubContent({ children, style }: MenubarSubContentProps) {
  return <MenuSubContent style={style}>{children}</MenuSubContent>
}

/** A trailing keyboard-shortcut hint for a menubar row. */
export function MenubarShortcut({ children, style }: MenubarShortcutProps) {
  return <MenuShortcut style={style}>{children}</MenuShortcut>
}
