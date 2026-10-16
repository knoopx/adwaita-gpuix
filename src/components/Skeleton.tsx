import type { StyleDesc } from '@gpuix/react'
import { motion } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'

export interface SkeletonProps {
  width?: number
  height?: number
  variant?: 'default' | 'circle'
  style?: Partial<StyleDesc>
}

/**
 * A pulsing rounded placeholder block (loading skeleton).
 * Uses `motion.div` with an opacity animation.
 */
export function Skeleton({ width = 120, height = 16, variant = 'default', style }: SkeletonProps) {
  const t = useAdwaita()
  const { colors, radii } = t

  const isCircle = variant === 'circle'
  const size = isCircle ? (width ?? 16) : undefined

  return (
    <motion.div
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1.6, ease: 'easeInOut' }}
      style={{
        width: isCircle ? size : width,
        height: isCircle ? size : height,
        borderRadius: isCircle ? radii.pill : 4,
        backgroundColor: colors.button_bg,
        ...style,
      }}
    />
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

export const SkeletonShot: ComponentShot = {
  name: 'Skeleton',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Default (rounded blocks)" col>
        <ShotItem label="text line (120×16)">
          <Skeleton width={120} height={16} />
        </ShotItem>
        <ShotItem label="wide block (240×32)">
          <Skeleton width={240} height={32} />
        </ShotItem>
      </Row>
      <Row label="Circle variant">
        <ShotItem label="48px"><Skeleton variant="circle" width={48} /></ShotItem>
        <ShotItem label="32px"><Skeleton variant="circle" width={32} /></ShotItem>
        <ShotItem label="24px"><Skeleton variant="circle" width={24} /></ShotItem>
      </Row>
    </div>
  ),
}
