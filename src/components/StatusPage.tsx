import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'
import { Icon, type IconName } from './icons'

export interface StatusPageProps {
  icon?: IconName
  title: string
  description?: string
  children?: ReactNode
  style?: Partial<StyleDesc>
}

/** Centred Adwaita status page: icon, title, description, optional content. */
export function StatusPage({ icon = 'sparkles', title, description, children, style }: StatusPageProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 24,
        minHeight: 160,
        ...style,
      }}
    >
      <Icon name={icon} size={40} color={colors.dim_fg} />
      <T size="title2" weight={700} color={colors.fg}>
        {title}
      </T>
      {description ? (
        <T
          size="body"
          color={colors.dim_fg}
          align="center"
          style={{ maxWidth: 320, whiteSpace: 'normal', lineHeight: 20 }}
        >
          {description}
        </T>
      ) : null}
      {children}
    </div>
  )
}
