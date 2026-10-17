import { useState } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { Icon } from './icons'

export interface NumberFieldProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  style?: Partial<StyleDesc>
}

export function NumberField({
  value,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  style,
}: NumberFieldProps) {
  const t = useAdwaita()
  const { colors, typography, radii } = t
  const [internal, setInternal] = useState<number>(defaultValue)
  const current = value ?? internal


  const [draft, setDraft] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)

  const clamp = (n: number) => {
    let v = n
    if (min !== undefined) v = Math.max(min, v)
    if (max !== undefined) v = Math.min(max, v)
    return v
  }

  const inRange = (n: number) =>
    (min === undefined || n >= min) && (max === undefined || n <= max)

  const setNum = (next: number) => {
    const c = clamp(next)
    if (value === undefined) setInternal(c)
    setDraft(null)
    onChange?.(c)
  }


  const displayValue = focused && draft !== null ? draft : String(current)


  let draftInvalid = false
  if (focused && draft !== null && draft.trim() !== '') {
    const n = parseFloat(draft)
    if (Number.isNaN(n)) draftInvalid = true
    else if (!inRange(n)) draftInvalid = true
  }

  const handleInput = (raw: string) => {
    setDraft(raw)
    const n = parseFloat(raw)
    if (!Number.isNaN(n) && inRange(n)) {
      const c = clamp(n)
      if (value === undefined) setInternal(c)
      onChange?.(c)
    }
  }

  const handleBlur = () => {
    setFocused(false)
    if (draft !== null) {
      const n = parseFloat(draft)
      if (Number.isNaN(n)) {
        setDraft(null)
      } else {
        const c = clamp(n)
        if (value === undefined) setInternal(c)
        onChange?.(c)
        setDraft(null)
      }
    }
  }

  const stepperBtn: Partial<StyleDesc> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 17,
    cursor: disabled ? 'default' : 'pointer',
    hover: disabled ? undefined : { backgroundColor: colors.button_bg },
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: draftInvalid ? colors.destructive : colors.border,
        backgroundColor: colors.view_bg,
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <input
        value={displayValue}
        readOnly={disabled}
        onFocus={() => setFocused(true)}
        onBlur={disabled ? undefined : handleBlur}
        onChange={disabled ? undefined : (e) => handleInput(e.value ?? '')}
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          minHeight: 34,
          paddingLeft: 12,
          paddingRight: 12,
          borderRadius: 0,
          borderWidth: 0,
          backgroundColor: 'transparent',
          fontSize: typography.body,
          fontFamily: typography.fontFamily,
          color: colors.fg,
        }}
      />
      <div style={{ width: 1, backgroundColor: colors.border }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div onClick={disabled ? undefined : () => setNum(current + step)} style={stepperBtn}>
          <Icon name="plus" size={12} color={colors.dim_fg} />
        </div>
        <div style={{ height: 1, backgroundColor: colors.border }} />
        <div onClick={disabled ? undefined : () => setNum(current - step)} style={stepperBtn}>
          <Icon name="minus" size={12} color={colors.dim_fg} />
        </div>
      </div>
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, T, Shot, ShotItem } from './common'

export const NumberFieldShot: ComponentShot = {
  name: 'NumberField',
  el: (
    <Shot>
      <Row label="States">
        <ShotItem label="default (42)">
          <NumberField defaultValue={42} style={{ width: 160 }} />
        </ShotItem>
        <ShotItem label="clamped (min 0, max 200, step 10, value 100)">
          <NumberField value={100} min={0} max={200} step={10} onChange={() => {}} style={{ width: 160 }} />
        </ShotItem>
        <ShotItem label="disabled (5)">
          <NumberField defaultValue={5} disabled style={{ width: 160 }} />
        </ShotItem>
      </Row>
    </Shot>
  ),
}
