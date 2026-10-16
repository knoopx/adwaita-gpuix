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

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import type { ReactNode } from 'react'
import { useAdwaita } from '../theme/adwaita'
import { Row, T } from './common'

/** A captioned shot item: a small dim caption above the item. */
function ShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

export const EntryShot: ComponentShot = {
  name: 'Entry',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="States" col>
        <ShotItem label="placeholder"><Entry placeholder="Type here…" /></ShotItem>
        <ShotItem label="with value"><Entry value="Hello world" /></ShotItem>
        <ShotItem label="invalid"><Entry value="invalid value" invalid /></ShotItem>
        <ShotItem label="disabled"><Entry value="Read only" disabled /></ShotItem>
      </Row>
      <Row label="Types (GPUix has no input type — all render plain text)" col>
        <ShotItem label="text"><Entry type="text" placeholder="Plain text" /></ShotItem>
        <ShotItem label="password"><Entry type="password" placeholder="••••••••" /></ShotItem>
        <ShotItem label="email"><Entry type="email" placeholder="you@example.com" /></ShotItem>
        <ShotItem label="number"><Entry type="number" placeholder="42" /></ShotItem>
        <ShotItem label="search"><Entry type="search" placeholder="Search…" /></ShotItem>
        <ShotItem label="url"><Entry type="url" placeholder="https://…" /></ShotItem>
      </Row>
    </div>
  ),
}
