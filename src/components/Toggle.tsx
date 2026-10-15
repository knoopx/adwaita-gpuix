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
