import { createContext, useContext, type ReactNode } from 'react'
import type { StyleDesc } from '@gpuix/react'
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
