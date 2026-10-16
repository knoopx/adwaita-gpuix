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

/** Up to two initials from the first words of a name. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters = words.slice(0, 2).map((w) => w[0])
  return letters.join('').toUpperCase() || '?'
}

/**
 * Circular avatar: a photo when `src` is given, otherwise an accent-tinted
 * disc with the name's initials.
 */
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
  /** Optional content (e.g. a 4×4 coloured dot); defaults to a solid disc. */
  children?: ReactNode
  /** Diameter in px (default 12). */
  size?: number
  /** Disc colour (defaults to the theme accent). */
  color?: string
  style?: Partial<StyleDesc>
}

/**
 * A presence/indicator badge for an avatar: a small disc anchored to the
 * bottom-right corner with a 2px `view_bg` ring. Place it inside a
 * `position: 'relative'` wrapper around an `Avatar`:
 *
 * ```
 * <div style={{ position: 'relative' }}>
 *   <Avatar name="Ada" size={40} />
 *   <AvatarBadge />
 * </div>
 * ```
 */
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
  /** Reference avatar size in px (children set their own; this sizes the group height). */
  size?: number
  /** Overlap in px between stacked children (default 8). */
  overlap?: number
  style?: Partial<StyleDesc>
}

/**
 * An overlapping stack of avatars: a flex row where each child is wrapped
 * `position: relative` + `flexShrink: 0` and pulled left by `overlap` (via
 * negative `marginRight`), so the discs stack.
 */
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
  /** The number to show (rendered as `+N`). */
  count: number
  /** Disc diameter in px (default 32). */
  size?: number
  style?: Partial<StyleDesc>
}

/**
 * The "+N" disc at the end of an `AvatarGroup`: a `button_bg` disc with a
 * centred caption.
 */
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

// ── Showcase shot ─────────────────────────────────────────────────────────
import { AVATAR_IMG, type ComponentShot } from '../../scripts/shot'
import { Row } from './common'

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

export const AvatarShot: ComponentShot = {
  name: 'Avatar',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
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
    </div>
  ),
}
