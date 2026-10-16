import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba, isDarkScheme } from '../theme/adwaita'
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
  const activeBg = isDarkScheme(t.scheme) ? '#565656' : colors.view_bg
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

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

const SHOT_OPTS = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
]

const SHOT_ICON_OPTS: { id: string; icon: IconName }[] = [
  { id: 'list', icon: 'list' },
  { id: 'grid', icon: 'grid' },
  { id: 'panel', icon: 'panel' },
]

export const ToggleGroupShot: ComponentShot = {
  name: 'ToggleGroup',
  el: (
    <Shot>
      <Row label="Variants" col>
        <ShotItem label="default"><ToggleGroup options={SHOT_OPTS} value="week" onChange={() => {}} /></ShotItem>
        <ShotItem label="outline"><ToggleGroup options={SHOT_OPTS} variant="outline" value="day" onChange={() => {}} /></ShotItem>
      </Row>
      <Row label="Sizes" col>
        <ShotItem label="sm (24)"><ToggleGroup options={SHOT_OPTS} size="sm" value="day" onChange={() => {}} /></ShotItem>
        <ShotItem label="default (28)"><ToggleGroup options={SHOT_OPTS} value="week" onChange={() => {}} /></ShotItem>
        <ShotItem label="lg (36)"><ToggleGroup options={SHOT_OPTS} size="lg" value="month" onChange={() => {}} /></ShotItem>
      </Row>
      <Row label="Options & selection" col>
        <ShotItem label="icon options"><ToggleGroup options={SHOT_ICON_OPTS} value="grid" onChange={() => {}} /></ShotItem>
        <ShotItem label="multiple (multi-select)"><ToggleGroup multiple options={SHOT_OPTS} value={['day', 'month']} onChange={() => {}} /></ShotItem>
        <ShotItem label="none selected"><ToggleGroup options={SHOT_OPTS} value="" onChange={() => {}} /></ShotItem>
      </Row>
    </Shot>
  ),
}
