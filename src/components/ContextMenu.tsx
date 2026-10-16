import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc, EventPayload } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { FloatingPanel, MenuRow, MenuIndicator, MenuShortcut, MenuLabel, MenuSeparator, MenuGroup, MenuRadioGroupShell, MenuSub, MenuSubTrigger, MenuSubContent, makeMenuRadioItem } from './common'
import { type IconName } from './icons'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface ContextMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
}

export interface ContextMenuTriggerProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface ContextMenuContentProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface ContextMenuItemProps {
  label: string
  icon?: IconName
  onClick?: () => void
  disabled?: boolean
  style?: Partial<StyleDesc>
}

export interface ContextMenuGroupProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface ContextMenuLabelProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface ContextMenuSeparatorProps {
  style?: Partial<StyleDesc>
}

export interface ContextMenuShortcutProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface ContextMenuCheckboxItemProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  style?: Partial<StyleDesc>
}

export interface ContextMenuRadioItemProps {
  label: string
  value?: string
  selected?: boolean
  onSelect?: () => void
  style?: Partial<StyleDesc>
}

export interface ContextMenuRadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface ContextMenuSubProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export interface ContextMenuSubTriggerProps {
  label: string
  icon?: IconName
  style?: Partial<StyleDesc>
}

export interface ContextMenuSubContentProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/* ── Context ──────────────────────────────────────────────────────────── */

