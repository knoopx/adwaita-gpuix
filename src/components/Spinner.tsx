import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface SpinnerProps {
  size?: 16 | 32 | 64

  label?: boolean
  style?: Partial<StyleDesc>
}

export function Spinner({ size = 32, label = true, style }: SpinnerProps) {
  const t = useAdwaita()
  const { colors } = t
  const r = 45
  const sw = 12
  const circ = 2 * Math.PI * r
  const arc = (circ * 270) / 360
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">` +
    `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${colors.accent}" ` +
    `stroke-width="${sw}" stroke-linecap="round" ` +
    `stroke-dasharray="${arc.toFixed(1)} ${(circ - arc).toFixed(1)}" transform="rotate(-90 50 50)" />` +
    `</svg>`
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...style }}>
      <img src={src} style={{ width: size, height: size, flexShrink: 0 }} />
      {label ? (
        <T size="caption" color={colors.dim_fg} style={{ width: 0, height: 0, opacity: 0 }}>
          Loading
        </T>
      ) : null}
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const SpinnerShot: ComponentShot = {
  name: 'Spinner',
  el: (
    <Shot>
      <Row label="Sizes">
        <ShotItem label="16"><Spinner size={16} /></ShotItem>
        <ShotItem label="32"><Spinner size={32} /></ShotItem>
        <ShotItem label="64"><Spinner size={64} /></ShotItem>
      </Row>
      <Row label="States">
        <ShotItem label="a11y label (visually hidden)"><Spinner size={32} label /></ShotItem>
        <ShotItem label="no label"><Spinner size={32} label={false} /></ShotItem>
      </Row>
    </Shot>
  ),
}
