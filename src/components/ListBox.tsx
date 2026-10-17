import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { StyleDesc, EventPayload } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

interface ListBoxContextValue {

  selectedValues: string[]

  focused: string | null
  multiple: boolean
  onSelect: (value: string) => void
  onFocusRow: (value: string) => void
  register: (value: string) => void
  unregister: (value: string) => void
}

const ListBoxContext = createContext<ListBoxContextValue | null>(null)

export type ListBoxProps =
  | {
      multiple?: false
      value?: string
      defaultValue?: string
      onValueChange?: (value: string) => void
      children?: ReactNode
      style?: Partial<StyleDesc>
    }
  | {
      multiple: true
      value?: string[]
      defaultValue?: string[]
      onValueChange?: (value: string[]) => void
      children?: ReactNode
      style?: Partial<StyleDesc>
    }

export function ListBox(props: ListBoxProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  const multiple = props.multiple === true


  const [internal, setInternal] = useState<string | string[] | null>(
    multiple ? (props.defaultValue ?? props.value ?? []) : (props.defaultValue ?? props.value ?? null),
  )


  const [focused, setFocused] = useState<string | null>(null)
  const orderedRef = useRef<string[]>([])
  const register = (v: string) => {
    if (!orderedRef.current.includes(v)) orderedRef.current.push(v)
  }
  const unregister = (v: string) => {
    orderedRef.current = orderedRef.current.filter((x) => x !== v)
  }

  const current = multiple ? ((props.value ?? internal) as string[]) : ((props.value ?? internal) as string | null)
  const selectedValues: string[] = multiple ? (current as string[]) : current ? [current as string] : []

  const handleSelect = (v: string) => {
    if (props.multiple === true) {
      const arr = (props.value ?? internal) as string[]
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
      if (props.value === undefined) setInternal(next)
      props.onValueChange?.(next)
    } else {
      if (props.value === undefined) setInternal(v)
      props.onValueChange?.(v)
    }
  }

  const handleKeyDown = (event: EventPayload) => {
    const ordered = orderedRef.current
    if (ordered.length === 0) return
    const key = event.key
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      const curIdx = focused ? ordered.indexOf(focused) : -1
      let nextIdx: number
      if (key === 'ArrowDown') nextIdx = curIdx < 0 ? 0 : Math.min(curIdx + 1, ordered.length - 1)
      else nextIdx = curIdx < 0 ? ordered.length - 1 : Math.max(curIdx - 1, 0)
      setFocused(ordered[nextIdx])
    } else if (key === 'Enter') {
      if (focused) handleSelect(focused)
    }
  }

  const ctxValue: ListBoxContextValue = {
    selectedValues,
    focused,
    multiple,
    onSelect: handleSelect,
    onFocusRow: setFocused,
    register,
    unregister,
  }

  return (
    <ListBoxContext.Provider value={ctxValue}>
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 4,
          borderRadius: radii.card,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.view_bg,
          ...props.style,
        }}
      >
        {props.children}
      </div>
    </ListBoxContext.Provider>
  )
}

export interface ListBoxItemProps {
  value: string
  disabled?: boolean
  children?: ReactNode
  style?: Partial<StyleDesc>
}

export function ListBoxItem({ value, disabled, children, style }: ListBoxItemProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  const ctx = useContext(ListBoxContext)
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  useEffect(() => {
    ctxRef.current?.register(value)
    return () => ctxRef.current?.unregister(value)
  }, [value])

  const selected = ctx ? ctx.selectedValues.includes(value) : false
  const isFocused = ctx?.focused === value

  return (
    <div
      onClick={
        disabled || !ctx
          ? undefined
          : () => {
              ctx.onFocusRow(value)
              ctx.onSelect(value)
            }
      }
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        borderRadius: radii.row,
        cursor: disabled ? 'default' : 'pointer',
        borderWidth: isFocused ? 1 : 0,
        borderColor: colors.accent,
        backgroundColor: selected ? colors.accentTint : 'transparent',
        opacity: disabled ? 0.5 : 1,
        hover: selected || disabled ? undefined : { backgroundColor: colors.accentTint },
        ...style,
      }}
    >
      <T size="body" color={colors.fg}>
        {children}
      </T>
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const ListBoxShot: ComponentShot = {
  name: 'ListBox',
  el: (
    <Shot>
      <Row label="Selection modes">
        <ShotItem label="single (selected b, disabled d)">
          <ListBox value="b" onValueChange={() => {}} style={{ width: 240 }}>
            <ListBoxItem value="a">First item</ListBoxItem>
            <ListBoxItem value="b">Second item (selected)</ListBoxItem>
            <ListBoxItem value="c">Third item</ListBoxItem>
            <ListBoxItem value="d" disabled>Disabled item</ListBoxItem>
          </ListBox>
        </ShotItem>
        <ShotItem label="multiple (a + c selected)">
          <ListBox multiple value={['a', 'c']} onValueChange={() => {}} style={{ width: 240 }}>
            <ListBoxItem value="a">First item (selected)</ListBoxItem>
            <ListBoxItem value="b">Second item</ListBoxItem>
            <ListBoxItem value="c">Third item (selected)</ListBoxItem>
            <ListBoxItem value="d">Fourth item</ListBoxItem>
          </ListBox>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
