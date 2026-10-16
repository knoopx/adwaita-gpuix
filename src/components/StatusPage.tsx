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

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row } from './common'
import { Spinner } from './Spinner'

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

export const StatusPageShot: ComponentShot = {
  name: 'StatusPage',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
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
    </div>
  ),
}
