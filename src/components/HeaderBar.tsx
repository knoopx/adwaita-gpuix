import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface HeaderBarProps {
  /** Centre slot. A string renders as bold title3; a ReactNode (e.g. a ViewSwitcher) is placed as-is. */
  title?: ReactNode
  left?: ReactNode
  right?: ReactNode
  style?: Partial<StyleDesc>
}

/** Flat Adwaita header bar: centred title (string or node) with left/right slots. */
export function HeaderBar({ title, left, right, style }: HeaderBarProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 46,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: colors.headerbar_bg,
        borderBottomWidth: 1,
        borderColor: colors.border,
        ...style,
      }}
    >
      {/* Three equal zones (flex: 1 each) so the centre zone is truly
          centred in the bar regardless of left/right content width. */}
      <div
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 8,
        }}
      >
        {left}
      </div>
      <div
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {typeof title === 'string' ? (
          <T size="title3" weight={700} color={colors.fg}>
            {title}
          </T>
        ) : (
          title
        )}
      </div>
      <div
        style={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: 0,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
        }}
      >
        {right}
      </div>
    </div>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { Row } from './common'
import { Button } from './Button'

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

export const HeaderBarShot: ComponentShot = {
  name: 'HeaderBar',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Title" col>
        <ShotItem label="string title">
          <HeaderBar title="Projects" left={<Button variant="icon" icon="panel" onClick={() => {}} />} right={<Button variant="icon" icon="settings" onClick={() => {}} />} />
        </ShotItem>
        <ShotItem label="node title (rendered as-is)">
          <HeaderBar title={<T size="title3" weight={700}>My node title</T>} />
        </ShotItem>
      </Row>
      <Row label="Slots" col>
        <ShotItem label="left + right slots">
          <HeaderBar title="Projects" left={<Button variant="icon" icon="panel" onClick={() => {}} />} right={<Button variant="icon" icon="settings" onClick={() => {}} />} />
        </ShotItem>
        <ShotItem label="bare (no slots)">
          <HeaderBar title="Projects" />
        </ShotItem>
      </Row>
    </div>
  ),
}
