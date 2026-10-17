import { Children } from 'react'
import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import {
  Select as SelectRootPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue as SelectValuePrimitive,
  SelectContent as SelectContentPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectGroup as SelectGroupPrimitive,
  SelectLabel as SelectLabelPrimitive,
  SelectSeparator as SelectSeparatorPrimitive,
} from '@gpuix/react/select'
import { useAdwaita } from '../theme/adwaita'
import { T, listPanelStyle, selectTriggerStyle } from './common'
import { Icon } from './icons'

export interface SelectProps {
  items?: readonly { value: string; label?: ReactNode; textValue?: string }[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export function Select({ style, ...props }: SelectProps) {
  return <SelectRootPrimitive {...props} style={style} />
}

export interface SelectTriggerProps {
  children?: ReactNode
  disabled?: boolean

  size?: 'sm' | 'default'
  style?: Partial<StyleDesc>
}

export function SelectTrigger({ children, disabled, size = 'default', style }: SelectTriggerProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <SelectTriggerPrimitive
      disabled={disabled}
      style={selectTriggerStyle(t, { minHeight: size === 'sm' ? 28 : 34, ...style })}
    >
      {children}
      <Icon name="chevronDown" size={14} color={colors.dim_fg} />
    </SelectTriggerPrimitive>
  )
}

export interface SelectValueProps {
  placeholder?: ReactNode
  children?: ReactNode
}

export function SelectValue({ placeholder, children }: SelectValueProps) {
  const t = useAdwaita()
  void t
  return <SelectValuePrimitive placeholder={placeholder}>{children}</SelectValuePrimitive>
}

export interface SelectContentProps {
  children?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number

  virtual?: boolean
  style?: Partial<StyleDesc>
}

export function SelectContent({ children, side = 'bottom', sideOffset = 4, virtual = false, style }: SelectContentProps) {
  const t = useAdwaita()
  return (
    <SelectContentPrimitive side={side} sideOffset={sideOffset} style={listPanelStyle(t, style)}>
      {virtual ? (
        <virtual-list estimatedItemHeight={36} style={{ maxHeight: 200, width: '100%' }}>
          {Children.map(children, (child) => (
            <div style={{ display: 'flex', flexDirection: 'column', height: 36 }}>{child}</div>
          ))}
        </virtual-list>
      ) : (
        children
      )}
    </SelectContentPrimitive>
  )
}

export interface SelectItemProps {
  value: string
  disabled?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export function SelectItem({ value, disabled, children, style }: SelectItemProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <SelectItemPrimitive
      value={value}
      disabled={disabled}
      style={({ selected, highlighted }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: 8,
        cursor: 'pointer',
        backgroundColor: selected || highlighted ? colors.accentTint : 'transparent',
        opacity: disabled ? 0.5 : 1,
        ...style,
      })}
    >
      {({ selected }) => (
        <>
          <T size="body" color={colors.fg}>
            {children}
          </T>
          {selected ? <Icon name="success" size={12} color={colors.accent} /> : null}
        </>
      )}
    </SelectItemPrimitive>
  )
}

export interface SelectGroupProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export function SelectGroup({ children, style }: SelectGroupProps) {
  return (
    <SelectGroupPrimitive style={style}>
      {children}
    </SelectGroupPrimitive>
  )
}

export interface SelectLabelProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function SelectLabel({ children, style }: SelectLabelProps) {
  const t = useAdwaita()
  return (
    <SelectLabelPrimitive
      style={{
        padding: 8,
        paddingBottom: 4,
        ...style,
      }}
    >
      <T size="caption" color={t.colors.dim_fg}>
        {children}
      </T>
    </SelectLabelPrimitive>
  )
}

export interface SelectSeparatorProps {
  style?: Partial<StyleDesc>
}

export function SelectSeparator({ style }: SelectSeparatorProps) {
  const t = useAdwaita()
  return (
    <SelectSeparatorPrimitive
      style={{
        height: 1,
        backgroundColor: t.colors.border,
        ...style,
      }}
    />
  )
}

import { LEVELS, type ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

function SelectStage({ width = 240, children }: { width?: number; children: ReactNode }) {
  return <div style={{ width }}>{children}</div>
}

function ShotSelectValue({ text, dim = false }: { text: string; dim?: boolean }) {
  const t = useAdwaita()
  return (
    <SelectValue>
      <T size="body" color={dim ? t.colors.dim_fg : t.colors.fg}>
        {text}
      </T>
    </SelectValue>
  )
}

function ShotSelectValuePlaceholder() {
  const t = useAdwaita()
  return <SelectValue placeholder={<T size="body" color={t.colors.dim_fg}>Select…</T>} />
}

function SideSelect({ side }: { side: 'top' | 'right' | 'left' }) {
  return (
    <SelectStage>
      <Select open value="low" items={LEVELS} onValueChange={() => {}}>
        <SelectTrigger>
          <ShotSelectValue text="Low" />
        </SelectTrigger>
        <SelectContent side={side}>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
        </SelectContent>
      </Select>
    </SelectStage>
  )
}

export const SelectShot: ComponentShot = {
  name: 'Select',
  el: (
    <Shot>
      <Row label="Trigger (sizes + states)">
        <ShotItem label="default (34px)">
          <Select value="medium" items={LEVELS} onValueChange={() => {}}>
            <SelectTrigger>
              <ShotSelectValue text="Medium" />
            </SelectTrigger>
          </Select>
        </ShotItem>
        <ShotItem label="sm (28px)">
          <Select value="high" items={LEVELS} onValueChange={() => {}}>
            <SelectTrigger size="sm">
              <ShotSelectValue text="High" />
            </SelectTrigger>
          </Select>
        </ShotItem>
        <ShotItem label="placeholder">
          <Select items={LEVELS} onValueChange={() => {}}>
            <SelectTrigger>
              <ShotSelectValuePlaceholder />
            </SelectTrigger>
          </Select>
        </ShotItem>
        <ShotItem label="disabled">
          <Select value="low" items={LEVELS} disabled onValueChange={() => {}}>
            <SelectTrigger disabled>
              <ShotSelectValue text="Low" dim />
            </SelectTrigger>
          </Select>
        </ShotItem>
      </Row>
      <Row label="Open dropdown" col>
        <ShotItem label="groups + separator + disabled item">
          <SelectStage>
            <Select open value="medium" items={LEVELS} onValueChange={() => {}}>
              <SelectTrigger>
                <ShotSelectValue text="Medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>More</SelectLabel>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="off" disabled>Disabled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </SelectStage>
        </ShotItem>
        <ShotItem label="virtual list (virtual-list rows)">
          <SelectStage>
            <Select open value="medium" items={LEVELS} onValueChange={() => {}}>
              <SelectTrigger>
                <ShotSelectValue text="Medium" />
              </SelectTrigger>
              <SelectContent virtual>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </SelectStage>
        </ShotItem>
      </Row>
      <Row label="Content sides (side prop)" col>
        <ShotItem label="side=top"><SideSelect side="top" /></ShotItem>
        <ShotItem label="side=right"><SideSelect side="right" /></ShotItem>
        <ShotItem label="side=left"><SideSelect side="left" /></ShotItem>
      </Row>
    </Shot>
  ),
}
