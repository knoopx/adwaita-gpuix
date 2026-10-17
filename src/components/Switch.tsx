import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  style?: Partial<StyleDesc>
}

export function Switch({ checked, onChange, disabled, style }: SwitchProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      onClick={disabled ? undefined : () => onChange(!checked)}
      style={{
        width: 44,
        height: 26,
        flexShrink: 0,
        borderRadius: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: checked ? 'flex-end' : 'flex-start',
        padding: 3,
        backgroundColor: checked ? colors.accent : colors.button_active,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: checked ? colors.accent_fg : '#ffffff',
          boxShadow: { offsetX: 0, offsetY: 1, blurRadius: 2, spreadRadius: 0, color: 'rgba(0,0,0,0.25)' },
        }}
      />
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const SwitchShot: ComponentShot = {
  name: 'Switch',
  el: (
    <Shot>
      <Row label="States">
        <ShotItem label="off"><Switch checked={false} onChange={() => {}} /></ShotItem>
        <ShotItem label="on"><Switch checked={true} onChange={() => {}} /></ShotItem>
        <ShotItem label="disabled (off)"><Switch checked={false} disabled onChange={() => {}} /></ShotItem>
        <ShotItem label="disabled (on)"><Switch checked={true} disabled onChange={() => {}} /></ShotItem>
      </Row>
    </Shot>
  ),
}
