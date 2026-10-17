import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface HeaderBarProps {

  title?: ReactNode
  left?: ReactNode
  right?: ReactNode
  style?: Partial<StyleDesc>
}

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

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'
import { Button } from './Button'

export const HeaderBarShot: ComponentShot = {
  name: 'HeaderBar',
  el: (
    <Shot>
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
    </Shot>
  ),
}
