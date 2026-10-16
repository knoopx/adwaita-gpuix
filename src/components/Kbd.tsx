import type { ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita, RADIUS, SPACE } from '../theme/adwaita'
import { T } from './common'

export interface KbdProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

/**
 * A single keyboard key, matching the shadcn/ui base `kbd` (style-nova
 * `.cn-kbd`): muted background with no border, 20px tall, 20px min width,
 * 4px horizontal padding, 4px corner radius, 12px medium sans text in the
 * muted foreground.
 *
 * Value mapping (shadcn → adwaita token):
 *   h-5 (20px)          → height: 20
 *   min-w-5 (20px)      → minWidth: 20
 *   w-fit               → width: 'fit-content'
 *   px-1 (4px)          → paddingLeft/Right: SPACE.xs
 *   gap-1 (4px)         → gap: SPACE.xs
 *   rounded-sm (4px)    → borderRadius: RADIUS.xs
 *   bg-muted            → colors.button_bg
 *   text-muted-fg       → colors.dim_fg
 *   font-sans text-xs   → T size="caption" (12px) + theme fontFamily
 *   font-medium (500)   → T weight={500}
 *   select-none         → userSelect: 'none'
 *   pointer-events-none → pointerEvents: 'none'
 *
 * Not expressible in GPUix StyleDesc (intentionally skipped):
 *   - `in-data-[slot=tooltip-content]` context variants
 *   - `[&_svg]:size-3` descendant selector (callers pass sized icons)
 *   - `inline-flex` approximated as `flex` (GPUix display vocabulary)
 */
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

/**
 * A row of keys, matching the shadcn base `kbd-group` (`cn-kbd-group`):
 * inline-flex items-center gap-1 → flex, centered, 4px gap.
 */
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

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
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

export const KbdShot: ComponentShot = {
  name: 'Kbd',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
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
    </div>
  ),
}
