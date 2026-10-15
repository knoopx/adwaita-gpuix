import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { FloatingPanel, MenuRow, MenuLabel, MenuSeparator, MenuIndicator, MenuShortcut, MenuGroup, MenuRadioGroupShell, MenuSub, MenuSubTrigger, MenuSubContent, makeMenuRadioItem, destructiveRowProps } from './common'
import { type IconName } from './icons'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface DropdownMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
}

export interface DropdownMenuTriggerProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface DropdownMenuContentProps {
  children?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  style?: Partial<StyleDesc>
}

export interface DropdownMenuItemProps {
  label: string
  icon?: IconName
  onClick?: () => void
  disabled?: boolean
  /** Indented row (32px left padding) for nested / grouped items. */
  inset?: boolean
  /** 'destructive' renders the row in the destructive color. */
  variant?: 'default' | 'destructive'
  /** Trailing keyboard-shortcut hint. */
  shortcut?: string
  style?: Partial<StyleDesc>
}

export interface DropdownMenuLabelProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface DropdownMenuSeparatorProps {
  style?: Partial<StyleDesc>
}

export interface DropdownMenuGroupProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DropdownMenuCheckboxItemProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  style?: Partial<StyleDesc>
}

export interface DropdownMenuRadioItemProps {
  label: string
  value?: string
  selected?: boolean
  onSelect?: () => void
  style?: Partial<StyleDesc>
}

export interface DropdownMenuRadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DropdownMenuShortcutProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface DropdownMenuSubProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface DropdownMenuSubTriggerProps {
  label: string
  icon?: IconName
  style?: Partial<StyleDesc>
}

export interface DropdownMenuSubContentProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/* ── Context ──────────────────────────────────────────────────────────── */

interface DropdownMenuContext {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DDMCtx = createContext<DropdownMenuContext | null>(null)

function useDropdownMenu(): DropdownMenuContext {
  const ctx = useContext(DDMCtx)
  if (!ctx) throw new Error('DropdownMenu components must be used within <DropdownMenu>')
  return ctx
}

/* ── Components ───────────────────────────────────────────────────────── */

export function DropdownMenu({ open, onOpenChange, children }: DropdownMenuProps) {
  return <DDMCtx.Provider value={{ open, onOpenChange }}>{children}</DDMCtx.Provider>
}

export function DropdownMenuTrigger({ children, style }: DropdownMenuTriggerProps) {
  const { onOpenChange } = useDropdownMenu()
  return (
    <div onClick={() => onOpenChange(true)} style={{ cursor: 'pointer', ...style }}>
      {children}
    </div>
  )
}

export function DropdownMenuContent({ children, side = 'bottom', sideOffset = 4, style }: DropdownMenuContentProps) {
  const { open } = useDropdownMenu()

  if (!open) return null

  return (
    <FloatingPanel side={side} sideOffset={sideOffset} minWidth={180} style={style}>
      {children}
    </FloatingPanel>
  )
}

export function DropdownMenuItem({ label, icon, onClick, disabled, inset, variant, shortcut, style }: DropdownMenuItemProps) {
  const { onOpenChange } = useDropdownMenu()
  const t = useAdwaita()
  const destructive = variant === 'destructive'
  return (
    <MenuRow
      label={label}
      icon={icon}
      disabled={disabled}
      onClick={() => {
        onClick?.()
        onOpenChange(false)
      }}
      {...(destructive ? destructiveRowProps(t) : {})}
      trailing={shortcut ? <MenuShortcut>{shortcut}</MenuShortcut> : undefined}
      style={{ ...(inset ? { paddingLeft: 32 } : {}), ...style }}
    />
  )
}

export function DropdownMenuLabel({ children, style }: DropdownMenuLabelProps) {
  return <MenuLabel style={style}>{children}</MenuLabel>
}

export function DropdownMenuSeparator({ style }: DropdownMenuSeparatorProps) {
  return <MenuSeparator style={style} />
}

export function DropdownMenuGroup({ children, style }: DropdownMenuGroupProps) {
  return <MenuGroup style={style}>{children}</MenuGroup>
}

export function DropdownMenuCheckboxItem({ label, checked, onCheckedChange, style }: DropdownMenuCheckboxItemProps) {
  const { onOpenChange } = useDropdownMenu()
  return (
    <MenuRow
      label={label}
      onClick={() => {
        onCheckedChange(!checked)
        onOpenChange(false)
      }}
      leading={<MenuIndicator kind="checkbox" active={checked} />}
      style={style}
    />
  )
}

const DropdownMenuRadioItemBase = makeMenuRadioItem(useDropdownMenu)

export function DropdownMenuRadioItem(props: DropdownMenuRadioItemProps) {
  return <DropdownMenuRadioItemBase {...props} />
}

/* ── Radio group ──────────────────────────────────────────────────────── */

/**
 * A group of radio items sharing one selection. Controlled via `value` +
 * `onValueChange`, uncontrolled via `defaultValue`; items without an
 * explicit `selected` derive it from the group's current value.
 */
export function DropdownMenuRadioGroup({ value, defaultValue, onValueChange, children, style }: DropdownMenuRadioGroupProps) {
  return <MenuRadioGroupShell value={value} defaultValue={defaultValue} onValueChange={onValueChange} children={children} style={style} />
}

/* ── Shortcut ─────────────────────────────────────────────────────────── */

/** A trailing keyboard-shortcut hint for a menu row. */
export function DropdownMenuShortcut({ children, style }: DropdownMenuShortcutProps) {
  return <MenuShortcut style={style}>{children}</MenuShortcut>
}

/* ── Sub-menu ─────────────────────────────────────────────────────────── */

/**
 * A nested sub-menu: a positioned column wrapper that owns the open/close
 * state of its trigger + content (GPUix has no DOM sub-menu portal; the
 * anchored panel is the idiom).
 */
export function DropdownMenuSub({ children, style }: DropdownMenuSubProps) {
  return <MenuSub style={style}>{children}</MenuSub>
}

/** The row that toggles a sub-menu open/closed, with a chevron trailing. */
export function DropdownMenuSubTrigger({ label, icon, style }: DropdownMenuSubTriggerProps) {
  return <MenuSubTrigger label={label} icon={icon} style={style} />
}

/** The anchored panel of a sub-menu, shown only while the sub is open. */
export function DropdownMenuSubContent({ children, style }: DropdownMenuSubContentProps) {
  return <MenuSubContent style={style}>{children}</MenuSubContent>
}
