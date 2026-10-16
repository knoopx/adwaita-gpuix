import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import {
  Combobox as ComboboxRootPrimitive,
  ComboboxInput as ComboboxInputPrimitive,
  ComboboxTrigger as ComboboxTriggerPrimitive,
  ComboboxValue as ComboboxValuePrimitive,
  ComboboxContent as ComboboxContentPrimitive,
  ComboboxList as ComboboxListPrimitive,
  ComboboxItem as ComboboxItemPrimitive,
  ComboboxEmpty as ComboboxEmptyPrimitive,
  ComboboxGroup as ComboboxGroupPrimitive,
  ComboboxLabel as ComboboxLabelPrimitive,
  ComboboxSeparator as ComboboxSeparatorPrimitive,
  type ComboboxValue as ComboboxValueType,
} from '@gpuix/react/combobox'
import { useAdwaita } from '../theme/adwaita'
import { T, listPanelStyle, textFieldStyle } from './common'
import { Icon } from './icons'

export interface ComboboxProps {
  /**
   * String backward-compat guard: string entries pass through, object
   * entries use `.value` (the primitive expects `readonly string[]`).
   */
  items?: readonly ComboboxItemEntry[]
  value?: ComboboxValueType
  defaultValue?: ComboboxValueType
  onValueChange?: (value: ComboboxValueType) => void
  inputValue?: string
  defaultInputValue?: string
  onInputValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  multiple?: boolean
  disabled?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * Adwaita-styled compound Combobox using the `@gpuix/react/combobox` headless
 * primitive. A searchable dropdown: a pill input + chevron trigger, with an
 * anchored list of items below.
 */
export function Combobox({ items, style, ...props }: ComboboxProps) {
  // String backward-compat guard: string entries pass through, object
  // entries use .value (the primitive expects readonly string[]).
  const stringItems = items?.map((item) => (typeof item === 'string' ? item : item.value))
  return <ComboboxRootPrimitive {...props} items={stringItems} style={style} />
}

export interface ComboboxItemObject {
  value: string
  label?: ReactNode
}

export type ComboboxItemEntry = string | ComboboxItemObject

export interface ComboboxInputProps {
  placeholder?: string
  disabled?: boolean
  /** Show a 28x28 close-icon suffix when true and `value` is non-empty. */
  showClear?: boolean
  /** The consumer-supplied value (drives clear-button visibility). */
  value?: string
  /** Called when the clear icon is clicked. */
  onClear?: () => void
  style?: Partial<StyleDesc>
}

/**
 * A pill text field (view_bg, 1px border) that drives the combobox query,
 * with an optional 28x28 close-icon suffix shown when showClear and the
 * (consumer-supplied) value is non-empty.
 */
export function ComboboxInput({ placeholder, disabled, showClear, value, onClear, style }: ComboboxInputProps) {
  const t = useAdwaita()
  const { radii, colors } = t
  const showClearButton = showClear === true && (value ?? '').length > 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...style }}>
      <ComboboxInputPrimitive
        placeholder={placeholder}
        disabled={disabled}
        style={textFieldStyle(t, {
          flexGrow: 1,
          alignItems: 'center',
          minHeight: 34,
          paddingLeft: 12,
          paddingRight: showClearButton ? 4 : 12,
          borderRadius: radii.pill,
          opacity: disabled ? 0.5 : 1,
        })}
      />
      {showClearButton ? (
        <div
          onClick={onClear}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 6,
            cursor: 'pointer',
            hover: { backgroundColor: colors.button_bg },
          }}
        >
          <Icon name="close" size={14} color={colors.dim_fg} />
        </div>
      ) : null}
    </div>
  )
}

export interface ComboboxTriggerProps {
  disabled?: boolean
  style?: Partial<StyleDesc>
}

/** A pill toggle with a chevron that opens the list. */
export function ComboboxTrigger({ disabled, style }: ComboboxTriggerProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  return (
    <ComboboxTriggerPrimitive
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        minHeight: 34,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        cursor: 'pointer',
        hover: disabled ? undefined : { backgroundColor: colors.button_bg },
        ...style,
      }}
    >
      <Icon name="chevronDown" size={14} color={colors.dim_fg} />
    </ComboboxTriggerPrimitive>
  )
}

