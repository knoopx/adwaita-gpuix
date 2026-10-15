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
