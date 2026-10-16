import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  style?: Partial<StyleDesc>
}

/** Adwaita pill toggle: accent track when on, white thumb. */
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

export const SwitchShot: ComponentShot = {
  name: 'Switch',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="States">
        <ShotItem label="off"><Switch checked={false} onChange={() => {}} /></ShotItem>
        <ShotItem label="on"><Switch checked={true} onChange={() => {}} /></ShotItem>
        <ShotItem label="disabled (off)"><Switch checked={false} disabled onChange={() => {}} /></ShotItem>
        <ShotItem label="disabled (on)"><Switch checked={true} disabled onChange={() => {}} /></ShotItem>
      </Row>
    </div>
  ),
}