export interface ComboboxValueProps {
  placeholder?: ReactNode
  children?: ReactNode
}

/** Shows the selected value (or a placeholder) inside a trigger. */
export function ComboboxValue({ placeholder, children }: ComboboxValueProps) {
  const t = useAdwaita()
  const { colors, typography } = t
  return (
    <ComboboxValuePrimitive
      placeholder={placeholder}
      style={{
        fontSize: typography.body,
        fontFamily: typography.fontFamily,
        color: colors.fg,
      }}
    >
      {children}
    </ComboboxValuePrimitive>
  )
}

export interface ComboboxContentProps {
  children?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  style?: Partial<StyleDesc>
}

/** Anchored dropdown list: 1px border, card radius, shadow, scrollable. */
export function ComboboxContent({ children, side, style }: ComboboxContentProps) {
  const t = useAdwaita()
  return (
    <ComboboxContentPrimitive side={side} style={listPanelStyle(t, { padding: 4, ...style })}>
      {children}
    </ComboboxContentPrimitive>
  )
}

export interface ComboboxListProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** The list of filtered items inside the content. */
export function ComboboxList({ children, style }: ComboboxListProps) {
  return (
    <ComboboxListPrimitive
      style={{ display: 'flex', flexDirection: 'column', gap: 2, ...style }}
    >
      {children}
    </ComboboxListPrimitive>
  )
}

export interface ComboboxItemProps {
  value: string
  disabled?: boolean
  /** Show a 12px success check after the label (same pattern CommandItem uses). */
  selected?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** An option row: hover/highlighted = accentTint, selected = accentTint. */
export function ComboboxItem({ value, disabled, selected, children, style }: ComboboxItemProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <ComboboxItemPrimitive
      value={value}
      disabled={disabled}
      style={({ selected, highlighted, disabled: d }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        borderRadius: t.radii.row,
        cursor: 'pointer',
        backgroundColor: selected || highlighted ? colors.accentTint : 'transparent',
        opacity: d ? 0.5 : 1,
        ...style,
      })}
    >
      <T size="body" color={colors.fg}>
        {children}
      </T>
      {selected ? <Icon name="success" size={12} color={colors.accent} /> : null}
    </ComboboxItemPrimitive>
  )
}

export interface ComboboxEmptyProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** A dim "no results" row shown when the list is empty. */
export function ComboboxEmpty({ children = 'No results', style }: ComboboxEmptyProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <ComboboxEmptyPrimitive style={{ padding: 8, ...style }}>
      <T size="body" color={colors.dim_fg}>
        {children}
      </T>
    </ComboboxEmptyPrimitive>
  )
}

export interface ComboboxLabelProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A caption-dim label above a group. */
export function ComboboxLabel({ children, style }: ComboboxLabelProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <ComboboxLabelPrimitive style={{ padding: 8, paddingBottom: 4, ...style }}>
      <T size="caption" color={colors.dim_fg}>
        {children}
      </T>
    </ComboboxLabelPrimitive>
  )
}

export interface ComboboxGroupProps {
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** A group of combobox items. */
export function ComboboxGroup({ children, style }: ComboboxGroupProps) {
  return (
    <ComboboxGroupPrimitive style={style}>
      {children}
    </ComboboxGroupPrimitive>
  )
}

export interface ComboboxSeparatorProps {
  style?: Partial<StyleDesc>
}

/** A 1px separator between groups. */
export function ComboboxSeparator({ style }: ComboboxSeparatorProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <ComboboxSeparatorPrimitive
      style={{
        height: 1,
        backgroundColor: colors.border,
        ...style,
      }}
    />
  )
}

export interface ComboboxChipsProps {
  values: string[]
  onRemove: (value: string) => void
  inputValue?: string
  onInputChange?: (value: string) => void
  placeholder?: string
  style?: Partial<StyleDesc>
}

/**
 * GPUix-idiomatic multi-select chip row: flex-wrap pill chips (button_bg)
 * with a 16px close icon per chip + a trailing borderless query input.
 */
