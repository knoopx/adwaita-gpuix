import { createContext, useContext, useState, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { MenuBarShell, FloatingPanel, MenuRow, MenuLabel, MenuSeparator, MenuIndicator, MenuShortcut, MenuRadioGroupShell, useMenuRadioGroup, MenuRadioRow, MenuSub, MenuSubTrigger, MenuSubContent, destructiveRowProps } from './common'
import { Icon, type IconName } from './icons'

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

  inset?: boolean

  variant?: 'default' | 'destructive'

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

export function Menubar({ children, style }: MenubarProps) {
  return (
    <MenuBarShell style={style}>
      {children}
    </MenuBarShell>
  )
}

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

export function MenubarRadioGroup({ value, defaultValue, onValueChange, children, style }: MenubarRadioGroupProps) {
  return <MenuRadioGroupShell value={value} defaultValue={defaultValue} onValueChange={onValueChange} children={children} style={style} />
}

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

export function MenubarSub({ children, style }: MenubarSubProps) {
  return <MenuSub style={style}>{children}</MenuSub>
}

export function MenubarSubTrigger({ label, icon, style }: MenubarSubTriggerProps) {
  return <MenuSubTrigger label={label} icon={icon} rowStyle={{ gap: 6, padding: 6, paddingLeft: 10, paddingRight: 10 }} style={style} />
}

export function MenubarSubContent({ children, style }: MenubarSubContentProps) {
  return <MenuSubContent style={style}>{children}</MenuSubContent>
}

export function MenubarShortcut({ children, style }: MenubarShortcutProps) {
  return <MenuShortcut style={style}>{children}</MenuShortcut>
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot } from './common'

function MenubarContentFrame({ children }: { children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 4,
        borderRadius: t.radii.card,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.view_bg,
      }}
    >
      {children}
    </div>
  )
}

export const MenubarShot: ComponentShot = {
  name: 'Menubar',
  el: (
    <Shot>
      <Row label="Bar (popdowns closed — open state is internal)">
        <Menubar>
          <MenubarMenu label="File">
            <MenubarContent>
              <MenubarItem label="New file" icon="plus" shortcut="Ctrl+N" />
            </MenubarContent>
          </MenubarMenu>
          <MenubarTrigger label="Edit">
            <MenubarContent>
              <MenubarItem label="Cut" icon="minus" />
            </MenubarContent>
          </MenubarTrigger>
          <MenubarTrigger label="View">
            <MenubarContent>
              <MenubarItem label="Zoom in" icon="plus" />
            </MenubarContent>
          </MenubarTrigger>
        </Menubar>
      </Row>
      <Row label="Content · item variants (static block)" col>
        <MenubarContentFrame>
          <MenubarContent>
            <MenubarLabel>Editing</MenubarLabel>
            <MenubarItem label="Cut" icon="minus" shortcut="Ctrl+X" />
            <MenubarItem label="Copy" icon="plus" />
            <MenubarItem label="Indented row" icon="list" inset />
            <MenubarItem label="Delete" icon="trash" variant="destructive" />
            <MenubarSeparator />
            <MenubarCheckboxItem label="Show hidden" checked={true} onCheckedChange={() => {}} />
            <MenubarRadioGroup defaultValue="dark">
              <MenubarRadioItem label="Light theme" value="light" />
              <MenubarRadioItem label="Dark theme" value="dark" />
            </MenubarRadioGroup>
            <MenubarSub>
              <MenubarSubTrigger label="Submenu" icon="chevronRight" />
              <MenubarSubContent>
                <MenubarItem label="Sub item" />
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarContentFrame>
      </Row>
    </Shot>
  ),
}
