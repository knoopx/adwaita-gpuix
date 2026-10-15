import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba } from '../theme/adwaita'
import { T } from './common'
import { Icon, type IconName } from './icons'

export interface ToggleOption {
  id: string
  label?: string
  icon?: IconName
}

interface ToggleGroupBaseProps {
  options: ToggleOption[]
  /** Container gap between segments (default 2). */
  spacing?: number
  /** `outline` gives inactive segments a 1px border. */
  variant?: 'default' | 'outline'
  /** Segment minHeight: `sm` = 24, `default` = 28, `lg` = 36. */
  size?: 'sm' | 'default' | 'lg'
  style?: Partial<StyleDesc>
}

/**
 * A segmented control. Single-select (`value: string`) by default; set
 * `multiple` for a toggle-set (`value: string[]`, click toggles in/out).
 * The discriminated `multiple` prop keeps the single-mode signature
 * (`onChange: (id: string) => void`) exactly as before.
 */
export type ToggleGroupProps =
  | (ToggleGroupBaseProps & { multiple?: false; value: string; onChange: (id: string) => void })
  | (ToggleGroupBaseProps & { multiple: true; value: string[]; onChange: (ids: string[]) => void })

const SEG_MIN_HEIGHT: Record<NonNullable<ToggleGroupBaseProps['size']>, number> = { sm: 24, default: 28, lg: 36 }

export function ToggleGroup(props: ToggleGroupProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  const { options, spacing = 2, variant = 'default', size = 'default', style } = props
  const activeBg = t.scheme === 'dark' ? '#565656' : colors.view_bg
  const outline = variant === 'outline'
  const minHeight = SEG_MIN_HEIGHT[size]

  // Normalise to a string[] for rendering.
  const active: string[] = props.multiple === true ? props.value : props.value ? [props.value] : []

  const toggle = (id: string) => {
    if (props.multiple === true) {
      const next = active.includes(id) ? active.filter((x) => x !== id) : [...active, id]
      props.onChange(next)
    } else {
      props.onChange(id)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: spacing,
        padding: 2,
        borderRadius: radii.pill,
        backgroundColor: colors.button_bg,
        ...style,
      }}
    >
      {options.map((opt) => {
        const isActive = active.includes(opt.id)
        return (
          <div
            key={opt.id}
            onClick={() => toggle(opt.id)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              minHeight,
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: radii.pill,
              borderWidth: outline && !isActive ? 1 : 0,
              borderColor: colors.border,
              backgroundColor: isActive ? activeBg : 'transparent',
              boxShadow: isActive
                ? { offsetX: 0, offsetY: 1, blurRadius: 3, spreadRadius: 0, color: 'rgba(0,0,0,0.2)' }
                : undefined,
              cursor: 'pointer',
              hover: isActive ? undefined : { backgroundColor: hexToRgba(colors.fg, 0.06) },
            }}
          >
            {opt.icon ? (
              <Icon name={opt.icon} size={16} color={isActive ? colors.fg : colors.dim_fg} />
            ) : null}
            {opt.label ? (
              <T size="body" weight={isActive ? 600 : 400} color={isActive ? colors.fg : colors.dim_fg}>
                {opt.label}
              </T>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