interface ContextMenuContext {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CtxMenuCtx = createContext<ContextMenuContext | null>(null)

function useContextMenu(): ContextMenuContext {
  const ctx = useContext(CtxMenuCtx)
  if (!ctx) throw new Error('ContextMenu components must be used within <ContextMenu>')
  return ctx
}

/* ── Components ───────────────────────────────────────────────────────── */

export function ContextMenu({ open, onOpenChange, children }: ContextMenuProps) {
  return <CtxMenuCtx.Provider value={{ open, onOpenChange }}>{children}</CtxMenuCtx.Provider>
}

export function ContextMenuTrigger({ children, style }: ContextMenuTriggerProps) {
  const { onOpenChange } = useContextMenu()
  return (
    <div
      onAuxClick={(e: EventPayload) => {
        if (e.isRightClick) onOpenChange(true)
      }}
      style={{ cursor: 'pointer', ...style }}
    >
      {children}
    </div>
  )
}

export function ContextMenuContent({ children, style }: ContextMenuContentProps) {
  const { open } = useContextMenu()

  if (!open) return null

  return (
    <FloatingPanel xOffset={4} minWidth={160} style={style}>
      {children}
    </FloatingPanel>
  )
}

export function ContextMenuItem({ label, icon, onClick, disabled, style }: ContextMenuItemProps) {
  const { onOpenChange } = useContextMenu()

  return (
    <MenuRow
      label={label}
      icon={icon}
      disabled={disabled}
      onClick={() => {
        onClick?.()
        onOpenChange(false)
      }}
      style={style}
    />
  )
}

/** A column of context-menu entries. */
export function ContextMenuGroup({ children, style }: ContextMenuGroupProps) {
  return <MenuGroup style={style}>{children}</MenuGroup>
}

/** A caption-dim label above a menu group. */
export function ContextMenuLabel({ children, style }: ContextMenuLabelProps) {
  return <MenuLabel style={style}>{children}</MenuLabel>
}

/** A 1px horizontal separator between menu groups. */
export function ContextMenuSeparator({ style }: ContextMenuSeparatorProps) {
  return <MenuSeparator style={style} />
}

/** A trailing keyboard-shortcut hint for a menu row. */
export function ContextMenuShortcut({ children, style }: ContextMenuShortcutProps) {
  return <MenuShortcut style={style}>{children}</MenuShortcut>
}

/** A toggleable menu row with a 16×16 checkbox indicator. */
export function ContextMenuCheckboxItem({ label, checked, onCheckedChange, style }: ContextMenuCheckboxItemProps) {
  const { onOpenChange } = useContextMenu()
  return (
    <MenuRow
      label={label}
      leading={<MenuIndicator kind="checkbox" active={checked} />}
      onClick={() => {
        onCheckedChange(!checked)
        onOpenChange(false)
      }}
      style={style}
    />
  )
}

/* ── Radio group ──────────────────────────────────────────────────────── */

/**
 * A group of radio items sharing one selection. Controlled via `value` +
 * `onValueChange`, uncontrolled via `defaultValue`; items without an
 * explicit `selected` derive it from the group's current value.
 */
export function ContextMenuRadioGroup({ value, defaultValue, onValueChange, children, style }: ContextMenuRadioGroupProps) {
  return <MenuRadioGroupShell value={value} defaultValue={defaultValue} onValueChange={onValueChange} children={children} style={style} />
}

const ContextMenuRadioItemBase = makeMenuRadioItem(useContextMenu)

/** A radio menu row; selection comes from its ContextMenuRadioGroup when no explicit `selected` is given. */
export function ContextMenuRadioItem(props: ContextMenuRadioItemProps) {
  return <ContextMenuRadioItemBase {...props} />
}

/* ── Sub-menu ─────────────────────────────────────────────────────────── */

/**
 * A nested sub-menu: a positioned column wrapper that owns the open/close
 * state of its trigger + content (GPUix has no DOM sub-menu portal; the
 * anchored panel is the idiom).
 */
export function ContextMenuSub({ children, style }: ContextMenuSubProps) {
  return <MenuSub style={style}>{children}</MenuSub>
}

/** The row that toggles a sub-menu open/closed, with a chevron trailing. */
export function ContextMenuSubTrigger({ label, icon, style }: ContextMenuSubTriggerProps) {
  return <MenuSubTrigger label={label} icon={icon} style={style} />
}

/** The anchored panel of a sub-menu, shown only while the sub is open. */
export function ContextMenuSubContent({ children, style }: ContextMenuSubContentProps) {
  return <MenuSubContent style={style}>{children}</MenuSubContent>
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { T, Row, FloatingStage, Shot, ShotItem } from './common'
import { buildTheme } from '../theme/adwaita'

/** The full open context menu: every row kind the API exposes
 *  (label, items, disabled, checkbox checked/unchecked, radio group, sub-trigger). */
function CtxMenuFull() {
  return (
    <ContextMenu open={true} onOpenChange={() => {}}>
      <ContextMenuContent>
        <ContextMenuLabel>Selection</ContextMenuLabel>
        <ContextMenuItem label="Copy" icon="list" />
        <ContextMenuItem label="Paste" icon="plus" />
        <ContextMenuItem label="Delete" icon="trash" disabled />
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem label="Cut" icon="minus" />
        </ContextMenuGroup>
        <ContextMenuCheckboxItem label="Show hidden" checked={true} onCheckedChange={() => {}} />
        <ContextMenuCheckboxItem label="Wrap lines" checked={false} onCheckedChange={() => {}} />
        <ContextMenuRadioGroup defaultValue="a">
          <ContextMenuRadioItem label="Small" value="a" />
          <ContextMenuRadioItem label="Large" value="b" />
        </ContextMenuRadioGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger label="Submenu" icon="chevronRight" />
          <ContextMenuSubContent>
            <ContextMenuItem label="Sub item" />
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export const ContextMenuShot: ComponentShot = {
  name: 'ContextMenu',
  el: (
    <Shot>
      <Row label="Trigger area (closed — right-click to open)">
        <ContextMenu open={false} onOpenChange={() => {}}>
          <ContextMenuTrigger>
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                borderColor: buildTheme('dark', 'blue').colors.border,
                borderWidth: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <T>Right-click me</T>
            </div>
          </ContextMenuTrigger>
        </ContextMenu>
      </Row>
      <Row label="Open · all row kinds" col>
        <FloatingStage width={480} height={300}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <CtxMenuFull />
          </div>
        </FloatingStage>
      </Row>
    </Shot>
  ),
}
