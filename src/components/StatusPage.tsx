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

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'
import { Spinner } from './Spinner'

export const StatusPageShot: ComponentShot = {
  name: 'StatusPage',
  el: (
    <Shot>
      <Row label="Variants" col>
        <ShotItem label="icon + title + description">
          <StatusPage icon="sparkles" title="Nothing here yet" description="Your workspace is empty. Create your first item to get started." />
        </ShotItem>
        <ShotItem label="with content (children)">
          <StatusPage icon="clock" title="Loading" description="Please wait while we fetch your data…">
            <Spinner size={32} />
          </StatusPage>
        </ShotItem>
        <ShotItem label="title only">
          <StatusPage icon="search" title="No results" />
        </ShotItem>
      </Row>
    </Shot>
  ),
}
