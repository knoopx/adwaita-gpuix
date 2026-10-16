import type { StyleDesc } from '@gpuix/react'
import type { EventPayload } from '@gpuix/native'
import { useAdwaita } from '../theme/adwaita'
import { textFieldStyle } from './common'

export interface TextareaProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  /** Take keyboard focus on mount — without it (or a click) the field never receives key events. */
  autoFocus?: boolean
  /** Enter on `<textarea>` submits only while this listener is set (bare Enter inserts a newline). */
  onSubmit?: () => void
  onKeyDown?: (event: EventPayload) => void
  style?: Partial<StyleDesc>
}

/**
 * A multi-line text area: rounded border like Input, 8px padding,
 * minRows controls the minimum line count.
 */
export function Textarea({ value, onChange, placeholder, rows = 3, disabled, autoFocus, onSubmit, onKeyDown, style }: TextareaProps) {
  const t = useAdwaita()
  const { colors, radii } = t

  return (
    <textarea
      value={value}
      placeholder={placeholder}
      minRows={rows}
      readOnly={disabled}
      autoFocus={autoFocus && !disabled ? true : undefined}
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      onChange={(event) => onChange?.(event.value ?? '')}
      theme={{ caret: colors.accent }}
      style={textFieldStyle(t, { padding: 8, borderRadius: radii.row, opacity: disabled ? 0.5 : 1, ...style })}
    />
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import type { ReactNode } from 'react'
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

export const TextareaShot: ComponentShot = {
  name: 'Textarea',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="States" col>
        <ShotItem label="placeholder">
          <Textarea placeholder="Type a message…" />
        </ShotItem>
        <ShotItem label="with value (rows=3)">
          <Textarea value="A multi-line text area with some content." rows={3} />
        </ShotItem>
        <ShotItem label="taller (rows=5)">
          <Textarea value="A taller text area driven by the rows prop." rows={5} />
        </ShotItem>
        <ShotItem label="disabled">
          <Textarea value="Read-only content." disabled />
        </ShotItem>
      </Row>
    </div>
  ),
}
