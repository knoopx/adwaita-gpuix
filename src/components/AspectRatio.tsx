import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'

export interface AspectRatioProps {

  ratio: number

  width?: number

  height?: number
  children: ReactNode
  style?: Partial<StyleDesc>
}

export function AspectRatio({ ratio, width, height, children, style }: AspectRatioProps) {
  let w: number | '100%' = '100%'
  let h: number | undefined
  if (width !== undefined && height !== undefined) {
    w = width
    h = height
  } else if (width !== undefined) {
    w = width
    h = Math.round(width / ratio)
  } else if (height !== undefined) {
    w = Math.round(height * ratio)
    h = height
  }
  return (
    <div
      style={{
        width: w,
        height: h,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

import type { ComponentShot } from '../../scripts/shot'
import { buildTheme } from '../theme/adwaita'
import { T, Row, Shot, ShotItem } from './common'

function FillBox({ label, height }: { label: string; height?: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: height ?? '100%',
        backgroundColor: buildTheme('dark', 'blue').colors.accentTint,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <T>{label}</T>
    </div>
  )
}

export const AspectRatioShot: ComponentShot = {
  name: 'AspectRatio',
  el: (
    <Shot>
      <Row label="By width (16:9, width=400)" col>
        <AspectRatio ratio={16 / 9} width={400}>
          <FillBox label="16 : 9" />
        </AspectRatio>
      </Row>
      <Row label="By height · fixed · fills parent" col>
        <ShotItem label="By height (16:9, height=90 → width 160)">
          <AspectRatio ratio={16 / 9} height={90}>
            <FillBox label="16 : 9" />
          </AspectRatio>
        </ShotItem>
        <ShotItem label="Fixed width+height (120×68)">
          <AspectRatio ratio={16 / 9} width={120} height={68}>
            <FillBox label="120×68" />
          </AspectRatio>
        </ShotItem>
        <ShotItem label="Fills parent (width 100%, parent 180px)">
          <div style={{ width: 180 }}>
            <AspectRatio ratio={16 / 9}>
              <FillBox label="16 : 9" height={100} />
            </AspectRatio>
          </div>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
