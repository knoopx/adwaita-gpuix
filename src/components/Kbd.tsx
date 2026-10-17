import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, RADIUS, SPACE } from '../theme/adwaita'
import { T } from './common'

export interface KbdProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function Kbd({ children, style }: KbdProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
        minWidth: 20,
        paddingLeft: SPACE.xs,
        paddingRight: SPACE.xs,
        gap: SPACE.xs,
        borderRadius: RADIUS.xs,
        backgroundColor: colors.button_bg,
        userSelect: 'none',
        pointerEvents: 'none',
        color: colors.dim_fg,
        ...style,
      }}
    >
      <T size="caption" weight={500} color={colors.dim_fg}>
        {children}
      </T>
    </div>
  )
}

export interface KbdGroupProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function KbdGroup({ children, style }: KbdGroupProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACE.xs,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const KbdShot: ComponentShot = {
  name: 'Kbd',
  el: (
    <Shot>
      <Row label="Single key">
        <ShotItem label="⌘"><Kbd>⌘</Kbd></ShotItem>
        <ShotItem label="K"><Kbd>K</Kbd></ShotItem>
        <ShotItem label="Enter"><Kbd>Enter</Kbd></ShotItem>
      </Row>
      <Row label="Groups" col>
        <ShotItem label="two-key combo (KbdGroup)">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </ShotItem>
        <ShotItem label="three-key combo (KbdGroup)">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>Enter</Kbd>
          </KbdGroup>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
