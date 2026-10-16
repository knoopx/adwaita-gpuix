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

/**
 * Adwaita-styled compound Select using the `@gpuix/react/select` headless primitive.
 */
export function Select({ style, ...props }: SelectProps) {
  return <SelectRootPrimitive {...props} style={style} />
}

export interface SelectTriggerProps {
  children?: ReactNode
  disabled?: boolean
  /** Trigger height: `sm` = 28px minHeight, `default` = 34px. */
  size?: 'sm' | 'default'
  style?: Partial<StyleDesc>
}

/** Pill trigger with a chevron icon. `size` maps to a 28 / 34px minHeight. */
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

/** Shows the selected label or a placeholder. */
export function SelectValue({ placeholder, children }: SelectValueProps) {
  const t = useAdwaita()
  void t
  return <SelectValuePrimitive placeholder={placeholder}>{children}</SelectValuePrimitive>
}

export interface SelectContentProps {
  children?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  /**
   * Render the items as fixed-height (36px) `<virtual-list>` rows — the
   * GPUix-idiomatic scroller for very long (50+) item lists. Each item is
   * wrapped in a 36px row div (the `virtual-list`'s estimatedItemHeight).
   */
  virtual?: boolean
  style?: Partial<StyleDesc>
}

/**
 * Anchored dropdown list with 1px border, card radius, shadow.
 *
 * `position: 'item-aligned' | 'popper'` (shadcn) is **N/A**: the `@gpuix/react`
 * `SelectContent` primitive only exposes `side` / `sideOffset` / `align` /
 * `alignOffset` / `collisionPadding` (it extends `FloatingContentProps`) and
 * has no item-aligned/popper distinction — anchoring is always via `side`.
 */
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

/** An option row: hover=accentTint, selected=accentTint bg. */
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
      {/* children via the primitive's state render function: a trailing 12px
          accent check indicator shows only while this item is selected */}
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

/** A group of select items. */
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

/** A caption-dim label above a group. */
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

/** A 1px separator between groups. */
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

// ── Showcase shot ─────────────────────────────────────────────────────────
import { LEVELS, type ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

/**
 * A left-aligned fixed-width stage that contains one open Select. In static
 * renders the anchored `<SelectContent>` panel flows beside its trigger (it
 * cannot overlap it), so a bounded 240px wrapper keeps the trigger + panel
 * adjacent and fully inside the 560px shot canvas.
 */
function SelectStage({ width = 240, children }: { width?: number; children: ReactNode }) {
  return <div style={{ width }}>{children}</div>
}

/** A theme-coloured `SelectValue` label (GPUI text does not inherit colour). */
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

/** A theme-coloured `SelectValue` placeholder (dim, like an unselected field). */
function ShotSelectValuePlaceholder() {
  const t = useAdwaita()
  return <SelectValue placeholder={<T size="body" color={t.colors.dim_fg}>Select…</T>} />
}

/** An open select with a two-item content list anchored to one side. */
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
