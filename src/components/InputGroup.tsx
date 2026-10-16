import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'
import { Input } from './Input'
import { Textarea } from './Textarea'

export interface InputGroupProps {
  children: ReactNode
  /**
   * Layout axis. `'row'` (default) lays the children in a horizontal row.
   * `'block-start'` / `'block-end'` switch to a column; GPUix has no CSS
   * `order`, so which side the addon sits on is expressed by the caller's
   * child ordering (block-start = addon first, block-end = addon last).
   */
  align?: 'row' | 'block-start' | 'block-end'
  style?: Partial<StyleDesc>
}

/**
 * Pill container wrapping an Input + addon(s). 1px border, view_bg background.
 */
export function InputGroup({ children, align = 'row', style }: InputGroupProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  const column = align !== 'row'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: column ? 'column' : 'row',
        alignItems: column ? 'stretch' : 'center',
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface InputGroupInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'url'
  style?: Partial<StyleDesc>
}

/** An input inside an InputGroup (no own border/radius, grows to fill). */
export function InputGroupInput({ value, onChange, placeholder, type, style }: InputGroupInputProps) {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      style={{
        borderWidth: 0,
        borderRadius: 0,
        flexGrow: 1,
        ...style,
      }}
    />
  )
}

export interface InputGroupAddonProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A dim text slot (padding 8) inside an InputGroup. */
function InputGroupTextSlot({ children, style }: InputGroupTextProps) {
  const t = useAdwaita()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        ...style,
      }}
    >
      <T size="body" color={t.colors.dim_fg}>
        {children}
      </T>
    </div>
  )
}

/** A dim addon (prefix/suffix) inside an InputGroup. */
export function InputGroupAddon({ children, style }: InputGroupAddonProps) {
  return <InputGroupTextSlot children={children} style={style} />
}

export interface InputGroupButtonProps {
  onClick?: () => void
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A 28×28 flat icon button addon inside an InputGroup (GPUix has no `<button>`,
 * so this is a `div onClick` with a hover wash).
 */
export function InputGroupButton({ onClick, children, style }: InputGroupButtonProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        flexShrink: 0,
        borderRadius: 6,
        cursor: 'pointer',
        hover: { backgroundColor: colors.button_bg },
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface InputGroupTextProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A dim text slot (padding 8) inside an InputGroup. */
export function InputGroupText({ children, style }: InputGroupTextProps) {
  return <InputGroupTextSlot children={children} style={style} />
}

export interface InputGroupTextareaProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  style?: Partial<StyleDesc>
}

/** A borderless Textarea inside an InputGroup (grows to fill, no radius). */
export function InputGroupTextarea({ value, onChange, placeholder, rows, style }: InputGroupTextareaProps) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        borderWidth: 0,
        borderRadius: 0,
        flexGrow: 1,
        ...style,
      }}
    />
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'
import { Icon } from './icons'

/** A dim 14px icon for the button-addon examples (theme colour needs a hook). */
function AddonIcon({ name }: { name: 'search' | 'plus' }) {
  const t = useAdwaita()
  return <Icon name={name} size={14} color={t.colors.dim_fg} />
}

export const InputGroupShot: ComponentShot = {
  name: 'InputGroup',
  el: (
    <Shot>
      <Row label="Alignments" col>
        <ShotItem label="row (default) — prefix + suffix addons">
          <InputGroup>
            <InputGroupAddon>@</InputGroupAddon>
            <InputGroupInput value="username" />
            <InputGroupAddon>.com</InputGroupAddon>
          </InputGroup>
        </ShotItem>
        <ShotItem label="block-start (addon first)">
          <InputGroup align="block-start">
            <InputGroupAddon>€</InputGroupAddon>
            <InputGroupInput value="1 250.00" />
          </InputGroup>
        </ShotItem>
        <ShotItem label="block-end (addon last)">
          <InputGroup align="block-end">
            <InputGroupInput value="kg" placeholder="Weight" />
            <InputGroupAddon>unit</InputGroupAddon>
          </InputGroup>
        </ShotItem>
      </Row>
      <Row label="Addon kinds" col>
        <ShotItem label="button addon (icon)">
          <InputGroup>
            <InputGroupInput placeholder="Search…" type="search" />
            <InputGroupButton>
              <AddonIcon name="search" />
            </InputGroupButton>
          </InputGroup>
        </ShotItem>
        <ShotItem label="text addon">
          <InputGroup>
            <InputGroupInput placeholder="Amount" />
            <InputGroupText>EUR</InputGroupText>
          </InputGroup>
        </ShotItem>
        <ShotItem label="textarea (rows=2)">
          <InputGroup>
            <InputGroupTextarea placeholder="Message…" rows={2} />
            <InputGroupButton>
              <AddonIcon name="plus" />
            </InputGroupButton>
          </InputGroup>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
