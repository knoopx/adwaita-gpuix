import { Children, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { T } from './common'

export interface AvatarProps {
  name: string
  size?: number
  src?: string
  style?: Partial<StyleDesc>
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters = words.slice(0, 2).map((w) => w[0])
  return letters.join('').toUpperCase() || '?'
}

export function Avatar({ name, size = 32, src, style }: AvatarProps) {
  const t = useAdwaita()
  const { colors } = t
  if (src) {
    return (
      <img
        src={src}
        objectFit="cover"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          flexShrink: 0,
          ...style,
        }}
      />
    )
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.accentTint,
        flexShrink: 0,
        ...style,
      }}
    >
      <T
        weight={700}
        color={colors.accent}
        style={{ fontSize: Math.max(10, Math.round(size * 0.4)) }}
      >
        {initials(name)}
      </T>
    </div>
  )
}

export interface AvatarBadgeProps {

  children?: ReactNode

  size?: number

  color?: string
  style?: Partial<StyleDesc>
}

export function AvatarBadge({ children, size = 12, color, style }: AvatarBadgeProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: colors.view_bg,
        backgroundColor: color ?? colors.accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface AvatarGroupProps {
  children: ReactNode

  size?: number

  overlap?: number
  style?: Partial<StyleDesc>
}

export function AvatarGroup({ children, size = 32, overlap = 8, style }: AvatarGroupProps) {
  const kids = Children.toArray(children)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: size,
        ...style,
      }}
    >
      {kids.map((child, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            flexShrink: 0,
            marginRight: i === kids.length - 1 ? 0 : -overlap,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export interface AvatarGroupCountProps {

  count: number

  size?: number
  style?: Partial<StyleDesc>
}

export function AvatarGroupCount({ count, size = 32, style }: AvatarGroupCountProps) {
  const t = useAdwaita()
  const { colors } = t
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.button_bg,
        borderWidth: 1,
        borderColor: colors.border,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      <T size="caption" color={colors.dim_fg} style={{ fontSize: Math.max(10, Math.round(size * 0.35)) }}>
        {`+${count}`}
      </T>
    </div>
  )
}

import { AVATAR_IMG, type ComponentShot } from '../../scripts/shot'
import { Row, Shot, ShotItem } from './common'

export const AvatarShot: ComponentShot = {
  name: 'Avatar',
  el: (
    <Shot>
      <Row label="Sizes">
        <ShotItem label="24"><Avatar name="Ada Lovelace" size={24} /></ShotItem>
        <ShotItem label="32"><Avatar name="Grace Hopper" size={32} /></ShotItem>
        <ShotItem label="48"><Avatar name="Alan Turing" size={48} /></ShotItem>
        <ShotItem label="64"><Avatar name="Katherine J." size={64} /></ShotItem>
      </Row>
      <Row label="Photo + badge" col>
        <ShotItem label="src (photo)">
          <Avatar name="Photo User" size={48} src={AVATAR_IMG} />
        </ShotItem>
        <ShotItem label="with badge (default)">
          <div style={{ position: 'relative', width: 48, height: 48 }}>
            <Avatar name="Ada Lovelace" size={48} />
            <AvatarBadge />
          </div>
        </ShotItem>
        <ShotItem label="with badge (custom colour)">
          <div style={{ position: 'relative', width: 48, height: 48 }}>
            <Avatar name="Grace Hopper" size={48} />
            <AvatarBadge color="#2ec27e" size={14} />
          </div>
        </ShotItem>
      </Row>
      <Row label="Group" col>
        <ShotItem label="overlap stack + count">
          <AvatarGroup size={32} overlap={8}>
            <Avatar name="Ada Lovelace" size={32} />
            <Avatar name="Alan Turing" size={32} />
            <Avatar name="Grace Hopper" size={32} />
            <AvatarGroupCount count={4} size={32} />
          </AvatarGroup>
        </ShotItem>
      </Row>
    </Shot>
  ),
}
