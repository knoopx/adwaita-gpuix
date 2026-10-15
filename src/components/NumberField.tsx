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

/**
 * Adwaita number field: a pill-bordered input with +/− stepper buttons stacked
 * on the right. There is no native number input in GPUix, so this composes a
 * plain `<input>` with two clickable stepper buttons.
 *
 * While typing, the raw text is tracked as a **draft**: an out-of-range (or
 * non-numeric) draft turns the pill border destructive; on blur the draft is
 * clamped to `[min, max]` and committed. In-range edits commit live.
 */
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

  // Draft tracking: the raw text being typed (null = show the committed value).
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

  // The text shown in the input: the live draft while focused, else the value.
  const displayValue = focused && draft !== null ? draft : String(current)

  // A non-empty draft that is non-numeric or out of range → destructive border.
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
        setDraft(null) // revert to the last committed value
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
