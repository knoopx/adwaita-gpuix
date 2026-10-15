import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { AdwaitaInputBase } from './common'

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'url'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: InputType
  disabled?: boolean
  invalid?: boolean
  style?: Partial<StyleDesc>
}

/**
 * Adwaita text input: rounded border, 1px border colour, 8px padding,
 * ~34px height. `invalid` switches the border to destructive.
 *
 * - `type` is accepted for shadcn porting parity. The GPUix `input` host has
 *   no native `type` attribute, so `type` documents intent and is not
 *   forwarded — the field always renders plain text (constraint-bounded).
 * - `disabled` dims the input (opacity 0.5) and makes it read-only (the
 *   behavioural half), matching the reference `disabled:opacity-50`.
 */
export function Input({ value, onChange, placeholder, type = 'text', disabled, invalid, style }: InputProps) {
  const t = useAdwaita()
  const { radii } = t
  // `type` is not forwarded: the GPUix `input` host element has no `type`
  // attribute (see the doc comment above). Kept in the destructure for a
  // typed, documented API surface.
  void type
  return (
    <AdwaitaInputBase
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      invalid={invalid}
      style={{ padding: 8, borderRadius: radii.row, ...style }}
    />
  )
}