export function ComboboxChips({ values, onRemove, inputValue, onInputChange, placeholder, style }: ComboboxChipsProps) {
  const t = useAdwaita()
  const { colors, radii, typography } = t
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, ...style }}>
      {values.map((v) => (
        <div
          key={v}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 4,
            paddingLeft: 8,
            paddingRight: 4,
            borderRadius: radii.pill,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.button_bg,
          }}
        >
          <T size="caption" color={colors.fg}>
            {v}
          </T>
          <div
            onClick={() => onRemove(v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 16,
              height: 16,
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            <Icon name="close" size={10} color={colors.dim_fg} />
          </div>
        </div>
      ))}
      <input
        value={inputValue ?? ''}
        placeholder={placeholder}
        onChange={(e) => onInputChange?.(e.value ?? '')}
        style={{
          flexGrow: 1,
          minWidth: 60,
          borderWidth: 0,
          backgroundColor: 'transparent',
          fontSize: typography.body,
          fontFamily: typography.fontFamily,
          color: colors.fg,
        }}
      />
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, FloatingStage, Shot, ShotItem } from './common'

const COMBO_ITEMS = ['low', 'medium', 'high']

/** A closed combobox trigger in one of the shot's states (default / empty / disabled / clear). */
function TriggerStateShot({ value, disabled, showClear }: { value?: string; disabled?: boolean; showClear?: boolean }) {
  return (
    <Combobox
      value={value}
      disabled={disabled}
      items={COMBO_ITEMS}
      onValueChange={() => {}}
      inputValue=""
      onInputValueChange={() => {}}
      style={{ width: 120, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <ComboboxInput
          placeholder={showClear ? undefined : 'Search…'}
          showClear={showClear}
          value={showClear ? value : undefined}
          onClear={showClear ? () => {} : undefined}
          disabled={disabled}
        />
        <ComboboxTrigger disabled={disabled} />
      </div>
    </Combobox>
  )
}

/** An open combobox in a centered floating stage (item-states / empty shots). */
function OpenComboboxStage({ height, value, inputValue, children }: { height: number; value: string; inputValue: string; children: ReactNode }) {
  return (
    <FloatingStage width={480} height={height}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100%' }}>
        <Combobox
          open
          value={value}
          items={COMBO_ITEMS}
          onValueChange={() => {}}
          inputValue={inputValue}
          onInputValueChange={() => {}}
          style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <ComboboxInput placeholder="Search…" />
            <ComboboxTrigger />
          </div>
          {children}
        </Combobox>
      </div>
    </FloatingStage>
  )
}

export const ComboboxShot: ComponentShot = {
  name: 'Combobox',
  el: (
    <Shot>
      <Row label="Trigger states">
        <ShotItem label="default value"><TriggerStateShot value="medium" /></ShotItem>
        <ShotItem label="empty (no value)"><TriggerStateShot /></ShotItem>
        <ShotItem label="disabled"><TriggerStateShot value="medium" disabled /></ShotItem>
        <ShotItem label="clear (showClear + value)"><TriggerStateShot value="medium" showClear /></ShotItem>
      </Row>
      <Row label="Open · item states" col>
        <OpenComboboxStage height={200} value="medium" inputValue="">
          <ComboboxContent>
            <ComboboxGroup>
              <ComboboxLabel>Levels</ComboboxLabel>
              <ComboboxList>
                <ComboboxItem value="low">Low</ComboboxItem>
                <ComboboxItem value="medium" selected>Medium</ComboboxItem>
                <ComboboxItem value="high">High</ComboboxItem>
              </ComboboxList>
            </ComboboxGroup>
            <ComboboxSeparator />
            <ComboboxGroup>
              <ComboboxLabel>Extra</ComboboxLabel>
              <ComboboxList>
                <ComboboxItem value="off" disabled>Off (disabled)</ComboboxItem>
              </ComboboxList>
            </ComboboxGroup>
          </ComboboxContent>
        </OpenComboboxStage>
      </Row>
      <Row label="Open · empty (no match)" col>
        <OpenComboboxStage height={140} value="" inputValue="zzz">
          <ComboboxContent>
            <ComboboxList>
              <ComboboxEmpty>No results for “zzz”</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </OpenComboboxStage>
      </Row>
      <Row label="Multi-select chips" col>
        <Combobox multiple onValueChange={() => {}} style={{ width: 480, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ComboboxChips
            values={['Low', 'Medium']}
            onRemove={() => {}}
            inputValue=""
            onInputChange={() => {}}
            placeholder="Add…"
          />
        </Combobox>
      </Row>
    </Shot>
  ),
}
