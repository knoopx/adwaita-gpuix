import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
import { useAdwaita } from '../theme/adwaita'
import { FloatingPanel } from './common'

/* ── Types ────────────────────────────────────────────────────────────── */

export interface HoverCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
}

export interface HoverCardTriggerProps {
  children: ReactNode
  style?: Partial<StyleDesc>
}

export interface HoverCardContentProps {
  children?: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  style?: Partial<StyleDesc>
}

/* ── Context ──────────────────────────────────────────────────────────── */

interface HoverCardContext {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const HoverCardCtx = createContext<HoverCardContext | null>(null)

function useHoverCard(): HoverCardContext {
  const ctx = useContext(HoverCardCtx)
  if (!ctx) throw new Error('HoverCard components must be used within <HoverCard>')
  return ctx
}

/* ── Components ───────────────────────────────────────────────────────── */

export function HoverCard({ open, onOpenChange, children }: HoverCardProps) {
  return <HoverCardCtx.Provider value={{ open, onOpenChange }}>{children}</HoverCardCtx.Provider>
}

export function HoverCardTrigger({ children, style }: HoverCardTriggerProps) {
  const { onOpenChange } = useHoverCard()
  return (
    <div
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
      style={{ cursor: 'pointer', ...style }}
    >
      {children}
    </div>
  )
}

export function HoverCardContent({ children, side = 'bottom', sideOffset = 8, style }: HoverCardContentProps) {
  const { open } = useHoverCard()

  if (!open) return null

  return (
    <FloatingPanel side={side} sideOffset={sideOffset} padding={12} gap={8} minWidth={200} style={style}>
      {children}
    </FloatingPanel>
  )
}

// ── Showcase shot ─────────────────────────────────────────────────────────
import type { ComponentShot } from '../../scripts/shot'
import { T, Row, FloatingStage } from './common'
import { Button } from './Button'
import { Icon } from './icons'

/** A captioned shot item: a small dim caption above the item. */
function HoverCardShotItem({ label, children }: { label: string; children: ReactNode }) {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>{label}</T>
      {children}
    </div>
  )
}

/** A compact open hover card: trigger button + anchored content on a side. */
function SideHoverCard({ side, text }: { side: 'top' | 'right' | 'bottom' | 'left'; text: string }) {
  return (
    <HoverCard open={true} onOpenChange={() => {}}>
      <HoverCardTrigger>
        <Button label={side} onClick={() => {}} />
      </HoverCardTrigger>
      <HoverCardContent side={side}>
        <T size="caption">{text}</T>
      </HoverCardContent>
    </HoverCard>
  )
}

/** The rich hover-card body (icon + title + text). */
function HoverCardRichBody() {
  const t = useAdwaita()
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Icon name="user" size={20} color={t.colors.dim_fg} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <T size="body" weight={600}>Ada Lovelace</T>
        <T size="caption" color={t.colors.dim_fg}>Hover card with icon + title + text.</T>
      </div>
    </div>
  )
}

export const HoverCardShot: ComponentShot = {
  name: 'HoverCard',
  el: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 528 }}>
      <Row label="Closed trigger">
        <HoverCard open={false} onOpenChange={() => {}}>
          <HoverCardTrigger>
            <Button label="Hover" onClick={() => {}} />
          </HoverCardTrigger>
        </HoverCard>
      </Row>
      <Row label="Open · sides (side prop, anchored in a stage)" col>
        <FloatingStage width={480} height={120}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <HoverCardShotItem label="side=top">
              <SideHoverCard side="top" text="Above the trigger" />
            </HoverCardShotItem>
            <HoverCardShotItem label="side=right">
              <SideHoverCard side="right" text="Right of the trigger" />
            </HoverCardShotItem>
            <HoverCardShotItem label="side=bottom">
              <SideHoverCard side="bottom" text="Below the trigger" />
            </HoverCardShotItem>
            <HoverCardShotItem label="side=left">
              <SideHoverCard side="left" text="Left of the trigger" />
            </HoverCardShotItem>
          </div>
        </FloatingStage>
      </Row>
      <Row label="Open · rich content" col>
        <FloatingStage width={480} height={140}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <HoverCard open={true} onOpenChange={() => {}}>
              <HoverCardTrigger>
                <Button label="Hover card" onClick={() => {}} />
              </HoverCardTrigger>
              <HoverCardContent>
                <HoverCardRichBody />
              </HoverCardContent>
            </HoverCard>
          </div>
        </FloatingStage>
      </Row>
    </div>
  ),
}
