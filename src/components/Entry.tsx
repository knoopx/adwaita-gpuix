import type { StyleDesc } from '@gpuix/react'
import { AdwaitaInputBase } from './common'

export type EntryType = 'text' | 'password' | 'email' | 'number' | 'search' | 'url'

export interface EntryProps {
  value?: string
  placeholder?: string
  type?: EntryType
  disabled?: boolean
  invalid?: boolean
  onChange?: (value: string) => void
  onSubmit?: () => void
  autoFocus?: boolean
  style?: Partial<StyleDesc>
}

/**
 * Adwaita text entry: rounded border, placeholder, accent caret.
 * Mirrors the sibling `Input` prop shape (`type` / `disabled` / `invalid`)
 * so the two entry components stay interchangeable.
 *
 * - `type` is accepted for shadcn porting parity. **GPUix has no native
 *   input `type` attribute** (its `input` host only carries
 *   `value` / `placeholder` / `readOnly` / `theme`), so `type` documents
 *   intent and is not forwarded to the element — the field always renders
 *   plain text. Constraint-bounded, like the Spinner's static arc.
 * - `disabled` dims the entry (opacity 0.5) and skips `onChange`/`onSubmit`.
 * - `invalid` switches the border to the destructive colour.
 */
export function Entry({ value, placeholder, type = 'text', disabled, invalid, onChange, onSubmit, autoFocus, style }: EntryProps) {
  // `type` is intentionally not forwarded: the GPUix `input` host element has
  // no `type` attribute (see the doc comment above). The parameter is kept in
  // the destructure so callers get a typed, documented surface.
  void type
  return (
    <AdwaitaInputBase
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      invalid={invalid}
      autoFocus={autoFocus}
      onSubmit={onSubmit}
      style={{ paddingLeft: 12, paddingRight: 12, ...style }}
    />
  )
}
