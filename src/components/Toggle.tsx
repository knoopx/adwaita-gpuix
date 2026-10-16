import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba } from '../theme/adwaita'
import { T } from './common'

export type ToggleVariant = 'default' | 'outline'
export type ToggleSize = 'sm' | 'default' | 'lg'

export interface ToggleProps {
  pressed: boolean
  onPressed: () => void
  variant?: ToggleVariant
  /** `sm` = 28, `default` = 32, `lg` = 40 (minHeight). */
  size?: ToggleSize
  children: ReactNode
  style?: Partial<StyleDesc>
}

const TOGGLE_MIN_HEIGHT: Record<ToggleSize, number> = { sm: 28, default: 32, lg: 40 }

/**
 * A single toggle button (like a small Button). When pressed = accentTint bg + accent text.
 * Complements the existing ToggleGroup.
 */
export function Toggle({ pressed, onPressed, variant = 'default', size = 'default', children, style }: ToggleProps) {
  const t = useAdwaita()
  const { colors, radii } = t

  const isOutline = variant === 'outline'
  // A default-variant toggle is a raised button: visible in both states
  // (unpressed = button_bg, pressed = accentTint) with a 1px border. The
  // outline variant stays flat (transparent) until pressed.
  const bg = pressed ? colors.accentTint : isOutline ? 'transparent' : colors.button_bg
  const fg = pressed ? colors.accent : colors.fg
  const border = colors.border

  return (
    <div
      onClick={onPressed}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onPressed()
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        minHeight: TOGGLE_MIN_HEIGHT[size],
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: border,
        backgroundColor: bg,
        cursor: 'pointer',
        hover: { backgroundColor: pressed ? colors.accentTint : hexToRgba(colors.fg, 0.06) },
        ...style,
      }}
    >
      <T size="body" weight={600} color={fg}>
        {children}
      </T>
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row } from './common'

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

export const ToggleShot: ComponentShot = {
  name: 'Toggle',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="States (default variant)">
        <ShotItem label="unpressed">
          <Toggle pressed={false} onPressed={() => {}}>Bold</Toggle>
        </ShotItem>
        <ShotItem label="pressed">
          <Toggle pressed onPressed={() => {}}>Bold</Toggle>
        </ShotItem>
      </Row>
      <Row label="Variants" col>
        <ShotItem label="default (unpressed)">
          <Toggle pressed={false} variant="default" onPressed={() => {}}>Default</Toggle>
        </ShotItem>
        <ShotItem label="default (pressed)">
          <Toggle pressed variant="default" onPressed={() => {}}>Default</Toggle>
        </ShotItem>
        <ShotItem label="outline (unpressed — flat, transparent)">
          <Toggle pressed={false} variant="outline" onPressed={() => {}}>Outline</Toggle>
        </ShotItem>
        <ShotItem label="outline (pressed — accentTint)">
          <Toggle pressed variant="outline" onPressed={() => {}}>Outline</Toggle>
        </ShotItem>
      </Row>
      <Row label="Sizes">
        <ShotItem label="sm (28px)">
          <Toggle pressed={false} size="sm" onPressed={() => {}}>Sm</Toggle>
        </ShotItem>
        <ShotItem label="default (32px)">
          <Toggle pressed={false} size="default" onPressed={() => {}}>Default</Toggle>
        </ShotItem>
        <ShotItem label="lg (40px)">
          <Toggle pressed={false} size="lg" onPressed={() => {}}>Large</Toggle>
        </ShotItem>
      </Row>
    </div>
  ),
}
