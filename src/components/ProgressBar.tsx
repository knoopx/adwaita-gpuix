import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'

export interface ProgressBarProps {

  value: number

  percent?: boolean
  height?: number
  style?: Partial<StyleDesc>
}

export function ProgressBar({ value, percent, height = 6, style }: ProgressBarProps) {
  const t = useAdwaita()
  const { colors, radii } = t
  const normalized = percent ? value : value / 100
  const clamped = Math.min(1, Math.max(0, normalized))
  const pill = radii.pill
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height,
        borderRadius: pill,
        backgroundColor: colors.button_active,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: `${Math.round(clamped * 100)}%`,
          height,
          borderRadius: pill,
          backgroundColor: colors.accent,
        }}
      />
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, T, Shot, ShotItem } from './common'

export const ProgressBarShot: ComponentShot = {
  name: 'ProgressBar',
  el: (
    <Shot>
      <Row label="Values (0–100 scale)" col>
        <ShotItem label="0%"><ProgressBar value={0} /></ShotItem>
        <ShotItem label="25%"><ProgressBar value={25} /></ShotItem>
        <ShotItem label="50%"><ProgressBar value={50} /></ShotItem>
        <ShotItem label="75%"><ProgressBar value={75} /></ShotItem>
        <ShotItem label="100%"><ProgressBar value={100} /></ShotItem>
      </Row>
      <Row label="Legacy percent scale (0–1)" col>
        <ShotItem label="percent 0.5"><ProgressBar value={0.5} percent /></ShotItem>
        <ShotItem label="percent 1"><ProgressBar value={1} percent /></ShotItem>
      </Row>
      <Row label="Heights">
        <ShotItem label="6"><ProgressBar value={40} height={6} /></ShotItem>
        <ShotItem label="12"><ProgressBar value={40} height={12} /></ShotItem>
        <ShotItem label="20"><ProgressBar value={40} height={20} /></ShotItem>
      </Row>
    </Shot>
  ),
}
