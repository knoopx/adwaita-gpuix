import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface InputOTPProps {
  length: number
  value: string
  onChange: (value: string) => void
  /** Fired once when `value.length === length`. */
  onComplete?: () => void
  autoFocus?: boolean
  disabled?: boolean
  style?: Partial<StyleDesc>
}

/**
 * An OTP (one-time passcode) input: a row of single-character boxes fed by a
 * single GPUix `<input>`.
 *
 * GPUix has one caret, so focus stays on the hidden `<input>` (autoFocus,
 * value, onChange) which drives the visual mask boxes; the box at index
 * `value.length` carries the accent border as the fake-caret affordance.
 * `onComplete` fires when `value.length === length`.
 */
export function InputOTP({ length, value, onChange, onComplete, autoFocus, disabled, style }: InputOTPProps) {
  const t = useAdwaita()
  const { colors } = t

  const chars = Array.from({ length: length }, (_, i) => value[i] ?? '')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {/* The real input: hidden, owns focus + caret, feeds the mask boxes. */}
      <input
        value={value}
        autoFocus={autoFocus && !disabled ? true : undefined}
        readOnly={disabled}
        onChange={(event) => {
          const next = event.value ?? ''
          onChange(next)
          if (next.length === length) onComplete?.()
        }}
        style={{
          width: 1,
          opacity: 0,
          borderWidth: 0,
          flexGrow: 0,
          flexShrink: 0,
        }}
      />
      {chars.map((char, i) => (
        <InputOTPSlot
          key={i}
          index={i}
          char={char}
          filled={char.length > 0}
          active={i === value.length && !disabled}
          disabled={disabled}
        />
      ))}
    </div>
  )
}

export interface InputOTPGroupProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/** A flex row (gap 8) grouping OTP slots. */
export function InputOTPGroup({ children, style }: InputOTPGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8, ...style }}>{children}</div>
  )
}

export interface InputOTPSlotProps {
  /** Slot position (shadcn parity; used as a stable key by the parent). */
  index: number
  /** The character shown in the box. */
  char?: string
  /** Filled (accent wash + accent border). */
  filled?: boolean
  /** Active = the fake-caret slot (accent border, no wash). */
  active?: boolean
  disabled?: boolean
  style?: Partial<StyleDesc>
}

/** A 40×44 single-character OTP box (the visual mask cell). */
export function InputOTPSlot({ index, char = '', filled, active, disabled, style }: InputOTPSlotProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  void index
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 44,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: active || filled ? colors.accent : colors.border,
        backgroundColor: filled ? colors.accentTint : colors.view_bg,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <T size="title2" color={filled ? colors.fg : colors.dim_fg}>
        {char}
      </T>
    </div>
  )
}

export interface InputOTPSeparatorProps {
  style?: Partial<StyleDesc>
}

/** A dim "-" separator between OTP groups. */
export function InputOTPSeparator({ style }: InputOTPSeparatorProps) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      <T size="body" color={t.colors.dim_fg}>
        -
      </T>
    </div>
  )
}
