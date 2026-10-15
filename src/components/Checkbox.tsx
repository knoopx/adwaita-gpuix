import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba, type AdwaitaTheme } from '../theme/adwaita'
import { T } from './common'
import { Icon } from './icons'

export type CheckboxState = boolean | 'indeterminate'

export interface CheckboxProps {
  /** `true` = checked, `false` = unchecked, `'indeterminate'` = dash. */
  checked?: CheckboxState
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  /**
   * Optional label rendered as a sibling `T` (8px gap). GPUix has no
   * `htmlFor`, so label association is structural (the label is a sibling
   * of the box inside this component).
   */
  label?: string
  style?: Partial<StyleDesc>
}

/** 18px square checkbox style: accent when checked, dimmed when disabled. */
function checkboxStyle(t: AdwaitaTheme, filled: boolean, disabled?: boolean, style?: Partial<StyleDesc>): Partial<StyleDesc> {
  const { colors } = t
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: filled ? colors.accent : colors.border,
    backgroundColor: filled ? colors.accent : colors.view_bg,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    hover: disabled ? undefined : { backgroundColor: filled ? colors.accent : hexToRgba(colors.fg, 0.04) },
    flexShrink: 0,
    ...style,
  }
}

/**
 * An 18px square checkbox.
 * - `checked=true` = accent bg + white check icon.
 * - `checked='indeterminate'` = accent bg + 10px horizontal bar.
 * Clickable and keyboard-toggleable (Enter/Space). Toggling an indeterminate
 * checkbox checks it (`onCheckedChange(true)`).
 */
export function Checkbox({ checked = false, onCheckedChange, disabled, label, style }: CheckboxProps) {
  const t = useAdwaita()
  const { colors } = t
  const isIndeterminate = checked === 'indeterminate'
  const isChecked = checked === true
  const filled = isChecked || isIndeterminate
  const toggle = () => onCheckedChange(isIndeterminate ? true : !isChecked)

  const box = (
    <div
      onClick={disabled ? undefined : toggle}
      onKeyDown={
        disabled
          ? undefined
          : (event) => {
              if (event.key === 'Enter' || event.key === ' ') toggle()
            }
      }
      tabIndex={disabled ? -1 : 0}
      style={checkboxStyle(t, filled, disabled, style)}
    >
      {isChecked ? (
        <Icon name="check" size={12} color={colors.accent_fg} />
      ) : isIndeterminate ? (
        <div
          style={{
            width: 10,
            height: 2,
            borderRadius: 2,
            backgroundColor: colors.accent_fg,
          }}
        />
      ) : null}
    </div>
  )

  if (label === undefined) return box

  // Label association: a sibling `T` in a flex row (GPUix has no htmlFor).
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, opacity: disabled ? 0.5 : 1 }}>
      {box}
      <T size="body" color={colors.fg}>
        {label}
      </T>
    </div>
  )
}
