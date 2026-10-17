import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, hexToRgba, type AdwaitaTheme } from '../theme/adwaita'
import { LabeledControl } from './common'
import { Icon } from './icons'

export type CheckboxState = boolean | 'indeterminate'

export interface CheckboxProps {

  checked?: CheckboxState
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean

  label?: string
  style?: Partial<StyleDesc>
}

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


  return <LabeledControl control={box} label={label} disabled={disabled} />
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const CheckboxShot: ComponentShot = {
  name: 'Checkbox',
  el: (
    <Shot>
      <Row label="Checked states">
        <ShotItem label="unchecked"><Checkbox checked={false} onCheckedChange={() => {}} /></ShotItem>
        <ShotItem label="checked"><Checkbox checked onCheckedChange={() => {}} /></ShotItem>
        <ShotItem label="indeterminate"><Checkbox checked="indeterminate" onCheckedChange={() => {}} /></ShotItem>
      </Row>
      <Row label="Disabled">
        <ShotItem label="disabled (unchecked)"><Checkbox checked={false} onCheckedChange={() => {}} disabled /></ShotItem>
        <ShotItem label="disabled (checked)"><Checkbox checked onCheckedChange={() => {}} disabled /></ShotItem>
        <ShotItem label="disabled (indeterminate)"><Checkbox checked="indeterminate" onCheckedChange={() => {}} disabled /></ShotItem>
      </Row>
      <Row label="With label">
        <ShotItem label="unchecked"><Checkbox checked={false} onCheckedChange={() => {}} label="Unchecked" /></ShotItem>
        <ShotItem label="checked"><Checkbox checked onCheckedChange={() => {}} label="Checked" /></ShotItem>
        <ShotItem label="indeterminate"><Checkbox checked="indeterminate" onCheckedChange={() => {}} label="Indeterminate" /></ShotItem>
        <ShotItem label="disabled"><Checkbox checked onCheckedChange={() => {}} disabled label="Disabled" /></ShotItem>
      </Row>
    </Shot>
  ),
}
